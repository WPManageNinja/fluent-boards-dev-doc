# Dashboard & Global Utilities

Cross-board endpoints used by the FluentBoards dashboard and shared UI pieces: the "my tasks" lists, task tab configuration, global search, selector options, view preferences and member/board pickers. Plugin source: free.

Unless noted, these endpoints only need a logged-in user (`/tasks/*`, `/options/*`) or a FluentBoards user, meaning someone with access to at least one board (`/global-search`, `/ajax-options`, view settings). Results are always limited to the boards the current user can access.

## Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/tasks/top-in-boards` | Dashboard task lists and counts for the current user |
| GET | `/tasks/crm-associated-tasks/{associated_id}` | Tasks linked to a FluentCRM contact |
| GET | `/tasks/stage/{task_id}` | Stage of a task |
| GET | `/tasks/boards-by-type/{type}` | Boards of one type |
| GET | `/tasks/task-tabs/config` | Dashboard task tab configuration |
| POST | `/tasks/task-tabs/config` | Save task tab configuration |
| GET | `/global-search` | Search tasks and boards |
| GET | `/ajax-options` | Options for selector inputs |
| GET | `/get-dashboard-view-settings` | Card/list/table view preferences |
| PUT | `/update-dashboard-view-settings` | Save view preferences |
| GET | `/contacts/{board_id}` | FluentCRM contacts linked to a board's tasks |
| GET | `/options/members` | Board members for pickers |
| GET | `/options/projects` | Boards for pickers |

## Get Dashboard Tasks

Returns the current user's watched top-level tasks (on active boards, not archived), split into categories with up to 6 tasks each, plus counts. Each task includes `assignees`, `board` and `stage`.

```http
GET /wp-json/fluent-boards/v2/tasks/top-in-boards
```

**Example Request**

```bash
curl "https://yourdomain.com/wp-json/fluent-boards/v2/tasks/top-in-boards" \
  -u "USERNAME:APPLICATION_PASSWORD"
```

**Example Response**

```json
{
  "data": {
    "assigned": [
      { "id": 85, "title": "Fix login bug", "due_at": "2025-08-10 17:00:00", "board": { "id": 3, "title": "Website" }, "stage": { "id": 25, "title": "Doing" }, "assignees": [] }
    ],
    "overdue": [],
    "due_today": [],
    "upcoming": [],
    "mentioned": [],
    "completed": [],
    "others": []
  },
  "counts": {
    "due_today": 0,
    "assigned": 4,
    "overdue": 1,
    "upcoming": 3,
    "mentioned": 2,
    "completed": 10,
    "others": 5,
    "all_boards": 6,
    "all_tasks": 25
  }
}
```

Categories: `assigned` (open tasks assigned to you, most recently assigned first), `overdue`, `due_today`, `upcoming`, `mentioned` (tasks where you were mentioned in a comment), `completed`, `others` (no due date).

## Get CRM Contact Tasks

Returns all tasks linked to a FluentCRM contact, with board, stage, assignees and subtask groups. Requires FluentCRM and the `fcrm_read_contacts` permission; non-admins only see tasks on their boards.

```http
GET /wp-json/fluent-boards/v2/tasks/crm-associated-tasks/{associated_id}
```

**Example Request**

```bash
curl "https://yourdomain.com/wp-json/fluent-boards/v2/tasks/crm-associated-tasks/42" \
  -u "USERNAME:APPLICATION_PASSWORD"
```

**Example Response**

```json
{
  "tasks": [
    {
      "id": 85,
      "title": "Follow up with lead",
      "crm_contact_id": 42,
      "isOverdue": false,
      "isUpcoming": true,
      "can_edit": true,
      "board": { "id": 3, "title": "Sales" },
      "stage": { "id": 25, "title": "Contacted" },
      "assignees": [],
      "subtask_group": []
    }
  ]
}
```

Returns `403` when FluentCRM is missing or you cannot read contacts.

## Get a Task's Stage

Returns the stage of a task you can access.

```http
GET /wp-json/fluent-boards/v2/tasks/stage/{task_id}
```

**Example Request**

```bash
curl "https://yourdomain.com/wp-json/fluent-boards/v2/tasks/stage/85" \
  -u "USERNAME:APPLICATION_PASSWORD"
```

**Example Response**

```json
{
  "stage": {
    "id": 25,
    "board_id": 3,
    "title": "Doing",
    "position": "2.00"
  }
}
```

Returns `404` "Task not found" when the task does not exist or you have no access.

## List Boards by Type

Returns your non-archived boards of the given type, oldest first.

```http
GET /wp-json/fluent-boards/v2/tasks/boards-by-type/{type}
```

`{type}` is a board type such as `to-do` or `roadmap`.

**Example Request**

```bash
curl "https://yourdomain.com/wp-json/fluent-boards/v2/tasks/boards-by-type/roadmap" \
  -u "USERNAME:APPLICATION_PASSWORD"
```

**Example Response**

```json
{
  "boards": [
    { "id": 7, "title": "Product Roadmap", "type": "roadmap" }
  ]
}
```

## Get Task Tab Configuration

Returns the current user's dashboard task tabs (order and visibility). Defaults are returned when nothing is saved; missing tabs are merged in. Labels are always translated server-side.

```http
GET /wp-json/fluent-boards/v2/tasks/task-tabs/config
```

**Example Request**

```bash
curl "https://yourdomain.com/wp-json/fluent-boards/v2/tasks/task-tabs/config" \
  -u "USERNAME:APPLICATION_PASSWORD"
```

**Example Response**

```json
{
  "data": [
    { "name": "due_today", "label": "Due Today", "visible": "true", "order": 1 },
    { "name": "assigned", "label": "Assigned", "visible": "true", "order": 2 },
    { "name": "upcoming", "label": "Upcoming", "visible": "true", "order": 3 },
    { "name": "overdue", "label": "Overdue", "visible": "true", "order": 4 },
    { "name": "mentioned", "label": "Mentioned", "visible": "true", "order": 5 },
    { "name": "completed", "label": "Completed", "visible": "true", "order": 6 },
    { "name": "others", "label": "Others", "visible": "true", "order": 7 }
  ]
}
```

## Save Task Tab Configuration

Saves the current user's task tabs. At least one tab must be visible.

```http
POST /wp-json/fluent-boards/v2/tasks/task-tabs/config
```

**Parameters**

| Parameter | Type | Required | Description |
|---|---|---|---|
| `tabs` | array | Yes | List of `{ name, label, visible, order }` objects. `name` is one of `due_today`, `assigned`, `upcoming`, `overdue`, `mentioned`, `completed`, `others`; `visible` is the string `"true"` or `"false"` |

**Example Request**

```bash
curl "https://yourdomain.com/wp-json/fluent-boards/v2/tasks/task-tabs/config" \
  -X POST \
  -u "USERNAME:APPLICATION_PASSWORD" \
  -H "Content-Type: application/json" \
  -d '{
    "tabs": [
      { "name": "assigned", "label": "Assigned", "visible": "true", "order": 1 },
      { "name": "overdue", "label": "Overdue", "visible": "true", "order": 2 },
      { "name": "others", "label": "Others", "visible": "false", "order": 3 }
    ]
  }'
```

**Example Response**

```json
{
  "message": "Configuration saved successfully",
  "config": [
    { "name": "assigned", "label": "Assigned", "visible": "true", "order": 1 },
    { "name": "overdue", "label": "Overdue", "visible": "true", "order": 2 },
    { "name": "others", "label": "Others", "visible": "false", "order": 3 }
  ]
}
```

Returns `400` "Invalid data format" or "At least one tab must be visible".

## Global Search

Searches top-level tasks and boards by title. Boards and tasks are paginated separately: a section is only searched when its page parameter is sent.

```http
GET /wp-json/fluent-boards/v2/global-search
```

**Parameters**

| Parameter | Type | Required | Description |
|---|---|---|---|
| `query` | string | No | Search text. Prefix `id:` to match IDs, `archived:` to search archived tasks and boards |
| `scope` | string | No | `all` (default) or a board ID to search tasks of one board only (boards are not returned) |
| `task_page` | integer | No | Task page; omit to skip tasks |
| `board_page` | integer | No | Board page; omit to skip boards |
| `per_page` | integer | No | Page size for both sections, 1–100 (default 20) |

**Example Request**

```bash
curl "https://yourdomain.com/wp-json/fluent-boards/v2/global-search?query=login&task_page=1&board_page=1&per_page=10" \
  -u "USERNAME:APPLICATION_PASSWORD"
```

**Example Response**

```json
{
  "tasks": {
    "data": [
      {
        "type": "task",
        "id": 85,
        "title": "Fix login bug",
        "description": "Users cannot log in on Safari",
        "board_id": 3,
        "board": { "id": 3, "title": "Website", "url": "https://yourdomain.com/wp-admin/admin.php?page=fluent-boards#/boards/3" },
        "stage": { "id": 25, "title": "Doing" }
      }
    ],
    "current_page": 1,
    "per_page": 10,
    "total": 1,
    "last_page": 1
  },
  "boards": {
    "data": [
      { "type": "board", "id": 9, "title": "Login revamp", "description": "" }
    ],
    "current_page": 1,
    "per_page": 10,
    "total": 1,
    "last_page": 1
  }
}
```

Tasks on archived boards are skipped from `tasks.data` (but still counted in `tasks.total`).

## Get Selector Options

Returns options for searchable selector inputs.

```http
GET /wp-json/fluent-boards/v2/ajax-options
```

**Parameters**

| Parameter | Type | Required | Description |
|---|---|---|---|
| `option_key` | string | Yes | Which list to return (see below) |
| `search` | string | No | Search text |
| `board_id` | integer | Depends | Board context for `users`, `task_assignees`, `tasks`, `assigned_in_task` |
| `values` | array | No | Pre-selected values, passed to custom option filters |

`option_key` values:

| Key | Returns | Requirement |
|---|---|---|
| `users`, `task_assignees` | WordPress users (`users` adds `is_admin`) | Board manager of `board_id` |
| `board_create_users` | Users who can be added to a new board (emails masked without `list_users`) | Board creation permission |
| `boards` | Up to 20 of your boards | — |
| `tasks` | Up to 20 open top-level tasks of `board_id`, with `subtask_groups` | Access to `board_id` |
| `assigned_in_task` | Users assigned to tasks on `board_id` (emails masked without `list_users`) | Access to `board_id` |
| any other | Result of the `fluent_boards/ajax_options_{option_key}` filter | — |

**Example Request**

```bash
curl "https://yourdomain.com/wp-json/fluent-boards/v2/ajax-options?option_key=tasks&board_id=3&search=login" \
  -u "USERNAME:APPLICATION_PASSWORD"
```

**Example Response**

```json
{
  "options": [
    { "id": 85, "title": "Fix login bug", "board_id": 3, "subtask_groups": [] }
  ]
}
```

User options have the shape `{ "id", "email", "name", "title", "photo" }`; board options `{ "id", "title", "left_side_value", "right_side_value" }`. Permission failures return `404` with a message.

## Get View Settings

Returns the current user's display preferences for a view. Defaults are stored on first read.

```http
GET /wp-json/fluent-boards/v2/get-dashboard-view-settings
```

**Parameters**

| Parameter | Type | Required | Description |
|---|---|---|---|
| `view` | string | Yes | `kanbanview`, `listview` or `tableview` |

**Example Request**

```bash
curl "https://yourdomain.com/wp-json/fluent-boards/v2/get-dashboard-view-settings?view=kanbanview" \
  -u "USERNAME:APPLICATION_PASSWORD"
```

**Example Response**

```json
{
  "currentSettings": {
    "dashboard_view_label": true,
    "dashboard_view_priority": true,
    "dashboard_view_assignee": true,
    "dashboard_view_subtask": true,
    "dashboard_view_attachment": true,
    "dashboard_view_due_date": true,
    "dashboard_view_comment": true,
    "dashboard_view_notification": true
  }
}
```

`kanbanview` and `listview` use the `dashboard_view_*` keys above. `tableview` uses `table_view_priority`, `table_view_status`, `table_view_dates`, `table_view_assignees`, `table_view_labels`, `table_view_created_at`, `table_view_subtasks`, `table_view_activity`. An unknown `view` returns `400` "Invalid view type".

## Update View Settings

Replaces the current user's preferences for a view. Every value is stored as a boolean: `true` or `"true"` becomes `true`, anything else `false`. Send the full set of keys.

```http
PUT /wp-json/fluent-boards/v2/update-dashboard-view-settings
```

**Parameters**

| Parameter | Type | Required | Description |
|---|---|---|---|
| `view` | string | Yes | `listview`, `tableview`, or anything else for the card (kanban) view |
| `updatedSettings` | object | Yes | Key/value map of the view's settings |

**Example Request**

```bash
curl "https://yourdomain.com/wp-json/fluent-boards/v2/update-dashboard-view-settings" \
  -X PUT \
  -u "USERNAME:APPLICATION_PASSWORD" \
  -H "Content-Type: application/json" \
  -d '{
    "view": "tableview",
    "updatedSettings": {
      "table_view_priority": true,
      "table_view_status": true,
      "table_view_dates": true,
      "table_view_assignees": true,
      "table_view_labels": false,
      "table_view_created_at": true,
      "table_view_subtasks": false,
      "table_view_activity": false
    }
  }'
```

**Example Response** (`201`)

```json
{
  "message": "Table view settings updated successfully"
}
```

::: warning
The settings row must already exist. Call [Get View Settings](#get-view-settings) for the same `view` first; otherwise the update fails with a server error.
:::

## List Board CRM Contacts

Returns the FluentCRM contacts linked to tasks of a board, sorted by name. Requires access to the board and FluentCRM to be active.

```http
GET /wp-json/fluent-boards/v2/contacts/{board_id}
```

**Example Request**

```bash
curl "https://yourdomain.com/wp-json/fluent-boards/v2/contacts/3" \
  -u "USERNAME:APPLICATION_PASSWORD"
```

**Example Response**

```json
[
  {
    "id": 42,
    "display_name": "Jane Smith",
    "email": "jane@example.com",
    "photo": "https://secure.gravatar.com/avatar/abc?s=128&d=mm&r=g"
  }
]
```

The response is a plain array (empty when no task has a contact).

## List Members for Pickers

Returns users for member pickers: members of one board, or of all your boards, plus all WordPress administrators. Sorted by name.

```http
GET /wp-json/fluent-boards/v2/options/members
```

**Parameters**

| Parameter | Type | Required | Description |
|---|---|---|---|
| `boardId` | integer | No | Limit to members of this board (you need access to it) |

**Example Request**

```bash
curl "https://yourdomain.com/wp-json/fluent-boards/v2/options/members?boardId=3" \
  -u "USERNAME:APPLICATION_PASSWORD"
```

**Example Response**

```json
{
  "members": [
    { "ID": 1, "display_name": "John Doe", "photo": "https://secure.gravatar.com/avatar/abc?s=96&d=mm&r=g" },
    { "ID": 5, "display_name": "Jane Smith", "photo": "https://secure.gravatar.com/avatar/def?s=96&d=mm&r=g" }
  ]
}
```

## List Boards for Pickers

Returns every board you can access (`id`, `title`, `type`), sorted by title.

```http
GET /wp-json/fluent-boards/v2/options/projects
```

**Example Request**

```bash
curl "https://yourdomain.com/wp-json/fluent-boards/v2/options/projects" \
  -u "USERNAME:APPLICATION_PASSWORD"
```

**Example Response**

```json
{
  "boards": [
    { "id": 7, "title": "Product Roadmap", "type": "roadmap" },
    { "id": 3, "title": "Website", "type": "to-do" }
  ]
}
```

See [Common Error Responses](/rest-api/shared/error-responses) for standard error formats.
