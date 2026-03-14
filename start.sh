#!/usr/bin/env bash
# ─────────────────────────────────────────────────────────────
# /Users/work/python-local/rapid_urology_triage_website/rapid_urology_clinic/start.sh
# start.sh — One-command launcher for Rapid Urology Toronto
#
# Usage:
#   bash start.sh                  # defaults: port 8080
#   bash start.sh --port 9000      # specific port
#   bash start.sh --host 0.0.0.0   # bind to all interfaces
# ─────────────────────────────────────────────────────────────

set -euo pipefail

# ── Defaults ──────────────────────────────────────────────────
PORT=8080
HOST="127.0.0.1"

# ── Parse arguments ───────────────────────────────────────────
while [[ $# -gt 0 ]]; do
    case "$1" in
        --port)      PORT="$2";      shift 2 ;;
        --host)      HOST="$2";      shift 2 ;;
        --help|-h)
            echo "Usage: bash start.sh [OPTIONS]"
            echo ""
            echo "Options:"
            echo "  --port PORT    Port to listen on (default: 8080, auto-finds next free)"
            echo "  --host HOST    Host to bind to (default: 127.0.0.1)"
            echo "  -h, --help     Show this help"
            exit 0
            ;;
        *) echo "Unknown option: $1"; exit 1 ;;
    esac
done

# ── Find a free port ─────────────────────────────────────────
find_free_port() {
    local port=$1
    local max_tries=20
    for (( i=0; i<max_tries; i++ )); do
        if ! lsof -iTCP:"$port" -sTCP:LISTEN >/dev/null 2>&1; then
            echo "$port"
            return
        fi
        port=$((port + 1))
    done
    echo "ERROR: No free port found in range $1-$port" >&2
    exit 1
}

PORT=$(find_free_port "$PORT")

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# ── Startup banner ───────────────────────────────────────────
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  Rapid Urology Toronto — Dev Server"
echo "  URL:     http://${HOST}:${PORT}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# ── Launch ───────────────────────────────────────────────────
exec python3 -m http.server "$PORT" --bind "$HOST" --directory "$SCRIPT_DIR"
