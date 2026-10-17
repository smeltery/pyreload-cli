# Basic usage

Run Pyreload from the directory you want to watch.

## Python scripts

```bash
pyreload app.py
pyreload app.py -w 'src/*.py' -w 'config/*.yaml'
pyreload app.py -i '*__pycache__*' -i '*.log'
```

Quote patterns so the shell does not expand them before Pyreload sees them.
Providing `-w` replaces the default `*.py` pattern.

## Shell commands

```bash
pyreload -x 'python -m http.server 8000' -w '*.html'
```

Use [exec mode](../advanced/exec-mode.md) for command arguments, modules, and other runtimes.

## Output

Use `--debug` for detected event details or `--clean` to hide Pyreload logs and
interactive commands. The application's own output remains visible.
