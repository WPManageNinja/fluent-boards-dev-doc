# REST API Route Inventory & Docs Gap Analysis

- **Date:** 2026-10-02
- **Status:** Research complete (read-only; no repo files changed)
- **Namespace:** `fluent-boards/v2` (all paths below are relative to `/wp-json/fluent-boards/v2`)

## Sources scanned

| Source | File(s) | Notes |
|---|---|---|
| Free | `fluent-boards/app/Http/Routes/api.php` (loaded via `routes.php`) | Controllers: `FluentBoards\App\Http\Controllers` |
| Pro | `fluent-boards-pro/app/Http/Routes/api.php` | Controllers: `FluentBoardsPro\App\Http\Controllers` |
| Pro – TimeTracking module | `fluent-boards-pro/app/Modules/TimeTracking/routes.php` (registered by `TimerInit::register()`) | Controllers: `FluentBoardsPro\App\Modules\TimeTracking\Controllers` (shown as `TT\…`) |
| Roadmap addon | `fluent-roadmap/app/Http/api.php` | Uses the FluentBoards router, so routes live under `fluent-boards/v2` too |
| Docs | `dev-docs/src/rest-api/*.md`, sidebar `dev-docs/src/.vitepress/sidebars/rest-api.js` | |

No `register_rest_route` calls exist outside the framework router. Non-REST endpoints not counted: pro `wp_ajax_fluent_boards_export_timesheet`, `wp_ajax_fluent_boards_export_csv`, `wp_ajax_fluent_boards_export_json` (board CSV/JSON/timesheet export happens over admin-ajax, not REST), free `wp_ajax_fluentform_fluent_board_config`.

Params are taken from `$request->get/getSafe`, `$request->prop`, `only([...])`, validation rule keys, and direct `$_REQUEST` reads inside the controller method. They are not traced into services. `*` = validated as required. `(full body)` = the controller passes `$request->all()` through.

## Key findings

1. **7 dead pro routes.** `fluent-boards-pro/app/Http/Routes/api.php` lines 89–95 map `time-tracks`, `time-tracks/start|pause|stop|commit|commit-manually` and `PUT time-tracks/commit/{track_id}` to `TimeTrackController`. The router resolves that name in `FluentBoardsPro\App\Http\Controllers`, and **no such class exists there**. The real controller is `FluentBoardsPro\App\Modules\TimeTracking\Controllers\TimeTrackController`, which also has no `startTrack/pauseTrack/stopTrack/commitTrack` methods. Two of the seven (`GET time-tracks`, `PUT time-tracks/commit/{track_id}`) duplicate live TimeTracking-module routes, so which handler wins depends on registration order. Recommend deleting lines 88–95.
2. **Duplicate route:** `GET /global-search` is registered twice in free `api.php`, under BoardUserPolicy (line 40) and UserPolicy (line 283).
3. **8 doc pages are invented placeholders.** `activities`, `admin`, `cloud-storage`, `import-export`, `notifications`, `permissions`, `reports` and `settings` describe endpoints that never existed (`/settings/*`, `/permissions/*`, `/import-export/*`, …). They account for 61 of the 67 stale entries. None of them is in the sidebar.
4. **Six `users.md` endpoints are not routed:** `/fluent-boards-users`, `/search-fluent-boards-users`, `/get-user-permissions`, `/update-user-permissions`, `/set-permission-all-board-admin`, `/remove-user-from-board`. The controller methods still exist, but no route points to them. The page **is** in the sidebar, so readers see these.
5. **Large undocumented areas:** AI (7), import/export incl. Trello/Asana/CSV (14), quick-access/dashboard utilities (13), member profile (9), public boards (4), task dependencies (4), recurring tasks (2), MCP/admin settings (10), license (3), and most board/task utility routes (21 + 21).
6. **Correct pages missing from the sidebar:** `attachments.md` (5 OK routes), `templates.md` (5), `time-tracking.md` (7), `webhooks.md` (3), `roadmaps.md` (13). That is 33 correctly documented routes that readers can only reach by direct URL. `authentication.md` links to `/rest-api/webhooks`, and `time-tracking.md` links to `/rest-api/reports` (a placeholder).
7. **Parameter drift spotted while checking paths** (not counted as "wrong"):
   - `boards.md` "List boards" documents `search`, `order_by`, `order_type`. Code reads `searchInput`, `orderBy`, `order`, `type`, `option`, `fid`, `per_page`.
   - `comments.md` "List comments" documents `page`, `per_page`, `type`, `privacy`, `include_replies`, `include_images`. Code reads only `filter`, and `per_page` is hard-coded to 10.
   - `stages.md` "Update stage" documents top-level `title`, `settings`. Code reads a `stage` object (`stage[title]*`, `stage[cover_bg]`), and the route is marked `//Todo:: will delete later` in favour of `PUT /projects/{board_id}/update-stage-property/{stage_id}` (undocumented).
   - `tasks.md` "Update task" lists properties. Code expects `property` + `value` pairs, so check that the example matches.
8. **Sidebar schema:** `rest-api.js` (and every other sidebar file) uses the VuePress v1 shape (`title` / `collapsable` / `children: [[path, label]]`), but the site runs on VitePress (`.vitepress/config.js`), which expects `text` / `items` / `link`. Check that the REST sidebar actually renders.

## Pages not linked from the sidebar

The sidebar links only: `index`, `authentication`, `boards`, `tasks`, `stages`, `labels`, `comments`, `subtasks`, `custom-fields`, `folders`, `users`, `extend`.

| Page | Content state | Recommendation |
|---|---|---|
| attachments.md | 5/6 routes correct | Add to sidebar |
| templates.md | 5 routes correct (of 14) | Add to sidebar and expand |
| time-tracking.md | 7/7 module routes correct | Add to sidebar |
| webhooks.md | 3/8 correct (missing PUT and all outgoing-webhooks) | Add to sidebar and expand |
| roadmaps.md | 13/14 correct (fluent-roadmap addon) | Add to sidebar and mark as addon |
| activities.md | Placeholder; 3 wrong + 4 stale | Rewrite (board/task/member activities) |
| notifications.md | Placeholder; 1 OK, 3 wrong, 4 stale | Rewrite |
| admin.md | Placeholder; 3 wrong (license) + 13 stale | Rewrite as admin settings / MCP / license |
| settings.md | Placeholder; 7 stale | Merge into admin |
| permissions.md | Placeholder; 12 stale | Replace with managers/roles |
| reports.md | Placeholder; 7 stale | Rewrite for the `/reports/*` routes |
| import-export.md | Placeholder; 7 stale | Rewrite for JSON/Trello/Asana/CSV import |
| cloud-storage.md | Placeholder; 7 stale | Rewrite for `/admin/storage-settings` |
| shared/error-responses.md | Linked from subtasks/stages; not excluded in `srcExclude` | Fine (partial) |

## Per-group summary

| Group | Live routes | Documented OK | Wrong-only | Missing | Stale doc entries | Doc page(s) | In sidebar? |
|---|---|---|---|---|---|---|---|
| Boards | 29 | 8 | 0 | 21 | 0 | boards.md | yes |
| Board members & invitations | 11 | 8 | 0 | 3 | 2 | users.md | yes |
| Tasks | 28 | 7 | 0 | 21 | 0 | tasks.md | yes |
| Subtasks | 12 | 11 | 0 | 1 | 0 | subtasks.md | yes |
| Task dependencies | 4 | 0 | 0 | 4 | 0 | — | — |
| Recurring tasks | 2 | 0 | 0 | 2 | 0 | — | — |
| Comments | 8 | 4 | 1 | 3 | 0 | comments.md | yes |
| Attachments | 6 | 5 | 0 | 1 | 0 | attachments.md | no |
| Activities | 3 | 2 | 0 | 1 | 4 | activities.md (+boards/tasks) | no |
| Stages | 15 | 9 | 0 | 6 | 0 | stages.md | yes |
| Labels | 8 | 8 | 0 | 0 | 0 | labels.md | yes |
| Custom fields | 7 | 7 | 0 | 0 | 0 | custom-fields.md | yes |
| Templates | 14 | 5 | 0 | 9 | 0 | templates.md | no |
| Folders | 7 | 6 | 0 | 1 | 0 | folders.md | yes |
| Time tracking | 7 | 7 | 0 | 0 | 0 | time-tracking.md | no |
| Notifications | 8 | 1 | 3 | 4 | 4 | notifications.md | no |
| Member profile (users) | 9 | 0 | 1 | 8 | 0 | — | — |
| Managers & global roles (admin) | 7 | 1 | 0 | 6 | 16 | users.md, permissions.md | partial |
| Webhooks | 8 | 3 | 0 | 5 | 0 | webhooks.md | no |
| Reports | 5 | 0 | 0 | 5 | 7 | reports.md | no |
| AI | 7 | 0 | 0 | 7 | 0 | — | — |
| Import / export | 14 | 0 | 0 | 14 | 7 | import-export.md | no |
| Cloud storage | 2 | 0 | 0 | 2 | 7 | cloud-storage.md | no |
| Admin settings & MCP | 10 | 0 | 0 | 10 | 20 | admin.md, settings.md | no |
| License (pro) | 3 | 0 | 3 | 0 | 0 | admin.md | no |
| Public boards | 4 | 0 | 0 | 4 | 0 | — | — |
| Quick-access tasks, dashboard & global utilities | 13 | 0 | 0 | 13 | 0 | — | — |
| Roadmap (fluent-roadmap addon) | 14 | 13 | 0 | 1 | 0 | roadmaps.md | no |

## Route inventory by group

Docs column: `Documented (file:line)` = path and method match. `WRONG doc` = documented only with a wrong path or method. `MISSING` = no doc. Each group's wrong and stale doc entries follow its table.

### Boards

| # | Method | Path | Controller@method | Policy | Src | Main params (`*` = required) | Docs |
|---|---|---|---|---|---|---|---|
| 1 | GET | `/projects` | BoardController@getBoards | AuthPolicy | free | `per_page`, `type`, `order`, `orderBy`, `searchInput`, `option`, `fid` | Documented (boards.md:10) |
| 2 | POST | `/projects` | BoardController@create | AuthPolicy | free | `board`, `folder_id`, `background`, `labels`, `stages`, `title*`, `description`, `type*`, `currency`, `crm_contact_id`, `slug`, `position` | Documented (boards.md:169) |
| 3 | GET | `/projects/get-default-board-colors` | BoardController@getBoardDefaultBackgroundColors | AuthPolicy | free | — | **MISSING** |
| 4 | GET | `/projects/list-of-boards` | BoardController@getBoardsList | AuthPolicy | free | — | **MISSING** |
| 5 | GET | `/projects/user-accessible-boards` | BoardController@getOnlyBoardsByUser | AuthPolicy | free | `searchInput` | **MISSING** |
| 6 | GET | `/projects/crm-associated-boards/{associated_id}` | BoardController@getAssociatedBoards | AuthPolicy | free | — | **MISSING** |
| 7 | GET | `/projects/currencies` | BoardController@getCurrencies | AuthPolicy | free | — | **MISSING** |
| 8 | GET | `/projects/user-admin-in-boards` | BoardController@getUsersOfBoards | AuthPolicy | free | — | **MISSING** |
| 9 | GET | `/projects/recent-boards` | BoardController@getRecentBoards | AuthPolicy | free | — | **MISSING** |
| 10 | GET | `/projects/pinned-boards` | BoardController@getPinnedBoards | AuthPolicy | free | — | **MISSING** |
| 11 | POST | `/projects/onboard` | BoardController@createFirstBoard | AuthPolicy | free | `board`, `withFluentCRM`, `stages`, `task`, `title*`, `description`, `type*`, `currency`, `crm_contact_id` | **MISSING** |
| 12 | PUT | `/projects/skip-onboarding` | BoardController@skipOnboarding | AuthPolicy | free | — | **MISSING** |
| 13 | GET | `/projects/{board_id}` | BoardController@find | SingleBoardPolicy | free | `include_archived` | Documented (boards.md:85) |
| 14 | GET | `/projects/{board_id}/has-data-changed` | BoardController@hasDataChanged | SingleBoardPolicy | free | `include_archived`, `since` | **MISSING** |
| 15 | PUT | `/projects/{board_id}/update-board-properties` | BoardController@updateBoardProperties | SingleBoardPolicy | free | `page_id`, `enable_stage_change_email` | **MISSING** |
| 16 | PUT | `/projects/{board_id}` | BoardController@update | SingleBoardPolicy | free | `title`, `description` | Documented (boards.md:229) |
| 17 | DELETE | `/projects/{board_id}` | BoardController@delete | SingleBoardPolicy | free | — | Documented (boards.md:305) |
| 18 | PUT | `/projects/{board_id}/pin-board` | BoardController@pinBoard | SingleBoardPolicy | free | — | **MISSING** |
| 19 | PUT | `/projects/{board_id}/unpin-board` | BoardController@unpinBoard | SingleBoardPolicy | free | — | **MISSING** |
| 20 | POST | `/projects/{board_id}/crm-contact` | BoardController@updateAssociateCrmContact | SingleBoardPolicy | free | `value` | **MISSING** |
| 21 | GET | `/projects/{board_id}/crm-contacts` | BoardController@getAssociateCrmContacts | SingleBoardPolicy | free | — | **MISSING** |
| 22 | POST | `/projects/{board_id}/duplicate-board` | BoardController@duplicateBoard | SingleBoardPolicy | free | `board`, `isWithLabels`, `isWithTasks`, `isWithMembers`, `isWithCustomFields`, `isWithTemplates`, `title*` | Documented (boards.md:408) |
| 23 | PUT | `/projects/{board_id}/upload/background` | BoardController@setBoardBackground | SingleBoardPolicy | free | `reset`, `image_url`, `color`, `id*`, (full body) | **MISSING** |
| 24 | POST | `/projects/{board_id}/upload/background-image` | BoardController@uploadBoardBackground | SingleBoardPolicy | free | `file`, `type`, (file upload) | **MISSING** |
| 25 | PUT | `/projects/{board_id}/archive-board` | BoardController@archiveBoard | SingleBoardPolicy | free | — | Documented (boards.md:332) |
| 26 | PUT | `/projects/{board_id}/restore-board` | BoardController@restoreBoard | SingleBoardPolicy | free | — | Documented (boards.md:370) |
| 27 | GET | `/projects/{board_id}/board-menu-items` | BoardController@getBoardMenuItems | SingleBoardPolicy | free | — | **MISSING** |
| 28 | GET | `/projects/{board_id}/public-access-settings` | BoardController@getPublicAccessSettings | SingleBoardPolicy | free | — | **MISSING** |
| 29 | PUT | `/projects/{board_id}/toggle-public-access` | BoardController@togglePublicAccess | SingleBoardPolicy | free | `enabled` | **MISSING** |

### Board members & invitations

| # | Method | Path | Controller@method | Policy | Src | Main params (`*` = required) | Docs |
|---|---|---|---|---|---|---|---|
| 1 | GET | `/projects/{board_id}/users` | BoardController@getBoardUsers | SingleBoardPolicy | free | — | Documented (boards.md:471, users.md:223) |
| 2 | POST | `/projects/{board_id}/user/{user_id}/remove` | BoardController@removeUserFromBoard | SingleBoardPolicy | free | — | Documented (users.md:320) |
| 3 | POST | `/projects/{board_id}/add-members` | BoardController@addMembersInBoard | SingleBoardPolicy | free | `memberId`, `isViewerOnly` | Documented (users.md:270) |
| 4 | GET | `/projects/{board_id}/assignees` | BoardController@getAssigneesByBoard | SingleBoardPolicy | free | — | Documented (users.md:683) |
| 5 | POST | `/projects/{board_id}/send-invitation` | ProBoardController@sendInvitationToBoard | SingleBoardPolicy | pro | `email*`, (full body) | **MISSING** |
| 6 | GET | `/projects/{board_id}/all-invitations` | ProBoardController@getInvitations | SingleBoardPolicy | pro | — | **MISSING** |
| 7 | DELETE | `/projects/{board_id}/invitation/{invitation_id}` | ProBoardController@deleteInvitation | SingleBoardPolicy | pro | — | **MISSING** |
| 8 | POST | `/projects/{board_id}/user/{user_id}/make-manager` | BoardUserController@makeManager | SingleBoardPolicy | pro | — | Documented (users.md:347) |
| 9 | POST | `/projects/{board_id}/user/{user_id}/remove-manager` | BoardUserController@removeManager | SingleBoardPolicy | pro | — | Documented (users.md:388) |
| 10 | POST | `/projects/{board_id}/user/{user_id}/make-viewer` | BoardUserController@makeViewer | SingleBoardPolicy | pro | — | Documented (users.md:470) |
| 11 | POST | `/projects/{board_id}/user/{user_id}/make-member` | BoardUserController@makeMember | SingleBoardPolicy | pro | — | Documented (users.md:429) |

**Documented but NO LONGER EXISTS (stale)**

| Doc | Documented route | Note |
|---|---|---|
| users.md:15 | GET `/fluent-boards-users` | No route. `UserController@allFluentBoardsUsers` exists but is unrouted; nearest live: `GET /ajax-options?option_key=…` / `GET /options/members` |
| users.md:95 | GET `/search-fluent-boards-users` | No route. `UserController@searchFluentBoardsUser` exists but is unrouted |

### Tasks

| # | Method | Path | Controller@method | Policy | Src | Main params (`*` = required) | Docs |
|---|---|---|---|---|---|---|---|
| 1 | GET | `/projects/{board_id}/archived-tasks` | TaskController@getArchivedTasks | SingleBoardPolicy | free | `per_page`, `page`, `searchInput` | **MISSING** |
| 2 | PUT | `/projects/{board_id}/bulk-restore-tasks` | TaskController@bulkRestoreTasks | SingleBoardPolicy | free | `task_ids` | **MISSING** |
| 3 | DELETE | `/projects/{board_id}/bulk-delete-tasks` | TaskController@bulkDeleteTasks | SingleBoardPolicy | free | `task_ids` | **MISSING** |
| 4 | GET | `/projects/{board_id}/tasks` | TaskController@getTasksByBoard | SingleBoardPolicy | free | `include_archived` | Documented (tasks.md:11) |
| 5 | GET | `/projects/{board_id}/tasks/filtered` | TaskController@getFilteredBoardTasks | SingleBoardPolicy | free | `search`, `include_archived`, `stage`, `task_status`, `priority`, `assignee`, `labels`, `watchers`, `contact`, `custom_fields`, `due_date` | **MISSING** |
| 6 | GET | `/projects/{board_id}/tasks/table` | TaskController@getTableTasks | SingleBoardPolicy | free | `page`, `per_page`, `sort_by`, `sort_direction`, `search`, `include_archived`, `stage`, `task_status`, `priority`, `assignee`, `labels`, `watchers`, `…` | **MISSING** |
| 7 | GET | `/projects/{board_id}/tasks/by-stage` | TaskController@getTasksByBoardStage | SingleBoardPolicy | free | `include_archived` | **MISSING** |
| 8 | GET | `/projects/{board_id}/tasks/stage-page` | TaskController@getStageTasksPage | SingleBoardPolicy | free | `include_archived`, `stage_id`, `limit`, `direction`, `cursor` | **MISSING** |
| 9 | POST | `/projects/{board_id}/tasks` | TaskController@create | SingleBoardPolicy | free | `task`, `title*`, `board_id*`, `stage_id*`, `priority`, `crm_contact_id`, `is_template` | Documented (tasks.md:153) |
| 10 | POST | `/projects/{board_id}/tasks/create-task-from-image` | TaskController@createTaskFromImage | SingleBoardPolicy | free | `stage_id`, `file`, (file upload) | **MISSING** |
| 11 | GET | `/projects/{board_id}/tasks/archived` | TaskController@getArchivedTasks | SingleBoardPolicy | free | `per_page`, `page`, `searchInput` | **MISSING** |
| 12 | GET | `/projects/{board_id}/tasks/{task_id}` | TaskController@find | SingleBoardPolicy | free | — | Documented (tasks.md:70) |
| 13 | PUT | `/projects/{board_id}/tasks/{task_id}` | TaskController@updateTaskProperties | SingleBoardPolicy | free | `property*`, `value` | Documented (tasks.md:230) |
| 14 | DELETE | `/projects/{board_id}/tasks/{task_id}/support-ticket` | TaskController@removeSupportTicketLink | SingleBoardPolicy | free | — | **MISSING** |
| 15 | POST | `/projects/{board_id}/tasks/{task_id}/dates` | TaskController@updateTaskDates | SingleBoardPolicy | free | `started_at`, `due_at`, `reminder_type`, `remind_at`, (full body) | **MISSING** |
| 16 | PUT | `/projects/{board_id}/tasks/{task_id}/move-task` | TaskController@moveTask | SingleBoardPolicy | free | `newStageId`, `newIndex`, `newBoardId`, `prevTaskId`, `nextTaskId`, `last_boards_updated` | Documented (tasks.md:324) |
| 17 | POST | `/projects/{board_id}/tasks/bulk-actions` | TaskController@bulkActions | SingleBoardPolicy | free | `task_ids`, `action` | **MISSING** |
| 18 | POST | `/projects/{board_id}/tasks/update-cover-photo/{task_id}` | TaskController@updateTaskCoverPhoto | SingleBoardPolicy | free | `thumbnail` | **MISSING** |
| 19 | POST | `/projects/{board_id}/tasks/status-update/{task_id}` | TaskController@taskStatusUpdate | SingleBoardPolicy | free | `integrationType` | **MISSING** |
| 20 | DELETE | `/projects/{board_id}/tasks/{task_id}` | TaskController@deleteTask | SingleBoardPolicy | free | — | Documented (tasks.md:297) |
| 21 | PUT | `/projects/{board_id}/tasks/{task_id}/move-to-next-stage` | TaskController@moveTaskToNextStage | SingleBoardPolicy | free | — | **MISSING** |
| 22 | PUT | `/projects/{board_id}/tasks/{task_id}/pin` | TaskController@toggleTaskPinned | SingleBoardPolicy | free | `pinned` | **MISSING** |
| 23 | POST | `/projects/{board_id}/tasks/{task_id}/assign-yourself` | TaskController@assignYourselfInTask | SingleBoardPolicy | free | — | **MISSING** |
| 24 | POST | `/projects/{board_id}/tasks/{task_id}/detach-yourself` | TaskController@detachYourselfFromTask | SingleBoardPolicy | free | — | **MISSING** |
| 25 | POST | `/projects/{board_id}/tasks/{task_id}/task-cover-image-upload` | TaskController@handleTaskCoverImageUpload | SingleBoardPolicy | free | `file`, (file upload) | **MISSING** |
| 26 | POST | `/projects/{board_id}/tasks/{task_id}/remove-task-cover` | TaskController@removeTaskCover | SingleBoardPolicy | free | — | **MISSING** |
| 27 | POST | `/projects/{board_id}/tasks/{task_id}/wp-editor-media-file-upload` | TaskController@uploadMediaFileFromWpEditor | SingleBoardPolicy | free | `file`, (file upload) | **MISSING** |
| 28 | POST | `/projects/{board_id}/tasks/{task_id}/clone-task` | TaskController@cloneTask | SingleBoardPolicy | free | `title`, `stage_id`, `assignee`, `subtask`, `label`, `attachment`, `comment` | Documented (tasks.md:381) |

### Subtasks

| # | Method | Path | Controller@method | Policy | Src | Main params (`*` = required) | Docs |
|---|---|---|---|---|---|---|---|
| 1 | PUT | `/projects/{board_id}/tasks/update-subtask-position/{subtask_id}` | SubtaskController@updateSubtaskPosition | SingleBoardPolicy | pro | `newPosition*`, `newSubtasksGroupId*`, (full body) | Documented (subtasks.md:427) |
| 2 | GET | `/projects/{board_id}/tasks/{task_id}/subtasks` | SubtaskController@getSubtasks | SingleBoardPolicy | pro | — | Documented (subtasks.md:60) |
| 3 | PUT | `/projects/{board_id}/tasks/{task_id}/move-to-board` | SubtaskController@moveToBoard | SingleBoardPolicy | pro | `stage_id*`, (full body) | Documented (subtasks.md:599) |
| 4 | DELETE | `/projects/{board_id}/tasks/{task_id}/delete-subtask` | SubtaskController@deleteSubtasks | SingleBoardPolicy | pro | — | Documented (subtasks.md:319) |
| 5 | POST | `/projects/{board_id}/tasks/{task_id}/subtask-group` | SubtaskController@createSubtaskGroup | SingleBoardPolicy | pro | `title*`, (full body) | Documented (subtasks.md:199) |
| 6 | PUT | `/projects/{board_id}/tasks/{task_id}/subtask-group` | SubtaskController@updateSubtaskGroup | SingleBoardPolicy | pro | `title*`, `group_id*`, (full body) | Documented (subtasks.md:241) |
| 7 | DELETE | `/projects/{board_id}/tasks/{task_id}/subtask-group` | SubtaskController@deleteSubtaskGroup | SingleBoardPolicy | pro | `group_id` | Documented (subtasks.md:285) |
| 8 | POST | `/projects/{board_id}/tasks/{task_id}/subtasks` | SubtaskController@createSubtask | SingleBoardPolicy | pro | `title*`, (full body) | Documented (subtasks.md:131) |
| 9 | POST | `/projects/{board_id}/tasks/{task_id}/subtasks/bulk` | SubtaskController@createBulkSubtasks | SingleBoardPolicy | pro | `titles`, `group_title` | **MISSING** |
| 10 | POST | `/projects/{board_id}/tasks/{task_id}/move-subtask` | SubtaskController@moveSubtask | SingleBoardPolicy | pro | `group_id*`, `subtask_id*`, (full body) | Documented (subtasks.md:385) |
| 11 | PUT | `/projects/{board_id}/tasks/{task_id}/convert-to-subtask` | SubtaskController@ConvertTaskToSubtask | SingleBoardPolicy | pro | `parent_id`, `assigneeId`, `subtaskGroupId` | Documented (subtasks.md:513) |
| 12 | POST | `/projects/{board_id}/tasks/{task_id}/clone-subtask` | SubtaskController@cloneSubtask | SingleBoardPolicy | pro | — | Documented (subtasks.md:675) |

### Task dependencies

| # | Method | Path | Controller@method | Policy | Src | Main params (`*` = required) | Docs |
|---|---|---|---|---|---|---|---|
| 1 | GET | `/projects/{board_id}/dependencies` | DependencyController@getBoardDependencies | SingleBoardPolicy | pro | — | **MISSING** |
| 2 | GET | `/projects/{board_id}/tasks/{task_id}/dependencies` | DependencyController@getTaskDependencies | SingleBoardPolicy | pro | — | **MISSING** |
| 3 | POST | `/projects/{board_id}/tasks/{task_id}/dependencies` | DependencyController@addDependency | SingleBoardPolicy | pro | `predecessor_task_id`, `successor_task_id` | **MISSING** |
| 4 | DELETE | `/projects/{board_id}/tasks/{task_id}/dependencies/{related_task_id}` | DependencyController@removeDependency | SingleBoardPolicy | pro | — | **MISSING** |

### Recurring tasks

| # | Method | Path | Controller@method | Policy | Src | Main params (`*` = required) | Docs |
|---|---|---|---|---|---|---|---|
| 1 | POST | `/projects/{board_id}/tasks/{task_id}/create-repeat-task` | ProTaskController@createOrUpdateTaskRepeatMeta | SingleBoardPolicy | pro | `selected_repeat_week_days`, `selected_month_days`, `create_new*`, `repeat_in*`, `repeat_type*`, `repeat_when_complete*`, `selected_month*`, `time*`, `time_zone*`, `next_repeat_date*`, `repeat_in_month_type*`, `selected_stage*`, `…` | **MISSING** |
| 2 | DELETE | `/projects/{board_id}/tasks/{task_id}/remove-repeat-task` | ProTaskController@removeRepeatTaskMeta | SingleBoardPolicy | pro | — | **MISSING** |

### Comments

| # | Method | Path | Controller@method | Policy | Src | Main params (`*` = required) | Docs |
|---|---|---|---|---|---|---|---|
| 1 | GET | `/projects/{board_id}/tasks/{task_id}/comments` | CommentController@getComments | SingleBoardPolicy | free | `filter` | Documented (comments.md:11, tasks.md:421) |
| 2 | POST | `/projects/{board_id}/tasks/{task_id}/comments` | CommentController@create | SingleBoardPolicy | free | `parent_id`, `comment`, `comment_type`, `description*`, `created_by*`, `board_id*`, `task_id*`, `type*` | Documented (comments.md:113, comments.md:439) |
| 3 | PUT | `/projects/{board_id}/tasks/comments/{comment_id}` | CommentController@update | SingleBoardPolicy | free | `comment`, `description*` | **WRONG** doc (comments.md:298) |
| 4 | PUT | `/projects/{board_id}/tasks/reply/{reply_id}` | CommentController@updateReply | SingleBoardPolicy | free | `comment`, `description*` | **MISSING** |
| 5 | DELETE | `/projects/{board_id}/tasks/comments/{comment_id}` | CommentController@deleteComment | SingleBoardPolicy | free | — | Documented (comments.md:407) |
| 6 | DELETE | `/projects/{board_id}/tasks/reply/{reply_id}` | CommentController@deleteReply | SingleBoardPolicy | free | — | **MISSING** |
| 7 | PUT | `/projects/{board_id}/tasks/comments/{comment_id}/privacy` | CommentController@updateCommentPrivacy | SingleBoardPolicy | free | — | **MISSING** |
| 8 | POST | `/projects/{board_id}/tasks/{task_id}/comment-image-upload` | CommentController@handleImageUpload | SingleBoardPolicy | free | `file`, (file upload) | Documented (comments.md:573) |

**Documented but WRONG**

| Doc | Documented | Actual route | What's wrong |
|---|---|---|---|
| comments.md:298 | PUT `/projects/{board_id}/tasks/{task_id}/comments/{comment_id}` | `PUT /projects/{board_id}/tasks/comments/{comment_id}` | Path has extra `{task_id}` segment; real route has no task_id |

### Attachments

| # | Method | Path | Controller@method | Policy | Src | Main params (`*` = required) | Docs |
|---|---|---|---|---|---|---|---|
| 1 | DELETE | `/tasks/{task_id}/attachment-delete/{attachment_id}` | AttachmentController@deleteTaskAttachment | BoardUserPolicy | pro | — | Documented (attachments.md:295) |
| 2 | POST | `/tasks/{task_id}/add-attachment` | AttachmentController@addTaskAttachment | BoardUserPolicy | pro | `title`, `url*`, (full body) | Documented (attachments.md:177) |
| 3 | PUT | `/tasks/{task_id}/attachment-update/{attachment_id}` | AttachmentController@updateTaskAttachment | BoardUserPolicy | pro | `title*`, (full body) | Documented (attachments.md:236) |
| 4 | GET | `/projects/{board_id}/tasks/{task_id}/attachment` | AttachmentController@getAttachments | SingleBoardPolicy | pro | — | Documented (attachments.md:37) |
| 5 | POST | `/projects/{board_id}/tasks/{task_id}/add-task-attachment-file` | AttachmentController@addTaskAttachmentFile | SingleBoardPolicy | pro | `file`, (file upload) | Documented (attachments.md:96) |
| 6 | POST | `/projects/{board_id}/tasks/{task_id}/add-task-attachment-file-chunk` | AttachmentController@addTaskAttachmentFileChunk | SingleBoardPolicy | pro | `file_name`, `file_size`, `chunk_index`, `total_chunks`, `upload_id`, `file`, (file upload) | **MISSING** |

### Activities

| # | Method | Path | Controller@method | Policy | Src | Main params (`*` = required) | Docs |
|---|---|---|---|---|---|---|---|
| 1 | GET | `/projects/{board_id}/activities` | BoardController@getActivities | SingleBoardPolicy | free | `per_page`, `page` | Documented (boards.md:519) |
| 2 | GET | `/projects/{board_id}/tasks/{task_id}/activities` | TaskController@getActivities | SingleBoardPolicy | free | `filter` | Documented (tasks.md:519) |
| 3 | GET | `/projects/{board_id}/tasks/{task_id}/comments-and-activities` | TaskController@getCommentsAndActivities | SingleBoardPolicy | free | `page`, `per_page`, `filter`, `feed_type` | **MISSING** |

**Documented but WRONG**

| Doc | Documented | Actual route | What's wrong |
|---|---|---|---|
| activities.md:19 | GET `/boards/{board_id}/activities` | `GET /projects/{board_id}/activities` | Uses `/boards/` prefix; real prefix is `/projects/` |
| activities.md:20 | GET `/boards/{board_id}/tasks/{task_id}/activities` | `GET /projects/{board_id}/tasks/{task_id}/activities` | Uses `/boards/` prefix; real prefix is `/projects/` |
| activities.md:26 | GET `/users/{user_id}/activities` | `GET /member/{id}/activities` | Real route is `/member/{id}/activities` |

**Documented but NO LONGER EXISTS (stale)**

| Doc | Documented route | Note |
|---|---|---|
| activities.md:18 | GET `/activities` | placeholder page ("under development"); invented endpoints |
| activities.md:23 | GET `/activities/{activity_id}` | placeholder page ("under development"); invented endpoints |
| activities.md:29 | GET `/activities/summary` | placeholder page ("under development"); invented endpoints |
| activities.md:32 | POST `/activities/export` | placeholder page ("under development"); invented endpoints |

### Stages

| # | Method | Path | Controller@method | Policy | Src | Main params (`*` = required) | Docs |
|---|---|---|---|---|---|---|---|
| 1 | PUT | `/projects/{board_id}/stage-move-all-task` | BoardController@moveAllTasks | SingleBoardPolicy | free | `oldStageId`, `newStageId` | **MISSING** |
| 2 | POST | `/projects/{board_id}/stage-create` | BoardController@createStage | SingleBoardPolicy | free | `title*`, `position`, (full body) | Documented (stages.md:11) |
| 3 | PUT | `/projects/{board_id}/stage/{stage_id}/sort-task` | StageController@sortStageTasks | SingleBoardPolicy | free | `order`, `orderBy` | Documented (stages.md:318) |
| 4 | PUT | `/projects/{board_id}/stage/{stage_id}/archive-all-task` | BoardController@archiveAllTasksInStage | SingleBoardPolicy | free | — | Documented (stages.md:279) |
| 5 | PUT | `/projects/{board_id}/re-position-stages` | BoardController@repositionStages | SingleBoardPolicy | free | `list` | Documented (stages.md:209) |
| 6 | PUT | `/projects/{board_id}/update-stage/{stage_id}` | StageController@updateStage | SingleBoardPolicy | free | `stage`, `title*`, `cover_bg` | Documented (stages.md:71) |
| 7 | PUT | `/projects/{board_id}/update-stage-property/{stage_id}` | StageController@updateStageProperty | SingleBoardPolicy | free | `property`, `value` | **MISSING** |
| 8 | PUT | `/projects/{board_id}/archive-stage/{stage_id}` | BoardController@archiveStage | SingleBoardPolicy | free | — | Documented (stages.md:124) |
| 9 | PUT | `/projects/{board_id}/stage-view/{stage_id}` | BoardController@changeStageView | SingleBoardPolicy | free | — | **MISSING** |
| 10 | PUT | `/projects/{board_id}/restore-stage/{stage_id}` | BoardController@restoreStage | SingleBoardPolicy | free | — | Documented (stages.md:166) |
| 11 | PUT | `/projects/{board_id}/drag-stage` | StageController@dragStage | SingleBoardPolicy | free | `stageId`, `newPosition` | **MISSING** |
| 12 | GET | `/projects/{board_id}/archived-stages` | BoardController@getArchivedStage | SingleBoardPolicy | free | `noPagination`, `per_page`, `page` | Documented (stages.md:370) |
| 13 | GET | `/projects/{board_id}/stage-task-available-positions/{stage_id}` | BoardController@getStageTaskAvailablePositions | SingleBoardPolicy | free | `task_id` | Documented (stages.md:449) |
| 14 | PUT | `/projects/{board_id}/stage/{stage_id}/default-assignees` | ProBoardController@setDefaultAssignees | SingleBoardPolicy | pro | `assigneeIds` | **MISSING** |
| 15 | PUT | `/projects/{board_id}/stage/{stage_id}/default-watchers` | ProBoardController@setDefaultWatchers | SingleBoardPolicy | pro | `watcherIds` | **MISSING** |

### Labels

| # | Method | Path | Controller@method | Policy | Src | Main params (`*` = required) | Docs |
|---|---|---|---|---|---|---|---|
| 1 | GET | `/projects/{board_id}/labels` | LabelController@getLabelsByBoard | SingleBoardPolicy | free | — | Documented (labels.md:10) |
| 2 | POST | `/projects/{board_id}/labels` | LabelController@createLabel | SingleBoardPolicy | free | `bg_color`, `color`, `color_preset`, `label` | Documented (labels.md:70) |
| 3 | GET | `/projects/{board_id}/labels/used-in-tasks` | LabelController@getLabelsByBoardUsedInTasks | SingleBoardPolicy | free | — | Documented (labels.md:181) |
| 4 | GET | `/projects/{board_id}/tasks/{task_id}/labels` | LabelController@getLabelsByTask | SingleBoardPolicy | free | — | Documented (labels.md:241) |
| 5 | POST | `/projects/{board_id}/labels/task` | LabelController@createLabelForTask | SingleBoardPolicy | free | `taskId`, `labelId`, `task_id*`, `board_term_id*` | Documented (labels.md:301) |
| 6 | PUT | `/projects/{board_id}/labels/{label_id}` | LabelController@editLabelofBoard | SingleBoardPolicy | free | `bg_color`, `color`, `color_preset`, `label` | Documented (labels.md:114) |
| 7 | DELETE | `/projects/{board_id}/labels/{label_id}` | LabelController@deleteLabelOfBoard | SingleBoardPolicy | free | — | Documented (labels.md:163) |
| 8 | DELETE | `/projects/{board_id}/tasks/{task_id}/labels/{label_id}` | LabelController@deleteLabelOfTask | SingleBoardPolicy | free | — | Documented (labels.md:355) |

### Custom fields

| # | Method | Path | Controller@method | Policy | Src | Main params (`*` = required) | Docs |
|---|---|---|---|---|---|---|---|
| 1 | GET | `/projects/{board_id}/custom-fields` | CustomFieldController@getCustomFields | SingleBoardPolicy | pro | — | Documented (custom-fields.md:53) |
| 2 | POST | `/projects/{board_id}/custom-field` | CustomFieldController@createCustomField | SingleBoardPolicy | pro | `customField`, `title*`, `type*` | Documented (custom-fields.md:94) |
| 3 | PUT | `/projects/{board_id}/custom-field/{custom_field_id}` | CustomFieldController@updateCustomField | SingleBoardPolicy | pro | `customField`, `title*`, `type*` | Documented (custom-fields.md:141) |
| 4 | PUT | `/projects/{board_id}/custom-field/{custom_field_id}/update-position` | CustomFieldController@updateCustomFieldPosition | SingleBoardPolicy | pro | `newIndex` | Documented (custom-fields.md:191) |
| 5 | DELETE | `/projects/{board_id}/custom-field/{custom_field_id}` | CustomFieldController@deleteCustomField | SingleBoardPolicy | pro | — | Documented (custom-fields.md:223) |
| 6 | GET | `/projects/{board_id}/tasks/{task_id}/custom-fields` | CustomFieldController@getCustomFieldsByTask | SingleBoardPolicy | pro | — | Documented (custom-fields.md:247) |
| 7 | POST | `/projects/{board_id}/tasks/{task_id}/custom-fields` | CustomFieldController@saveCustomFieldDataOfTask | SingleBoardPolicy | pro | `custom_field_id`, `value` | Documented (custom-fields.md:282) |

### Templates

| # | Method | Path | Controller@method | Policy | Src | Main params (`*` = required) | Docs |
|---|---|---|---|---|---|---|---|
| 1 | POST | `/projects/{board_id}/import-from-board` | BoardController@importFromBoard | SingleBoardPolicy | free | `selectedStages`, `position` | Documented (templates.md:94) |
| 2 | GET | `/templates` | TemplateController@getTemplates | BoardUserPolicy | pro | — | **MISSING** |
| 3 | GET | `/templates/default` | TemplateController@getDefaultTemplates | BoardUserPolicy | pro | — | **MISSING** |
| 4 | GET | `/templates/user` | TemplateController@getUserTemplates | BoardUserPolicy | pro | — | **MISSING** |
| 5 | GET | `/templates/preview` | TemplateController@getTemplatePreview | BoardUserPolicy | pro | `template_type`, `template_id` | **MISSING** |
| 6 | GET | `/templates/task-creation-status` | TemplateController@getTaskCreationStatus | BoardUserPolicy | pro | `board_id` | **MISSING** |
| 7 | GET | `/projects/template-stages` | ProBoardController@getTemplateStages | BoardUserPolicy | pro | — | Documented (templates.md:14) |
| 8 | GET | `/projects/get-template-tasks` | ProBoardController@getTemplateTasks | BoardUserPolicy | pro | — | Documented (templates.md:43) |
| 9 | PUT | `/projects/{board_id}/make-template` | TemplateController@makeTemplate | SingleBoardPolicy | pro | `template_description`, `template_category`, (full body) | **MISSING** |
| 10 | PUT | `/projects/{board_id}/convert-to-board` | TemplateController@convertToBoard | SingleBoardPolicy | pro | — | **MISSING** |
| 11 | PUT | `/projects/{board_id}/update-template-settings` | TemplateController@updateTemplateSettings | SingleBoardPolicy | pro | `template_description`, `template_category`, (full body) | **MISSING** |
| 12 | PUT | `/projects/{board_id}/stage/{stage_id}/update-stage-template` | ProBoardController@updateStageTemplate | SingleBoardPolicy | pro | — | Documented (templates.md:68) |
| 13 | POST | `/projects/{board_id}/tasks/{task_id}/task-create-from-template` | ProBoardController@createFromTemplate | SingleBoardPolicy | pro | `title*`, `board_id*`, `stage_id*`, `assignee*`, `subtask*`, `label*`, `attachment*`, (full body) | Documented (templates.md:118) |
| 14 | POST | `/templates/create-from` | TemplateController@createBoardFromTemplate | TemplateCreationPolicy | pro | `title*`, `template_type*`, `template_id*`, `include_tasks`, `include_labels`, `selected_stage_ids`, `additional_stages`, `selected_labels`, (full body) | **MISSING** |

### Folders

| # | Method | Path | Controller@method | Policy | Src | Main params (`*` = required) | Docs |
|---|---|---|---|---|---|---|---|
| 1 | GET | `/admin/folders` | FolderController@getFolders | AdminPolicy | free | — | Documented (folders.md:28) |
| 2 | POST | `/admin/folders` | FolderController@createFolder | AdminPolicy | free | `title*`, (full body) | Documented (folders.md:61) |
| 3 | GET | `/admin/folders/{folder_id}` | FolderController@getFolderById | AdminPolicy | free | `order`, `orderBy`, `searchInput`, `option` | **MISSING** |
| 4 | POST | `/admin/folders/{folder_id}/add-board` | FolderController@addBoardToFolder | AdminPolicy | free | `board_ids` | Documented (folders.md:161) |
| 5 | POST | `/admin/folders/{folder_id}/remove-board` | FolderController@removeBoardFromFolder | AdminPolicy | free | `board_id` | Documented (folders.md:195) |
| 6 | PUT | `/admin/folders/{folder_id}` | FolderController@updateFolder | AdminPolicy | free | `title` | Documented (folders.md:99) |
| 7 | DELETE | `/admin/folders/{folder_id}` | FolderController@deleteFolder | AdminPolicy | free | — | Documented (folders.md:137) |

### Time tracking

| # | Method | Path | Controller@method | Policy | Src | Main params (`*` = required) | Docs |
|---|---|---|---|---|---|---|---|
| 1 | GET | `/projects/{board_id}/tasks/{task_id}/time-tracks` | TimeTrackController@getTracks | SingleBoardPolicy | pro | — (class missing) | n/a — **dead route** (controller class missing) |
| 2 | POST | `/projects/{board_id}/tasks/{task_id}/time-tracks/start` | TimeTrackController@startTrack | SingleBoardPolicy | pro | — (class missing) | n/a — **dead route** (controller class missing) |
| 3 | POST | `/projects/{board_id}/tasks/{task_id}/time-tracks/pause` | TimeTrackController@pauseTrack | SingleBoardPolicy | pro | — (class missing) | n/a — **dead route** (controller class missing) |
| 4 | POST | `/projects/{board_id}/tasks/{task_id}/time-tracks/stop` | TimeTrackController@stopTrack | SingleBoardPolicy | pro | — (class missing) | n/a — **dead route** (controller class missing) |
| 5 | POST | `/projects/{board_id}/tasks/{task_id}/time-tracks/commit` | TimeTrackController@commitTrack | SingleBoardPolicy | pro | — (class missing) | n/a — **dead route** (controller class missing) |
| 6 | PUT | `/projects/{board_id}/tasks/{task_id}/time-tracks/commit/{track_id}` | TimeTrackController@updateCommitTrack | SingleBoardPolicy | pro | — (class missing) | n/a — **dead route** (controller class missing) |
| 7 | POST | `/projects/{board_id}/tasks/{task_id}/time-tracks/commit-manually` | TimeTrackController@manualCommitTrack | SingleBoardPolicy | pro | — (class missing) | n/a — **dead route** (controller class missing) |
| 8 | GET | `/projects/{board_id}/tasks/{task_id}/time-tracks` | TT\TimeTrackController@getTracks | SingleBoardPolicy | pro (TimeTracking module) | — | Documented (time-tracking.md:40) |
| 9 | POST | `/projects/{board_id}/tasks/{task_id}/time-tracks` | TT\TimeTrackController@manualCommitTrack | SingleBoardPolicy | pro (TimeTracking module) | `billable_minutes`, `message`, `completed_at`, `started_at`, (full body) | Documented (time-tracking.md:108) |
| 10 | POST | `/projects/{board_id}/tasks/{task_id}/time-tracks/estimated-time` | TT\TimeTrackController@updateTimeEstimation | SingleBoardPolicy | pro (TimeTracking module) | `estimated_minutes` | Documented (time-tracking.md:180) |
| 11 | PUT | `/projects/{board_id}/tasks/{task_id}/time-tracks/commit/{track_id}` | TT\TimeTrackController@updateCommitTrack | SingleBoardPolicy | pro (TimeTracking module) | `billable_minutes`, `message`, `completed_at`, `started_at`, (full body) | Documented (time-tracking.md:254) |
| 12 | DELETE | `/projects/{board_id}/tasks/{task_id}/time-tracks/{track_id}` | TT\TimeTrackController@deleteTrack | SingleBoardPolicy | pro (TimeTracking module) | — | Documented (time-tracking.md:221) |
| 13 | GET | `/projects/timesheet/by-tasks` | TT\ReportController@getTracksByTasks | BoardManagerPolicy | pro (TimeTracking module) | `board_id`, `date_range` | Documented (time-tracking.md:304) |
| 14 | GET | `/projects/timesheet/by-users` | TT\ReportController@getTracksByUsers | BoardManagerPolicy | pro (TimeTracking module) | `board_id`, `date_range` | Documented (time-tracking.md:351) |

### Notifications

| # | Method | Path | Controller@method | Policy | Src | Main params (`*` = required) | Docs |
|---|---|---|---|---|---|---|---|
| 1 | POST | `/update-global-notification-settings` | OptionsController@updateGlobalNotificationSettings | BoardUserPolicy | free | `updatedSettings` | **WRONG** doc (notifications.md:39) |
| 2 | GET | `/get-global-notification-settings` | OptionsController@getGlobalNotificationSettings | BoardUserPolicy | free | — | **WRONG** doc (notifications.md:36) |
| 3 | GET | `/projects/{board_id}/notification-settings` | NotificationController@getBoardNotificationSettings | SingleBoardPolicy | free | — | **MISSING** |
| 4 | PUT | `/projects/{board_id}/update-notification-settings` | NotificationController@updateBoardNotificationSettings | SingleBoardPolicy | free | `updatedSettings` | **MISSING** |
| 5 | GET | `/notifications` | NotificationController@getAllNotifications | UserPolicy | free | `per_page`, `page`, `action` | Documented (notifications.md:18) |
| 6 | GET | `/notifications/unread` | NotificationController@getAllUnreadNotifications | UserPolicy | free | `per_page`, `page` | **MISSING** |
| 7 | GET | `/notifications/unread-count` | NotificationController@newNotificationNumber | UserPolicy | free | — | **MISSING** |
| 8 | PUT | `/notifications/read` | NotificationController@readNotification | UserPolicy | free | `notification_id` | **WRONG** doc (notifications.md:24) |

**Documented but WRONG**

| Doc | Documented | Actual route | What's wrong |
|---|---|---|---|
| notifications.md:24 | PUT `/notifications/{notification_id}/read` | `PUT /notifications/read` | Real path has no `{notification_id}`; id sent as `notification_id` body param |
| notifications.md:36 | GET `/notifications/settings` | `GET /get-global-notification-settings` | Real: `GET /get-global-notification-settings` |
| notifications.md:39 | PUT `/notifications/settings` | `POST /update-global-notification-settings` | Real: `POST /update-global-notification-settings` (method + path differ) |

**Documented but NO LONGER EXISTS (stale)**

| Doc | Documented route | Note |
|---|---|---|
| notifications.md:21 | GET `/notifications/{notification_id}` | placeholder page |
| notifications.md:27 | PUT `/notifications/read-all` | placeholder page |
| notifications.md:30 | DELETE `/notifications/{notification_id}` | placeholder page |
| notifications.md:33 | POST `/notifications/send` | placeholder page |

### Member profile (users)

| # | Method | Path | Controller@method | Policy | Src | Main params (`*` = required) | Docs |
|---|---|---|---|---|---|---|---|
| 1 | GET | `/member-associated-users/{id}` | UserController@memberAssociatedTaskUsers | BoardUserPolicy | free | — | **MISSING** |
| 2 | GET | `/member/{id}` | UserController@getMemberInfo | UserPolicy | free | — | **MISSING** |
| 3 | GET | `/member/{id}/projects` | UserController@getMemberBoards | UserPolicy | free | — | **MISSING** |
| 4 | GET | `/member/{id}/tasks` | UserController@getMemberAssociatedTasks | UserPolicy | free | `boardIds`, `per_page`, `page`, `taskType`, `orderBy`, `order` | **MISSING** |
| 5 | GET | `/member/{id}/task-counts` | UserController@getMemberTaskCounts | UserPolicy | free | `boardIds` | **MISSING** |
| 6 | GET | `/member/{id}/activities` | UserController@getMemberRelatedAcitivies | UserPolicy | free | `page` | **WRONG** doc (activities.md:26) |
| 7 | GET | `/member/{id}/stats` | UserController@getMemberStats | UserPolicy | free | — | **MISSING** |
| 8 | POST | `/member/{id}/display-name` | UserController@updateDisplayName | UserPolicy | free | `display_name` | **MISSING** |
| 9 | POST | `/member/{id}/photo` | UserController@updateProfilePhoto | UserPolicy | free | (file upload) | **MISSING** |

### Managers & global roles (admin)

| # | Method | Path | Controller@method | Policy | Src | Main params (`*` = required) | Docs |
|---|---|---|---|---|---|---|---|
| 1 | GET | `/managers` | BoardUserController@users | AdminPolicy | pro | — | **MISSING** |
| 2 | POST | `/managers` | BoardUserController@addUserToBoards | AdminPolicy | pro | `board_ids` | **MISSING** |
| 3 | POST | `/managers/add-admins` | BoardUserController@addAsAdmin | AdminPolicy | pro | `user_ids` | **MISSING** |
| 4 | POST | `/managers/add-users-to-boards` | BoardUserController@addUsersToBoards | AdminPolicy | pro | `board_ids`, `user_ids`, `is_viewer_only`, (full body) | **MISSING** |
| 5 | POST | `/managers/remove-admins` | BoardUserController@removeAdmins | AdminPolicy | pro | `user_ids` | **MISSING** |
| 6 | POST | `/managers/roles/{user_id}` | BoardUserController@syncBoardRoles | AdminPolicy | pro | `roles` | Documented (users.md:644) |
| 7 | DELETE | `/managers/roles/{user_id}` | BoardUserController@removeUserFromAllBoards | AdminPolicy | pro | — | **MISSING** |

**Documented but NO LONGER EXISTS (stale)**

| Doc | Documented route | Note |
|---|---|---|
| permissions.md:18 | GET `/permissions` | placeholder page; real role mgmt is `/managers/*` + board `user/{user_id}/make-*` |
| permissions.md:19 | GET `/permissions/{user_id}` | placeholder page; real role mgmt is `/managers/*` + board `user/{user_id}/make-*` |
| permissions.md:20 | GET `/permissions/project/{project_id}` | placeholder page; real role mgmt is `/managers/*` + board `user/{user_id}/make-*` |
| permissions.md:23 | PUT `/permissions/{user_id}` | placeholder page; real role mgmt is `/managers/*` + board `user/{user_id}/make-*` |
| permissions.md:24 | PUT `/permissions/project/{project_id}/user/{user_id}` | placeholder page; real role mgmt is `/managers/*` + board `user/{user_id}/make-*` |
| permissions.md:27 | GET `/permissions/roles` | placeholder page; real role mgmt is `/managers/*` + board `user/{user_id}/make-*` |
| permissions.md:28 | POST `/permissions/roles` | placeholder page; real role mgmt is `/managers/*` + board `user/{user_id}/make-*` |
| permissions.md:29 | PUT `/permissions/roles/{role_id}` | placeholder page; real role mgmt is `/managers/*` + board `user/{user_id}/make-*` |
| permissions.md:30 | DELETE `/permissions/roles/{role_id}` | placeholder page; real role mgmt is `/managers/*` + board `user/{user_id}/make-*` |
| permissions.md:33 | POST `/permissions/assign-role` | placeholder page; real role mgmt is `/managers/*` + board `user/{user_id}/make-*` |
| permissions.md:34 | DELETE `/permissions/remove-role` | placeholder page; real role mgmt is `/managers/*` + board `user/{user_id}/make-*` |
| permissions.md:37 | POST `/permissions/check` | placeholder page; real role mgmt is `/managers/*` + board `user/{user_id}/make-*` |
| users.md:509 | GET `/get-user-permissions` | No route. `OptionsController@getUserPermission` exists but is unrouted |
| users.md:545 | PUT `/update-user-permissions` | No route. `OptionsController@updatedUserPermission` unrouted; use pro `/managers/roles/{user_id}` or board `user/{user_id}/make-*` |
| users.md:580 | POST `/set-permission-all-board-admin` | No route. Nearest live: `POST /managers/add-admins` (pro) |
| users.md:605 | DELETE `/remove-user-from-board` | No route. Nearest live: `POST /projects/{board_id}/user/{user_id}/remove` |

### Webhooks

| # | Method | Path | Controller@method | Policy | Src | Main params (`*` = required) | Docs |
|---|---|---|---|---|---|---|---|
| 1 | GET | `/webhooks` | WebhookController@index | WebhookPolicy | free | `search` | Documented (webhooks.md:15) |
| 2 | POST | `/webhooks` | WebhookController@create | WebhookPolicy | free | `board`, `stage`, `name` | Documented (webhooks.md:216) |
| 3 | PUT | `/webhooks/{id}` | WebhookController@update | WebhookPolicy | free | `name` | **MISSING** |
| 4 | DELETE | `/webhooks/{id}` | WebhookController@delete | WebhookPolicy | free | — | Documented (webhooks.md:310) |
| 5 | GET | `/outgoing-webhooks` | WebhookController@outgoingWebhooks | WebhookPolicy | free | `search`, `board_id` | **MISSING** |
| 6 | POST | `/outgoing-webhooks` | WebhookController@createOutgoingWebhook | WebhookPolicy | free | `name`, `url`, `board_id`, `triggered_events`, `header_type`, `headers` | **MISSING** |
| 7 | PUT | `/outgoing-webhooks/{id}` | WebhookController@updateOutgoingWebhook | WebhookPolicy | free | `name*`, `url*`, `board_id`, `triggered_events`, (full body) | **MISSING** |
| 8 | DELETE | `/outgoing-webhooks/{id}` | WebhookController@deleteOutgoingWebhook | WebhookPolicy | free | — | **MISSING** |

### Reports

| # | Method | Path | Controller@method | Policy | Src | Main params (`*` = required) | Docs |
|---|---|---|---|---|---|---|---|
| 1 | GET | `/reports/timesheet` | ReportController@getTimeSheetReport | BoardUserPolicy | free | `start_date`, `end_date`, `board_id` | **MISSING** |
| 2 | GET | `/reports/overview` | ReportController@getOverviewReport | BoardUserPolicy | free | — | **MISSING** |
| 3 | GET | `/reports/tasks` | ReportController@getTasksReport | BoardUserPolicy | free | — | **MISSING** |
| 4 | GET | `/reports/activity` | ReportController@getActivityReport | BoardUserPolicy | free | — | **MISSING** |
| 5 | GET | `/reports/roadmap` | ReportController@getRoadmapReport | BoardUserPolicy | free | `start_date`, `end_date` | **MISSING** |

**Documented but NO LONGER EXISTS (stale)**

| Doc | Documented route | Note |
|---|---|---|
| reports.md:18 | GET `/reports` | placeholder page; real reports are `/reports/{overview|tasks|activity|roadmap|timesheet}` |
| reports.md:21 | POST `/reports/generate` | placeholder page; real reports are `/reports/{overview|tasks|activity|roadmap|timesheet}` |
| reports.md:24 | GET `/reports/{report_id}` | placeholder page; real reports are `/reports/{overview|tasks|activity|roadmap|timesheet}` |
| reports.md:27 | GET `/reports/{report_id}/download` | placeholder page; real reports are `/reports/{overview|tasks|activity|roadmap|timesheet}` |
| reports.md:30 | POST `/reports/schedule` | placeholder page; real reports are `/reports/{overview|tasks|activity|roadmap|timesheet}` |
| reports.md:33 | GET `/reports/scheduled` | placeholder page; real reports are `/reports/{overview|tasks|activity|roadmap|timesheet}` |
| reports.md:36 | DELETE `/reports/scheduled/{schedule_id}` | placeholder page; real reports are `/reports/{overview|tasks|activity|roadmap|timesheet}` |

### AI

| # | Method | Path | Controller@method | Policy | Src | Main params (`*` = required) | Docs |
|---|---|---|---|---|---|---|---|
| 1 | POST | `/projects/{board_id}/tasks/{task_id}/ai-assist` | AiController@taskAssist | SingleBoardPolicy | free | `action`, `labels` | **MISSING** |
| 2 | POST | `/projects/{board_id}/tasks/{task_id}/ai-apply-suggestions` | AiController@applySuggestions | SingleBoardPolicy | free | `label_ids`, `priority` | **MISSING** |
| 3 | GET | `/ai/settings` | AiController@getSettings | AiPolicy | free | — | **MISSING** |
| 4 | POST | `/ai/settings` | AiController@saveSettings | AiPolicy | free | `settings` | **MISSING** |
| 5 | POST | `/ai/models` | AiController@getModels | AiPolicy | free | `settings` | **MISSING** |
| 6 | POST | `/ai/test` | AiController@testConnection | AiPolicy | free | `settings` | **MISSING** |
| 7 | POST | `/ai/generate` | AiController@generate | AiPolicy | free | `context`, `action`, `content`, `tone`, `prompt` | **MISSING** |

### Import / export

| # | Method | Path | Controller@method | Policy | Src | Main params (`*` = required) | Docs |
|---|---|---|---|---|---|---|---|
| 1 | POST | `/fluent-boards-import/import-file` | ImportController@importFile | AdminPolicy | free | `file (upload)`, `importFrom` | **MISSING** |
| 2 | POST | `/fluent-boards-import/upload-json-chunk` | ImportController@uploadJsonChunk | AdminPolicy | free | `chunk (upload)`, `chunkIndex`, `totalChunks`, `uploadId` | **MISSING** |
| 3 | POST | `/fluent-boards-import/process-json-import` | ImportController@processJsonImport | AdminPolicy | free | `importing_page`, `board_id`, `filePath`, `importFrom`, `folder_id` | **MISSING** |
| 4 | POST | `/import-file` | ImportController@importFile | AdminPolicy | pro | `importFrom`, `file`, (file upload) | **MISSING** |
| 5 | POST | `/upload-json-chunk` | ImportController@uploadJsonChunk | AdminPolicy | pro | `chunkIndex`, `totalChunks`, `uploadId`, `file`, (file upload) | **MISSING** |
| 6 | POST | `/process-json-import` | ImportController@processJsonImport | AdminPolicy | pro | `importing_page`, `board_id` | **MISSING** |
| 7 | POST | `/trello-boards` | ImportController@getTrelloBoards | AdminPolicy | pro | `api_key`, `token` | **MISSING** |
| 8 | POST | `/import-trello-board` | ImportController@importTrelloBoard | AdminPolicy | pro | `api_key`, `token`, `trello_board_id`, `import_users` | **MISSING** |
| 9 | POST | `/trello-import-status` | ImportController@getTrelloImportStatus | AdminPolicy | pro | `import_id` | **MISSING** |
| 10 | POST | `/asana-workspaces` | ImportController@getAsanaWorkspaces | AdminPolicy | pro | `pat` | **MISSING** |
| 11 | POST | `/asana-projects` | ImportController@getAsanaProjects | AdminPolicy | pro | `pat`, `workspace_gid` | **MISSING** |
| 12 | POST | `/import-asana-project` | ImportController@importAsanaProject | AdminPolicy | pro | `pat`, `project_gid`, `folder_id` | **MISSING** |
| 13 | POST | `/csv-upload` | CsvController@upload | AdminPolicy | pro | `delimiter`, (file upload) | **MISSING** |
| 14 | POST | `/import-csv` | CsvController@importBoard | AdminPolicy | pro | `delimiter`, `board_id`, `importing_page`, `map`, `file` | **MISSING** |

**Documented but NO LONGER EXISTS (stale)**

| Doc | Documented route | Note |
|---|---|---|
| import-export.md:18 | GET `/import-export/imports` | placeholder page; real import routes listed above |
| import-export.md:21 | POST `/import-export/import` | placeholder page; real import routes listed above |
| import-export.md:24 | GET `/import-export/imports/{import_id}` | placeholder page; real import routes listed above |
| import-export.md:27 | DELETE `/import-export/imports/{import_id}` | placeholder page; real import routes listed above |
| import-export.md:30 | POST `/import-export/export` | placeholder page; real import routes listed above |
| import-export.md:33 | GET `/import-export/exports/{export_id}` | placeholder page; real import routes listed above |
| import-export.md:36 | GET `/import-export/exports/{export_id}/download` | placeholder page; real import routes listed above |

### Cloud storage

| # | Method | Path | Controller@method | Policy | Src | Main params (`*` = required) | Docs |
|---|---|---|---|---|---|---|---|
| 1 | GET | `/admin/storage-settings` | ProAdminController@getStorageSettings | AdminPolicy | pro | — | **MISSING** |
| 2 | POST | `/admin/storage-settings` | ProAdminController@updateStorageSettings | AdminPolicy | pro | `config`, `driver*`, `access_key*`, `secret_key*`, `bucket*`, `public_url*`, `account_id*`, `region*`, `endpoint*` | **MISSING** |

**Documented but NO LONGER EXISTS (stale)**

| Doc | Documented route | Note |
|---|---|---|
| cloud-storage.md:18 | GET `/cloud-storage/services` | placeholder page; real config is `/admin/storage-settings` |
| cloud-storage.md:21 | POST `/cloud-storage/connect` | placeholder page; real config is `/admin/storage-settings` |
| cloud-storage.md:24 | DELETE `/cloud-storage/disconnect/{service_id}` | placeholder page; real config is `/admin/storage-settings` |
| cloud-storage.md:27 | GET `/cloud-storage/{service_id}/files` | placeholder page; real config is `/admin/storage-settings` |
| cloud-storage.md:30 | POST `/cloud-storage/{service_id}/upload` | placeholder page; real config is `/admin/storage-settings` |
| cloud-storage.md:33 | GET `/cloud-storage/{service_id}/download/{file_id}` | placeholder page; real config is `/admin/storage-settings` |
| cloud-storage.md:36 | POST `/cloud-storage/{service_id}/share/{file_id}` | placeholder page; real config is `/admin/storage-settings` |

### Admin settings & MCP

| # | Method | Path | Controller@method | Policy | Src | Main params (`*` = required) | Docs |
|---|---|---|---|---|---|---|---|
| 1 | GET | `/admin/feature-modules` | OptionsController@getAddonsSettings | AdminPolicy | free | — | **MISSING** |
| 2 | POST | `/admin/feature-modules` | OptionsController@saveAddonsSettings | AdminPolicy | free | `settings` | **MISSING** |
| 3 | POST | `/admin/feature-modules/install-plugin` | OptionsController@installPlugin | AdminPolicy | free | `plugin` | **MISSING** |
| 4 | GET | `/admin/general-settings` | OptionsController@getGeneralSettings | AdminPolicy | free | — | **MISSING** |
| 5 | POST | `/admin/general-settings` | OptionsController@saveGeneralSettings | AdminPolicy | free | `updatedSettings` | **MISSING** |
| 6 | GET | `/admin/mcp/status` | MCPSettingsController@status | AdminPolicy | free | — | **MISSING** |
| 7 | POST | `/admin/mcp/toggle` | MCPSettingsController@toggle | AdminPolicy | free | `mcp_enabled` | **MISSING** |
| 8 | POST | `/admin/mcp/install-adapter` | MCPSettingsController@installAdapter | AdminPolicy | free | — | **MISSING** |
| 9 | GET | `/admin/mcp/config-snippet` | MCPSettingsController@getConfigSnippet | AdminPolicy | free | `client` | **MISSING** |
| 10 | GET | `/admin/pages` | OptionsController@getPages | AdminPolicy | free | — | **MISSING** |

**Documented but NO LONGER EXISTS (stale)**

| Doc | Documented route | Note |
|---|---|---|
| admin.md:18 | GET `/admin/system-info` | placeholder page; invented endpoints |
| admin.md:21 | GET `/admin/statistics` | placeholder page; invented endpoints |
| admin.md:24 | GET `/admin/users` | placeholder page; invented endpoints |
| admin.md:25 | POST `/admin/users` | placeholder page; invented endpoints |
| admin.md:26 | PUT `/admin/users/{user_id}` | placeholder page; invented endpoints |
| admin.md:27 | DELETE `/admin/users/{user_id}` | placeholder page; invented endpoints |
| admin.md:30 | GET `/admin/projects` | placeholder page; invented endpoints |
| admin.md:31 | POST `/admin/projects` | placeholder page; invented endpoints |
| admin.md:32 | PUT `/admin/projects/{project_id}` | placeholder page; invented endpoints |
| admin.md:33 | DELETE `/admin/projects/{project_id}` | placeholder page; invented endpoints |
| admin.md:36 | POST `/admin/maintenance/clear-cache` | placeholder page; invented endpoints |
| admin.md:37 | POST `/admin/maintenance/optimize-database` | placeholder page; invented endpoints |
| admin.md:38 | POST `/admin/maintenance/backup` | placeholder page; invented endpoints |
| settings.md:18 | GET `/settings` | placeholder page; real settings are `/admin/general-settings`, `/admin/feature-modules` |
| settings.md:19 | GET `/settings/{setting_group}` | placeholder page; real settings are `/admin/general-settings`, `/admin/feature-modules` |
| settings.md:22 | PUT `/settings` | placeholder page; real settings are `/admin/general-settings`, `/admin/feature-modules` |
| settings.md:23 | PUT `/settings/{setting_group}` | placeholder page; real settings are `/admin/general-settings`, `/admin/feature-modules` |
| settings.md:26 | POST `/settings/reset` | placeholder page; real settings are `/admin/general-settings`, `/admin/feature-modules` |
| settings.md:29 | GET `/settings/export` | placeholder page; real settings are `/admin/general-settings`, `/admin/feature-modules` |
| settings.md:32 | POST `/settings/import` | placeholder page; real settings are `/admin/general-settings`, `/admin/feature-modules` |

### License (pro)

| # | Method | Path | Controller@method | Policy | Src | Main params (`*` = required) | Docs |
|---|---|---|---|---|---|---|---|
| 1 | GET | `/license` | LicenseController@getStatus | AdminPolicy | pro | — | **WRONG** doc (admin.md:41) |
| 2 | POST | `/license` | LicenseController@saveLicense | AdminPolicy | pro | `license_key` | **WRONG** doc (admin.md:42) |
| 3 | DELETE | `/license` | LicenseController@deactivateLicense | AdminPolicy | pro | — | **WRONG** doc (admin.md:43) |

**Documented but WRONG**

| Doc | Documented | Actual route | What's wrong |
|---|---|---|---|
| admin.md:41 | GET `/admin/license` | `GET /license` | License routes are at `/license`, not `/admin/license` (pro) |
| admin.md:42 | POST `/admin/license/activate` | `POST /license` | Real: `POST /license` with `license_key` |
| admin.md:43 | POST `/admin/license/deactivate` | `DELETE /license` | Real: `DELETE /license` (method + path differ) |

### Public boards

| # | Method | Path | Controller@method | Policy | Src | Main params (`*` = required) | Docs |
|---|---|---|---|---|---|---|---|
| 1 | GET | `/public/boards/{board_id}` | PublicBoardController@find | PublicBoardPolicy | free | — | **MISSING** |
| 2 | GET | `/public/boards/{board_id}/tasks` | PublicBoardController@getTasksByBoard | PublicBoardPolicy | free | — | **MISSING** |
| 3 | GET | `/public/boards/{board_id}/tasks/by-stage` | PublicBoardController@getTasksByBoardStage | PublicBoardPolicy | free | — | **MISSING** |
| 4 | GET | `/public/boards/{board_id}/tasks/stage-page` | PublicBoardController@getStageTasksPage | PublicBoardPolicy | free | `stage_id`, `limit`, `direction`, `cursor` | **MISSING** |

### Quick-access tasks, dashboard & global utilities

| # | Method | Path | Controller@method | Policy | Src | Main params (`*` = required) | Docs |
|---|---|---|---|---|---|---|---|
| 1 | GET | `/tasks/top-in-boards` | TaskController@getTopTasksForBoards | AuthPolicy | free | — | **MISSING** |
| 2 | GET | `/tasks/crm-associated-tasks/{associated_id}` | TaskController@getAssociatedTasks | AuthPolicy | free | — | **MISSING** |
| 3 | GET | `/tasks/stage/{task_id}` | TaskController@getStageByTask | AuthPolicy | free | — | **MISSING** |
| 4 | GET | `/tasks/boards-by-type/{type}` | BoardController@getBoardsByType | AuthPolicy | free | — | **MISSING** |
| 5 | GET | `/tasks/task-tabs/config` | TaskController@getTaskTabsConfig | AuthPolicy | free | — | **MISSING** |
| 6 | POST | `/tasks/task-tabs/config` | TaskController@saveTaskTabsConfig | AuthPolicy | free | `tabs` | **MISSING** |
| 7 | GET | `/global-search` | OptionsController@globalSearch | BoardUserPolicy | free | `query`, `scope`, `task_page`, `board_page`, `per_page` | **MISSING** |
| 8 | GET | `/ajax-options` | OptionsController@selectorOptions | BoardUserPolicy | free | `option_key`, `search`, `values`, `board_id` | **MISSING** |
| 9 | PUT | `/update-dashboard-view-settings` | OptionsController@updateDashboardViewSettings | BoardUserPolicy | free | `updatedSettings`, `view` | **MISSING** |
| 10 | GET | `/get-dashboard-view-settings` | OptionsController@getDashboardViewSettings | BoardUserPolicy | free | `view` | **MISSING** |
| 11 | GET | `/contacts/{board_id}` | TaskController@getAssociatedCrmContacts | SingleBoardPolicy | free | — | **MISSING** |
| 12 | GET | `/global-search` | OptionsController@globalSearch | UserPolicy | free | `query`, `scope`, `task_page`, `board_page`, `per_page` | **MISSING** |
| 13 | GET | `/options/members` | OptionsController@getBoardMembers | AuthPolicy | free | `boardId` | **MISSING** |
| 14 | GET | `/options/projects` | OptionsController@getBoards | AuthPolicy | free | — | **MISSING** |

### Roadmap (fluent-roadmap addon)

| # | Method | Path | Controller@method | Policy | Src | Main params (`*` = required) | Docs |
|---|---|---|---|---|---|---|---|
| 1 | GET | `/roadmaps/{board_id}/stages/{stage_id}/ideas` | RoadmapController@getStageIdeas | PublicPolicy | fluent-roadmap | `sort`, `per_page`, `page` | Documented (roadmaps.md:45) |
| 2 | POST | `/roadmaps/{board_id}/ideas` | RoadmapController@createIdea | PublicPolicy | fluent-roadmap | `idea`, `title*`, `description`, `name*`, `email*` | Documented (roadmaps.md:83) |
| 3 | GET | `/roadmaps/{board_id}/ideas/{task_id}` | RoadmapController@getIdea | PublicPolicy | fluent-roadmap | — | Documented (roadmaps.md:119) |
| 4 | POST | `/roadmaps/{board_id}/ideas/{idea_id}/comments` | RoadmapController@addComment | PublicPolicy | fluent-roadmap | `comment`, `message*`, `author_name*`, `author_email*` | Documented (roadmaps.md:157) |
| 5 | DELETE | `/roadmaps/idea/comments/{comment_id}` | RoadmapController@deleteComment | PublicPolicy | fluent-roadmap | — | Documented (roadmaps.md:235) |
| 6 | POST | `/roadmaps/vote-idea/{idea_id}` | RoadmapController@voteIdea | PublicPolicy | fluent-roadmap | — | Documented (roadmaps.md:254) |
| 7 | GET | `/roadmaps/{board_id}/day-wise-ideas` | RoadmapController@getDayWiseIdeasReports | PublicPolicy | fluent-roadmap | — | Documented (roadmaps.md:285) |
| 8 | GET | `/roadmaps/{board_id}/popular-ideas` | RoadmapController@getPopularIdeas | PublicPolicy | fluent-roadmap | — | Documented (roadmaps.md:308) |
| 9 | POST | `/roadmaps/{board_id}/idea/{idea_id}/change-stage` | RoadmapController@changeIdeaStage | PublicPolicy | fluent-roadmap | `stage_id` | Documented (roadmaps.md:330) |
| 10 | POST | `/roadmaps/idea/comments/{comment_id}/replies` | RoadmapController@storeReplies | PublicPolicy | fluent-roadmap | (full body) | **MISSING** |
| 11 | GET | `/admin/roadmap/settings` | RoadmapAdminController@getSettings | RoadmapAdminPolicy | fluent-roadmap | — | Documented (roadmaps.md:374) |
| 12 | POST | `/admin/roadmap/settings` | RoadmapAdminController@updateSettings | RoadmapAdminPolicy | fluent-roadmap | `settings`, `enable_new_idea_submission*`, `new_idea_require_auth*`, `enable_new_comment_submission*`, `new_idea_comment_require_auth*`, `enable_new_vote_submission*`, `new_idea_vote_require_auth*`, `add_user_to_crm_new_idea_submission*`, `crm_tags`, `crm_lists`, `auth_html*` | Documented (roadmaps.md:386) |
| 13 | GET | `/admin/roadmap/page-settings` | RoadmapAdminController@getPageSettings | RoadmapAdminPolicy | fluent-roadmap | — | Documented (roadmaps.md:430) |
| 14 | POST | `/admin/roadmap/page-settings` | RoadmapAdminController@updatePageSettings | RoadmapAdminPolicy | fluent-roadmap | `selectedPages` | Documented (roadmaps.md:431) |


## Summary counts

| Metric | Count |
|---|---|
| Route registrations scanned (free 169 + pro 83 + pro TimeTracking module 7 + fluent-roadmap 14) | 273 |
| **Unique live routes** (method + path; excludes 7 dead pro routes and the duplicate `global-search`) | **265** |
| Live routes documented correctly | **105** |
| Live routes documented only with a wrong path/method | **8** |
| Live routes with no docs at all (**missing**) | **152** |
| Doc endpoint entries that are **wrong** (path/method mismatch) | **10** |
| Doc endpoint entries that are **stale** (route does not exist) | **67** |
| Dead route registrations in pro `api.php` (controller class missing) | **7** |
| Doc endpoint entries scanned / matching a live route | 185 / 108 (some routes are documented on more than one page) |
| Doc pages not in the sidebar | 13 (5 with correct content, 8 placeholders) |

Unique live routes: 273 − 7 dead − 1 duplicate `global-search` = 265. Check: 105 + 8 + 152 = 265.
