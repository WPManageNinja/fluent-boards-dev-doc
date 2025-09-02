# Comments

The Comments API allows you to manage comments on tasks in Fluent Boards. You can create, read, update, and delete comments, as well as handle threaded replies and file attachments.

## List Task Comments

Retrieve all comments for a specific task.

**HTTP Request**
```
GET /wp-json/fluent-boards/v2/projects/{board_id}/tasks/{task_id}/comments
```

### Example Request

```bash
curl "https://yourdomain.com/wp-json/fluent-boards/v2/projects/{board_id}/tasks/{task_id}/comments?per_page=10&page=1&include_replies=true&include_images=true" \
  -H "Authorization: Basic API_USERNAME:API_PASSWORD"
```

### Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `page` | integer | Page number for pagination (default: 1) |
| `per_page` | integer | Number of comments per page (default: 10) |
| `type` | string | Filter by comment type (e.g., 'comment') |
| `privacy` | string | Filter by privacy setting (e.g., 'private', 'public') |
| `include_replies` | boolean | Include threaded replies (default: true) |
| `include_images` | boolean | Include attached images (default: true) |

### Example Response

```json
{
  "comments": {
    "current_page": 1,
    "data": [
      {
        "id": 123,
        "board_id": "5",
        "task_id": "456",
        "parent_id": null,
        "type": "comment",
        "privacy": "private",
        "status": "published",
        "author_name": "John Doe",
        "author_email": "john.doe@example.com",
        "author_ip": "192.168.1.100",
        "description": "This is a comment on the task",
        "created_by": "789",
        "settings": {
          "raw_description": "This is a comment on the task",
          "mentioned_id": null
        },
        "created_at": "2024-01-15T10:30:00+00:00",
        "updated_at": "2024-01-15T10:30:00+00:00",
        "replies": [],
        "replies_count": 0,
        "avatar": "https://secure.gravatar.com/avatar/abc123def456?s=128&d=mm&r=g",
        "user": {
          "ID": 789,
          "user_login": "johndoe",
          "user_nicename": "john-doe",
          "user_email": "john.doe@example.com",
          "user_url": "https://example.com",
          "user_registered": "2023-01-15 10:30:00",
          "user_status": "0",
          "display_name": "John Doe",
          "photo": "https://secure.gravatar.com/avatar/abc123def456?s=128&d=mm&r=g"
        },
        "images": []
      }
    ],
    "first_page_url": "https://example.com/wp-json/fluent-boards/v2/projects/5/tasks/456/comments/?page=1",
    "from": 1,
    "last_page": 1,
    "last_page_url": "https://example.com/wp-json/fluent-boards/v2/projects/5/tasks/456/comments/?page=1",
    "links": [
      {
        "url": null,
        "label": "pagination.previous",
        "active": false
      },
      {
        "url": "https://example.com/wp-json/fluent-boards/v2/projects/5/tasks/456/comments/?page=1",
        "label": "1",
        "active": true
      },
      {
        "url": null,
        "label": "pagination.next",
        "active": false
      }
    ],
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

## Create a Comment

Create a new comment on a task.

**HTTP Request**
```
POST /wp-json/fluent-boards/v2/projects/{board_id}/tasks/{task_id}/comments
```

### Example Request

```bash
curl "https://yourdomain.com/wp-json/fluent-boards/v2/projects/{board_id}/tasks/{task_id}/comments" \
  -X POST \
  -H "Authorization: Basic API_USERNAME:API_PASSWORD" \
  -H "Content-Type: application/json" \
  -d '{
    "comment": "Hey @johndoe, please review this design...",
    "parent_id": null,
    "comment_type": "comment",
    "comment_by": 789,
    "images": [1, 2],
    "mentionData": [789]
  }'
```

### Request Body

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `comment` | string | Yes* | The comment content (required unless images are provided) |
| `parent_id` | integer | No | ID of parent comment for threaded replies |
| `comment_type` | string | Yes | Comment type (must be 'comment') |
| `comment_by` | integer | No | User ID who created the comment (default: current user) |
| `images` | array | No | Array of image IDs to attach to the comment |
| `mentionData` | array | No | Array of user IDs to mention in the comment |

### Features

- **Auto-linking**: URLs in comments are automatically converted to clickable links
- **Mentions**: Use `mentionData` to mention users with `@username` format
- **Image Attachments**: Attach multiple images using image IDs
- **Threaded Replies**: Create replies by setting `parent_id`
- **Email Notifications**: Automatic email notifications to task assignees and mentioned users

### Example request data

**Request:**
```json
{
  "comment": "Hey @johndoe, please review this design at https://figma.com/file/abc123 and also check https://github.com/fluent-boards. I've attached the mockups below.",
  "parent_id": null,
  "comment_type": "comment",
  "comment_by": 789,
  "images": [1, 2],
  "mentionData": [789]
}
```

### Example response

**Response:**
```json
{
  "message": "Comment has been added",
  "comment": {
    "parent_id": null,
    "description": "Hey @johndoe, please review this design at <a class=\"fbs_link\" target=\"_blank\" rel=\"noopener noreferrer\" href=\"https://figma.com/file/abc123\">https://figma.com/file/abc123</a> and also check <a class=\"fbs_link\" target=\"_blank\" rel=\"noopener noreferrer\" href=\"https://github.com/fluent-boards.\">https://github.com/fluent-boards.</a> I've attached the mockups below.",
    "created_by": 789,
    "task_id": 456,
    "type": "comment",
    "board_id": 5,
    "settings": {
      "raw_description": "Hey @johndoe, please review this design at https://figma.com/file/abc123 and also check https://github.com/fluent-boards. I've attached the mockups below.",
      "mentioned_id": [789]
    },
    "privacy": "private",
    "author_email": "john.doe@example.com",
    "author_name": "John Doe",
    "updated_at": "2024-01-15T12:00:00+00:00",
    "created_at": "2024-01-15T12:00:00+00:00",
    "id": 123,
    "user": {
      "ID": 789,
      "user_login": "johndoe",
      "user_nicename": "john-doe",
      "user_email": "john.doe@example.com",
      "user_url": "https://example.com",
      "user_registered": "2023-01-15 10:30:00",
      "user_status": "0",
      "display_name": "John Doe",
      "photo": "https://secure.gravatar.com/avatar/abc123def456?s=128&d=mm&r=g"
    },
    "avatar": "https://secure.gravatar.com/avatar/abc123def456?s=128&d=mm&r=g",
    "task": {
      "id": 456,
      "parent_id": null,
      "board_id": "5",
      "crm_contact_id": null,
      "title": "Implement New Dashboard Features",
      "slug": "implement-new-dashboard-features",
      "type": "task",
      "status": "open",
      "stage_id": "25",
      "source": "web",
      "source_id": null,
      "priority": "medium",
      "description": "<p>Add new dashboard features including:</p>\n<ol>\n<li>Custom widgets</li>\n<li>Analytics charts</li>\n<li>User preferences</li>\n<li>Real-time updates</li>\n</ol>",
      "lead_value": "0.00",
      "created_by": "789",
      "position": "15.00",
      "comments_count": 3,
      "issue_number": null,
      "reminder_type": "none",
      "settings": {
        "subtask_count": 4,
        "attachment_count": 2,
        "subtask_completed_count": 1
      },
      "remind_at": null,
      "started_at": null,
      "due_at": "2024-02-15 23:59:00",
      "last_completed_at": null,
      "archived_at": null,
      "created_at": "2024-01-10T10:00:00+00:00",
      "updated_at": "2024-01-15T12:00:00+00:00",
      "meta": {
        "is_template": "no",
        "group_name": "Development Tasks"
      },
      "repeat_task_meta": null
    },
    "images": [
      {
        "id": 1,
        "object_id": "123",
        "object_type": "comment_image",
        "attachment_type": "image/png",
        "file_path": "/var/www/example.com/wp-content/uploads/fluent-boards/board_5/1705312800-design-mockup-1.png",
        "full_url": "https://example.com/wp-content/uploads/fluent-boards/board_5/1705312800-design-mockup-1.png",
        "settings": "",
        "title": "design-mockup-1.png",
        "file_hash": "abc123def456789ghi012jkl345mno678",
        "driver": "local",
        "status": "ACTIVE",
        "file_size": "512 KB",
        "created_at": "2024-01-15T11:55:00+00:00",
        "updated_at": "2024-01-15T12:00:00+00:00",
        "secure_url": "https://example.com/index.php?fbs=1&fbs_comment_image=abc123def456789ghi012jkl345mno678&secure_sign=def456ghi789012jkl345mno678pqr901"
      },
      {
        "id": 2,
        "object_id": "123",
        "object_type": "comment_image",
        "attachment_type": "image/png",
        "file_path": "/var/www/example.com/wp-content/uploads/fluent-boards/board_5/1705312860-design-mockup-2.png",
        "full_url": "https://example.com/wp-content/uploads/fluent-boards/board_5/1705312860-design-mockup-2.png",
        "settings": "",
        "title": "design-mockup-2.png",
        "file_hash": "def456ghi789012jkl345mno678pqr901",
        "driver": "local",
        "status": "ACTIVE",
        "file_size": "384 KB",
        "created_at": "2024-01-15T11:56:00+00:00",
        "updated_at": "2024-01-15T12:00:00+00:00",
        "secure_url": "https://example.com/index.php?fbs=1&fbs_comment_image=def456ghi789012jkl345mno678pqr901&secure_sign=ghi789jkl012345mno678pqr901stu234"
      }
    ],
    "replies": []
  }
}
```

### Features Demonstrated

- **Text Content**: Comment with multiple lines and context
- **User Mentions**: `@johndoe` and `@janesmith` with `mentionData` array
- **URL Auto-linking**: Multiple URLs automatically converted to clickable links
- **Image Attachments**: Multiple images with different file types
- **Threaded Comments**: `parent_id` for replies
- **Comment Type**: Specified as "comment" for top-level comments or "reply" for threaded replies
- **User Assignment**: Explicit `comment_by` parameter



## Update a Comment

Update an existing comment. Only the comment author can update their own comments.

**HTTP Request**
```
PUT /wp-json/fluent-boards/v2/projects/{board_id}/tasks/{task_id}/comments/{comment_id}
```

### Example Request

```bash
curl "https://yourdomain.com/wp-json/fluent-boards/v2/projects/{board_id}/tasks/{task_id}/comments/{comment_id}" \
  -X PUT \
  -H "Authorization: Basic API_USERNAME:API_PASSWORD" \
  -H "Content-Type: application/json" \
  -d '{
    "comment": "This is the updated comment content with https://example.com link",
    "images": [1, 2],
    "mentionData": [789]
  }'
```

### Request Body

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `comment` | string | Yes* | The updated comment content (required unless images are provided) |
| `images` | array | No | Array of image IDs to attach to the comment |
| `mentionData` | array | No | Array of user IDs to mention in the comment |

### Example Request Data

```json
{
  "comment": "This is the updated comment content with https://example.com link",
  "images": [1, 2],
  "mentionData": [789]
}
```

### Example Response

```json
{
  "message": "Comment has been updated",
  "comment": {
    "id": 4,
    "board_id": "3",
    "task_id": "85",
    "parent_id": null,
    "type": "comment",
    "privacy": "private",
    "status": "published",
    "author_name": "John Doe",
    "author_email": "john.doe@example.com",
    "author_ip": "",
    "description": "Hey <a class=\"fbs_mention\" href=\"https://example.com/projects#/member/789/tasks\">John Doe</a> , please review this design at <a class=\"fbs_link\" target=\"_blank\" rel=\"noopener noreferrer\" href=\"https://figma.com/file/abc123\">https://figma.com/file/abc123</a> and also check <a class=\"fbs_link\" target=\"_blank\" rel=\"noopener noreferrer\" href=\"https://github.com/fluent-boards.\">https://github.com/fluent-boards.</a> I've attached the mockups below.",
    "created_by": "789",
    "settings": {
      "raw_description": "Hey @johndoe , please review this design at https://figma.com/file/abc123 and also check https://github.com/fluent-boards. I've attached the mockups below.",
      "mentioned_id": ["789"]
    },
    "created_at": "2024-01-15T12:00:00+00:00",
    "updated_at": "2024-01-15T13:00:00+00:00",
    "avatar": "https://secure.gravatar.com/avatar/abc123def456?s=128&d=mm&r=g",
    "images": [
      {
        "id": 28,
        "object_id": "4",
        "object_type": "comment_image",
        "attachment_type": "image/png",
        "file_path": "/var/www/example.com/wp-content/uploads/fluent-boards/board_3/1705312800-updated-image.png",
        "full_url": "https://example.com/wp-content/uploads/fluent-boards/board_3/1705312800-updated-image.png",
        "settings": "",
        "title": "updated-image.png",
        "file_hash": "abc123def456789ghi012jkl345mno678",
        "driver": "local",
        "status": "ACTIVE",
        "file_size": "484 KB",
        "created_at": "2024-01-15T13:00:00+00:00",
        "updated_at": "2024-01-15T13:00:00+00:00",
        "secure_url": "https://example.com/index.php?fbs=1&fbs_comment_image=abc123def456789ghi012jkl345mno678&secure_sign=def456ghi789012jkl345mno678pqr901"
      }
    ],
    "replies": [],
    "user": {
      "ID": 789,
      "user_login": "johndoe",
      "user_nicename": "john-doe",
      "user_email": "john.doe@example.com",
      "user_url": "https://example.com",
      "user_registered": "2023-01-15 10:30:00",
      "user_status": "0",
      "display_name": "John Doe",
      "photo": "https://secure.gravatar.com/avatar/abc123def456?s=128&d=mm&r=g"
    }
  }
}
```

### Features

- **Authorization**: Only the comment author can update their own comments
- **Auto-linking**: URLs are automatically converted to clickable links
- **Mentions**: Support for user mentions with notifications
- **Image Attachments**: Can update or add new images to the comment
- **Settings Preservation**: Maintains existing settings while updating content

## Delete a Comment

Delete a comment. Only the comment author can delete their own comments.

**HTTP Request**
```
DELETE /wp-json/fluent-boards/v2/projects/{board_id}/tasks/comments/{comment_id}
```

### Example Request

```bash
curl "https://yourdomain.com/wp-json/fluent-boards/v2/projects/{board_id}/tasks/comments/{comment_id}" \
  -X DELETE \
  -H "Authorization: Basic API_USERNAME:API_PASSWORD"
```

### Example Response

```json
{
  "message": "Comment has been deleted"
}
```

### Features

- **Authorization**: Only the comment author can delete their own comments
- **Cascade Deletion**: Automatically deletes related replies and attached images
- **Task Counter**: Updates the task's comment count
- **Cleanup**: Removes all associated data and triggers cleanup actions

## Add Reply to Comment

Create a threaded reply to an existing comment. Replies use the same endpoint as creating comments, but with a `parent_id` parameter.

**HTTP Request**
```
POST /wp-json/fluent-boards/v2/projects/{board_id}/tasks/{task_id}/comments
```

### Example Request

```bash
curl "https://yourdomain.com/wp-json/fluent-boards/v2/projects/{board_id}/tasks/{task_id}/comments" \
  -X POST \
  -H "Authorization: Basic API_USERNAME:API_PASSWORD" \
  -H "Content-Type: application/json" \
  -d '{
    "comment": "This is a reply to the comment",
    "parent_id": 3,
    "comment_type": "reply",
    "comment_by": 789,
    "images": [],
    "mentionData": []
  }'
```

### Request Body

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `comment` | string | Yes* | The reply content (required unless images are provided) |
| `parent_id` | integer | Yes | ID of the parent comment to reply to |
| `comment_type` | string | Yes | Comment type (must be 'reply') |
| `comment_by` | integer | No | User ID who created the reply (default: current user) |
| `images` | array | No | Array of image IDs to attach to the reply |
| `mentionData` | array | No | Array of user IDs to mention in the reply |

### Example Request Data

```json
{
  "comment": "This is a reply to the comment",
  "parent_id": 3,
  "comment_type": "reply",
  "comment_by": 789,
  "images": [],
  "mentionData": []
}
```

### Example Response

```json
{
  "message": "Comment has been added",
  "comment": {
    "parent_id": 3,
    "description": "This is a reply to the comment",
    "created_by": 789,
    "task_id": 456,
    "type": "reply",
    "board_id": 5,
    "settings": {
      "raw_description": "This is a reply to the comment",
      "mentioned_id": null
    },
    "privacy": "private",
    "author_email": "john.doe@example.com",
    "author_name": "John Doe",
    "updated_at": "2024-01-15T14:00:00+00:00",
    "created_at": "2024-01-15T14:00:00+00:00",
    "id": 8,
    "user": {
      "ID": 789,
      "user_login": "johndoe",
      "user_nicename": "john-doe",
      "user_email": "john.doe@example.com",
      "user_url": "https://example.com",
      "user_registered": "2023-01-15 10:30:00",
      "user_status": "0",
      "display_name": "John Doe",
      "photo": "https://secure.gravatar.com/avatar/abc123def456?s=128&d=mm&r=g"
    },
    "avatar": "https://secure.gravatar.com/avatar/abc123def456?s=128&d=mm&r=g",
    "task": {
      "id": 456,
      "parent_id": null,
      "board_id": "5",
      "crm_contact_id": null,
      "title": "Implement New Dashboard Features",
      "slug": "implement-new-dashboard-features",
      "type": "task",
      "status": "open",
      "stage_id": "25",
      "source": "web",
      "source_id": null,
      "priority": "medium",
      "description": "<p>Add new dashboard features including:</p>\n<ol>\n<li>Custom widgets</li>\n<li>Analytics charts</li>\n<li>User preferences</li>\n<li>Real-time updates</li>\n</ol>",
      "lead_value": "0.00",
      "created_by": "789",
      "position": "15.00",
      "comments_count": "3",
      "issue_number": null,
      "reminder_type": "none",
      "settings": {
        "subtask_count": 4,
        "attachment_count": 2,
        "subtask_completed_count": 1
      },
      "remind_at": null,
      "started_at": null,
      "due_at": "2024-02-15 23:59:00",
      "last_completed_at": null,
      "archived_at": null,
      "created_at": "2024-01-10T10:00:00+00:00",
      "updated_at": "2024-01-15T14:00:00+00:00",
      "meta": {
        "is_template": "no",
        "group_name": "Development Tasks"
      },
      "repeat_task_meta": null
    }
  }
}
```

### Key Differences from Regular Comments

- **Parent ID**: Required `parent_id` parameter to specify which comment to reply to
- **Comment Type**: Automatically set to "reply" type
- **Threading**: Creates a parent-child relationship between comments
- **Notifications**: Sends notifications to the parent comment author
- **Same Endpoint**: Uses the same endpoint as creating comments

## Upload Images to Comment

Upload images that can be attached to comments. This endpoint uploads the image file and returns the image attachment data that can be used in comment creation.

**HTTP Request**
```
POST /wp-json/fluent-boards/v2/projects/{board_id}/tasks/{task_id}/comment-image-upload
```

### Example Request

```bash
curl "https://yourdomain.com/wp-json/fluent-boards/v2/projects/{board_id}/tasks/{task_id}/comment-image-upload" \
  -X POST \
  -H "Authorization: Basic API_USERNAME:API_PASSWORD" \
  -F "file=@/path/to/unnamed-3.png"
```

### Request Body

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `file` | file | Yes | Image file to upload (supports: JPEG, GIF, PNG, BMP, TIFF, WebP, AVIF, ICO, HEIC) |

### Example Response

```json
{
  "message": "attachment has been added",
  "imageAttachment": {
    "object_id": 0,
    "object_type": "comment_image",
    "attachment_type": "image/png",
    "title": "unnamed-3.png",
    "file_path": "1711111111-unnamed-3.png",
    "full_url": "https://yourdomain.com/wp-content/uploads/fluent-boards/board_1/1711111111-unnamed-3.png",
    "file_size": "484 KB",
    "settings": "",
    "driver": "local",
    "file_hash": "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
    "updated_at": "2025-08-08T06:56:07+00:00",
    "created_at": "2025-08-08T06:56:07+00:00",
    "id": 24,
    "public_url": "https://yourdomain.com/index.php?fbs=1&fbs_type=public_url&fbs_bid=1&fbs_comment_image=aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
    "secure_url": "https://yourdomain.com/index.php?fbs=1&fbs_comment_image=aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa&secure_sign=bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb"
  }
}
```



### Features

- **File Validation**: Validates image file types (JPEG, GIF, PNG, BMP, TIFF, WebP, AVIF, ICO, HEIC)
- **Secure URLs**: Provides both public and secure URLs for image access
- **File Metadata**: Includes file size, hash, and upload timestamps
- **Comment Integration**: Returns image ID that can be used in comment creation
- **Board Organization**: Images are organized by board ID in the file system

## Features

- **Threaded Comments**: Support for nested replies
- **File Attachments**: Upload images to comments
- **Privacy Controls**: Public and private comment visibility
- **User Integration**: Automatic user data population
- **Avatar Generation**: Dynamic avatar URLs based on email
- **Comment Counting**: Automatic task comment count updates

## Error Responses

See [Common Error Responses](/rest-api/shared/error-responses) for standard error formats.

### Common Comment-Specific Errors

- **404 Not Found** - Comment not found
- **403 Forbidden** - You don't have permission to manage this comment
- **400 Bad Request** - Invalid comment data or missing required fields
- **413 Payload Too Large** - Image file size exceeds limit

## Best Practices

1. **Use descriptive comments** - Provide clear, actionable feedback
2. **Respect privacy settings** - Be mindful of public vs private comments
3. **Use threading appropriately** - Keep replies organized and relevant
4. **Optimize images** - Compress images before uploading
5. **Regular cleanup** - Remove outdated or irrelevant comments
