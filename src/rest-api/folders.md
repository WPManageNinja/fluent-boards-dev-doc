# Folders

Folders group boards in the board list. A board can be in only one folder at a time. Plugin source: free.

All folder endpoints live under the `/admin` prefix and use `AdminPolicy`: they require a WordPress administrator or a FluentBoards admin.

## Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/admin/folders` | List folders |
| POST | `/admin/folders` | Create a folder |
| GET | `/admin/folders/{folder_id}` | Get a folder |
| PUT | `/admin/folders/{folder_id}` | Rename a folder |
| DELETE | `/admin/folders/{folder_id}` | Delete a folder |
| POST | `/admin/folders/{folder_id}/add-board` | Move boards into a folder |
| POST | `/admin/folders/{folder_id}/remove-board` | Remove a board from a folder |

## Folder Object

Folders are stored in the `fbs_boards` table with `type = "folder"`. The API returns this compact shape:

```json
{
  "id": 11,
  "title": "Client Projects",
  "created_by": "1",
  "boards_ids": [3, 7]
}
```

| Field | Type | Description |
|---|---|---|
| `id` | integer | Folder ID |
| `title` | string | Folder title |
| `created_by` | integer | User who created the folder |
| `boards_ids` | array | IDs of boards in the folder that the current user can access |

## List Folders

Retrieve the top-level folders that are visible to the current user: folders they created, plus folders that contain a board they can access. Newest first.

```http
GET /wp-json/fluent-boards/v2/admin/folders
```

**Example Request**

```bash
curl "https://yourdomain.com/wp-json/fluent-boards/v2/admin/folders" \
  -u "USERNAME:APPLICATION_PASSWORD"
```

**Example Response**

```json
{
  "folders": [
    {
      "id": 11,
      "title": "Client Projects",
      "created_by": "1",
      "boards_ids": [3, 7]
    }
  ]
}
```

## Create a Folder

Create a new folder.

```http
POST /wp-json/fluent-boards/v2/admin/folders
```

**Parameters**

| Parameter | Type | Required | Description |
|---|---|---|---|
| `title` | string | Yes | Folder title, max 50 characters |
| `color` | string | No | Hex color, saved in the folder background |
| `parent_id` | integer | No | Parent folder ID, to create a sub-folder |

**Example Request**

```bash
curl "https://yourdomain.com/wp-json/fluent-boards/v2/admin/folders" \
  -X POST \
  -u "USERNAME:APPLICATION_PASSWORD" \
  -H "Content-Type: application/json" \
  -d '{"title": "Development"}'
```

**Example Response**

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

## Get a Folder

Retrieve one folder. The query parameters filter and order the boards whose IDs are returned in `boards_ids`. If the folder does not exist, `folder` is `null`.

```http
GET /wp-json/fluent-boards/v2/admin/folders/{folder_id}
```

**Parameters**

| Parameter | Type | Required | Description |
|---|---|---|---|
| `order` | string | No | Board sort column: `created_at`, `title` or `id`. Default `created_at` |
| `orderBy` | string | No | `ASC` or `DESC`. Default `DESC` |
| `searchInput` | string | No | Only include boards whose title contains this text |
| `option` | string | No | `archived` for archived boards only; any other value for active boards only. Omit to include both |

**Example Request**

```bash
curl "https://yourdomain.com/wp-json/fluent-boards/v2/admin/folders/11?order=title&orderBy=ASC" \
  -u "USERNAME:APPLICATION_PASSWORD"
```

**Example Response**

```json
{
  "folder": {
    "id": 11,
    "title": "Client Projects",
    "created_by": "1",
    "boards_ids": [7, 3]
  }
}
```

## Rename a Folder

Update a folder's title.

```http
PUT /wp-json/fluent-boards/v2/admin/folders/{folder_id}
```

**Parameters**

| Parameter | Type | Required | Description |
|---|---|---|---|
| `title` | string | Yes | New folder title |

**Example Request**

```bash
curl "https://yourdomain.com/wp-json/fluent-boards/v2/admin/folders/11" \
  -X PUT \
  -u "USERNAME:APPLICATION_PASSWORD" \
  -H "Content-Type: application/json" \
  -d '{"title": "Marketing"}'
```

**Example Response**

```json
{
  "message": "Folder updated successfully",
  "folder": {
    "id": 11,
    "title": "Marketing",
    "created_by": "1",
    "boards_ids": [3, 7]
  }
}
```

## Delete a Folder

Delete a folder. Its boards are not deleted; they simply leave the folder.

```http
DELETE /wp-json/fluent-boards/v2/admin/folders/{folder_id}
```

**Example Request**

```bash
curl "https://yourdomain.com/wp-json/fluent-boards/v2/admin/folders/11" \
  -X DELETE \
  -u "USERNAME:APPLICATION_PASSWORD"
```

**Example Response**

```json
{
  "message": "Folder deleted successfully."
}
```

## Add Boards to a Folder

Move one or more boards into a folder. Each board is first removed from any folder it was in. Unknown board IDs are ignored. Only the folder's creator or an admin can do this.

```http
POST /wp-json/fluent-boards/v2/admin/folders/{folder_id}/add-board
```

**Parameters**

| Parameter | Type | Required | Description |
|---|---|---|---|
| `board_ids` | array | Yes | Board IDs to move into the folder. A single ID is also accepted |

**Example Request**

```bash
curl "https://yourdomain.com/wp-json/fluent-boards/v2/admin/folders/11/add-board" \
  -X POST \
  -u "USERNAME:APPLICATION_PASSWORD" \
  -H "Content-Type: application/json" \
  -d '{"board_ids": [2, 7]}'
```

**Example Response**

```json
{
  "message": "Added to folder successfully!"
}
```

## Remove a Board from a Folder

Take a board out of a folder.

```http
POST /wp-json/fluent-boards/v2/admin/folders/{folder_id}/remove-board
```

**Parameters**

| Parameter | Type | Required | Description |
|---|---|---|---|
| `board_id` | integer | Yes | Board ID to remove |

**Example Request**

```bash
curl "https://yourdomain.com/wp-json/fluent-boards/v2/admin/folders/11/remove-board" \
  -X POST \
  -u "USERNAME:APPLICATION_PASSWORD" \
  -H "Content-Type: application/json" \
  -d '{"board_id": 7}'
```

**Example Response**

```json
{
  "message": "Removed from folder successfully!"
}
```

See [Common Error Responses](/rest-api/shared/error-responses) for standard error formats.
