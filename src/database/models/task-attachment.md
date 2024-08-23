# TaskAttachment Model

| DB Table Name | Inherits from `BoardTerm` {wp_db_prefix}_fbs_board_terms | 
|---------------|----------------------------------------------------------|
| Source File   | fluent-boards-pro/app/Models/TaskAttachment.php          |
| Name Space    | FluentBoardsPro\App\Models                            |
| Class         | FluentBoardsPro\App\Models\TaskAttachment                |


## Relations
This model has the following relationships that you can use

### tasks
Access task associated with the TaskAttachment.

- return `FluentTaskAttachments\App\Models\Task` Model Collection

#### Example:
```php 
$attachment = TaskAttachment::find(1);
$task = $attachment->task; // Retrieves the task associated with this attachment
```

<hr />

