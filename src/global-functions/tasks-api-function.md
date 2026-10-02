# Tasks API Function

<Badge type="tip" vertical="top" text="FluentBoards Core" /> <Badge type="warning" vertical="top" text="Some methods need Pro" />

The Tasks API reads and creates tasks, manages assignees and labels, moves tasks between stages, updates task properties, and (with FluentBoards Pro) manages attachments and subtasks. All methods run as the current WordPress user. See [PHP API classes](/global-functions/#php-api-classes) for the rules on permissions and error handling that apply to every method.

## Getting the API object

```php
$tasksApi = FluentBoardsApi('tasks');
```

`FluentBoardsApi('tasks')` returns a `FluentBoards\App\Api\FBSApi` proxy around `FluentBoards\App\Api\Classes\Tasks`. The class has no `getInstance()` method. For custom queries, use the `FluentBoards\App\Models\Task` model directly (see [Models](/database/models/)).

## Methods

| Method | Permission | Returns |
|---|---|---|
| [`getTasksByBoard()`](#gettasksbyboard) | Read | Collection of `Task` |
| [`getTask()`](#gettask) | Read | `Task` |
| [`getTasksCreatedBy()`](#gettaskscreatedby) | Read (per task) | `array` of `Task` |
| [`create()`](#create) | Write | `Task` |
| [`createTask()`](#createtask) | — | Not implemented |
| [`addAssignees()`](#addassignees) | Board manager or admin | `bool` |
| [`removeAssignees()`](#removeassignees) | Board manager or admin | `bool` |
| [`attachLabels()`](#attachlabels) | Write | `bool` |
| [`removeLabels()`](#removelabels) | Write | `bool` |
| [`changeStage()`](#changestage) | Write | `Task` |
| [`updateProperty()`](#updateproperty) | Write | `Task` |
| [`createTaskAttachment()`](#createtaskattachment) | Pro, write | See warning |
| [`deleteTaskAttachment()`](#deletetaskattachment) | Pro, write | `bool` |
| [`createSubtask()`](#createsubtask) | Pro, write | `Task` |
| [`updateSubtask()`](#updatesubtask) | Pro, write | `Task` |
| [`deleteSubtask()`](#deletesubtask) | Pro, write | `null` / `false` |

## Reading tasks

### getTasksByBoard()

Returns the top-level, non-archived tasks of a board (subtasks are excluded), ordered by `due_at` ascending. Each task gets these extra attributes: `isOverdue`, `isUpcoming`, `contact` (the FluentCRM contact array, or empty when FluentCRM is inactive) and `is_watching`.

```php
getTasksByBoard($board_id, $with = [])
```

**Parameters**
- `$board_id` (int|string): The board ID.
- `$with` (array): Relations to eager-load, for example `['assignees', 'labels', 'stage']`.

**Return**
- A collection of `Task` models. Returns `[]` for an empty ID and `false` without read access.

**Example**
```php
$tasks = FluentBoardsApi('tasks')->getTasksByBoard(12, ['assignees', 'labels']);

foreach ($tasks as $task) {
    if ($task->isOverdue) {
        // ...
    }
}
```

### getTask()

Returns a single task (or subtask) by ID.

```php
getTask($id)
```

**Return**
- The `Task` model, or `false` when the ID is empty, the task does not exist, or the user cannot read its board.

**Example**
```php
$task = FluentBoardsApi('tasks')->getTask(345);
```

### getTasksCreatedBy()

Returns all tasks created by a user, filtered to the boards the **current** user can read. Archived tasks and subtasks are included.

```php
getTasksCreatedBy($userId, $with = [])
```

**Parameters**
- `$userId` (int|string): The creator's WordPress user ID.
- `$with` (array): Relations to eager-load.

**Return**
- A plain PHP `array` of `Task` models (not a collection), or `false` for an empty user ID.

**Example**
```php
$tasks = FluentBoardsApi('tasks')->getTasksCreatedBy(get_current_user_id(), ['board']);
```

## Creating tasks

### create()

Creates a task in a stage. The data passes through the `fluent_boards/before_task_create` filter. When the task is saved, `fluent_boards/task_created` fires (top-level tasks only). Assignees are also added as watchers and as board members.

```php
create($data)
```

**Parameters**
- `$data` (array):

| Key | Type | Notes |
|---|---|---|
| `title` | string | **Required** |
| `board_id` | int | **Required** |
| `stage_id` | int | **Required**. Must belong to `board_id`. |
| `description` | string | Markdown/HTML, sanitized with `fluent_boards_sanitize_description()` |
| `priority` | string | `urgent`, `high`, `medium`, `low` or `''` (plus any keys added with the `fluent_boards/task_priorities` filter). Invalid values become `''`. |
| `status` | string | `open` or `closed`. Invalid values become `open`. |
| `due_at`, `started_at` | string | `Y-m-d H:i:s` |
| `assignees` | int[] / int / JSON string | WordPress user IDs. IDs that are not WordPress users are dropped. |
| `labels` | array / int / JSON string | Label IDs, or label titles/slugs from the same board. Unknown labels are dropped. |
| `crm_contact_id` | int | FluentCRM contact ID |
| `contact_email`, `contact_first_name`, `contact_last_name` | string | Requires FluentCRM. Creates or updates a subscribed contact and links it when `crm_contact_id` is empty. Pass all three keys. |
| `source`, `source_id` | string | Your own reference, for example `'my-addon'` and an external ID |
| `parent_id` | int | Makes the task a subtask. Prefer [`createSubtask()`](#createsubtask). |

::: warning Always pass `assignees` and `labels`
In version 2.1.0, `create()` reads `$data['assignees']` and `$data['labels']` without checking that they exist. Pass both keys (an empty array is fine) to avoid "Undefined array key" warnings on PHP 8.
:::

**Return**
- The created `Task` model. Returns `false` when a required key is missing, the user cannot write to the board, or the stage does not belong to the board.

**Example**
```php
$task = FluentBoardsApi('tasks')->create([
    'title'       => 'Draft the launch email',
    'board_id'    => 12,
    'stage_id'    => 45,
    'description' => 'Use the **new** template.',
    'priority'    => 'high',
    'due_at'      => '2026-10-15 17:00:00',
    'assignees'   => [3, 7],
    'labels'      => ['Marketing', 18],
    'source'      => 'my-addon',
    'source_id'   => 'order-1001',
]);

if (!$task) {
    // Missing data, no permission, or the stage is not on this board
}
```

### createTask()

A placeholder in version 2.1.0. It lists the supported fields in its body but does not create anything, and always returns `null`. Use [`create()`](#create) instead.

## Assignees and labels

### addAssignees()

Assigns users to a task and adds them as watchers. Only users who are already members of the task's board are assigned. Other IDs are skipped silently.

```php
addAssignees($task_id, $assignees = [])
```

**Parameters**
- `$task_id` (int): The task ID.
- `$assignees` (int[]): WordPress user IDs.

**Return**
- `true` when the call completes, even if some IDs were skipped. Returns `false` for empty arguments or when the current user is neither a board manager nor a FluentBoards admin.

**Example**
```php
FluentBoardsApi('tasks')->addAssignees(345, [3, 7]);
```

### removeAssignees()

Removes users from a task's assignees and watchers.

```php
removeAssignees($task_id, $assignees = [])
```

**Return**
- `true` on success. Returns `false` for empty arguments, a missing task, or when the current user is neither a board manager nor an admin.

**Example**
```php
FluentBoardsApi('tasks')->removeAssignees(345, [7]);
```

### attachLabels()

Attaches labels to a task. Only labels that belong to the task's board are attached.

```php
attachLabels($taskId, $labelIds = [])
```

**Return**
- `true` on success, or `false` without write access. Returns `null` if the task does not exist.

**Example**
```php
FluentBoardsApi('tasks')->attachLabels(345, [18, 19]);
```

### removeLabels()

Detaches labels from a task.

```php
removeLabels($taskId, $labelIds = [])
```

**Return**
- `true` on success, or `false` without write access. Returns `null` if the task does not exist.

**Example**
```php
FluentBoardsApi('tasks')->removeLabels(345, [19]);
```

## Moving and updating

### changeStage()

Moves a task to another stage on the same board and places it at the end of that stage.

```php
changeStage($task, $stageId)
```

**Parameters**
- `$task` (int|Task): A task ID or a `Task` model.
- `$stageId` (int): The target stage ID.

**Return**
- The updated `Task` model. Returns `false` when the task does not exist, the user cannot write to the board, or the stage belongs to another board.

::: tip
This method only updates `stage_id` and `position`. It does not fire `fluent_boards/task_stage_updated`, does not apply the stage's default status or default assignees, and does not send notifications. Those side effects happen only when a task is moved in the app or through the REST API.
:::

**Example**
```php
FluentBoardsApi('tasks')->changeStage(345, 46);
```

### updateProperty()

Updates one task property through `TaskService`, so the normal activity logging and hooks for that property run.

```php
updateProperty($taskId, $property, $value)
```

**Parameters**
- `$taskId` (int): The task ID.
- `$property` (string): One of the following:

| Property | Value |
|---|---|
| `title` | string |
| `description` | string (sanitized with `fluent_boards_sanitize_description()`) |
| `due_at` | `Y-m-d H:i:s`, or `null`/`''` to clear |
| `priority` | An allowed priority key, or `''`/`null` to clear. Unknown values return `false`. |
| `status` | `open` or `closed`. Other values return `false`. |
| `source`, `source_id` | string |
| `crm_contact_id` | int, or `null`/`''` to clear |

- `$value` (mixed): The new value.

**Return**
- The updated `Task` model. Returns `false` for an invalid ID, a missing task, a property that is not allowed, an invalid value, or no write access.

**Example**
```php
$tasksApi = FluentBoardsApi('tasks');
$tasksApi->updateProperty(345, 'priority', 'urgent');
$tasksApi->updateProperty(345, 'due_at', '2026-10-20 12:00:00');
$tasksApi->updateProperty(345, 'status', 'closed');
```

## Attachments <Badge type="warning" text="Pro" />

### createTaskAttachment()

Intended to add a URL attachment to a task.

```php
createTaskAttachment(int $boardId, int $taskId, array $data = [])
```

**Parameters**
- `$boardId` (int), `$taskId` (int)
- `$data` (array): `url` (**required**) and `title`.

::: danger Broken in version 2.1.0
This method calls `FluentBoardsPro\App\Services\AttachmentService::addTaskAttachment()`, which does not exist in FluentBoards Pro 2.1.0. When the permission checks pass, the call ends in a fatal PHP `Error` that the API proxy does not catch. Until it is fixed, add URL attachments through the REST endpoint `POST /wp-json/fluent-boards/v2/tasks/{task_id}/add-attachment` (see the [REST API](/rest-api/)).
:::

It returns `false` when Pro is inactive, the user cannot write to the board, `url` is missing, or the task is not on the board.

### deleteTaskAttachment()

Deletes an attachment from a task and fires `fluent_boards/task_attachment_deleted`.

```php
deleteTaskAttachment(int $boardId, int $taskId, int $attachmentId)
```

**Return**
- `true` on success. Returns `false` when Pro is inactive, without write access, or when the task is not on the board. Returns `null` when the attachment does not exist.

**Example**
```php
FluentBoardsApi('tasks')->deleteTaskAttachment(12, 345, 88);
```

## Subtasks <Badge type="warning" text="Pro" />

Subtasks are rows in `fbs_tasks` with `parent_id` set to the parent task. Every subtask belongs to a subtask group. A group is a `fbs_task_metas` row on the parent task with the key `group_name`, and each subtask links to its group with a `subtask_group_id` meta row.

### createSubtask()

Creates a subtask under a task. Internally it calls [`create()`](#create) with `board_id` and `parent_id` filled in, so the same data keys and rules apply.

```php
createSubtask(int $boardId, int $taskId, $data)
```

**Parameters**
- `$boardId` (int): The board ID.
- `$taskId` (int): The parent task ID. It must be on `$boardId`.
- `$data` (array): Task data as for `create()`. `title` and `stage_id` are **required** (use the parent's `stage_id`). Also:
  - `group_id` (int): A subtask group of the parent task. If it is missing or invalid, the first group of the parent is used. If the parent has no group, an "Untitled Group" is created.
  - `started_at` is ignored.

**Return**
- The created subtask (`Task` model), or `false` when Pro is inactive, the user cannot write to the board, the parent task is not on the board, or `create()` fails.

Creating a subtask updates the parent's subtask count. It does **not** fire `fluent_boards/task_created`.

**Example**
```php
$tasksApi = FluentBoardsApi('tasks');
$parent   = $tasksApi->getTask(345);

$subtask = $tasksApi->createSubtask($parent->board_id, $parent->id, [
    'title'     => 'Write subject line',
    'stage_id'  => $parent->stage_id,
    'assignees' => [3],
    'labels'    => [],
]);
```

### updateSubtask()

Updates one property of a subtask. It checks that the subtask belongs to `$taskId` on `$boardId`, then calls [`updateProperty()`](#updateproperty), so the same property list and validation apply.

```php
updateSubtask($boardId, $taskId, $subtaskId, $property, $value)
```

**Return**
- The updated subtask (`Task` model), or `false` when Pro is inactive, without write access, when the subtask is not a child of the task on that board, or when the property or value is not allowed.

**Example**
```php
FluentBoardsApi('tasks')->updateSubtask(12, 345, 351, 'status', 'closed');
```

### deleteSubtask()

Deletes a subtask. Fires `fluent_boards/before_task_deleted` before the delete and `fluent_boards/subtask_deleted_activity` after it.

```php
deleteSubtask($boardId, $taskId, $subtaskId)
```

**Return**
- `false` when Pro is inactive, without write access, or when the subtask is not a child of the task on that board.
- `null` otherwise. The method has no return value on success, so you cannot tell success from an exception by the return value alone. Verify with `getTask($subtaskId)` if you need to.

**Example**
```php
$result = FluentBoardsApi('tasks')->deleteSubtask(12, 345, 351);

if ($result === false) {
    // Not allowed, or not a subtask of task 345
}
```
