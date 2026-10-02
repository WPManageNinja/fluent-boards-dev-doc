# Labels

Labels are colored tags that belong to a board and can be attached to tasks. The Labels API lets you manage a board's labels and add or remove them on tasks. Plugin source: free.

All endpoints use `SingleBoardPolicy`: the user must be a member of the board, and board viewers can only call `GET` endpoints.

## Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/projects/{board_id}/labels` | List board labels |
| POST | `/projects/{board_id}/labels` | Create a label |
| PUT | `/projects/{board_id}/labels/{label_id}` | Update a label |
| DELETE | `/projects/{board_id}/labels/{label_id}` | Delete a label |
| GET | `/projects/{board_id}/labels/used-in-tasks` | List labels used by at least one task |
| GET | `/projects/{board_id}/tasks/{task_id}/labels` | List a task's labels |
| POST | `/projects/{board_id}/labels/task` | Add a label to a task |
| DELETE | `/projects/{board_id}/tasks/{task_id}/labels/{label_id}` | Remove a label from a task |

## Label Object

Labels are stored in the `fbs_board_terms` table with `type = "label"`.

| Field | Type | Description |
|---|---|---|
| `id` | integer | Label ID |
| `board_id` | integer | Board the label belongs to |
| `title` | string | Label text (may be empty) |
| `slug` | string | Slug |
| `type` | string | Always `label` |
| `color` | string\|null | Text color (hex) |
| `bg_color` | string\|null | Background color (hex) |
| `settings` | object\|null | `color_preset` holds the preset ID when the label uses a theme-aware preset |
| `archived_at` | string\|null | Archive timestamp |
| `created_at` | string | Creation timestamp |
| `updated_at` | string | Last update timestamp |

### Color presets

Instead of raw colors you can pass a `color_preset` ID. The preset sets `bg_color` and `color` to its light-mode values and is stored in `settings.color_preset`, so the UI can switch colors in dark mode. Preset IDs combine a color (`green`, `yellow`, `orange`, `red`, `purple`, `blue`, `sky`, `lime`, `pink`, `gray`) with a tone (`soft`, `bold`, `strong`), for example `green-soft`, `red-bold` or `blue-strong`. An unknown preset ID returns `400` with `Invalid label color preset`.

## List Labels

Retrieve all labels of a board, oldest first.

```http
GET /wp-json/fluent-boards/v2/projects/{board_id}/labels
```

**Example Request**

```bash
curl "https://yourdomain.com/wp-json/fluent-boards/v2/projects/3/labels" \
  -u "USERNAME:APPLICATION_PASSWORD"
```

**Example Response**

```json
{
  "labels": [
    {
      "id": 33,
      "board_id": "3",
      "title": "bugs",
      "slug": "",
      "type": "label",
      "position": "0.00",
      "color": null,
      "bg_color": "#E6B0AA",
      "settings": null,
      "archived_at": null,
      "created_at": "2024-12-24T08:43:51+00:00",
      "updated_at": "2024-12-24T08:43:51+00:00"
    },
    {
      "id": 35,
      "board_id": "3",
      "title": "Green",
      "slug": "green",
      "type": "label",
      "position": "0.00",
      "color": "#1B2533",
      "bg_color": "#70C392",
      "settings": {
        "color_preset": "green-bold"
      },
      "archived_at": null,
      "created_at": "2024-12-24T08:43:51+00:00",
      "updated_at": "2024-12-24T08:43:51+00:00"
    }
  ]
}
```

## Create a Label

Create a new label on a board.

```http
POST /wp-json/fluent-boards/v2/projects/{board_id}/labels
```

**Parameters**

| Parameter | Type | Required | Description |
|---|---|---|---|
| `label` | string | No | Label title |
| `bg_color` | string | Yes, unless `color_preset` is set | Background color (hex) |
| `color` | string | Yes, unless `color_preset` is set | Text color (hex) |
| `color_preset` | string | No | Preset ID (see [Color presets](#color-presets)). Overrides `bg_color` and `color` |

**Example Request**

```bash
curl "https://yourdomain.com/wp-json/fluent-boards/v2/projects/3/labels" \
  -X POST \
  -u "USERNAME:APPLICATION_PASSWORD" \
  -H "Content-Type: application/json" \
  -d '{
    "label": "Documentation",
    "color": "#FFFFFF",
    "bg_color": "#2196F3"
  }'
```

**Example Response**

```json
{
  "message": "Label has been created",
  "label": {
    "board_id": "3",
    "title": "Documentation",
    "bg_color": "#2196F3",
    "color": "#FFFFFF",
    "type": "label",
    "updated_at": "2025-08-07T06:12:24+00:00",
    "created_at": "2025-08-07T06:12:24+00:00",
    "id": 109
  }
}
```

## Update a Label

Update a label. Only the fields you send are changed.

```http
PUT /wp-json/fluent-boards/v2/projects/{board_id}/labels/{label_id}
```

**Parameters**

| Parameter | Type | Required | Description |
|---|---|---|---|
| `label` | string | No | Label title |
| `bg_color` | string | No | Background color (hex). Required when `color_preset` is `""` |
| `color` | string | No | Text color (hex). Required when `color_preset` is `""` |
| `color_preset` | string | No | Preset ID to apply. Send an empty string to drop the preset and use custom colors |

**Example Request**

```bash
curl "https://yourdomain.com/wp-json/fluent-boards/v2/projects/5/labels/62" \
  -X PUT \
  -u "USERNAME:APPLICATION_PASSWORD" \
  -H "Content-Type: application/json" \
  -d '{
    "label": "Critical Bug",
    "color": "#FFFFFF",
    "bg_color": "#D32F2F"
  }'
```

**Example Response**

```json
{
  "message": "Label has been updated",
  "label": {
    "id": 62,
    "board_id": "5",
    "title": "Critical Bug",
    "slug": "",
    "type": "label",
    "position": "0.00",
    "color": "#FFFFFF",
    "bg_color": "#D32F2F",
    "settings": null,
    "archived_at": null,
    "created_at": "2025-07-15T07:06:48+00:00",
    "updated_at": "2025-08-07T06:23:43+00:00"
  }
}
```

## Delete a Label

Delete a label from the board. The label is removed from every task first.

```http
DELETE /wp-json/fluent-boards/v2/projects/{board_id}/labels/{label_id}
```

**Example Request**

```bash
curl "https://yourdomain.com/wp-json/fluent-boards/v2/projects/5/labels/62" \
  -X DELETE \
  -u "USERNAME:APPLICATION_PASSWORD"
```

**Example Response**

```json
{
  "message": "Label has been deleted",
  "type": "success"
}
```

## List Labels Used in Tasks

Retrieve the board labels that are attached to at least one task.

```http
GET /wp-json/fluent-boards/v2/projects/{board_id}/labels/used-in-tasks
```

**Example Request**

```bash
curl "https://yourdomain.com/wp-json/fluent-boards/v2/projects/3/labels/used-in-tasks" \
  -u "USERNAME:APPLICATION_PASSWORD"
```

**Example Response**

```json
{
  "labels": [
    {
      "id": 33,
      "board_id": "3",
      "title": "bugs",
      "slug": "",
      "type": "label",
      "position": "0.00",
      "color": null,
      "bg_color": "#E6B0AA",
      "settings": null,
      "archived_at": null,
      "created_at": "2024-12-24T08:43:51+00:00",
      "updated_at": "2024-12-24T08:43:51+00:00"
    },
    {
      "id": 38,
      "board_id": "3",
      "title": "later",
      "slug": "",
      "type": "label",
      "position": "0.00",
      "color": null,
      "bg_color": "#658ca5",
      "settings": null,
      "archived_at": null,
      "created_at": "2024-12-24T08:43:51+00:00",
      "updated_at": "2024-12-24T08:43:51+00:00"
    }
  ]
}
```

## List Task Labels

Retrieve the labels attached to a task. The task must belong to the board.

```http
GET /wp-json/fluent-boards/v2/projects/{board_id}/tasks/{task_id}/labels
```

**Example Request**

```bash
curl "https://yourdomain.com/wp-json/fluent-boards/v2/projects/3/tasks/149/labels" \
  -u "USERNAME:APPLICATION_PASSWORD"
```

**Example Response**

```json
{
  "labels": [
    {
      "id": 33,
      "board_id": "3",
      "title": "bugs",
      "slug": "",
      "type": "label",
      "position": "0.00",
      "color": null,
      "bg_color": "#E6B0AA",
      "settings": null,
      "archived_at": null,
      "created_at": "2024-12-24T08:43:51+00:00",
      "updated_at": "2024-12-24T08:43:51+00:00",
      "pivot": {
        "object_id": "149",
        "foreign_id": "33",
        "settings": null,
        "created_at": "2024-12-24T08:43:53+00:00",
        "updated_at": "2024-12-24T08:43:53+00:00"
      }
    }
  ]
}
```

## Add a Label to a Task

Attach an existing board label to a task. The task and the label must both belong to the board. Adding a label that is already attached does nothing.

```http
POST /wp-json/fluent-boards/v2/projects/{board_id}/labels/task
```

**Parameters**

| Parameter | Type | Required | Description |
|---|---|---|---|
| `taskId` | integer | Yes | Task ID |
| `labelId` | integer | Yes | Label ID |

**Example Request**

```bash
curl "https://yourdomain.com/wp-json/fluent-boards/v2/projects/3/labels/task" \
  -X POST \
  -u "USERNAME:APPLICATION_PASSWORD" \
  -H "Content-Type: application/json" \
  -d '{
    "taskId": 149,
    "labelId": 33
  }'
```

**Example Response**

```json
{
  "message": "Label has been added",
  "label": {
    "id": 33,
    "board_id": "3",
    "title": "bugs",
    "slug": "",
    "type": "label",
    "position": "0.00",
    "color": null,
    "bg_color": "#E6B0AA",
    "settings": null,
    "archived_at": null,
    "created_at": "2024-12-24T08:43:51+00:00",
    "updated_at": "2024-12-24T08:43:51+00:00",
    "pivot": {
      "object_id": "149",
      "foreign_id": "33",
      "settings": null,
      "created_at": "2025-08-07T06:34:51+00:00",
      "updated_at": "2025-08-07T06:34:51+00:00"
    }
  }
}
```

## Remove a Label from a Task

Detach a label from a task. The label itself is kept on the board.

```http
DELETE /wp-json/fluent-boards/v2/projects/{board_id}/tasks/{task_id}/labels/{label_id}
```

**Example Request**

```bash
curl "https://yourdomain.com/wp-json/fluent-boards/v2/projects/3/tasks/149/labels/33" \
  -X DELETE \
  -u "USERNAME:APPLICATION_PASSWORD"
```

**Example Response**

```json
{
  "message": "Label has been deleted"
}
```

## Error Responses

Label endpoints return `400` with `Label not found` when the label does not belong to `{board_id}`, and with a task-not-found message when the task is on another board.

See [Common Error Responses](/rest-api/shared/error-responses) for standard error formats.
