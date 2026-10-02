# Cloudflare Pages build failure after the VitePress migration

**Date:** 2026-10-02
**Author:** Masiur (masiur1993@gmail.com) + Claude Opus 5.5
**Status:** Needs the Cloudflare Pages maintainer (dashboard access)

## Summary

The Cloudflare Pages project `fluentboards` failed to build after PR #24 (VuePress 1 → VitePress) was merged
(commit `19e1dc4`). Every earlier commit built successfully. The build log sits behind the Cloudflare dashboard
(SSO), so the exact error was not read; the likely causes below are reproduced locally.

## Likely causes (both are dashboard settings)

1. **Node version pinned to 16.** VuePress 1 (webpack 4) only builds on Node 16, or on newer Node with
   `NODE_OPTIONS=--openssl-legacy-provider`, so the project very likely has `NODE_VERSION=16` (or the
   OpenSSL flag) set. VitePress 1.6 / Vite 5 need Node 18+. Reproduced locally:
   - Node 16.20.2: `TypeError: crypto$2.getRandomValues is not a function` → build fails
   - Node 18 and Node 20: build completes
2. **Build output directory.** The old VuePress output was `src/.vuepress/dist`. VitePress writes to
   `src/.vitepress/dist`. If the dashboard still points at the old path, the build succeeds but the deploy
   step fails with "output directory not found".

## What the repo now does

- `.nvmrc` pins Node 22, and `package.json` declares `"engines": { "node": ">=18" }`.
  Cloudflare Pages uses `.nvmrc` only when no `NODE_VERSION` environment variable is set — a dashboard
  `NODE_VERSION` always wins, so it must be changed or removed there.
- README has a Deployment section with the expected settings.

## Action for the Cloudflare maintainer

In Cloudflare dashboard → Workers & Pages → `fluentboards` → Settings:

| Setting | Set to |
|---|---|
| Build command | `npm run build` |
| Build output directory | `src/.vitepress/dist` |
| Environment variable `NODE_VERSION` | `22` (or delete it so `.nvmrc` is used) — for both Production and Preview |
| Environment variable `NODE_OPTIONS` | delete it if it is `--openssl-legacy-provider` (not needed any more) |

Then **Retry deployment** on the latest `master` build. If it still fails, copy the build log's last ~30
lines into an issue so it can be fixed in the repo.

## After it deploys — quick checks

- `https://developers.fluentboards.com/rest-api/boards` loads.
- An old trailing-slash URL such as `/rest-api/boards/` redirects to `/rest-api/boards`
  (Cloudflare Pages normally does this for `boards.html`; add a `src/public/_redirects` rule if it does not).
- `https://developers.fluentboards.com/sitemap.xml` exists (the old `/sitemaps.xml` is gone — update Search Console).
- Ask Algolia (DocSearch) to recrawl `developers-fluentboards`.
