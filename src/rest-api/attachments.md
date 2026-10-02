# Attachments

::: tip Pro
All attachment endpoints are provided by FluentBoards Pro.
:::

Manage task file attachments and link attachments. Plugin source: Pro.

The board-scoped routes (`/projects/{board_id}/...`) use the normal board permission check. The `/tasks/{task_id}/...` routes only require a FluentBoards user at route level; the controller then requires write access to the task's board.

## Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/projects/{board_id}/tasks/{task_id}/attachment` | List task attachments |
| POST | `/projects/{board_id}/tasks/{task_id}/add-task-attachment-file` | Upload one or more files |
| POST | `/projects/{board_id}/tasks/{task_id}/add-task-attachment-file-chunk` | Upload a large file in chunks |
| POST | `/tasks/{task_id}/add-attachment` | Attach an external URL |
| PUT | `/tasks/{task_id}/attachment-update/{attachment_id}` | Rename an attachment |
| DELETE | `/tasks/{task_id}/attachment-delete/{attachment_id}` | Delete an attachment |

## Attachment Object

| Property | Type | Description |
|----------|------|-------------|
| `id` | integer | Unique identifier for the attachment |
| `file_hash` | string | Unique hash used for secure link generation |
| `object_type` | string | What it is attached to: `TASK` (task attachment), `task_description`, `comment_image` |
| `object_id` | integer | Related object ID (for example the task ID) |
| `attachment_type` | string | MIME type (for example `image/png`, `text/csv`) or `url` for external links |
| `file_path` | string\|null | Path on disk (`null` for URLs) |
| `full_url` | string | File URL, or the external URL when `attachment_type` is `url` |
| `file_size` | string\|null | Human-readable size (for example `512 KB`) |
| `settings` | object\|string | Extra metadata (for URLs: parsed page meta under `settings.meta`) |
| `secure_url` | string | Computed, time-signed download link |
| `title` | string | File name or provided title |
| `driver` | string | Storage driver (for example `local`) |
| `status` | string | Attachment status (for example `ACTIVE`) |
| `created_at`, `updated_at` | string | Timestamps |

`secure_url` is generated from `file_hash` and includes `fbs=1`, `fbs_attachment` and a time-based `secure_sign`.

## List Task Attachments

Returns the attachments of a task.

```http
GET /wp-json/fluent-boards/v2/projects/{board_id}/tasks/{task_id}/attachment
```

**Example Request**

```bash
curl "https://yourdomain.com/wp-json/fluent-boards/v2/projects/1/tasks/123/attachment" \
  -u "USERNAME:APPLICATION_PASSWORD"
```

**Example Response**

```json
{
  "attachments": [
    {
      "id": 101,
      "object_id": 123,
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
    }
  ]
}
```

## Upload Task Attachments

Uploads one or more files and attaches them to the task. Each file is checked against the upload size limit and the allowed file types.

```http
POST /wp-json/fluent-boards/v2/projects/{board_id}/tasks/{task_id}/add-task-attachment-file
```

**Parameters**

| Parameter | Type | Required | Description |
|---|---|---|---|
| `file` / `file[]` | file | Yes | One file, or repeat `file[]` for several (multipart) |

**Example Request**

```bash
curl "https://yourdomain.com/wp-json/fluent-boards/v2/projects/1/tasks/123/add-task-attachment-file" \
  -X POST \
  -u "USERNAME:APPLICATION_PASSWORD" \
  -F "file[]=@/path/to/unnamed-3.png" \
  -F "file[]=@/path/to/unnamed-4.png"
```

**Example Response**

```json
{
  "message": "Task attachment has been added",
  "attachments": [
    {
      "id": 201,
      "object_id": 123,
      "object_type": "TASK",
      "attachment_type": "image/png",
      "title": "unnamed-3.png",
      "full_url": "https://yourdomain.com/wp-content/uploads/fluent-boards/board_1/1714444444-unnamed-3.png",
      "file_size": "484 KB",
      "driver": "local",
      "file_hash": "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
      "secure_url": "https://yourdomain.com/index.php?fbs=1&fbs_attachment=aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa&secure_sign=bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb"
    },
    {
      "id": 202,
      "object_id": 123,
      "object_type": "TASK",
      "attachment_type": "image/png",
      "title": "unnamed-4.png",
      "full_url": "https://yourdomain.com/wp-content/uploads/fluent-boards/board_1/1714444444-unnamed-4.png",
      "file_size": "420 KB",
      "driver": "local",
      "file_hash": "cccccccccccccccccccccccccccccccc",
      "secure_url": "https://yourdomain.com/index.php?fbs=1&fbs_attachment=cccccccccccccccccccccccccccccccc&secure_sign=dddddddddddddddddddddddddddddddd"
    }
  ]
}
```

Errors (`400`): "File is empty.", "File type not supported", "File upload failed.", size limit errors.

## Upload a Task Attachment in Chunks

Uploads a large file in sequential chunks. Send chunk `0`, then `1`, … up to `total_chunks - 1`, all with the same `upload_id`, `file_name`, `file_size` and `total_chunks`. Chunks must arrive in order. The final chunk assembles the file, checks its contents against the extension, and creates the attachment.

```http
POST /wp-json/fluent-boards/v2/projects/{board_id}/tasks/{task_id}/add-task-attachment-file-chunk
```

**Parameters**

| Parameter | Type | Required | Description |
|---|---|---|---|
| `chunk` | file | Yes | The chunk's bytes (multipart) |
| `file_name` | string | Yes | Original file name (its extension must be an allowed type) |
| `file_size` | integer | Yes | Total file size in bytes (must not exceed the upload limit) |
| `chunk_index` | integer | Yes | 0-based index of this chunk |
| `total_chunks` | integer | Yes | Number of chunks |
| `upload_id` | string | Yes | Client-generated ID shared by all chunks of one file |

**Example Request**

```bash
curl "https://yourdomain.com/wp-json/fluent-boards/v2/projects/1/tasks/123/add-task-attachment-file-chunk" \
  -X POST \
  -u "USERNAME:APPLICATION_PASSWORD" \
  -F "chunk=@/path/to/video.part0" \
  -F "file_name=video.mp4" \
  -F "file_size=52428800" \
  -F "chunk_index=0" \
  -F "total_chunks=5" \
  -F "upload_id=4f1c2a7e-upload"
```

**Example Response** (intermediate chunk)

```json
{
  "chunk_index": 0,
  "is_complete": false
}
```

**Example Response** (last chunk)

```json
{
  "message": "Task attachment has been added",
  "is_complete": true,
  "attachments": [
    {
      "id": 210,
      "object_id": 123,
      "object_type": "TASK",
      "attachment_type": "video/mp4",
      "title": "video.mp4",
      "driver": "local"
    }
  ]
}
```

Errors (`400`): "Chunk data is missing.", "Invalid chunk upload request." (missing fields or out-of-order chunk), "File size is too large", "File type not supported", "File contents do not match the file extension.", "File upload failed.".

## Add a URL Attachment

Attaches an external URL to a task. The server fetches the URL to collect page metadata into `settings.meta`.

```http
POST /wp-json/fluent-boards/v2/tasks/{task_id}/add-attachment
```

**Parameters**

| Parameter | Type | Required | Description |
|---|---|---|---|
| `url` | string | Yes | A valid URL |
| `title` | string | No | Title (defaults to the page title when available) |

**Example Request**

```bash
curl "https://yourdomain.com/wp-json/fluent-boards/v2/tasks/123/add-attachment" \
  -X POST \
  -u "USERNAME:APPLICATION_PASSWORD" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Lorem ipsum",
    "url": "https://example.com/specs"
  }'
```

**Example Response**

```json
{
  "message": "Attachment has been added to task",
  "attachment": {
    "id": 301,
    "object_id": 123,
    "object_type": "TASK",
    "attachment_type": "url",
    "title": "Lorem ipsum",
    "file_path": null,
    "full_url": "https://example.com/specs",
    "file_size": null,
    "settings": {
      "meta": {
        "title": "Specs"
      }
    },
    "driver": "local",
    "file_hash": "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
    "created_at": "2025-08-08T06:30:34+00:00",
    "updated_at": "2025-08-08T06:30:34+00:00",
    "secure_url": "https://example.com/specs"
  }
}
```

Returns `404` "Task doesn't exist" when the task is missing or you have no write access to its board.

## Update an Attachment

Renames a task attachment.

```http
PUT /wp-json/fluent-boards/v2/tasks/{task_id}/attachment-update/{attachment_id}
```

**Parameters**

| Parameter | Type | Required | Description |
|---|---|---|---|
| `title` | string | Yes | New title |

**Example Request**

```bash
curl "https://yourdomain.com/wp-json/fluent-boards/v2/tasks/123/attachment-update/301" \
  -X PUT \
  -u "USERNAME:APPLICATION_PASSWORD" \
  -H "Content-Type: application/json" \
  -d '{ "title": "Board Documentation" }'
```

**Example Response**

```json
{
  "message": "Task attachment has been updated",
  "attachment": {
    "id": 301,
    "object_id": 123,
    "object_type": "TASK",
    "attachment_type": "url",
    "full_url": "https://example.com/specs",
    "title": "Board Documentation",
    "status": "ACTIVE",
    "updated_at": "2025-08-08T06:34:04+00:00"
  }
}
```

Returns `404` "Attachment not found" when the attachment does not belong to the task.

## Delete an Attachment

Deletes a task attachment and returns the remaining attachments.

```http
DELETE /wp-json/fluent-boards/v2/tasks/{task_id}/attachment-delete/{attachment_id}
```

**Example Request**

```bash
curl "https://yourdomain.com/wp-json/fluent-boards/v2/tasks/123/attachment-delete/401" \
  -X DELETE \
  -u "USERNAME:APPLICATION_PASSWORD"
```

**Example Response**

```json
{
  "message": "Task attachment has been deleted",
  "attachments": [
    {
      "id": 402,
      "object_id": 123,
      "object_type": "TASK",
      "attachment_type": "image/png",
      "title": "design.png",
      "file_size": "420 KB",
      "status": "ACTIVE",
      "secure_url": "https://yourdomain.com/index.php?fbs=1&fbs_attachment=cccccccccccccccccccccccccccccccc&secure_sign=dddddddddddddddddddddddddddddddd"
    }
  ]
}
```

See [Common Error Responses](/rest-api/shared/error-responses) for standard error formats.
