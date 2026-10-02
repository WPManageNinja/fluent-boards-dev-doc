# Tasks

The Tasks API manages tasks inside a board: listing and filtering, creating, updating single properties, moving, pinning, cloning, archiving, bulk operations and cover images. Task dependencies and recurring tasks (Pro) are documented at the end of this page. Plugin source: free (dependencies and recurring tasks: Pro).

All routes on this page use the board-level permission check: any board member can read, and board members who are not "viewer only" can write. Exceptions are noted per endpoint.

Subtasks, comments and attachments have their own pages: [Subtasks](/rest-api/subtasks), [Comments](/rest-api/comments), [Attachments](/rest-api/attachments). Cross-board task utilities (dashboard lists, task tabs, global search) are on [Dashboard & Global Utilities](/rest-api/dashboard).

## Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/projects/{board_id}/tasks` | List all tasks of a board |
| GET | `/projects/{board_id}/tasks/by-stage` | First page of tasks for every stage |
| GET | `/projects/{board_id}/tasks/stage-page` | Cursor-paginated tasks of one stage |
| GET | `/projects/{board_id}/tasks/filtered` | Filtered board tasks |
| GET | `/projects/{board_id}/tasks/table` | Paginated, sortable table view |
| GET | `/projects/{board_id}/archived-tasks` | List archived tasks |
| GET | `/projects/{board_id}/tasks/archived` | List archived tasks (alias) |
| GET | `/projects/{board_id}/tasks/{task_id}` | Get a single task |
| POST | `/projects/{board_id}/tasks` | Create a task |
| POST | `/projects/{board_id}/tasks/create-task-from-image` | Create a task from an uploaded image |
| PUT | `/projects/{board_id}/tasks/{task_id}` | Update one task property |
| POST | `/projects/{board_id}/tasks/{task_id}/dates` | Update start/due/reminder dates |
| PUT | `/projects/{board_id}/tasks/{task_id}/move-task` | Move a task to a stage, position or board |
| PUT | `/projects/{board_id}/tasks/{task_id}/move-to-next-stage` | Move a task to the next stage |
| PUT | `/projects/{board_id}/tasks/{task_id}/pin` | Pin or unpin a task |
| POST | `/projects/{board_id}/tasks/{task_id}/clone-task` | Clone a task |
| POST | `/projects/{board_id}/tasks/{task_id}/assign-yourself` | Toggle yourself as assignee |
| POST | `/projects/{board_id}/tasks/{task_id}/detach-yourself` | Toggle yourself as assignee |
| POST | `/projects/{board_id}/tasks/bulk-actions` | Run a bulk action on tasks |
| PUT | `/projects/{board_id}/bulk-restore-tasks` | Restore archived tasks in bulk |
| DELETE | `/projects/{board_id}/bulk-delete-tasks` | Delete tasks in bulk |
| DELETE | `/projects/{board_id}/tasks/{task_id}` | Delete a task |
| POST | `/projects/{board_id}/tasks/{task_id}/task-cover-image-upload` | Upload a cover image |
| POST | `/projects/{board_id}/tasks/{task_id}/remove-task-cover` | Remove the cover |
| POST | `/projects/{board_id}/tasks/update-cover-photo/{task_id}` | Set the task logo (`settings.logo`) |
| POST | `/projects/{board_id}/tasks/status-update/{task_id}` | Set `settings.integration_type` |
| POST | `/projects/{board_id}/tasks/{task_id}/wp-editor-media-file-upload` | Upload a file for the description editor |
| DELETE | `/projects/{board_id}/tasks/{task_id}/support-ticket` | Unlink a Fluent Support ticket |
| GET | `/projects/{board_id}/tasks/{task_id}/activities` | Task activity log |
| GET | `/projects/{board_id}/dependencies` | All dependencies of a board (Pro) |
| GET | `/projects/{board_id}/tasks/{task_id}/dependencies` | Predecessors and successors of a task (Pro) |
| POST | `/projects/{board_id}/tasks/{task_id}/dependencies` | Add a dependency (Pro) |
| DELETE | `/projects/{board_id}/tasks/{task_id}/dependencies/{related_task_id}` | Remove a dependency (Pro) |
| POST | `/projects/{board_id}/tasks/{task_id}/create-repeat-task` | Create or update a recurring rule (Pro) |
| DELETE | `/projects/{board_id}/tasks/{task_id}/remove-repeat-task` | Stop a recurring task (Pro) |

## Task Object

Tasks are rows of `fbs_tasks`. Key fields:

| Field | Type | Description |
|---|---|---|
| `id` | integer | Task ID |
| `parent_id` | integer\|null | Parent task ID (set for subtasks) |
| `board_id` | integer | Board ID |
| `stage_id` | integer\|null | Stage ID (`null` for subtasks) |
| `crm_contact_id` | integer\|null | Linked FluentCRM contact |
| `title`, `slug` | string | Title and slug |
| `type` | string | `task`, or `roadmap` on roadmap boards |
| `status` | string | `open` or `closed` |
| `priority` | string | `low`, `medium`, `high`, `urgent`, or empty |
| `description` | string | Description (HTML) |
| `position` | number | Sort position inside the stage |
| `started_at`, `due_at`, `remind_at` | string\|null | Dates (`Y-m-d H:i:s`) |
| `reminder_type` | string\|null | Reminder preset (Pro) |
| `last_completed_at`, `archived_at` | string\|null | Completion / archive timestamps |
| `source`, `source_id` | string\|null | Origin of the task (for example a Fluent Support ticket) |
| `settings` | object | Cover, counters (`subtask_count`, `attachment_count`, `subtask_completed_count`) and integration data |
| `meta` | object | Appended task meta (for example `is_template`, `subtask_group_id`) |
| `repeat_task_meta` | object\|null | Appended recurring rule (Pro) |
| `is_pinned` | boolean | Appended pin state |

List endpoints also add computed keys such as `isOverdue`, `isUpcoming`, `is_watching`, `notifications` (unread count), `assignees`, `labels` and `watchers`.

## List Tasks

Returns every top-level task (no subtasks) in the board's active stages, ordered by `due_at`. `synced_at` is the server time captured before the read; pass it later as `last_boards_updated` to [Move a Task](#move-a-task) to fetch incremental changes.

```http
GET /wp-json/fluent-boards/v2/projects/{board_id}/tasks
```

**Parameters**

| Parameter | Type | Required | Description |
|---|---|---|---|
| `include_archived` | boolean | No | Include archived tasks and archived stages (default `false`) |

**Example Request**

```bash
curl "https://yourdomain.com/wp-json/fluent-boards/v2/projects/3/tasks" \
  -u "USERNAME:APPLICATION_PASSWORD"
```

**Example Response**

```json
{
  "tasks": [
    {
      "id": 1,
      "title": "Design Homepage",
      "slug": "design-homepage",
      "board_id": 3,
      "stage_id": 30,
      "status": "closed",
      "priority": "low",
      "position": "17.00",
      "created_by": 1,
      "meta": {
        "is_template": "no"
      },
      "isOverdue": false,
      "isUpcoming": false,
      "is_watching": true,
      "notifications": 0,
      "assignees": [],
      "labels": [],
      "watchers": []
    }
  ],
  "synced_at": "2025-08-06 09:36:40"
}
```

## List Tasks by Stage

Returns the first 20 tasks of every active stage plus per-stage cursor information. Use [Get a Stage Page](#get-a-stage-page) to load more.

```http
GET /wp-json/fluent-boards/v2/projects/{board_id}/tasks/by-stage
```

**Parameters**

| Parameter | Type | Required | Description |
|---|---|---|---|
| `include_archived` | boolean | No | Include archived tasks and stages |

**Example Request**

```bash
curl "https://yourdomain.com/wp-json/fluent-boards/v2/projects/3/tasks/by-stage" \
  -u "USERNAME:APPLICATION_PASSWORD"
```

**Example Response**

```json
{
  "tasks": [
    { "id": 12, "title": "Write copy", "stage_id": 25, "position": "1.00" }
  ],
  "pagination_by_stage": {
    "25": {
      "stage_id": 25,
      "total_count": 34,
      "limit": 20,
      "direction": "next",
      "cursor": null,
      "has_more": true,
      "has_more_before": false,
      "has_more_after": true,
      "start_cursor": 1,
      "end_cursor": 20
    }
  },
  "synced_at": "2025-08-06 09:36:40"
}
```

## Get a Stage Page

Cursor-based pagination of the tasks in a single stage. The cursor is a task `position`.

```http
GET /wp-json/fluent-boards/v2/projects/{board_id}/tasks/stage-page
```

**Parameters**

| Parameter | Type | Required | Description |
|---|---|---|---|
| `stage_id` | integer | Yes | Stage to read (must belong to the board) |
| `limit` | integer | No | Page size, 1–100 (default 20) |
| `direction` | string | No | `next` (positions after the cursor, default) or `prev` |
| `cursor` | number | No | Position to page from; omit for the first page |
| `include_archived` | boolean | No | Include archived tasks |

**Example Request**

```bash
curl "https://yourdomain.com/wp-json/fluent-boards/v2/projects/3/tasks/stage-page?stage_id=25&cursor=20&limit=20" \
  -u "USERNAME:APPLICATION_PASSWORD"
```

**Example Response**

```json
{
  "tasks": [
    { "id": 40, "title": "Review copy", "stage_id": 25, "position": "21.00" }
  ],
  "pagination": {
    "stage_id": 25,
    "limit": 20,
    "direction": "next",
    "cursor": 20,
    "has_more": false,
    "has_more_before": true,
    "has_more_after": false,
    "start_cursor": 21,
    "end_cursor": 34
  }
}
```

Errors: `400` "Invalid Stage" when `stage_id` is missing, `400` "Invalid direction", `404` "Stage not found".

## Filter Board Tasks

Returns all top-level tasks that match the filters, ordered by stage and position. Array filters accept either an array or a single value.

```http
GET /wp-json/fluent-boards/v2/projects/{board_id}/tasks/filtered
```

**Parameters**

| Parameter | Type | Required | Description |
|---|---|---|---|
| `search` | string | No | Title search. `id:123` searches by task ID |
| `include_archived` | boolean | No | Include archived tasks |
| `stage` | array | No | Stage IDs; `archived` matches tasks in archived stages |
| `task_status` | array | No | `open`, `closed`, `archived` |
| `priority` | array | No | `low`, `medium`, `high`, `urgent`; an empty string matches "no priority" |
| `assignee` | array | No | User IDs; `no-assignee` matches unassigned tasks |
| `labels` | array | No | Label IDs; `no-label` matches tasks without labels |
| `watchers` | array | No | User IDs |
| `contact` | array | No | FluentCRM contact IDs |
| `custom_fields` | array | No | Custom field IDs (tasks that have a value); `no-custom-field` |
| `due_date` | array | No | `overdue`, `no-dates`, `today`, `this-week`, `next-week`, `this-month`, `upcoming` |

**Example Request**

```bash
curl -G "https://yourdomain.com/wp-json/fluent-boards/v2/projects/3/tasks/filtered" \
  --data-urlencode "priority[]=high" \
  --data-urlencode "due_date[]=overdue" \
  -u "USERNAME:APPLICATION_PASSWORD"
```

**Example Response**

```json
{
  "tasks": [
    { "id": 85, "title": "Fix login bug", "priority": "high", "isOverdue": true }
  ]
}
```

## List Table Tasks

Paginated, sortable variant of [Filter Board Tasks](#filter-board-tasks) used by the table view. Accepts every filter of that endpoint plus the parameters below.

```http
GET /wp-json/fluent-boards/v2/projects/{board_id}/tasks/table
```

**Parameters**

| Parameter | Type | Required | Description |
|---|---|---|---|
| `page` | integer | No | Page number (default 1) |
| `per_page` | integer | No | Items per page, 1–150 (default 20) |
| `sort_by` | string | No | `title`, `status`, `stage_id`, `priority`, `due_at`, `created_at`, `updated_at`, `position` (default); `vote_statistics` on roadmap boards |
| `sort_direction` | string | No | `asc` (default) or `desc` |

**Example Request**

```bash
curl "https://yourdomain.com/wp-json/fluent-boards/v2/projects/3/tasks/table?page=1&per_page=20&sort_by=due_at&sort_direction=desc" \
  -u "USERNAME:APPLICATION_PASSWORD"
```

**Example Response**

```json
{
  "items": [
    { "id": 85, "title": "Fix login bug", "status": "open", "due_at": "2025-08-10 17:00:00" }
  ],
  "pagination": {
    "total": 42,
    "current_page": 1,
    "per_page": 20,
    "last_page": 3
  }
}
```

## List Archived Tasks

Returns archived tasks of the board, newest first, with who archived them. Both paths run the same handler.

```http
GET /wp-json/fluent-boards/v2/projects/{board_id}/archived-tasks
GET /wp-json/fluent-boards/v2/projects/{board_id}/tasks/archived
```

**Parameters**

| Parameter | Type | Required | Description |
|---|---|---|---|
| `page` | integer | No | Page number (default 1) |
| `per_page` | integer | No | Items per page, 1–50 (default 20) |
| `searchInput` | string | No | Title search; `id:123` searches by ID |

**Example Request**

```bash
curl "https://yourdomain.com/wp-json/fluent-boards/v2/projects/3/archived-tasks?page=1&per_page=20" \
  -u "USERNAME:APPLICATION_PASSWORD"
```

**Example Response**

```json
{
  "tasks": {
    "current_page": 1,
    "data": [
      {
        "id": 77,
        "title": "Old campaign",
        "archived_at": "2025-07-01 10:00:00",
        "archived_by_id": 1,
        "archived_by": { "ID": 1, "display_name": "John Doe", "photo": "https://..." },
        "assignees": []
      }
    ],
    "per_page": 20,
    "total": 1,
    "last_page": 1
  }
}
```

## Get a Task

Returns one task with its board (including `board.stages`), stage, labels, assignees, watchers, CRM contact and, with Pro, attachments. If `task_id` is a subtask, the **parent** task is returned.

```http
GET /wp-json/fluent-boards/v2/projects/{board_id}/tasks/{task_id}
```

**Example Request**

```bash
curl "https://yourdomain.com/wp-json/fluent-boards/v2/projects/3/tasks/1" \
  -u "USERNAME:APPLICATION_PASSWORD"
```

**Example Response**

```json
{
  "task": {
    "id": 1,
    "title": "Design Homepage",
    "slug": "design-homepage",
    "board_id": 3,
    "stage_id": 25,
    "status": "open",
    "priority": "low",
    "description": "<p>Create new homepage design</p>",
    "created_by": 1,
    "position": "23.00",
    "settings": {
      "subtask_count": 5,
      "attachment_count": 1,
      "subtask_completed_count": 2
    },
    "due_at": "2025-07-04 23:45:00",
    "isOverdue": true,
    "is_watching": true,
    "contact": null,
    "nextStage": "In Progress",
    "meta": {
      "is_template": "no"
    },
    "assignees": [
      { "ID": 1, "display_name": "John Doe", "photo": "https://..." }
    ],
    "watchers": [],
    "attachments": [
      { "id": 24, "title": "document.csv", "file_size": "2 KB" }
    ],
    "board": {
      "id": 3,
      "title": "Sample Board",
      "type": "to-do",
      "stages": []
    },
    "stage": {
      "id": 25,
      "title": "Planned"
    },
    "labels": [
      { "id": 38, "title": "later", "bg_color": "#658ca5" }
    ]
  }
}
```

On roadmap boards the task also has `vote_statistics`.

## Create a Task

Creates a top-level task. All fields go inside a `task` object. The task `status` is taken from the target stage's default status, and the task is added at the end of the stage.

```http
POST /wp-json/fluent-boards/v2/projects/{board_id}/tasks
```

**Parameters**

| Parameter | Type | Required | Description |
|---|---|---|---|
| `task[title]` | string | Yes | Task title |
| `task[board_id]` | integer | Yes | Must equal `{board_id}` in the path |
| `task[stage_id]` | integer | Yes | Stage ID on this board |
| `task[priority]` | string | No | `low`, `medium`, `high`, `urgent` (empty by default) |
| `task[crm_contact_id]` | integer | No | FluentCRM contact ID |
| `task[is_template]` | string | No | `yes` to mark the task as a template |
| `task[description]` | string | No | Description (HTML or Markdown) |
| `task[assignees]` | array | No | User IDs to assign (they also become watchers) |
| `task[labels]` | array | No | Label IDs |
| `task[due_at]` | string | No | Due date `Y-m-d H:i:s` |
| `task[started_at]` | string | No | Start date `Y-m-d H:i:s` |
| `task[settings][cover][backgroundColor]` | string | No | Hex cover color |
| `task[position]` | integer | No | Position to move the new task to |

**Example Request**

```bash
curl "https://yourdomain.com/wp-json/fluent-boards/v2/projects/10/tasks" \
  -X POST \
  -u "USERNAME:APPLICATION_PASSWORD" \
  -H "Content-Type: application/json" \
  -d '{
    "task": {
      "title": "New Task",
      "board_id": 10,
      "stage_id": 104,
      "priority": "high",
      "assignees": [1],
      "is_template": "no"
    }
  }'
```

**Example Response** (`201`)

```json
{
  "task": {
    "id": 281,
    "title": "New Task",
    "slug": "new-task",
    "board_id": 10,
    "stage_id": 104,
    "status": "open",
    "priority": "high",
    "position": 1,
    "created_by": 1,
    "type": "task",
    "settings": null,
    "meta": [],
    "repeat_task_meta": null,
    "assignees": [],
    "labels": [],
    "board": {}
  },
  "message": "Task has been successfully created",
  "updatedTasks": []
}
```

`updatedTasks` contains tasks on the board that changed in the last minute. On roadmap boards the message is "Idea has been successfully created".

## Create a Task from an Image

Uploads an image and creates a task from it in the given stage.

```http
POST /wp-json/fluent-boards/v2/projects/{board_id}/tasks/create-task-from-image
```

**Parameters**

| Parameter | Type | Required | Description |
|---|---|---|---|
| `stage_id` | integer | Yes | Stage on this board |
| `file` | file | Yes | Image file (multipart) |

**Example Request**

```bash
curl "https://yourdomain.com/wp-json/fluent-boards/v2/projects/3/tasks/create-task-from-image" \
  -X POST \
  -u "USERNAME:APPLICATION_PASSWORD" \
  -F "stage_id=25" \
  -F "file=@/path/to/screenshot.png"
```

**Example Response**

```json
{
  "task": { "id": 290, "title": "screenshot.png", "stage_id": 25 },
  "updatedTasks": [],
  "message": "Task has been created"
}
```

## Update a Task Property

Updates **one** property per request. Send the property name in `property` and the new value in `value`.

```http
PUT /wp-json/fluent-boards/v2/projects/{board_id}/tasks/{task_id}
```

**Parameters**

| Parameter | Type | Required | Description |
|---|---|---|---|
| `property` | string | Yes | Name of the property to change (see table below) |
| `value` | mixed | Depends | New value; format depends on `property` |

**Accepted properties**

Any other `property` returns an "Invalid property" error.

| `property` | `value` | Behavior |
|---|---|---|
| `title` | string (required) | Renames the task |
| `description` | string | Replaces the description (HTML/Markdown, sanitized) |
| `status` | `open` \| `closed` | `closed` completes the task; any other value reopens it |
| `last_completed_at` | `"true"` \| `"false"` | `"true"` completes the task, anything else reopens it |
| `priority` | string | `low`, `medium`, `high`, `urgent` or empty |
| `due_at` | `Y-m-d H:i:s` \| `null` | Sets or clears the due date. Changing it **reopens** a closed task |
| `started_at` | `Y-m-d H:i:s` \| `null` | Sets or clears the start date (always `null` for subtasks) |
| `remind_at` | `Y-m-d H:i:s` \| `null` | Reminder time |
| `reminder_type` | string | Pro only. One of `30_minutes_before`, `1_hour_before`, `2_hours_before`, `1_day_before`, `2_days_before`, `1_week_before`; unknown values clear it |
| `assignees` | integer or integer[] | **Toggles** each user ID: adds it if not assigned, removes it if already assigned |
| `is_watching` | `start` \| `stop`, or `{ "userId": 5, "action": "start" }` | Starts/stops watching for the current user, or for `userId` |
| `crm_contact_id` | integer \| `null` | Links or unlinks a FluentCRM contact |
| `archived_at` | any non-empty value \| `null` | Non-empty archives the task (timestamp set by the server); `null`/empty restores it (fails if its stage is archived) |
| `parent_id` | integer | Makes the task a subtask of another task on the same board |
| `is_template` | `yes` \| `no` | Pro only. Marks the task as a template |
| `settings` | object | **Replaces** the whole `settings` object. Setting `cover.backgroundColor` removes any cover image |
| `type` | string | Sets the task type |
| `source` | string | Sets the source column |
| `log_minutes` | integer | Sets the logged minutes column |
| `board_id` | integer | Must equal the current board; it cannot move the task (use [Move a Task](#move-a-task)) |
| `stage_id` | integer | Validated (must be a stage on this board) but **not applied**; use [Move a Task](#move-a-task) |
| `lead_value`, `scope`, `start_at`, `last_completed` | — | Accepted by validation but ignored |

**Example Request**

```bash
curl "https://yourdomain.com/wp-json/fluent-boards/v2/projects/10/tasks/281" \
  -X PUT \
  -u "USERNAME:APPLICATION_PASSWORD" \
  -H "Content-Type: application/json" \
  -d '{
    "property": "title",
    "value": "Updated Task Title"
  }'
```

Toggle two assignees:

```bash
curl "https://yourdomain.com/wp-json/fluent-boards/v2/projects/10/tasks/281" \
  -X PUT \
  -u "USERNAME:APPLICATION_PASSWORD" \
  -H "Content-Type: application/json" \
  -d '{ "property": "assignees", "value": [2, 5] }'
```

**Example Response**

```json
{
  "message": "Task has been updated",
  "task": {
    "id": 281,
    "title": "Updated Task Title",
    "slug": "new-task",
    "board_id": 10,
    "stage_id": 104,
    "status": "open",
    "priority": "low",
    "isOverdue": false,
    "isUpcoming": false,
    "contact": null,
    "is_watching": true,
    "assignees": [],
    "labels": [],
    "board": {},
    "updated_at": "2025-08-06T08:29:04+00:00"
  },
  "updatedTasks": []
}
```

For subtasks the returned task also has `subtask_group_id`; for `is_watching` it includes `watchers`.

## Update Task Dates

Updates start date, due date and reminder fields in one call. Only the keys present in the body are changed. For top-level tasks, if `started_at` is after `due_at`, the start date is moved to the start of the due day. Subtasks never keep a start date.

```http
POST /wp-json/fluent-boards/v2/projects/{board_id}/tasks/{task_id}/dates
```

**Parameters**

| Parameter | Type | Required | Description |
|---|---|---|---|
| `started_at` | string\|null | No | Start date `Y-m-d H:i:s` |
| `due_at` | string\|null | No | Due date `Y-m-d H:i:s` |
| `reminder_type` | string\|null | No | Reminder preset (see [Update a Task Property](#update-a-task-property)) |
| `remind_at` | string\|null | No | Reminder time |

**Example Request**

```bash
curl "https://yourdomain.com/wp-json/fluent-boards/v2/projects/3/tasks/85/dates" \
  -X POST \
  -u "USERNAME:APPLICATION_PASSWORD" \
  -H "Content-Type: application/json" \
  -d '{ "started_at": "2025-08-01 00:00:00", "due_at": "2025-08-10 17:00:00" }'
```

**Example Response**

```json
{
  "task": { "id": 85, "started_at": "2025-08-01 00:00:00", "due_at": "2025-08-10 17:00:00" },
  "message": "Dates have been updated",
  "updatedTasks": []
}
```

## Move a Task

Moves a task to another stage, another position, or another board. Position the task either with neighbour IDs (`prevTaskId` / `nextTaskId`, preferred) or with a 1-based `newIndex`.

```http
PUT /wp-json/fluent-boards/v2/projects/{board_id}/tasks/{task_id}/move-task
```

**Parameters**

| Parameter | Type | Required | Description |
|---|---|---|---|
| `newStageId` | integer | Yes | Target stage (must belong to the target board) |
| `newIndex` | integer | Conditional | 1-based position; required when no neighbour IDs are sent |
| `prevTaskId` | integer | No | Task that should end up just before the moved task |
| `nextTaskId` | integer | No | Task that should end up just after the moved task |
| `newBoardId` | integer | No | Target board for a cross-board move; you need write access to it |
| `last_boards_updated` | string | No | Timestamp (for example a previous `synced_at` / `last_updated`) for the `updatedTasks` window |

Moving to a stage whose default status is closed completes the task, and the stage's default assignees are applied.

**Example Request**

```bash
curl "https://yourdomain.com/wp-json/fluent-boards/v2/projects/3/tasks/282/move-task" \
  -X PUT \
  -u "USERNAME:APPLICATION_PASSWORD" \
  -H "Content-Type: application/json" \
  -d '{
    "newStageId": 96,
    "newIndex": 1,
    "newBoardId": 9
  }'
```

**Example Response**

```json
{
  "message": "Task has been updated",
  "task": {
    "id": 282,
    "parent_id": null,
    "board_id": 9,
    "title": "New task",
    "slug": "new-task",
    "type": "task",
    "status": "open",
    "stage_id": 96,
    "position": 1
  },
  "updatedTasks": [],
  "last_updated": "2025-08-06 09:36:40"
}
```

## Move a Task to the Next Stage

Moves the task to the stage with the next higher position. If the next stage closes tasks by default, the task is completed. Nothing changes when the task is already in the last stage.

```http
PUT /wp-json/fluent-boards/v2/projects/{board_id}/tasks/{task_id}/move-to-next-stage
```

**Example Request**

```bash
curl "https://yourdomain.com/wp-json/fluent-boards/v2/projects/3/tasks/85/move-to-next-stage" \
  -X PUT \
  -u "USERNAME:APPLICATION_PASSWORD"
```

**Example Response**

```json
{
  "task": {
    "id": 85,
    "stage_id": 26,
    "nextStage": "Done",
    "board": {},
    "stage": {},
    "attachments": []
  }
}
```

## Pin or Unpin a Task

Pins or unpins a top-level task. Subtasks cannot be pinned (`400`).

```http
PUT /wp-json/fluent-boards/v2/projects/{board_id}/tasks/{task_id}/pin
```

**Parameters**

| Parameter | Type | Required | Description |
|---|---|---|---|
| `pinned` | boolean | Yes | `true` / `"1"` to pin, `false` / `"0"` to unpin |

**Example Request**

```bash
curl "https://yourdomain.com/wp-json/fluent-boards/v2/projects/3/tasks/85/pin" \
  -X PUT \
  -u "USERNAME:APPLICATION_PASSWORD" \
  -H "Content-Type: application/json" \
  -d '{ "pinned": true }'
```

**Example Response**

```json
{
  "task": { "id": 85, "is_pinned": true },
  "message": "Task has been pinned",
  "updatedTasks": []
}
```

## Clone a Task

Creates a copy of a task. Boolean flags accept `true`/`false` or `"true"`/`"false"`.

```http
POST /wp-json/fluent-boards/v2/projects/{board_id}/tasks/{task_id}/clone-task
```

**Parameters**

| Parameter | Type | Required | Description |
|---|---|---|---|
| `title` | string | Yes | Title for the cloned task |
| `stage_id` | integer | Yes | Target stage ID |
| `assignee` | boolean | Yes | Copy assignees |
| `subtask` | boolean | Yes | Copy subtasks (Pro) |
| `label` | boolean | Yes | Copy labels |
| `attachment` | boolean | Yes | Copy attachments (Pro) |
| `comment` | boolean | Yes | Copy comments |

**Example Request**

```bash
curl "https://yourdomain.com/wp-json/fluent-boards/v2/projects/3/tasks/1/clone-task" \
  -X POST \
  -u "USERNAME:APPLICATION_PASSWORD" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Design Homepage (Cloned)",
    "stage_id": 29,
    "assignee": true,
    "subtask": false,
    "label": true,
    "attachment": false,
    "comment": true
  }'
```

**Example Response**

```json
{
  "message": "Task has been cloned successfully",
  "task": { "id": 283, "title": "Design Homepage (Cloned)", "stage_id": 29 },
  "updatedTasks": []
}
```

## Assign Yourself

Toggles the current user as an assignee: adds you (and makes you a board member if needed, plus a watcher) when you are not assigned, removes you when you are.

```http
POST /wp-json/fluent-boards/v2/projects/{board_id}/tasks/{task_id}/assign-yourself
```

**Example Request**

```bash
curl "https://yourdomain.com/wp-json/fluent-boards/v2/projects/3/tasks/85/assign-yourself" \
  -X POST \
  -u "USERNAME:APPLICATION_PASSWORD"
```

**Example Response**

```json
{
  "task": {
    "id": 85,
    "is_watching": true,
    "assignees": [{ "ID": 1, "display_name": "John Doe" }]
  }
}
```

## Detach Yourself

Toggles the current user's assignment off (it uses the same toggle as [Assign Yourself](#assign-yourself), so calling it when you are not assigned adds you).

```http
POST /wp-json/fluent-boards/v2/projects/{board_id}/tasks/{task_id}/detach-yourself
```

**Example Request**

```bash
curl "https://yourdomain.com/wp-json/fluent-boards/v2/projects/3/tasks/85/detach-yourself" \
  -X POST \
  -u "USERNAME:APPLICATION_PASSWORD"
```

**Example Response**

```json
{
  "task": { "id": 85, "is_watching": false, "assignees": [] }
}
```

## Bulk Actions

Runs one action on up to 150 tasks of the board. Extra body keys (everything except `task_ids` and `action`) are passed to the action.

```http
POST /wp-json/fluent-boards/v2/projects/{board_id}/tasks/bulk-actions
```

**Parameters**

| Parameter | Type | Required | Description |
|---|---|---|---|
| `task_ids` | integer[] | Yes | Task IDs on this board (max 150) |
| `action` | string | Yes | `move_tasks` (alias `move_to_stage`), `archive_tasks`, `change_priority`, `assign_members`, `add_labels` |
| `target_stage_id` | integer | For `move_tasks` | Target stage |
| `target_board_id` | integer | No | For `move_tasks`: move to another board (needs write access; not archived) |
| `priority` | string | For `change_priority` | `low`, `medium`, `high`, `urgent` or empty |
| `user_ids` | integer[] | For `assign_members` | Users to assign (must be board members) |
| `label_ids` | integer[] | For `add_labels` | Labels to add |

**Example Request**

```bash
curl "https://yourdomain.com/wp-json/fluent-boards/v2/projects/3/tasks/bulk-actions" \
  -X POST \
  -u "USERNAME:APPLICATION_PASSWORD" \
  -H "Content-Type: application/json" \
  -d '{
    "task_ids": [85, 86, 87],
    "action": "change_priority",
    "priority": "high"
  }'
```

**Example Response**

```json
{
  "successful_tasks": [
    { "id": 85, "priority": "high" }
  ],
  "failed_tasks": [],
  "message": "3 task priorities updated successfully"
}
```

`move_tasks` responses also include `moved_to_another_board`.

## Bulk Restore Tasks

Restores archived tasks. Each task is restored independently; failures are reported per task.

```http
PUT /wp-json/fluent-boards/v2/projects/{board_id}/bulk-restore-tasks
```

**Parameters**

| Parameter | Type | Required | Description |
|---|---|---|---|
| `task_ids` | integer[] | Yes | Archived task IDs on this board |

**Example Request**

```bash
curl "https://yourdomain.com/wp-json/fluent-boards/v2/projects/3/bulk-restore-tasks" \
  -X PUT \
  -u "USERNAME:APPLICATION_PASSWORD" \
  -H "Content-Type: application/json" \
  -d '{ "task_ids": [77, 78] }'
```

**Example Response**

```json
{
  "restored_count": 1,
  "failed_count": 1,
  "updatedTasks": [],
  "failed_tasks": [
    { "id": 78, "title": "Old task", "error": "This task cannot be restored because its stage \"Backlog\" is archived. Please restore the stage first." }
  ],
  "message": "1 task restored successfully, 1 task failed"
}
```

`failed_tasks` is only present when something failed. Errors: `400` "No task IDs provided", `404` "No archived tasks found with provided IDs".

## Bulk Delete Tasks

Permanently deletes tasks, including their subtasks, relations, notifications and attachments. Requires board manager (or FluentBoards admin).

```http
DELETE /wp-json/fluent-boards/v2/projects/{board_id}/bulk-delete-tasks
```

**Parameters**

| Parameter | Type | Required | Description |
|---|---|---|---|
| `task_ids` | integer[] | Yes | Task IDs on this board |

**Example Request**

```bash
curl "https://yourdomain.com/wp-json/fluent-boards/v2/projects/3/bulk-delete-tasks" \
  -X DELETE \
  -u "USERNAME:APPLICATION_PASSWORD" \
  -H "Content-Type: application/json" \
  -d '{ "task_ids": [77, 78] }'
```

**Example Response**

```json
{
  "deleted_count": 2,
  "failed_count": 0,
  "updatedTasks": [],
  "message": "2 tasks deleted successfully"
}
```

## Delete a Task

Permanently deletes a task. Requires board manager (or FluentBoards admin).

```http
DELETE /wp-json/fluent-boards/v2/projects/{board_id}/tasks/{task_id}
```

**Example Request**

```bash
curl "https://yourdomain.com/wp-json/fluent-boards/v2/projects/3/tasks/85" \
  -X DELETE \
  -u "USERNAME:APPLICATION_PASSWORD"
```

**Example Response**

```json
{
  "updatedTasks": [],
  "message": "Task has been deleted"
}
```

## Upload a Cover Image

Uploads an image and sets it as the task cover (`settings.cover.imageId` and `settings.cover.backgroundImage`). Any previous cover image is deleted.

```http
POST /wp-json/fluent-boards/v2/projects/{board_id}/tasks/{task_id}/task-cover-image-upload
```

**Parameters**

| Parameter | Type | Required | Description |
|---|---|---|---|
| `file` | file | Yes | Image file (multipart) |

**Example Request**

```bash
curl "https://yourdomain.com/wp-json/fluent-boards/v2/projects/3/tasks/85/task-cover-image-upload" \
  -X POST \
  -u "USERNAME:APPLICATION_PASSWORD" \
  -F "file=@/path/to/cover.jpg"
```

**Example Response**

```json
{
  "message": "Image has been uploaded",
  "public_url": "https://yourdomain.com/index.php?fbs=1&fbs_type=public_url&fbs_comment_image=aaaaaaaa"
}
```

## Remove the Cover

Removes `settings.cover` and deletes the cover image file.

```http
POST /wp-json/fluent-boards/v2/projects/{board_id}/tasks/{task_id}/remove-task-cover
```

**Example Request**

```bash
curl "https://yourdomain.com/wp-json/fluent-boards/v2/projects/3/tasks/85/remove-task-cover" \
  -X POST \
  -u "USERNAME:APPLICATION_PASSWORD"
```

**Example Response**

```json
{
  "task": { "id": 85, "settings": { "subtask_count": 0 } },
  "message": "Task Cover removed successfully"
}
```

## Update the Task Logo

Stores an image URL/path in `settings.logo` (used by roadmap ideas).

```http
POST /wp-json/fluent-boards/v2/projects/{board_id}/tasks/update-cover-photo/{task_id}
```

**Parameters**

| Parameter | Type | Required | Description |
|---|---|---|---|
| `thumbnail` | string | Yes | Image URL or path |

**Example Request**

```bash
curl "https://yourdomain.com/wp-json/fluent-boards/v2/projects/3/tasks/update-cover-photo/85" \
  -X POST \
  -u "USERNAME:APPLICATION_PASSWORD" \
  -H "Content-Type: application/json" \
  -d '{ "thumbnail": "https://yourdomain.com/wp-content/uploads/logo.png" }'
```

**Example Response**

```json
{
  "message": "Task cover photo has been updated",
  "task": { "id": 85, "settings": { "logo": "https://yourdomain.com/wp-content/uploads/logo.png" } }
}
```

## Update the Integration Type

Stores a value in `settings.integration_type` (roadmap ideas use values such as `feature`).

```http
POST /wp-json/fluent-boards/v2/projects/{board_id}/tasks/status-update/{task_id}
```

**Parameters**

| Parameter | Type | Required | Description |
|---|---|---|---|
| `integrationType` | string | Yes | Value to store |

**Example Request**

```bash
curl "https://yourdomain.com/wp-json/fluent-boards/v2/projects/3/tasks/status-update/85" \
  -X POST \
  -u "USERNAME:APPLICATION_PASSWORD" \
  -H "Content-Type: application/json" \
  -d '{ "integrationType": "feature" }'
```

**Example Response**

```json
{
  "message": "Task status has been updated",
  "task": { "id": 85, "settings": { "integration_type": "feature" } }
}
```

## Upload Description Media

Uploads a file for use inside the task description editor and returns the stored file record with a `public_url`.

```http
POST /wp-json/fluent-boards/v2/projects/{board_id}/tasks/{task_id}/wp-editor-media-file-upload
```

**Parameters**

| Parameter | Type | Required | Description |
|---|---|---|---|
| `file` | file | Yes | File to upload (multipart) |

**Example Request**

```bash
curl "https://yourdomain.com/wp-json/fluent-boards/v2/projects/3/tasks/85/wp-editor-media-file-upload" \
  -X POST \
  -u "USERNAME:APPLICATION_PASSWORD" \
  -F "file=@/path/to/diagram.png"
```

**Example Response**

```json
{
  "message": "Image has been uploaded",
  "file": {
    "id": 31,
    "object_id": 85,
    "object_type": "task_description",
    "title": "diagram.png",
    "public_url": "https://yourdomain.com/index.php?fbs=1&fbs_type=public_url&fbs_comment_image=aaaaaaaa"
  }
}
```

## Unlink a Support Ticket

Removes the Fluent Support ticket link (`source` / `source_id`) from a task without deleting the ticket. Tasks without a ticket link are returned unchanged.

```http
DELETE /wp-json/fluent-boards/v2/projects/{board_id}/tasks/{task_id}/support-ticket
```

**Example Request**

```bash
curl "https://yourdomain.com/wp-json/fluent-boards/v2/projects/3/tasks/85/support-ticket" \
  -X DELETE \
  -u "USERNAME:APPLICATION_PASSWORD"
```

**Example Response**

```json
{
  "message": "Support ticket link has been removed",
  "task": { "id": 85, "source": null, "source_id": null },
  "updatedTasks": [{ "id": 85 }]
}
```

## Get Task Activities

Returns the task's activity log, 15 per page.

```http
GET /wp-json/fluent-boards/v2/projects/{board_id}/tasks/{task_id}/activities
```

**Parameters**

| Parameter | Type | Required | Description |
|---|---|---|---|
| `filter` | string | No | Sort order (`newest` or `oldest`) |
| `page` | integer | No | Page number (read by the paginator) |

**Example Request**

```bash
curl "https://yourdomain.com/wp-json/fluent-boards/v2/projects/3/tasks/85/activities" \
  -u "USERNAME:APPLICATION_PASSWORD"
```

**Example Response**

```json
{
  "activities": {
    "current_page": 1,
    "data": [
      {
        "id": 120,
        "object_id": 85,
        "object_type": "task_activity",
        "action": "created",
        "column": "task",
        "old_value": null,
        "new_value": "Sample Task Title",
        "created_at": "2024-12-24T08:43:52+00:00",
        "user": {
          "ID": 1,
          "display_name": "John Doe"
        }
      }
    ],
    "per_page": 15,
    "total": 13,
    "last_page": 1
  }
}
```

Comments on a task are documented in [Comments](/rest-api/comments#list-comments).

## Get Board Dependencies <Badge type="tip" text="Pro" />

Returns every finish-to-start dependency where both tasks are on the board (used by the Gantt chart).

```http
GET /wp-json/fluent-boards/v2/projects/{board_id}/dependencies
```

**Example Request**

```bash
curl "https://yourdomain.com/wp-json/fluent-boards/v2/projects/3/dependencies" \
  -u "USERNAME:APPLICATION_PASSWORD"
```

**Example Response**

```json
{
  "dependencies": [
    { "predecessor_id": 85, "successor_id": 86 }
  ]
}
```

## Get Task Dependencies <Badge type="tip" text="Pro" />

Returns the tasks that block this task (`predecessors`) and the tasks it blocks (`successors`).

```http
GET /wp-json/fluent-boards/v2/projects/{board_id}/tasks/{task_id}/dependencies
```

**Example Request**

```bash
curl "https://yourdomain.com/wp-json/fluent-boards/v2/projects/3/tasks/86/dependencies" \
  -u "USERNAME:APPLICATION_PASSWORD"
```

**Example Response**

```json
{
  "predecessors": [
    { "id": 85, "title": "Design", "stage_id": 25, "status": "closed", "board_id": 3 }
  ],
  "successors": [
    { "id": 87, "title": "Launch", "stage_id": 26, "status": "open", "board_id": 3 }
  ]
}
```

## Add a Dependency <Badge type="tip" text="Pro" />

Adds a finish-to-start dependency: `predecessor_task_id` must finish before `successor_task_id`. Both tasks must be on the board. The relationship is taken from the body; `{task_id}` in the path is not used to build it.

```http
POST /wp-json/fluent-boards/v2/projects/{board_id}/tasks/{task_id}/dependencies
```

**Parameters**

| Parameter | Type | Required | Description |
|---|---|---|---|
| `predecessor_task_id` | integer | Yes | Blocking task |
| `successor_task_id` | integer | Yes | Blocked task |

**Example Request**

```bash
curl "https://yourdomain.com/wp-json/fluent-boards/v2/projects/3/tasks/86/dependencies" \
  -X POST \
  -u "USERNAME:APPLICATION_PASSWORD" \
  -H "Content-Type: application/json" \
  -d '{ "predecessor_task_id": 85, "successor_task_id": 86 }'
```

**Example Response**

```json
{
  "message": "Dependency added successfully."
}
```

Errors: `422` when a task would depend on itself, the dependency already exists, or it would create a cycle; `404` when either task is not on the board.

## Remove a Dependency <Badge type="tip" text="Pro" />

Removes the dependency between `{task_id}` and `{related_task_id}`, in either direction.

```http
DELETE /wp-json/fluent-boards/v2/projects/{board_id}/tasks/{task_id}/dependencies/{related_task_id}
```

**Example Request**

```bash
curl "https://yourdomain.com/wp-json/fluent-boards/v2/projects/3/tasks/86/dependencies/85" \
  -X DELETE \
  -u "USERNAME:APPLICATION_PASSWORD"
```

**Example Response**

```json
{
  "message": "Dependency removed successfully."
}
```

If no dependency exists the response is still `200` with the message "Dependency not found.".

## Create or Update a Recurring Task <Badge type="tip" text="Pro" />

Sets the repeat rule of a task. If the task already has a rule it is replaced. The whole request body is stored as the rule, and the next run is `next_repeat_date` + `time` in `time_zone`, converted to server time.

```http
POST /wp-json/fluent-boards/v2/projects/{board_id}/tasks/{task_id}/create-repeat-task
```

**Parameters**

| Parameter | Type | Required | Description |
|---|---|---|---|
| `create_new` | integer | Yes | `1` creates a new task on each repeat; `0` reuses the task and moves its dates |
| `repeat_when_complete` | integer | Yes | `1` repeats only after the current task is completed |
| `repeat_type` | string | Yes | `daily`, `weekly`, `monthly`, `yearly` |
| `repeat_in` | integer | Yes | Interval (every N days/weeks/months/years) |
| `selected_month` | string | Yes | `Jan` … `Dec` (used by yearly rules) |
| `repeat_in_month_type` | string | Yes | Monthly mode, for example `firstDay` or `lastDay` |
| `selected_repeat_week_days` | string[] | No | Weekly days: `Sun`, `Mon`, `Tue`, `Wed`, `Thu`, `Fri`, `Sat` |
| `selected_month_days` | integer[] | No | Monthly days of month, 1–31 |
| `next_repeat_date` | string | Yes | Date of the next repeat (`Y-m-d`) |
| `time` | string | Yes | Time of day (`H:i:s`) |
| `time_zone` | string | Yes | PHP time zone name, for example `Asia/Dhaka` |
| `selected_stage` | integer | Yes | Stage on this board where repeated tasks go |

**Example Request**

```bash
curl "https://yourdomain.com/wp-json/fluent-boards/v2/projects/3/tasks/85/create-repeat-task" \
  -X POST \
  -u "USERNAME:APPLICATION_PASSWORD" \
  -H "Content-Type: application/json" \
  -d '{
    "create_new": 1,
    "repeat_when_complete": 0,
    "repeat_type": "weekly",
    "repeat_in": 1,
    "selected_repeat_week_days": ["Mon", "Thu"],
    "selected_month": "Jan",
    "repeat_in_month_type": "firstDay",
    "next_repeat_date": "2025-08-11",
    "time": "09:00:00",
    "time_zone": "UTC",
    "selected_stage": 25
  }'
```

**Example Response**

```json
{
  "task": { "id": 85, "repeat_task_meta": null },
  "message": "Repeat task created successfully"
}
```

When a rule already existed the message is "Repeat task update successfully". `422` is returned for an invalid `repeat_type` or `selected_month`.

## Stop a Recurring Task <Badge type="tip" text="Pro" />

Deletes the repeat rule of a task.

```http
DELETE /wp-json/fluent-boards/v2/projects/{board_id}/tasks/{task_id}/remove-repeat-task
```

**Example Request**

```bash
curl "https://yourdomain.com/wp-json/fluent-boards/v2/projects/3/tasks/85/remove-repeat-task" \
  -X DELETE \
  -u "USERNAME:APPLICATION_PASSWORD"
```

**Example Response**

```json
{
  "message": "Task repeat stopped successfully"
}
```

Returns `404` "Repeat task meta not found" when the task has no rule.

## Error Responses

See [Common Error Responses](/rest-api/shared/error-responses) for standard error formats.

Common task errors:

- **400** — task not found on this board, invalid stage, invalid property, or other validation failure reported by the controller
- **403** — no access to the board, or a viewer-only member tried to write
- **422** — request validation failed (missing required fields)
