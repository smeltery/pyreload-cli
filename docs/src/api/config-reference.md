# Configuration reference

Use a JSON object in `.pyreloadrc` or `pyreload.json` in the working directory.

## Keys

| Key       | Type             | Default    | Purpose                                   |
| --------- | ---------------- | ---------- | ----------------------------------------- |
| `watch`   | Array of strings | `["*.py"]` | Watch roots and patterns                  |
| `ignore`  | Array of strings | `[]`       | Excluded event paths                      |
| `polling` | Boolean          | `false`    | Use polling instead of native events      |
| `debug`   | Boolean          | `false`    | Show detected file changes                |
| `clean`   | Boolean          | `false`    | Hide watcher logs and disable commands    |
| `exec`    | Boolean          | `false`    | Execute the positional command in a shell |

## Minimal example

```json
{
  "watch": ["src/*.py"],
  "ignore": ["*__pycache__*"],
  "polling": true
}
```

There is no command key, polling-interval key, or debounce option. Unknown keys
are unused. Values are not schema-validated; use the types above.
See [file selection and precedence](../user-guide/config-files.md).
