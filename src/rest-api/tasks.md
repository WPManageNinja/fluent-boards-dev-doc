# Tasks

The Tasks API allows you to manage tasks within boards in Fluent Boards. You can create, read, update, and delete tasks, as well as manage their assignments, labels, and status.

## Task Object

A task represents a work item within a project.

### Properties

| Property | Type | Description |
|----------|------|-------------|
| `id` | integer | Unique identifier for the task |
| `title` | string | Task title (required) |
| `slug` | string | URL-friendly task identifier |
| `board_id` | integer | ID of the board this task belongs to |
| `parent_id` | integer | ID of parent task (for subtasks) |
| `crm_contact_id` | integer | Associated FluentCRM contact ID |
| `type` | string | Task type (task, roadmap) |
| `lead_value` | float | Lead value for the task |
| `stage_id` | integer | ID of the stage this task is in |
| `status` | string | Task status (open, closed) |
| `reminder_type` | string | Type of reminder |
| `priority` | string | Task priority (low, medium, high) |
| `archived_at` | string | Archive timestamp (null if active) |
| `remind_at` | string | Reminder timestamp |
| `source` | string | Task source (e.g., "jira") |
| `source_id` | string | Source identifier |
| `description` | string | Task description |
| `events` | array | Task events data |
| `settings` | object | Task settings (cover, subtask counts, etc.) |
| `due_at` | string | Due date and time (YYYY-MM-DD HH:MM:SS) |
| `started_at` | string | Start date (YYYY-MM-DD) |
| `last_completed_at` | string | Last completion timestamp |
| `position` | float | Position within the stage |
| `comments_count` | integer | Number of comments |
| `created_by` | integer | User ID who created the task |
| `meta` | object | Task metadata (appended) |
| `repeat_task_meta` | object | Repeat task metadata (appended) |
| `issue_number` | string | Issue number for external integrations |
| `isOverdue` | boolean | Whether the task is overdue |
| `isUpcoming` | boolean | Whether the task is upcoming |
| `contact` | object | Associated CRM contact data |
| `is_watching` | boolean | Whether current user is watching the task |
| `assignees` | array | Array of assigned users |
| `watchers` | array | Array of users watching the task |
| `notifications` | integer | Number of notifications |
| `labels` | array | Array of associated labels |
| `task_custom_fields` | array | Array of custom field values |
| `nextStage` | string | Next stage name for workflow |
| `attachments` | array | Array of task attachments |
| `board` | object | Complete board information |
| `stage` | object | Complete stage information |

### Status Values

- `open` - Active task
- `closed` - Completed task

### Priority Values

- `low` - Low priority
- `medium` - Medium priority
- `high` - High priority

### Task Types

- `task` - Regular task
- `roadmap` - Roadmap item

### Archive Status

- `null` - Active task
- `timestamp` - Archived task (shows archive timestamp)

### Settings Object

The `settings` object contains task-specific configuration:

| Property | Type | Description |
|----------|------|-------------|
| `cover.backgroundColor` | string | Task cover background color |
| `subtask_count` | integer | Number of subtasks |
| `attachment_count` | integer | Number of attachments |
| `subtask_completed_count` | integer | Number of completed subtasks |

### Contact Object

When a task has an associated CRM contact, the `contact` object contains:

| Property | Type | Description |
|----------|------|-------------|
| `id` | integer | Contact ID |
| `email` | string | Contact email |
| `first_name` | string | Contact first name |
| `last_name` | string | Contact last name |
| `full_name` | string | Contact full name |
| `avatar` | string | Contact avatar URL |
| `photo` | string | Contact photo URL |
| `status` | string | Contact status |
| `contact_type` | string | Contact type |
| `last_activity` | string | Last activity timestamp |
| `life_time_value` | string | Lifetime value |
| `total_points` | string | Total points |
| `user_id` | string | Associated user ID |
| `created_at` | object | Creation timestamp |
| `tags` | array | Associated tags |
| `lists` | array | Associated lists |

### Attachment Object

When a task has attachments, each attachment object contains:

| Property | Type | Description |
|----------|------|-------------|
| `id` | integer | Attachment ID |
| `title` | string | File name |
| `file_size` | string | File size (e.g., "2 KB") |
| `full_url` | string | Direct download URL |
| `secure_url` | string | Secure download URL |

### Board Object (Single Task)

When viewing a single task, the `board` object contains complete board information:

| Property | Type | Description |
|----------|------|-------------|
| `id` | integer | Board ID |
| `title` | string | Board title |
| `type` | string | Board type (to-do, roadmap) |
| `background` | object | Board background settings |
| `stages` | array | All board stages |

### Stage Object (Single Task)

When viewing a single task, the `stage` object contains complete stage information:

| Property | Type | Description |
|----------|------|-------------|
| `id` | integer | Stage ID |
| `title` | string | Stage title |
| `position` | string | Stage position |
| `bg_color` | string | Stage background color |

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

### Example Response

```json
{
  "message": "Task has been cloned successfully",
  "task": {
    "id": 283,
    "title": "Design Homepage (Cloned)",
    "slug": "design-homepage-cloned",
    "board_id": "3",
    "stage_id": 29,
    "status": "open",
    "priority": "low",
    "position": 0.5,
    "comments_count": 0,
    "assignees": [
      {
        "ID": 1,
        "display_name": "John Doe",
        "user_email": "john@example.com"
      }
    ],
    "labels": [
      {
        "id": 38,
        "title": "later",
        "bg_color": "#658ca5"
      }
    ]
    // other task properties
  },
  "updatedTasks": [
    // ... update tasks
  ]
}
```

## Assign Yourself to Task

Assign the current user to a task.

**HTTP Request**
```
POST /wp-json/fluent-boards/v2/projects/{board_id}/tasks/{task_id}/assign-yourself
```

### Example Request

```bash
curl "https://yourdomain.com/wp-json/fluent-boards/v2/projects/{board_id}/tasks/{task_id}/assign-yourself" \
  -X POST \
  -H "Authorization: Basic API_USERNAME:API_PASSWORD"
```


### Example Response

```json
{
  "task": {
    "id": 133,
    "title": "Sample Task",
    "slug": "sample-task",
    "board_id": "3",
    "stage_id": "26",
    "status": "open",
    "priority": "low",
    "position": 0.5,
    "comments_count": "0",
    "is_watching": true,
    "assignees": [
      {
        "ID": 1,
        "display_name": "John Doe",
        "user_email": "john@example.com",
        "photo": "https://example.com/avatar.jpg"
      }
    ],
    "watchers": [
      {
        "ID": 1,
        "display_name": "John Doe",
        "user_email": "john@example.com"
      }
    ]
    // ... other task properties
  }
}
```

## Detach Yourself from Task

Remove the current user from a task assignment.

**HTTP Request**
```
POST /wp-json/fluent-boards/v2/projects/{board_id}/tasks/{task_id}/detach-yourself
```

### Example Request

```bash
curl "https://yourdomain.com/wp-json/fluent-boards/v2/projects/{board_id}/tasks/{task_id}/detach-yourself" \
  -X POST \
  -H "Authorization: Basic API_USERNAME:API_PASSWORD"
```



### Example Response

```json
{
  "task": {
    "id": 133,
    "title": "Sample Task",
    "slug": "sample-task",
    "board_id": "3",
    "stage_id": "26",
    "status": "open",
    "priority": "low",
    "position": 0.5,
    "comments_count": "0",
    "assignees": [],
    "is_watching": false,
    "watchers": []
    // ... other task properties
  }
}
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

## Upload Task Cover Image

Upload a cover image for a task.

**HTTP Request**
```
POST /wp-json/fluent-boards/v2/projects/{board_id}/tasks/{task_id}/task-cover-image-upload
```

### Example Request

```bash
curl "https://yourdomain.com/wp-json/fluent-boards/v2/projects/{board_id}/tasks/{task_id}/task-cover-image-upload" \
  -X POST \
  -H "Authorization: Basic API_USERNAME:API_PASSWORD" \
  -F "file=@/path/to/cover.png"
```

Form data
- file (binary): Image file to upload

### Example Response

```json
{
  "message": "Image has been uploaded",
  "public_url": "https://yourdomain.com/index.php?fbs=1&fbs_type=public_url&fbs_bid=1&fbs_comment_image=aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"
}
```
## Remove Task Cover Image

Remove the cover image from a task.

**HTTP Request**
```
POST /wp-json/fluent-boards/v2/projects/{board_id}/tasks/{task_id}/remove-task-cover
```

### Example Request

```bash
curl "https://yourdomain.com/wp-json/fluent-boards/v2/projects/{board_id}/tasks/{task_id}/remove-task-cover" \
  -X POST \
  -H "Authorization: Basic API_USERNAME:API_PASSWORD"
```

### Example Response

```json
{
  "task": {
    "id": 123,
    "parent_id": null,
    "board_id": "1",
    "crm_contact_id": null,
    "title": "Sample Task Title",
    "slug": "sample-task-title",
    "type": "task",
    "status": "open",
    "stage_id": "25",
    "source": "web",
    "source_id": null,
    "priority": "low",
    "description": "<p>Task description</p>",
    "lead_value": "0.00",
    "created_by": "1",
    "position": "23.00",
    "comments_count": "3",
    "issue_number": null,
    "reminder_type": "none",
    "settings": {
      "subtask_count": "6",
      "attachment_count": "3",
      "subtask_completed_count": "2"
    },
    "remind_at": null,
    "started_at": null,
    "due_at": "2025-07-04 23:45:00",
    "last_completed_at": null,
    "archived_at": null,
    "created_at": "2024-12-24T08:43:52+00:00",
    "updated_at": "2025-08-08T06:53:07+00:00",
    "meta": {
      "is_template": "no"
    },
    "repeat_task_meta": null
  },
  "message": "Task Cover removed successfully"
}
```

## Error Responses

See [Common Error Responses](/rest-api/shared/error-responses) for standard error formats.

### Common Task-Specific Errors

- **404 Not Found** - Task not found
- **403 Forbidden** - You don't have permission to access this task
- **400 Bad Request** - Invalid task data or missing required fields

## Next Steps

- [Manage Comments](/rest-api/comments) - Work with task comments
- [Handle Subtasks](/rest-api/subtasks) - Manage task subtasks
- [Time Tracking](/rest-api/time-tracking) - Track time on tasks
- [Attachments](/rest-api/attachments) - Handle task files
- [Custom Fields](/rest-api/custom-fields) - Add custom task data 