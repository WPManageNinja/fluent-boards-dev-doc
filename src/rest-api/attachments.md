# Attachments

Manage task file attachments and generated links.

## Attachment Object

Based on the model, an attachment has the following properties:

| Property | Type | Description |
|----------|------|-------------|
| `id` | integer | Unique identifier for the attachment |
| `file_hash` | string | Unique hash used for secure link generation |
| `object_type` | string | Where it’s attached (e.g., `TASK_ATTACHMENT`, `TASK_DESCRIPTION`, `COMMENT_IMAGE`) |
| `object_id` | integer | Related object ID (e.g., task ID) |
| `attachment_type` | string | MIME type (e.g., `image/png`, `text/csv`) or `url` for external links |
| `file_path` | string | Absolute path on disk (may be hidden) |
| `full_url` | string | Public URL when `attachment_type` is `url`; otherwise file URL |
| `file_size` | string | File size text (e.g., `512 KB`) |
| `settings` | object | Additional metadata (serialized in DB) |
| `secure_url` | string | Time-based secure link for downloading (computed) |
| `title` | string | Original file name or provided title |
| `driver` | string | Storage driver (e.g., `local`) |
| `status` | string | Attachment status (e.g., `ACTIVE`) |
| `created_at` | string | Creation timestamp (ISO 8601) |
| `updated_at` | string | Last update timestamp (ISO 8601) |

Notes
- `secure_url` is generated from `file_hash` and is safe to share for direct downloads.
- The query includes `fbs=1`, `fbs_attachment`, and a time-based `secure_sign`.

## List Task Attachments

Return attachments for a task.

**HTTP Request**
```
GET /wp-json/fluent-boards/v2/projects/{board_id}/tasks/{task_id}/attachment
```

### Example Request

```bash
curl "https://yourdomain.com/wp-json/fluent-boards/v2/projects/{board_id}/tasks/{task_id}/attachment" \
  -H "Authorization: Basic API_USERNAME:API_PASSWORD"
```

### Example Response

```json
{
  "attachments": [
    {
      "id": 101,
      "object_id": "123",
      "object_type": "TASK",
      "attachment_type": "text/csv",
      "file_path": "/var/www/yourdomain.com/wp-content/uploads/fluent-boards/board_1/1711111111-report.csv",
      "full_url": "https://yourdomain.com/wp-content/uploads/fluent-boards/board_1/1711111111-report.csv",
      "settings": "",
      "title": "report.csv",
      "file_hash": "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
      "driver": "local",
      "status": "ACTIVE",
      "file_size": "2 KB",
      "created_at": "2025-07-16T08:01:33+00:00",
      "updated_at": "2025-07-16T08:01:33+00:00",
      "secure_url": "https://yourdomain.com/index.php?fbs=1&fbs_attachment=aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa&secure_sign=bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb"
    },
    {
      "id": 102,
      "object_id": "123",
      "object_type": "TASK",
      "attachment_type": "image/png",
      "file_path": "/var/www/yourdomain.com/wp-content/uploads/fluent-boards/board_1/1712222222-design.png",
      "full_url": "https://yourdomain.com/wp-content/uploads/fluent-boards/board_1/1712222222-design.png",
      "settings": "",
      "title": "design.png",
      "file_hash": "cccccccccccccccccccccccccccccccc",
      "driver": "local",
      "status": "ACTIVE",
      "file_size": "420 KB",
      "created_at": "2025-08-08T06:19:03+00:00",
      "updated_at": "2025-08-08T06:19:03+00:00",
      "secure_url": "https://yourdomain.com/index.php?fbs=1&fbs_attachment=cccccccccccccccccccccccccccccccc&secure_sign=dddddddddddddddddddddddddddddddd"
    },
  ]
}
```

## Add Task Attachment (Upload)

Upload one or more files and attach them to a task.

**HTTP Request**
```
POST /wp-json/fluent-boards/v2/projects/{board_id}/tasks/{task_id}/add-task-attachment-file
```

### Example Request

```bash
curl "https://yourdomain.com/wp-json/fluent-boards/v2/projects/{board_id}/tasks/{task_id}/add-task-attachment-file" \
  -X POST \
  -H "Authorization: Basic API_USERNAME:API_PASSWORD" \
  -F "file[]=@/path/to/unnamed-3.png" \
  -F "file[]=@/path/to/unnamed-4.png" \
  -F "file[]=@/path/to/Untitled-drawing.png"
```

Form data
- file[] (binary): Repeat to upload multiple files

### Example Response

```json
{
  "message": "Task attachment has been added",
  "attachments": [
    {
      "object_id": 123,
      "object_type": "TASK",
      "attachment_type": "image/png",
      "title": "unnamed-3.png",
      "file_path": "/var/www/yourdomain.com/wp-content/uploads/fluent-boards/board_1/1714444444-unnamed-3.png",
      "full_url": "https://yourdomain.com/wp-content/uploads/fluent-boards/board_1/1714444444-unnamed-3.png",
      "file_size": "484 KB",
      "settings": "",
      "driver": "local",
      "file_hash": "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
      "updated_at": "2025-08-08T06:26:34+00:00",
      "created_at": "2025-08-08T06:26:34+00:00",
      "id": 201,
      "secure_url": "https://yourdomain.com/index.php?fbs=1&fbs_attachment=aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa&secure_sign=bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb"
    },
    {
      "object_id": 123,
      "object_type": "TASK",
      "attachment_type": "image/png",
      "title": "unnamed-4.png",
      "file_path": "/var/www/yourdomain.com/wp-content/uploads/fluent-boards/board_1/1714444444-unnamed-4.png",
      "full_url": "https://yourdomain.com/wp-content/uploads/fluent-boards/board_1/1714444444-unnamed-4.png",
      "file_size": "420 KB",
      "settings": "",
      "driver": "local",
      "file_hash": "cccccccccccccccccccccccccccccccc",
      "updated_at": "2025-08-08T06:26:34+00:00",
      "created_at": "2025-08-08T06:26:34+00:00",
      "id": 202,
      "secure_url": "https://yourdomain.com/index.php?fbs=1&fbs_attachment=cccccccccccccccccccccccccccccccc&secure_sign=dddddddddddddddddddddddddddddddd"
    },
    {
      "object_id": 123,
      "object_type": "TASK",
      "attachment_type": "image/png",
      "title": "Untitled-drawing.png",
      "file_path": "/var/www/yourdomain.com/wp-content/uploads/fluent-boards/board_1/1714444444-Untitled-drawing.png",
      "full_url": "https://yourdomain.com/wp-content/uploads/fluent-boards/board_1/1714444444-Untitled-drawing.png",
      "file_size": "582 KB",
      "settings": "",
      "driver": "local",
      "file_hash": "eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
      "updated_at": "2025-08-08T06:26:34+00:00",
      "created_at": "2025-08-08T06:26:34+00:00",
      "id": 203,
      "secure_url": "https://yourdomain.com/index.php?fbs=1&fbs_attachment=eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee&secure_sign=ffffffffffffffffffffffffffffffff"
    }
  ]
}
```

## Add Task Attachment (URL)

Attach an external URL to a task (no file upload).

**HTTP Request**
```
POST /wp-json/fluent-boards/v2/tasks/{task_id}/add-attachment
```

### Example Request

```bash
curl "https://yourdomain.com/wp-json/fluent-boards/v2/tasks/{task_id}/add-attachment" \
  -X POST \
  -H "Authorization: Basic API_USERNAME:API_PASSWORD" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Lorem ipsum",
    "url": "https://yourdomain.com/rest-api/attachments/#list-task-attachments"
  }'
```

### Example Response

```json
{
  "message": "Attachment has been added to task",
  "attachment": {
    "object_id": 123,
    "object_type": "TASK",
    "attachment_type": "url",
    "title": "Lorem ipsum",
    "file_path": null,
    "full_url": "https://yourdomain.com/rest-api/attachments/#list-task-attachments",
    "file_size": null,
    "settings": {
      "meta": {
        "errors": {
          "no_response": [
            "URL not found. Response returned a non-200 status code for this URL."
          ]
        },
        "error_data": {
          "no_response": {
            "status": 404
          }
        }
      }
    },
    "driver": "local",
    "file_hash": "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
    "updated_at": "2025-08-08T06:30:34+00:00",
    "created_at": "2025-08-08T06:30:34+00:00",
    "id": 301,
    "secure_url": "https://yourdomain.com/rest-api/attachments/#list-task-attachments"
  }
}
```

## Update Attachment

Update an attachment's title.

**HTTP Request**
```
PUT /wp-json/fluent-boards/v2/tasks/{task_id}/attachment-update/{attachment_id}
```

### Example Request

```bash
curl "https://yourdomain.com/wp-json/fluent-boards/v2/tasks/{task_id}/attachment-update/{attachment_id}" \
  -X PUT \
  -H "Authorization: Basic API_USERNAME:API_PASSWORD" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Board Documentation"
  }'
```

### Example Response

```json
{
  "message": "Task attachment has been updated",
  "attachment": {
    "id": 301,
    "object_id": "123",
    "object_type": "TASK",
    "attachment_type": "url",
    "file_path": null,
    "full_url": "https://yourdomain.com/rest-api/attachments/#list-task-attachments",
    "settings": {
      "meta": {
        "errors": {
          "no_response": [
            "URL not found. Response returned a non-200 status code for this URL."
          ]
        },
        "error_data": {
          "no_response": {
            "status": 404
          }
        }
      }
    },
    "title": "Board Documentation",
    "file_hash": "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
    "driver": "local",
    "status": "ACTIVE",
    "file_size": null,
    "created_at": "2025-08-08T06:30:34+00:00",
    "updated_at": "2025-08-08T06:34:04+00:00",
    "secure_url": "https://yourdomain.com/rest-api/attachments/#list-task-attachments"
  }
}
```

## Delete Attachment

Remove an attachment from a task.

**HTTP Request**
```
DELETE /wp-json/fluent-boards/v2/tasks/{task_id}/attachment-delete/{attachment_id}
```

### Example Request

```bash
curl "https://yourdomain.com/wp-json/fluent-boards/v2/tasks/{task_id}/attachment-delete/{attachment_id}" \
  -X DELETE \
  -H "Authorization: Basic API_USERNAME:API_PASSWORD"
```

### Example Response

```json
{
  "message": "Task attachment has been deleted",
  "attachments": [
    {
      "id": 401,
      "object_id": "123",
      "object_type": "TASK",
      "attachment_type": "text/csv",
      "file_path": "/var/www/yourdomain.com/wp-content/uploads/fluent-boards/board_1/1711111111-report.csv",
      "full_url": "https://yourdomain.com/wp-content/uploads/fluent-boards/board_1/1711111111-report.csv",
      "settings": "",
      "title": "report.csv",
      "file_hash": "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
      "driver": "local",
      "status": "ACTIVE",
      "file_size": "2 KB",
      "created_at": "2025-07-16T08:01:33+00:00",
      "updated_at": "2025-07-16T08:01:33+00:00",
      "secure_url": "https://yourdomain.com/index.php?fbs=1&fbs_attachment=aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa&secure_sign=bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb"
    },
    {
      "id": 402,
      "object_id": "123",
      "object_type": "TASK",
      "attachment_type": "image/png",
      "file_path": "/var/www/yourdomain.com/wp-content/uploads/fluent-boards/board_1/1712222222-design.png",
      "full_url": "https://yourdomain.com/wp-content/uploads/fluent-boards/board_1/1712222222-design.png",
      "settings": "",
      "title": "design.png",
      "file_hash": "cccccccccccccccccccccccccccccccc",
      "driver": "local",
      "status": "ACTIVE",
      "file_size": "420 KB",
      "created_at": "2025-08-08T06:19:03+00:00",
      "updated_at": "2025-08-08T06:19:03+00:00",
      "secure_url": "https://yourdomain.com/index.php?fbs=1&fbs_attachment=cccccccccccccccccccccccccccccccc&secure_sign=dddddddddddddddddddddddddddddddd"
    }
  ]
}
```
