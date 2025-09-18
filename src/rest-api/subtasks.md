# Subtasks

The Subtasks API allows you to manage subtasks within main tasks in Fluent Boards. Subtasks are regular tasks with a `parent_id` field that references their parent task, organized in groups for better organization.

## Base Endpoint

```
/fluent-boards/v2/projects/{board_id}/tasks/{task_id}/subtasks
```


```json
{
  "id": 123,
  "parent_id": "456",
  "board_id": "3",
  "crm_contact_id": null,
  "title": "Create wireframes",
  "slug": "create-wireframes",
  "type": "task",
  "status": "closed",
  "stage_id": "25",
  "source": "web",
  "source_id": null,
  "priority": "low",
  "description": "Design wireframes for the new feature",
  "lead_value": "0.00",
  "created_by": "1",
  "position": "1.00",
  "comments_count": "0",
  "issue_number": null,
  "reminder_type": "none",
  "settings": {
    "cover": {
      "backgroundColor": null
    },
    "subtask_count": null
  },
  "remind_at": null,
  "started_at": null,
  "due_at": null,
  "last_completed_at": "2024-01-15 08:01:43",
  "archived_at": null,
  "created_at": "2024-01-15T08:43:52+00:00",
  "updated_at": "2024-01-15T08:01:43+00:00",
  "meta": {
    "subtask_group_id": "127"
  },
  "repeat_task_meta": null,
  "assignees": []
}
```

### List Subtasks

Retrieve all subtasks for a parent task, organized by groups.

**HTTP Request**
```
GET /wp-json/fluent-boards/v2/projects/{board_id}/tasks/{task_id}/subtasks
```

### Example Request

```bash
curl "https://yourdomain.com/wp-json/fluent-boards/v2/projects/{board_id}/tasks/{task_id}/subtasks" \
  -H "Authorization: Basic API_USERNAME:API_PASSWORD"
```

### Example Response

```json
{
  "subtaskGroups": [
    {
      "id": 127,
      "task_id": 456,
      "subtasks": [
        {
          "id": 123,
          "parent_id": "456",
          "board_id": "3",
          "crm_contact_id": null,
          "title": "Create wireframes",
          "slug": "create-wireframes",
          "type": "task",
          "status": "closed",
          "stage_id": "25",
          "source": "web",
          "source_id": null,
          "priority": "low",
          "description": "Design wireframes for the new feature",
          "lead_value": "0.00",
          "created_by": "1",
          "position": "1.00",
          "comments_count": "0",
          "issue_number": null,
          "reminder_type": "none",
          "settings": {
            "cover": {
              "backgroundColor": null
            },
            "subtask_count": null
          },
          "remind_at": null,
          "started_at": null,
          "due_at": null,
          "last_completed_at": "2024-01-15 08:01:43",
          "archived_at": null,
          "created_at": "2024-01-15T08:43:52+00:00",
          "updated_at": "2024-01-15T08:01:43+00:00",
          "meta": {
            "subtask_group_id": "127"
          },
          "repeat_task_meta": null,
          "assignees": []
        }
      ],
      "value": "Design Phase"
    }
  ]
}
```

## Create a Subtask

Create a new subtask within a parent task.

**HTTP Request**
```
POST /wp-json/fluent-boards/v2/projects/{board_id}/tasks/{task_id}/subtasks
```

### Example Request

```bash
curl -X POST "https://yourdomain.com/wp-json/fluent-boards/v2/projects/{board_id}/tasks/{task_id}/subtasks" \
  -H "Authorization: Basic API_USERNAME:API_PASSWORD" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "The new subtask",
    "group_id": 127,
    "due_at": null,
    "add_to_top": false
  }'
```

### Request Body

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `title` | string | Yes | Title of the subtask |
| `group_id` | int | Yes | ID of the subtask group |
| `due_at` | string or null | No | Due date-time in ISO 8601 format or null |
| `add_to_top` | boolean | No | If true, adds the subtask at the top of the group (default: false) |

### Example Response

```json
{
  "subtask": {
    "parent_id": 85,
    "title": "The new subtask",
    "board_id": "3",
    "status": "open",
    "priority": "low",
    "due_at": null,
    "position": 20,
    "created_by": 1,
    "type": "task",
    "slug": "the-new-subtask",
    "settings": {
      "cover": {
        "backgroundColor": ""
      },
      "subtask_count": 0,
      "attachment_count": 0,
      "subtask_completed_count": 0
    },
    "updated_at": "2025-08-08T04:12:47+00:00",
    "created_at": "2025-08-08T04:12:47+00:00",
    "id": 284,
    "assignees": [],
    "meta": {
      "subtask_group_id": "127"
    },
    "repeat_task_meta": null
  },
  "message": "Subtask has been added"
}
```

## Create a Subtask Group

Create a new group to organize subtasks.

**HTTP Request**
```
POST /wp-json/fluent-boards/v2/projects/{board_id}/tasks/{task_id}/subtask-group
```

### Example Request

```bash
curl -X POST "https://yourdomain.com/wp-json/fluent-boards/v2/projects/{board_id}/tasks/{task_id}/subtask-group" \
  -H "Authorization: Basic API_USERNAME:API_PASSWORD" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Design Phase"
  }'
```

### Request Body

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `title` | string | Yes | Name of the subtask group |

### Example Response

```json
{
  "subtaskGroup": {
    "id": 555,
    "task_id": 85,
    "key": "group_name",
    "value": "Design Phase",
    "created_at": "2025-08-08T04:12:47+00:00",
    "updated_at": "2025-08-08T04:12:47+00:00"
  },
  "message": "New Subtask group has been added"
}
```

## Update a Subtask Group

Update the title of a subtask group.

**HTTP Request**
```
PUT /wp-json/fluent-boards/v2/projects/{board_id}/tasks/{task_id}/subtask-group
```

### Example Request

```bash
curl -X PUT "https://yourdomain.com/wp-json/fluent-boards/v2/projects/{board_id}/tasks/{task_id}/subtask-group" \
  -H "Authorization: Basic API_USERNAME:API_PASSWORD" \
  -H "Content-Type: application/json" \
  -d '{
    "group_id": 555,
    "title": "Execution Phase"
  }'
```

### Request Body

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `title` | string | Yes | New title for the group |
| `group_id` | int | Yes | ID of the group to update |

### Example Response

```json
{
  "subtaskGroup": {
    "id": 555,
    "task_id": 85,
    "key": "group_name",
    "value": "Execution Phase",
    "created_at": "2025-08-08T04:12:47+00:00",
    "updated_at": "2025-08-08T05:10:12+00:00"
  },
  "message": "Subtask group title has been added"
}
```

## Delete a Subtask Group

Delete a subtask group and its subtasks.

**HTTP Request**
```
DELETE /wp-json/fluent-boards/v2/projects/{board_id}/tasks/{task_id}/subtask-group
```

### Example Request

```bash
curl -X DELETE "https://yourdomain.com/wp-json/fluent-boards/v2/projects/{board_id}/tasks/{task_id}/subtask-group" \
  -H "Authorization: Basic API_USERNAME:API_PASSWORD" \
  -H "Content-Type: application/json" \
  -d '{
    "group_id": 555
  }'
```

### Request Body

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `group_id` | int | Yes | ID of the group to delete |

### Example Response

```json
{
  "message": "Subtask group has been deleted"
}
```

## Delete a Subtask

Delete a subtask.

**HTTP Request**
```
DELETE /wp-json/fluent-boards/v2/projects/{board_id}/tasks/{task_id}/delete-subtask
```

**Note:** `task_id` in the path is the subtask ID to delete. No request body is required.

### Example Request

```bash
curl -X DELETE "https://yourdomain.com/wp-json/fluent-boards/v2/projects/{board_id}/tasks/{task_id}/delete-subtask" \
  -H "Authorization: Basic API_USERNAME:API_PASSWORD"
```

### Example Response

```json
{
  "deletedSubtask": {
    "id": 284,
    "parent_id": "85",
    "board_id": "3",
    "crm_contact_id": null,
    "title": "The new subtask",
    "slug": "the-new-subtask",
    "type": "task",
    "status": "open",
    "stage_id": null,
    "source": "web",
    "source_id": null,
    "priority": "low",
    "description": null,
    "lead_value": "0.00",
    "created_by": "1",
    "position": "20.00",
    "comments_count": "0",
    "issue_number": null,
    "reminder_type": "none",
    "settings": {
      "cover": {
        "backgroundColor": ""
      },
      "subtask_count": 0,
      "attachment_count": 0,
      "subtask_completed_count": 0
    },
    "remind_at": null,
    "started_at": null,
    "due_at": null,
    "last_completed_at": null,
    "archived_at": null,
    "created_at": "2025-08-08T04:12:47+00:00",
    "updated_at": "2025-08-08T04:12:47+00:00",
    "subtask_group_id": "127",
    "meta": [],
    "repeat_task_meta": null
  },
  "changedSubtasks": [],
  "message": "Task has been deleted"
}
```

## Move Subtask to Group

Move a subtask from one group to another.

**HTTP Request**
```
POST /wp-json/fluent-boards/v2/projects/{board_id}/tasks/{task_id}/move-subtask
```

### Example Request

```bash
curl -X POST "https://yourdomain.com/wp-json/fluent-boards/v2/projects/{board_id}/tasks/{task_id}/move-subtask" \
  -H "Authorization: Basic API_USERNAME:API_PASSWORD" \
  -H "Content-Type: application/json" \
  -d '{
    "group_id": 127,
    "subtask_id": 284
  }'
```

### Request Body

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `group_id` | int | Yes | Target group ID |
| `subtask_id` | int or int[] | Yes | ID of the subtask to move (or an array of IDs) |

### Example Response

```json
{
  "subtask": {
    "id": 284,
    "parent_id": 85,
    "position": 21,
    "assignees": []
  },
  "message": "Subtask has been moved"
}
```

## Update Subtask Position

Move a subtask within its current group or to another group and update its position.

**HTTP Request**
```
PUT /wp-json/fluent-boards/v2/projects/{board_id}/tasks/update-subtask-position/{subtask_id}
```

**Note:** `{subtask_id}` is the subtask being repositioned. If `newSubtasksGroupId` is omitted, the API infers the current group from the subtask meta.

### Example Request

```bash
curl -X PUT "https://yourdomain.com/wp-json/fluent-boards/v2/projects/{board_id}/tasks/update-subtask-position/{subtask_id}" \
  -H "Authorization: Basic API_USERNAME:API_PASSWORD" \
  -H "Content-Type: application/json" \
  -d '{
    "newPosition": 1,
    "newSubtasksGroupId": 198
  }'
```

### Request Body

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `newPosition` | int | Yes | New position in the group |
| `newSubtasksGroupId` | int | Yes | Group ID (can be same or different) |

### Behavior

- If `newPosition` is 1, the subtask is placed at the top; the API uses fractional positions under the hood and may reindex if needed.
- If `newSubtasksGroupId` differs from the current group, the subtask is moved to the new group and positioned there.
- Response includes `changedSubtasks`: subtasks under the same parent updated within the last minute (with `assignees`).

### Example Response

```json
{
  "changedSubtasks": [
    {
      "id": 285,
      "parent_id": "85",
      "board_id": "3",
      "crm_contact_id": null,
      "title": "Hello Subtask",
      "slug": "hello-subtask",
      "type": "task",
      "status": "open",
      "stage_id": null,
      "source": "web",
      "source_id": null,
      "priority": "low",
      "description": null,
      "lead_value": "0.00",
      "created_by": "1",
      "position": "1.00",
      "comments_count": "0",
      "issue_number": null,
      "reminder_type": "none",
      "settings": {
        "cover": {
          "backgroundColor": ""
        },
        "subtask_count": 0,
        "attachment_count": 0,
        "subtask_completed_count": 0
      },
      "remind_at": null,
      "started_at": null,
      "due_at": null,
      "last_completed_at": null,
      "archived_at": null,
      "created_at": "2025-08-08T04:49:24+00:00",
      "updated_at": "2025-08-08T04:49:28+00:00",
      "meta": {
        "subtask_group_id": "198"
      },
      "repeat_task_meta": null,
      "assignees": []
    }
  ]
}
```

## Convert Task to Subtask

Convert an existing task to a subtask.

**HTTP Request**
```
PUT /wp-json/fluent-boards/v2/projects/{board_id}/tasks/{task_id}/convert-to-subtask
```

### Example Request

```bash
curl -X PUT "https://yourdomain.com/wp-json/fluent-boards/v2/projects/{board_id}/tasks/{task_id}/convert-to-subtask" \
  -H "Authorization: Basic API_USERNAME:API_PASSWORD" \
  -H "Content-Type: application/json" \
  -d '{
    "parent_id": 133,
    "assigneeId": 1
  }'
```

### Request Body

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `parent_id` | int | Yes | ID of the parent task |
| `assigneeId` | int | No | User ID to assign |
| `subtaskGroupId` | int | No | Group ID to place the subtask |

### Behavior

- Sets the task's `parent_id` and clears `stage_id`.
- If `subtaskGroupId` is provided, links the new subtask to that group; otherwise a "Default Subtask Group" is created on the parent task and the subtask is added there.
- If `assigneeId` is provided, assigns the user to the new subtask.
- Removes existing notifications for the converted task.

### Example Response

```json
{
  "message": "Task has been converted to subtask",
  "parentTask": {
    "id": 133,
    "parent_id": null,
    "board_id": "3",
    "crm_contact_id": null,
    "title": "task activity check .",
    "slug": "task-activity-check",
    "type": "task",
    "status": "open",
    "stage_id": "26",
    "source": "web",
    "source_id": null,
    "priority": "low",
    "description": "",
    "lead_value": "0.00",
    "created_by": "1",
    "position": "0.50",
    "comments_count": "0",
    "issue_number": null,
    "reminder_type": "none",
    "settings": {
      "cover": {
        "backgroundColor": ""
      },
      "subtask_count": 0,
      "attachment_count": 0,
      "subtask_completed_count": 0
    },
    "remind_at": null,
    "started_at": null,
    "due_at": null,
    "last_completed_at": null,
    "archived_at": null,
    "created_at": "2024-12-24T08:43:53+00:00",
    "updated_at": "2025-01-28T03:15:14+00:00",
    "meta": {
      "is_template": "no",
      "group_name": "Default Subtask Group"
    },
    "repeat_task_meta": null,
    "watchers": []
  }
}
```

## Move Subtask to Board

Convert a subtask back to a regular task and move it to a specific stage.

**HTTP Request**
```
PUT /wp-json/fluent-boards/v2/projects/{board_id}/tasks/{task_id}/move-to-board
```

**Note:** `{task_id}` in this route refers to the subtask ID you are converting back to a regular task and moving to the specified stage.

### Example Request

```bash
curl -X PUT "https://yourdomain.com/wp-json/fluent-boards/v2/projects/{board_id}/tasks/{task_id}/move-to-board" \
  -H "Authorization: Basic API_USERNAME:API_PASSWORD" \
  -H "Content-Type: application/json" \
  -d '{
    "stage_id": 26
  }'
```

### Request Body

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `stage_id` | int | Yes | Stage ID where the task should be moved |

### Example Response

```json
{
  "moveSubtask": {
    "id": 283,
    "parent_id": null,
    "board_id": "3",
    "crm_contact_id": null,
    "title": "Design Homepage (Cloned)",
    "slug": "customizable-dashboard-view-settings",
    "type": "task",
    "status": "open",
    "stage_id": "26",
    "source": "web",
    "source_id": null,
    "priority": "low",
    "description": "<p>It will on a Kanban Page/Table view Page. </p>\n<ol>\n<li>Label</li>\n<li>Priority</li>\n<li>Due Date</li>\n<li> </li>\n</ol>",
    "lead_value": "0.00",
    "created_by": "1",
    "position": 0.25,
    "comments_count": "0",
    "issue_number": null,
    "reminder_type": "none",
    "settings": {
      "cover": {
        "backgroundColor": ""
      },
      "subtask_count": 0,
      "attachment_count": 0,
      "subtask_completed_count": 0
    },
    "remind_at": null,
    "started_at": null,
    "due_at": "2025-07-04 23:45:00",
    "last_completed_at": null,
    "archived_at": null,
    "created_at": "2025-08-06T10:00:02+00:00",
    "updated_at": "2025-08-08T04:56:17+00:00",
    "meta": {
      "is_template": "no"
    },
    "repeat_task_meta": null
  },
  "changedSubtasks": []
}
```

## Clone a Subtask

Create a copy of an existing subtask.

**HTTP Request**
```
POST /wp-json/fluent-boards/v2/projects/{board_id}/tasks/{task_id}/clone-subtask
```

**Note:** `{task_id}` in this route refers to the subtask ID you want to clone.

### Example Request

```bash
curl -X POST "https://yourdomain.com/wp-json/fluent-boards/v2/projects/{board_id}/tasks/{task_id}/clone-subtask" \
  -H "Authorization: Basic API_USERNAME:API_PASSWORD"
```

### Behavior

- Title is suffixed with ` (cloned)`
- Retains `started_at` and `due_at`
- Keeps the same subtask group membership
- Copies assignees and watchers
- Places the clone between the original and the next subtask by position, or at the end if none exists

### Example Response

```json
{
  "subtask": {
    "parent_id": "133",
    "board_id": "3",
    "crm_contact_id": null,
    "title": "Lorem ipsum (cloned)",
    "slug": "lorem-ipsum",
    "type": "task",
    "status": "open",
    "stage_id": null,
    "source": "web",
    "source_id": null,
    "priority": "low",
    "description": null,
    "lead_value": "0.00",
    "created_by": "1",
    "position": 2,
    "comments_count": "0",
    "issue_number": null,
    "reminder_type": "none",
    "settings": {
      "cover": {
        "backgroundColor": ""
      },
      "subtask_count": 0,
      "attachment_count": 0,
      "subtask_completed_count": 0
    },
    "remind_at": null,
    "started_at": null,
    "due_at": null,
    "last_completed_at": null,
    "archived_at": null,
    "updated_at": "2025-08-08T05:02:40+00:00",
    "created_at": "2025-08-08T05:02:40+00:00",
    "id": 287,
    "meta": {
      "subtask_group_id": "200"
    },
    "repeat_task_meta": null,
    "assignees": []
  },
  "message": "Subtask has been cloned successfully"
}
```

## Error Responses

See [Common Error Responses](/rest-api/shared/error-responses) for standard error formats.

### Common Subtask-Specific Errors

- **404 Not Found** - Subtask or parent task not found
- **403 Forbidden** - You don't have permission to access this subtask
- **400 Bad Request** - Invalid subtask data or missing required fields


