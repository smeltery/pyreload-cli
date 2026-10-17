# Interactive commands

In normal mode, Pyreload reads commands from standard input.

| Command           | Result                                      |
| ----------------- | ------------------------------------------- |
| `rs` then Enter   | Stop the current process and start it again |
| `stop` then Enter | Stop the process and filesystem observers   |
| Ctrl+C            | Stop monitoring and the application         |

Other input is ignored. Commands are case-sensitive.

## Non-interactive sessions

Use `--clean` when no interactive terminal is available. It disables input
handling and Pyreload logs while continuing to watch for changes.

Use `stop` or Ctrl+C for shutdown. Do not rely on EOF/Ctrl+D for process cleanup.
See [clean mode](../advanced/clean-mode.md).
