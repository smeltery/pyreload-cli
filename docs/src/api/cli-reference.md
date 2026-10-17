# CLI reference

Run a Python script or a quoted shell command whenever watched files change.

## Syntax

```text
pyreload [options] command
```

`command` is required except when requesting help or version. In script mode it
is a Python script path; arguments to the application require exec mode.

## Options

| Option                   | Default | Behavior                                            |
| ------------------------ | ------- | --------------------------------------------------- |
| `-w`, `--watch PATTERN`  | `*.py`  | Repeat to select watch roots and patterns           |
| `-i`, `--ignore PATTERN` | None    | Repeat to ignore matching event paths               |
| `-p`, `--polling`        | Off     | Use a polling observer for mounted filesystems      |
| `-d`, `--debug`          | Off     | Log detected file changes                           |
| `-c`, `--clean`          | Off     | Hide Pyreload logs and disable interactive commands |
| `-x`, `--exec`           | Off     | Run the command through the platform shell          |
| `-V`, `--version`        | —       | Print version and exit                              |
| `-h`, `--help`           | —       | Print help and exit                                 |

## Examples

```bash
pyreload app.py -w 'src/*.py' -i '*__pycache__*'
pyreload app.py --polling --clean
pyreload -x 'python -m http.server 8000' -w '*.html'
```

## Interactive input

`rs` restarts; `stop` shuts down. Both require Enter and are unavailable in clean mode.
See [configuration precedence](../user-guide/config-files.md).
