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

## Iteration 3 — 2026-10-02 — Phases 4 + 5 committed, Phase 3 mostly done

- Hooks (8cd8e91): 140 public hooks across actions/{boards,tasks,comments,app} and filters/{data,ui,integrations};
  one more wrong entry found beyond the inventory (`comment_updated` arg 2 is old text).
- Data layer (a9c90ca): 13 tables, 22 models (8 new pages), 19 global functions, 28 PHP API methods, CLI and
  modules rewritten; `getInstance()` removed; Str::orderedUuid / preg_replace_array removed.
- REST: 3 of 4 writers done (boards/activities/public-boards; tasks/subtasks/comments/attachments/dashboard;
  stages/labels/custom-fields/templates/folders/time-tracking/roadmaps/notifications). Waiting on users/admin/misc.
- Build green with dead-link checks.
- Plugin-code issues are collected in `plugin-code-findings.md` (≈70 items, several security-relevant — see the
  S entries, especially the fluent-roadmap unauthenticated comment delete).

## Iteration 4 — 2026-10-02 — Phase 3 committed (9460465), audits running

- REST writer D done: users, Managers & Roles, webhooks, reports, AI (new), import/export, cloud storage, admin,
  index, authentication, extend, shared partials; `settings.md` deleted (content in admin.md).
- Build green; raw-HTML link + anchor checker (scratch script over `dist/`) reports 0 broken links.
- Browser: hooks blocks expand with markdown rendered; dark mode + 375px mobile, no horizontal overflow.
- Two independent auditors verifying sampled claims against code (`audit-1.md`, `audit-2.md`), fixing confirmed errors.
- `plugin-code-findings.md` now ~90 items.

## Iteration 5 — 2026-10-02 — Audits done, final pass — COMPLETE

- audit-1 (hooks, data layer, REST A–C): 73 claims incl. full scripted sweeps — all 191 in-scope endpoints match
  routes, 472 internal links/anchors resolve, all 140 hooks have call sites with matching accepted-args,
  every documented model/global/helper method exists. 2 errors fixed (board color example, repeat_task meta table).
- audit-2 (REST D pages): 77 claims, 10 fixed (status codes, payload text, report shapes, import behavior,
  storage error text, slug constant, policy-name collision warning in extend.md).
- Final: `npm run build` green (dead-link check on), raw-HTML link checker 0 broken.

### Final state
- Branch `vitepress-migration` in `WPManageNinja/fluent-boards-dev-doc` (not pushed; parent plugin submodule pointer not bumped).
- Coverage: 265/265 live REST routes; 140/140 public hooks; 13/13 tables; 22/22 models; all global functions + PHP API methods.
- Open for owners: deployment notes (Iteration 1), `plugin-code-findings.md` (~90 code issues, several security-relevant).

## Iteration 6 — 2026-10-02 — Cloudflare build failure, findings moved

- PR #24 merged; Cloudflare Pages build failed. Logs are behind SSO. Reproduced: Node 16 → `crypto$2.getRandomValues is not a function`; Node 18/20 build fine.
  PR #25 pins Node 22 (`.nvmrc`, `engines`) and documents the dashboard changes in `cloudflare-pages-build.md`.
- `plugin-code-findings.md` moved to the core repo: `fluent-boards/docs/reports/docs-sync-code-findings.md`.
