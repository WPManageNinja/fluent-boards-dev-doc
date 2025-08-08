# Time Tracking

The Time Tracking API allows you to manage time tracking for tasks in Fluent Boards. You can commit manual time entries, update or delete tracks, and generate time reports.

## Time Track Object

A time track represents a time tracking session for a task.

### Properties

| Property | Type | Description |
|----------|------|-------------|
| `id` | integer | Unique identifier for the time track |
| `task_id` | integer | ID of the task being tracked |
| `board_id` | integer | ID of the board/project |
| `user_id` | integer | ID of the user tracking time |
| `started_at` | string | Start time of the tracking session |
| `completed_at` | string | End time of the tracking session |
| `status` | string | Status of the time track (active, paused, completed) |
| `working_minutes` | integer | Worked minutes (system-calculated or committed) |
| `billable_minutes` | integer | Billable minutes |
| `is_manual` | integer | 1 if manually committed; 0 if auto-tracked |
| `message` | string | Description/notes of the work |
| `created_at` | string | Creation timestamp |
| `updated_at` | string | Last update timestamp |

### Status Values

- `active` - Currently tracking time
- `paused` - Time tracking is paused
- `completed` - Time tracking session completed
- `commited` - Time entry manually committed

## Get Time Tracks for a Task

Retrieve all time tracks for a specific task.

**HTTP Request**
```
GET /wp-json/fluent-boards/v2/projects/{board_id}/tasks/{task_id}/time-tracks
```

### Example Request

```bash
curl "https://yourdomain.com/wp-json/fluent-boards/v2/projects/1/tasks/1/time-tracks" \
  -H "Authorization: Basic API_USERNAME:API_PASSWORD"
```

### Example Response

```json
{
  "tracks": [
    {
      "id": 1,
      "task_id": 1,
      "board_id": 1,
      "user_id": 1,
      "started_at": "2025-08-06 10:00:00",
      "completed_at": "2025-08-06 12:00:00",
      "status": "completed",
      "working_minutes": 120,
      "billable_minutes": 0,
      "is_manual": 0,
      "message": "Design work on homepage",
      "created_at": "2025-08-06 10:00:00",
      "updated_at": "2025-08-06 12:00:00",
      "user": {
        "ID": 1,
        "display_name": "John Doe",
        "user_email": "john@example.com"
      }
    },
    {
      "id": 2,
      "task_id": 1,
      "board_id": 1,
      "user_id": 1,
      "started_at": "2025-08-06 14:00:00",
      "completed_at": null,
      "status": "active",
      "working_minutes": 0,
      "billable_minutes": 0,
      "is_manual": 0,
      "message": "Continued design work",
      "created_at": "2025-08-06 14:00:00",
      "updated_at": "2025-08-06 14:00:00",
      "user": {
        "ID": 1,
        "display_name": "John Doe",
        "user_email": "john@example.com"
      }
    }
  ],
  "estimated_minutes": 60
}
```



## Commit Time Tracking (Manual Entry)

Create a manual time track entry.

**HTTP Request**
```
POST /wp-json/fluent-boards/v2/projects/{board_id}/tasks/{task_id}/time-tracks
```

### Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `board_id` | integer | The ID of the project |
| `task_id` | integer | The ID of the task |

### Request Body

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `billable_minutes` | integer | Yes | Total billable minutes |
| `message` | string | No | Description/notes |
| `completed_at` | string | No | End time (YYYY-MM-DD HH:MM:SS; timezone suffix allowed) |
| `started_at` | string | No | Start time (YYYY-MM-DD HH:MM:SS) |

### Example Request

```bash
curl -X POST "https://yourdomain.com/wp-json/fluent-boards/v2/projects/{board_id}/tasks/{task_id}/time-tracks" \
  -H "Authorization: Basic API_USERNAME:API_PASSWORD" \
  -H "Content-Type: application/json" \
  -d '{
    "billable_minutes": 60,
    "message": "Lorem ipsum",
    "completed_at": "2025-08-08"
  }'
```

### Example Response

```json
{
  "track": {
    "status": "commited",
    "completed_at": "2025-08-08 00:00:00",
    "billable_minutes": 60,
    "working_minutes": 60,
    "message": "Lorem ipsum",
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
      "user_login": "saikatcdas55Cancrie",
      "user_nicename": "saikat-c-das",
      "user_email": "saikatcdas@gmail.com",
      "user_url": "http://saikatcdas.com",
      "user_registered": "2024-08-28 03:33:23",
      "user_status": "0",
      "display_name": "Saikat Chandra Das",
      "photo": "https://secure.gravatar.com/avatar/628af4ad6672a9298e1e76af147689ba889521e9f7a65ac212ea70bdc2e8c6a1?s=128&d=mm&r=g"
    }
  },
  "message": "You have successfully submitted your working time"
}
```

## Update Time Estimation

Update the estimated time for a task.

**HTTP Request**
```
POST /wp-json/fluent-boards/v2/projects/{board_id}/tasks/{task_id}/time-tracks/estimated-time
```

### Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `board_id` | integer | The ID of the project |
| `task_id` | integer | The ID of the task |

### Request Body

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `estimated_minutes` | integer | Yes | Estimated time in minutes |

### Example Request

```bash
curl -X POST "https://yourdomain.com/wp-json/fluent-boards/v2/projects/1/tasks/1/time-tracks/estimated-time" \
  -H "Authorization: Basic API_USERNAME:API_PASSWORD" \
  -H "Content-Type: application/json" \
  -d '{
    "estimated_minutes": 60
  }'
```

### Example Response

```json
{
  "message": "Estimated time has been updated"
}
```

## Delete a Time Track

Delete a specific time tracking session.

**HTTP Request**
```
DELETE /wp-json/fluent-boards/v2/projects/{board_id}/tasks/{task_id}/time-tracks/{track_id}
```

### Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `board_id` | integer | The ID of the project |
| `task_id` | integer | The ID of the task |
| `track_id` | integer | The ID of the time track |

### Example Request

```bash
curl -X DELETE "https://yourdomain.com/wp-json/fluent-boards/v2/projects/1/tasks/1/time-tracks/1" \
  -H "Authorization: Basic API_USERNAME:API_PASSWORD"
```

### Example Response

```json
{
  "success": true,
  "message": "Selected time track has been deleted"
}
```

## Update a Time Track

Update an existing time tracking session.

**HTTP Request**
```
PUT /wp-json/fluent-boards/v2/projects/{board_id}/tasks/{task_id}/time-tracks/commit/{track_id}
```

### Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `board_id` | integer | The ID of the project |
| `task_id` | integer | The ID of the task |
| `track_id` | integer | The ID of the time track |

### Request Body

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `billable_minutes` | integer | Yes | Billable minutes (also used as working minutes) |
| `message` | string | No | Description/notes of the work done |
| `completed_at` | string | No | End time |
| `started_at` | string | No | Start time |

### Example Request

```bash
curl -X PUT "https://yourdomain.com/wp-json/fluent-boards/v2/projects/1/tasks/1/time-tracks/commit/1" \
  -H "Authorization: Basic API_USERNAME:API_PASSWORD" \
  -H "Content-Type: application/json" \
  -d '{
    "billable_minutes": 90,
    "message": "Updated description for design work",
    "completed_at": "2025-08-08 12:00:00"
  }'
```

### Example Response

```json
{
  "success": true,
  "message": "Selected Time-track has been updated"
}
```

## Get Timesheet Reports

### By Tasks

Get timesheet data organized by tasks.

**HTTP Request**
```
GET /wp-json/fluent-boards/v2/projects/timesheet/by-tasks
```

### Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `board_id` | integer | Filter by project ID |
| `date_range[]` | string[] | Array with two dates: start and end (YYYY-MM-DD) |

### Example Request

```bash
curl "https://yourdomain.com/wp-json/fluent-boards/v2/projects/timesheet/by-tasks?board_id=3&date_range[]=2025-08-01&date_range[]=2025-08-08" \
  -H "Authorization: Basic API_USERNAME:API_PASSWORD"
```

### Example Response

```json
{
  "tasks": [],
  "date_labels": [
    "2025-08-01",
    "2025-08-02",
    "2025-08-03",
    "2025-08-04",
    "2025-08-05",
    "2025-08-06",
    "2025-08-07",
    "2025-08-08"
  ],
  "totalMinutes": 0,
  "time_sheets": [],
  "date_range": [
    "2025-08-01 00:00:00",
    "2025-08-08 23:59:59"
  ]
}
```

### By Users

Get timesheet data organized by users.

**HTTP Request**
```
GET /wp-json/fluent-boards/v2/projects/timesheet/by-users
```

### Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `board_id` | integer | Filter by project ID |
| `date_range[]` | string[] | Array with two dates: start and end (YYYY-MM-DD) |

### Example Request

```bash
curl "https://yourdomain.com/wp-json/fluent-boards/v2/projects/timesheet/by-users?board_id=3&date_range[]=2025-08-01&date_range[]=2025-08-08" \
  -H "Authorization: Basic API_USERNAME:API_PASSWORD"
```

### Example Response

```json
{
  "users": [],
  "date_labels": [
    "2025-08-01",
    "2025-08-02",
    "2025-08-03",
    "2025-08-04",
    "2025-08-05",
    "2025-08-06",
    "2025-08-07",
    "2025-08-08"
  ],
  "totalMinutes": 0,
  "time_sheets": [],
  "date_range": [
    "2025-08-01 09:16:56",
    "2025-08-08 23:59:59"
  ]
}
```

## Error Responses

See [Common Error Responses](/rest-api/shared/error-responses) for standard error formats.

### Common Time Tracking-Specific Errors

- **404 Not Found** - Time track not found
- **403 Forbidden** - You don't have permission to access this time track
- **400 Bad Request** - Invalid time tracking data or missing required fields

## Next Steps

- [Manage Tasks](/rest-api/tasks) - Work with tasks and time tracking
- [Board Management](/rest-api/boards) - Handle board time tracking
- [Reports](/rest-api/reports) - Generate comprehensive reports
- [User Management](/rest-api/users) - Manage user time tracking 