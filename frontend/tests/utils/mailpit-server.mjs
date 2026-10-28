import http from "node:http"
import net from "node:net"

const SMTP_PORT = Number(process.env.MAILPIT_SMTP_PORT ?? 1025)
const HTTP_PORT = Number(process.env.MAILPIT_HTTP_PORT ?? 8025)

/** @type {{ id: string, recipients: string[], raw: string }[]} */
const messages = []
let nextId = 1

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

function collectText(raw) {
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
      .slice(0, limit)
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

const smtpServer = net.createServer((socket) => {
  let buffer = ""
  let state = "command"
  let recipients = []
  let dataLines = []

  socket.write("220 mailpit ESMTP\r\n")

  const finishMessage = () => {
    messages.push({
      id: String(nextId++),
      recipients: [...recipients],
      raw: dataLines.join("\r\n"),
    })
    recipients = []
    dataLines = []
    state = "command"
    socket.write("250 OK\r\n")
  }

  const handleLine = (line) => {
    if (state === "data") {
      if (line === ".") {
        finishMessage()
      } else {
        dataLines.push(line.startsWith("..") ? line.slice(1) : line)
      }
      return
    }

    const upper = line.toUpperCase()
    if (upper.startsWith("EHLO")) {
      socket.write("250-mailpit\r\n250 HELP\r\n")
    } else if (upper.startsWith("HELO")) {
      socket.write("250 mailpit\r\n")
    } else if (upper.startsWith("MAIL FROM:")) {
      socket.write("250 OK\r\n")
    } else if (upper.startsWith("RCPT TO:")) {
      const recipient = /<([^>]+)>/.exec(line)?.[1]
      if (recipient) {
        recipients.push(recipient)
      }
      socket.write("250 OK\r\n")
    } else if (upper === "DATA") {
      state = "data"
      dataLines = []
      socket.write("354 End data with <CR><LF>.<CR><LF>\r\n")
    } else if (upper === "RSET") {
      recipients = []
      dataLines = []
      state = "command"
      socket.write("250 OK\r\n")
    } else if (upper === "QUIT") {
      socket.write("221 Bye\r\n")
      socket.end()
    } else {
      socket.write("250 OK\r\n")
    }
  }

  socket.on("data", (chunk) => {
    buffer += chunk.toString("utf8")
    let index = buffer.indexOf("\n")
    while (index !== -1) {
      const line = buffer.slice(0, index).replace(/\r$/, "")
      buffer = buffer.slice(index + 1)
      handleLine(line)
      index = buffer.indexOf("\n")
    }
  })

  socket.on("error", () => socket.destroy())
})

httpServer.listen(HTTP_PORT, () => {
  console.log(`mailpit stub HTTP listening on ${HTTP_PORT}`)
})

smtpServer.listen(SMTP_PORT, () => {
  console.log(`mailpit stub SMTP listening on ${SMTP_PORT}`)
})
