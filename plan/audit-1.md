# Audit 1: code-vs-docs spot check

Date: 2026-10-02. Scope: src/rest-api/{boards,activities,public-boards,tasks,subtasks,comments,attachments,dashboard,stages,labels,custom-fields,templates,folders,time-tracking,roadmaps,notifications}.md, src/hooks/**, src/database/**, src/global-functions/**, src/helpers/**, src/cli/index.md, src/modules/**, src/getting-started/index.md.

Code: fluent-boards 2.1.0, fluent-boards-pro 2.1.0, fluent-roadmap.

Rows 1-13 are scripted sweeps over every item of that kind. Rows 14 onward are manual checks of single claims.

| # | Claim checked | File | Result |
|---|---|---|---|
| 1 | Method and path of all 191 endpoints in the 16 in-scope REST pages vs routes in free `Routes/api.php`, pro `Routes/api.php`, pro `Modules/TimeTracking/routes.php`, roadmap `Http/api.php` | rest-api/* | OK (0 mismatches) |
| 2 | All 472 internal links and anchors resolve (heading slugs + ExplainBlock ids `[^a-zA-Z0-9_]`→`_`) | all in-scope | OK |
| 3 | All 140 documented hook names have a real `do_action`/`apply_filters` call site | hooks/** | OK |
| 4 | `add_action/add_filter(..., 10, N)` accepted-args match the call-site arg count for every hook | hooks/** | OK |
| 5 | `**Source:**` path of every hook exists and contains the hook | hooks/** | OK |
| 6 | Model methods/scopes documented exist in the model classes (Board, Task, Stage, Label, User, TimeTrack, Webhook, ...) | database/models/* | OK |
| 7 | Column names/types of 12 core tables + `fbs_time_tracks` vs migrations / `TimerInit.php` | database/index.md | OK |
| 8 | Global function signatures (`fluentBoards`, `FluentBoardsApi`, `fluent_boards_get_option`, `..._get_pref_settings`, `..._mix`, `..._user_avatar`, ...) | global-functions/index.md | OK |
| 9 | 53 `Helper::` method signatures | helpers/service_helper.md | OK |
| 10 | Every `Arr::` (20) and `Str::` (22) method exists in WPFluent Support | helpers/arr.md, str.md | OK |
| 11 | Every query builder method used exists in the framework | database/query-builder.md | OK |
| 12 | Every `FluentBoardsApi(...)->method()` used in examples exists in `app/Api/Classes` | modules/*, global-functions/* | OK |
| 13 | FluentCRM leftovers grep (`fluentcrm/fluent_crm/funnel/subscriber`) | all in-scope | OK, all are real integration mentions (`board_created_from_automation`, `crm_contact_id`, `in_fluent_crm`, `source = 'funnel'`) |
| 14 | `GET /projects`: per_page 1-100 default 100, `order` = column / `orderBy` = direction, `type` read but unused | rest-api/boards.md | OK |
| 15 | Create board: `board[...]`, `folder_id`, `background[id]`, `stages`, `labels`, `member_ids`, HTTP 201 | rest-api/boards.md | OK |
| 16 | Example `background` for `solid_4` has `color` `#5f27cd` (create, update and duplicate examples) | rest-api/boards.md | FIXED: changed to `#D7543D`. The server always stores the palette value from `Constant::BOARD_BACKGROUND_DEFAULT_SOLID_COLORS` |
| 17 | Default background palette sample (`solid_1`, `solid_2`, `gradient_1` values) | rest-api/boards.md | OK |
| 18 | Table tasks: per_page 1-150 default 20, sort_by default `position`, direction `asc` | rest-api/tasks.md | OK |
| 19 | Archived tasks: per_page 1-50, `searchInput` | rest-api/tasks.md | OK |
| 20 | Bulk actions: max 150, actions list incl. `move_to_stage` alias | rest-api/tasks.md | OK |
| 21 | Clone task: all 7 fields `required` | rest-api/tasks.md | OK |
| 22 | Stage page: limit 1-100 default 20, direction next/prev (else 400) | rest-api/tasks.md, public-boards.md | OK |
| 23 | Create task fields (`task[position]`, cover backgroundColor only, board_id must match path) | rest-api/tasks.md | OK |
| 24 | Pin task `pinned` marked Required | rest-api/tasks.md | UNSURE: not validated; it defaults to `false` (unpins). Left as is |
| 25 | Create comment: `comment` optional when `images` is sent, `comment_type` default `comment` | rest-api/comments.md | OK |
| 26 | List comments page size fixed 10, `filter` | rest-api/comments.md | OK |
| 27 | Comment image MIME list (JPEG...HEIC) | rest-api/comments.md | OK |
| 28 | Stage property list and rules (`title`/`status` required) | rest-api/stages.md | OK |
| 29 | Archived stages: per_page 1-50 default 30, `noPagination` | rest-api/stages.md | OK |
| 30 | Drag stage `stageId`/`newPosition` | rest-api/stages.md | OK |
| 31 | Folder create title max 50, `color`, `parent_id`; folder `order` allowed `created_at/title/id` | rest-api/folders.md | OK |
| 32 | Notifications: per_page 20, `action` default `all`, `total_unread` key, read response + 400 | rest-api/notifications.md | OK |
| 33 | Board activities per_page 40; comments-and-activities defaults (10, `newest`, `all`) | rest-api/activities.md | OK |
| 34 | Global search: per_page 1-100 default 20, `scope`, `id:`/`archived:` prefixes | rest-api/dashboard.md | OK |
| 35 | Task tab names (`due_today` ... `others`) | rest-api/dashboard.md | OK |
| 36 | Time tracking routes come from the module routes file (not the dead routes in pro `api.php`) | rest-api/time-tracking.md | OK |
| 37 | Manual time log: `billable_minutes` min 1, `completed_at` defaults to now (model `creating` hook) | rest-api/time-tracking.md | OK |
| 38 | Roadmap ideas: per_page default 1, sort `recent/comment/vote`, `all-ideas` | rest-api/roadmaps.md | OK |
| 39 | Submit idea: title max 192, description min 10, marked Required | rest-api/roadmaps.md | UNSURE: the rule is `string|min:10` without `required`, but the code reads `$data['description']` unconditionally, so it is effectively required. Left as is |
| 40 | Roadmap settings keys are `required` | rest-api/roadmaps.md | OK |
| 41 | Bulk subtasks max 15; single subtask `assignees`: only first ID used | rest-api/subtasks.md | OK (`Helper::sanitizeSubtask` slices to 1) |
| 42 | Template create: `include_tasks` default `no`, `include_labels` default `yes`, `selected_*` semantics | rest-api/templates.md | OK |
| 43 | Custom field types `text/number/select/multi-select/date/checkbox` | rest-api/custom-fields.md | OK |
| 44 | Attachment chunk params; update `title` required; URL attachment `url` required | rest-api/attachments.md | OK |
| 45 | Public boards: `public_token` query param, 4 routes | rest-api/public-boards.md | OK |
| 46 | `fluent_boards/repeat_task` `$metaId` is a row in `fbs_task_meta` | hooks/actions/tasks.md | FIXED: the row is in `fbs_metas` (`Meta` model, `object_type = 'repeat_task'`) |
| 47 | `stage_updated` args (boardId, array with `title`, old Stage clone) | hooks/actions/boards.md | OK |
| 48 | `board_stages_reordered` 2nd arg differs per caller (old-order Collection vs `[$stageId]`) | hooks/actions/boards.md | OK |
| 49 | `comment_updated` `$oldComment` is a string, top-level only | hooks/actions/comments.md | OK |
| 50 | `board_stage_restored` passes stage title, not model | hooks/actions/boards.md | OK |
| 51 | `task_created` skipped for subtasks and inside `withoutTaskCreatedEvent()` | hooks/actions/tasks.md | OK |
| 52 | `fluent-boards_loading_app` legacy hyphenated name, fires in admin + Pro shortcode | hooks/actions/app.md | OK |
| 53 | Internal hooks list (`async_{event}_webhook`, schedulers, trello import, template workers) | hooks/actions/index.md | OK |
| 54 | `fluent_boards/ajax_options_{option_key}` dynamic, 3 args | hooks/filters/data.md | OK |
| 55 | Filter defaults: upload 104857600, import 64 MB, grace 15 days, folder `fluent-boards` | hooks/filters/* | OK |
| 56 | `fluent_boards/task_tabs` does not exist | hooks/filters/index.md | OK |
| 57 | `fbs_relations` object_type table and constants (incl. folder legacy class-name value) | database/index.md | OK |
| 58 | Meta table name `fbs_metas` (not `fbs_meta`) | database/* | OK |
| 59 | Board global scope `to-do` or `roadmap` | database/models/board.md | OK |
| 60 | `Boards::getBoards($with, $sortBy='title', $sortOrder='asc')` | global-functions/boards-api-function.md | OK |
| 61 | `createTaskAttachment()` calls a non-existent `AttachmentService::addTaskAttachment()` | global-functions/tasks-api-function.md | OK (confirmed fatal) |
| 62 | `Tasks::create()`: label titles/slugs, `contact_email`, warnings when `assignees`/`labels` missing, invalid priority cleared | modules/tasks.md | OK |
| 63 | `createTask()` is a stub returning null | global-functions/tasks-api-function.md | OK |
| 64 | Stages API create/updateProperty (`title/status/bg_color`), archive/restore hooks and positions | modules/stages.md | OK |
| 65 | `changeStage()` accepts a model or an ID | modules/tasks.md | OK |
| 66 | `fluent_boards_get_pref_settings()` defaults | global-functions/index.md | OK |
| 67 | `FluentBoardsApi()` key behavior | global-functions/index.md | OK |
| 68 | CLI `crm_role_assign` flow, errors and last-board bug | cli/index.md | OK |
| 69 | CLI `create_random_tasks` options, defaults, bulk insert, messages | cli/index.md | OK |
| 70 | Board menu default keys, positions and roles; validation rules for custom items | modules/navigation-modules.md | OK |
| 71 | Requirements (WP 5.0, PHP 7.4) and `FLUENT_BOARDS_CORE_MIN_VERSION` 2.1.0 | getting-started/index.md | OK |
| 72 | Webhook stored in `fbs_metas` with `object_type` `webhook` | getting-started/index.md | OK |
| 73 | `User::getHidden()` and the `list_users` rule for `user_email` | database/models/user.md | OK |

## Counts

- Checked: 73 (rows 1-13 each cover a full sweep)
- OK: 69
- FIXED: 2 (row 16 has 3 occurrences)
- UNSURE: 2

## Observation (no doc change)

Pro `app/Http/Routes/api.php` still registers `time-tracks/start|pause|stop|commit|commit-manually`, which point to `FluentBoardsPro\App\Http\Controllers\TimeTrackController`. That class does not exist; the real controller is in `Modules/TimeTracking/Controllers`. The docs correctly leave these routes out.
