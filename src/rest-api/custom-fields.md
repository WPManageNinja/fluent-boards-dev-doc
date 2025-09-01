# Custom Fields

Custom Fields let you define additional data fields for tasks on a board. These endpoints are available in Fluent Boards Pro.

## Custom Field Object

| Property | Type | Description |
|----------|------|-------------|
| `id` | integer | Unique identifier of the custom field |
| `board_id` | integer | Board ID the field belongs to |
| `title` | string | Field label shown in UI |
| `slug` | string | URL-safe identifier derived from title |
| `type` | string | Always `custom-field` |
| `position` | number | Ordering index (may be fractional) |
| `settings` | object | Field configuration |
| `settings.custom_field_type` | string | One of: `text`, `textarea`, `number`, `select`, `checkbox`, `date`, `url`, `email` |
| `settings.select_options` | array[string] | Options for `select` type (if provided) |
| `created_at` | string | Creation timestamp |
| `updated_at` | string | Update timestamp |

Note: The model extends `BoardTerm`, so `color` and `bg_color` may exist but are not used for custom fields.

## List Board Custom Fields

**HTTP Request**
```
GET /wp-json/fluent-boards/v2/projects/{board_id}/custom-fields
```

### Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `board_id` | integer | The ID of the board |

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

## Create Custom Field

**HTTP Request**
```
POST /wp-json/fluent-boards/v2/projects/{board_id}/custom-field
```

### Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `board_id` | integer | The ID of the board |

### Request Body

| Field | Type | Required | Description |
|------|------|----------|-------------|
| `customField.title` | string | Yes | Field label |
| `customField.type` | string | Yes | One of supported types (stored as `settings.custom_field_type`) |
| `customField.options` | array[string] | No | Options for `select` type |

### Example Request

```bash
curl -X POST "https://yourdomain.com/wp-json/fluent-boards/v2/projects/{board_id}/custom-field" \
  -H "Authorization: Basic API_USERNAME:API_PASSWORD" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "customField[title]=My custom filed&customField[type]=text"
```

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

## Update Custom Field

**HTTP Request**
```
PUT /wp-json/fluent-boards/v2/projects/{board_id}/custom-field/{custom_field_id}
```

### Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `board_id` | integer | The ID of the board |
| `custom_field_id` | integer | The ID of the custom field |

### Request Body

| Field | Type | Required | Description |
|------|------|----------|-------------|
| `customField.title` | string | Yes | Field label |
| `customField.type` | string | Yes | One of supported types (stored as `settings.custom_field_type`) |
| `customField.options` | array[string] | No | Options for `select` type |

### Example Request

```bash
curl -X PUT "https://yourdomain.com/wp-json/fluent-boards/v2/projects/{board_id}/custom-field/{custom_field_id}" \
  -H "Authorization: Basic API_USERNAME:API_PASSWORD" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "customField[title]=Custom text field&customField[type]=text"
```

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

**HTTP Request**
```
PUT /wp-json/fluent-boards/v2/projects/{board_id}/custom-field/{custom_field_id}/update-position
```

### Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `board_id` | integer | The ID of the board |
| `custom_field_id` | integer | The ID of the custom field |

### Request Body

| Field | Type | Required | Description |
|------|------|----------|-------------|
| `newIndex` | integer | Yes | 1-based new position index |

### Example Request

```bash
curl -X PUT "https://yourdomain.com/wp-json/fluent-boards/v2/projects/{board_id}/custom-field/{custom_field_id}/update-position" \
  -H "Authorization: Basic API_USERNAME:API_PASSWORD" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "newIndex=1"
```

### Example Response

```json
{
  "message": "Custom field position has been updated successfully"
}
```

## Delete Custom Field

**HTTP Request**
```
DELETE /wp-json/fluent-boards/v2/projects/{board_id}/custom-field/{custom_field_id}
```

### Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `board_id` | integer | The ID of the board |
| `custom_field_id` | integer | The ID of the custom field |

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

**HTTP Request**
```
GET /wp-json/fluent-boards/v2/projects/{board_id}/tasks/{task_id}/custom-fields
```

### Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `board_id` | integer | The ID of the board |
| `task_id` | integer | The ID of the task |

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

**HTTP Request**
```
POST /wp-json/fluent-boards/v2/projects/{board_id}/tasks/{task_id}/custom-fields
```

### Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `board_id` | integer | The ID of the board |
| `task_id` | integer | The ID of the task |

### Request Body

| Field | Type | Required | Description |
|------|------|----------|-------------|
| `custom_field_id` | integer | Yes | The custom field ID |
| `value` | string | Yes | Value to save; for `checkbox` send `true`/`false`; for `date` send a parseable date |

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