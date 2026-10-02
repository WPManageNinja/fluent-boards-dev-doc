# Custom Fields

Custom fields add structured data to tasks. A field is defined once per board and each task stores its own value. Plugin source: Pro.

::: tip Pro
All endpoints on this page need Fluent Boards Pro.
:::

All endpoints use `SingleBoardPolicy`: the user must be a member of the board, and board viewers can only call `GET` endpoints. Creating, updating, reordering and deleting field definitions requires board manager.

## Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/projects/{board_id}/custom-fields` | List board custom fields |
| POST | `/projects/{board_id}/custom-field` | Create a custom field |
| PUT | `/projects/{board_id}/custom-field/{custom_field_id}` | Update a custom field |
| PUT | `/projects/{board_id}/custom-field/{custom_field_id}/update-position` | Move a custom field |
| DELETE | `/projects/{board_id}/custom-field/{custom_field_id}` | Delete a custom field |
| GET | `/projects/{board_id}/tasks/{task_id}/custom-fields` | Get a task's custom field values |
| POST | `/projects/{board_id}/tasks/{task_id}/custom-fields` | Save a task's custom field value |

## Custom Field Object

Custom fields are stored in the `fbs_board_terms` table with `type = "custom-field"`.

```json
{
  "id": 110,
  "board_id": "3",
  "title": "Story points",
  "slug": "story-points",
  "type": "custom-field",
  "position": "1.00",
  "color": null,
  "bg_color": null,
  "settings": {
    "custom_field_type": "number"
  },
  "archived_at": null,
  "created_at": "2025-08-08T10:56:47+00:00",
  "updated_at": "2025-08-08T10:56:47+00:00"
}
```

| Property | Type | Description |
|---|---|---|
| `id` | integer | Custom field ID |
| `board_id` | integer | Board the field belongs to |
| `title` | string | Field label |
| `slug` | string | Lowercased title with spaces replaced by `-` |
| `type` | string | Always `custom-field` |
| `position` | number | Sort position |
| `settings.custom_field_type` | string | `text`, `number`, `select`, `multi-select`, `date` or `checkbox` |
| `settings.select_options` | array | Options for `select` and `multi-select` fields |
| `archived_at` | string\|null | Archive timestamp |

## List Board Custom Fields

Retrieve all custom fields defined on a board.

```http
GET /wp-json/fluent-boards/v2/projects/{board_id}/custom-fields
```

**Example Request**

```bash
curl "https://yourdomain.com/wp-json/fluent-boards/v2/projects/3/custom-fields" \
  -u "USERNAME:APPLICATION_PASSWORD"
```

**Example Response**

```json
{
  "customFields": [
    {
      "id": 110,
      "board_id": "3",
      "title": "Story points",
      "slug": "story-points",
      "type": "custom-field",
      "position": "1.00",
      "color": null,
      "bg_color": null,
      "settings": {
        "custom_field_type": "number"
      },
      "archived_at": null,
      "created_at": "2025-08-08T10:56:47+00:00",
      "updated_at": "2025-08-08T10:56:47+00:00"
    }
  ]
}
```

## Create a Custom Field

Create a custom field on a board. The field is added after the last field. Requires board manager.

```http
POST /wp-json/fluent-boards/v2/projects/{board_id}/custom-field
```

**Parameters**

All fields are sent inside a `customField` object.

| Parameter | Type | Required | Description |
|---|---|---|---|
| `customField[title]` | string | Yes | Field label |
| `customField[type]` | string | Yes | `text`, `number`, `select`, `multi-select`, `date` or `checkbox`. Stored as `settings.custom_field_type` |
| `customField[options]` | array | No | Options for `select` and `multi-select`. Stored as `settings.select_options` |

**Example Request**

```bash
curl "https://yourdomain.com/wp-json/fluent-boards/v2/projects/3/custom-field" \
  -X POST \
  -u "USERNAME:APPLICATION_PASSWORD" \
  -H "Content-Type: application/json" \
  -d '{
    "customField": {
      "title": "Environment",
      "type": "select",
      "options": ["Staging", "Production"]
    }
  }'
```

**Example Response**

```json
{
  "customField": {
    "board_id": "3",
    "title": "Environment",
    "slug": "environment",
    "settings": {
      "custom_field_type": "select",
      "select_options": ["Staging", "Production"]
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

If the board already has a field with the same title and type, the endpoint returns `400` with `Custom Field with that title and type already exists`.

## Update a Custom Field

Rename a custom field or change its options. The field type cannot be changed; `customField[type]` is still required and is used for the duplicate check. Requires board manager.

```http
PUT /wp-json/fluent-boards/v2/projects/{board_id}/custom-field/{custom_field_id}
```

**Parameters**

| Parameter | Type | Required | Description |
|---|---|---|---|
| `customField[title]` | string | Yes | Field label |
| `customField[type]` | string | Yes | The field's current type |
| `customField[options]` | array | No | New options for `select` and `multi-select` |

**Example Request**

```bash
curl "https://yourdomain.com/wp-json/fluent-boards/v2/projects/3/custom-field/111" \
  -X PUT \
  -u "USERNAME:APPLICATION_PASSWORD" \
  -H "Content-Type: application/json" \
  -d '{
    "customField": {
      "title": "Deploy target",
      "type": "select",
      "options": ["Staging", "Production", "Preview"]
    }
  }'
```

**Example Response**

```json
{
  "customField": {
    "id": 111,
    "board_id": "3",
    "title": "Deploy target",
    "slug": "environment",
    "type": "custom-field",
    "position": "2.00",
    "color": null,
    "bg_color": null,
    "settings": {
      "custom_field_type": "select",
      "select_options": ["Staging", "Production", "Preview"]
    },
    "archived_at": null,
    "created_at": "2025-08-08T10:59:17+00:00",
    "updated_at": "2025-08-08T11:02:38+00:00"
  },
  "message": "Custom field has been updated successfully"
}
```

When the new title and type clash with another field, nothing is saved and `customField` is `false`.

## Update Custom Field Position

Move a custom field to a new position on the board. Requires board manager.

```http
PUT /wp-json/fluent-boards/v2/projects/{board_id}/custom-field/{custom_field_id}/update-position
```

**Parameters**

| Parameter | Type | Required | Description |
|---|---|---|---|
| `newIndex` | integer | Yes | New 1-based position |

**Example Request**

```bash
curl "https://yourdomain.com/wp-json/fluent-boards/v2/projects/3/custom-field/111/update-position" \
  -X PUT \
  -u "USERNAME:APPLICATION_PASSWORD" \
  -H "Content-Type: application/json" \
  -d '{"newIndex": 1}'
```

**Example Response**

```json
{
  "message": "Custom field position has been updated successfully"
}
```

## Delete a Custom Field

Delete a custom field and remove its values from every task. Requires board manager.

```http
DELETE /wp-json/fluent-boards/v2/projects/{board_id}/custom-field/{custom_field_id}
```

**Example Request**

```bash
curl "https://yourdomain.com/wp-json/fluent-boards/v2/projects/3/custom-field/111" \
  -X DELETE \
  -u "USERNAME:APPLICATION_PASSWORD"
```

**Example Response**

```json
{
  "message": "Custom field has been deleted successfully"
}
```

## Get Custom Field Values for a Task

Retrieve the custom field values saved on a task. Each item is a relation row: `foreign_id` is the custom field ID and `settings.value` is the value. Fields without a saved value are not included.

```http
GET /wp-json/fluent-boards/v2/projects/{board_id}/tasks/{task_id}/custom-fields
```

**Example Request**

```bash
curl "https://yourdomain.com/wp-json/fluent-boards/v2/projects/3/tasks/85/custom-fields" \
  -u "USERNAME:APPLICATION_PASSWORD"
```

**Example Response**

```json
{
  "customFields": [
    {
      "id": 99,
      "object_id": "85",
      "object_type": "task_custom_field",
      "foreign_id": "111",
      "settings": {
        "value": "Production"
      },
      "preferences": null,
      "created_at": "2025-08-08T11:06:58+00:00",
      "updated_at": "2025-08-08T11:06:58+00:00"
    }
  ]
}
```

## Save a Custom Field Value for a Task

Set or replace a task's value for one custom field. The task and the field must both belong to the board.

```http
POST /wp-json/fluent-boards/v2/projects/{board_id}/tasks/{task_id}/custom-fields
```

**Parameters**

| Parameter | Type | Required | Description |
|---|---|---|---|
| `custom_field_id` | integer | Yes | Custom field ID |
| `value` | mixed | Yes | The value. See the format notes below |

Value formats by field type:

- `checkbox`: the string `"true"` saves `true`; anything else saves `false`.
- `date`: a JavaScript `Date.toString()` string, for example `Fri Aug 08 2025 10:00:00 GMT+0600 (Bangladesh Standard Time)`. It is stored as `Y-m-d H:i:s`. An empty value clears the date.
- `multi-select`: an array of option values.
- Other types: saved as sent.

**Example Request**

```bash
curl "https://yourdomain.com/wp-json/fluent-boards/v2/projects/3/tasks/85/custom-fields" \
  -X POST \
  -u "USERNAME:APPLICATION_PASSWORD" \
  -H "Content-Type: application/json" \
  -d '{
    "custom_field_id": 111,
    "value": "Production"
  }'
```

**Example Response**

The response returns the custom field definition, not the saved value.

```json
{
  "customField": {
    "id": 111,
    "board_id": "3",
    "title": "Deploy target",
    "slug": "environment",
    "type": "custom-field",
    "position": "2.00",
    "color": null,
    "bg_color": null,
    "settings": {
      "custom_field_type": "select",
      "select_options": ["Staging", "Production", "Preview"]
    },
    "archived_at": null,
    "created_at": "2025-08-08T10:59:17+00:00",
    "updated_at": "2025-08-08T11:06:58+00:00"
  }
}
```

## Error Responses

Endpoints that take a `{custom_field_id}` or `custom_field_id` fail with `Custom field not found` when the field does not belong to `{board_id}`.

See [Common Error Responses](/rest-api/shared/error-responses) for standard error formats.
