<p align="center"><img src="assets/logo.svg" width="64" height="64" alt="Pyreload logo"></p>

# Pyreload

Save your file. Stay in your flow. Pyreload restarts Python applications when
watched files change, with polling support for Docker, Vagrant, and network mounts.

[![CI](https://github.com/smeltery/pyreload-cli/actions/workflows/ci.yml/badge.svg)](https://github.com/smeltery/pyreload-cli/actions/workflows/ci.yml)
[![PyPI](https://img.shields.io/pypi/v/pyreload-cli?logo=pypi&logoColor=white)](https://pypi.org/project/pyreload-cli/)
[![Python](https://img.shields.io/badge/Python-3.8%2B-3776AB?logo=python&logoColor=white)](pyproject.toml)
[![Bun](https://img.shields.io/badge/tooling-Bun-14151a?logo=bun)](package.json)
[![Flox](https://img.shields.io/badge/dev-Flox-526447)](.flox/env/manifest.toml)
[![License](https://img.shields.io/badge/license-PolyForm_Shield-526447)](LICENSE)

[![Pyreload — Save your file. Stay in your flow.](assets/og-image.png)](https://smeltery.github.io/pyreload-cli/)

```bash
pip install pyreload-cli
pyreload app.py
pyreload app.py --polling  # For mounted filesystems
```

Watch selected patterns, ignore generated files, share JSON configuration, or run
shell commands with `--exec`. Type `rs` to restart or `stop` to exit.

[Website](https://smeltery.github.io/pyreload-cli/) ·
[Documentation](docs/README.md) ·
[CLI reference](docs/src/api/cli-reference.md) ·
[Contributing](CONTRIBUTING.md)

For development, run `flox activate` then `./setup-dev.sh`.
See [development](docs/src/development.md) and [releases](docs/src/releasing.md).
