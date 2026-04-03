#!/bin/sh

set -eu

MODE="${APP_MODE:-development}"
TARGET_DIR="${RUNTIME_CONFIG_DIR:-/runtime}"

/opt/docker/generate-runtime-config.sh "$TARGET_DIR"

if [ "$MODE" = "production" ]; then
    exec /docker-entrypoint.sh "$@"
fi

exec "$@"
