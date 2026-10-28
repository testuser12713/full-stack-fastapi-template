import http from "node:http"
import net from "node:net"

const SMTP_PORT = Number(process.env.MAILPIT_SMTP_PORT ?? 1025)
const HTTP_PORT = Number(process.env.MAILPIT_HTTP_PORT ?? 8025)

/** @type {{ id: string, recipients: string[], raw: string }[]} */
const messages = []
let nextId = 1

function extractAddress(command) {
  const angled = command.match(/<([^>]+)>/)
  if (angled) return angled[1].trim().toLowerCase()
  const parts = command.trim().split(/\s+/)
  return (parts[parts.length - 1] ?? "").replace(/[<>]/g, "").toLowerCase()
}

function decodePart(body, encoding) {
  const enc = (encoding ?? "").toLowerCase()
  if (enc === "base64") {
    return Buffer.from(body.replace(/\s+/g, ""), "base64").toString("utf8")
  }
  if (enc === "quoted-printable") {
    return body
      .replace(/=\r?\n/g, "")
      .replace(/=([0-9A-Fa-f]{2})/g, (_, hex) =>
        String.fromCharCode(Number.parseInt(hex, 16)),
      )
  }
  return body
}

function parsePart(raw) {
  const crlfIndex = raw.indexOf("\r\n\r\n")
  const lfIndex = raw.indexOf("\n\n")
  const separatorIndex =
    crlfIndex >= 0 && (lfIndex < 0 || crlfIndex < lfIndex) ? crlfIndex : lfIndex
  const separatorLength = separatorIndex === crlfIndex ? 4 : 2
  if (separatorIndex < 0) return raw

  const headerBlock = raw.slice(0, separatorIndex)
  const body = raw.slice(separatorIndex + separatorLength)

  const headers = {}
  let lastHeader = ""
  for (const line of headerBlock.split(/\r?\n/)) {
    const match = line.match(/^([^:]+):\s*(.*)$/)
    if (match) {
      lastHeader = match[1].toLowerCase()
      headers[lastHeader] = match[2]
    } else if (lastHeader && /^\s/.test(line)) {
      headers[lastHeader] += ` ${line.trim()}`
    }
  }

  const contentType = headers["content-type"] ?? "text/plain"
  const boundaryMatch = contentType.match(/boundary="?([^";]+)"?/i)

  if (/^multipart\//i.test(contentType) && boundaryMatch) {
    const boundary = `--${boundaryMatch[1]}`
    const decodedParts = []
    for (const part of body.split(boundary)) {
      const trimmed = part.replace(/^\r?\n/, "").replace(/\r?\n$/, "")
      if (!trimmed || trimmed === "--") continue
      decodedParts.push(parsePart(trimmed))
    }
    return decodedParts.join("\n")
  }

  const transferEncoding = (
    headers["content-transfer-encoding"] ?? ""
  ).toLowerCase()
  return decodePart(body, transferEncoding)
}

function collectText(raw) {
  const parsed = parsePart(raw)
  if (parsed && parsed !== raw) {
    return parsed
  }

  const text = [raw]
  const blocks = raw.match(/(?:[A-Za-z0-9+/]{20,}={0,2}\r?\n?)+/g) ?? []
  for (const block of blocks) {
    text.push(decodePart(block, "base64"))
  }
  const quotedPrintable = raw.match(
    /Content-Transfer-Encoding: quoted-printable[\s\S]*?\r?\n\r?\n([\s\S]*?)(?:\r?\n--|$)/i,
  )
  if (quotedPrintable) {
    text.push(decodePart(quotedPrintable[1], "quoted-printable"))
  }
  return text.join("\n")
}

function searchMessages(query) {
  const toFilter = /^to:(.+)$/i
    .exec(query ?? "")?.[1]
    ?.trim()
    .toLowerCase()
  if (!toFilter) {
    return messages
  }
  return messages.filter((message) =>
    message.recipients.some(
      (recipient) => recipient.toLowerCase() === toFilter,
    ),
  )
}

const httpServer = http.createServer((request, response) => {
  const url = new URL(request.url ?? "/", `http://localhost:${HTTP_PORT}`)

  if (url.pathname === "/api/v1/messages") {
    response.writeHead(200, { "Content-Type": "application/json" })
    response.end(JSON.stringify({ total: messages.length, messages: [] }))
    return
  }

  if (url.pathname === "/api/v1/search") {
    const limit = Number(url.searchParams.get("limit") ?? "50")
    const found = searchMessages(url.searchParams.get("query") ?? "")
      .slice()
      .reverse()
      .slice(0, Number.isFinite(limit) ? limit : 50)
      .map((message) => ({ ID: message.id }))
    response.writeHead(200, { "Content-Type": "application/json" })
    response.end(JSON.stringify({ messages: found }))
    return
  }

  const viewMatch = /^\/view\/([^/]+)\.html$/.exec(url.pathname)
  if (viewMatch) {
    const message = messages.find((entry) => entry.id === viewMatch[1])
    if (!message) {
      response.writeHead(404, { "Content-Type": "text/plain" })
      response.end("Not found")
      return
    }
    response.writeHead(200, { "Content-Type": "text/html; charset=utf-8" })
    response.end(collectText(message.raw))
    return
  }

  response.writeHead(404, { "Content-Type": "text/plain" })
  response.end("Not found")
})

function undot(raw) {
  return raw
    .split(/\r?\n/)
    .map((line) => (line.startsWith("..") ? line.slice(1) : line))
    .join("\r\n")
}

function storeMessage(envelope, raw) {
  messages.push({
    id: String(nextId++),
    recipients: [...envelope.to],
    raw: undot(raw),
  })
}

const smtpServer = net.createServer((socket) => {
  let buffer = ""
  let inData = false
  let envelope = { from: "", to: [] }

  socket.write("220 mailpit ESMTP\r\n")

  const processBuffer = () => {
    while (true) {
      if (inData) {
        if (buffer.startsWith(".\r\n") || buffer.startsWith(".\n")) {
          const terminatorLength = buffer.startsWith(".\r\n") ? 3 : 2
          buffer = buffer.slice(terminatorLength)
          inData = false
          storeMessage(envelope, "")
          envelope = { from: "", to: [] }
          socket.write("250 OK\r\n")
          continue
        }

        let terminatorIndex = buffer.indexOf("\r\n.\r\n")
        let terminatorLength = 5
        if (terminatorIndex < 0) {
          terminatorIndex = buffer.indexOf("\n.\n")
          terminatorLength = 3
        }
        if (terminatorIndex < 0) return
        const raw = buffer.slice(0, terminatorIndex)
        buffer = buffer.slice(terminatorIndex + terminatorLength)
        inData = false
        storeMessage(envelope, raw)
        envelope = { from: "", to: [] }
        socket.write("250 OK\r\n")
        continue
      }

      let lineEnd = buffer.indexOf("\r\n")
      let lineLength = 2
      if (lineEnd < 0) {
        lineEnd = buffer.indexOf("\n")
        lineLength = 1
      }
      if (lineEnd < 0) return

      const line = buffer.slice(0, lineEnd)
      buffer = buffer.slice(lineEnd + lineLength)
      const verb = (line.split(" ")[0] ?? "").toUpperCase()

      switch (verb) {
        case "EHLO":
        case "HELO":
          socket.write("250-localhost\r\n250 SIZE 10485760\r\n")
          break
        case "MAIL":
          envelope.from = extractAddress(line)
          socket.write("250 OK\r\n")
          break
        case "RCPT":
          envelope.to.push(extractAddress(line))
          socket.write("250 OK\r\n")
          break
        case "DATA":
          inData = true
          socket.write("354 End data with <CR><LF>.<CR><LF>\r\n")
          break
        case "RSET":
          envelope = { from: "", to: [] }
          socket.write("250 OK\r\n")
          break
        case "QUIT":
          socket.write("221 Bye\r\n")
          socket.end()
          return
        default:
          socket.write("250 OK\r\n")
      }
    }
  }

  socket.on("data", (chunk) => {
    buffer += chunk.toString("utf8")
    processBuffer()
  })
  socket.on("error", () => socket.destroy())
})

httpServer.listen(HTTP_PORT, () => {
  console.log(`mailpit stub HTTP listening on ${HTTP_PORT}`)
})

smtpServer.listen(SMTP_PORT, () => {
  console.log(`mailpit stub SMTP listening on ${SMTP_PORT}`)
})
