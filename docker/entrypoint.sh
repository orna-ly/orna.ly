#!/usr/bin/env bash
set -euo pipefail

if [ "${SKIP_MIGRATIONS:-0}" != "1" ]; then
  echo "Applying database migrations..."
  bunx prisma migrate deploy
else
  echo "Skipping database migrations because SKIP_MIGRATIONS=1"
fi

echo "Starting application with: $@"
exec "$@"
