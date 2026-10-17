"""Set both distribution and CLI versions in an isolated release checkout."""

import re
import sys
from pathlib import Path

if len(sys.argv) != 2 or not re.fullmatch(r"v[0-9]+\.[0-9]+\.[0-9]+", sys.argv[1]):
    sys.exit("Expected vMAJOR.MINOR.PATCH")
version = sys.argv[1][1:]
for filename, pattern, replacement in [
    ("pyproject.toml", r'^version = "[^"]+"$', f'version = "{version}"'),
    ("pyreload/__init__.py", r'^__version__ = "[^"]+"$', f'__version__ = "{version}"'),
]:
    path = Path(filename)
    text, count = re.subn(pattern, replacement, path.read_text(), flags=re.M)
    if count != 1:
        sys.exit(f"Expected exactly one version in {filename}, found {count}")
    path.write_text(text)
