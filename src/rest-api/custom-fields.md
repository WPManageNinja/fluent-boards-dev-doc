# Custom Fields

The Custom Fields API allows you to define additional data fields for tasks on a board. These endpoints are available in Fluent Boards Pro.

## Base Endpoint

```
/fluent-boards/v2/projects/{board_id}/custom-fields
```

## Custom Field Object

Custom fields extend task data with additional structured information:

```json
{
  "id": 110,
  "board_id": "3",
  "title": "Loerm ipsum",
  "slug": "loerm-ipsum",
  "type": "custom-field",
  "position": "1.00",
  "color": null,
  "bg_color": null,
  "settings": {
    "custom_field_type": "text"
  },
  "archived_at": null,
  "created_at": "2025-08-08T10:56:47+00:00",
  "updated_at": "2025-08-08T10:56:47+00:00"
}
```

### Key Properties

| Property | Type | Description |
|----------|------|-------------|
| `id` | integer | Unique identifier for the custom field |
| `board_id` | string | ID of the board this field belongs to |
| `title` | string | Display label for the custom field |
| `slug` | string | URL-friendly identifier |
| `type` | string | Always "custom-field" |
| `position` | string | Position for ordering fields |
| `settings.custom_field_type` | string | Field type (text, select, checkbox, date, etc.) |
| `archived_at` | string or null | Archive timestamp (null if active) |

## List Board Custom Fields

Retrieve all custom fields defined for a specific board.

**HTTP Request**
```
GET /wp-json/fluent-boards/v2/projects/{board_id}/custom-fields
```

### Example Request

```bash
curl "https://yourdomain.com/wp-json/fluent-boards/v2/projects/{board_id}/custom-fields" \
  -H "Authorization: Basic API_USERNAME:API_PASSWORD"
```

### Example Response

```json
{
  "customFields": [
    {
      "id": 110,
      "board_id": "3",
      "title": "Loerm ipsum",
      "slug": "loerm-ipsum",
      "type": "custom-field",
      "position": "1.00",
      "color": null,
      "bg_color": null,
      "settings": {
        "custom_field_type": "text"
      },
      "archived_at": null,
      "created_at": "2025-08-08T10:56:47+00:00",
      "updated_at": "2025-08-08T10:56:47+00:00"
    }
  ]
}
```

## Create a Custom Field

Create a new custom field for a board.

**HTTP Request**
```
POST /wp-json/fluent-boards/v2/projects/{board_id}/custom-field
```

### Example Request

```bash
curl -X POST "https://yourdomain.com/wp-json/fluent-boards/v2/projects/{board_id}/custom-field" \
  -H "Authorization: Basic API_USERNAME:API_PASSWORD" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "customField[title]=My custom filed&customField[type]=text"
```

### Request Body

| Field | Type | Required | Description |
|------|------|----------|-------------|
| `customField.title` | string | Yes | Field label |
| `customField.type` | string | Yes | One of supported types (stored as `settings.custom_field_type`) |
| `customField.options` | array[string] | No | Options for `select` type |

### Example Response

```json
{
  "customField": {
    "board_id": "3",
    "title": "My custom filed",
    "slug": "my-custom-filed",
    "settings": {
      "custom_field_type": "text"
    },
    "position": 2,
    "type": "custom-field",
    "updated_at": "2025-08-08T10:59:17+00:00",
    "created_at": "2025-08-08T10:59:17+00:00",
    "id": 111
  },
  "message": "Custom field has been successfully created"
}
```

## Update a Custom Field

Update an existing custom field.

**HTTP Request**
```
PUT /wp-json/fluent-boards/v2/projects/{board_id}/custom-field/{custom_field_id}
```

### Example Request

```bash
curl -X PUT "https://yourdomain.com/wp-json/fluent-boards/v2/projects/{board_id}/custom-field/{custom_field_id}" \
  -H "Authorization: Basic API_USERNAME:API_PASSWORD" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "customField[title]=Custom text field&customField[type]=text"
```

### Request Body

| Field | Type | Required | Description |
|------|------|----------|-------------|
| `customField.title` | string | Yes | Field label |
| `customField.type` | string | Yes | One of supported types (stored as `settings.custom_field_type`) |
| `customField.options` | array[string] | No | Options for `select` type |

### Example Response

```json
{
  "customField": {
    "id": 111,
    "board_id": "3",
    "title": "Custom text field",
    "slug": "my-custom-filed",
    "type": "custom-field",
    "position": "2.00",
    "color": null,
    "bg_color": null,
    "settings": {
      "custom_field_type": "text"
    },
    "archived_at": null,
    "created_at": "2025-08-08T10:59:17+00:00",
    "updated_at": "2025-08-08T11:02:38+00:00"
  },
  "message": "Custom field has been updated successfully"
}
```

## Update Custom Field Position

Change the position/order of a custom field within the board.

**HTTP Request**
```
PUT /wp-json/fluent-boards/v2/projects/{board_id}/custom-field/{custom_field_id}/update-position
```

### Example Request

```bash
curl -X PUT "https://yourdomain.com/wp-json/fluent-boards/v2/projects/{board_id}/custom-field/{custom_field_id}/update-position" \
  -H "Authorization: Basic API_USERNAME:API_PASSWORD" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "newIndex=1"
```

### Request Body

| Field | Type | Required | Description |
|------|------|----------|-------------|
| `newIndex` | integer | Yes | 1-based new position index |

### Example Response

```json
{
  "message": "Custom field position has been updated successfully"
}
```

## Delete a Custom Field

Remove a custom field from a board.

**HTTP Request**
```
DELETE /wp-json/fluent-boards/v2/projects/{board_id}/custom-field/{custom_field_id}
```

### Example Request

```bash
curl -X DELETE "https://yourdomain.com/wp-json/fluent-boards/v2/projects/{board_id}/custom-field/{custom_field_id}" \
  -H "Authorization: Basic API_USERNAME:API_PASSWORD"
```

### Example Response

```json
{
  "message": "Custom field has been deleted successfully"
}
```

## Get Custom Fields for a Task

Retrieve custom field values for a specific task.

**HTTP Request**
```
GET /wp-json/fluent-boards/v2/projects/{board_id}/tasks/{task_id}/custom-fields
```

### Example Request

```bash
curl "https://yourdomain.com/wp-json/fluent-boards/v2/projects/{board_id}/tasks/{task_id}/custom-fields" \
  -H "Authorization: Basic API_USERNAME:API_PASSWORD"
```

### Example Response

```json
{
  "customFields": [
    {
      "id": 99,
      "object_id": "85",
      "object_type": "task_custom_field",
      "foreign_id": "111",
      "settings": {
        "value": "Hello world"
      },
      "preferences": null
    }
  ]
}
```

## Save Custom Field Value for a Task

Set or update a custom field value for a specific task.

**HTTP Request**
```
POST /wp-json/fluent-boards/v2/projects/{board_id}/tasks/{task_id}/custom-fields
```

### Example Request

```bash
curl -X POST "https://yourdomain.com/wp-json/fluent-boards/v2/projects/{board_id}/tasks/{task_id}/custom-fields" \
  -H "Authorization: Basic API_USERNAME:API_PASSWORD" \
  -H "Content-Type: application/json" \
  -d '{
    "custom_field_id": 111,
    "value": "Lorem ipsum"
  }'
```

### Request Body

| Field | Type | Required | Description |
|------|------|----------|-------------|
| `custom_field_id` | integer | Yes | The custom field ID |
| `value` | string | Yes | Value to save; for `checkbox` send `true`/`false`; for `date` send a parseable date |

### Example Response

```json
{
  "customField": {
    "id": 111,
    "board_id": "3",
    "title": "Custom text field",
    "slug": "my-custom-filed",
    "type": "custom-field",
    "position": "0.50",
    "color": null,
    "bg_color": null,
    "settings": {
      "custom_field_type": "text"
    },
    "archived_at": null,
    "created_at": "2025-08-08T10:59:17+00:00",
    "updated_at": "2025-08-08T11:06:58+00:00"
  }
}
```

## Error Responses

See [Common Error Responses](/rest-api/shared/error-responses) for standard error formats.

### Common Custom Field-Specific Errors

- **404 Not Found** - Custom field or board not found
- **403 Forbidden** - You don't have permission to manage custom fields
- **400 Bad Request** - Invalid custom field data or missing required fields

## Next Steps

- [Manage Tasks](/rest-api/tasks) - Work with board tasks
- [Handle Stages](/rest-api/stages) - Manage board stages
- [User Management](/rest-api/users) - Add/remove board members
- [Labels](/rest-api/labels) - Organize tasks with labels