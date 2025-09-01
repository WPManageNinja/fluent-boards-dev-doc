# Folders

The Folders API allows you to group and organize boards in Fluent Boards. These endpoints are Pro-only and live under the admin prefix.

## Base Endpoint

```
/wp-json/fluent-boards/v2/admin/folders
```

```json
{
  "id": 11,
  "title": "Lorem Ipsum",
  "created_by": "1",
  "boards_ids": [
    3
  ]
}
```

## List Folders

Retrieve all folders in the system.

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

## Create a Folder

Create a new folder to organize boards.

**HTTP Request**
```
POST /wp-json/fluent-boards/v2/admin/folders
```

### Example Request

```bash
curl -X POST "https://yourdomain.com/wp-json/fluent-boards/v2/admin/folders" \
  -H "Authorization: Basic API_USERNAME:API_PASSWORD" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "title=Development"
```

### Request Body

| Field | Type | Required | Description |
|------|------|----------|-------------|
| `title` | string | Yes | Folder title (max 50 chars) |

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

## Update a Folder

Update an existing folder's title.

**HTTP Request**
```
PUT /wp-json/fluent-boards/v2/admin/folders/{folder_id}
```

### Example Request

```bash
curl -X PUT "https://yourdomain.com/wp-json/fluent-boards/v2/admin/folders/{folder_id}" \
  -H "Authorization: Basic API_USERNAME:API_PASSWORD" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "title=Marketing"
```

### Request Body

| Field | Type | Required | Description |
|------|------|----------|-------------|
| `title` | string | Yes | New folder title |

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

## Delete a Folder

Remove a folder from the system.

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

Add one or more boards to a folder. This replaces any existing folder assignments.

**HTTP Request**
```
POST /wp-json/fluent-boards/v2/admin/folders/{folder_id}/add-board
```

### Example Request

```bash
curl -X POST "https://yourdomain.com/wp-json/fluent-boards/v2/admin/folders/{folder_id}/add-board" \
  -H "Authorization: Basic API_USERNAME:API_PASSWORD" \
  -H "Content-Type: application/json" \
  -d '{
    "board_ids": [2,7]
  }'
```

### Request Body

| Field | Type | Required | Description |
|------|------|----------|-------------|
| `board_ids` | array[integer] | Yes | Board IDs to add; replaces existing folder assignment |

### Example Response

```json
{
  "message": "Added to folder successfully!"
}
```

## Remove Board from Folder

Remove a specific board from a folder.

**HTTP Request**
```
POST /wp-json/fluent-boards/v2/admin/folders/{folder_id}/remove-board
```

### Example Request

```bash
curl -X POST "https://yourdomain.com/wp-json/fluent-boards/v2/admin/folders/{folder_id}/remove-board" \
  -H "Authorization: Basic API_USERNAME:API_PASSWORD" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "board_id=7"
```

### Request Body

| Field | Type | Required | Description |
|------|------|----------|-------------|
| `board_id` | integer | Yes | Board ID to remove from folder |

### Example Response

```json
{
  "message": "Removed from folder successfully!"
}
```

## Error Responses

See [Common Error Responses](/rest-api/shared/error-responses) for standard error formats.

### Common Folder-Specific Errors

- **404 Not Found** - Folder not found
- **403 Forbidden** - You don't have permission to manage folders
- **400 Bad Request** - Invalid folder data or missing required fields

## Next Steps

- [Manage Boards](/rest-api/boards) - Work with board management
- [Handle Stages](/rest-api/stages) - Manage board stages
- [User Management](/rest-api/users) - Add/remove board members
- [Labels](/rest-api/labels) - Organize tasks with labels