# Task Model

| DB Table Name | `{wp_db_prefix}fbs_tasks` |
|---------------|---------------------------|
| Schema        | [Check Schema](/database/#fbs-tasks-table) |
| Source File   | fluent-boards/app/Models/Task.php |
| Name Space    | FluentBoards\App\Models |
| Class         | FluentBoards\App\Models\Task |

::: warning Global scope
The Task model only sees rows whose `type` is `task` or `roadmap`. Subtasks are `Task` rows with `parent_id` set; there is no separate Subtask model.
:::

## Attributes

| Attribute | Data Type | Comment |
|---|---|---|
| id | INT UNSIGNED | Primary key |
| parent_id | INT UNSIGNED NULL | Parent task ID for subtasks |
| board_id | INT UNSIGNED NULL | Board ID |
| crm_contact_id | BIGINT UNSIGNED NULL | Linked contact (for example a FluentCRM subscriber ID) |
| title | TEXT NULL | Task title |
| slug | VARCHAR(255) NULL | Generated from the title when empty |
| type | VARCHAR(50) NULL | Set on create: `roadmap` on roadmap boards, otherwise `task` |
| status | VARCHAR(50) NULL | `open` (default) or `closed` |
| stage_id | INT UNSIGNED NULL | Stage ID |
| source | VARCHAR(50) NULL | Defaults to `web` |
| source_id | VARCHAR(255) NULL | ID in the source system |
| priority | VARCHAR(50) NULL | `urgent`, `high`, `medium`, `low`, or empty. Default NULL |
| description | LONGTEXT NULL | Task description |
| lead_value | DECIMAL(10,2) | Default `0.00` |
| created_by | BIGINT UNSIGNED NULL | Creator user ID. Defaults to the current user |
| position | DECIMAL(10,2) | Position in the stage (or in the parent for subtasks). Defaults to the end of the stage |
| comments_count | INT UNSIGNED NULL | Number of top-level comments. Kept in sync by the Comment model |
| issue_number | INT UNSIGNED NULL | Board-specific issue number |
| reminder_type | VARCHAR(100) NULL | Default `none` |
| settings | TEXT NULL | Serialized; returned as an array. Defaults to `cover`, `subtask_count`, `attachment_count`, `subtask_completed_count` |
| remind_at | TIMESTAMP NULL | Nullable timestamp (normalized) |
| started_at | TIMESTAMP NULL | Nullable timestamp (normalized) |
| due_at | TIMESTAMP NULL | Nullable timestamp (normalized) |
| last_completed_at | TIMESTAMP NULL | Nullable timestamp (normalized) |
| archived_at | TIMESTAMP NULL | Nullable timestamp (normalized) |
| created_at | TIMESTAMP NULL | |
| updated_at | TIMESTAMP NULL | |

"Normalized" means invalid date values (empty string, `none`, `0000-00-00 00:00:00`, ...) are stored and returned as `NULL`. See [Base Model](/database/models/#base-model).

Appended attributes (included in `toArray()` / JSON):

| Attribute | Comment |
|---|---|
| meta | All task meta as a `key => value` collection (from `fbs_task_metas`) |
| is_pinned | `1` when the `is_pinned` task meta is set, otherwise `0` |
| repeat_task_meta | The repeat-task `Meta` row, or `null` |

### Model events

- **creating:** sets `created_by`, `type`, `slug`, default `settings` and `position`.
- **created:** for a top-level task, fires `fluent_boards/task_created` (and `fluent_boards/contact_added_to_task` when `crm_contact_id` is set). For a subtask, updates the parent's subtask counters instead.

## Usage

Please check [Model Basic](/database/models/) for common methods.

```php
$task = FluentBoards\App\Models\Task::find(1);

$task->title;    // "Write release notes"
$task->status;   // "open"
$task->settings; // array
$task->meta;     // collection of task meta
```

## Scopes

### type($type)

Filter by the `type` column.

```php
$tasks = FluentBoards\App\Models\Task::type('task')->get();
```

### overdue()

Open, not completed tasks whose `due_at` is now or earlier.

```php
$overdue = FluentBoards\App\Models\Task::overdue()->whereNull('archived_at')->get();
```

### upcoming()

Open tasks whose `due_at` is now or later.

::: warning
The model also has an instance method named `upcoming()`. A static call `Task::upcoming()` runs that method on an empty model instead of the scope. Start from a query builder to use the scope.
:::

```php
$upcoming = FluentBoards\App\Models\Task::query()->upcoming()->orderBy('due_at')->get();

// Also fine inside a chain or relation
$upcoming = $board->tasks()->upcoming()->get();
```

### dueToday()

Open, not completed tasks due today (site time).

```php
$today = FluentBoards\App\Models\Task::dueToday()->get();
```

### excludeTemplateBoards()

Leaves out tasks that belong to template boards.

```php
$tasks = FluentBoards\App\Models\Task::excludeTemplateBoards()->get();
```

### onActiveAvailableBoards()

Only tasks on boards that are not archived, not templates, and available in the current install (see `Board::availableInCurrentInstall()`).

```php
$tasks = FluentBoards\App\Models\Task::onActiveAvailableBoards()
    ->whereNull('archived_at')
    ->get();
```

## Relations

### board

- Returns `FluentBoards\App\Models\Board`

```php
$board = $task->board;
```

### stage

- Returns `FluentBoards\App\Models\Stage`

```php
$stageTitle = $task->stage ? $task->stage->title : '';
```

### assignees

Assigned users (`fbs_relations`, `object_type = 'task_assignee'`). Pivot: `settings`, `preferences`.

- Returns a collection of `FluentBoards\App\Models\User`

```php
$assignees = $task->assignees;

// Tasks assigned to user 1
$tasks = FluentBoards\App\Models\Task::whereHas('assignees', function ($query) {
    $query->where('ID', 1);
})->get();
```

### watchers

Users watching the task (`object_type = 'task_user_watch'`). Pivot: `settings`.

- Returns a collection of `FluentBoards\App\Models\User`

```php
$watcherIds = $task->watchers->pluck('ID')->toArray();
```

### labels

Labels on the task (`object_type = 'task_label'`). Pivot: `settings`.

- Returns a collection of `FluentBoards\App\Models\BoardTerm` (label rows)

```php
$labels = $task->labels;

// Tasks that do not have the "bug" label
$tasks = FluentBoards\App\Models\Task::whereDoesntHave('labels', function ($query) {
    $query->where('slug', 'bug');
})->get();
```

### customFields

Custom fields with a value on this task (`object_type = 'task_custom_field'`). The value is in the pivot `settings`.

- Returns a collection of `FluentBoards\App\Models\CustomField`

::: warning
This relation references `FluentBoardsPro\App\Services\Constant::TASK_CUSTOM_FIELD`, so it only works when FluentBoards Pro is active.
:::

```php
foreach ($task->customFields as $field) {
    $value = maybe_unserialize($field->pivot->settings);
}
```

### taskCustomFields

The raw custom field relation rows for the task.

- Returns a collection of `FluentBoards\App\Models\Relation`

### subtasks

Child tasks (`parent_id = this task`).

- Returns a collection of `FluentBoards\App\Models\Task`

```php
$openSubtasks = $task->subtasks()->where('status', 'open')->get();
```

### subtaskGroup

Subtask group names stored in task meta (`key = 'group_name'`).

- Returns a collection of `FluentBoards\App\Models\TaskMeta`

### predecessors <Badge type="warning" text="Pro" />

Tasks this task depends on (`object_type = 'task_dependency'`, this task is `foreign_id`). Pivot: `settings`.

- Returns a collection of `FluentBoards\App\Models\Task`

### successors <Badge type="warning" text="Pro" />

Tasks that depend on this task (this task is `object_id`). Pivot: `settings`.

- Returns a collection of `FluentBoards\App\Models\Task`

```php
$blockedBy = $task->predecessors()->where('status', 'open')->get();
```

### comments

Top-level comments (`type = 'comment'`, `parent_id` NULL).

- Returns a collection of `FluentBoards\App\Models\Comment`

### public_comments

Public, published comments. Used mainly by the roadmap add-on.

- Returns a collection of `FluentBoards\App\Models\Comment`

### activities

Task activity log (`object_type = 'task_activity'`), newest first.

- Returns a collection of `FluentBoards\App\Models\Activity`

### notifications

- Returns a collection of `FluentBoards\App\Models\Notification`

### attachments

Task attachments. With FluentBoards Pro active this returns `FluentBoardsPro\App\Models\TaskAttachment` rows (`object_type = 'TASK'`). Without Pro it is an always-empty relation.

- Returns a collection of `FluentBoardsPro\App\Models\TaskAttachment`

```php
$files = $task->attachments;
```

### taskMeta

- Returns a collection of `FluentBoards\App\Models\TaskMeta`

### repeatTaskMeta

The repeat-task settings row (`fbs_metas`, `object_type = 'repeat_task'`).

- Returns `FluentBoards\App\Models\Meta` or `null`

### contact

The linked FluentCRM contact (`crm_contact_id`). Requires FluentCRM.

- Returns `FluentCrm\App\Models\Subscriber`

## Methods

### close()

Sets `status = 'closed'` and `last_completed_at`, saves, and updates the parent's subtask counters for subtasks. Does nothing when already closed.

- Returns `Task`

```php
$task->close();
```

### reopen()

Sets `status = 'open'` and clears `last_completed_at`.

- Returns `Task`

```php
$task->reopen();
```

### getMeta($key, $default = null)

Returns one task meta value.

```php
$upvotes = $task->getMeta('upvote', 0);
```

### updateMeta($key, $value)

Creates or updates a task meta row.

- Returns `FluentBoards\App\Models\TaskMeta`

```php
$task->updateMeta('is_pinned', 1);
```

### isOverdue()

`true` when the task is not completed and `due_at` is in the past. This is an instance method, not a scope.

```php
if ($task->isOverdue()) {
    // ...
}
```

### upcoming()

`true` when the task is not completed and `due_at` is in the future. This instance method shadows the `upcoming` scope on static calls; see [upcoming()](#upcoming) under Scopes.

### isWatching()

`true` when the current user is watching the task.

### createTask($data)

Applies the `fluent_boards/before_task_create` filter, creates the task, and attaches `assignees` (also added as watchers) and `labels` from `$data`.

- Returns `Task`

```php
$task = (new FluentBoards\App\Models\Task())->createTask([
    'title'     => 'New task',
    'board_id'  => 1,
    'stage_id'  => 3,
    'assignees' => [1],
    'labels'    => [7],
]);
```

### addOrRemoveAssignee($userId)

Toggles the user as assignee (and watcher).

- Returns `'added'` or `'removed'`

### moveToNewPosition($newIndex)

Moves the task to a 1-based index within its stage (or within its parent for subtasks), re-indexing positions when needed.

```php
$task->moveToNewPosition(1); // move to top
```

### moveBetweenTasks($prevTaskId = null, $nextTaskId = null)

Places the task between two sibling tasks.

```php
$task->moveBetweenTasks(10, 11);
```

### parentTask($id)

Returns `Task::find($id)`. This is a plain method, not a relation; pass the ID yourself.

```php
$parent = $task->parentTask($task->parent_id);
```

### user($id)

Returns `User::findOrFail($id)`.

### getPopularCount()

Returns `upvote + comments_count` from task meta. Used by the roadmap add-on.

### Task::withoutTaskCreatedEvent($callback) <Badge text="static" />

Runs the callback without firing `fluent_boards/task_created` for tasks created inside it.

```php
$task = FluentBoards\App\Models\Task::withoutTaskCreatedEvent(function () use ($data) {
    return FluentBoards\App\Models\Task::create($data);
});
```

### Task::reIndexTasksPositions($task) <Badge text="static" />

Renumbers positions (1, 2, 3, ...) of all siblings of the given task array.

### Task::adjustSubtaskCount($parentId) <Badge text="static" />

Recalculates `subtask_count` and `subtask_completed_count` in the parent's settings.

### Task::lead_contact($id) <Badge text="static" />

Returns a FluentCRM contact summary array, `''` when FluentCRM is not active, or `null` when the contact does not exist.

### Task::mappables() / Task::mappableFields() <Badge text="static" />

Field maps used by CSV export and incoming webhooks.
