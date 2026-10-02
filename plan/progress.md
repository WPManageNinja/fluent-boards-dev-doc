# Progress Log — VitePress migration + code sync

Newest entries at the bottom. Original plan: `vitepress-migration-and-sync.md` (frozen). Checklist: `TODO.md`.

## Iteration 1 — 2026-10-02 — Phase 1 done (commit e1b79b7, branch `vitepress-migration`)

- VuePress 1.9 → VitePress 1.6.4. `npm run build` passes with dead-link checking on.
- Config, sidebars, `ExplainBlock` (Vue 3 `<script setup>`), theme CSS (stylus → CSS, dark mode added).
- REST sidebar now lists all 21 resource pages (was 9).
- Removed: VuePress `Layout.vue`/`Footer.vue` overrides (default layout covers them), hand-written
  `sitemap*.xml` (VitePress generates `sitemap.xml`), `modules/trigger.md` (pure FluentCRM content, not in sidebar),
  missing `schema-design.png` reference.
- Fixed: `manifest.json` said FluentCRM; `$withBase(...)` links on model pages; home links with trailing slashes.
- Verified in browser: home, filters page, ExplainBlock expand, chat widget loads.

### Deployment notes (flag to owner)
- Build output moved: `src/.vuepress/dist` → `src/.vitepress/dist`. Deploy config must change.
- `cleanUrls: true`: pages are `/rest-api/boards` (VuePress served `/rest-api/boards/` via clean-urls plugin).
  Host must serve `boards.html` for `/rest-api/boards`; old trailing-slash URLs need a redirect rule.
- Sitemap index URL changed: `/sitemaps.xml` → `/sitemap.xml` (update Search Console).
- Algolia index will need a recrawl for the new URLs/markup.

## Iteration 2 — 2026-10-02 — Phase 2 inventories done, Phases 3–5 dispatched

- Inventories written: `inventory-rest-api.md`, `inventory-hooks.md`, `inventory-data-layer.md`.
- Headline gaps: 152 undocumented REST routes; 8 REST pages were invented placeholders (activities, admin,
  cloud-storage, import-export, notifications, permissions, reports, settings); 104 undocumented hooks;
  9 undocumented models; `getInstance()` in global-function examples does not exist; CLI/modules pages were FluentCRM.
- Plugin-code issues found (not docs; report to plugin owners, do not fix here):
  - Pro `app/Http/Routes/api.php` lines ~88–95: 7 `time-tracks` routes point to a non-existent controller.
  - Free `api.php`: `GET /global-search` registered twice (BoardUserPolicy + UserPolicy).
  - Six UserController methods documented in old users.md are no longer routed.
  - Hooks: `task_attachment_deleted` passes 1 or 2 args depending on caller; pro repeat-task fires
    `task_due_date_changed` with the new start date as "old due date"; `board_admin_removed` fires for non-admins;
    `ajax_options_task_assignees` filter unreachable.
- Dispatched 7 writer agents with disjoint file ownership (REST ×4, hooks, DB/models, functions/helpers/CLI/modules/getting-started).
  Shared rules in `rest-style-guide.md`. I own `.vitepress/**`, builds and commits.
