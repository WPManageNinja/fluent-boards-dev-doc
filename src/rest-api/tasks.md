# Tasks

The Tasks API allows you to manage tasks within boards in Fluent Boards. You can create, read, update, and delete tasks, as well as manage their assignments, labels, and status.

## List All Tasks

Retrieve a paginated list of tasks.

**HTTP Request**
```
GET /wp-json/fluent-boards/v2/projects/{board_id}/tasks
```

### Example Request

```bash
curl "https://yourdomain.com/wp-json/fluent-boards/v2/projects/{board_id}/tasks" \
  -H "Authorization: Basic API_USERNAME:API_PASSWORD"
```


### Example Response

```json
{
  "tasks": [
    {
      "id": 1,
      "title": "Design Homepage",
      "slug": "design-homepage",
      "board_id": "3",
      "stage_id": "30",
      "status": "closed",
      "priority": "low",
      "position": "17.00",
      "created_by": "1",
      "meta": {
        "is_template": "no"
      }
      // ... other task properties
    },
    {
      "id": 2,
      "title": "Security Validation",
      "slug": "security-validation",
      "board_id": "3",
      "stage_id": "28",
      "status": "open",
      "priority": "low",
      "position": "1.00",
      "created_by": "1",
      "meta": {
        "is_template": "no"
      }
      // ... other task properties
    }
    // ... other tasks
  ]
}
```



## Get a Single Task

Retrieve a specific task by ID.

**HTTP Request**
```
GET /wp-json/fluent-boards/v2/projects/{board_id}/tasks/{task_id}
```

### Example Request

```bash
curl "https://yourdomain.com/wp-json/fluent-boards/v2/projects/{board_id}/tasks/{task_id}" \
  -H "Authorization: Basic API_USERNAME:API_PASSWORD"
```


### Example Response

```json
{
  "task": {
    "id": 1,
    "title": "Design Homepage",
    "slug": "design-homepage",
    "board_id": "3",
    "stage_id": "25",
    "status": "open",
    "priority": "low",
    "description": "<p>Create new homepage design</p>",
    "created_by": "1",
    "position": "23.00",
    "settings": {
      "subtask_count": 5,
      "attachment_count": 1,
      "subtask_completed_count": 2
    },
    "due_at": "2025-07-04 23:45:00",
    "isOverdue": true,
    "nextStage": "In Progress",
    "meta": {
      "is_template": "no"
    },
    "assignees": [
      {
        "ID": 1,
        "display_name": "John Doe",
        "email": "john@example.com"
        // ... other properties
      }
    ],
    "attachments": [
      {
        "id": 24,
        "title": "document.csv",
        "file_size": "2 KB"
        // ... other properties
      }
    ],
    "board": {
      "id": 3,
      "title": "Sample Board",
      "type": "to-do"
      // ... other properties
    },
    "stage": {
      "id": 25,
      "title": "Planned"
      // ... other properties
    },
    "labels": [
      {
        "id": 38,
        "title": "later",
        "bg_color": "#658ca5"
        // ... other properties
      }
    ]
    // ... other task properties
  }
}
```

## Create a Task

Create a new task.

**HTTP Request**
```
POST /wp-json/fluent-boards/v2/projects/{board_id}/tasks
```


### Request Body

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `task[title]` | string | Yes | Task title |
| `task[board_id]` | integer | Yes | Board ID |
| `task[stage_id]` | integer | Yes | Stage ID |
| `task[priority]` | string | No | Task priority (low, medium, high) |
| `task[crm_contact_id]` | integer | No | Associated FluentCRM contact ID |
| `task[is_template]` | string | No | Whether task is a template (yes) |

### Example Request

```bash
curl "https://yourdomain.com/wp-json/fluent-boards/v2/projects/{board_id}/tasks" \
  -X POST \
  -H "Authorization: Basic API_USERNAME:API_PASSWORD" \
  -H "Content-Type: application/json" \
  -d '{
    "task": {
      "title": "New Task",
      "board_id": 10,
      "stage_id": 104,
      "is_template": "no"
    }
  }'
```

### Example Response

```json
{
  "task": {
    "id": 281,
    "title": "New Task",
    "slug": "new-task",
    "board_id": "10",
    "stage_id": 104,
    "status": "open",
    "position": 1,
    "created_by": 1,
    "type": "task",
    "settings": {
      "cover": {
        "backgroundColor": ""
      },
      "subtask_count": 0,
      "attachment_count": 0,
      "subtask_completed_count": 0
    },
    "meta": [],
    "repeat_task_meta": null,
    "stage": {
      // ... stage properties
    },
    "board": {
      // ... board properties
    }
    // ... other task properties
  },
  "message": "Task has been successfully created",
  "updatedTasks": [
    // updated tasks
  ]
}
```

## Update Task Properties

Update specific properties of an existing task.

**HTTP Request**
```
PUT /wp-json/fluent-boards/v2/projects/{board_id}/tasks/{task_id}
```

### Supported Properties

| Property | Type | Description |
|----------|------|-------------|
| `title` | string | Task title |
| `description` | string | Task description |
| `status` | string | Task status (open, closed) |
| `priority` | string | Task priority (low, medium, high) |
| `due_at` | string | Due date and time |
| `started_at` | string | Start date |
| `assignees` | array | Array of user IDs |
| `crm_contact_id` | integer | Associated FluentCRM contact ID |
| `parent_id` | integer | Parent task ID for subtasks |
| `is_watching` | boolean | Whether user is watching the task |
| `archived_at` | string | Archive timestamp |
| `last_completed_at` | string | Completion timestamp |
| `board_id` | integer | Board ID |
| `type` | string | Task type |
| `reminder_type` | string | Reminder type |
| `remind_at` | string | Reminder timestamp |
| `settings` | object | Task settings |
| `is_template` | string | Whether task is a template |

### Example Request

```bash
curl "https://yourdomain.com/wp-json/fluent-boards/v2/projects/{board_id}/tasks/{task_id}" \
  -X PUT \
  -H "Authorization: Basic API_USERNAME:API_PASSWORD" \
  -H "Content-Type: application/json" \
  -d '{
    "property": "title",
    "value": "Updated Task Title"
  }'
```

### Example Response

```json
{
  "message": "Task has been updated",
  "task": {
    "id": 281,
    "title": "Updated Task Title",
    "slug": "new-task",
    "board_id": "10",
    "stage_id": "104",
    "status": "open",
    "priority": "low",
    "updated_at": "2025-08-06T08:29:04+00:00"
    // ... other task properties
  },
  "updatedTasks": [
    // ... updated tasks
  ]
}
```

## Delete a Task

Delete a task.

**HTTP Request**
```
DELETE /wp-json/fluent-boards/v2/projects/{board_id}/tasks/{task_id}
```

### Example Request

```bash
curl "https://yourdomain.com/wp-json/fluent-boards/v2/projects/{board_id}/tasks/{task_id}" \
  -X DELETE \
  -H "Authorization: Basic API_USERNAME:API_PASSWORD"
```


### Example Response

```json
{
  "updatedTasks": [],
  "message": "Task has been deleted"
}
```

## Move a Task

Move a task to a different stage.

**HTTP Request**
```
PUT /wp-json/fluent-boards/v2/projects/{board_id}/tasks/{task_id}/move-task
```


### Request Body

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `newStageId` | integer | Yes | Target stage ID |
| `newIndex` | integer | No | Position within the stage |
| `newBoardId` | integer | No | Target board ID (for moving between boards) |

### Example Request

```bash
curl "https://yourdomain.com/wp-json/fluent-boards/v2/projects/{board_id}/tasks/{task_id}/move-task" \
  -X PUT \
  -H "Authorization: Basic API_USERNAME:API_PASSWORD" \
  -H "Content-Type: application/json" \
  -d '{
    "newStageId": 96,
    "newIndex": 1,
    "newBoardId": 9
  }'
```

### Example Response

```json
{
  "message": "Task has been updated",
  "task": {
    "id": 282,
    "parent_id": null,
    "board_id": 9,
    "crm_contact_id": null,
    "title": "New task",
    "slug": "new-task",
    "type": "task",
    "status": "open",
    "stage_id": 96,
    "position": 1,
    // ... other task properties
  },
  "updatedTasks": [
    // ... updated tasks
  ],
  "last_updated": "2025-08-06 09:36:40"
}
```

## Clone a Task

Create a copy of an existing task.

**HTTP Request**
```
POST /wp-json/fluent-boards/v2/projects/{board_id}/tasks/{task_id}/clone-task
```


### Request Body

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `title` | string | Yes | Title for the cloned task |
| `stage_id` | integer | Yes | Target stage ID |
| `assignee` | boolean | Yes | Whether to clone assignees |
| `subtask` | boolean | Yes | Whether to clone subtasks (Pro only) |
| `label` | boolean | Yes | Whether to clone labels|
| `attachment` | boolean | Yes | Whether to clone attachments (Pro only) |
| `comment` | boolean | Yes | Whether to clone comments |

### Example Request

```bash
curl "https://yourdomain.com/wp-json/fluent-boards/v2/projects/{board_id}/tasks/{task_id}/clone-task" \
  -X POST \
  -H "Authorization: Basic API_USERNAME:API_PASSWORD" \
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

## Get Task Comments

Retrieve comments for a specific task.

**HTTP Request**
```
GET /wp-json/fluent-boards/v2/projects/{board_id}/tasks/{task_id}/comments
```

### Example Request

```bash
curl "https://yourdomain.com/wp-json/fluent-boards/v2/projects/{board_id}/tasks/{task_id}/comments" \
  -H "Authorization: Basic API_USERNAME:API_PASSWORD"
```

### Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `filter` | string | Sort order for comments (latest, oldest) |


### Example Response

```json
{
  "comments": {
    "current_page": 1,
    "data": [
      {
        "id": 3,
        "board_id": "3",
        "task_id": "85",
        "parent_id": null,
        "type": "comment",
        "privacy": "private",
        "status": "published",
        "author_name": "John Doe",
        "author_email": "john@example.com",
        "author_ip": "",
        "description": "Hello world",
        "created_by": "1",
        "settings": {
          "raw_description": "Hello world",
          "mentioned_id": null
        },
        "created_at": "2025-08-06T10:10:27+00:00",
        "updated_at": "2025-08-06T10:10:27+00:00",
        "replies": [],
        "replies_count": 0,
        "avatar": "https://example.com/avatar.jpg",
        "user": {
          "ID": 1,
          "user_login": "johndoe",
          "user_nicename": "john-doe",
          "user_email": "john@example.com",
          "user_url": "https://example.com",
          "user_registered": "2024-01-01 00:00:00",
          "user_status": "0",
          "display_name": "John Doe",
          "photo": "https://example.com/avatar.jpg"
        },
        "images": []
      }
    ],
    "first_page_url": "https://example.com/wp-json/fluent-boards/v2/projects/3/tasks/85/comments/?page=1",
    "from": 1,
    "last_page": 1,
    "last_page_url": "https://example.com/wp-json/fluent-boards/v2/projects/3/tasks/85/comments/?page=1",
    "links": [
      {
        "url": null,
        "label": "pagination.previous",
        "active": false
      },
      {
        "url": "https://example.com/wp-json/fluent-boards/v2/projects/3/tasks/85/comments/?page=1",
        "label": "1",
        "active": true
      },
      {
        "url": null,
        "label": "pagination.next",
        "active": false
      }
    ],
    "next_page_url": null,
    "path": "https://example.com/wp-json/fluent-boards/v2/projects/3/tasks/85/comments",
    "per_page": 10,
    "prev_page_url": null,
    "to": 1,
    "total": 1
  },
  "total": 1
}
```

## Get Task Activities

Retrieve recent activities for a specific task.

**HTTP Request**
```
GET /wp-json/fluent-boards/v2/projects/{board_id}/tasks/{task_id}/activities
```

### Example Request

```bash
curl "https://yourdomain.com/wp-json/fluent-boards/v2/projects/{board_id}/tasks/{task_id}/activities" \
  -H "Authorization: Basic API_USERNAME:API_PASSWORD"
```

### Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `filter` | string | Sort order for activities (newest, oldest) |



### Example Response

```json
{
  "activities": {
    "current_page": 1,
    "data": [
      {
        "id": 120,
        "object_id": "85",
        "object_type": "task_activity",
        "action": "created",
        "column": "task",
        "old_value": null,
        "new_value": "Sample Task Title",
        "created_at": "2024-12-24T08:43:52+00:00",
        "user": {
          "ID": 1,
          "display_name": "John Doe",
          "user_email": "john@example.com"
        }
      },
      {
        "id": 372,
        "object_id": "85",
        "object_type": "task_activity",
        "action": "joined",
        "column": "task",
        "old_value": null,
        "new_value": null,
        "created_at": "2025-07-16T08:01:16+00:00",
        "user": {
          "ID": 1,
          "display_name": "John Doe",
          "user_email": "john@example.com"
        }
      },
      {
        "id": 373,
        "object_id": "85",
        "object_type": "task_activity",
        "action": "added",
        "column": "assignee",
        "old_value": null,
        "new_value": "Jane Smith",
        "created_at": "2025-07-16T08:01:17+00:00",
        "user": {
          "ID": 1,
          "display_name": "John Doe",
          "user_email": "john@example.com"
        }
      }
    ],
    "per_page": 15,
    "total": 13,
    "from": 1,
    "to": 13,
    "last_page": 1
    // ... pagination URLs and links
  }
}
```

## Error Responses

See [Common Error Responses](/rest-api/shared/error-responses) for standard error formats.

### Common Task-Specific Errors

- **404 Not Found** - Task not found
- **403 Forbidden** - You don't have permission to access this task
- **400 Bad Request** - Invalid task data or missing required fields
