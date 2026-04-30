# /update-next-docs

Regenerate the Next.js 16 documentation index in `apps/web/AGENTS.md`.

Run this whenever you upgrade Next.js or need fresh API docs.

## Steps

1. **Run the codemod from `apps/web`**
   ```bash
   cd apps/web && npx @next/codemod@canary agents-md --output AGENTS.md
   ```

2. **Commit if changed**
   ```bash
   git diff --stat apps/web/AGENTS.md
   # If changed:
   git add apps/web/AGENTS.md
   git commit -m "chore(web): update Next.js AGENTS.md docs index"
   ```

## When to run

- After `next` version bump in `apps/web/package.json`
- When Next.js APIs referenced in code don't match `.next-docs/` content
- Before starting a feature that touches routing, caching, or metadata APIs
