# CommentImage Model

| DB Table Name | `{wp_db_prefix}fbs_attachments` |
|---------------|---------------------------------|
| Schema        | [Check Schema](/database/#fbs-attachments-table) |
| Source File   | fluent-boards/app/Models/CommentImage.php |
| Name Space    | FluentBoards\App\Models |
| Class         | FluentBoards\App\Models\CommentImage |
| Extends       | [Attachment](/database/models/attachment) |

An image uploaded into a comment. Rows use `object_type = 'comment_image'` and `object_id` = comment ID. The model has no global scope; filter by `object_type` yourself or go through `Comment::images()`.

On create, the model sets a random `file_hash`.

## Attributes

Same columns as [Attachment](/database/models/attachment#attributes).

Appended attributes:

| Attribute | Comment |
|---|---|
| secure_url | For `attachment_type = 'url'`, the stored `full_url`. Otherwise a site URL with `fbs=1&fbs_comment_image={file_hash}` that serves the file through FluentBoards |

## Usage

```php
$images = $comment->images; // via the Comment relation

$image = FluentBoards\App\Models\CommentImage::where('object_type', 'comment_image')
    ->where('file_hash', $hash)
    ->first();

$url = $image->secure_url;
```

## Scopes

### withComment()

Filters to `object_type = 'comment_image'` and eager-loads the comment (`id`, `board_id`).

```php
$images = FluentBoards\App\Models\CommentImage::withComment()->get();
```

## Relations

### comment

- Returns `FluentBoards\App\Models\Comment`
