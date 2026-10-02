# Inventory: Data Layer, PHP API, Helpers, CLI, Modules, Getting Started

- Date: 2026-10-02
- Status: Research complete (read-only, no repo edits)
- Scope: `dev-docs/src/{database,global-functions,helpers,cli,modules,getting-started}` compared against
  - Free: `fluent-boards/` (database/Migrations, app/Models, app/Api, app/Functions/helpers.php, app/Services/Helper.php, app/Hooks/Cli/Commands.php)
  - Pro: `fluent-boards-pro/` (app/Models, app/Modules/TimeTracking, app/Services)
- Note: while this research ran, `src/.vuepress` was replaced by `src/.vitepress` (VitePress 1.6, `srcExclude: ['**/_*.md', '**/_parts/**']`). Sidebar findings below refer to `.vitepress/sidebars/*`.

---

## 1. Database tables

### 1.1 Actual tables (13)

| Table (`{prefix}fbs_*`) | Created by | Columns (type) |
|---|---|---|
| `fbs_boards` | Free `BoardMigrator` | id INT UNSIGNED AI, parent_id INT UNSIGNED NULL, title TEXT NULL, description LONGTEXT NULL, type VARCHAR(50) NULL, currency VARCHAR(50) NULL, background TEXT NULL, settings TEXT NULL, created_by INT UNSIGNED NOT NULL, archived_at/created_at/updated_at TIMESTAMP NULL. Keys: parent_id, type |
| `fbs_board_terms` | Free `BoardTermMigrator` | id, board_id INT UNSIGNED, title VARCHAR(100) NULL, slug VARCHAR(100) NULL, type VARCHAR(50) DEFAULT 'stage', position DECIMAL(10,2) DEFAULT 1, color VARCHAR(50) NULL, bg_color VARCHAR(50) NULL, settings TEXT NULL, archived_at/created_at/updated_at. Keys: title, type, position, slug. (Has an ALTER that upgrades `position` to DECIMAL.) |
| `fbs_tasks` | Free `TaskMigrator` | id, parent_id, board_id, crm_contact_id BIGINT, title TEXT, slug VARCHAR(255), type VARCHAR(50), status VARCHAR(50) DEFAULT 'open', stage_id, source VARCHAR(50) DEFAULT 'web', source_id VARCHAR(255), **priority VARCHAR(50) DEFAULT NULL ('urgent, high, medium, low')**, description LONGTEXT, lead_value DECIMAL(10,2) DEFAULT 0, created_by BIGINT, position DECIMAL(10,2) DEFAULT 1, comments_count INT DEFAULT 0, issue_number INT, reminder_type VARCHAR(100) DEFAULT 'none', settings TEXT, remind_at, started_at, due_at, last_completed_at, archived_at, created_at, updated_at. Keys: type, board_id, slug, comments_count, issue_number, crm_contact_id, due_at, priority. (ALTER upgrades `source_id` to VARCHAR(255).) |
| `fbs_task_metas` | Free `TaskMetaMigrator` | id, task_id, key VARCHAR(100) NOT NULL, value LONGTEXT NULL, created_at, updated_at. Key: task_id |
| `fbs_notifications` | Free `NotificationMigrator` | id, object_id, object_type VARCHAR(100), task_id NULL, action VARCHAR(255) NULL, activity_by BIGINT, description LONGTEXT, settings TEXT, created_at, updated_at. Keys: object_id, object_type, activity_by |
| `fbs_notification_users` | Free `NotificationUserMigrator` | id, notification_id NULL, user_id BIGINT, marked_read_at, created_at, updated_at. Keys: notification_id, user_id |
| `fbs_metas` | Free `MetaMigrator` | id, object_id NULL, object_type VARCHAR(100), key VARCHAR(100) NULL, value LONGTEXT NULL, created_at, updated_at. Key: object_id |
| `fbs_activities` | Free `ActivityMigrator` | id, object_id, object_type VARCHAR(100), action VARCHAR(50), column VARCHAR(50) NULL, old_value VARCHAR(50) NULL, new_value VARCHAR(50) NULL, description LONGTEXT, created_by BIGINT NULL, settings TEXT, created_at, updated_at. Keys: object_type, object_id |
| `fbs_relations` | Free `RelationMigrator` | id, object_id, object_type VARCHAR(100), foreign_id, settings TEXT, preferences TEXT, created_at, updated_at. Keys: object_type, object_id, foreign_id |
| `fbs_comments` | Free `CommentsMigrator` | id, board_id, task_id, parent_id BIGINT NULL, type VARCHAR(50) DEFAULT 'comment', privacy DEFAULT 'public', status DEFAULT 'published', author_name/author_email VARCHAR(192), author_ip VARCHAR(50), description TEXT, created_by BIGINT, **settings TEXT NULL**, created_at, updated_at. Keys: type, task_id, board_id, status, privacy |
| `fbs_attachments` | Free `AttachmentMigrator` | id, object_id, object_type VARCHAR(100) DEFAULT 'TASK', attachment_type VARCHAR(100), file_path TEXT, full_url TEXT, settings TEXT, title VARCHAR(192), file_hash VARCHAR(192), driver VARCHAR(100) DEFAULT 'local', status VARCHAR(100) DEFAULT 'ACTIVE', file_size VARCHAR(100), created_at, updated_at. Keys: object_type, object_id, attachment_type, status, file_hash, driver |
| `fbs_teams` | Free `TeamMigrator` | id, parent_id, title VARCHAR(100), description TEXT, type VARCHAR(50), visibility VARCHAR(50) DEFAULT 'VISIBLE', notifications_enabled TINYINT(1) DEFAULT 1, settings TEXT, created_by BIGINT, created_at, updated_at. Keys: type, visibility, created_by, parent_id, notifications_enabled, title |
| `fbs_time_tracks` | **Pro** `app/Modules/TimeTracking/TimerInit.php` (dbDelta, not a migrator class) | id, user_id BIGINT, board_id, task_id, started_at, completed_at, message TEXT, status VARCHAR(50) DEFAULT 'commited', working_minutes INT DEFAULT 0, billable_minutes INT DEFAULT 0, is_manual TINYINT(1) DEFAULT 0, created_at, updated_at. Keys: user_id, status, task_id, board_id |

Pro has **no** `database/` directory; the only Pro-created table is `fbs_time_tracks`.

### 1.2 `database/index.md` gaps

| Issue | Detail |
|---|---|
| Missing tables | None. All 13 tables are documented, plus WP `users`. |
| Missing column | `fbs_comments.settings` (TEXT NULL, serialized). |
| Wrong value | `fbs_tasks.priority`: docs say `DEFAULT 'low'`, values "low, medium, high". Actual: `DEFAULT NULL`, values `urgent, high, medium, low`. |
| Missing index lists | Index sections exist only for notifications, notification_users, teams, metas, relations, time_tracks. Missing for boards, board_terms, tasks, task_metas, attachments, comments, activities. |
| Heading naming | Headings are `_fbs_boards Table` etc. The leading underscore is misleading; use `{prefix}fbs_boards`. Model pages link to `#fbs-boards-table` anchors, so check those still resolve under VitePress slugify. |
| Broken image | `<img :src="$withBase('/assets/img/schema-design.png')">`. `schema-design.png` does not exist anywhere in `src/public`. `$withBase` is VuePress-only syntax: it is not defined in `.vitepress/theme`. |
| Empty section | `## Database Tables` heading has no content under it. |
| Missing context | No mention that `fbs_boards` also stores **folders** (`type='folder'`), that `fbs_board_terms` also stores **custom fields** (`type='custom-field'`), or that `fbs_metas` stores options (`object_type='option'`) and webhooks (`object_type='webhook'`). No `fbs_relations.object_type` value list (board_user, task_assignee, task_label, task_user_watch, task_dependency, task_custom_field, board_user_email, board_user_notification, folder board, etc.). |
| Pro marker | `fbs_time_tracks` is not badged as Pro-only, and the docs do not say it is created when the Time Tracking module boots. |

### 1.3 `_parts` leftovers (confirmed FluentCRM)

| File | Content | Verdict |
|---|---|---|
| `database/_parts/_funnel_schema.md` | FluentCRM `fc_funnels` schema (`type` default `funnel`, `trigger_name`, `conditions`) | FluentCRM leftover. Excluded from build via `srcExclude` and not referenced anywhere. Delete it. |
| `database/_parts/_subscriber_schema.md` | FluentCRM `fc_subscribers` schema (`hash`, `contact_owner`, `company_id`, `prefix`…) | FluentCRM leftover. Not referenced. Delete it. |

---

## 2. Models

### 2.1 Actual model inventory (22 classes, excluding base `Model`)

| Model | Namespace | Table / scope | Relations (method → model) | Notable scopes / methods |
|---|---|---|---|---|
| Activity | `FluentBoards\App\Models` | fbs_activities | board→Board (object_id), task→Task (object_id), user→User (created_by) | scopeType; settings (un)serialize; column/old/new/description accessors |
| Attachment | Free | fbs_attachments | — | settings (un)serialize; base for TaskImage, CommentImage, Pro TaskAttachment |
| Board | Free | fbs_boards; **global scope `type IN (to-do, roadmap)`**; default type `to-do` | tasks, completedTasks→Task; stages→Stage; labels→Label; users→User (fbs_relations board_user); boardUserEmailNotificationSettings→User; boardUserNotificationSettings→User (marked "will delete later"); notifications→Notification; comments→Comment; owner→User; customFields→CustomField; activities→Activity | scopes: byAccessUser, excludeTemplates, availableInCurrentInstall, onlyTemplates. Methods: getColor (static), syncUsers, isBoardExists (static), getUsers, getMeta, getMetaByKey, updateMeta, removeBoardFromFolder; accessors meta, isUserOnlyViewer |
| BoardTerm | Free | fbs_board_terms (no scope) | board→Board | replaceSettings; base class for Stage, Label, CustomField |
| Comment | Free | fbs_comments; global scopes `images`, `replies` (eager-load) | user→User, task→Task, replies→Comment, parentComment→Comment (hasOne), images→CommentImage | scopes: byTask, privacy, type; accessor avatar |
| CommentImage | Free (extends Attachment) | fbs_attachments | comment→Comment | scopeWithComment; accessor secure_url; creating sets file_hash |
| CustomField | **Free** `FluentBoards\App\Models\CustomField` (extends BoardTerm) | fbs_board_terms, scope `type='custom-field'` | tasks→Task (fbs_relations), board→Board | (A duplicate also exists in Pro, see below) |
| Folder | Free (`FluentBoards\App\Models\Folder`) | **fbs_boards**, scope `type='folder'` | parentFolder→Folder, subFolders→Folder, boards→Board (fbs_relations) | toArray override; meta accessor. Note `Constant::OBJECT_TYPE_FOLDER_BOARD = 'FluentBoardsPro\App\Models\Folder'` (a stale class string used as the relation object_type) |
| Label | Free (extends BoardTerm) | scope `type='label'` | tasks→Task (task_label) | — |
| Meta | Free | fbs_metas | — | value (un)serialize; base of Webhook |
| Notification | Free | fbs_notifications | activitist→User, board→Board, users→User (fbs_notification_users), task→Task | checkReadOrNot |
| NotificationUser | Free | fbs_notification_users | notification→Notification | — |
| Relation | Free | fbs_relations | — | settings and preferences (un)serialize |
| Stage | Free (extends BoardTerm) | scope `type='stage'` | tasks→Task (+ inherited board) | defaultTaskStatus, moveToNewPosition, reIndexStagesPositions (static) |
| Task | Free | fbs_tasks; global scope `type IN (task, roadmap)` | activities, comments, public_comments, notifications, board, assignees→User, labels→Label, attachments→**`FluentBoardsPro\App\Models\TaskAttachment`** (dummy empty relation without Pro), watchers→User, **predecessors→Task, successors→Task** (task_dependency), contact→**`FluentCrm\App\Models\Subscriber`**, taskMeta→TaskMeta, stage→Stage, customFields→CustomField, repeatTaskMeta→Meta (hasOne), taskCustomFields→Relation, subtasks→Task, subtaskGroup→TaskMeta | scopes: type, overdue, upcoming, dueToday, excludeTemplateBoards, onActiveAvailableBoards. Methods: withoutTaskCreatedEvent (static), parentTask($id), isOverdue, upcoming, isWatching, createTask, addOrRemoveAssignee, user($id), lead_contact (static), getMeta, updateMeta, moveToNewPosition, moveBetweenTasks, reIndexTasksPositions (static), adjustSubtaskCount (static), close, reopen, mappables/mappableFields (static), getPopularCount; accessors meta, is_pinned, repeat_task_meta; mutator archived |
| TaskImage | Free (extends Attachment) | fbs_attachments | — | scopeWithComment, scopeWithTask, secure_url |
| TaskMeta | Free | fbs_task_metas | task→Task, subtasks→Task | value (un)serialize |
| Team | Free | fbs_teams | parent→Team | settings (un)serialize |
| User | Free | WP `users` | tasks, watchingTasks, highPriorityTasks, overDueTasks, upcomingTasks, upcomingWithoutDuedate, assignedTasks, mentionedTasks→Task; boards, whichBoards→Board; notifications→Notification; boardUser (commented out) | consts ALWAYS_HIDDEN (user_pass, user_activation_key, user_nicename, user_url, user_registered, user_status), PRIVILEGED_ONLY (user_email); serializePrivilegedFields (static), getHidden, photo accessor |
| Webhook | Free (extends Meta) | fbs_metas, scope `object_type='webhook'` | — | getFields, getSchema, store, saveChanges |
| CustomField (Pro) | `FluentBoardsPro\App\Models\CustomField` | fbs_board_terms `type=custom-field` | tasks, board | Duplicate of the Free class |
| TaskAttachment (Pro) | `FluentBoardsPro\App\Models\TaskAttachment` (extends **Attachment**) | **fbs_attachments** | task→Task | scopeWithTask, secure_url, toArray; fires `fluent_boards/task_attachment_added` on create |
| TimeTrack (Pro) | `FluentBoardsPro\App\Modules\TimeTracking\Model\TimeTrack` | fbs_time_tracks | user→User, board→Board, task→Task | casts working_minutes/billable_minutes/is_manual → int; getWorkingSeconds; creating defaults user_id |

There is **no** Subtask, Folder (Pro), Template, or TaskTimeTrack model. Subtasks are `Task` rows with `parent_id`. Templates are boards filtered by the `onlyTemplates`/`excludeTemplates` scopes.

### 2.2 Missing model pages (9)

| Missing page | Priority |
|---|---|
| Folder | High (Free model, own REST group `admin/folders`) |
| Relation | High (junction table behind most relations) |
| Meta | High (options, webhooks, repeat-task meta) |
| TimeTrack (Pro) | High |
| Attachment (base) | Medium |
| BoardTerm (base) | Medium |
| CommentImage | Medium (documented only as the return type of `Comment::images`) |
| TaskImage | Low |
| Base `Model` (custom setAttribute/getAttributeValue) | Low |

### 2.3 Errors and staleness in existing model pages

| Page | Problems |
|---|---|
| `models/index.md` | Uses `scopeFilterByType` / `Board::filterByType([...])`, which does not exist. Typo `FluentBoards\App\Models\Boards::where`. Update example uses `'last_name'` (CRM leftover). Comment "These will return corresponding Tag and List collection" (CRM leftover). "delete all flights" (Laravel copy). The Board global scope (only to-do/roadmap) is not mentioned, so `Board::all()` silently excludes folders and other types. |
| `board.md` | Documents only stages, tasks, users, the byAccessUser scope, and updateMeta. Missing 9 relations (completedTasks, labels, boardUserEmailNotificationSettings, notifications, comments, owner, customFields, activities, boardUserNotificationSettings), 3 scopes (excludeTemplates, availableInCurrentInstall, onlyTemplates), and methods (syncUsers, isBoardExists, getUsers, getMeta, getMetaByKey, removeBoardFromFolder, getColor). Typo `funtion`, `$bards`, `$campaigns` (CRM leftover). |
| `task.md` | "## Scopes" heading appears twice. Lists `upcoming()` and `isOverdue()` as scopes; they are instance methods. Real scopes `overdue`, `upcoming`, `dueToday`, `excludeTemplateBoards`, and `onActiveAvailableBoards` are missing. The `attachments` return type is given as `FluentBoards\App\Models\TaskAttachment`; it is actually `FluentBoardsPro\...`, and the relation returns empty without Pro. Missing relations: predecessors, successors, contact (FluentCRM Subscriber), repeatTaskMeta, taskCustomFields, subtaskGroup. `parentTask` is documented as a relation but is the method `parentTask($id)`. Missing methods: moveBetweenTasks, reIndexTasksPositions, isWatching, withoutTaskCreatedEvent, mappables, mappableFields, getPopularCount. The `priority` attribute says DEFAULT 'low' (wrong). The customFields example uses `ProConstant::TASK_CUSTOM_FIELD`, but the constant now lives in the Free `Constant`. whereDoesntHave examples query `Board::whereDoesntHave('tasks')` (copy-paste error). Typo `funtion`. |
| `comment.md` | Missing `settings` attribute, scopes (byTask, privacy, type), the global eager-load scopes, and the `avatar` accessor. `parentComment` is hasOne by `parent_id`, which is semantically wrong in code; flag it rather than document it as-is. |
| `stage.md` | No Relations section (tasks, board). Missing defaultTaskStatus and reIndexStagesPositions. Global scope `type='stage'` not mentioned. |
| `label.md` | Uses the `$campaigns` var (CRM leftover); typo `$lables`. Inherited board relation not mentioned. |
| `custom-field.md` | Class given only as Pro `FluentBoardsPro\App\Models\CustomField`; the Free `FluentBoards\App\Models\CustomField` now exists and is the one Board/Task use. Return types use the fake namespace `FluentCustomFields\App\Models\Task` / `...\Board`. No Schema link and no attributes. |
| `task-attachment.md` | Says it inherits from `BoardTerm` / `fbs_board_terms`. **Wrong**: it extends `Attachment` → `fbs_attachments`. Relation is named `tasks`, but the method is `task()`. Fake namespace `FluentTaskAttachments\App\Models\Task`. Missing secure_url, scopeWithTask, and the `fluent_boards/task_attachment_added` hook. |
| `notification.md` | Fake namespaces `FluentNotifications\App\Models\User/Board/Task`. |
| `notification-user.md` | Fake namespace `FluentNotificationUsers\App\Models\Notification`. |
| `task-meta.md` | Fake namespace `FluentTaskMetas\App\Models\Task`. Missing the `subtasks` relation. |
| `team.md` | Fake namespace `FluentTeams\App\Models\Team`. |
| `user.md` | Fake namespace `FluentUsers\App\Models\*` (all 9 relations). Missing assignedTasks and mentionedTasks. Attribute table lists `user_pass` etc. but does not explain that they are always hidden on serialization, or that `user_email` is privileged-only (`serializePrivilegedFields`). |
| `activity.md` | OK apart from no mention of the description/old/new accessors. |
| `webhook.md` | OK. |
| All 12 pages with Schema links | Use `<a :href="$withBase(...)">`, which is VuePress syntax and will not work in VitePress unless a global helper is added. |

---

## 3. Global functions and PHP API

### 3.1 Global functions in `app/Functions/helpers.php` (19)

| Function | In `global-functions/index.md`? | Notes |
|---|---|---|
| `fluentBoards($module = null)` | **No** | App container accessor |
| `FluentBoardsApi($key = null)` | Not on the index page (used in the API pages) | Returns an `FBSApi` wrapper, not the class itself (see 3.2) |
| `fluent_boards_sanitize_description($description)` | **No** | |
| `fluent_boards_user_avatar($email, $name='')` | Yes | |
| `fluent_boards_mix($path, $manifestDirectory='')` | **No** | Internal |
| `FluentBoardsAssetUrl($path=null)` | **No** | |
| `fluent_boards_page_url()` | Yes | |
| `fluent_boards_is_rtl()` | **No** | |
| `fluent_boards_get_pref_settings($cached=true)` | Yes, but wrong description ("Get the URL of the FluentBoards admin page") | Returns the module prefs from WP option `fluent_boards_modules`: timeTracking, frontend, menu_settings, recurring_task |
| `fluent_boards_site_logo()` | Yes | |
| `fluent_boards_get_option($key, $default=null)` | Yes, but wrong description ("Get the site logo URL") | Reads `fbs_metas` where object_type='option' |
| `fluent_boards_update_option($key, $value)` | Yes, but wrong description ("Get the site logo URL"); param `key` is missing its `$` | |
| `fluentBoardsDb()` | Yes, but wrong return type (`\FluentBoards\App\App`) | Returns `fluentBoards('db')`, the query builder/connection |
| `fluent_boards_get_features_config()` | **No** | Returns `cloud_storage` yes/no from option `_fbs_features` |
| `fbsGetFeaturesConfig()` / `fbsGetOption()` / `fbsUpdateOption()` | **No** | Deprecated since 1.90. Add a deprecation note. |
| `fluentboardsCsvMimes()` | **No** | |
| `fluent_boards_string_to_bool($value)` | **No** | |
| `fluent_boards_get_upgrade_url($utmContent='')` | **No** | |

The index page also says the file is at `app/functions/helpers.php`; the actual path is `app/Functions/helpers.php`. Pro defines no global functions.

### 3.2 `FluentBoardsApi()` classes (`app/Api/config.php`: boards, tasks, stages)

How it works: `FluentBoardsApi('x')` returns `FBSApi`, which proxies `__call`. **Any exception, including an unknown method, is swallowed and returns `null`.** Each class's own `__call` throws "Method does not exist".

| Class / method | Documented in global-functions? | In modules/*.md? | Permission check |
|---|---|---|---|
| Boards::getBoards($with, $sortBy, $sortOrder) | Yes | Yes | byAccessUser(current user) |
| Boards::getStagesByBoard($board_id) | Yes | No | read |
| Boards::create($data) | Yes | Yes | **none** (creates default labels and stages, fires `fluent_boards/board_created`) |
| Boards::getStages($board_id) | Yes | Yes | read |
| Boards::getLabels($boardId) | Yes | Yes | read |
| Boards::createLabel($boardId, $data) | Yes | Yes | write. `bg_color` required; `color` defaults to `#1B2533` |
| Stages::getStage($id, $with) | Yes | Yes (headed "Getting a task", param `$taskId`, wrong) | read |
| Stages::getStagesByBoard($boardId, $with) | Yes | Yes | read |
| Stages::create($data) | Yes | Yes (example var is `$taskData`, wrong) | write. title and board_id required |
| Stages::updateProperty($stageId, $property, $value) | Yes | Yes | write. Allowed: title, status, bg_color |
| Stages::archiveStage / restoreStage | Yes | Yes | write |
| Tasks::getTasksByBoard / getTask / getTasksCreatedBy | Yes | Yes | read |
| Tasks::create($data) | Yes | Yes | write. title, board_id, stage_id required |
| Tasks::createTask($data) | Yes | No | (legacy path) |
| Tasks::addAssignees / removeAssignees | Yes | Yes | **none** in API class |
| Tasks::attachLabels / removeLabels | Yes | Yes | write |
| Tasks::changeStage($task, $stageId) | Yes | No | write. Accepts a Task model **or** an ID |
| Tasks::updateProperty($taskId, $property, $value) | Yes | No | write. Allowed: title, description, due_at, priority, status, source, source_id, crm_contact_id |
| Tasks::createTaskAttachment(int $boardId, int $taskId, array $data) | Yes | No | Pro and write. `$data['url']` required |
| Tasks::deleteTaskAttachment(int,int,int) | Yes | No | Pro and write |
| **Tasks::createSubtask(int $boardId, int $taskId, $data)** | **No** | No | Pro and write |
| **Tasks::updateSubtask($boardId, $taskId, $subtaskId, $property, $value)** | **No** | No | Pro and write |
| **Tasks::deleteSubtask($boardId, $taskId, $subtaskId)** | **No** | No | Pro and write |
| `getInstance()` (documented on all 3 pages) | Documented | — | **Does not exist.** Through FBSApi it returns `null`, so the documented `->where(...)` example fatals. Remove it, or add the method. |

The docs should also state that FBSApi swallows exceptions and returns `null`, that most methods return `false` on permission failure, and that `FluentBoardsApi()` with no key returns the `Api` registry.

---

## 4. Helper classes (`helpers/*.md`)

| Doc | Class | Status |
|---|---|---|
| `service_helper.md` | `\FluentBoards\App\Services\Helper` | All 18 documented methods exist. 18 public static methods are undocumented: loadView, normalizeDateValue, normalizeDates, sanitizeTask, sanitizeBoard, sanitizeStage, sanitizeComment, sanitizeLabel, sanitizeSubtask, sanitizeTaskMeta, sanitizeUserCollections, sanitizeUsersArray, obfuscateEmail, sanitizeTaskAttachment, sanitizeTaskRepeatData, sanitizeTaskForWebHook, taskReminderTypes, translateActivities. `crm_contact` depends on FluentCRM, so say so. |
| `arr.md` | `\FluentBoards\Framework\Support\Arr` (vendor/wpfluent) | Namespace correct. All 20 documented methods exist (82 available). |
| `str.md` | `\FluentBoards\Framework\Support\Str` | Namespace correct. **`Str::orderedUuid` documented but missing.** 22 others OK (94 available). |
| `index.md` | — | 6-line intro only, no list. |
| Not documented at all | `FluentBoards\App\Services\Sanitize`, `PermissionManager`, `Constant`; Pro `FluentBoardsPro\App\Services\{Helper, ProHelper, Constant}`, `TimeTrackingHelper`, `CloudStorage\Helper/StorageHelper` | Candidates for new pages, at least `Constant` (relation `object_type` values) and `PermissionManager`. |

---

## 5. CLI

| Actual (`wp fluent_boards …`, registered in `app/Hooks/actions.php:173` when `WP_CLI`) | Args | Notes |
|---|---|---|
| `crm_role_assign` | interactive (STDIN prompts for board ID, FluentCRM tag ID, then confirmation) | Requires FluentCRM and FluentBoards Pro. Adds contacts with a WP user under a tag as board members (`board_user` relation). |
| `create_random_tasks` | `[--board_id=<id>]` (default: first board), `[--count=<n>]` (default 10) | Dev/seed utility |

Pro registers no CLI commands.

`cli/index.md` is **100% FluentCRM** (title "FluentCRM CLI", `wp fluent_crm stats`, `sync_edd_customers`, `sync_woo_customers`, `activate_license`, `license_status` (listed twice)). None of these exist. Rewrite it with the 2 real commands. The page is not in the VitePress nav or any sidebar.

---

## 6. `modules/*.md`

| Page | In sidebar? | Status |
|---|---|---|
| `index.md` | Yes ("Overview") | **FluentCRM leftover**: describes FluentCRM automation (Trigger, Action, Benchmark, newsletters). Nothing about FluentBoards. |
| `boards.md` | Yes | Snippets valid. Missing `getStagesByBoard`. Should note that `create` has no permission check and creates default stages and labels. |
| `stages.md` | Yes | Calls valid. Example var `$taskData` and the heading "Getting a task" / `$taskId` are wrong (should be stage). `status` values open/closed are not verified against `Helper::sanitizeStage`. |
| `tasks.md` | Yes | Calls valid. Missing changeStage, updateProperty, createTaskAttachment, deleteTaskAttachment, createSubtask, updateSubtask, deleteSubtask, createTask. Priority values should list `urgent`. |
| `trigger.md` | Yes ("Triggers") | **FluentCRM leftover**: `FluentCrm\App\Services\Funnel\BaseTrigger`, `FunnelProcessor`, `fluent_crm/after_init`, `fluentcampaign-pro` text domain, "course-enrolled" example. The real FluentBoards side lives in `app/Services/Intergrations/FluentCRM/Automations/{ContactAddedTaskTrigger, ContactAddedBoardTrigger, StageChangedTrigger, TaskCreateAction}.php` and Pro `app/Services/Integrations/FluentCRM/CreateBoardFromTemplateAction.php` (note Pro uses the correct spelling `Integrations`). Rewrite it as "FluentCRM automation integration" or remove it. |
| `navigation-modules.md` | Yes | **Empty file (0 bytes)** but linked in the sidebar. Real hooks to document: `fluent_boards/menu_items`, `fluent_boards/board_menu_items`. Module toggles live in WP option `fluent_boards_modules` (timeTracking, frontend, menu_settings, recurring_task) and `fluent_boards_get_features_config()` (cloud_storage). |
| Top nav "Modules" | — | Lists only Boards, Stages, Tasks. |

Undocumented modules in code: Free `app/Modules/MCP`; Pro `app/Modules/{TimeTracking, CloudStorage (S3, R2, DigitalOcean, Backblaze), MCP}`.

---

## 7. `getting-started/index.md`

| Claim | Reality |
|---|---|
| Hooks in the capability cards | All exist (`menu_items`, `board_menu_items`, `before_task_create`, `before_create_board`, `uploaded_file_name_prefix`, `task_created`, `stage_updated`, `task_due_date_changed`, `email_header`, `task_priorities`, `email_footer`) **except `fluent_boards/task_tabs`, which is not found** (task tabs are a user Meta config `fbs_task_tabs_config`, not a filter). |
| REST base `/wp-json/fluent-boards/v1/` (3 places) | **Wrong**: `config/app.php` sets `rest_version => 'v2'`. |
| `GET /boards`, `POST /tasks` endpoints | **Wrong**: boards are `GET/POST /projects`; task create is `POST /projects/{board_id}/tasks`. |
| `define FB_DEBUG_SQL` | No such constant in the code. Remove it. |
| Requirements min WP 5.9 / PHP 7.4 | readme.txt says WP ≥ 5.0, PHP ≥ 7.4. Align them. |
| `FLUENT_BOARDS` constant check in boilerplate | Exists (`define('FLUENT_BOARDS','fluent-boards')`). OK. |
| Directory tree: `app/views` | Actual: `app/Views`. |
| Directory tree: `includes # Old Framework deprecated classes` | **No `includes/` dir.** |
| Directory tree: "Database Molders" | Typo for Models. |
| Directory tree: missing entries | `app/Modules`, `app/Vite.php`, `app/ComposerScript.php`, `resources/`, `dev/`. |
| Glossary | Board "statuses, visibility" are not columns. Label "name" should be `title`/`bg_color`. Comment "user_id, content" should be `created_by`/`description`. Webhook "event, url" is a Meta row (`object_type='webhook'`). |
| Pro feature list ("attachments, subtasks, custom fields, and more") | Incomplete vs Pro code: task dependencies (predecessors/successors), board templates, CSV import/export, Trello/Asana/FluentBoards importers, time tracking, cloud storage (S3/R2/DO/Backblaze), outgoing webhooks, board user roles/invitations, frontend portal/shortcode, MCP tools, FluentCRM "create board from template" action. |
| `Task::create([...])` PHP example | Works, but bypasses TaskService (no position, slug, or activity defaults). Recommend `FluentBoardsApi('tasks')->create()`. |
| Facebook Group link `facebook.com/groups/fluentcrm` | FluentCRM leftover link. |

---

## 8. FluentCRM leftovers across `dev-docs/src`

| File | Hits | Type |
|---|---|---|
| `cli/index.md` | 25 | Entire page is FluentCRM |
| `modules/trigger.md` | 62 | Entire page is FluentCRM |
| `modules/index.md` | 3 (+ automation content) | Entire page is FluentCRM |
| `database/_parts/_funnel_schema.md`, `_subscriber_schema.md` | — | FluentCRM schemas, unreferenced |
| `hooks/filters/_webhook_filters.md` | 5 | `fluent_crm/incoming_webhook_data`, `webhook_contact_data` |
| `hooks/filters/_dashboard_filters.md` | 12 | `fluent_crm/dashboard_stats`, `quick_links`, `dashboard_notices`, `sales_stats` |
| `hooks/filters/_general_filters.md` | 17 | `fluent_crm/disable_global_search`, `will_auto_unsubscribe`, `will_use_cookie`, `is_simulated_mail`, `countries` |
| `hooks/filters/_other_filters.md` | 25 | `fluent_crm/enable_unsub_header`, `email_headers`, `user_permissions`, `contact_name_prefixes`, woo/edd sidebar… |
| `hooks/filters/_frontend_filters.md` | 46 | `fluent_crm/unsubscribe_texts`, `unsub_response_message`… |
| `database/models/index.md` | — | `'last_name'`, "Tag and List collection" |
| `database/models/board.md`, `label.md` | — | `$campaigns` variable names |
| `getting-started/index.md` | 1 | fluentcrm Facebook group link |
| `rest-api/{tasks,webhooks,extend}.md` | 1–3 each | Not reviewed here (out of scope). Spot-check: may be legitimate FluentCRM-integration mentions (`crm_contact_id`). |
| `database/index.md`, `models/task.md` | 2 each | Legitimate (`crm_contact_id`, `source` "funnel" column comment) |

The `hooks/filters/_*.md` partials are excluded from the build by `srcExclude: '**/_*.md'`. Confirm whether any page still includes them; if not, they are dead files and can be deleted.

---

## Summary counts

- Tables: 13 actual (12 Free, 1 Pro). 0 missing from docs, 1 missing column (`fbs_comments.settings`), 1 wrong default/values (`tasks.priority`), 7 tables lacking index docs, 1 missing image (`schema-design.png`), 2 FluentCRM `_parts` files.
- Models: 22 actual (19 Free, 3 Pro). 14 doc pages. **9 models undocumented** (Folder, Relation, Meta, TimeTrack, Attachment, BoardTerm, CommentImage, TaskImage, base Model). 1 page structurally wrong (TaskAttachment table and parent class). 8 pages use fake namespaces. Board is missing about 20 members, Task about 20.
- Global functions: 19 actual. 7 documented, of which 4 have wrong descriptions or return types. **12 undocumented.**
- PHP API: 3 classes, 30 public methods. 27 documented. **3 missing** (createSubtask, updateSubtask, deleteSubtask). **1 phantom** (`getInstance`, on 3 pages).
- Helpers: 1 phantom method (`Str::orderedUuid`). 18 undocumented `Helper` methods. 6+ service and constant classes undocumented.
- CLI: 2 real commands, 0 documented. Page is 100% FluentCRM and not in the nav.
- Modules: 6 pages. 2 are fully FluentCRM, 1 is empty, 3 are valid but incomplete.
- Getting started: 9 factual errors (REST v1 vs v2, endpoint paths, `task_tabs` hook, `FB_DEBUG_SQL`, `includes/`, `views` casing, glossary, requirements, Pro feature list).
- FluentCRM leftovers: 13 files.
