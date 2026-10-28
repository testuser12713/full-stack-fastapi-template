#!/usr/bin/env bash
set -euo pipefail

PORT="${1:-8000}"
cd "$(dirname "$0")/../../backend"

find_python() {
  local candidate
  for candidate in "${VIRTUAL_ENV:-}/bin/python" "../.venv/bin/python" "python3" "python"; do
    if [ -n "$candidate" ] && command -v "$candidate" >/dev/null 2>&1; then
      if "$candidate" -c "import fastapi, sqlmodel, uvicorn" >/dev/null 2>&1; then
        printf '%s' "$candidate"
        return 0
      fi
    fi
  done
  return 1
}

if PYTHON_BIN=$(find_python); then
  exec "$PYTHON_BIN" -m uvicorn app.main:app --host 127.0.0.1 --port "$PORT"
fi

if command -v uv >/dev/null 2>&1; then
  exec uv run python -m uvicorn app.main:app --host 127.0.0.1 --port "$PORT"
fi

echo "No Python interpreter with the backend dependencies was found." >&2
exit 1
