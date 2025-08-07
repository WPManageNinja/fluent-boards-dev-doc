# Admin API

> **Note:** This documentation is under development. The Admin API provides endpoints for platform administration and management.

## Overview

The Admin API provides endpoints for managing Fluent Boards platform configuration, system settings, and administrative functions.

## Base Endpoint

```
/fluent-boards/v2/admin
```

## Available Endpoints

### System Information
- **GET** `/admin/system-info`

### Platform Statistics
- **GET** `/admin/statistics`

### User Management
- **GET** `/admin/users`
- **POST** `/admin/users`
- **PUT** `/admin/users/{user_id}`
- **DELETE** `/admin/users/{user_id}`

### Project Management
- **GET** `/admin/projects`
- **POST** `/admin/projects`
- **PUT** `/admin/projects/{project_id}`
- **DELETE** `/admin/projects/{project_id}`

### System Maintenance
- **POST** `/admin/maintenance/clear-cache`
- **POST** `/admin/maintenance/optimize-database`
- **POST** `/admin/maintenance/backup`

### License Management
- **GET** `/admin/license`
- **POST** `/admin/license/activate`
- **POST** `/admin/license/deactivate`

## System Info Object

```json
{
  "version": "2.0.0",
  "php_version": "8.1.0",
  "wordpress_version": "6.4.0",
  "database_version": "1.0.0",
  "total_projects": 25,
  "total_users": 150,
  "total_tasks": 1250,
  "storage_used": "2.5GB",
  "last_backup": "2024-01-15T10:30:00Z"
}
```

## Statistics Object

```json
{
  "projects": {
    "total": 25,
    "active": 20,
    "archived": 5
  },
  "tasks": {
    "total": 1250,
    "completed": 800,
    "pending": 300,
    "in_progress": 150
  },
  "users": {
    "total": 150,
    "active": 120,
    "inactive": 30
  },
  "storage": {
    "used": "2.5GB",
    "available": "47.5GB",
    "attachments": "1.2GB"
  }
}
```

## Features

- System monitoring
- User administration
- Project management
- Maintenance tools
- License management
- Performance analytics

---

*This documentation will be expanded with detailed examples and complete API reference.* 