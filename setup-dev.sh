#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")"
uv venv --python python3.12 --allow-existing .venv
uv pip sync --python .venv/bin/python requirements-dev.lock
uv pip install --python .venv/bin/python --no-deps -e .
PUPPETEER_SKIP_DOWNLOAD=1 bun install --frozen-lockfile
(cd website && bun install --frozen-lockfile)
bunx playwright install chromium
.venv/bin/pre-commit install --install-hooks
.venv/bin/pre-commit install --hook-type pre-push
printf '\nReady. Run pre-commit run --all-files, then pytest.\n'
