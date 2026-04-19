# /deploy

Deploy House Scout to Vercel.

## Usage
```
/deploy [preview|prod]
```

## Steps

1. **Type check first**
   ```bash
   pnpm tsc --noEmit
   ```
   Fix any errors before deploying.

2. **Lint**
   ```bash
   pnpm lint
   ```

3. **Build locally** (catches runtime errors tsc misses)
   ```bash
   pnpm build
   ```

4. **Deploy**
   ```bash
   # Preview (default — safe)
   vercel

   # Production (confirm with user before running)
   vercel --prod
   ```

5. **Post-deploy**: Check Vercel dashboard for:
   - Build logs for warnings
   - Function logs for runtime errors
   - Core Web Vitals (LCP, CLS, FID) — warm/photography-first design is LCP-sensitive

## Environment variables

If adding new env vars:
```bash
vercel env add MY_VAR          # add to Vercel
vercel env pull .env.local     # sync locally
```

**Never commit `.env.local`** — it's in `.gitignore`.

## Rollback

```bash
vercel rollback [deployment-url]
```
