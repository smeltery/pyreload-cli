# Pyreload website

Next.js static site with documentation sourced directly from `../docs/src/`.

```bash
bun install --frozen-lockfile
bun run dev
bun run build
bun run preview
```

Development and production previews use port 3014. Set `SITE_URL` at build time
for a custom domain; GitHub Pages uses the repository path automatically in CI.
See the [development guide](../docs/src/development.md).
