# Vagrant development

Use polling when source code lives in a synced folder.

## Run inside the guest

```bash
vagrant ssh
cd /vagrant
python3 -m venv .venv
source .venv/bin/activate
pip install pyreload-cli
pyreload app.py --polling -i '*/.venv/*'
```

Install your application dependencies in the guest environment. Edit the source
on your host and verify a restart in the guest terminal.

## Narrow the watch root

For larger projects use `-w 'src/*.py'` so the polling observer does not scan
unrelated synced files. See [watch patterns](../user-guide/watch-patterns.md).
