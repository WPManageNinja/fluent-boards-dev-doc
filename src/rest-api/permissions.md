# Permissions API

> **Note:** This documentation is under development. The Permissions API provides endpoints for managing user permissions and access control.

## Overview

The Permissions API provides endpoints for managing user permissions, roles, and access control across boards and system resources in Fluent Boards.

## Base Endpoint

```
/fluent-boards/v2/permissions
```

## Available Endpoints

### Get Permissions
- **GET** `/permissions`
- **GET** `/permissions/{user_id}`
- **GET** `/permissions/project/{project_id}`

### Update Permissions
- **PUT** `/permissions/{user_id}`
- **PUT** `/permissions/project/{project_id}/user/{user_id}`

### Role Management
- **GET** `/permissions/roles`
- **POST** `/permissions/roles`
- **PUT** `/permissions/roles/{role_id}`
- **DELETE** `/permissions/roles/{role_id}`

### Assign Roles
- **POST** `/permissions/assign-role`
- **DELETE** `/permissions/remove-role`

### Check Permissions
- **POST** `/permissions/check`

## Permission Types

### Project Permissions
- `view_project` - View project details
- `edit_project` - Edit project settings
- `delete_project` - Delete project
- `manage_members` - Add/remove project members
- `manage_tasks` - Create/edit/delete tasks
- `view_reports` - View project reports

### System Permissions
- `manage_users` - Manage all users
- `manage_projects` - Manage all boards
- `view_analytics` - View system analytics
- `manage_settings` - Manage system settings
- `manage_integrations` - Manage integrations

## Role Object

```json
{
  "id": 123,
  "name": "Project Manager",
  "description": "Can manage boards and tasks",
  "permissions": [
    "view_project",
    "edit_project",
    "manage_members",
    "manage_tasks",
    "view_reports"
  ],
  "is_system": false,
  "created_at": "2024-01-15T10:30:00Z",
  "updated_at": "2024-01-15T10:30:00Z"
}
```

## User Permissions Object

```json
{
  "user_id": 789,
  "global_permissions": [
    "view_analytics",
    "manage_projects"
  ],
  "project_permissions": {
    "123": [
      "view_project",
      "manage_tasks",
      "view_reports"
    ],
    "456": [
      "view_project",
      "edit_project",
      "manage_members"
    ]
  },
  "roles": [
    {
      "id": 123,
      "name": "Project Manager"
    }
  ]
}
```

## Features

- Granular permissions
- Role-based access control
- Project-specific permissions
- Permission inheritance
- Permission auditing
- Bulk permission management

---

*This documentation will be expanded with detailed examples and complete API reference.* 