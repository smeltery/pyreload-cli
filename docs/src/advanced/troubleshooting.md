# Troubleshooting

## Changes do not restart the app

1. Run from the expected working directory.
2. Check startup output for missing watch directories.
3. Quote wildcard patterns and use `--debug` to inspect detected events.
4. Check ignore patterns and the first config file in the current directory.
5. Try `--polling` for mounted or network filesystems.

## The app keeps restarting

Exclude logs, generated files, and caches. Native observers can emit several
events per save; Pyreload does not debounce them. Watch only source directories.

## Imports fail

Install Pyreload into the same virtual environment as your application.
Script mode uses Pyreload's interpreter. Exec mode uses your shell's PATH.

## The process exits in a container

Use `--clean` without stdin, or allocate an interactive terminal with Docker's
`-it`. See [Docker development](../use-cases/docker.md).

## An old child process remains

Exec mode controls only the immediate shell process, not detached descendants.
Prefer direct script mode where possible and use a development command that
cleans up its children.

## Report an issue

Include your OS, Python and Pyreload versions, command, redacted config, and
whether the files are local or mounted in a [GitHub issue](https://github.com/smeltery/pyreload-cli/issues).
