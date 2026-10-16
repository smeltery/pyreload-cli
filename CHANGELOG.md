# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.3] - 2026-01-10

### Changed

- Updated README.md documentation

## [1.0.2] - 2026-01-10

### Changed

- Updated author email address in package metadata

## [1.0.1] - 2026-01-10

### Fixed

- Fixed og-image.svg display on PyPI by using GitHub raw URL
- Consolidated shared assets to single `assets/` directory
- Added build-time asset copying for docs and website deployments

## [1.0.0] - 2026-01-10

### Added

- Initial release of Pyreload
- Automatic file watching and process restarting
- Polling mode support for mounted filesystems (Docker, Vagrant, CIFS/NFS)
- Flexible watch and ignore patterns with glob support
- Configuration file support (`.pyreloadrc` and `pyreload.json`)
- Clean mode for quiet operation
- Exec mode for running shell commands
- Debug mode for verbose file change logging
- Interactive commands (`rs` for manual restart, `stop` to exit)
- Comprehensive test suite with pytest
- Full documentation with MkDocs
- Marketing website with Next.js

### Features

- `--polling` / `-p` flag for polling-based file watching
- `--watch` / `-w` flag for specifying watch patterns
- `--ignore` / `-i` flag for specifying ignore patterns
- `--debug` / `-d` flag for debug logging
- `--clean` / `-c` flag for clean mode
- `--exec` / `-x` flag for executing shell commands
- Config file support with CLI precedence
- Cross-platform support (Linux, macOS, Windows)
- Python 3.8+ support

### Documentation

- Complete user guide
- Docker and Vagrant usage examples
- Kubernetes operator development workflow
- API reference
- Troubleshooting guide

[1.0.0]: https://github.com/dotbrains/pyreload-cli/releases/tag/v1.0.0
