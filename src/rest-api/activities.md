# Activities API

> **Note:** This documentation is under development. The Activities API allows you to retrieve activity logs and audit trails.

## Overview

The Activities API provides endpoints for retrieving activity logs, audit trails, and user activity history in Fluent Boards.

## Base Endpoint

```
/fluent-boards/v2/activities
```

## Available Endpoints

### List Activities
- **GET** `/activities`
- **GET** `/boards/{board_id}/activities`
- **GET** `/boards/{board_id}/tasks/{task_id}/activities`

### Get Activity
- **GET** `/activities/{activity_id}`

### Get User Activities
- **GET** `/users/{user_id}/activities`

### Get Activity Summary
- **GET** `/activities/summary`

### Export Activities
- **POST** `/activities/export`

## Activity Object

```json
{
  "id": 123,
  "user_id": 789,
  "action": "task_created",
  "resource_type": "task",
  "resource_id": 456,
  "description": "Created task 'Design Homepage'",
  "metadata": {
    "task_title": "Design Homepage",
    "project_id": 123,
    "priority": "high"
  },
  "ip_address": "192.168.1.1",
  "user_agent": "Mozilla/5.0...",
  "created_at": "2024-01-15T10:30:00Z"
}
```

## Activity Types

### Project Activities
- `project_created` - Project creation
- `project_updated` - Project updates
- `project_archived` - Project archival
- `project_restored` - Project restoration
- `project_deleted` - Project deletion

### Task Activities
- `task_created` - Task creation
- `task_updated` - Task updates
- `task_moved` - Task movement
- `task_assigned` - Task assignment
- `task_completed` - Task completion
- `task_deleted` - Task deletion

### User Activities
- `user_joined` - User joined project
- `user_left` - User left project
- `role_changed` - User role changes
- `permission_updated` - Permission updates

## Features

- Comprehensive audit trail
- Real-time activity feed
- Activity filtering
- Export capabilities
- Activity analytics
- Privacy controls

---

*This documentation will be expanded with detailed examples and complete API reference.* 