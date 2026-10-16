"""Enforce source/documentation size and direct-directory budgets."""

import json
import subprocess
import sys
from collections import Counter
from pathlib import Path

config = json.loads(Path(sys.argv[1] if len(sys.argv) > 1 else "scripts/budgets.json").read_text())
paths = (
    subprocess.check_output(["git", "ls-files", "--cached", "--others", "--exclude-standard", "-z"])
    .decode()
    .split("\0")
)
counts = Counter()
errors = []
for name in sorted(set(paths)):
    path = Path(name)
    if not path.is_file() or path.suffix not in {
        ".py",
        ".ts",
        ".tsx",
        ".js",
        ".mjs",
        ".css",
        ".md",
        ".yml",
        ".yaml",
        ".sh",
        ".toml",
    }:
        continue
    if name.endswith("lock.yaml") or name.startswith(".flox/"):
        continue
    counts[str(path.parent)] += 1
    lines = len(path.read_text().splitlines())
    limit = config["files"].get(name, config["default_lines"])
    if lines > limit:
        errors.append(f"{name}: {lines} lines > budget {limit}")
for directory, count in counts.items():
    limit = config["directories"].get(directory, config["default_files"])
    if count > limit:
        errors.append(f"{directory}: {count} files > budget {limit}")
if errors:
    sys.exit("\n".join(errors))
print("File and directory budgets passed")
