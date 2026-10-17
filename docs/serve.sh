#!/usr/bin/env sh
set -eu
cd "$(dirname "$0")/../website"
exec bun run dev
