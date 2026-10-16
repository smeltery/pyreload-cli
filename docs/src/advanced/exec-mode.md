# Exec mode

Use `--exec` (`-x`) to run a shell command instead of a Python script.

```bash
pyreload -x 'python -m http.server 8000' -w '*.html'
pyreload -x 'python app.py --port 8000'
pyreload -x 'bun run server.ts' -w '*.ts'
```

## Command handling

The entire command must be one quoted argument. It is passed to the platform's
shell, so quoting and shell features differ between Windows and Unix.
Only run commands you trust. Watch patterns do not change automatically for other languages.

## Process lifecycle

Pyreload terminates and waits for its immediate child on restart. It does not
manage a full process tree. Shell commands that spawn detached children may
need their own cleanup strategy.
