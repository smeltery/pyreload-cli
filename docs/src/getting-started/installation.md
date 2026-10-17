# Installation

Pyreload requires Python 3.8 or newer. Python 3.12 is used by the development environment.

## Install with pip

```bash
python -m pip install pyreload-cli
pyreload --version
```

Use a virtual environment if your system Python is externally managed:

```bash
python -m venv .venv
source .venv/bin/activate
python -m pip install pyreload-cli
```

On Windows, activate with `.venv\Scripts\activate` instead.

## Install with pipx

```bash
pipx install pyreload-cli
```

Pyreload runs scripts with the interpreter that runs Pyreload. Install it into your
application's virtual environment when the application needs that environment's dependencies.

## Develop with Flox

Clone the repository, run `flox activate`, then `./setup-dev.sh`.
See [development](../development.md) for the complete workflow.

Continue with the [quick start](quick-start.md).
