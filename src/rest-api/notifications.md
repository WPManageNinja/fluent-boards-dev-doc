# Notifications API

> **Note:** This documentation is under development. The Notifications API allows you to manage and send notifications.

## Overview

The Notifications API provides endpoints for managing and sending notifications to users about project updates, task assignments, and other events in Fluent Boards.

## Base Endpoint

```
/fluent-boards/v2/notifications
```

## Available Endpoints

### List Notifications
- **GET** `/notifications`

### Get Notification
- **GET** `/notifications/{notification_id}`

### Mark as Read
- **PUT** `/notifications/{notification_id}/read`

### Mark All as Read
- **PUT** `/notifications/read-all`

### Delete Notification
- **DELETE** `/notifications/{notification_id}`

### Send Notification
- **POST** `/notifications/send`

### Get Notification Settings
- **GET** `/notifications/settings`

### Update Notification Settings
- **PUT** `/notifications/settings`

## Notification Object

```json
{
  "id": 123,
  "user_id": 789,
  "type": "task_assigned",
  "title": "New Task Assigned",
  "message": "You have been assigned to 'Design Homepage'",
  "data": {
    "task_id": 456,
    "project_id": 123,
    "assigned_by": 999
  },
  "is_read": false,
  "created_at": "2024-01-15T10:30:00Z"
}
```

## Notification Types

- `task_assigned` - Task assignment
- `task_completed` - Task completion
- `project_updated` - Project updates
- `comment_added` - New comments
- `due_date_approaching` - Due date reminders
- `mention` - User mentions
- `project_invitation` - Project invitations

## Features

- Real-time notifications
- Email integration
- Push notifications
- Custom notification templates
- Notification preferences
- Bulk operations

---

*This documentation will be expanded with detailed examples and complete API reference.* 