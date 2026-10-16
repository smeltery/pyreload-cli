# Ignore patterns

Repeat `--ignore` (`-i`) to exclude files from restarts.

```bash
pyreload app.py -i '*__pycache__*' -i '*.pyc' -i '*/.venv/*'
```

Patterns are matched against event paths. Include wildcards around directory
names when the path may include a parent directory. Directory events are ignored.

## Debug matching

```bash
pyreload app.py --debug -i '*.log'
```

A generated file that matches a watch pattern can cause repeated restarts.
Write generated output outside watched roots or explicitly ignore it.

Store shared exclusions in a [configuration file](config-files.md).
