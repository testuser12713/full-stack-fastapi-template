import http from "node:http"
import net from "node:net"

const mailpitUrl = new URL(process.env.MAILPIT_HOST ?? "http://localhost:8025")
const smtpPort = Number(process.env.SMTP_PORT ?? "1025")
const mailpitPort = Number(mailpitUrl.port || "8025")

const messages = []
let nextId = 1

const smtpServer = net.createServer((socket) => {
  let buffer = ""
  let inData = false
  let data = ""
  let recipients = []

  socket.write("220 localhost ESMTP\r\n")

  socket.on("data", (chunk) => {
    buffer += chunk.toString("utf8")

    let newline = buffer.indexOf("\r\n")
    while (newline >= 0) {
      const line = buffer.slice(0, newline)
      buffer = buffer.slice(newline + 2)

      if (inData) {
        if (line === ".") {
          inData = false
          messages.push({ id: String(nextId++), recipients, data })
          data = ""
          recipients = []
          socket.write("250 OK\r\n")
        } else {
          data += `${line}\r\n`
        }
        newline = buffer.indexOf("\r\n")
        continue
      }

      const command = line.toUpperCase()

      if (command.startsWith("EHLO") || command.startsWith("HELO")) {
        socket.write("250-localhost\r\n250 OK\r\n")
      } else if (command.startsWith("MAIL FROM")) {
        recipients = []
        socket.write("250 OK\r\n")
      } else if (command.startsWith("RCPT TO")) {
        const match = line.match(/<([^>]+)>/)
        if (match?.[1]) {
          recipients.push(match[1])
        }
        socket.write("250 OK\r\n")
      } else if (command.startsWith("DATA")) {
        inData = true
        socket.write("354 End data with <CR><LF>.<CR><LF>\r\n")
      } else if (command.startsWith("RSET")) {
        data = ""
        recipients = []
        inData = false
        socket.write("250 OK\r\n")
      } else if (command.startsWith("NOOP")) {
        socket.write("250 OK\r\n")
      } else if (command.startsWith("STARTTLS")) {
        socket.write("502 Command not implemented\r\n")
      } else if (command.startsWith("QUIT")) {
        socket.write("221 Bye\r\n")
        socket.end()
      } else {
        socket.write("250 OK\r\n")
      }

      newline = buffer.indexOf("\r\n")
    }
  })

  socket.on("error", () => socket.destroy())
})

function htmlOf(message) {
  const parts = []
  const pattern =
    /Content-Transfer-Encoding: base64\r\n\r\n([\s\S]*?)(?:\r\n--|\r\n\r\n|$)/gi
  let match = pattern.exec(message.data)
  while (match) {
    const encoded = match[1].replace(/\r\n/g, "")
    parts.push(Buffer.from(encoded, "base64").toString("utf8"))
    match = pattern.exec(message.data)
  }
  return parts.length > 0 ? parts.join("\n") : message.data
}

const httpServer = http.createServer((request, response) => {
  const url = new URL(request.url ?? "/", "http://localhost")

  if (url.pathname === "/health") {
    response.writeHead(200, { "Content-Type": "text/plain" })
    response.end("ok")
    return
  }

  if (url.pathname === "/api/v1/search") {
    const query = url.searchParams.get("query") ?? ""
    const recipient = query.match(/to:(\S+)/i)?.[1]?.toLowerCase()
    const limit = Number(url.searchParams.get("limit") ?? "1")
    const found = messages
      .filter(
        (message) =>
          recipient !== undefined &&
          message.recipients.some(
            (address) => address.toLowerCase() === recipient,
          ),
      )
      .slice(-limit)
      .reverse()
      .map((message) => ({ ID: message.id }))
    response.writeHead(200, { "Content-Type": "application/json" })
    response.end(JSON.stringify({ messages: found }))
    return
  }

  const view = url.pathname.match(/^\/view\/(.+)\.html$/)
  if (view?.[1]) {
    const message = messages.find((entry) => entry.id === view[1])
    if (!message) {
      response.writeHead(404)
      response.end()
      return
    }
    response.writeHead(200, { "Content-Type": "text/html; charset=utf-8" })
    response.end(htmlOf(message))
    return
  }

  response.writeHead(404)
  response.end()
})

smtpServer.listen(smtpPort, "127.0.0.1")
httpServer.listen(mailpitPort, mailpitUrl.hostname)

function shutdown() {
  smtpServer.close()
  httpServer.close()
  process.exit(0)
}

process.on("SIGINT", shutdown)
process.on("SIGTERM", shutdown)
