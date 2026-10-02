# Task Action Hooks

<Badge type="tip" vertical="top" text="FluentBoards Core" /> <Badge type="warning" vertical="top" text="Intermediate" />

Action hooks for tasks, subtasks, attachments, custom fields, dependencies, recurring tasks and time tracking. See the [Action Hooks overview](./index.md) for every action hook grouped by area.

Hooks marked <Badge type="tip" text="Pro" /> fire only when FluentBoards Pro is active. Source paths are relative to the plugin root. Paths that start with `fluent-boards-pro/` are in the Pro plugin.

## Tasks

<explain-block title="fluent_boards/task_created">

Fires after a **top-level** task is created. The hook fires from the Task model's `created` event, so every creation path triggers it: the board UI, the REST API, the PHP API, MCP tools, Fluent Forms, FluentCRM automations and Pro incoming webhooks.

It does **not** fire for:
- subtasks (a task with `parent_id` set). Use `fluent_boards/subtask_added` instead.
- tasks created inside `Task::withoutTaskCreatedEvent()`, such as the next copy of a recurring task (Pro). Use `fluent_boards/repeat_task_created` for those.

**Parameters**
- `$task` `\FluentBoards\App\Models\Task`: the new task

**Usage**
```php
add_action('fluent_boards/task_created', function ($task) {
    // Do whatever you want
}, 10, 1);
```

**Source:** `app/Models/Task.php`

</explain-block>

<explain-block title="fluent_boards/task_updated">

Fires after a task is moved with the move endpoint (drag and drop within or across stages, or a position change), including the MCP move tool. The second argument names what changed. Currently it is always `'position'`.

**Parameters**
- `$task` `\FluentBoards\App\Models\Task`: the task after the move
- `$what` `string`: the changed aspect. Currently always `'position'`.

**Usage**
```php
add_action('fluent_boards/task_updated', function ($task, $what) {
    // Do whatever you want
}, 10, 2);
```

**Source:** `app/Http/Controllers/TaskController.php`, `app/Modules/MCP/Tools/TaskTools.php`

</explain-block>

<explain-block title="fluent_boards/task_stage_updated">

Fires after a task moves to a different stage. Callers: the move endpoint (drag and drop), the MCP move tool, and the "move all tasks" stage action (once per task).

**Parameters**
- `$task` `\FluentBoards\App\Models\Task`: the task after the move
- `$oldStageId` `int`: the previous stage ID
- `$context` `array` *(optional)*: only passed by the "move all tasks" stage action, as `['source' => Stage, 'target' => Stage]`. Other callers pass only two arguments.

**Usage**
```php
// Two arguments work for every caller
add_action('fluent_boards/task_stage_updated', function ($task, $oldStageId) {
    // Do whatever you want
}, 10, 2);

// Accept the optional context. Give it a default value.
add_action('fluent_boards/task_stage_updated', function ($task, $oldStageId, $context = []) {
    // $context['source'], $context['target'] when available
}, 10, 3);
```

**Source:** `app/Http/Controllers/TaskController.php`, `app/Modules/MCP/Tools/TaskTools.php`, `app/Services/StageService.php`

</explain-block>

<explain-block title="fluent_boards/task_content_updated">

Fires after a task's title or description is changed.

**Parameters**
- `$task` `\FluentBoards\App\Models\Task`: the task after the update
- `$column` `string`: `'title'` or `'description'`
- `$oldTask` `\FluentBoards\App\Models\Task`: a clone of the task taken before the update

**Usage**
```php
add_action('fluent_boards/task_content_updated', function ($task, $column, $oldTask) {
    // Do whatever you want
}, 10, 3);
```

**Source:** `app/Services/TaskService.php`

</explain-block>

<explain-block title="fluent_boards/task_completed_activity">

Fires after a task's status is set through the task property update: closed (completed) or reopened.

**Parameters**
- `$task` `\FluentBoards\App\Models\Task`: the task after the change
- `$status` `string`: the requested status. `'closed'` means completed. Any other value (normally `'open'`) means reopened.

**Usage**
```php
add_action('fluent_boards/task_completed_activity', function ($task, $status) {
    if ($status === 'closed') {
        // Task completed
    }
}, 10, 2);
```

**Source:** `app/Services/TaskService.php`

</explain-block>

<explain-block title="fluent_boards/task_priority_changed">

Fires after a task's priority is changed.

**Parameters**
- `$task` `\FluentBoards\App\Models\Task`: the task with the new priority
- `$oldPriority` `string`: the previous priority key (`''` means no priority)

**Usage**
```php
add_action('fluent_boards/task_priority_changed', function ($task, $oldPriority) {
    // Do whatever you want
}, 10, 2);
```

**Source:** `app/Services/TaskService.php`

</explain-block>

<explain-block title="fluent_boards/task_date_changed">

Fires once after the task dates endpoint saves, when the due date and/or the start date actually changed. The per-field hooks (`task_due_date_changed`, `task_start_date_changed`, `task_due_date_removed`) fire as well.

**Parameters**
- `$task` `\FluentBoards\App\Models\Task`: the task after the update
- `$changedDates` `array`: the **old** values of the changed fields only, keyed `due_at` and/or `started_at`

**Usage**
```php
add_action('fluent_boards/task_date_changed', function ($task, $changedDates) {
    if (array_key_exists('due_at', $changedDates)) {
        $oldDueAt = $changedDates['due_at'];
    }
}, 10, 2);
```

**Source:** `app/Http/Controllers/TaskController.php`

</explain-block>

<explain-block title="fluent_boards/task_due_date_changed">

Fires after a task's due date is set to a non-empty value. A task with a due date is also reopened. When the due date is cleared, `fluent_boards/task_due_date_removed` fires instead.

**Parameters**
- `$task` `\FluentBoards\App\Models\Task`: the task after the update
- `$oldDueAt` `string|null`: the previous due date (`Y-m-d H:i:s`), or `null`

**Note:** Pro also fires this hook when it creates the next copy of a recurring task. In that case, the first argument is the **new** task and the second argument is the new task's **start date**, not an old due date.

**Usage**
```php
add_action('fluent_boards/task_due_date_changed', function ($task, $oldDueAt) {
    // Do whatever you want
}, 10, 2);
```

**Source:** `app/Services/TaskService.php`, `fluent-boards-pro/app/Hooks/Handlers/ProTaskHandler.php`

</explain-block>

<explain-block title="fluent_boards/task_due_date_removed">

Fires after a task's due date is cleared.

**Parameters**
- `$task` `\FluentBoards\App\Models\Task`: the task after the update

**Usage**
```php
add_action('fluent_boards/task_due_date_removed', function ($task) {
    // Do whatever you want
}, 10, 1);
```

**Source:** `app/Services/TaskService.php`

</explain-block>

<explain-block title="fluent_boards/task_start_date_changed">

Fires after a task's start date is set. It fires only when the new value is non-empty. Clearing the start date fires no hook.

**Parameters**
- `$task` `\FluentBoards\App\Models\Task`: the task after the update
- `$oldStartedAt` `string|null`: the previous start date (`Y-m-d H:i:s`), or `null`

**Usage**
```php
add_action('fluent_boards/task_start_date_changed', function ($task, $oldStartedAt) {
    // Do whatever you want
}, 10, 2);
```

**Source:** `app/Services/TaskService.php`

</explain-block>

<explain-block title="fluent_boards/task_reminder_type_changed">

Fires after a task's reminder type is saved. The `reminder_type` property is only processed when FluentBoards Pro is active. Values not in [`fluent_boards/task_reminder_types`](../filters/data.md#fluent_boards_task_reminder_types) are saved as `null`.

**Parameters**
- `$task` `\FluentBoards\App\Models\Task`: the task
- `$reminderType` `string|null`: the new reminder type key, such as `'1_day_before'`, or `null`

**Usage**
```php
add_action('fluent_boards/task_reminder_type_changed', function ($task, $reminderType) {
    // Do whatever you want
}, 10, 2);
```

**Source:** `app/Services/TaskService.php`

</explain-block>

<explain-block title="fluent_boards/task_archived">

Fires after a task's archive state changes. Callers: the task archive property update (both archiving **and** restoring) and archiving all tasks of a stage.

**Parameters**
- `$task` `\FluentBoards\App\Models\Task`: the task

**Note:** Check `$task->archived_at` to tell the two cases apart. It is set when the task was archived and `null` when it was restored.

**Usage**
```php
add_action('fluent_boards/task_archived', function ($task) {
    if ($task->archived_at) {
        // Archived
    } else {
        // Restored
    }
}, 10, 1);
```

**Source:** `app/Services/TaskService.php`, `app/Services/StageService.php`

</explain-block>

## Assignees & Labels

<explain-block title="fluent_boards/task_assignee_added">

Fires after a user is assigned to a task. Callers: the assignee toggle, "assign yourself", and the Fluent Forms integration.

**Parameters**
- `$task` `\FluentBoards\App\Models\Task`: the task, with `assignees` loaded
- `$userId` `int`: the assigned user ID

**Usage**
```php
add_action('fluent_boards/task_assignee_added', function ($task, $userId) {
    // Do whatever you want
}, 10, 2);
```

**Source:** `app/Services/TaskService.php`, `app/Services/Intergrations/FluentFormIntegration/Bootstrap.php`

</explain-block>

<explain-block title="fluent_boards/assign_another_user">

Fires right after `fluent_boards/task_assignee_added` from the assignee toggle, but only when the assigned user is **not** the current user.

**Parameters**
- `$task` `\FluentBoards\App\Models\Task`: the task
- `$userId` `int`: the assigned user ID

**Usage**
```php
add_action('fluent_boards/assign_another_user', function ($task, $userId) {
    // Do whatever you want
}, 10, 2);
```

**Source:** `app/Services/TaskService.php`

</explain-block>

<explain-block title="fluent_boards/task_assignee_removed">

Fires after a user is unassigned from a task. Callers: the assignee toggle and "leave task".

**Parameters**
- `$task` `\FluentBoards\App\Models\Task`: the task, with `assignees` loaded
- `$userId` `int`: the removed user ID

**Usage**
```php
add_action('fluent_boards/task_assignee_removed', function ($task, $userId) {
    // Do whatever you want
}, 10, 2);
```

**Source:** `app/Services/TaskService.php`

</explain-block>

<explain-block title="fluent_boards/task_label">

Fires after a label is added to or removed from a task, from the task screen or the MCP label tool.

**Parameters**
- `$task` `\FluentBoards\App\Models\Task`: the task
- `$label` `\FluentBoards\App\Models\Label`: the label
- `$action` `string`: `'added'` or `'removed'`

**Usage**
```php
add_action('fluent_boards/task_label', function ($task, $label, $action) {
    // Do whatever you want
}, 10, 3);
```

**Source:** `app/Services/LabelService.php`, `app/Modules/MCP/Tools/LabelTools.php`

</explain-block>

## Moving, Cloning & Deleting

<explain-block title="fluent_boards/task_moved_from_board">

Fires after a task (with its subtasks) is moved to another board.

**Parameters**
- `$task` `\FluentBoards\App\Models\Task`: the task on its new board
- `$oldBoard` `\FluentBoards\App\Models\Board`: the source board
- `$newBoard` `\FluentBoards\App\Models\Board`: the target board

**Usage**
```php
add_action('fluent_boards/task_moved_from_board', function ($task, $oldBoard, $newBoard) {
    // Do whatever you want
}, 10, 3);
```

**Source:** `app/Services/TaskService.php`

</explain-block>

<explain-block title="fluent_boards/task_cloned">

Fires after a task is cloned (duplicated).

**Parameters**
- `$originalTask` `\FluentBoards\App\Models\Task`: the source task
- `$clonedTask` `\FluentBoards\App\Models\Task`: the new copy

**Usage**
```php
add_action('fluent_boards/task_cloned', function ($originalTask, $clonedTask) {
    // Do whatever you want
}, 10, 2);
```

**Source:** `app/Services/TaskService.php`

</explain-block>

<explain-block title="fluent_boards/task_cloned_activity">

Fires after the core `task_cloned` handler clears the copied activity log of the cloned task. It is used to log the "cloned" activity. Prefer `fluent_boards/task_cloned` unless you need to run after that cleanup.

**Parameters**
- `$originalTask` `\FluentBoards\App\Models\Task`: the source task
- `$clonedTask` `\FluentBoards\App\Models\Task`: the new copy

**Usage**
```php
add_action('fluent_boards/task_cloned_activity', function ($originalTask, $clonedTask) {
    // Do whatever you want
}, 10, 2);
```

**Source:** `app/Hooks/Handlers/TaskHandler.php`

</explain-block>

<explain-block title="fluent_boards/before_task_deleted">

Fires right before a task or subtask is deleted, while its data still exists. Callers: task delete, and subtask delete from the PHP API, the Pro subtask route and the Pro MCP tool.

**Parameters**
- `$task` `\FluentBoards\App\Models\Task`: the task or subtask that is about to be deleted
- `$options` `null`: reserved. Always `null`.

**Usage**
```php
add_action('fluent_boards/before_task_deleted', function ($task, $options) {
    // Clean up your data for $task->id
}, 10, 2);
```

**Source:** `app/Http/Controllers/TaskController.php`, `app/Api/Classes/Tasks.php`, `fluent-boards-pro/app/Http/Controllers/SubtaskController.php`, `fluent-boards-pro/app/Modules/MCP/Tools/ProTaskTools.php`

</explain-block>

<explain-block title="fluent_boards/task_deleted">

Fires after a task has been deleted. The hook runs **after the database transaction commits**, once per deleted row. Deleting a parent task also fires it for each of its subtasks.

**Parameters**
- `$task` `\FluentBoards\App\Models\Task`: a clone of the deleted task. The row no longer exists.

**Usage**
```php
add_action('fluent_boards/task_deleted', function ($task) {
    // Do whatever you want
}, 10, 1);
```

**Source:** `app/Services/TaskService.php`

</explain-block>

<explain-block title="fluent_boards/bulk_action_completed">

Fires after a bulk action on selected tasks finishes.

**Parameters**
- `$action` `string`: `'move_tasks'`, `'move_to_stage'` (legacy alias of `move_tasks`), `'archive_tasks'`, `'change_priority'`, `'assign_members'` or `'add_labels'`
- `$tasks` `\FluentBoards\Framework\Support\Collection`: the Task models the action ran on, as loaded **before** the action
- `$boardId` `int`: the board ID

**Usage**
```php
add_action('fluent_boards/bulk_action_completed', function ($action, $tasks, $boardId) {
    // Do whatever you want
}, 10, 3);
```

**Source:** `app/Services/TaskService.php`

</explain-block>

## Time Tracking

<explain-block title="fluent_boards/task_moved_update_time_tracking">

Fires while a task is moved to another board, once for the task and once for each of its subtasks. Pro's time tracking listens to it to move the tracked time records to the new board.

**Parameters**
- `$task` `\FluentBoards\App\Models\Task`: the task or subtask, with its new `board_id` already set

**Usage**
```php
add_action('fluent_boards/task_moved_update_time_tracking', function ($task) {
    // Do whatever you want
}, 10, 1);
```

**Source:** `app/Services/TaskService.php`

</explain-block>

## Subtasks

<explain-block title="fluent_boards/subtask_added">
<Badge type="tip" text="Pro" />

Fires after a subtask is created under a task, or after an existing task is converted into a subtask.

**Parameters**
- `$parentTask` `\FluentBoards\App\Models\Task`: the parent task
- `$subtask` `\FluentBoards\App\Models\Task`: the subtask

**Usage**
```php
add_action('fluent_boards/subtask_added', function ($parentTask, $subtask) {
    // Do whatever you want
}, 10, 2);
```

**Source:** `fluent-boards-pro/app/Services/SubtaskService.php`, `fluent-boards-pro/app/Services/ProTaskService.php`

</explain-block>

<explain-block title="fluent_boards/subtask_cloned">
<Badge type="tip" text="Pro" />

Fires after a subtask is duplicated.

**Parameters**
- `$parentTask` `\FluentBoards\App\Models\Task`: the parent task
- `$clonedSubtask` `\FluentBoards\App\Models\Task`: the new subtask, with `assignees` loaded

**Usage**
```php
add_action('fluent_boards/subtask_cloned', function ($parentTask, $clonedSubtask) {
    // Do whatever you want
}, 10, 2);
```

**Source:** `fluent-boards-pro/app/Services/SubtaskService.php`

</explain-block>

<explain-block title="fluent_boards/subtask_deleted_activity">

Fires after a subtask is deleted. Callers: the PHP API, the Pro subtask route and the Pro MCP tool. `fluent_boards/task_deleted` also fires for the subtask.

**Parameters**
- `$parentId` `int`: the parent task ID
- `$title` `string`: the deleted subtask's title

**Usage**
```php
add_action('fluent_boards/subtask_deleted_activity', function ($parentId, $title) {
    // Do whatever you want
}, 10, 2);
```

**Source:** `app/Api/Classes/Tasks.php`, `fluent-boards-pro/app/Http/Controllers/SubtaskController.php`, `fluent-boards-pro/app/Modules/MCP/Tools/ProTaskTools.php`

</explain-block>

<explain-block title="fluent_boards/subtask_group_created">
<Badge type="tip" text="Pro" />

Fires after a subtask group (checklist section) is created on a task.

**Parameters**
- `$taskId` `int`: the parent task ID
- `$group` `\FluentBoards\App\Models\TaskMeta`: the group. The title is in `$group->value`.

**Usage**
```php
add_action('fluent_boards/subtask_group_created', function ($taskId, $group) {
    // Do whatever you want
}, 10, 2);
```

**Source:** `fluent-boards-pro/app/Services/SubtaskService.php`

</explain-block>

<explain-block title="fluent_boards/subtask_group_title_updated">
<Badge type="tip" text="Pro" />

Fires after a subtask group is renamed.

**Parameters**
- `$oldTitle` `string`: the previous title
- `$group` `\FluentBoards\App\Models\TaskMeta`: the group with the new title in `$group->value`

**Usage**
```php
add_action('fluent_boards/subtask_group_title_updated', function ($oldTitle, $group) {
    // Do whatever you want
}, 10, 2);
```

**Source:** `fluent-boards-pro/app/Services/SubtaskService.php`

</explain-block>

<explain-block title="fluent_boards/subtask_group_deleted_activity">
<Badge type="tip" text="Pro" />

Fires after a subtask group and its subtasks are deleted. It runs after the database transaction commits.

**Parameters**
- `$taskId` `int`: the parent task ID
- `$group` `\FluentBoards\App\Models\TaskMeta`: a clone of the deleted group

**Usage**
```php
add_action('fluent_boards/subtask_group_deleted_activity', function ($taskId, $group) {
    // Do whatever you want
}, 10, 2);
```

**Source:** `fluent-boards-pro/app/Services/SubtaskService.php`

</explain-block>

## Attachments

<explain-block title="fluent_boards/task_attachment_added">
<Badge type="tip" text="Pro" />

Fires after a task attachment (an uploaded file or a link) is stored. It fires from the attachment model's `created` event.

**Parameters**
- `$attachment` `\FluentBoardsPro\App\Models\TaskAttachment`: the new attachment

**Usage**
```php
add_action('fluent_boards/task_attachment_added', function ($attachment) {
    // Do whatever you want
}, 10, 1);
```

**Source:** `fluent-boards-pro/app/Models/TaskAttachment.php`

</explain-block>

<explain-block title="fluent_boards/task_attachment_deleted">

Fires after an attachment record is deleted. Callers: deleting a single attachment (Pro), removing a task cover image, and deleting all attachments when a task is deleted.

**Parameters**
- `$attachment` `\FluentBoardsPro\App\Models\TaskAttachment|\FluentBoards\App\Models\TaskImage`: a clone of the deleted record. It is a `TaskImage` when a cover image is removed.
- `$boardId` `int|null` *(optional)*: only passed when attachments are deleted together with their task

**Note:** The number of arguments differs by caller. Register with `10, 2` and give `$boardId` a default value.

**Usage**
```php
add_action('fluent_boards/task_attachment_deleted', function ($attachment, $boardId = null) {
    // Do whatever you want
}, 10, 2);
```

**Source:** `app/Services/TaskService.php`, `fluent-boards-pro/app/Services/AttachmentService.php`

</explain-block>

## Custom Fields & Dependencies

<explain-block title="fluent_boards/task_custom_field_changed">
<Badge type="tip" text="Pro" />

Fires after a custom field value is saved on a task.

**Parameters**
- `$taskId` `int`: the task ID
- `$customField` `\FluentBoardsPro\App\Models\CustomField`: the custom field definition
- `$oldValue` `mixed`: the previous value, or `null` if none was set
- `$newValue` `mixed`: the stored value. Checkbox values are cast to `bool`, and date values are normalized.
- `$isNew` `bool`: `true` when the task had no value for this field before

**Usage**
```php
add_action('fluent_boards/task_custom_field_changed', function ($taskId, $customField, $oldValue, $newValue, $isNew) {
    // Do whatever you want
}, 10, 5);
```

**Source:** `fluent-boards-pro/app/Services/CustomFieldService.php`

</explain-block>

<explain-block title="fluent_boards/task_dependency_added">
<Badge type="tip" text="Pro" />

Fires after a dependency is added between two tasks. The dependency type is finish-to-start: the successor waits for the predecessor.

**Parameters**
- `$predecessor` `\FluentBoards\App\Models\Task`: the task that must finish first
- `$successor` `\FluentBoards\App\Models\Task`: the dependent task
- `$boardId` `int`: the board ID

**Usage**
```php
add_action('fluent_boards/task_dependency_added', function ($predecessor, $successor, $boardId) {
    // Do whatever you want
}, 10, 3);
```

**Source:** `fluent-boards-pro/app/Services/DependencyService.php`

</explain-block>

<explain-block title="fluent_boards/task_dependency_removed">
<Badge type="tip" text="Pro" />

Fires after a dependency between two tasks is removed. It fires only when both tasks and the board can still be resolved.

**Parameters**
- `$predecessor` `\FluentBoards\App\Models\Task`: the predecessor task
- `$successor` `\FluentBoards\App\Models\Task`: the successor task
- `$boardId` `int`: the board ID

**Usage**
```php
add_action('fluent_boards/task_dependency_removed', function ($predecessor, $successor, $boardId) {
    // Do whatever you want
}, 10, 3);
```

**Source:** `fluent-boards-pro/app/Services/DependencyService.php`

</explain-block>

## Recurring Tasks

<explain-block title="fluent_boards/repeat_task_set">
<Badge type="tip" text="Pro" />

Fires after recurrence settings are added to a task for the first time.

**Parameters**
- `$task` `\FluentBoards\App\Models\Task`: the task

**Usage**
```php
add_action('fluent_boards/repeat_task_set', function ($task) {
    // Do whatever you want
}, 10, 1);
```

**Source:** `fluent-boards-pro/app/Http/Controllers/ProTaskController.php`

</explain-block>

<explain-block title="fluent_boards/repeat_task_updated">
<Badge type="tip" text="Pro" />

Fires after a task's existing recurrence settings are changed.

**Parameters**
- `$task` `\FluentBoards\App\Models\Task`: the task

**Usage**
```php
add_action('fluent_boards/repeat_task_updated', function ($task) {
    // Do whatever you want
}, 10, 1);
```

**Source:** `fluent-boards-pro/app/Http/Controllers/ProTaskController.php`

</explain-block>

<explain-block title="fluent_boards/repeat_task">
<Badge type="tip" text="Pro" />

Fires from the recurring-task scheduler for each recurring task whose next run time has passed. Pro's own handler on this hook creates the next copy of the task.

**Parameters**
- `$taskId` `int`: the source task ID
- `$metaId` `int`: the ID of the recurrence meta row (`fbs_metas`, `object_type = 'repeat_task'`)

**Usage**
```php
add_action('fluent_boards/repeat_task', function ($taskId, $metaId) {
    // Do whatever you want
}, 10, 2);
```

**Source:** `fluent-boards-pro/app/Hooks/Handlers/ProScheduleHandler.php`

</explain-block>

<explain-block title="fluent_boards/repeat_task_created">
<Badge type="tip" text="Pro" />

Fires after the next copy of a recurring task is created. The copy is created without firing `fluent_boards/task_created`.

**Parameters**
- `$newTask` `\FluentBoards\App\Models\Task`: the newly created task
- `$sourceTask` `\FluentBoards\App\Models\Task`: the recurring task it was copied from

**Usage**
```php
add_action('fluent_boards/repeat_task_created', function ($newTask, $sourceTask) {
    // Do whatever you want
}, 10, 2);
```

**Source:** `fluent-boards-pro/app/Hooks/Handlers/ProTaskHandler.php`

</explain-block>

## Integrations

<explain-block title="fluent_boards/task_added_from_fluent_form">

Fires after the Fluent Forms integration feed creates a task from a form submission.

**Parameters**
- `$task` `\FluentBoards\App\Models\Task`: the new task

**Usage**
```php
add_action('fluent_boards/task_added_from_fluent_form', function ($task) {
    // Do whatever you want
}, 10, 1);
```

**Source:** `app/Services/Intergrations/FluentFormIntegration/Bootstrap.php`

</explain-block>

<explain-block title="fluent_boards/contact_added_to_task">

Fires when a FluentCRM contact is associated with a task. Callers: task creation with `crm_contact_id` set, and a change of the task's associated contact. On a change, it fires even when the contact is removed.

**Parameters**
- `$task` `\FluentBoards\App\Models\Task`: the task. `$task->crm_contact_id` holds the contact ID.

**Usage**
```php
add_action('fluent_boards/contact_added_to_task', function ($task) {
    if ($task->crm_contact_id) {
        // Do whatever you want
    }
}, 10, 1);
```

**Source:** `app/Models/Task.php`, `app/Services/TaskService.php`

</explain-block>

<explain-block title="fluent_boards/associate_user_add_change_remove_activity">

Fires after a task's associated FluentCRM contact is added, changed or removed. It fires right after `fluent_boards/contact_added_to_task`.

**Parameters**
- `$oldContactId` `int|null`: the previous contact ID
- `$newContactId` `int|null`: the new contact ID (empty when removed)
- `$taskId` `int`: the task ID

**Usage**
```php
add_action('fluent_boards/associate_user_add_change_remove_activity', function ($oldContactId, $newContactId, $taskId) {
    // Do whatever you want
}, 10, 3);
```

**Source:** `app/Services/TaskService.php`

</explain-block>

<explain-block title="fluent_boards/support_ticket_unlinked">

Fires after a Fluent Support ticket link is removed from a task.

**Parameters**
- `$task` `\FluentBoards\App\Models\Task`: the task
- `$ticketId` `int`: the unlinked Fluent Support ticket ID

**Usage**
```php
add_action('fluent_boards/support_ticket_unlinked', function ($task, $ticketId) {
    // Do whatever you want
}, 10, 2);
```

**Source:** `app/Services/TaskService.php`

</explain-block>
