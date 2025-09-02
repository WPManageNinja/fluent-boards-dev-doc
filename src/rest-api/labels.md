# Labels

The Labels API allows you to manage task labels in Fluent Boards. You can create, read, update, and delete labels, as well as assign them to tasks.
## List All Labels

Retrieve all labels for a project.

**HTTP Request**
```
GET /wp-json/fluent-boards/v2/projects/{board_id}/labels
```

### Example Response

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
      "id": 34,
      "board_id": "3",
      "title": "",
      "slug": "",
      "type": "label",
      "position": "0.00",
      "color": null,
      "bg_color": "#D7BDE2",
      "settings": null,
      "archived_at": null,
      "created_at": "2024-12-24T08:43:51+00:00",
      "updated_at": "2024-12-24T08:43:51+00:00"
    },
    {
      "id": 35,
      "board_id": "3",
      "title": "improvement",
      "slug": "",
      "type": "label",
      "position": "0.00",
      "color": null,
      "bg_color": "#AED6F1",
      "settings": null,
      "archived_at": null,
      "created_at": "2024-12-24T08:43:51+00:00",
      "updated_at": "2024-12-24T08:43:51+00:00"
    }
  ]
}
```

## Create a Label

Create a new label for a project.

**HTTP Request**
```
POST /wp-json/fluent-boards/v2/projects/{board_id}/labels
```

### Request Body

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `label` | string | No | Label title |
| `color` | string | Yes | Label color (hex code) |
| `bg_color` | string | Yes | Label background color (hex code) |

### Example Request Data
```
{
  "label": "Documentation",
  "color": "#2196F3",
  "bg_color": "#0000FF"
}
```

### Example Response

```json
{
  "message": "Label has been created",
  "label": {
    "board_id": "3",
    "title": "Documentation",
    "bg_color": "#0000FF",
    "color": "#2196F3",
    "type": "label",
    "updated_at": "2025-08-07T06:12:24+00:00",
    "created_at": "2025-08-07T06:12:24+00:00",
    "id": 109
  }
}
```

## Update a Label

Update an existing label.

**HTTP Request**
```
PUT /wp-json/fluent-boards/v2/projects/{board_id}/labels/{label_id}
```

### Request Body

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `label` | string | No | Label title |
| `color` | string | No | Label color (hex code) |
| `bg_color` | string | Yes | Label background color (hex code) |

### Example Request Data

```
{
  "label": "Critical Bug",
  "color": "#D32F2F",
  "bg_color": "#D32F2F"
}
```

### Example Response

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

Delete a label.

**HTTP Request**
```
DELETE /wp-json/fluent-boards/v2/projects/{board_id}/labels/{label_id}
```

### Example Response

```json
{
  "message": "Label has been deleted",
  "type": "success"
}
```

## Get Labels Used in Tasks

Retrieve labels that are currently assigned to tasks.

**HTTP Request**
```
GET /wp-json/fluent-boards/v2/projects/{board_id}/labels/used-in-tasks
```

### Example Response

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
      "title": "improvement",
      "slug": "",
      "type": "label",
      "position": "0.00",
      "color": null,
      "bg_color": "#AED6F1",
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

## Get Task Labels

Retrieve all labels assigned to a specific task.

**HTTP Request**
```
GET /wp-json/fluent-boards/v2/projects/{board_id}/tasks/{task_id}/labels
```

### Example Response

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
    },
    {
      "id": 35,
      "board_id": "3",
      "title": "improvement",
      "slug": "",
      "type": "label",
      "position": "0.00",
      "color": null,
      "bg_color": "#AED6F1",
      "settings": null,
      "archived_at": null,
      "created_at": "2024-12-24T08:43:51+00:00",
      "updated_at": "2024-12-24T08:43:51+00:00",
      "pivot": {
        "object_id": "149",
        "foreign_id": "35",
        "settings": null,
        "created_at": "2024-12-24T08:43:53+00:00",
        "updated_at": "2024-12-24T08:43:53+00:00"
      }
    }
  ]
}
```

## Assign Labels to Task

Assign one or more labels to a task.

**HTTP Request**
```
POST /wp-json/fluent-boards/v2/projects/{board_id}/labels/task
```

### Request Body

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `taskId` | integer | Yes | The ID of the task |
| `labelId` | integer | Yes | The ID of the label to assign |

### Example Request Data

```
{
  "taskId": 149,
  "labelId": 33
}
```

### Example Response

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

## Remove Label from Task

Remove a specific label from a task.

**HTTP Request**
```
DELETE /wp-json/fluent-boards/v2/projects/{board_id}/tasks/{task_id}/labels/{label_id}
```

### Example Response

```json
{
  "message": "Label has been deleted"
}
```

## Error Responses

See [Common Error Responses](/rest-api/shared/error-responses) for standard error formats.

### Common Label-Specific Errors

- **404 Not Found** - Label not found
- **403 Forbidden** - You don't have permission to manage labels
- **400 Bad Request** - Invalid label data or missing required fields

 