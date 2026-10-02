# Hook Inventory: Fluent Boards (Free + Pro) vs Developer Docs

Date: 2026-10-02 · Status: research inventory (read-only; no code changed)

Scope:
- Free: `fluent-boards/` (excluding `vendor/`, `node_modules/`, `dev-docs/`, `assets/`)
- Pro: `fluent-boards-pro/` (excluding `vendor/`, `node_modules/`)
- Docs: `dev-docs/src/hooks/actions/index.md`, `dev-docs/src/hooks/filters/index.md`, `dev-docs/src/hooks/filters/_*.md`

Method: grep for `do_action`, `apply_filters`, `do_action_ref_array`, `->doAction`, `->applyFilters`, `doCustomAction`, `applyCustomFilters`, plus multi-line calls, `as_enqueue_async_action` / `as_schedule_*` / `wp_schedule_single_event`. Every match was checked in context for its arguments.

Notes on the framework helpers:
- `doCustomAction()` / `applyCustomFilters()` exist only in Pro `app/Core/Application.php:223,243`. **They are never called** in either plugin. Pro's `hook_prefix` is `fluent_boards_pro` (`fluent-boards-pro/config/app.php:10`), so if anyone ever uses them, the hooks would get a `fluent_boards_pro…` prefix and not `fluent_boards/`.
- Free `$app->addCustomAction()` / `addCustomFilter()` only **register** listeners (prefix `fluent_boards/`). They never fire hooks.
- No `do_action_ref_array` / `apply_filters_ref_array` exists anywhere.
- Line numbers below are relative to each plugin's root.

## Summary counts

| Metric | Count |
|---|---|
| Distinct public **action** hooks fired (free + pro, incl. 2 non-namespaced) | 90 |
| Distinct public **filter** hooks applied (free + pro, incl. 1 non-namespaced + 1 dynamic family) | 50 |
| Action/filter call sites (non-commented) | ~190 |
| Internal Action Scheduler / cron hooks (not public API) | 27 concrete names |
| Hooks documented (Boards-specific, actions page) | 22 unique (23 entries; `task_deleted` twice) |
| Hooks documented (Boards-specific, filters page) | 16 |
| Documented & correct (some incomplete) | 27 (18 actions page + 9 filters page) |
| Documented but wrong (type, args or signature) | 10 (4 actions page: `board_find`, `board_stages_reordered`, `board_member_added`, `stage_updated`; 6 filters page: `before_create_board`, `before_task_create`, `incoming_webhook_data`, `webhook_task_data`, `task_priorities`, `board_menu_items`) |
| Documented but not in code (stale) | 1 (`fluent_boards/task_tabs`) |
| Public hooks missing from docs | 104 (69 actions + 35 filters) |
| FluentCRM (non-Boards) hook entries in docs partials | 28 (in 5 files) |

---

## 1. Action hooks (code inventory)

Legend: **F** = free, **P** = pro. "Doc" column: ✔ documented correctly, ✖ documented wrongly, — not documented.

### 1.1 Board / stage / label / member

| Hook | Args (name: type) | Call sites | Src | Doc |
|---|---|---|---|---|
| `fluent_boards/board_created` | `$board`: Board model | F `app/Http/Controllers/BoardController.php:306,386`; F `app/Api/Classes/Boards.php:119`; F `app/Modules/MCP/Tools/BoardTools.php:167`; P `app/Http/Controllers/CsvController.php:256`; P `app/Http/Controllers/ProBoardController.php:47`; P `app/Services/AsanaImporter.php:213` | F+P | ✔ |
| `fluent_boards/board_updated` | `$board`: Board, `$oldBoard`: Board (clone before fill) | F `BoardController.php:612` | F | ✔ |
| `fluent_boards/before_board_deleted` | `$board`: Board, `$options`: null | F `app/Services/BoardService.php:40` | F | — |
| `fluent_boards/board_archived` | `$board`: Board | F `BoardService.php:1313` | F | — |
| `fluent_boards/board_restored` | `$board`: Board | F `BoardService.php:1323` | F | — |
| `fluent_boards/board_background_updated` | `$boardId`: int, `$oldBackground`: array\|null | F `BoardController.php:1427`; F `BoardService.php:564,599` | F | — |
| `fluent_boards/board_stage_added` | `$board`: Board, `$stage`: Stage | F `BoardController.php:1144`; F `app/Modules/MCP/Tools/StageTools.php:60` | F | — |
| `fluent_boards/board_stages_reordered` | `$boardId`: int, `$stageIds`: **varies**. `BoardService` passes `$oldList` (Collection of stage IDs in the **previous** order, from `pluck()`). `StageController` passes `[$stage_id]` (only the dragged stage) | F `BoardService.php:297`; F `app/Http/Controllers/StageController.php:83` | F | ✖ (see §4) |
| `fluent_boards/stage_updated` | `$boardId`: int, `$updatedStage`: **array** (`['title','cover_bg']` or the raw request array), `$stageBefore`: Stage (clone) | F `app/Services/StageService.php:92,699` | F | ✖ |
| `fluent_boards/stage_archived` (legacy, comment says "Old hook") | `$boardId`: int, `$stage`: Stage | F `BoardService.php:332` | F | ✔ (does not say legacy) |
| `fluent_boards/stage_archived_with_tasks` (new) | `$boardId`: int, `$stage`: Stage | F `BoardService.php:333` | F | — |
| `fluent_boards/board_stage_restored` (legacy) | `$boardId`: int, `$stageTitle`: string | F `BoardService.php:351` | F | — |
| `fluent_boards/stage_restored_with_tasks` (new) | `$boardId`: int, `$stage`: Stage | F `BoardService.php:352` | F | — |
| `fluent_boards/tasks_moved_between_stages` | `$boardId`: int, `$sourceStage`: Stage, `$targetStage`: Stage, `$count`: int | F `StageService.php:544` (multi-line) | F | — |
| `fluent_boards/default_assignees_updated` | `$stage`: Stage, `$assignees`: int[] | F `StageService.php:712` | F | — |
| `fluent_boards/default_watchers_updated` | `$stage`: Stage, `$watchers`: int[] | F `StageService.php:727` | F | — |
| `fluent_boards/board_label_created` | `$label`: Label | F `app/Http/Controllers/LabelController.php:63`; F `app/Modules/MCP/Tools/LabelTools.php:92` | F | ✔ |
| `fluent_boards/board_label_updated` | `$label`: Label | F `LabelController.php:159`; F `LabelTools.php:84` | F | ✔ |
| `fluent_boards/board_label_deleted` | `$label`: Label (already deleted) | F `app/Services/LabelService.php:132` | F | ✔ |
| `fluent_boards/board_member_added` | `$boardId`: int, `$member`: **User model** (`BoardService.php:421,521,1263`) **or Relation model** (`BoardService.php:1340`, `makeMember`) | F `BoardService.php:421,521,1263,1340` | F | ✖ (inconsistent 2nd arg) |
| `fluent_boards/board_viewer_added` | `$boardId`: int, `$member`: User **or** Relation (`BoardService.php:1359`) | F `BoardService.php:423,519,1261,1359` | F | — |
| `fluent_boards/board_admin_added` | `$boardId`: int, `$userId`: int | F `BoardService.php:439,513,1267`; P `app/Http/Controllers/BoardUserController.php:178` (dynamic, see §1.6) | F+P | — |
| `fluent_boards/board_admin_removed` | `$boardId`: int, `$userId`: int | F `BoardService.php:457,515`; P `BoardUserController.php:178` (dynamic) | F+P | — |
| `fluent_boards/contact_added_to_board` | `$board`: Board, `$contactId`: int (FluentCRM subscriber ID) | F `BoardService.php:884` | F | — |
| `fluent_boards/send_invitation` | `$boardId`: int, `$email`: string, `$inviterUserId`: int, `$role`: string | F `BoardService.php:935` | F | — |
| `fluent_boards/board_created_from_template` | `$board`: Board, `$templateType`: string (`'user'`/default), `$templateId`: int\|string | P `app/Http/Controllers/TemplateController.php:136`; P `app/Services/Integrations/FluentCRM/CreateBoardFromTemplateAction.php:191` | P | — |
| `fluent_boards/board_created_from_automation` | `$board`: Board, `$subscriber`: FluentCRM Subscriber, `$funnelSubscriberId`: int | P `CreateBoardFromTemplateAction.php:192` | P | — |
| `fluent_boards/board_converted_to_template` | `$board`: Board | P `TemplateController.php:168` | P | — |
| `fluent_boards/template_converted_to_board` | `$board`: Board | P `TemplateController.php:191` | P | — |

### 1.2 Task

| Hook | Args | Call sites | Src | Doc |
|---|---|---|---|---|
| `fluent_boards/task_created` | `$task`: Task (fires from the model `created` event, **only for top-level tasks**: skipped when `parent_id` is set or `Task::$skipTaskCreatedEvent`) | F `app/Models/Task.php:94` | F | ✔ |
| `fluent_boards/contact_added_to_task` | `$task`: Task | F `Task.php:96` (on create when `crm_contact_id` is set); F `app/Services/TaskService.php:660` | F | — |
| `fluent_boards/task_updated` | `$task`: Task, `$what`: string (`'position'`) | F `app/Http/Controllers/TaskController.php:1295`; F `app/Modules/MCP/Tools/TaskTools.php:273` | F | — |
| `fluent_boards/task_stage_updated` | `$task`: Task, `$oldStageId`: int, *(optional)* `$context`: `['source'=>Stage,'target'=>Stage]` (only from bulk stage move) | F `TaskController.php:1289`; F `TaskTools.php:270`; F `StageService.php:536` | F | ✔ (3rd optional arg not documented) |
| `fluent_boards/task_date_changed` | `$task`: Task, `$changedDates`: array of **old** values keyed `due_at` / `started_at` | F `TaskController.php:948` | F | — |
| `fluent_boards/task_due_date_changed` | `$task`: Task, `$oldDueAt`: string\|null | F `TaskService.php:736`; P `app/Hooks/Handlers/ProTaskHandler.php:273` (passes `$newTask, $started_at`, i.e. the new repeat task and its start date, **not** an old due date) | F+P | ✔ (Pro quirk not noted) |
| `fluent_boards/task_due_date_removed` | `$task`: Task | F `TaskService.php:738` | F | — |
| `fluent_boards/task_start_date_changed` | `$task`: Task, `$oldStartedAt`: string\|null (fires only when the new value is non-empty) | F `TaskService.php:753` | F | ✔ |
| `fluent_boards/task_priority_changed` | `$task`: Task, `$oldPriority`: string | F `TaskService.php:762` | F | — |
| `fluent_boards/task_content_updated` | `$task`: Task, `$col`: `'title'`\|`'description'`, `$oldTask`: Task (clone) | F `TaskService.php:716,723` | F | — |
| `fluent_boards/task_completed_activity` | `$task`: Task, `$status`: `'closed'`\|other | F `TaskService.php:703` | F | — |
| `fluent_boards/task_archived` | `$task`: Task | F `TaskService.php:690`; F `StageService.php:570` | F | ✔ |
| `fluent_boards/task_reminder_type_changed` | `$task`: Task, `$value`: string\|null | F `TaskService.php:581` | F | — |
| `fluent_boards/task_assignee_added` | `$task`: Task, `$userId`: int | F `TaskService.php:604,837`; F `app/Services/Intergrations/FluentFormIntegration/Bootstrap.php:445` | F | ✔ |
| `fluent_boards/assign_another_user` | `$task`: Task, `$userId`: int (only when assignee ≠ current user) | F `TaskService.php:606` | F | — |
| `fluent_boards/task_assignee_removed` | `$task`: Task, `$userId`: int | F `TaskService.php:612,848` | F | ✔ |
| `fluent_boards/associate_user_add_change_remove_activity` | `$oldContactId`: int\|null, `$newContactId`: int\|null, `$taskId`: int | F `TaskService.php:661` | F | — |
| `fluent_boards/support_ticket_unlinked` | `$task`: Task, `$ticketId`: int | F `TaskService.php:444` | F | — |
| `fluent_boards/task_label` | `$task`: Task, `$label`: Label, `$action`: `'added'`\|`'removed'` | F `app/Services/LabelService.php:102,123`; F `LabelTools.php:199` | F | — |
| `fluent_boards/before_task_deleted` | `$task`: Task, `$options`: null | F `TaskController.php:1045`; F `app/Api/Classes/Tasks.php:721`; P `app/Http/Controllers/SubtaskController.php:214`; P `app/Modules/MCP/Tools/ProTaskTools.php:169` | F+P | — |
| `fluent_boards/task_deleted` | `$task`: Task (clone; fired **after the DB transaction commits**, once per deleted task) | F `TaskService.php:980` | F | ✔ (documented twice) |
| `fluent_boards/task_moved_from_board` | `$task`: Task, `$oldBoard`: Board, `$newBoard`: Board | F `TaskService.php:1097` | F | — |
| `fluent_boards/task_moved_update_time_tracking` | `$task`: Task (also each subtask) | F `TaskService.php:1084,1138` | F | — |
| `fluent_boards/task_cloned` | `$originalTask`: Task, `$clonedTask`: Task | F `TaskService.php:2706` | F | — |
| `fluent_boards/task_cloned_activity` | `$originalTask`, `$clonedTask` (re-fired by TaskHandler after it clears activities) | F `app/Hooks/Handlers/TaskHandler.php:273` | F | — |
| `fluent_boards/bulk_action_completed` | `$action`: string, `$tasks`: Collection, `$boardId`: int | F `TaskService.php:3035` | F | — |
| `fluent_boards/task_added_from_fluent_form` | `$task`: Task | F `FluentFormIntegration/Bootstrap.php:428` | F | ✔ |
| `fluent_boards/task_attachment_added` | `$attachment`: TaskAttachment (model `created` event) | P `app/Models/TaskAttachment.php:21` | P | — |
| `fluent_boards/task_attachment_deleted` | `$attachment`: TaskAttachment\|TaskImage (clone), *(sometimes)* `$boardId`: int\|null. Arg count is inconsistent: 1 arg at F `TaskService.php:2561` / P `AttachmentService.php:182`, 2 args at F `TaskService.php:2580,2606` | F+P | — |
| `fluent_boards/task_custom_field_changed` | `$taskId`: int, `$customField`: model, `$oldValue`, `$newValue`, `$isNew`: bool | P `app/Services/CustomFieldService.php:153` | P | — |
| `fluent_boards/task_dependency_added` | `$predecessor`: Task, `$successor`: Task, `$boardId`: int | P `app/Services/DependencyService.php:64` | P | — |
| `fluent_boards/task_dependency_removed` | same as above | P `DependencyService.php:114` | P | — |
| `fluent_boards/repeat_task_set` | `$task`: Task | P `app/Http/Controllers/ProTaskController.php:95` | P | — |
| `fluent_boards/repeat_task_updated` | `$task`: Task | P `ProTaskController.php:85` | P | — |
| `fluent_boards/repeat_task_created` | `$newTask`: Task, `$sourceTask`: Task | P `ProTaskHandler.php:272` | P | — |
| `fluent_boards/repeat_task` | `$taskId`: int, `$metaId`: int (dispatched by the scheduler for each due repeat) | P `app/Hooks/Handlers/ProScheduleHandler.php:290` | P | — |

### 1.3 Subtasks (Pro + free API)

| Hook | Args | Call sites | Src | Doc |
|---|---|---|---|---|
| `fluent_boards/subtask_added` | `$parentTask`: Task, `$subtask`: Task | P `app/Services/SubtaskService.php:197`; P `app/Services/ProTaskService.php:396` | P | — |
| `fluent_boards/subtask_cloned` | `$parentTask`: Task, `$clonedSubtask`: Task | P `SubtaskService.php:527` | P | — |
| `fluent_boards/subtask_deleted_activity` | `$parentId`: int, `$title`: string | F `Api/Classes/Tasks.php:725`; P `SubtaskController.php:218`; P `ProTaskTools.php:173` | F+P | — |
| `fluent_boards/subtask_group_created` | `$taskId`: int, `$group`: TaskMeta | P `SubtaskService.php:87` | P | — |
| `fluent_boards/subtask_group_title_updated` | `$oldTitle`: string, `$group`: TaskMeta | P `SubtaskService.php:98` | P | — |
| `fluent_boards/subtask_group_deleted_activity` | `$taskId`: int, `$group`: TaskMeta (clone, after commit) | P `SubtaskService.php:138` | P | — |

### 1.4 Comments / notifications / users

| Hook | Args | Call sites | Src | Doc |
|---|---|---|---|---|
| `fluent_boards/comment_created` | `$comment`: Comment | F `app/Services/CommentService.php:94` | F | ✔ |
| `fluent_boards/comment_updated` | `$comment`: Comment, `$oldComment`: Comment | F `CommentService.php:537` | F | ✔ |
| `fluent_boards/comment_deleted` | `$comment`: Comment (deleted) | F `CommentService.php:557` | F | ✔ |
| `fluent_boards/mention_comment_notification` | `$comment`: Comment, `$userIds`: int[] | F `app/Services/NotificationService.php:393` | F | — |
| `fluent_boards/profile_name_updated` | `$userId`: int, `$displayName`: string | F `app/Services/UserService.php:71` | F | — |
| `fluent_boards/profile_photo_updated` | `$userId`: int, `$photoUrl`: string | F `UserService.php:111` | F | — |

### 1.5 App lifecycle / admin / settings / MCP

| Hook | Args | Call sites | Src | Doc |
|---|---|---|---|---|
| `fluent_boards_loaded` (no slash) | `$app`: Application | F `boot/app.php:26` (on `plugins_loaded`) | F | — |
| `fluent-boards_loading_app` (hyphen + underscore, legacy naming) | none | F `app/Hooks/Handlers/AdminMenuHandler.php:340`; P `app/Hooks/Handlers/SingleBoardShortCodeHandler.php:108` (as `$slug . '_loading_app'`, where `$slug` = free `app.slug` = `fluent-boards`) | F+P | — |
| `fluent_boards/after_core_menu_items` | `$permissions`: `[]`, `$isAdmin`: `true` (always these constants) | F `AdminMenuHandler.php:117` | F | — |
| `fluent_boards/rendering_app` | none | F `AdminMenuHandler.php:159` | F | — |
| `fluent_boards/after_enqueue_assets` | `$app`: Application | F `AdminMenuHandler.php:365`; P `SingleBoardShortCodeHandler.php:133` | F+P | — |
| `fluent_boards/in_menu_actions` | none (inside the admin top menu view) | F `app/Views/admin/menu.php:58` | F | — |
| `fluent_boards/front_head` | none | P `app/Views/front-app.php:169` | P | — |
| `fluent_boards/front_footer` | none | P `front-app.php:180` | P | — |
| `fluent_boards/saving_addons` | `$settings`: array, `$prefSettings`: array | F `app/Http/Controllers/OptionsController.php:865` | F | — |
| `fluent_boards/recurring_task_disabled` | none | F `OptionsController.php:870` | F | — |
| `fluent_boards/install_plugin` | `$pluginToInstall`: array (`name`,`repo-slug`,`file`), `$slug`: string | F `OptionsController.php:914` | F | — |
| `fluent_boards/mcp_loaded` | none | F `app/Modules/MCP/MCPInit.php:41` | F | — |
| `fluent_boards/mcp_tool_exception` | `$e`: Throwable, `$toolName`: string, `$params`: array | F `app/Modules/MCP/AbilitiesRegistrar.php:554` | F | — |

### 1.6 Dynamic action names (resolved)

| Expression | File:line | Concrete expansions |
|---|---|---|
| `'fluent_boards/' . $hookName` | P `app/Http/Controllers/BoardUserController.php:178` | `fluent_boards/board_admin_added`, `fluent_boards/board_admin_removed` (args `$boardId`, `$userId`). Note: this fires `board_admin_removed` for any non-admin role update, even when the user was never an admin. |
| `$slug . '_loading_app'` | P `SingleBoardShortCodeHandler.php:108` | `fluent-boards_loading_app` |
| `$this->slug . '/update_verification_failed'` | P `app/Services/PluginManager/UpdateVerifier.php:442` | `fluent-boards-pro/update_verification_failed` (`$slug`, `$code`, `$message`). This is updater internals, not `fluent_boards/` |

### 1.7 Commented-out (dead) action calls

These are not fired. Do not document them.

| Hook | File:line |
|---|---|
| `fluent_boards/task_moved_to_new_stage` | F `TaskController.php:1287` |
| `fluent_boards/task_prop_changed` | F `TaskService.php:483` |
| `fluent_boards/task_comment_updated` | F `CommentService.php:582` |
| `fluent_boards/comment_deleted` (with `$taskId`) | F `CommentService.php:599` |
| `fluent_boards/board_updated` (single arg) | F `BoardService.php:264` |
| `task_assignee_added` / `assign_another_user` / `task_label` (CSV import) | F `TaskService.php:3334,3336,3418` |

### 1.8 Internal async / scheduled hooks (Action Scheduler / WP-Cron)

These hooks are dispatched by Action Scheduler or WP-Cron, not by a direct `do_action`. They are internal plumbing. Document them only as "do not rely on".

| Hook | Args | Dispatched at | Src |
|---|---|---|---|
| `fluent_boards/one_time_schedule_send_email_for_{column}`: concrete `comment`, `mention`, `stage_change`, `add_assignee`, `remove_assignee`, `due_date_update`, `task_archived`, `removed_from_task` | `$id` (task or comment), `$userIds`, `$actorUserId` | F `TaskService.php:1947` (dynamic), `TaskController.php:1342`, `CommentController.php:251`, `NotificationService.php:402` | F |
| `fluent_boards/check_upload_protection` | none | F `app/Services/Libs/FileSystem.php:130` (`wp_schedule_single_event`) | F |
| `fluent_boards/five_minutes_scheduler`, `fluent_boards/hourly_scheduler`, `fluent_boards/daily_scheduler` | none | P `boot/app.php:36,39,42` (recurring) | P |
| `fluent_boards/repeat_task_scheduler` | none | P `ProScheduleHandler.php:33` | P |
| `fluent_boards/daily_task_reminder`, `fluent_boards/task_reminder_scheduler_for_rest` | none | P `ProScheduleHandler.php:90,229,374` | P |
| `fluent_boards/async_{event}_webhook`: concrete `task_created`, `task_completed`, `task_stage_updated`, `task_date_changed`, `task_priority_changed`, `task_label_added`, `task_label_removed`, `stage_added`, `comment_created`, `task_assignee_added`, `task_archived` | `$payload` (array), `$webhookIds`, `$eventSlug` | P `app/Hooks/Handlers/OutWebhookHandler.php:109` (via `queueWebhookEvent`, dynamic at :318) | P |
| `fluent_boards/process_trello_import` | `$importId` | P `app/Services/TrelloImporter.php:993,1196` | P |
| `fluent_boards/async_create_tasks_from_template`, `fluent_boards/async_copy_tasks_from_user_template` | template payload | P `app/Services/TemplateService.php:1389,1684` | P |

Non-Boards hooks fired by Boards code (for completeness; not Boards API): `fluent_kit/can_auto_install`, `fluent_toolkit/can_auto_install`, `fluent_kit/do_auto_install`, `fluent_toolkit/do_auto_install` (F `MCPSettingsController.php:288-304`, `OptionsController.php:929-932`), `fluent_toolkit/toolkit_installing` (P `ToolkitInstaller.php:40`), `fluentform/integration_action_result` (F FluentForm Bootstrap), `fluent_crm/parse_campaign_email_text` (F+P CRM actions), `rest_url_details_*` (P `RemoteUrlParser.php`), `fluent_sl/*` (P PluginUpdater).

---

## 2. Filter hooks (code inventory)

| Hook | Value filtered → extra args | Call sites | Src | Doc |
|---|---|---|---|---|
| `fluent_boards/accepted_plugins` | `$plugins`: array slug ⇒ file | F `OptionsController.php:896` | F | ✔ |
| `fluent_boards/addons_settings` | `$addOns`: array | F `OptionsController.php:813` | F | ✔ |
| `fluent_boards/ajax_options_{$optionKey}` (dynamic) | `[]` → `$search`: string, `$includedIds`: array | F `OptionsController.php:140` | F | — |
| `fluent_boards/app_icon` | `$url`: string | F `AdminMenuHandler.php:170` | F | — |
| `fluent_boards/app_logo` | `$url`: string | F `AdminMenuHandler.php:169` | F | — |
| `fluent_boards/app_url` | `$url`: string (`admin.php?page=fluent-boards#/`) | F `app/Functions/helpers.php:117`; F `app/Hooks/Handlers/ExternalPages.php:95,100`; P `boot/app.php:58` | F+P | — |
| `fluent_boards/app_vars` | `$vars`: array (localized `fluentAddonVars`) | F `AdminMenuHandler.php:376` | F | — |
| `fluent_boards/asset_listed_slugs` | `$slugs`: regex string[] (no-conflict allow-list) | F `AdminMenuHandler.php:259`; P `app/Hooks/Handlers/FrontendRenderer.php:172` | F+P | — |
| `fluent_boards/portal_asset_listed_slugs` | `$slugs`: string[] | P `FrontendRenderer.php:180` | P | — |
| `fluent_boards/skip_no_conflict` | `$skip`: bool (false) | F `AdminMenuHandler.php:248` | F | — |
| `fluent_boards/before_create_board` | `$boardData`: **array** | F `BoardService.php:161,1220`; P `TemplateService.php:757` | F+P | ✖ (says Object) |
| `fluent_boards/before_task_create` | `$data`: **array** (only via `Task::createTask()`, used by `TaskService::createTask`, Fluent Forms, FluentCRM action, Pro incoming webhook) | F `Task.php:404` | F | ✖ (says Object) |
| `fluent_boards/board_find` | `$board`: Board | F `BoardController.php:580,1333` | F | ✔ in filters, ✖ in actions page (wrong type) |
| `fluent_boards/board_menu_items` | `$menuItems`: array, **one arg only** | F `app/Hooks/Handlers/BoardMenuHandler.php:33` | F | ✖ (doc claims `$board_id` 2nd arg) |
| `fluent_boards/core_menu_items` | `$menuItems`: array | F `AdminMenuHandler.php:207` | F | — |
| `fluent_boards/menu_items` | `$menuItems`: array | F `AdminMenuHandler.php:235` | F | ✔ |
| `fluent_boards/can_create_board` | `$can`: bool → `$userId`: int | F `app/Services/PermissionManager.php:457,463,466` | F | — |
| `fluent_boards/dashboard_notices` | `[]`: array of notices | F `AdminMenuHandler.php:421` | F | — (FluentCRM version in partial) |
| `fluent_boards/email_header` | `$html`: string | F `app/Views/emails/common-header.php:12` | F | ✔ |
| `fluent_boards/email_footer` | `$footerText`: string | F `app/Views/emails/template.php:33`; F `app/Views/emails/comment-added.php:40` | F | ✔ |
| `fluent_boards/get_avatar` | `$url`: string → `$email`: string | F `helpers.php:65,73,77,91` | F | — |
| `fluent_boards/site_logo` | `$logoUrl`: string | F `helpers.php:185` | F | ✔ |
| `fluent_boards/true_false_convert` | `$map`: array | F `helpers.php:314` | F | — |
| `fluent_boards_csv_mimes` (no slash) | `$mimes`: string[] | F `helpers.php:285` | F | — |
| `fluent_boards/import_max_file_size` | `$bytes`: int (64 MB) | F `app/Services/JsonImportService.php:69,182`; P `app/Http/Controllers/ImportController.php:56,199` | F+P | — |
| `fluent_boards/upload_file_size_limit` | `$bytes`: int (104857600) | F `app/Services/UploadService.php:41` | F | — |
| `fluent_boards/upload_allowed_mimes` | `$map`: array ext ⇒ mime | F `UploadService.php:91` | F | — |
| `fluent_boards/upload_folder_name` | `$folder`: string (`FLUENT_BOARDS_UPLOAD_DIR`) | F `app/Hooks/actions.php:45`; F `app/Services/AttachmentFileService.php:512`; F `app/Services/Libs/FileSystem.php:50,117,347` | F | — |
| `fluent_boards/uploaded_file_name_prefix` | `$prefix`: string (`uuid-`) | F `FileSystem.php:372`; P `app/Http/Controllers/AttachmentController.php:250` | F+P | ✔ |
| `fluent_boards/upload_media_data` | `$data`: array (`type`,`driver`,`file_path`,`full_url`,`settings`) → `$file` | P `app/Services/AttachmentService.php:139` | P | — |
| `fluent_boards/save_general_settings` | `$settings`: array | F `OptionsController.php:1132` | F | ✔ |
| `fluent_boards/task_priorities` | `$priorities`: array `'' ⇒ No priority, urgent, high, medium, low` | F `app/Hooks/Handlers/ShortcodeHandler.php:178`; F `AdminMenuHandler.php:427`; F `Api/Classes/Tasks.php:780`; F `TaskTools.php:489`; F `TaskService.php:3198`; F `FluentFormIntegration/Bootstrap.php:270`; P `app/Hooks/Handlers/ExternalPages.php:527` | F+P | ✖ (default keys wrong) |
| `fluent_boards/task_reminder_types` | `$types`: array key ⇒ label | F `app/Services/Helper.php:706` | F | — |
| `fluent_boards/wordpress_ai_generate` | `null` (short-circuit) → `$userPrompt`, `$systemPrompt`, `$model`, `$timeout` | F `app/Services/AiService.php:637` | F | — |
| `fluent_boards/mcp_ability_names` | `$names`: string[] | F `MCPInit.php:56,85` | F | — |
| `fluent_boards/mcp_server_namespace` | `'fluent-boards'` | F `MCPInit.php:58,77` | F | — |
| `fluent_boards/mcp_server_route` | `'mcp'` | F `MCPInit.php:59,78` | F | — |
| `fluent_boards/mcp_is_local_dev` | `$isDev`: bool → `$host`: string | F `app/Http/Controllers/MCPSettingsController.php:254` | F | — |
| `fluent_boards/incoming_webhook_data` | `$postData`: array → `$webhook`: **Webhook model** | P `ExternalPages.php:290` | P | ✖ (says `$webhook` is String; example missing `10, 2`) |
| `fluent_boards/webhook_task_data` | `$data`: array (post data + `board_id`,`stage_id`) → `$verifiedWebhook`: Webhook model | P `ExternalPages.php:346` | P | ✖ (wrong names/types; missing `10, 2`) |
| `fluent_boards/task_table_columns` | `$columns`: string[] (CSV import mapping) | P `app/Http/Controllers/CsvController.php:84` (multi-line) | P | — |
| `fluent_boards/default_templates_remote_url` | `$url`: string | P `app/Services/TemplateService.php:100` | P | — |
| `fluent_boards/invite_expiry_seconds` | `$seconds`: int (48h) → `$boardId`, `$email` | P `app/Hooks/Handlers/InvitationHandler.php:282` | P | — |
| `fluent_boards/invitation_form_title` | `'Fluent Boards'` | P `app/Views/register_member_form.php:107` | P | — |
| `fluent_boards/invitation_form_registration_text` | `$text`: string | P `register_member_form.php:108` | P | — |
| `fluent_boards/no_permission_message` | `$message`: string | P `SingleBoardShortCodeHandler.php:42`; P `FrontendRenderer.php:230` | P | — |
| `fluent_boards/login_header` | `$text`: string | P `FrontendRenderer.php:283` | P | — |
| `fluent_boards/docs_url` | `$url`: string | P `boot/app.php:112` | P | — |
| `fluent_boards/community_support_url` | `$url`: string | P `boot/app.php:113` | P | — |
| `fluent_boards/license_grace_period_days` | `$days`: int (15) | P `app/Http/Controllers/LicenseController.php:177` | P | — |

### 2.1 Dynamic filter expansions

| Expression | Concrete names with core listeners (`app/Hooks/filters.php:19-21`) |
|---|---|
| `'fluent_boards/ajax_options_' . $optionKey` | `fluent_boards/ajax_options_non_board_wordpress_users`, `fluent_boards/ajax_options_crm_contacts`, `fluent_boards/ajax_options_task_assignees` (the last one is effectively **unreachable**: `task_assignees` is handled by an earlier branch at `OptionsController.php:42`). Any other unknown `$optionKey` falls through to this filter, so third parties can add option sources. |

---

## 3. JS-side developer hook points

No public JS hook API exists. The resources contain no `wp.hooks`, `createHooks`, or `addFilter`/`applyFilters`/`doAction` registry for third parties.

| Mechanism | Where | Notes |
|---|---|---|
| `window.fluentAddonVars` | Localized in `AdminMenuHandler.php` (`wp_localize_script`), read in `resources/admin/app.js`, `single_board.js:35` | Server-side extensible via the PHP filter `fluent_boards/app_vars`. This is the only real "JS extension point". |
| Board menu custom items | `resources/admin/Components/Board/Menu/BoardMenu.vue:68,167,194` render `item.icon` / `item.html` via `v-html` | Driven by the PHP filter `fluent_boards/board_menu_items` (`type: 'custom'`) |
| Dashboard notices | `resources/admin/Components/Dashboard/Dashboard.vue:4-5` | Driven by the PHP filter `fluent_boards/dashboard_notices` |
| `onFbsThemeChange` CustomEvent | `resources/admin/Modules/Theme/Theme.js:2,66` (dispatched on `window`) | Internal theme toggle event. Usable as a listener, but undocumented and not a guaranteed API. |
| `window.fbsPreviousRoute`, `window.Fuse`, `window.moment` | `app.js:37-39,200` | Internal globals. Not an API. |
| `FluentCRM.addFilter('fluentcrm_profile_routes' / 'fluentcrm_profile_sections', …)` | `resources/admin/crm-contact-app3/app.js:17,41` | Boards **consumes** FluentCRM's JS hooks. It does not expose any of its own. |

---

## 4. Docs comparison

### 4.1 Actions page (`src/hooks/actions/index.md`)

| Documented hook | Verdict | Problem / fix |
|---|---|---|
| `board_created` | Correct | — |
| `board_find` | **Wrong type** | It is a **filter** (`apply_filters`), not an action. Remove it from the actions page (it is already on the filters page). |
| `board_updated` | Correct | — |
| `board_label_created` / `_updated` / `_deleted` | Correct | — |
| `board_stages_reordered` | **Wrong args** | 2nd arg is not "list of stage ids" in the new order. It is the **old** ordered ID Collection (`BoardService::repositionStages`) or `[$movedStageId]` (`StageController::dragStage`). Document the inconsistency or fix the code. |
| `stage_archived` | Correct but legacy | The code marks it "Old hook". Document `stage_archived_with_tasks` as the preferred hook and add `board_stage_restored` / `stage_restored_with_tasks`. |
| `board_member_added` | **Partially wrong** | 2nd arg is a User model in most paths but a **Relation** model in `BoardService::makeMember` (`:1340`). Same issue for `board_viewer_added` (`:1359`). |
| `task_archived` | Correct | — |
| `stage_updated` | **Wrong arg type** | `$updatedStage` is an **array** (`title`, `cover_bg`), not a Stage object. Only the 3rd arg is a Stage model. |
| `task_created` | Correct | Should note: top-level tasks only (subtasks fire `subtask_added`). |
| `task_deleted` | Correct, **duplicated** | Listed twice (lines 194 and 340). Should note it fires after commit. |
| `task_stage_updated` | Correct (incomplete) | Optional 3rd arg `['source','target']` exists for bulk moves. |
| `comment_created` / `comment_updated` / `comment_deleted` | Correct | — |
| `task_added_from_fluent_form` | Correct | — |
| `task_assignee_added` / `task_assignee_removed` | Correct | — |
| `task_start_date_changed` | Correct | Fires only when the new value is non-empty. |
| `task_due_date_changed` | Correct (free) | Pro `ProTaskHandler.php:273` passes `($newTask, $started_at)` (a new date, not the old one). Note this or fix it. |
| Intro text (line 5) | **Wrong** | Says "many interesting **filter** hooks" on the actions page. |

### 4.2 Filters page (`src/hooks/filters/index.md`)

| Documented hook | Verdict | Problem / fix |
|---|---|---|
| `board_find` | Correct | — |
| `before_create_board` | Wrong type | `$boardData` is an **array**. |
| `before_task_create` | Wrong type | `$data` is an **array**. |
| `uploaded_file_name_prefix` | Correct | — |
| `incoming_webhook_data` | **Wrong** | `$webhook` is a Webhook **model**, not a string. The example omits `10, 2`, so only 1 arg is passed and a 2-param closure throws an `ArgumentCountError` on PHP 8. Pro-only (no badge). |
| `webhook_task_data` | **Wrong** | The params are `$data` (includes `board_id`, `stage_id`) and `$verifiedWebhook` (model). The example reuses the wrong names and also omits `10, 2`. Pro-only. |
| `site_logo` | Correct | — |
| `addons_settings` | Correct | — |
| `accepted_plugins` | Correct | — |
| `save_general_settings` | Correct | — |
| `email_footer` | Correct | — |
| `email_header` | Correct | — |
| `task_priorities` | **Wrong defaults** | The defaults are `''` (No priority), `urgent`, `high`, `medium`, `low`. The doc lists only high/medium/low, and its example "adds" `urgent`, which already exists. |
| `task_tabs` | **Stale** | No `fluent_boards/task_tabs` filter exists in free or pro. Task tab order is a per-user meta (`fbs_task_tabs_config`, `TaskController.php:1677`). Also referenced in `src/getting-started/index.md:22`. |
| `board_menu_items` | **Wrong signature** | The filter passes **one** arg (`$menuItems`). The doc and example claim `$board_id` with `10, 2`, so the example fatals (`ArgumentCountError`). Either fix the docs or pass the board ID in code. |
| `menu_items` | Correct | — |
| Intro text | Typo | "filer hooks". |

### 4.3 Filters partials: all FluentCRM content (non-Boards)

**How they are wired:** `filters/index.md` does **not** include them (there is no `!!!include()!!!` or `@include` anywhere under `src/`). The `_*.md` files are still built as **standalone public pages**, and `src/.vuepress/public/sitemap-hooks.xml` lists them (`/hooks/filters/_dashboard_filters/` etc.). They are orphaned FluentCRM copy-paste that is publicly indexed. Recommendation: delete them, or exclude them from the build and sitemap.

| File | Hooks documented (all `fluent_crm/*`, none exist in Boards) | Count |
|---|---|---|
| `_dashboard_filters.md` | `dashboard_stats`, `quick_links`, `dashboard_notices`, `sales_stats` | 4 |
| `_frontend_filters.md` | `unsubscribe_texts`, `unsub_response_message`, `unsub_redirect_url`, `double_optin_options`, `pref_labels`, `pref_form_fields`, `show_unsubscribe_on_pref`, `double_optin_email_subject`, `double_optin_email_body` | 9 |
| `_general_filters.md` | `disable_global_search`, `will_auto_unsubscribe`, `will_use_cookie`, `is_simulated_mail`, `countries` | 5 |
| `_other_filters.md` | `enable_unsub_header`, `email_headers`, `enable_mailer_to_name`, `user_permissions`, `default_email_design_template`, `contact_name_prefixes`, `woo_purchase_sidebar_html`, `edd_purchase_sidebar_html` | 8 |
| `_webhook_filters.md` | `incoming_webhook_data`, `webhook_contact_data` | 2 |

Boards equivalents worth documenting instead: `fluent_boards/dashboard_notices` (replaces `_dashboard_filters`), and `fluent_boards/incoming_webhook_data` / `webhook_task_data` (replaces `_webhook_filters`).

Other FluentCRM leftovers:
- `src/.vuepress/sidebars/hooks.js`: sidebar group title is **"FluentCRM Hooks"**.
- Pro `ExternalPages.php` uses the `'fluent-crm'` text domain in one webhook error string. This is code, not docs, and is noted only for the record.

### 4.4 Missing from docs (public hooks only, excluding §1.7 dead code and §1.8 internals)

**Actions (69):** `before_board_deleted`, `board_archived`, `board_restored`, `board_background_updated`, `board_stage_added`, `stage_archived_with_tasks`, `board_stage_restored`, `stage_restored_with_tasks`, `tasks_moved_between_stages`, `default_assignees_updated`, `default_watchers_updated`, `board_viewer_added`, `board_admin_added`, `board_admin_removed`, `contact_added_to_board`, `send_invitation`, `board_created_from_template`ᴾ, `board_created_from_automation`ᴾ, `board_converted_to_template`ᴾ, `template_converted_to_board`ᴾ, `contact_added_to_task`, `task_updated`, `task_date_changed`, `task_due_date_removed`, `task_priority_changed`, `task_content_updated`, `task_completed_activity`, `task_reminder_type_changed`, `assign_another_user`, `associate_user_add_change_remove_activity`, `support_ticket_unlinked`, `task_label`, `before_task_deleted`, `task_moved_from_board`, `task_moved_update_time_tracking`, `task_cloned`, `task_cloned_activity`, `bulk_action_completed`, `task_attachment_added`ᴾ, `task_attachment_deleted`, `task_custom_field_changed`ᴾ, `task_dependency_added`ᴾ, `task_dependency_removed`ᴾ, `repeat_task_set`ᴾ, `repeat_task_updated`ᴾ, `repeat_task_created`ᴾ, `repeat_task`ᴾ, `subtask_added`ᴾ, `subtask_cloned`ᴾ, `subtask_deleted_activity`, `subtask_group_created`ᴾ, `subtask_group_title_updated`ᴾ, `subtask_group_deleted_activity`ᴾ, `mention_comment_notification`, `profile_name_updated`, `profile_photo_updated`, `fluent_boards_loaded`, `fluent-boards_loading_app`, `after_core_menu_items`, `rendering_app`, `after_enqueue_assets`, `in_menu_actions`, `front_head`ᴾ, `front_footer`ᴾ, `saving_addons`, `recurring_task_disabled`, `install_plugin`, `mcp_loaded`, `mcp_tool_exception`.

**Filters (35):** `ajax_options_{key}`, `app_icon`, `app_logo`, `app_url`, `app_vars`, `asset_listed_slugs`, `portal_asset_listed_slugs`ᴾ, `skip_no_conflict`, `core_menu_items`, `can_create_board`, `dashboard_notices`, `get_avatar`, `true_false_convert`, `fluent_boards_csv_mimes`, `import_max_file_size`, `upload_file_size_limit`, `upload_allowed_mimes`, `upload_folder_name`, `upload_media_data`ᴾ, `task_reminder_types`, `wordpress_ai_generate`, `mcp_ability_names`, `mcp_server_namespace`, `mcp_server_route`, `mcp_is_local_dev`, `task_table_columns`ᴾ, `default_templates_remote_url`ᴾ, `invite_expiry_seconds`ᴾ, `invitation_form_title`ᴾ, `invitation_form_registration_text`ᴾ, `no_permission_message`ᴾ, `login_header`ᴾ, `docs_url`ᴾ, `community_support_url`ᴾ, `license_grace_period_days`ᴾ.

(ᴾ = Pro only. Docs currently carry no Free/Pro badges per hook. Pro-only documented filters such as `incoming_webhook_data` and `webhook_task_data` should be labelled.)

### 4.5 Code-side inconsistencies to consider fixing (out of scope here, noted for the docs plan)

1. `board_member_added` / `board_viewer_added`: the 2nd arg is a User **or** a Relation depending on the path.
2. `board_stages_reordered`: the 2nd arg means different things in its two call sites.
3. `task_attachment_deleted`: 1 or 2 args depending on the call site, and the 1st arg is TaskAttachment or TaskImage.
4. `task_due_date_changed` (Pro repeat): passes the new start date in the "old due date" slot.
5. `board_menu_items`: the docs promise `$board_id`, but the code does not pass it.
6. `BoardUserController.php:178`: fires `board_admin_removed` on any non-admin role sync, even for users who were never admins.
7. Legacy pairs (`stage_archived`, `board_stage_restored`, `fluent-boards_loading_app`, `fluent_boards_loaded`, `fluent_boards_csv_mimes`) use mixed naming conventions. Document them as legacy.
8. `doCustomAction` / `applyCustomFilters` in Pro are unused, and the Pro prefix would be `fluent_boards_pro`.
