# Development

## Reproducible tools

```bash
flox activate
./setup-dev.sh
```

The committed Flox manifest and lockfile provide Python, uv, Bun, Node, and
actionlint on macOS and Linux. Activation adds `.venv/bin` to PATH without
installing dependencies. Setup installs pinned Python tooling and frozen Bun
lockfiles, downloads the Mermaid browser, and installs Git hooks.

## Shared checks

```bash
pre-commit run --all-files
pytest
cd website
bun run build
```

Commit hooks run Ruff lint/format, Markdown lint, Prettier, rendered Mermaid
validation, local Markdown link checks, LOC budgets, actionlint, and TypeScript.
Pre-push hooks additionally run Python tests, the production website build,
browser journeys and accessibility checks, dependency audits, and package validation. CI runs the
same commands plus a cross-platform Python matrix.

## Website

```bash
flox activate --start-services
```

The website service runs on port 3014. Markdown in `docs/src/` is the single
source for the website's documentation. After editing a Mermaid block, run
`bun run diagrams:update` at the repository root and commit the generated SVG
with the Markdown. Builds require the matching source hash, so stale diagrams
fail explicitly. CI renders every diagram; hosting builds need only Bun. `cd website && bun run build` exports
all routes to `website/out/`. `bun run preview` serves that production output.

## Size budgets

Source, documentation, scripts, and workflows have a 350-line file budget and
25-file direct-directory budget. Generated assets, lockfiles, and dependencies
are excluded. Budgets live in `scripts/budgets.json`; do not raise them to hide
new complexity. Split by responsibility and retain test coverage.
