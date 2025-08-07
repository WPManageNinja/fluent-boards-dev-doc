# Subtasks API

> **Note:** This documentation is under development. The Subtasks API allows you to manage subtasks within main tasks.

## Overview

The Subtasks API provides endpoints for creating, managing, and organizing subtasks within main tasks in Fluent Boards.

## Base Endpoint

```
/fluent-boards/v2/subtasks
```

## Available Endpoints

### List Subtasks
- **GET** `/projects/{board_id}/tasks/{task_id}/subtasks`

### Create Subtask
- **POST** `/projects/{board_id}/tasks/{task_id}/subtasks`

### Get Subtask
- **GET** `/subtasks/{subtask_id}`

### Update Subtask
- **PUT** `/subtasks/{subtask_id}`

### Delete Subtask
- **DELETE** `/subtasks/{subtask_id}`

### Mark Subtask Complete
- **PUT** `/subtasks/{subtask_id}/complete`

### Mark Subtask Incomplete
- **PUT** `/subtasks/{subtask_id}/incomplete`

## Subtask Object

```json
{
  "id": 123,
  "task_id": 456,
  "title": "Subtask title",
  "description": "Subtask description",
  "status": "pending",
  "priority": "medium",
  "assigned_to": 789,
  "due_date": "2024-01-20",
  "created_at": "2024-01-15T10:30:00Z",
  "updated_at": "2024-01-15T10:30:00Z"
}
```

## Status Values

- `pending` - Not started
- `in_progress` - Currently being worked on
- `completed` - Finished
- `cancelled` - Cancelled

## Priority Values

- `low` - Low priority
- `medium` - Medium priority
- `high` - High priority
- `urgent` - Urgent priority

---

*This documentation will be expanded with detailed examples and complete API reference.* 