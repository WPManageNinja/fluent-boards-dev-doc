# Comment Model

| DB Table Name | `{wp_db_prefix}fbs_comments` |
|---------------|------------------------------|
| Schema        | [Check Schema](/database/#fbs-comments-table) |
| Source File   | fluent-boards/app/Models/Comment.php |
| Name Space    | FluentBoards\App\Models |
| Class         | FluentBoards\App\Models\Comment |

::: tip Global eager loads
The model registers two global scopes, `images` and `replies`, that always eager-load those relations. Remove them with `Comment::withoutGlobalScopes(['images', 'replies'])` when you do not need them.
:::

## Attributes

| Attribute | Data Type | Comment |
|---|---|---|
| id | INT UNSIGNED | Primary key |
| board_id | INT UNSIGNED | Board ID |
| task_id | INT UNSIGNED | Task ID |
| parent_id | BIGINT UNSIGNED NULL | Parent comment for replies. Values below 1 are saved as NULL |
| type | VARCHAR(50) NULL | `comment` (default), `note` or `reply` |
| privacy | VARCHAR(50) NULL | `public` or `private`. The model sets `private` when empty |
| status | VARCHAR(50) NULL | `published` (default), `draft` or `spam` |
| author_name | VARCHAR(192) NULL | Filled from the WP user on create |
| author_email | VARCHAR(192) NULL | Filled from the WP user on create |
| author_ip | VARCHAR(50) NULL | Author IP |
| description | TEXT NULL | Comment body (HTML) |
| created_by | BIGINT UNSIGNED NULL | Author user ID. Defaults to the current user |
| settings | TEXT NULL | Serialized; returned as an array |
| created_at | TIMESTAMP NULL | |
| updated_at | TIMESTAMP NULL | |

Appended attributes:

| Attribute | Comment |
|---|---|
| avatar | Avatar URL for the author, from `fluent_boards_user_avatar()` |

### Model events

- **creating:** fills `created_by`, `type`, `privacy`, `author_email` and `author_name`.
- **created / deleted:** increments / decrements the task's `comments_count` for `type = 'comment'`.
- **deleting:** deletes the comment's images and their files.

## Usage

Please check [Model Basic](/database/models/) for common methods.

```php
$comment = FluentBoards\App\Models\Comment::create([
    'board_id'    => 1,
    'task_id'     => 42,
    'description' => '<p>Looks good to me.</p>',
]);
```

## Scopes

### byTask($taskId)

```php
$comments = FluentBoards\App\Models\Comment::byTask(42)->whereNull('parent_id')->get();
```

### privacy($privacy)

```php
$public = FluentBoards\App\Models\Comment::byTask(42)->privacy('public')->get();
```

### type($type)

```php
$notes = FluentBoards\App\Models\Comment::byTask(42)->type('note')->get();
```

## Relations

### task

- Returns `FluentBoards\App\Models\Task`

### user

The author (`created_by`).

- Returns `FluentBoards\App\Models\User`

### replies

Comments whose `parent_id` is this comment.

- Returns a collection of `FluentBoards\App\Models\Comment`

```php
$replies = $comment->replies;
```

### images

Images attached to the comment (`fbs_attachments`, `object_type = 'comment_image'`).

- Returns a collection of `FluentBoards\App\Models\CommentImage`

### parentComment

::: warning
Despite its name, this relation is defined as `hasOne(Comment::class, 'parent_id', 'id')`, so it returns the first **reply** to this comment, not its parent. To get the parent, use `Comment::find($comment->parent_id)`.
:::

- Returns `FluentBoards\App\Models\Comment` or `null`
