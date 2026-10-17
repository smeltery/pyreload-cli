#!/usr/bin/env bash
set -euo pipefail
python -m build
twine check dist/*
