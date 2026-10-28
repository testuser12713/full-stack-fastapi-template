import { randomUUID } from "node:crypto"
import http from "node:http"

import { simpleParser } from "mailparser"
import { SMTPServer } from "smtp-server"

const smtpPort = Number(process.env.FAKE_MAILPIT_SMTP_PORT ?? 1025)
const httpPort = Number(process.env.FAKE_MAILPIT_HTTP_PORT ?? 8025)
const messages = []

const smtp = new SMTPServer({
  authOptional: true,
  disabledCommands: ["STARTTLS"],
  onData(stream, _session, callback) {
    const chunks = []
    stream.on("data", (chunk) => chunks.push(chunk))
    stream.on("end", async () => {
      try {
        const parsed = await simpleParser(Buffer.concat(chunks))
        const recipients = (parsed.to?.value ?? [])
          .map((address) => address.address?.toLowerCase())
          .filter(Boolean)
        messages.push({
          id: randomUUID(),
          recipients,
          html: typeof parsed.html === "string" ? parsed.html : "",
        })
      } catch (error) {
        console.error("fake-mailpit: could not parse message", error)
      }
      callback()
    })
  },
})

const server = http.createServer((request, response) => {
  const url = new URL(request.url ?? "/", `http://${request.headers.host}`)

  if (url.pathname === "/api/v1/search") {
    const limit = Number(url.searchParams.get("limit") ?? "1")
    const query = url.searchParams.get("query") ?? ""
    const match = /(?:^|\s)to:(\S+)/i.exec(query)
    const email = match?.[1]?.toLowerCase()
    const found = (
      email ? messages.filter((m) => m.recipients.includes(email)) : messages
    ).slice(0, limit)
    response.writeHead(200, { "Content-Type": "application/json" })
    response.end(JSON.stringify({ messages: found.map((m) => ({ ID: m.id })) }))
    return
  }

  const view = /^\/view\/([^/]+)\.html$/.exec(url.pathname)
  if (view) {
    const message = messages.find((m) => m.id === view[1])
    if (!message) {
      response.writeHead(404)
      response.end("not found")
      return
    }
    response.writeHead(200, { "Content-Type": "text/html" })
    response.end(message.html)
    return
  }

  response.writeHead(404)
  response.end("not found")
})

smtp.listen(smtpPort, () => {
  server.listen(httpPort, () => {
    console.log(`fake-mailpit: smtp on ${smtpPort}, http on ${httpPort}`)
  })
})

for (const signal of ["SIGINT", "SIGTERM"]) {
  process.on(signal, () => {
    smtp.close()
    server.close()
    process.exit(0)
  })
}
