# Templates API

> **Note:** This is a Pro feature. The Templates API allows you to create and manage project and task templates.

## Overview

The Templates API provides endpoints for creating, managing, and using templates for boards and tasks in Fluent Boards Pro.

## Base Endpoint

```
/fluent-boards/v2/templates
```

## Available Endpoints

### List Templates
- **GET** `/templates`
- **GET** `/templates/project`
- **GET** `/templates/task`

### Create Template
- **POST** `/templates`

### Get Template
- **GET** `/templates/{template_id}`

### Update Template
- **PUT** `/templates/{template_id}`

### Delete Template
- **DELETE** `/templates/{template_id}`

### Use Template
- **POST** `/templates/{template_id}/use`

### Duplicate Template
- **POST** `/templates/{template_id}/duplicate`

## Template Object

```json
{
  "id": 123,
  "name": "Software Development Project",
  "type": "project",
  "description": "Template for software development boards",
  "is_public": false,
  "created_by": 789,
  "usage_count": 15,
  "created_at": "2024-01-15T10:30:00Z",
  "updated_at": "2024-01-15T10:30:00Z"
}
```

## Template Types

- `project` - Complete project template with stages and tasks
- `task` - Individual task template
- `workflow` - Workflow template with automation rules

## Features

- Pre-built templates
- Custom template creation
- Template sharing
- Version control
- Template categories
- Bulk template operations

---

*This documentation will be expanded with detailed examples and complete API reference.* 