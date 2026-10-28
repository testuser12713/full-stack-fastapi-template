import { spawn } from "node:child_process"
import path from "node:path"
import { fileURLToPath } from "node:url"

const here = path.dirname(fileURLToPath(import.meta.url))
const backendDir = path.resolve(here, "../../backend")
const python = process.env.PYTHON ?? "python3"
const apiUrl = new URL(process.env.VITE_API_URL ?? "http://localhost:8000")

function runScript(args) {
  return new Promise((resolve, reject) => {
    const child = spawn(python, args, {
      cwd: backendDir,
      env: process.env,
      stdio: "inherit",
    })
    child.on("error", reject)
    child.on("exit", (code) => {
      if (code === 0) {
        resolve()
      } else {
        reject(
          new Error(`${python} ${args.join(" ")} exited with code ${code}`),
        )
      }
    })
  })
}

await runScript([
  "-c",
  "from sqlmodel import SQLModel; from app.core.db import engine; SQLModel.metadata.create_all(engine)",
])
await runScript(["-m", "app.initial_data"])

const server = spawn(
  python,
  [
    "-m",
    "uvicorn",
    "app.main:app",
    "--host",
    apiUrl.hostname,
    "--port",
    apiUrl.port || "8000",
  ],
  {
    cwd: backendDir,
    env: process.env,
    stdio: "inherit",
  },
)

const stop = (signal) => () => {
  if (!server.killed) {
    server.kill(signal)
  }
}

process.on("SIGINT", stop("SIGINT"))
process.on("SIGTERM", stop("SIGTERM"))
server.on("exit", (code) => process.exit(code ?? 0))
