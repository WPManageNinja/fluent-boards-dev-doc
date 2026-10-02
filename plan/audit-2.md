# Audit 2: REST API pages (users, permissions, webhooks, reports, ai, import-export, cloud-storage, admin, index, authentication, extend, shared/*)

Date: 2026-10-02. Independent check of the rewritten pages against free (`app/Http/Routes/api.php`, policies, controllers, services, `vendor/wpfluent/framework`), Pro (`app/Http/Routes/api.php`, controllers, handlers) and Fluent Roadmap boot code.

| Claim | File | Result |
|---|---|---|
| Board member routes (`users`, `add-members`, `user/{id}/remove`, `assignees`) exist with listed methods | users.md | OK |
| Pro role routes `make-manager`, `remove-manager`, `make-member`, `make-viewer` are POST | users.md | OK |
| Pro invitation routes (`send-invitation` POST, `all-invitations` GET, `invitation/{id}` DELETE) | users.md | OK |
| `member/{id}/*` routes and `member-associated-users/{id}` | users.md | OK |
| Board role settings (`is_admin`, `is_viewer_only`) per role | users.md | OK (`makeMember` writes `is_viewer_only: false`) |
| `GET users` returns `users` + `global_admins` (filled only for admins), sorted by display_name | users.md | OK |
| Add member: `memberId`, `isViewerOnly=yes`, 404 / 409 `User already a member` | users.md | OK |
| Remove member: self-removal allowed, managers for others, global admin for admin targets | users.md | OK (`SingleBoardPolicy::removeUserFromBoard`) |
| Assignees = board members assigned to any task, wrapped in `data` | users.md | OK |
| Role changes: manager required, global admin for admin targets | users.md | OK (`canManageBoardUser`) |
| Invitation expires after 48h, filter `fluent_boards/invite_expiry_seconds` | users.md | OK |
| "Already a wordpress member" error status | users.md | FIXED: was "returns an error"; status is 422 (controller asks 304, framework maps <400 to 422) |
| Invitations stored in `fbs_metas`, key `board_email_invitation`, value keys | users.md | OK |
| Member tasks: `taskType` values, default = watched without due date, per_page 1-50, invalid sort → 404 | users.md | OK |
| Member activities: 40 per page, `activities` + `pagination` | users.md | OK |
| Member stats keys, `unread_notifications` only for self/admin | users.md | OK |
| Display name ≤250 chars, own profile only; photo JPG/PNG/GIF/WebP ≤2MB, 4096px | users.md | OK |
| `/managers` routes under AdminPolicy, verbs and paths | permissions.md | OK |
| `GET /managers` user shape (`boards[].role` admin/member/viewer, `is_super`) | permissions.md | OK |
| Add/remove admins messages and skip of unknown IDs | permissions.md | OK |
| Sync roles: new boards added as member only; WP/FB admins rejected | permissions.md | OK |
| `POST /managers` broken (controller needs `$userId` not in path) | permissions.md | OK (UNSURE on exact failure mode, but call cannot succeed) |
| Webhook routes under WebhookPolicy (admin only) | webhooks.md | OK |
| Incoming webhook URL `?fbs=1&route=task&hash={uuid}`, `fields` list from `Task::mappableFields()` | webhooks.md | OK |
| Create incoming: missing fields → 422 plain string | webhooks.md | OK |
| Outgoing: create ignores `method`/`format`, update stores full body, relations rebuilt | webhooks.md | OK |
| Outgoing events list (11 slugs) | webhooks.md | OK (matches `OutWebhookHandler`) |
| Outgoing POST payload `message` example | webhooks.md | FIXED: real format is `'Jane Smith' has created task 'Write release notes'` |
| GET webhook sends `event`, `task_id`, `timestamp` | webhooks.md | OK |
| Report routes under BoardUserPolicy; roadmap/timesheet 403 `This is a pro feature` without Pro | reports.md | OK |
| Default range 6 days before today; invalid board → empty report | reports.md | OK |
| "Every report response has one top-level key `report`" | reports.md | FIXED: timesheet returns `message` + `timings`; scoped sentence to the four reports |
| Roadmap `bySource` shown as `[]` | reports.md | FIXED: always three buckets (`page`, `web`, `other`) with `colorKey` |
| Roadmap range limit 366 days, start>end → 400 | reports.md | OK |
| Activity `byType` keys/labels/icons | reports.md | OK |
| Timesheet export via admin-ajax `fluent_boards_export_timesheet` | reports.md | OK |
| AI routes and AiPolicy (`generate` = any board access, rest admin) | ai.md | OK |
| AI providers, `openai` alias, model lists, masked key `****`+4 | ai.md | OK |
| Generate limits 12,000 / 2,000 chars, valid actions | ai.md | OK |
| `ai-assist` summarize = read (viewers allowed), 30 comments | ai.md | OK |
| Apply suggestions: 422 `Nothing to apply.` / invalid priority, 404 task | ai.md | OK |
| Free import routes under `/fluent-boards-import/*`, Pro un-prefixed import routes (AdminPolicy) | import-export.md | OK |
| 64 MB limit, filter `fluent_boards/import_max_file_size` | import-export.md | OK |
| Process JSON import page 1 behaviour | import-export.md | FIXED: page 1 also imports the first batch of 200 |
| Trello status polling end states | import-export.md | FIXED: terminal states are `completed` or `failed` |
| CSV import 100 rows/page, board naming | import-export.md | FIXED: new board is named `{board_title} (imported)` |
| CSV `fields` / `columns` keys and header auto-map | import-export.md | OK |
| Exports: `fluent_boards_export_json/csv` POST + `wp_rest` nonce + board manager; `X-FBS-Export-Task-Count` | import-export.md | OK |
| `fluentAddonVars.ajaxurl` and `.rest.nonce` exist in example JS | import-export.md | OK |
| Storage routes `/admin/storage-settings` (Pro, AdminPolicy), driver required fields | cloud-storage.md | OK |
| Keys masked as `FBS_ENCRYPTED_DATA_KEY`; `regions`; `is_defined` with wp-config constants | cloud-storage.md | OK |
| Connection-test failure message | cloud-storage.md | FIXED: operator-precedence bug drops the prefix; message is the service error text |
| Admin routes (feature-modules, general-settings, pages, mcp/*) and Pro `/license` | admin.md | OK |
| Save modules / general settings need Pro (422) | admin.md | OK |
| `FLUENT_BOARDS_SLUG` handling | admin.md | FIXED: constant always overrides the slug, not a fallback |
| install-plugin accepted slugs + `install_plugins` capability | admin.md | OK |
| MCP status keys, toggle values, config-snippet clients and fallback | admin.md | OK |
| License response fields, `masked_license_key` alias, `connection_error` | admin.md | OK |
| Resources table links all exist in `src/rest-api` | index.md | OK (24 resource pages, all present) |
| `GET /projects/{id}/labels` → `{"labels": [...]}`; `boards` paginator in `GET /projects` | index.md | OK |
| `rest_forbidden` 401/403 on policy failure; validation 422 shape | index.md, shared/error-responses.md | OK |
| sendError maps codes <400 to 422; `plugin_exception` body; ModelNotFound message | shared/error-responses.md | OK |
| `incorrect_password` 401 text for bad application passwords | shared/error-responses.md | OK |
| Application Passwords need HTTPS or local env; spaces optional | authentication.md | OK |
| Cookie auth needs `X-WP-Nonce` (`wp_rest`), otherwise logged out | authentication.md | OK |
| `board_counts` keys `all`, `pinned`, `archived` | authentication.md | OK |
| `fluent_boards_loaded` fired on `plugins_loaded` with `$app` | extend.md | OK (`boot/app.php`) |
| `$app->router` available; routes registered on `rest_api_init` in `fluent-boards/v2` | extend.md | OK |
| Pro time-tracking routes added on the same hook; Pro/Roadmap use `namespace()->group()` | extend.md | OK |
| Router methods `get/post/put/patch/delete/any/prefix/namespace/withPolicy/group` | extend.md | OK |
| Constraint helpers `int/alpha/alphaNum/alphaNumDash/where` | extend.md | OK |
| `sendSuccess($data)` takes no status; `$this->response->sendSuccess($data, $code)`; `send()` | extend.md | OK |
| Route without policy is public (`defaultPolicyHandler` returns true) | extend.md | OK |
| Policy method named like controller method overrides `verifyRequest` | extend.md | OK (`parsePolicyHandler` falls back to `verifyRequest`) |
| Reusing core policies is safe for any method name | extend.md | FIXED: added note that `AuthPolicy::create()`, `SingleBoardPolicy::delete()` etc. take over for same-named methods |
| Example controller/policy code would run | extend.md | OK |
| Base endpoint, content types, Pro/Roadmap badge notes | shared/*.md | OK |

## Counts

- Claims checked: 77
- OK: 67
- FIXED: 10
- UNSURE: 1 (counted under OK: exact error returned by the broken `POST /managers`)
