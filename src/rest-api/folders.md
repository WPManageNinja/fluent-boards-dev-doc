# Folders

Folders let you group boards. These endpoints are Pro-only and live under the admin prefix.

Base path for all endpoints below:
```
/wp-json/fluent-boards/v2/admin/folders
```

## Folder Object

| Property | Type | Description |
|----------|------|-------------|
| `id` | integer | Folder ID |
| `title` | string | Folder title |
| `created_by` | integer | Creator user ID |
| `boards_ids` | array[integer] | IDs of boards in this folder |

Notes:
- Model type is forced to `folder` and uses the `fbs_boards` table with a global scope.
- `background` and `settings` are serialized internally; not returned by the API.

## List Folders

**HTTP Request**
```
GET /wp-json/fluent-boards/v2/admin/folders
```

### Example Request

```bash
curl "https://yourdomain.com/wp-json/fluent-boards/v2/admin/folders" \
  -H "Authorization: Basic API_USERNAME:API_PASSWORD"
```

### Example Response

```json
{
  "folders": [
    {
      "id": 11,
      "title": "Lorem Ipsum",
      "created_by": "1",
      "boards_ids": [
        3
      ]
    }
  ]
}
```

## Create Folder

**HTTP Request**
```
POST /wp-json/fluent-boards/v2/admin/folders
```

### Request Body

| Field | Type | Required | Description |
|------|------|----------|-------------|
| `title` | string | Yes | Folder title (max 50 chars) |

### Example Request

```bash
curl -X POST "https://yourdomain.com/wp-json/fluent-boards/v2/admin/folders" \
  -H "Authorization: Basic API_USERNAME:API_PASSWORD" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "title=Development"
```

### Example Response

```json
{
  "message": "Folder has been created",
  "folder": {
    "id": 12,
    "title": "Development",
    "created_by": 1,
    "boards_ids": []
  }
}
```

## Update Folder

**HTTP Request**
```
PUT /wp-json/fluent-boards/v2/admin/folders/{folder_id}
```

### Request Body

| Field | Type | Required | Description |
|------|------|----------|-------------|
| `title` | string | Yes | New folder title |

### Example Request

```bash
curl -X PUT "https://yourdomain.com/wp-json/fluent-boards/v2/admin/folders/{folder_id}" \
  -H "Authorization: Basic API_USERNAME:API_PASSWORD" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "title=Marketing"
```

### Example Response

```json
{
  "message": "Folder updated successfully",
  "folder": {
    "id": 11,
    "title": "Marketing",
    "created_by": "1",
    "boards_ids": []
  }
}
```

## Delete Folder

**HTTP Request**
```
DELETE /wp-json/fluent-boards/v2/admin/folders/{folder_id}
```

### Example Request

```bash
curl -X DELETE "https://yourdomain.com/wp-json/fluent-boards/v2/admin/folders/{folder_id}" \
  -H "Authorization: Basic API_USERNAME:API_PASSWORD"
```

### Example Response

```json
{
  "message": "Folder deleted successfully."
}
```

## Add Boards to Folder

**HTTP Request**
```
POST /wp-json/fluent-boards/v2/admin/folders/{folder_id}/add-board
```

### Request Body

| Field | Type | Required | Description |
|------|------|----------|-------------|
| `board_ids` | array[integer] | Yes | Board IDs to add; replaces existing folder assignment |

### Example Request

```bash
curl -X POST "https://yourdomain.com/wp-json/fluent-boards/v2/admin/folders/{folder_id}/add-board" \
  -H "Authorization: Basic API_USERNAME:API_PASSWORD" \
  -H "Content-Type: application/json" \
  -d '{
    "board_ids": [2,7]
  }'
```

### Example Response

```json
{
  "message": "Added to folder successfully!"
}
```

## Remove Board from Folder

**HTTP Request**
```
POST /wp-json/fluent-boards/v2/admin/folders/{folder_id}/remove-board
```

### Request Body

| Field | Type | Required | Description |
|------|------|----------|-------------|
| `board_id` | integer | Yes | Board ID to remove from folder |

### Example Request

```bash
curl -X POST "https://yourdomain.com/wp-json/fluent-boards/v2/admin/folders/{folder_id}/remove-board" \
  -H "Authorization: Basic API_USERNAME:API_PASSWORD" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "board_id=7"
```

### Example Response

```json
{
  "message": "Removed from folder successfully!"
}
```