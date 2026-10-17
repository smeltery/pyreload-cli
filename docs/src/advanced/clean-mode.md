# Clean mode

Use `--clean` (`-c`) to disable Pyreload logs and interactive commands.
Application output remains connected to the terminal.

```bash
pyreload app.py --clean
pyreload app.py --clean --polling
```

## Containers and automation

Clean mode avoids waiting for terminal input. It is useful in containers or
background sessions without stdin. File changes still restart the application.
Use Ctrl+C in an attached terminal to stop.

Clean mode is a development convenience, not a production process supervisor.
