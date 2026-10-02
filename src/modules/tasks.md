# Task

<Badge type="tip" vertical="top" text="FluentBoards Core" /> <Badge type="warning" vertical="top" text="Subtasks and attachments need Pro" />

Tasks are the units of work on a board. Each task belongs to a board and a stage. It can have assignees, watchers, labels, a priority, start and due dates, comments, a linked FluentCRM contact and, with Pro, subtasks, attachments, custom fields and dependencies. Tasks are stored in `fbs_tasks` and represented by the `FluentBoards\App\Models\Task` model. Subtasks are tasks whose `parent_id` points to another task.

Use `FluentBoardsApi('tasks')` to work with tasks from PHP. Every call runs as the current WordPress user. The full method reference is on the [Tasks API](/global-functions/tasks-api-function) page.

## Creating a task

```php
$task = FluentBoardsApi('tasks')->create([
    'title'     => 'Prepare kickoff call', // required
    'board_id'  => 12,                     // required
    'stage_id'  => 45,                     // required, must belong to board 12
    'priority'  => 'high',                 // urgent | high | medium | low | ''
    'status'    => 'open',                 // open | closed
    'due_at'    => '2026-10-10 15:00:00',
    'assignees' => [3],                    // WP user IDs
    'labels'    => ['Client', 18],         // label IDs or titles from this board
]);
```

| Key | Notes |
|---|---|
| `title`, `board_id`, `stage_id` | **Required**. The stage must be on the board. |
| `priority` | `urgent`, `high`, `medium`, `low`, or `''` for none. Use the `fluent_boards/task_priorities` filter to add more. Invalid values are cleared. |
| `status` | `open` (default) or `closed` |
| `description` | Markdown or HTML (sanitized) |
| `due_at`, `started_at` | `Y-m-d H:i:s` |
| `assignees` | WordPress user IDs. They are also added as watchers and as board members. |
| `labels` | Label IDs or titles/slugs that exist on the board |
| `crm_contact_id`, or `contact_email` + `contact_first_name` + `contact_last_name` | Link a FluentCRM contact (requires FluentCRM) |
| `source`, `source_id` | Your own reference, useful for de-duplicating imports |

Pass `assignees` and `labels` even when they are empty (`[]`). Version 2.1.0 reads them without checking that they exist, which raises PHP warnings.

The data passes through the `fluent_boards/before_task_create` filter. After the task is saved, `fluent_boards/task_created` fires with the `Task` model. `create()` returns `false` if a required key is missing, the user cannot write to the board, or the stage is not on the board.

## Getting tasks

```php
// Top-level, non-archived tasks of a board, ordered by due date
$tasks = FluentBoardsApi('tasks')->getTasksByBoard($boardId, $with = []);

// One task (or subtask)
$task = FluentBoardsApi('tasks')->getTask($taskId);

// Tasks created by a user, limited to boards the current user can read (plain array)
$tasks = FluentBoardsApi('tasks')->getTasksCreatedBy($userId, $with = []);
```

## Assignees

```php
FluentBoardsApi('tasks')->addAssignees($taskId, [3, 7]);
FluentBoardsApi('tasks')->removeAssignees($taskId, [7]);
```

Both methods require the current user to be a **board manager** or a FluentBoards admin. `addAssignees()` only assigns users who are already board members, and adds them as watchers too. Other IDs are skipped silently. Both return `true` or `false`.

## Labels

```php
FluentBoardsApi('tasks')->attachLabels($taskId, [18, 19]);
FluentBoardsApi('tasks')->removeLabels($taskId, [19]);
```

Only labels that belong to the task's board are attached. To create a label first, see [Boards](/modules/boards#creating-a-label).

## Moving a task to another stage

```php
$task = FluentBoardsApi('tasks')->changeStage($taskIdOrTaskModel, $newStageId);
```

The task moves to the end of the target stage. The stage must be on the same board. This method only updates `stage_id` and `position`. It does **not** fire `fluent_boards/task_stage_updated`, does not close the task when the target stage's default status is `closed`, and does not send notifications. If you need those side effects, close the task as well:

```php
$tasksApi = FluentBoardsApi('tasks');
$tasksApi->changeStage($taskId, $doneStageId);
$tasksApi->updateProperty($taskId, 'status', 'closed');
```

## Updating task fields

```php
FluentBoardsApi('tasks')->updateProperty($taskId, $property, $value);
```

Allowed properties: `title`, `description`, `due_at`, `priority`, `status` (`open`/`closed`), `source`, `source_id`, `crm_contact_id`. Updates go through `TaskService`, so activities are logged and the matching hooks fire (for example `fluent_boards/task_due_date_changed`). Any other property, or an invalid priority or status, returns `false`.

```php
FluentBoardsApi('tasks')->updateProperty($taskId, 'due_at', null); // clear the due date
```

## Subtasks <Badge type="warning" text="Pro" />

```php
$tasksApi = FluentBoardsApi('tasks');
$parent   = $tasksApi->getTask($taskId);

// Create (title and stage_id required; group_id optional)
$subtask = $tasksApi->createSubtask($parent->board_id, $parent->id, [
    'title'     => 'Send agenda',
    'stage_id'  => $parent->stage_id,
    'assignees' => [],
    'labels'    => [],
]);

// Update one property (same list as updateProperty())
$tasksApi->updateSubtask($parent->board_id, $parent->id, $subtask->id, 'status', 'closed');

// Delete
$tasksApi->deleteSubtask($parent->board_id, $parent->id, $subtask->id);
```

Subtasks belong to subtask groups on the parent task. If you do not pass a valid `group_id`, the parent's first group is used, or an "Untitled Group" is created. All three methods return `false` when FluentBoards Pro is not active.

## Attachments <Badge type="warning" text="Pro" />

```php
FluentBoardsApi('tasks')->deleteTaskAttachment($boardId, $taskId, $attachmentId);
```

`createTaskAttachment($boardId, $taskId, ['url' => …, 'title' => …])` is part of the API, but it fails with a fatal error in version 2.1.0. It calls a Pro service method that does not exist. Use the REST endpoint `POST /wp-json/fluent-boards/v2/tasks/{task_id}/add-attachment` instead. See the [Tasks API](/global-functions/tasks-api-function#createtaskattachment) page.

## Related hooks

| Hook | Type | When |
|---|---|---|
| `fluent_boards/before_task_create` | Filter | Before a task is saved |
| `fluent_boards/task_created` | Action | After a top-level task is created |
| `fluent_boards/task_stage_updated` | Action | After a task is moved to another stage in the app or through REST |
| `fluent_boards/task_due_date_changed` | Action | After the due date changes |
| `fluent_boards/before_task_deleted` | Action | Before a task or subtask is deleted |

See [Action hooks](/hooks/actions/) and [Filter hooks](/hooks/filters/) for the full list.
