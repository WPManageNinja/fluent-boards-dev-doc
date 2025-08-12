# Templates (Pro)

Endpoints to list template stages and tasks, toggle stage template status, and create a task from a template.

Base path for all endpoints below:
```
/wp-json/fluent-boards/v2
```

## List Template Stages

**HTTP Request**
```
GET /wp-json/fluent-boards/v2/projects/template-stages
```

### Example Response
```json
{
  "stages": [
    {
      "id": 10,
      "title": "Backlog",
      "board_id": 2,
      "settings": {
        "default_task_status": "open",
        "is_template": true
      },
      "board": {
        "id": 2,
        "title": "Example Board",
        "type": "to-do"
      }
    }
  ]
}
```

## List Template Tasks

**HTTP Request**
```
GET /wp-json/fluent-boards/v2/projects/get-template-tasks
```

### Example Response
```json
[
  {
    "id": 101,
    "board_id": 1,
    "title": "Example Template Task",
    "status": "open",
    "stage_id": 10,
    "meta": { "is_template": "yes" },
    "assignees": [ { "ID": 1, "display_name": "John Doe" } ],
    "labels": [ { "id": 7, "title": "bug", "bg_color": "#999999" } ]
  }
]
```

## Toggle Stage Template

Marks/unmarks a stage as a template.

**HTTP Request**
```
PUT /wp-json/fluent-boards/v2/projects/{board_id}/stage/{stage_id}/update-stage-template
```

### Example Response
```json
{
  "stage": {
    "id": 12,
    "board_id": 1,
    "title": "To Do",
    "type": "stage",
    "position": "1.00",
    "settings": { "default_task_status": "open", "is_template": false },
    "created_at": "2025-01-01T00:00:00+00:00",
    "updated_at": "2025-01-01T00:00:00+00:00"
  },
  "message": "Stage updated successfully"
}
```

## Import Stages From Board

Import one or more stages from another board into the current board.

**HTTP Request**
```
POST /wp-json/fluent-boards/v2/projects/{board_id}/import-from-board
```

### Request Body

| Field | Type | Required | Description |
|------|------|----------|-------------|
| `selectedStages[]` | array[integer] | Yes | Stage IDs to import |
| `position` | integer | No | Insert starting position (optional) |

### Example Response
```json
{
  "message": "Import successfully"
}
```


## Create Task From Template

Creates a new task by cloning a template task and optionally copying related data.

**HTTP Request**
```
POST /wp-json/fluent-boards/v2/projects/{board_id}/tasks/{task_id}/task-create-from-template
```

### Request Body

| Field | Type | Required | Description |
|------|------|----------|-------------|
| `title` | string | Yes | Title for the new task |
| `board_id` | integer | Yes | Target board ID |
| `stage_id` | integer | Yes | Target stage ID |
| `assignee` | boolean/string | Yes | Copy assignees from template (`true`/`false`) |
| `subtask` | boolean/string | Yes | Copy subtasks (`true`/`false`) |
| `label` | boolean/string | Yes | Copy labels (`true`/`false`) |
| `attachment` | boolean/string | Yes | Copy attachments (`true`/`false`) |

### Example Request
```json
{
  "title": "Example Task",
  "board_id": 1,
  "stage_id": 10,
  "assignee": "true",
  "subtask": "true",
  "label": "true",
  "attachment": "true"
}
```

### Example Response
```json
{
  "task": {
    "id": 999,
    "board_id": 1,
    "stage_id": 10,
    "title": "Example Task",
    "settings": { "subtask_count": 2, "attachment_count": 1 },
    "assignees": [ { "ID": 1, "display_name": "John Doe" } ],
    "labels": [ { "id": 7, "title": "bug" } ],
    "attachments": [ { "id": 1, "attachment_type": "image/png", "secure_url": "..." } ]
  },
  "message": "Task has been successfully created",
  "updatedTasks": [ { "id": 999, "stage_id": 10 } ]
}
```

Notes:
- Paths use `projects` and placeholders `{board_id}` and `{task_id}`.
- All endpoints are Pro-only and require authentication/permissions.

