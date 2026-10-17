# Watch patterns

The default `*.py` pattern watches recursively from your current directory.
Repeat `--watch` (`-w`) to include several patterns.

## Select files

```bash
pyreload app.py -w '*.py' -w '*.yaml'
pyreload app.py -w 'src/*.py'
```

The directory before the first wildcard selects the observer's root. Pyreload
watches that root recursively. Without a wildcard, the value is treated as a
directory; use `-w 'src/*.py'` rather than passing a single filename.

## Select directories

```bash
pyreload app.py -w src -w config
```

A directory argument matches all files beneath it. Missing directories are logged
and skipped, so check startup output if a path is not being watched.

## Avoid restart loops

Exclude generated files, logs, caches, and virtual environments with
[ignore patterns](ignore-patterns.md). Prefer explicit roots over watching an entire monorepo.
