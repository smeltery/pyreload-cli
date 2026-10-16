# Quick start

Create an application and run it under Pyreload.

## Create an application

Save this as `app.py`:

```python
import time

while True:
    print("Hello from Pyreload", flush=True)
    time.sleep(2)
```

## Start watching

```bash
pyreload app.py
```

Edit the printed message and save. Pyreload stops the running process and starts it again.
By default it watches `*.py` recursively from the current directory.

## Control the process

Type `rs` and press Enter to restart manually. Type `stop` and press Enter to stop
both the watcher and application, or use Ctrl+C.

For a mounted folder, use `pyreload app.py --polling`.
See [basic usage](basic-usage.md) for more options.
