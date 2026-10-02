# TaskAttachment Model

<Badge type="warning" text="Pro" />

| DB Table Name | `{wp_db_prefix}fbs_attachments` |
|---------------|---------------------------------|
| Schema        | [Check Schema](/database/#fbs-attachments-table) |
| Source File   | fluent-boards-pro/app/Models/TaskAttachment.php |
| Name Space    | FluentBoardsPro\App\Models |
| Class         | FluentBoardsPro\App\Models\TaskAttachment |
| Extends       | [Attachment](/database/models/attachment) |

A file or link attached to a task. Rows use `object_type = 'TASK'` and `object_id` = task ID. The model has no global scope; `Task::attachments()` adds the `object_type` filter.

### Model events

- **creating:** sets a random `file_hash`.
- **created:** fires the `fluent_boards/task_attachment_added` action with the new model.

## Attributes

Same columns as [Attachment](/database/models/attachment#attributes).

Appended attributes:

| Attribute | Comment |
|---|---|
| secure_url | For `attachment_type = 'url'`, the stored `full_url`. Otherwise a site URL with `fbs=1&fbs_attachment={file_hash}` that serves the file through FluentBoards |

`toArray()` removes `file_path` and `full_url` for uploaded files (anything other than `attachment_type = 'url'`), so the real file location is not exposed.

## Usage

Please check [Model Basic](/database/models/) for common methods.

```php
use FluentBoardsPro\App\Models\TaskAttachment;

$attachments = $task->attachments; // via the Task relation

$attachment = TaskAttachment::where('object_type', 'TASK')
    ->where('object_id', 42)
    ->latest()
    ->first();

echo $attachment->secure_url;
```

## Scopes

### withTask()

Filters to `object_type` `TASK`, `task_description` or `comment_image`, and eager-loads the task (`id`, `title`, `board_id`).

```php
$files = TaskAttachment::withTask()->where('status', 'ACTIVE')->get();
```

## Relations

### task

- Returns `FluentBoards\App\Models\Task`

```php
$attachment = TaskAttachment::find(1);
$task = $attachment->task;
```

## Hooks

```php
add_action('fluent_boards/task_attachment_added', function ($attachment) {
    // $attachment is a FluentBoardsPro\App\Models\TaskAttachment
}, 10, 1);
```
