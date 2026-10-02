# Attachment Model

| DB Table Name | `{wp_db_prefix}fbs_attachments` |
|---------------|---------------------------------|
| Schema        | [Check Schema](/database/#fbs-attachments-table) |
| Source File   | fluent-boards/app/Models/Attachment.php |
| Name Space    | FluentBoards\App\Models |
| Class         | FluentBoards\App\Models\Attachment |

Base model for rows in `fbs_attachments`. It has no global scope, so it sees every attachment type. The subclasses add the secure URL logic and relations:

| Subclass | Used for | `object_type` |
|---|---|---|
| [TaskImage](/database/models/task-image) | Images in task descriptions | `task_description` |
| [CommentImage](/database/models/comment-image) | Images in comments | `comment_image` |
| [TaskAttachment](/database/models/task-attachment) (Pro) | Files and links attached to a task | `TASK` |

## Attributes

| Attribute | Data Type | Comment |
|---|---|---|
| id | INT UNSIGNED | Primary key |
| object_id | INT UNSIGNED | Task, comment or board ID |
| object_type | VARCHAR(100) | `TASK`, `task_description`, `comment_image` or `BOARD` |
| attachment_type | VARCHAR(100) NULL | `url` for links, otherwise the file type |
| file_path | TEXT NULL | Local file path |
| full_url | TEXT NULL | File or link URL |
| settings | TEXT NULL | Serialized; returned as an array |
| title | VARCHAR(192) NULL | Display title |
| file_hash | VARCHAR(192) NULL | Random hash used in secure URLs |
| driver | VARCHAR(100) | `local` by default |
| status | VARCHAR(100) NULL | `ACTIVE` (default), `INACTIVE` or `DELETED` |
| file_size | VARCHAR(100) NULL | File size |
| created_at | TIMESTAMP NULL | |
| updated_at | TIMESTAMP NULL | |

Fillable: `file_hash`, `object_type`, `object_id`, `settings`, `file_path`, `full_url`, `file_size`, `attachment_type`.

The model declares `secure_url` as an appended attribute, but only the subclasses define the accessor for it. Use a subclass when you need `secure_url` or `toArray()`.

## Usage

Please check [Model Basic](/database/models/) for common methods.

```php
use FluentBoards\App\Models\Attachment;

// Count all active attachments of a task, regardless of subclass
$count = Attachment::where('object_id', 42)
    ->whereIn('object_type', ['TASK', 'task_description'])
    ->where('status', 'ACTIVE')
    ->count();
```
