# Stages

The Stages API allows you to manage board stages and workflows in Fluent Boards. You can create, read, update, and delete stages, as well as manage their tasks and positions.

## Create a Stage

Create a new stage. The stage will be positioned at the end of the board by default, or at the specified position if provided.

**HTTP Request**
```
POST /wp-json/fluent-boards/v2/projects/{board_id}/stage-create
```

### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `title` | string | Yes | Stage title |
| `position` | numeric | No | Position within the board |
| `status` | string | No | Default task status (defaults to 'open') |

### Example Request

```bash
curl "https://yourdomain.com/wp-json/fluent-boards/v2/projects/{board_id}/stage-create" \
  -X POST \
  -H "Authorization: Basic API_USERNAME:API_PASSWORD" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Review",
    "position": 3,
    "status": "open"
  }'
```



### Example Response

```json
{
  "updatedStages": [
    {
      "id": 107,
      "board_id": "10",
      "title": "Review",
      "slug": null,
      "type": "stage",
      "position": "2.50",
      "color": null,
      "bg_color": null,
      "settings": {
        "default_task_status": "open",
        "default_task_assignees": []
      },
      "archived_at": null,
      "created_at": "2025-08-06T10:45:32+00:00",
      "updated_at": "2025-08-06T10:45:32+00:00"
    }
  ],
  "message": "stage has been created"
}
```

## Update a Stage

Update an existing stage.

**HTTP Request**
```
PUT /wp-json/fluent-boards/v2/projects/{board_id}/update-stage/{stage_id}
```

### Parameters
### Example Request

```bash
curl "https://yourdomain.com/wp-json/fluent-boards/v2/projects/{board_id}/update-stage/{stage_id}" \
  -X PUT \
  -H "Authorization: Basic API_USERNAME:API_PASSWORD" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "In Development",
    "settings": {"default_task_status": "open"}
  }'
```

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `title` | string | No | Stage title |
| `settings` | object | No | Stage settings object |



### Example Response

```json
{
  "data": {
    "id": 2,
    "title": "In Development",
    "board_id": 1,
    "position": 2.0,
    "type": "stage",
    "settings": {
      "default_task_status": "open",
      "is_template": false
    },
    "archived_at": null,
    "created_by": 1,
    "created_at": "2023-01-15 10:30:00",
    "updated_at": "2023-02-15 16:00:00"
  },
  "message": "Stage updated successfully"
}
```

## Archive a Stage

Archive a stage (soft delete).

**HTTP Request**
```
PUT /wp-json/fluent-boards/v2/projects/{board_id}/archive-stage/{stage_id}
```

### Example Request

```bash
curl "https://yourdomain.com/wp-json/fluent-boards/v2/projects/{board_id}/archive-stage/{stage_id}" \
  -X PUT \
  -H "Authorization: Basic API_USERNAME:API_PASSWORD"
```

### Example Response

```json
{
  "updatedStage": {
    "id": 107,
    "board_id": "10",
    "title": "Review",
    "slug": null,
    "type": "stage",
    "position": 0,
    "color": null,
    "bg_color": null,
    "settings": {
      "default_task_status": "open",
      "default_task_assignees": []
    },
    "archived_at": "2025-08-06 11:18:56",
    "created_at": "2025-08-06T10:45:32+00:00",
    "updated_at": "2025-08-06T11:18:56+00:00"
  },
  "message": "Stage has been archived"
}
```

## Restore a Stage

Restore an archived stage.

**HTTP Request**
```
PUT /wp-json/fluent-boards/v2/projects/{board_id}/restore-stage/{stage_id}
```

### Example Request

```bash
curl "https://yourdomain.com/wp-json/fluent-boards/v2/projects/{board_id}/restore-stage/{stage_id}" \
  -X PUT \
  -H "Authorization: Basic API_USERNAME:API_PASSWORD"
```

### Example Response

```json
{
  "success": true,
  "updatedStage": {
    "id": 107,
    "board_id": "10",
    "title": "Review",
    "slug": null,
    "type": "stage",
    "position": 4,
    "color": null,
    "bg_color": null,
    "settings": {
      "default_task_status": "open",
      "default_task_assignees": []
    },
    "archived_at": null,
    "created_at": "2025-08-06T10:45:32+00:00",
    "updated_at": "2025-08-06T11:21:13+00:00"
  },
  "message": "Stage has been restored"
}
```

## Re-position Stages

Update the positions of multiple stages at once. This endpoint can trigger automatic reindexing of stage positions for optimal ordering.

**HTTP Request**
```
PUT /wp-json/fluent-boards/v2/projects/{board_id}/re-position-stages
```

### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `list` | array | Yes | Array of stage IDs in the desired order |

### Example Request

```bash
curl "https://yourdomain.com/wp-json/fluent-boards/v2/projects/{board_id}/re-position-stages" \
  -X PUT \
  -H "Authorization: Basic API_USERNAME:API_PASSWORD" \
  -H "Content-Type: application/json" \
  -d '{
    "list": [107, 106, 105, 104]
  }'
```

### Example Response

```json
{
  "message": "Stages Reordered",
  "updatedStages": [
    {
      "id": 104,
      "board_id": "10",
      "title": "Open",
      "slug": "open",
      "type": "stage",
      "position": "1.88",
      "color": null,
      "bg_color": null,
      "settings": {
        "default_task_status": "open"
      },
      "archived_at": null,
      "created_at": "2025-08-06T06:46:17+00:00",
      "updated_at": "2025-08-06T11:31:45+00:00"
    },
    {
      "id": 105,
      "board_id": "10",
      "title": "In Progress",
      "slug": "in-progress",
      "type": "stage",
      "position": "0.88",
      "color": null,
      "bg_color": null,
      "settings": {
        "default_task_status": "open"
      },
      "archived_at": null,
      "created_at": "2025-08-06T06:46:17+00:00",
      "updated_at": "2025-08-06T11:31:45+00:00"
    },
    // ... other stages
  ]
}
```

## Archive All Tasks in Stage

Archive all tasks within a specific stage. This will set the position to 0 and mark all tasks as archived with a timestamp.

**HTTP Request**
```
PUT /wp-json/fluent-boards/v2/projects/{board_id}/stage/{stage_id}/archive-all-task
```

### Example Request

```bash
curl "https://yourdomain.com/wp-json/fluent-boards/v2/projects/{board_id}/stage/{stage_id}/archive-all-task" \
  -X PUT \
  -H "Authorization: Basic API_USERNAME:API_PASSWORD"
```
### Example Response

```json
{
  "message": "Tasks have been archived",
  "updatedTasks": [
    {
      "id": 282,
      "parent_id": null,
      "board_id": "9",
      "crm_contact_id": null,
      "title": "New task",
      "slug": "new-task",
      "type": "task",
      "position": 0,
      "archived_at": "2025-08-06 11:36:48",
      // ... other task properties
    }
    // ... other updated tasks
  ]
}
```

## Sort Tasks in Stage

Sort tasks within a specific stage by various criteria. The system will automatically update task positions based on the sort order and return the sorted tasks with additional computed properties.

**HTTP Request**
```
PUT /wp-json/fluent-boards/v2/projects/{board_id}/stage/{stage_id}/sort-task
```

### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `order` | string | Yes | Sort field (priority, due_at, position, created_at, title) |
| `orderBy` | string | Yes | Sort direction (ASC, DESC) |



### Example Request

```bash
curl "https://yourdomain.com/wp-json/fluent-boards/v2/projects/{board_id}/stage/{stage_id}/sort-task" \
  -X PUT \
  -H "Authorization: Basic API_USERNAME:API_PASSWORD" \
  -H "Content-Type: application/json" \
  -d '{
    "order": "title",
    "orderBy": "DESC"
  }'
```

### Example Response

```json
{
  "message": "Tasks has been sorted",
  "updatedTasks": [
    {
      "id": 248,
      "title": "Code REfacotor , Security Validation Checks",
      "stage_id": "78",
      "position": 1,
      "isOverdue": false,
      "isUpcoming": false,
      "is_watching": false
      // ... other task properties
    },
    // ... other tasks
  ]
}
```

## Get Archived Stages

Retrieve archived stages for a board. Supports pagination and can return all archived stages or paginated results.

**HTTP Request**
```
GET /wp-json/fluent-boards/v2/projects/{board_id}/archived-stages
```

### Parameters
### Example Request

```bash
curl "https://yourdomain.com/wp-json/fluent-boards/v2/projects/{board_id}/archived-stages?per_page=30&page=1" \
  -H "Authorization: Basic API_USERNAME:API_PASSWORD"
```

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `noPagination` | boolean | false | If true, returns all archived stages without pagination |
| `per_page` | integer | 30 | Number of stages per page (when pagination is enabled) |
| `page` | integer | 1 | Page number (when pagination is enabled) |

### Example Response

```json
{
  "stages": {
    "current_page": 1,
    "data": [
      {
        "id": 5,
        "board_id": "1",
        "title": "Old Stage",
        "slug": "old-stage",
        "type": "stage",
        "position": "0.00",
        "color": null,
        "bg_color": null,
        "settings": {
          "default_task_status": "open"
        },
        "archived_at": "2023-02-10 12:00:00",
        "created_at": "2023-01-15T10:30:00+00:00",
        "updated_at": "2023-02-10T12:00:00+00:00"
      }
    ],
    "from": 1,
    "to": 1,
    "total": 1,
    "per_page": 30,
    "current_page": 1,
    "last_page": 1,
    "first_page_url": "https://yourdomain.com/wp-json/fluent-boards/v2/projects/1/archived-stages/?page=1",
    "last_page_url": "https://yourdomain.com/wp-json/fluent-boards/v2/projects/1/archived-stages/?page=1",
    "next_page_url": null,
    "prev_page_url": null,
    "path": "https://yourdomain.com/wp-json/fluent-boards/v2/projects/1/archived-stages",
    "links": [
      {
        "url": null,
        "label": "pagination.previous",
        "active": false
      },
      {
        "url": "https://yourdomain.com/wp-json/fluent-boards/v2/projects/1/archived-stages/?page=1",
        "label": "1",
        "active": true
      },
      {
        "url": null,
        "label": "pagination.next",
        "active": false
      }
    ]
  }
}
```

## Get Stage Task Available Positions

Get available positions for tasks within a stage.

**HTTP Request**
```
GET /wp-json/fluent-boards/v2/projects/{board_id}/stage-task-available-positions/{stage_id}
```

### Example Request

```bash
curl "https://yourdomain.com/wp-json/fluent-boards/v2/projects/{board_id}/stage-task-available-positions/{stage_id}" \
  -H "Authorization: Basic API_USERNAME:API_PASSWORD"
```
### Example Response

```json
{
  "data": {
    "stage_id": 2,
    "available_positions": [1, 2, 3, 4, 5],
    "current_task_count": 3
  }
}
```

## Error Responses

See [Common Error Responses](/rest-api/shared/error-responses) for standard error formats.

### Common Stage-Specific Errors

- **404 Not Found** - Stage not found
- **403 Forbidden** - You don't have permission to access this stage
- **400 Bad Request** - Invalid stage data or missing required fields
