# Comments

The Comments API manages comments and threaded replies on tasks, comment images, and comment privacy. Comments and replies are rows of `fbs_comments`; a reply is a comment with `type: "reply"` and a `parent_id`. Plugin source: free.

Board members can read comments; members who are not "viewer only" can write. Editing, deleting and changing privacy only works on your own comments.

## Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/projects/{board_id}/tasks/{task_id}/comments` | List comments of a task |
| POST | `/projects/{board_id}/tasks/{task_id}/comments` | Create a comment or reply |
| PUT | `/projects/{board_id}/tasks/comments/{comment_id}` | Update a comment |
| PUT | `/projects/{board_id}/tasks/reply/{reply_id}` | Update a reply |
| DELETE | `/projects/{board_id}/tasks/comments/{comment_id}` | Delete a comment and its replies |
| DELETE | `/projects/{board_id}/tasks/reply/{reply_id}` | Delete a reply |
| PUT | `/projects/{board_id}/tasks/comments/{comment_id}/privacy` | Toggle comment privacy |
| POST | `/projects/{board_id}/tasks/{task_id}/comment-image-upload` | Upload an image for a comment |

## Comment Object

| Field | Type | Description |
|---|---|---|
| `id` | integer | Comment ID |
| `board_id`, `task_id` | integer | Board and task |
| `parent_id` | integer\|null | Parent comment for replies |
| `type` | string | `comment` or `reply` |
| `privacy` | string | `private` or `public` |
| `status` | string | For example `published` |
| `author_name`, `author_email` | string | Author snapshot |
| `description` | string | Rendered HTML (links and mentions converted) |
| `settings.raw_description` | string | Text as submitted |
| `settings.mentioned_id` | integer[] | Mentioned user IDs |
| `created_by` | integer | Author user ID |
| `created_at`, `updated_at` | string | Timestamps |

Responses often add `user`, `avatar`, `images` and (for top-level comments) `replies`.

## List Comments

Returns the top-level comments of a task with their replies and images, 10 per page. Use `filter` to change the sort order.

```http
GET /wp-json/fluent-boards/v2/projects/{board_id}/tasks/{task_id}/comments
```

**Parameters**

| Parameter | Type | Required | Description |
|---|---|---|---|
| `filter` | string | No | `oldest` sorts oldest first; any other value (`latest`, `newest`, empty) sorts newest first |
| `page` | integer | No | Page number (read by the paginator). Page size is fixed at 10 |

**Example Request**

```bash
curl "https://yourdomain.com/wp-json/fluent-boards/v2/projects/5/tasks/456/comments?filter=oldest&page=1" \
  -u "USERNAME:APPLICATION_PASSWORD"
```

**Example Response**

```json
{
  "comments": {
    "current_page": 1,
    "data": [
      {
        "id": 123,
        "board_id": 5,
        "task_id": 456,
        "parent_id": null,
        "type": "comment",
        "privacy": "private",
        "status": "published",
        "author_name": "John Doe",
        "author_email": "john.doe@example.com",
        "description": "This is a comment on the task",
        "created_by": 789,
        "settings": {
          "raw_description": "This is a comment on the task",
          "mentioned_id": []
        },
        "created_at": "2024-01-15T10:30:00+00:00",
        "updated_at": "2024-01-15T10:30:00+00:00",
        "replies": [],
        "replies_count": 0,
        "user": {
          "ID": 789,
          "display_name": "John Doe",
          "photo": "https://secure.gravatar.com/avatar/abc123def456?s=128&d=mm&r=g"
        },
        "images": []
      }
    ],
    "first_page_url": "https://example.com/wp-json/fluent-boards/v2/projects/5/tasks/456/comments/?page=1",
    "from": 1,
    "last_page": 1,
    "next_page_url": null,
    "path": "https://example.com/wp-json/fluent-boards/v2/projects/5/tasks/456/comments",
    "per_page": 10,
    "prev_page_url": null,
    "to": 1,
    "total": 1
  },
  "total": 1
}
```

The top-level `total` counts comments **and** replies on the task; `comments.total` counts only top-level comments.

## Create a Comment

Creates a comment, or a reply when `parent_id` is set. The author is always the current user. URLs are auto-linked and mentions are rendered as profile links. Email notifications are queued in the background: for comments, to the task's notification recipients (subject to their preferences); for replies, to the parent comment's author.

```http
POST /wp-json/fluent-boards/v2/projects/{board_id}/tasks/{task_id}/comments
```

**Parameters**

| Parameter | Type | Required | Description |
|---|---|---|---|
| `comment` | string | Yes* | Comment text. Optional when `images` is sent |
| `comment_type` | string | No | `comment` (default) or `reply` |
| `parent_id` | integer | For replies | Parent comment ID; must be a comment on the same task |
| `images` | integer[] | No | IDs returned by [Upload a Comment Image](#upload-a-comment-image). Only your own, not-yet-attached uploads for this board/task are accepted |
| `mentionData` | integer[] | No | User IDs to mention. All must be board members, otherwise `403` |

**Example Request**

```bash
curl "https://yourdomain.com/wp-json/fluent-boards/v2/projects/5/tasks/456/comments" \
  -X POST \
  -u "USERNAME:APPLICATION_PASSWORD" \
  -H "Content-Type: application/json" \
  -d '{
    "comment": "Hey @johndoe, please review this design at https://figma.com/file/abc123",
    "comment_type": "comment",
    "images": [1, 2],
    "mentionData": [789]
  }'
```

Reply to comment `3`:

```bash
curl "https://yourdomain.com/wp-json/fluent-boards/v2/projects/5/tasks/456/comments" \
  -X POST \
  -u "USERNAME:APPLICATION_PASSWORD" \
  -H "Content-Type: application/json" \
  -d '{
    "comment": "This is a reply to the comment",
    "parent_id": 3,
    "comment_type": "reply"
  }'
```

**Example Response** (`201`)

```json
{
  "message": "Comment has been added",
  "comment": {
    "id": 123,
    "parent_id": null,
    "description": "Hey <a class=\"fbs_mention\" href=\"https://example.com/projects#/member/789/tasks\">John Doe</a>, please review this design at <a class=\"fbs_link\" target=\"_blank\" rel=\"noopener noreferrer\" href=\"https://figma.com/file/abc123\">https://figma.com/file/abc123</a>",
    "created_by": 789,
    "task_id": 456,
    "type": "comment",
    "board_id": 5,
    "settings": {
      "raw_description": "Hey @johndoe, please review this design at https://figma.com/file/abc123",
      "mentioned_id": [789]
    },
    "privacy": "private",
    "author_email": "john.doe@example.com",
    "author_name": "John Doe",
    "created_at": "2024-01-15T12:00:00+00:00",
    "updated_at": "2024-01-15T12:00:00+00:00",
    "user": {
      "ID": 789,
      "display_name": "John Doe",
      "photo": "https://secure.gravatar.com/avatar/abc123def456?s=128&d=mm&r=g"
    },
    "images": [
      {
        "id": 1,
        "object_id": 123,
        "object_type": "comment_image",
        "attachment_type": "image/png",
        "title": "design-mockup-1.png",
        "file_hash": "abc123def456789ghi012jkl345mno678",
        "driver": "local",
        "file_size": "512 KB",
        "secure_url": "https://example.com/index.php?fbs=1&fbs_comment_image=abc123def456789ghi012jkl345mno678&secure_sign=def456ghi789012jkl345mno678pqr901"
      }
    ],
    "replies": []
  }
}
```

`replies` is loaded only for `type: "comment"`.

## Update a Comment

Updates the text of your own comment. If `images` is sent as an array it **replaces** the comment's image set: listed IDs are kept or attached, other images on the comment are deleted. New mentions must be board members.

```http
PUT /wp-json/fluent-boards/v2/projects/{board_id}/tasks/comments/{comment_id}
```

**Parameters**

| Parameter | Type | Required | Description |
|---|---|---|---|
| `comment` | string | Yes* | New text. Optional when `images` is sent |
| `images` | integer[] | No | Full list of image IDs the comment should have |
| `mentionData` | integer[] | No | User IDs to mention (merged with existing mentions) |

**Example Request**

```bash
curl "https://yourdomain.com/wp-json/fluent-boards/v2/projects/3/tasks/comments/4" \
  -X PUT \
  -u "USERNAME:APPLICATION_PASSWORD" \
  -H "Content-Type: application/json" \
  -d '{
    "comment": "This is the updated comment content with https://example.com link",
    "images": [28],
    "mentionData": [789]
  }'
```

**Example Response**

```json
{
  "comment": {
    "id": 4,
    "board_id": 3,
    "task_id": 85,
    "parent_id": null,
    "type": "comment",
    "privacy": "private",
    "description": "This is the updated comment content with <a class=\"fbs_link\" target=\"_blank\" rel=\"noopener noreferrer\" href=\"https://example.com\">https://example.com</a> link",
    "created_by": 789,
    "settings": {
      "raw_description": "This is the updated comment content with https://example.com link",
      "mentioned_id": [789]
    },
    "images": [
      { "id": 28, "object_id": 4, "object_type": "comment_image", "title": "updated-image.png" }
    ],
    "user": { "ID": 789, "display_name": "John Doe" },
    "updated_at": "2024-01-15T13:00:00+00:00"
  },
  "message": "Comment has been updated"
}
```

Returns `401` "Unauthorized Action" when you are not the author.

## Update a Reply

Updates the text of your own reply. Images are not handled by this endpoint.

```http
PUT /wp-json/fluent-boards/v2/projects/{board_id}/tasks/reply/{reply_id}
```

**Parameters**

| Parameter | Type | Required | Description |
|---|---|---|---|
| `comment` | string | Yes | New reply text |
| `mentionData` | integer[] | No | User IDs to mention |

**Example Request**

```bash
curl "https://yourdomain.com/wp-json/fluent-boards/v2/projects/3/tasks/reply/8" \
  -X PUT \
  -u "USERNAME:APPLICATION_PASSWORD" \
  -H "Content-Type: application/json" \
  -d '{ "comment": "Updated reply text" }'
```

**Example Response**

```json
{
  "description": "Updated reply text",
  "message": "Reply has been updated"
}
```

Returns `401` "Unauthorized Action" when you are not the author.

## Delete a Comment

Deletes your own comment, its replies and their images, and updates the task's comment count.

```http
DELETE /wp-json/fluent-boards/v2/projects/{board_id}/tasks/comments/{comment_id}
```

**Example Request**

```bash
curl "https://yourdomain.com/wp-json/fluent-boards/v2/projects/3/tasks/comments/4" \
  -X DELETE \
  -u "USERNAME:APPLICATION_PASSWORD"
```

**Example Response**

```json
{
  "message": "Comment has been deleted"
}
```

::: warning
If you are not the author nothing is deleted, but the endpoint still returns `200` with this message.
:::

## Delete a Reply

Deletes your own reply and its images.

```http
DELETE /wp-json/fluent-boards/v2/projects/{board_id}/tasks/reply/{reply_id}
```

**Example Request**

```bash
curl "https://yourdomain.com/wp-json/fluent-boards/v2/projects/3/tasks/reply/8" \
  -X DELETE \
  -u "USERNAME:APPLICATION_PASSWORD"
```

**Example Response**

```json
{
  "message": "Reply has been deleted"
}
```

As with comments, a non-author request returns `200` without deleting anything.

## Toggle Comment Privacy

Switches your own comment between `private` and `public`. There is no body; each call flips the current value.

```http
PUT /wp-json/fluent-boards/v2/projects/{board_id}/tasks/comments/{comment_id}/privacy
```

**Example Request**

```bash
curl "https://yourdomain.com/wp-json/fluent-boards/v2/projects/3/tasks/comments/4/privacy" \
  -X PUT \
  -u "USERNAME:APPLICATION_PASSWORD"
```

**Example Response**

```json
{
  "comment": { "id": 4, "privacy": "public" },
  "0": "public",
  "message": "This comment is now public"
}
```

The stray `"0"` key is a side effect of the current controller code. Returns `401` "Unauthorized Action" when you are not the author.

## Upload a Comment Image

Uploads one image for later use in [Create a Comment](#create-a-comment) or [Update a Comment](#update-a-comment). The image is stored unattached (`object_id: 0`) until a comment claims it.

```http
POST /wp-json/fluent-boards/v2/projects/{board_id}/tasks/{task_id}/comment-image-upload
```

**Parameters**

| Parameter | Type | Required | Description |
|---|---|---|---|
| `file` | file | Yes | Image: JPEG, GIF, PNG, BMP, TIFF, WebP, AVIF, ICO or HEIC |

**Example Request**

```bash
curl "https://yourdomain.com/wp-json/fluent-boards/v2/projects/1/tasks/85/comment-image-upload" \
  -X POST \
  -u "USERNAME:APPLICATION_PASSWORD" \
  -F "file=@/path/to/unnamed-3.png"
```

**Example Response**

```json
{
  "message": "attachment has been added",
  "imageAttachment": {
    "id": 24,
    "object_id": 0,
    "object_type": "comment_image",
    "attachment_type": "image/png",
    "title": "unnamed-3.png",
    "full_url": "https://yourdomain.com/wp-content/uploads/fluent-boards/board_1/1711111111-unnamed-3.png",
    "file_size": "484 KB",
    "driver": "local",
    "file_hash": "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
    "created_at": "2025-08-08T06:56:07+00:00",
    "updated_at": "2025-08-08T06:56:07+00:00",
    "public_url": "https://yourdomain.com/index.php?fbs=1&fbs_type=public_url&fbs_comment_image=aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
    "secure_url": "https://yourdomain.com/index.php?fbs=1&fbs_comment_image=aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa&secure_sign=bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb"
  }
}
```

A non-image file fails validation with `422` ("The file must be a image type.").

## Error Responses

See [Common Error Responses](/rest-api/shared/error-responses) for standard error formats.

Common comment errors:

- **400** — task or parent comment not found, invalid image selection
- **401** — you are not the author of the comment you tried to edit
- **403** — a mentioned user is not a board member, or you have no write access to the board
- **404** — comment not found on this board
- **422** — validation failed (for example empty `comment` without images)
