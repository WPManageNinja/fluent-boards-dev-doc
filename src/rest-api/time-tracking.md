# Time Tracking

The Time Tracking API allows you to manage time tracking for tasks in Fluent Boards. You can start, stop, pause, and commit time tracking sessions, as well as generate time reports.

## Time Track Object

A time track represents a time tracking session for a task.

### Properties

| Property | Type | Description |
|----------|------|-------------|
| `id` | integer | Unique identifier for the time track |
| `task_id` | integer | ID of the task being tracked |
| `board_id` | integer | ID of the project |
| `user_id` | integer | ID of the user tracking time |
| `started_at` | string | Start time of the tracking session |
| `ended_at` | string | End time of the tracking session |
| `duration` | integer | Duration in seconds |
| `description` | string | Description of the work done |
| `status` | string | Status of the time track (running, paused, completed) |
| `created_at` | string | Creation timestamp |
| `updated_at` | string | Last update timestamp |

### Status Values

- `running` - Currently tracking time
- `paused` - Time tracking is paused
- `completed` - Time tracking session completed

## Get Time Tracks for a Task

Retrieve all time tracks for a specific task.

**HTTP Request**
```
GET /wp-json/fluent-boards/v2/projects/{board_id}/tasks/{task_id}/time-tracks
```

### Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `board_id` | integer | The ID of the project |
| `task_id` | integer | The ID of the task |
| `per_page` | integer | Number of time tracks per page (default: 20) |
| `page` | integer | Page number for pagination |

### Example Request

```bash
curl "https://yourdomain.com/wp-json/fluent-boards/v2/projects/1/tasks/1/time-tracks" \
  -H "Authorization: Basic API_USERNAME:API_PASSWORD"
```

### Example Response

```json
{
  "current_page": 1,
  "per_page": 20,
  "total": 5,
  "data": [
    {
      "id": 1,
      "task_id": 1,
      "board_id": 1,
      "user_id": 1,
      "started_at": "2023-02-15 10:00:00",
      "ended_at": "2023-02-15 12:00:00",
      "duration": 7200,
      "description": "Design work on homepage",
      "status": "completed",
      "created_at": "2023-02-15 10:00:00",
      "updated_at": "2023-02-15 12:00:00"
    },
    {
      "id": 2,
      "task_id": 1,
      "board_id": 1,
      "user_id": 1,
      "started_at": "2023-02-15 14:00:00",
      "ended_at": null,
      "duration": 0,
      "description": "Continued design work",
      "status": "running",
      "created_at": "2023-02-15 14:00:00",
      "updated_at": "2023-02-15 14:00:00"
    }
  ]
}
```

## Start Time Tracking

Start tracking time for a task.

**HTTP Request**
```
POST /wp-json/fluent-boards/v2/projects/{board_id}/tasks/{task_id}/time-tracks/start
```

### Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `board_id` | integer | The ID of the project |
| `task_id` | integer | The ID of the task |

### Request Body

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `description` | string | No | Description of the work to be done |

### Example Request

```bash
curl -X POST "https://yourdomain.com/wp-json/fluent-boards/v2/projects/1/tasks/1/time-tracks/start" \
  -H "Authorization: Basic API_USERNAME:API_PASSWORD" \
  -H "Content-Type: application/json" \
  -d '{
    "description": "Starting design work on homepage"
  }'
```

### Example Response

```json
{
  "data": {
    "id": 3,
    "task_id": 1,
    "board_id": 1,
    "user_id": 1,
    "started_at": "2023-02-15 16:00:00",
    "ended_at": null,
    "duration": 0,
    "description": "Starting design work on homepage",
    "status": "running",
    "created_at": "2023-02-15 16:00:00",
    "updated_at": "2023-02-15 16:00:00"
  },
  "message": "Time tracking started successfully"
}
```

## Pause Time Tracking

Pause the current time tracking session.

**HTTP Request**
```
POST /wp-json/fluent-boards/v2/projects/{board_id}/tasks/{task_id}/time-tracks/pause
```

### Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `board_id` | integer | The ID of the project |
| `task_id` | integer | The ID of the task |

### Example Request

```bash
curl -X POST "https://yourdomain.com/wp-json/fluent-boards/v2/projects/1/tasks/1/time-tracks/pause" \
  -H "Authorization: Basic API_USERNAME:API_PASSWORD"
```

### Example Response

```json
{
  "data": {
    "id": 3,
    "task_id": 1,
    "board_id": 1,
    "user_id": 1,
    "started_at": "2023-02-15 16:00:00",
    "ended_at": "2023-02-15 17:30:00",
    "duration": 5400,
    "description": "Starting design work on homepage",
    "status": "paused",
    "created_at": "2023-02-15 16:00:00",
    "updated_at": "2023-02-15 17:30:00"
  },
  "message": "Time tracking paused successfully"
}
```

## Stop Time Tracking

Stop the current time tracking session.

**HTTP Request**
```
POST /wp-json/fluent-boards/v2/projects/{board_id}/tasks/{task_id}/time-tracks/stop
```

### Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `board_id` | integer | The ID of the project |
| `task_id` | integer | The ID of the task |

### Example Request

```bash
curl -X POST "https://yourdomain.com/wp-json/fluent-boards/v2/projects/1/tasks/1/time-tracks/stop" \
  -H "Authorization: Basic API_USERNAME:API_PASSWORD"
```

### Example Response

```json
{
  "data": {
    "id": 3,
    "task_id": 1,
    "board_id": 1,
    "user_id": 1,
    "started_at": "2023-02-15 16:00:00",
    "ended_at": "2023-02-15 18:00:00",
    "duration": 7200,
    "description": "Starting design work on homepage",
    "status": "completed",
    "created_at": "2023-02-15 16:00:00",
    "updated_at": "2023-02-15 18:00:00"
  },
  "message": "Time tracking stopped successfully"
}
```

## Commit Time Tracking

Commit a time tracking session manually.

**HTTP Request**
```
POST /wp-json/fluent-boards/v2/projects/{board_id}/tasks/{task_id}/time-tracks/commit
```

### Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `board_id` | integer | The ID of the project |
| `task_id` | integer | The ID of the task |

### Request Body

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `started_at` | string | Yes | Start time (YYYY-MM-DD HH:MM:SS) |
| `ended_at` | string | Yes | End time (YYYY-MM-DD HH:MM:SS) |
| `description` | string | No | Description of the work done |

### Example Request

```bash
curl -X POST "https://yourdomain.com/wp-json/fluent-boards/v2/projects/1/tasks/1/time-tracks/commit" \
  -H "Authorization: Basic API_USERNAME:API_PASSWORD" \
  -H "Content-Type: application/json" \
  -d '{
    "started_at": "2023-02-15 09:00:00",
    "ended_at": "2023-02-15 11:30:00",
    "description": "Manual time entry for design work"
  }'
```

### Example Response

```json
{
  "data": {
    "id": 4,
    "task_id": 1,
    "board_id": 1,
    "user_id": 1,
    "started_at": "2023-02-15 09:00:00",
    "ended_at": "2023-02-15 11:30:00",
    "duration": 9000,
    "description": "Manual time entry for design work",
    "status": "completed",
    "created_at": "2023-02-15 18:30:00",
    "updated_at": "2023-02-15 18:30:00"
  },
  "message": "Time tracking committed successfully"
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
| `estimated_hours` | float | Yes | Estimated time in hours |

### Example Request

```bash
curl -X POST "https://yourdomain.com/wp-json/fluent-boards/v2/projects/1/tasks/1/time-tracks/estimated-time" \
  -H "Authorization: Basic API_USERNAME:API_PASSWORD" \
  -H "Content-Type: application/json" \
  -d '{
    "estimated_hours": 12.5
  }'
```

### Example Response

```json
{
  "data": {
    "task_id": 1,
    "estimated_hours": 12.5,
    "actual_hours": 8.0
  },
  "message": "Time estimation updated successfully"
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
  "message": "Time track deleted successfully"
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
| `started_at` | string | No | Start time |
| `ended_at` | string | No | End time |
| `description` | string | No | Description of the work done |

### Example Request

```bash
curl -X PUT "https://yourdomain.com/wp-json/fluent-boards/v2/projects/1/tasks/1/time-tracks/commit/1" \
  -H "Authorization: Basic API_USERNAME:API_PASSWORD" \
  -H "Content-Type: application/json" \
  -d '{
    "description": "Updated description for design work"
  }'
```

### Example Response

```json
{
  "data": {
    "id": 1,
    "task_id": 1,
    "board_id": 1,
    "user_id": 1,
    "started_at": "2023-02-15 10:00:00",
    "ended_at": "2023-02-15 12:00:00",
    "duration": 7200,
    "description": "Updated description for design work",
    "status": "completed",
    "created_at": "2023-02-15 10:00:00",
    "updated_at": "2023-02-15 19:00:00"
  },
  "message": "Time track updated successfully"
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
| `user_id` | integer | Filter by user ID |
| `start_date` | string | Start date (YYYY-MM-DD) |
| `end_date` | string | End date (YYYY-MM-DD) |
| `per_page` | integer | Number of records per page (default: 20) |
| `page` | integer | Page number for pagination |

### Example Request

```bash
curl "https://yourdomain.com/wp-json/fluent-boards/v2/projects/timesheet/by-tasks?board_id=1&start_date=2023-02-01&end_date=2023-02-28" \
  -H "Authorization: Basic API_USERNAME:API_PASSWORD"
```

### Example Response

```json
{
  "current_page": 1,
  "per_page": 20,
  "total": 15,
  "data": [
    {
      "task_id": 1,
      "task_title": "Design Homepage",
      "board_id": 1,
      "board_title": "Project Alpha",
      "total_hours": 8.5,
      "estimated_hours": 10.0,
      "time_tracks": [
        {
          "id": 1,
          "started_at": "2023-02-15 10:00:00",
          "ended_at": "2023-02-15 12:00:00",
          "duration": 7200,
          "description": "Design work"
        }
      ]
    }
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
| `start_date` | string | Start date (YYYY-MM-DD) |
| `end_date` | string | End date (YYYY-MM-DD) |
| `per_page` | integer | Number of records per page (default: 20) |
| `page` | integer | Page number for pagination |

### Example Request

```bash
curl "https://yourdomain.com/wp-json/fluent-boards/v2/projects/timesheet/by-users?board_id=1&start_date=2023-02-01&end_date=2023-02-28" \
  -H "Authorization: Basic API_USERNAME:API_PASSWORD"
```

### Example Response

```json
{
  "current_page": 1,
  "per_page": 20,
  "total": 8,
  "data": [
    {
      "user_id": 1,
      "user_name": "John Doe",
      "user_email": "john@example.com",
      "total_hours": 45.5,
      "tasks_worked_on": 12,
      "time_tracks": [
        {
          "id": 1,
          "task_id": 1,
          "task_title": "Design Homepage",
          "started_at": "2023-02-15 10:00:00",
          "ended_at": "2023-02-15 12:00:00",
          "duration": 7200,
          "description": "Design work"
        }
      ]
    }
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