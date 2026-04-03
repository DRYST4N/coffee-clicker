#!/bin/sh

set -eu

TARGET_DIR="${1:-/usr/share/nginx/html}"

escape_js() {
    printf '%s' "$1" | sed 's/\\/\\\\/g; s/"/\\"/g'
}

SUPABASE_URL_VALUE="$(escape_js "${SUPABASE_URL:-}")"
SUPABASE_KEY_VALUE="$(escape_js "${SUPABASE_KEY:-}")"

mkdir -p "$TARGET_DIR"

cat > "$TARGET_DIR/env.js" <<EOF
window.__APP_CONFIG__ = Object.freeze({
  SUPABASE_URL: "${SUPABASE_URL_VALUE}",
  SUPABASE_KEY: "${SUPABASE_KEY_VALUE}"
});
EOF
