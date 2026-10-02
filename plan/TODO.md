# TODO — VitePress migration + code sync

Updated each iteration. Original plan: `vitepress-migration-and-sync.md`. Log: `progress.md`.
Writers follow `rest-style-guide.md`. Inventories: `inventory-rest-api.md`, `inventory-hooks.md`, `inventory-data-layer.md`.

## Phase 1 — VitePress migration ✅
- [x] Branch, package.json, config + sidebars, theme, assets, markdown fixes, home, build, browser check
- [x] Commit e1b79b7

## Phase 2 — Inventory ✅
- [x] REST: 265 live routes; 105 correct, 152 missing, 8 wrong, 67 stale doc entries
- [x] Hooks: 90 actions + 50 filters; 27 correct, 10 wrong, 1 stale, 104 missing; 5 FluentCRM partials
- [x] Data layer: 13 tables, 22 models (9 undocumented), 19 global functions (12 undocumented), CLI/modules/getting-started are FluentCRM or wrong

## Phase 3 — REST API sync ✅ (commit 9460465)
- [x] boards.md, activities.md, public-boards.md (new)
- [x] tasks.md (+dependencies, recurring), subtasks.md, comments.md, attachments.md, dashboard.md (new)
- [x] stages, labels, custom-fields, templates, folders, time-tracking, roadmaps, notifications
- [x] users, permissions (Managers & Roles), webhooks, reports, ai (new), import-export, cloud-storage, admin, settings (delete), index, authentication, extend
- [x] Sidebar: regrouped (Boards/Tasks/People/Platform), added ai, dashboard, public-boards; settings dropped

## Phase 4 — Hooks sync ✅ (commit 8cd8e91)
- [x] actions + filters rewritten from code (8 pages); FluentCRM partials deleted
- [x] Sidebar: Action Hooks / Filter Hooks groups with sub-pages

## Phase 5 — Data layer sync ✅ (commit a9c90ca)
- [x] database/index.md all 13 tables; models fixed + 8 new model pages; _parts deleted
- [x] global functions + FluentBoardsApi methods; helpers; CLI rewrite; modules rewrite; getting started fixes
- [x] Sidebar/nav: new model pages, CLI in nav, Modules overview + Navigation

## Phase 6 — Final pass ✅
- [x] Integrate: sidebars/nav, build green, dead links (+ raw-HTML link/anchor checker: 0 bad)
- [x] Home page accuracy (links, capabilities)
- [x] Cross-check pages against code (audit-1: 73 claims, 2 fixed; audit-2: 77 claims, 10 fixed)
- [x] Browser check light/dark + mobile
- [x] README (VitePress); plugin CLAUDE.md/AGENTS.md don't mention dev-docs build → no change
- [x] Final report in progress.md; plugin-code bugs in plugin-code-findings.md

## Follow-ups (owner decisions, not done)
- [x] PR #24 merged; PR #25 (Node pin) open
- [ ] Bump dev-docs submodule pointer in fluent-boards
- [ ] Cloudflare maintainer: apply `cloudflare-pages-build.md` (Node, output dir), then sitemap URL + Algolia recrawl
- [ ] Triage `fluent-boards/docs/reports/docs-sync-code-findings.md` (start with S items)
- [ ] Optional: OpenAPI try-it playground like FluentCRM
