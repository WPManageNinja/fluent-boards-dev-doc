# Dev Docs: VitePress Migration + Code Sync — Original Plan

**Date:** 2026-10-02
**Author:** Masiur (masiur1993@gmail.com) + Claude Opus 5.5
**Status:** Original plan (frozen — progress lives in `TODO.md` and `progress.md`)

## Summary

Move the Fluent Boards developer docs from VuePress 1 to VitePress (the stack FluentCRM, FluentCart,
FluentCommunity, FluentBooking and FluentSupport docs already use), then bring the content in line with
the current Fluent Boards free + Pro code. Many features (subtasks, comments, attachments, and others)
are missing, stale, or unreachable from the sidebar.

## Context

- VuePress 1 is Vue 2 + webpack 4 and unmaintained. FluentCRM moved its dev docs to VitePress
  (`FluentCRM/fluent-crm-developers-docs`, 2026-03-06, "V3 docs").
- This repo (`WPManageNinja/fluent-boards-dev-doc`) is a submodule of `fluent-boards` at `dev-docs/`.
- Pages exist for subtasks/comments/attachments/etc. in `src/rest-api/`, but the sidebar only links
  9 of ~25 REST pages. Hook and DB pages contain FluentCRM copy-paste leftovers.

## Phases

### Phase 1 — VitePress migration (no content changes)
- `package.json`: drop vuepress + plugins; add `vitepress ^1.6.4`; `"type": "module"`; scripts dev/build/preview on `src`.
- `src/.vuepress/` → `src/.vitepress/`:
  - `config.js` (ESM, `defineConfig`): title, description, head (favicon, manifest, fonts, Algolia
    verification, DocAI chat widget), nav, sidebars, Algolia DocSearch (`search.provider: 'algolia'`),
    `editLink`, `lastUpdated`, `cleanUrls`, `sitemap`, `markdown.lineNumbers`, `ignoreDeadLinks: false`.
  - `sidebars/*.js` → ESM with VitePress `{ text, link, items, collapsed }` shape.
  - `theme/index.js` extends DefaultTheme, registers `ExplainBlock` (Vue 3 port).
  - `theme/custom.css` + `vars.css`: port `index.styl`/`palette.styl` (brand `#673ab7`, Nunito, home hero, cards, tables, hook blocks).
  - Drop `layout/Layout.vue`, `layout/Footer.vue`, `enhanceApp.js` (default VitePress layout covers it).
  - `public/` moves to `src/public/` (VitePress srcDir public).
- Markdown fixes: VuePress-only syntax (`[[toc]]`, `!!!include()!!!`, `<Badge text>`, `sidebar: false`, home `pageClass`), relative links that VitePress treats as dead.
- Home page: keep custom hero as `layout: page` (or VitePress `home` layout).
- Verify: `npm run build` passes with dead-link checking; `npm run dev` renders home, a REST page, hooks page.
- Remove stale `.vitepress/dist` stub at repo root; `.gitignore` VitePress cache/dist.

### Phase 2 — Inventory (code vs docs)
Background research writes:
- `plan/inventory-rest-api.md` — every free + Pro route vs `src/rest-api/*`.
- `plan/inventory-hooks.md` — every `fluent_boards/*` action/filter vs `src/hooks/*`.
- `plan/inventory-data-layer.md` — tables, models, global functions, helpers, CLI, modules vs docs.

### Phase 3 — REST API sync
- Sidebar exposes every REST page.
- Fix wrong/stale endpoints; add missing ones (subtasks, comments, attachments, and every other gap the inventory finds). Mark Pro routes with a Pro badge.

### Phase 4 — Hooks sync
- Rewrite actions/filters pages from the code inventory: every hook, args, source file, Pro badge.
- Remove FluentCRM leftovers.

### Phase 5 — Data layer sync
- DB schema: every free + Pro table and column.
- Models: add missing model pages, fix relations/methods.
- Global functions, helpers, CLI, modules: fix to match code.

### Phase 6 — Final pass
- Getting-started + home page accuracy, nav covers every section (CLI etc.).
- README (VitePress instructions), parent plugin `CLAUDE.md`/`.claude/CLAUDE.md` note if build commands changed.
- Full build, dead-link check, report `plan/progress.md` → final status.

## Out of scope (for now)
- OpenAPI-generated REST reference / try-it playground (FluentCRM has one; possible follow-up).
- Deployment pipeline changes (host builds from `master`; output dir changes to `src/.vitepress/dist`, flag to user).

## Verification
- `npm run build` green (VitePress fails on dead links).
- Spot-check rendered pages in the browser pane.
- Each inventory gap is either fixed or listed as intentionally skipped in `progress.md`.

## Rollback
All work is on a branch in the docs repo; revert the branch to return to VuePress.
