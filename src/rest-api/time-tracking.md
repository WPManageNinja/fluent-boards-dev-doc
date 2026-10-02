# Time Tracking

The Time Tracking API lets you log work time on tasks, set a time estimate, edit or delete logs, and pull timesheet reports. Plugin source: Pro (Time Tracking module).

::: tip Pro
All endpoints on this page need Fluent Boards Pro with the **Time Tracking** module turned on. When the module is off, the write endpoints (log, estimate, update, delete) return `403` with `Time tracking is disabled`.
:::

Task-level endpoints use `SingleBoardPolicy`: the user must be a member of the board, and board viewers can only call `GET` endpoints. The task must belong to `{board_id}`.

## Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/projects/{board_id}/tasks/{task_id}/time-tracks` | List a task's time logs and estimate |
| POST | `/projects/{board_id}/tasks/{task_id}/time-tracks` | Log time manually |
| POST | `/projects/{board_id}/tasks/{task_id}/time-tracks/estimated-time` | Set the task's time estimate |
| PUT | `/projects/{board_id}/tasks/{task_id}/time-tracks/commit/{track_id}` | Update a time log |
| DELETE | `/projects/{board_id}/tasks/{task_id}/time-tracks/{track_id}` | Delete a time log |
| GET | `/projects/timesheet/by-tasks` | Timesheet grouped by task |
| GET | `/projects/timesheet/by-users` | Timesheet grouped by user |

## Time Track Object

Time logs are stored in the `fbs_time_tracks` table.

| Property | Type | Description |
|---|---|---|
| `id` | integer | Time track ID |
| `task_id` | integer | Task the time was logged on |
| `board_id` | integer | Board of the task |
| `user_id` | integer | User who logged the time |
| `started_at` | string | Start time (defaults to the creation time) |
| `completed_at` | string | Date the work was done. Timesheets group logs by this date |
| `status` | string | `commited` for logged entries |
| `working_minutes` | integer | Worked minutes (same as `billable_minutes` for manual logs) |
| `billable_minutes` | integer | Billable minutes |
| `is_manual` | integer | `1` for manual logs |
| `message` | string | Work notes (HTML allowed, passed through `wp_kses_post`) |
| `created_at` | string | Creation timestamp |
| `updated_at` | string | Last update timestamp |

## List Time Tracks for a Task <Badge type="tip" text="Pro" />

Retrieve every time log of a task (newest first, each with its `user`) and the task's time estimate.

```http
GET /wp-json/fluent-boards/v2/projects/{board_id}/tasks/{task_id}/time-tracks
```

**Example Request**

```bash
curl "https://yourdomain.com/wp-json/fluent-boards/v2/projects/7/tasks/272/time-tracks" \
  -u "USERNAME:APPLICATION_PASSWORD"
```

**Example Response**

`estimated_minutes` is `0` when no estimate is set.

```json
{
  "tracks": [
    {
      "id": 2,
      "user_id": 1,
      "board_id": 7,
      "task_id": 272,
      "started_at": "2025-08-08 08:57:05",
      "completed_at": "2025-08-08 00:00:00",
      "status": "commited",
      "working_minutes": 60,
      "billable_minutes": 60,
      "is_manual": 1,
      "message": "Design work on homepage",
      "created_at": "2025-08-08T08:57:05+00:00",
      "updated_at": "2025-08-08T08:57:05+00:00",
      "user": {
        "ID": 1,
        "display_name": "John Doe",
        "photo": "https://secure.gravatar.com/avatar/...?s=128&d=mm&r=g"
      }
    }
  ],
  "estimated_minutes": 120
}
```

## Log Time Manually <Badge type="tip" text="Pro" />

Create a time log for the current user on a task.

```http
POST /wp-json/fluent-boards/v2/projects/{board_id}/tasks/{task_id}/time-tracks
```

**Parameters**

| Parameter | Type | Required | Description |
|---|---|---|---|
| `billable_minutes` | integer | Yes | Minutes worked, at least `1`. Saved as both billable and working minutes |
| `message` | string | No | Work notes |
| `completed_at` | string | No | Date of the work, any format PHP can parse (a JavaScript `Date.toString()` suffix such as ` (Coordinated Universal Time)` is stripped). Defaults to now |

**Example Request**

```bash
curl "https://yourdomain.com/wp-json/fluent-boards/v2/projects/7/tasks/272/time-tracks" \
  -X POST \
  -u "USERNAME:APPLICATION_PASSWORD" \
  -H "Content-Type: application/json" \
  -d '{
    "billable_minutes": 60,
    "message": "Design work on homepage",
    "completed_at": "2025-08-08"
  }'
```

**Example Response**

```json
{
  "track": {
    "status": "commited",
    "completed_at": "2025-08-08 00:00:00",
    "billable_minutes": 60,
    "working_minutes": 60,
    "message": "Design work on homepage",
    "user_id": 1,
    "board_id": "7",
    "is_manual": 1,
    "task_id": "272",
    "started_at": "2025-08-08 08:57:05",
    "updated_at": "2025-08-08T08:57:05+00:00",
    "created_at": "2025-08-08T08:57:05+00:00",
    "id": 2,
    "user": {
      "ID": 1,
      "display_name": "John Doe",
      "photo": "https://secure.gravatar.com/avatar/...?s=128&d=mm&r=g"
    }
  },
  "message": "You have successfully submitted your working time"
}
```

## Set Time Estimate <Badge type="tip" text="Pro" />

Set the estimated time for a task. The value is stored in task meta `_estimated_minutes`.

```http
POST /wp-json/fluent-boards/v2/projects/{board_id}/tasks/{task_id}/time-tracks/estimated-time
```

**Parameters**

| Parameter | Type | Required | Description |
|---|---|---|---|
| `estimated_minutes` | integer | Yes | Estimate in minutes. `0` clears it |

**Example Request**

```bash
curl "https://yourdomain.com/wp-json/fluent-boards/v2/projects/7/tasks/272/time-tracks/estimated-time" \
  -X POST \
  -u "USERNAME:APPLICATION_PASSWORD" \
  -H "Content-Type: application/json" \
  -d '{"estimated_minutes": 120}'
```

**Example Response**

```json
{
  "message": "Estimated time has been updated"
}
```

## Update a Time Track <Badge type="tip" text="Pro" />

Edit a time log. Members can edit only their own logs; board managers can edit any log on the board.

```http
PUT /wp-json/fluent-boards/v2/projects/{board_id}/tasks/{task_id}/time-tracks/commit/{track_id}
```

**Parameters**

| Parameter | Type | Required | Description |
|---|---|---|---|
| `billable_minutes` | integer | Yes | Minutes worked, at least `1`. Saved as both billable and working minutes |
| `message` | string | No | Work notes. Omitting it clears the notes |
| `completed_at` | string | No | Date of the work. Omitting it sets the date to now |

**Example Request**

```bash
curl "https://yourdomain.com/wp-json/fluent-boards/v2/projects/7/tasks/272/time-tracks/commit/2" \
  -X PUT \
  -u "USERNAME:APPLICATION_PASSWORD" \
  -H "Content-Type: application/json" \
  -d '{
    "billable_minutes": 90,
    "message": "Design work on homepage and header",
    "completed_at": "2025-08-08 12:00:00"
  }'
```

**Example Response**

```json
{
  "success": true,
  "message": "Selected Time-track has been updated"
}
```

## Delete a Time Track <Badge type="tip" text="Pro" />

Delete a time log. Members can delete only their own logs; board managers can delete any log on the board.

```http
DELETE /wp-json/fluent-boards/v2/projects/{board_id}/tasks/{task_id}/time-tracks/{track_id}
```

**Example Request**

```bash
curl "https://yourdomain.com/wp-json/fluent-boards/v2/projects/7/tasks/272/time-tracks/2" \
  -X DELETE \
  -u "USERNAME:APPLICATION_PASSWORD"
```

**Example Response**

```json
{
  "success": true,
  "message": "Selected time track has been deleted"
}
```

Returns `422` with `Time track not found` when the log is not on this task, and `403` when you try to delete someone else's log without being a board manager.

## Timesheet by Tasks <Badge type="tip" text="Pro" />

Return time logs in a date range, grouped by day and task. Requires WordPress admin / FluentBoards admin (the endpoint uses `BoardManagerPolicy`, but there is no `{board_id}` in the path, so only admins pass).

```http
GET /wp-json/fluent-boards/v2/projects/timesheet/by-tasks
```

**Parameters**

| Parameter | Type | Required | Description |
|---|---|---|---|
| `board_id` | integer | No | Only include logs from this board. Omit for all boards |
| `date_range` | array | No | Two dates, start and end (`YYYY-MM-DD`). Defaults to the last 7 days |

**Example Request**

```bash
curl -g "https://yourdomain.com/wp-json/fluent-boards/v2/projects/timesheet/by-tasks?board_id=7&date_range[]=2025-08-07&date_range[]=2025-08-08" \
  -u "USERNAME:APPLICATION_PASSWORD"
```

**Example Response**

- `tasks`: one entry per task, with `task` (`id`, `title`, `slug`) and `board`.
- `time_sheets`: keyed by date, then by task ID; each item has `id`, `created_at`, `user`, `completed_at`, `billable_minutes`, `message`.
- `date_labels`: every date in the range.
- `totalMinutes`: sum of `billable_minutes`.
- `date_range`: the normalized range used for the query.

```json
{
  "tasks": [
    {
      "task": { "id": 272, "title": "Homepage design", "slug": "homepage-design" },
      "board": { "id": 7, "title": "Website Redesign" }
    }
  ],
  "date_labels": ["2025-08-07", "2025-08-08"],
  "totalMinutes": 60,
  "time_sheets": {
    "2025-08-08": {
      "272": [
        {
          "id": 2,
          "created_at": "2025-08-08 08:57:05",
          "user": { "ID": 1, "display_name": "John Doe" },
          "completed_at": "2025-08-08 00:00:00",
          "billable_minutes": 60,
          "message": "Design work on homepage"
        }
      ]
    }
  },
  "date_range": ["2025-08-07 00:00:00", "2025-08-08 23:59:59"]
}
```

## Timesheet by Users <Badge type="tip" text="Pro" />

Return time logs in a date range, grouped by day and user. Same access rule and parameters as [Timesheet by Tasks](#timesheet-by-tasks).

```http
GET /wp-json/fluent-boards/v2/projects/timesheet/by-users
```

**Parameters**

| Parameter | Type | Required | Description |
|---|---|---|---|
| `board_id` | integer | No | Only include logs from this board. Omit for all boards |
| `date_range` | array | No | Two dates, start and end (`YYYY-MM-DD`). Defaults to the last 7 days |

**Example Request**

```bash
curl -g "https://yourdomain.com/wp-json/fluent-boards/v2/projects/timesheet/by-users?board_id=7&date_range[]=2025-08-07&date_range[]=2025-08-08" \
  -u "USERNAME:APPLICATION_PASSWORD"
```

**Example Response**

`users` lists the users who logged time. `time_sheets` is keyed by date, then by user ID; each item has `id`, `created_at`, `task`, `board`, `completed_at`, `billable_minutes`, `message`.

```json
{
  "users": [
    { "ID": 1, "display_name": "John Doe" }
  ],
  "date_labels": ["2025-08-07", "2025-08-08"],
  "totalMinutes": 60,
  "time_sheets": {
    "2025-08-08": {
      "1": [
        {
          "id": 2,
          "created_at": "2025-08-08 08:57:05",
          "task": { "id": 272, "title": "Homepage design", "slug": "homepage-design" },
          "board": { "id": 7, "title": "Website Redesign" },
          "completed_at": "2025-08-08 00:00:00",
          "billable_minutes": 60,
          "message": "Design work on homepage"
        }
      ]
    }
  },
  "date_range": ["2025-08-07 00:00:00", "2025-08-08 23:59:59"]
}
```

See [Common Error Responses](/rest-api/shared/error-responses) for standard error formats.
