"""Validate repository-relative Markdown links and heading fragments."""

import re
import subprocess
import sys
from pathlib import Path
from urllib.parse import unquote

files = (
    subprocess.check_output(["git", "ls-files", "--cached", "--others", "--exclude-standard", "-z"])
    .decode()
    .split("\0")
)
errors = []
for name in set(files):
    source = Path(name)
    if source.suffix != ".md" or not source.is_file():
        continue
    text = re.sub(r"```.*?```", "", source.read_text(), flags=re.S)
    for target in re.findall(r"\[[^\]]*\]\(([^)]+)\)", text):
        target = unquote(target.split(' "')[0].strip("<>"))
        if re.match(r"[a-z]+:", target):
            continue
        path, _, fragment = target.partition("#")
        destination = source.parent / path if path else source
        if not destination.exists():
            errors.append(f"{source}: missing link {target}")
        elif fragment and destination.suffix == ".md":
            headings = re.findall(r"^#+ (.+)$", destination.read_text(), re.M)
            slugs = [
                re.sub(r"\s+", "-", re.sub(r"[^a-z0-9\s-]", "", heading.lower()))
                for heading in headings
            ]
            if fragment not in slugs:
                errors.append(f"{source}: missing heading {target}")
if errors:
    sys.exit("\n".join(sorted(errors)))
print("Local Markdown links passed")
