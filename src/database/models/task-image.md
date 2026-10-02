# TaskImage Model

| DB Table Name | `{wp_db_prefix}fbs_attachments` |
|---------------|---------------------------------|
| Schema        | [Check Schema](/database/#fbs-attachments-table) |
| Source File   | fluent-boards/app/Models/TaskImage.php |
| Name Space    | FluentBoards\App\Models |
| Class         | FluentBoards\App\Models\TaskImage |
| Extends       | [Attachment](/database/models/attachment) |

An image uploaded into a task description. Rows use `object_type = 'task_description'` and `object_id` = task ID. The model has no global scope.

On create, the model sets a random `file_hash`.

## Attributes

Same columns as [Attachment](/database/models/attachment#attributes).

Appended attributes:

| Attribute | Comment |
|---|---|
| secure_url | For `attachment_type = 'url'`, the stored `full_url`. Otherwise a site URL with `fbs=1&fbs_comment_image={file_hash}` |

## Usage

```php
$images = FluentBoards\App\Models\TaskImage::where('object_type', 'task_description')
    ->where('object_id', 42)
    ->get();

foreach ($images as $image) {
    echo $image->secure_url;
}
```

## Scopes

::: warning
The model defines no `task` or `comment` relation, so the eager loads in these scopes fail when the query runs. Filter by `object_type` and `object_id` directly instead (as in the example above).
:::

### withTask()

Filters to `object_type = 'task_description'` and eager-loads `task`.

### withComment()

Filters to `object_type = 'COMMENT'` and eager-loads `comment`.
