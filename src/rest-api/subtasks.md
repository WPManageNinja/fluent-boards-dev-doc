# Subtasks API

> **Note:** This documentation covers the Subtasks API for managing subtasks within main tasks in Fluent Boards.

## Overview

Subtasks in Fluent Boards are regular tasks with a `parent_id` field that references their parent task. They share the same model structure as regular tasks but are organized in groups within the parent task.

## Base Endpoint

```
/fluent-boards/v2/projects/{board_id}/tasks/{task_id}/subtasks
```

## Subtask Object

Subtasks use the same structure as regular tasks with additional parent relationship and group metadata:

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

### Key Properties

| Property | Type | Description |
|----------|------|-------------|
| `parent_id` | string | **Required.** ID of the parent task |
| `title` | string | **Required.** Title of the subtask |
| `status` | string | Task status: `open` or `closed` |
| `priority` | string | Priority: `low`, `medium`, `high` |
| `due_at` | string or null | Due date-time in ISO 8601 format (or null) |
| `position` | number | Position within the subtask group |
| `assignees` | array | Array of assigned users |
| `meta.subtask_group_id` | string | ID of the subtask group this subtask belongs to |
| `last_completed_at` | string | Timestamp when the subtask was completed (null if open) |
| `comments_count` | string | Number of comments on the subtask |

## Available Endpoints

### Quick Reference

| Method | Path |
|--------|------|
| GET | `/wp-json/fluent-boards/v2/projects/{board_id}/tasks/{task_id}/subtasks` |
| POST | `/wp-json/fluent-boards/v2/projects/{board_id}/tasks/{task_id}/subtasks` |
| POST | `/wp-json/fluent-boards/v2/projects/{board_id}/tasks/{task_id}/subtask-group` |
| PUT | `/wp-json/fluent-boards/v2/projects/{board_id}/tasks/{task_id}/subtask-group` |
| DELETE | `/wp-json/fluent-boards/v2/projects/{board_id}/tasks/{task_id}/subtask-group` |
| POST | `/wp-json/fluent-boards/v2/projects/{board_id}/tasks/{task_id}/move-subtask` |
| PUT | `/wp-json/fluent-boards/v2/projects/{board_id}/tasks/update-subtask-position/{subtask_id}` |
| DELETE | `/wp-json/fluent-boards/v2/projects/{board_id}/tasks/{task_id}/delete-subtask` |
| PUT | `/wp-json/fluent-boards/v2/projects/{board_id}/tasks/{task_id}/convert-to-subtask` |
| PUT | `/wp-json/fluent-boards/v2/projects/{board_id}/tasks/{task_id}/move-to-board` |
| POST | `/wp-json/fluent-boards/v2/projects/{board_id}/tasks/{task_id}/clone-subtask` |

Notes:
- `{task_id}` usually refers to the parent task, except where explicitly noted (Delete Subtask, Move to Board, Clone Subtask, Convert to Subtask).
- `{subtask_id}` is used in Update Subtask Position.

### List Subtasks

Retrieve all subtasks for a parent task, organized by groups.

**HTTP Request**
```
GET /wp-json/fluent-boards/v2/projects/{board_id}/tasks/{task_id}/subtasks
```

Path Params:
- `board_id`: The board ID.
- `task_id`: The parent task ID whose subtasks will be listed.

**Example Response**
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
        },
        {
          "id": 124,
          "parent_id": "456",
          "board_id": "3",
          "crm_contact_id": null,
          "title": "Design mockups",
          "slug": "design-mockups",
          "type": "task",
          "status": "closed",
          "stage_id": "25",
          "source": "web",
          "source_id": null,
          "priority": "medium",
          "description": "Create high-fidelity mockups",
          "lead_value": "0.00",
          "created_by": "1",
          "position": "2.00",
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
          "last_completed_at": "2024-01-15 08:01:42",
          "archived_at": null,
          "created_at": "2024-01-15T08:43:52+00:00",
          "updated_at": "2024-01-15T08:01:42+00:00",
          "meta": {
            "subtask_group_id": "127"
          },
          "repeat_task_meta": null,
          "assignees": []
        },
      ],
      "value": "Design Phase"
    }
  ]
}
```

### Create Subtask

Create a new subtask within a parent task.

**HTTP Request**
```
POST /wp-json/fluent-boards/v2/projects/{board_id}/tasks/{task_id}/subtasks
```

Path Params:
- `board_id`: The board ID.
- `task_id`: The parent task ID where the subtask will be created.

**Request Body**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `title` | string | Yes | Title of the subtask |
| `group_id` | int | Yes | ID of the subtask group |
| `due_at` | string or null | No | Due date-time in ISO 8601 format or null |
| `add_to_top` | boolean | No | If true, adds the subtask at the top of the group (default: false) |

**Example Request**
```json
{
  "title": "The new subtask",
  "group_id": 127,
  "due_at": null,
  "add_to_top": false
}
```

**Example Response**
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

### Create Subtask Group

Create a new group to organize subtasks.

**HTTP Request**
```
POST /wp-json/fluent-boards/v2/projects/{board_id}/tasks/{task_id}/subtask-group
```

Path Params:
- `board_id`: The board ID.
- `task_id`: The parent task ID where the group will be created.

**Request Body**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `title` | string | Yes | Name of the subtask group |

**Example Request**
```json
{
  "title": "Design Phase"
}
```

**Example Response**
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

### Update Subtask Group

Update the title of a subtask group.

**HTTP Request**
```
PUT /wp-json/fluent-boards/v2/projects/{board_id}/tasks/{task_id}/subtask-group
```

Path Params:
- `board_id`: The board ID.
- `task_id`: The parent task ID containing the group.

**Request Body**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `title` | string | Yes | New title for the group |
| `group_id` | int | Yes | ID of the group to update |

**Example Request**
```json
{
  "group_id": 555,
  "title": "Execution Phase"
}
```

**Example Response**
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

### Delete Subtask Group

Delete a subtask group and its subtasks.

**HTTP Request**
```
DELETE /wp-json/fluent-boards/v2/projects/{board_id}/tasks/{task_id}/subtask-group
```

Path Params:
- `board_id`: The board ID.
- `task_id`: The parent task ID containing the group to delete.

**Request Body**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `group_id` | int | Yes | ID of the group to delete |

**Example Request**
```json
{
  "group_id": 555
}
```

**Example Response**
```json
{
  "message": "Subtask group has been deleted"
}
```

### Delete Subtask

Delete a subtask.

**HTTP Request**
```
DELETE /wp-json/fluent-boards/v2/projects/{board_id}/tasks/{task_id}/delete-subtask
```

Note: `task_id` in the path is the subtask ID to delete. No request body is required.

Path Params:
- `board_id`: The board ID.
- `task_id`: The subtask ID to delete.

**Example Response**
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

### Move Subtask to Group

Move a subtask from one group to another.

**HTTP Request**
```
POST /wp-json/fluent-boards/v2/projects/{board_id}/tasks/{task_id}/move-subtask
```

Path Params:
- `board_id`: The board ID.
- `task_id`: The parent task ID under which the subtask(s) belong.

**Request Body**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `group_id` | int | Yes | Target group ID |
| `subtask_id` | int or int[] | Yes | ID of the subtask to move (or an array of IDs) |

**Example Request (single)**
```json
{
  "group_id": 127,
  "subtask_id": 284
}
```

**Example Request (multiple)**
```json
{
  "group_id": 127,
  "subtask_id": [284, 285, 286]
}
```

**Example Response (single)**
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

### Move or Update Subtask Position

Move a subtask within its current group or to another group and update its position.

**HTTP Request**
```
PUT /wp-json/fluent-boards/v2/projects/{board_id}/tasks/update-subtask-position/{subtask_id}
```

Note: `{subtask_id}` is the subtask being repositioned. If `newSubtasksGroupId` is omitted, the API infers the current group from the subtask meta.

Path Params:
- `board_id`: The board ID.
- `subtask_id`: The subtask ID to move or reposition.

**Request Body**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `newPosition` | int | Yes | New position in the group |
| `newSubtasksGroupId` | int | Yes | Group ID (can be same or different) |

Behavior:
- If `newPosition` is 1, the subtask is placed at the top; the API uses fractional positions under the hood and may reindex if needed.
- If `newSubtasksGroupId` differs from the current group, the subtask is moved to the new group and positioned there.
- Response includes `changedSubtasks`: subtasks under the same parent updated within the last minute (with `assignees`).

**Example Request**
```json
{
  "newPosition": 1,
  "newSubtasksGroupId": 198
}
```

**Example Response**
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

### Convert Task to Subtask

Convert an existing task to a subtask.

**HTTP Request**
```
PUT /wp-json/fluent-boards/v2/projects/{board_id}/tasks/{task_id}/convert-to-subtask
```

Path Params:
- `board_id`: The board ID.
- `task_id`: The task ID that will be converted into a subtask.

**Request Body**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `parent_id` | int | Yes | ID of the parent task |
| `assigneeId` | int | No | User ID to assign |
| `subtaskGroupId` | int | No | Group ID to place the subtask |

**Behavior**
- Sets the task's `parent_id` and clears `stage_id`.
- If `subtaskGroupId` is provided, links the new subtask to that group; otherwise a "Default Subtask Group" is created on the parent task and the subtask is added there.
- If `assigneeId` is provided, assigns the user to the new subtask.
- Removes existing notifications for the converted task.

**Example Request**
```json
{
  "parent_id": 133,
  "assigneeId": 1
}
```

**Example Response**
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

### Move Subtask to Board

Convert a subtask back to a regular task and move it to a specific stage.

**HTTP Request**
```
PUT /wp-json/fluent-boards/v2/projects/{board_id}/tasks/{task_id}/move-to-board
```

Note: `{task_id}` in this route refers to the subtask ID you are converting back to a regular task and moving to the specified stage.

Path Params:
- `board_id`: The board ID.
- `task_id`: The subtask ID to convert and move to a board stage.

**Request Body**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `stage_id` | int | Yes | Stage ID where the task should be moved |

**Example Request**
```json
{
  "stage_id": 26
}
```

**Example Response**
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
    "description": "<p>It will on a Kanban Page/Table view Page. </p>\n<ol>\n<li>Label</li>\n<li>Priority</li>\n<li>Due Date</li>\n<li> </li>\n</ol>",
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

### Clone Subtask

Create a copy of an existing subtask.

**HTTP Request**
```
POST /wp-json/fluent-boards/v2/projects/{board_id}/tasks/{task_id}/clone-subtask
```

Note: `{task_id}` in this route refers to the subtask ID you want to clone.

Path Params:
- `board_id`: The board ID.
- `task_id`: The subtask ID to clone.

**Behavior**
- Title is suffixed with ` (cloned)`
- Retains `started_at` and `due_at`
- Keeps the same subtask group membership
- Copies assignees and watchers
- Places the clone between the original and the next subtask by position, or at the end if none exists

**Example Response**
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

## Features

- **Group Organization**: Subtasks are organized in groups within parent tasks
- **Position Management**: Subtasks have positions within their groups for ordering
- **Assignee Support**: Subtasks can have assignees like regular tasks
- **Status Tracking**: Subtasks can be marked as open or closed
- **Conversion**: Tasks can be converted to subtasks and vice versa
- **Cloning**: Subtasks can be cloned to create duplicates
- **Parent Task Integration**: Parent tasks automatically track subtask counts and completion status

## Status Values

- `open` - Active subtask
- `closed` - Completed subtask