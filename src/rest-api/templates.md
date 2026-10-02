# Templates

Templates let you reuse work at three levels:

- **Board templates**: a board marked as a template can be copied into a new board, with its stages, labels, custom fields and (optionally) tasks.
- **Stage templates**: a stage marked as a template shows up in the "import stage" picker on other boards.
- **Task templates**: a task marked as a template (task meta `is_template = yes`, set through the [Tasks](/rest-api/tasks) API) can be cloned into a new task.

Plugin source: Pro, except [Import Stages From Board](#import-stages-from-board), which is free.

## Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/templates` | List default and user board templates |
| GET | `/templates/default` | List default board templates |
| GET | `/templates/user` | List user board templates |
| GET | `/templates/preview` | Preview one board template |
| POST | `/templates/create-from` | Create a board from a template |
| GET | `/templates/task-creation-status` | Check async task copy progress |
| PUT | `/projects/{board_id}/make-template` | Mark a board as a template |
| PUT | `/projects/{board_id}/update-template-settings` | Update template description and category |
| PUT | `/projects/{board_id}/convert-to-board` | Turn a template back into a board |
| GET | `/projects/template-stages` | List template stages |
| PUT | `/projects/{board_id}/stage/{stage_id}/update-stage-template` | Toggle a stage's template flag |
| POST | `/projects/{board_id}/import-from-board` | Import stages from another board |
| GET | `/projects/get-template-tasks` | List template tasks |
| POST | `/projects/{board_id}/tasks/{task_id}/task-create-from-template` | Create a task from a template task |

## Board Template Summary Object

The list and preview endpoints return templates in this normalized shape.

| Field | Type | Description |
|---|---|---|
| `id` | integer\|string | Board ID for user templates, remote ID (string) for default templates |
| `title` | string | Template title |
| `description` | string | `settings.template_description`, falling back to the board description |
| `category` | string | `settings.template_category`. Defaults to `custom` for user templates and `general` for default templates |
| `type` | string | Board type: `to-do` or `roadmap` |
| `background` | object\|null | `color`, `is_image`, `image_url` |
| `preview_image` | string | Cover image URL (default templates only) |
| `stages` | array | Active stages: `id`, `title`, `position`, `bg_color` |
| `labels` | array | Labels: `id`, `title`, `color`, `bg_color`, `color_preset` |
| `stages_count` | integer | Number of stages |
| `labels_count` | integer | Number of labels |
| `tasks_count` | integer | Number of active top-level tasks |
| `created_at` | string | Creation timestamp |
| `can_manage` | boolean | User templates only. True when the current user is an admin or manager of the template board |

## List Board Templates <Badge type="tip" text="Pro" />

Return both default templates and the current user's templates. Requires a FluentBoards user (any board member).

```http
GET /wp-json/fluent-boards/v2/templates
```

**Example Request**

```bash
curl "https://yourdomain.com/wp-json/fluent-boards/v2/templates" \
  -u "USERNAME:APPLICATION_PASSWORD"
```

**Example Response**

```json
{
  "default_templates": [],
  "user_templates": [
    {
      "id": 12,
      "title": "Sprint Board",
      "description": "Two-week sprint workflow",
      "category": "engineering",
      "type": "to-do",
      "background": { "color": "#E3F2FD", "is_image": false, "image_url": null },
      "stages": [
        { "id": 40, "title": "Backlog", "position": 1, "bg_color": null },
        { "id": 41, "title": "In Progress", "position": 2, "bg_color": null },
        { "id": 42, "title": "Done", "position": 3, "bg_color": null }
      ],
      "labels": [
        { "id": 70, "title": "Bug", "color": "#FFFFFF", "bg_color": "#E17066", "color_preset": "red-bold" }
      ],
      "stages_count": 3,
      "labels_count": 1,
      "tasks_count": 8,
      "created_at": "2025-06-01T09:00:00+00:00",
      "can_manage": true
    }
  ]
}
```

::: info Default templates
Built-in (default) templates are not shipped yet. The plugin currently returns an empty list for `default_templates` and for [List Default Templates](#list-default-templates), and creating a board with `template_type: "default"` fails with `Template not found`.
:::

## List Default Templates <Badge type="tip" text="Pro" />

Return the built-in templates only. Requires a FluentBoards user.

```http
GET /wp-json/fluent-boards/v2/templates/default
```

**Example Request**

```bash
curl "https://yourdomain.com/wp-json/fluent-boards/v2/templates/default" \
  -u "USERNAME:APPLICATION_PASSWORD"
```

**Example Response**

```json
{
  "templates": []
}
```

## List User Templates <Badge type="tip" text="Pro" />

Return the boards marked as templates that the current user can access (to-do and roadmap boards). Requires a FluentBoards user.

```http
GET /wp-json/fluent-boards/v2/templates/user
```

**Example Request**

```bash
curl "https://yourdomain.com/wp-json/fluent-boards/v2/templates/user" \
  -u "USERNAME:APPLICATION_PASSWORD"
```

**Example Response**

```json
{
  "templates": [
    {
      "id": 12,
      "title": "Sprint Board",
      "description": "Two-week sprint workflow",
      "category": "engineering",
      "type": "to-do",
      "background": null,
      "stages": [ { "id": 40, "title": "Backlog", "position": 1, "bg_color": null } ],
      "labels": [],
      "stages_count": 1,
      "labels_count": 0,
      "tasks_count": 8,
      "created_at": "2025-06-01T09:00:00+00:00",
      "can_manage": true
    }
  ]
}
```

## Preview a Board Template <Badge type="tip" text="Pro" />

Return one template with its stages, labels and tasks. Requires a FluentBoards user; user templates must be accessible to the current user.

```http
GET /wp-json/fluent-boards/v2/templates/preview
```

**Parameters**

| Parameter | Type | Required | Description |
|---|---|---|---|
| `template_type` | string | No | `default` or `user`. Default `default` |
| `template_id` | integer\|string | Yes | Board ID (user template) or remote template ID (default template) |

**Example Request**

```bash
curl "https://yourdomain.com/wp-json/fluent-boards/v2/templates/preview?template_type=user&template_id=12" \
  -u "USERNAME:APPLICATION_PASSWORD"
```

**Example Response**

The `preview` object has the summary fields plus `tasks`. Each task contains `id`, `stage_id`, `title`, `description`, `position`, `status`, `priority`, `due_at`, `settings` and `label_ids`.

```json
{
  "preview": {
    "id": 12,
    "title": "Sprint Board",
    "description": "Two-week sprint workflow",
    "category": "engineering",
    "type": "to-do",
    "background": null,
    "stages": [ { "id": 40, "title": "Backlog", "position": 1, "bg_color": null } ],
    "labels": [ { "id": 70, "title": "Bug", "color": "#FFFFFF", "bg_color": "#E17066", "color_preset": "red-bold" } ],
    "tasks": [
      {
        "id": 501,
        "stage_id": 40,
        "title": "Set up CI",
        "description": "",
        "position": 1,
        "status": "open",
        "priority": "medium",
        "due_at": null,
        "settings": [],
        "label_ids": [70]
      }
    ],
    "stages_count": 1,
    "labels_count": 1,
    "tasks_count": 1,
    "created_at": "2025-06-01T09:00:00+00:00"
  }
}
```

## Create a Board From a Template <Badge type="tip" text="Pro" />

Create a new board from a template. The new board gets the selected stages, labels (or the default label set), the template's custom fields, its background, and any extra stages you add. When `include_tasks` is `yes`, tasks are copied in the background in batches; poll [Get Task Creation Status](#get-task-creation-status) to track progress.

Requires board creation permission (WordPress admin / FluentBoards manager, or members when "allow members to create boards" is on). For user templates the current user must also have access to the template board.

```http
POST /wp-json/fluent-boards/v2/templates/create-from
```

**Parameters**

| Parameter | Type | Required | Description |
|---|---|---|---|
| `title` | string | Yes | Title of the new board |
| `template_type` | string | Yes | `user` (a board marked as template) or `default` |
| `template_id` | integer\|string | Yes | Template board ID, or remote template ID |
| `include_tasks` | string | No | `yes` to copy tasks (user templates only). Default `no` |
| `include_labels` | string | No | `yes` to copy labels, `no` to create the default label set instead. Default `yes` |
| `selected_stage_ids` | array | No | Template stage IDs to keep. Omit to keep all stages; send `[]` to keep none |
| `additional_stages` | array | No | Extra stages to append, as objects with a `title` (max 100 characters) |
| `selected_labels` | array | No | Labels to create instead of copying all template labels. Each item: `label`, `bg_color`, `color`, `color_preset`, `source_id` (template label ID, used to keep task label links) |

At least one stage must remain (selected or additional), otherwise the request fails with `At least one stage is required`.

**Example Request**

```bash
curl "https://yourdomain.com/wp-json/fluent-boards/v2/templates/create-from" \
  -X POST \
  -u "USERNAME:APPLICATION_PASSWORD" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Sprint 42",
    "template_type": "user",
    "template_id": 12,
    "include_tasks": "yes",
    "include_labels": "yes",
    "selected_stage_ids": [40, 41, 42],
    "additional_stages": [{ "title": "QA" }]
  }'
```

**Example Response**

`board` is the new board with its `stages` and `labels` loaded.

```json
{
  "board": {
    "id": 31,
    "title": "Sprint 42",
    "type": "to-do",
    "settings": {
      "task_creation_status": "pending",
      "task_creation_total": 8
    },
    "stages": [ { "id": 120, "title": "Backlog", "position": "1.00" } ],
    "labels": [ { "id": 210, "title": "Bug", "bg_color": "#E17066" } ]
  },
  "message": "Board created successfully from template"
}
```

## Get Task Creation Status <Badge type="tip" text="Pro" />

Check the progress of the background task copy started by [Create a Board From a Template](#create-a-board-from-a-template). Requires a FluentBoards user.

```http
GET /wp-json/fluent-boards/v2/templates/task-creation-status
```

**Parameters**

| Parameter | Type | Required | Description |
|---|---|---|---|
| `board_id` | integer | Yes | ID of the board created from the template |

**Example Request**

```bash
curl "https://yourdomain.com/wp-json/fluent-boards/v2/templates/task-creation-status?board_id=31" \
  -u "USERNAME:APPLICATION_PASSWORD"
```

**Example Response**

`status` is `pending`, `completed` or `failed` (boards that never started a copy report `completed`). `total` is the number of tasks to copy and `created` is the number of tasks currently on the board.

```json
{
  "status": "pending",
  "total": 8,
  "created": 5
}
```

## Make a Board a Template <Badge type="tip" text="Pro" />

Mark a board as a template (`settings.is_template = true`). Requires board manager.

```http
PUT /wp-json/fluent-boards/v2/projects/{board_id}/make-template
```

**Parameters**

| Parameter | Type | Required | Description |
|---|---|---|---|
| `template_description` | string | No | Saved to `settings.template_description` |
| `template_category` | string | No | Saved to `settings.template_category` |

**Example Request**

```bash
curl "https://yourdomain.com/wp-json/fluent-boards/v2/projects/12/make-template" \
  -X PUT \
  -u "USERNAME:APPLICATION_PASSWORD" \
  -H "Content-Type: application/json" \
  -d '{
    "template_description": "Two-week sprint workflow",
    "template_category": "engineering"
  }'
```

**Example Response**

```json
{
  "board": {
    "id": 12,
    "title": "Sprint Board",
    "type": "to-do",
    "settings": {
      "is_template": true,
      "template_description": "Two-week sprint workflow",
      "template_category": "engineering"
    }
  },
  "message": "Board has been converted to a template"
}
```

## Update Template Settings <Badge type="tip" text="Pro" />

Change a template's description or category. Only the fields you send are changed. Requires board manager.

```http
PUT /wp-json/fluent-boards/v2/projects/{board_id}/update-template-settings
```

**Parameters**

| Parameter | Type | Required | Description |
|---|---|---|---|
| `template_description` | string | No | New description |
| `template_category` | string | No | New category |

**Example Request**

```bash
curl "https://yourdomain.com/wp-json/fluent-boards/v2/projects/12/update-template-settings" \
  -X PUT \
  -u "USERNAME:APPLICATION_PASSWORD" \
  -H "Content-Type: application/json" \
  -d '{"template_category": "product"}'
```

**Example Response**

```json
{
  "board": {
    "id": 12,
    "title": "Sprint Board",
    "settings": {
      "is_template": true,
      "template_description": "Two-week sprint workflow",
      "template_category": "product"
    }
  },
  "message": "Template settings updated successfully"
}
```

## Convert a Template to a Board <Badge type="tip" text="Pro" />

Remove the template flag, description and category from a board. Requires board manager.

```http
PUT /wp-json/fluent-boards/v2/projects/{board_id}/convert-to-board
```

**Example Request**

```bash
curl "https://yourdomain.com/wp-json/fluent-boards/v2/projects/12/convert-to-board" \
  -X PUT \
  -u "USERNAME:APPLICATION_PASSWORD"
```

**Example Response**

```json
{
  "board": {
    "id": 12,
    "title": "Sprint Board",
    "settings": {}
  },
  "message": "Template has been converted back to a board"
}
```

## List Template Stages <Badge type="tip" text="Pro" />

Return every stage marked as a template (`settings.is_template = true`) on boards the current user can access. Admins see template stages from all to-do boards. Each stage includes its `board`.

```http
GET /wp-json/fluent-boards/v2/projects/template-stages
```

**Example Request**

```bash
curl "https://yourdomain.com/wp-json/fluent-boards/v2/projects/template-stages" \
  -u "USERNAME:APPLICATION_PASSWORD"
```

**Example Response**

```json
{
  "stages": [
    {
      "id": 10,
      "title": "Backlog",
      "board_id": 2,
      "type": "stage",
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

## Toggle Stage Template <Badge type="tip" text="Pro" />

Flip `settings.is_template` on a stage. No body is needed.

```http
PUT /wp-json/fluent-boards/v2/projects/{board_id}/stage/{stage_id}/update-stage-template
```

**Example Request**

```bash
curl "https://yourdomain.com/wp-json/fluent-boards/v2/projects/1/stage/12/update-stage-template" \
  -X PUT \
  -u "USERNAME:APPLICATION_PASSWORD"
```

**Example Response**

```json
{
  "stage": {
    "id": 12,
    "board_id": 1,
    "title": "To Do",
    "type": "stage",
    "position": "1.00",
    "settings": { "default_task_status": "open", "is_template": true },
    "created_at": "2025-01-01T00:00:00+00:00",
    "updated_at": "2025-01-01T00:00:00+00:00"
  },
  "message": "Stage updated successfully"
}
```

## Import Stages From Board

Copy one or more stages, with their tasks, from other boards into this board. Imported stages are titled `<original title> - imported`. The current user must be a member of every source board (admins can import from any board). Plugin source: free.

```http
POST /wp-json/fluent-boards/v2/projects/{board_id}/import-from-board
```

**Parameters**

| Parameter | Type | Required | Description |
|---|---|---|---|
| `selectedStages` | array | Yes | Source stage IDs. All must exist and be active |
| `position` | integer | No | 1-based position of the first imported stage. Defaults to the end of the board |

**Example Request**

```bash
curl "https://yourdomain.com/wp-json/fluent-boards/v2/projects/1/import-from-board" \
  -X POST \
  -u "USERNAME:APPLICATION_PASSWORD" \
  -H "Content-Type: application/json" \
  -d '{
    "selectedStages": [10, 11],
    "position": 2
  }'
```

**Example Response**

```json
{
  "message": "Import successfully"
}
```

If any stage is missing, archived or on a board you cannot access, the request fails with `400` and `Stage not found`.

## List Template Tasks <Badge type="tip" text="Pro" />

Return active tasks marked as templates on boards the current user can access, with their `assignees` and `labels`. The response is a plain array.

```http
GET /wp-json/fluent-boards/v2/projects/get-template-tasks
```

**Example Request**

```bash
curl "https://yourdomain.com/wp-json/fluent-boards/v2/projects/get-template-tasks" \
  -u "USERNAME:APPLICATION_PASSWORD"
```

**Example Response**

```json
[
  {
    "id": 101,
    "board_id": 1,
    "stage_id": 10,
    "title": "Example Template Task",
    "status": "open",
    "assignees": [ { "ID": 1, "display_name": "John Doe" } ],
    "labels": [ { "id": 7, "title": "bug", "bg_color": "#999999" } ]
  }
]
```

## Create a Task From a Template <Badge type="tip" text="Pro" />

Create a new task by cloning a template task (`{task_id}`) into a stage of `{board_id}`. The new task is placed at the top of the stage. The current user must have access to the template task's board.

Copy flags are strings: `"true"` copies the item, anything else skips it. When the template task is on another board, only subtasks are copied (without assignees); assignees, labels, watchers, attachments, comments, time tracks and custom fields are copied only within the same board. If assignees are not copied, the stage's default assignees are applied.

```http
POST /wp-json/fluent-boards/v2/projects/{board_id}/tasks/{task_id}/task-create-from-template
```

**Parameters**

| Parameter | Type | Required | Description |
|---|---|---|---|
| `title` | string | Yes | Title of the new task |
| `board_id` | integer | Yes | Target board ID. Must equal `{board_id}` |
| `stage_id` | integer | Yes | Target stage ID on that board |
| `assignee` | string | Yes | `"true"` to copy assignees |
| `subtask` | string | Yes | `"true"` to copy subtasks and subtask groups |
| `label` | string | Yes | `"true"` to copy labels |
| `attachment` | string | Yes | `"true"` to copy attachments |
| `watcher` | string | No | `"true"` to copy watchers |
| `comment` | string | No | `"true"` to copy comments and replies |
| `time_tracking` | string | No | `"true"` to copy time tracks |
| `custom_field` | string | No | `"true"` to copy custom field values |
| `recurring` | string | No | `"true"` to copy recurring settings (same board only) |

**Example Request**

```bash
curl "https://yourdomain.com/wp-json/fluent-boards/v2/projects/1/tasks/101/task-create-from-template" \
  -X POST \
  -u "USERNAME:APPLICATION_PASSWORD" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Example Task",
    "board_id": 1,
    "stage_id": 10,
    "assignee": "true",
    "subtask": "true",
    "label": "true",
    "attachment": "false"
  }'
```

**Example Response**

`task` includes `board`, `assignees`, `labels`, `watchers` and `attachments`. `updatedTasks` lists the board's tasks changed in the last minute.

```json
{
  "task": {
    "id": 999,
    "board_id": 1,
    "stage_id": 10,
    "title": "Example Task",
    "position": "0.50",
    "assignees": [ { "ID": 1, "display_name": "John Doe" } ],
    "labels": [ { "id": 7, "title": "bug" } ],
    "watchers": [],
    "attachments": []
  },
  "message": "Task has been successfully created",
  "updatedTasks": [ { "id": 999, "stage_id": 10 } ]
}
```

See [Common Error Responses](/rest-api/shared/error-responses) for standard error formats.
