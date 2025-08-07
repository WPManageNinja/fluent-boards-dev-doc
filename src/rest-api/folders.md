# Folders API

> **Note:** This is a Pro feature. The Folders API allows you to organize projects into folders for better management.

## Overview

The Folders API provides endpoints for creating, managing, and organizing projects into folders in Fluent Boards Pro.

## Base Endpoint

```
/fluent-boards/v2/folders
```

## Available Endpoints

### List Folders
- **GET** `/folders`

### Create Folder
- **POST** `/folders`

### Get Folder
- **GET** `/folders/{folder_id}`

### Update Folder
- **PUT** `/folders/{folder_id}`

### Delete Folder
- **DELETE** `/folders/{folder_id}`

### Get Folder Projects
- **GET** `/folders/{folder_id}/projects`

### Move Project to Folder
- **PUT** `/folders/{folder_id}/projects/{project_id}`

### Remove Project from Folder
- **DELETE** `/folders/{folder_id}/projects/{project_id}`

## Folder Object

```json
{
  "id": 123,
  "name": "Marketing Projects",
  "description": "All marketing related projects",
  "color": "#ff6b6b",
  "icon": "📊",
  "project_count": 5,
  "created_at": "2024-01-15T10:30:00Z",
  "updated_at": "2024-01-15T10:30:00Z"
}
```

## Features

- Nested folder structure
- Color coding
- Custom icons
- Project organization
- Bulk operations
- Folder permissions

---

*This documentation will be expanded with detailed examples and complete API reference.* 