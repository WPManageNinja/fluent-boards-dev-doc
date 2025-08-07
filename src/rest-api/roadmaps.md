# Roadmaps API

> **Note:** This is a Pro feature. The Roadmaps API allows you to create and manage project roadmaps and timelines.

## Overview

The Roadmaps API provides endpoints for creating, managing, and visualizing project roadmaps and timelines in Fluent Boards Pro.

## Base Endpoint

```
/fluent-boards/v2/roadmaps
```

## Available Endpoints

### List Roadmaps
- **GET** `/roadmaps`

### Create Roadmap
- **POST** `/roadmaps`

### Get Roadmap
- **GET** `/roadmaps/{roadmap_id}`

### Update Roadmap
- **PUT** `/roadmaps/{roadmap_id}`

### Delete Roadmap
- **DELETE** `/roadmaps/{roadmap_id}`

### Get Roadmap Timeline
- **GET** `/roadmaps/{roadmap_id}/timeline`

### Add Board to Roadmap
- **POST** `/roadmaps/{roadmap_id}/boards`

### Remove Board from Roadmap
- **DELETE** `/roadmaps/{roadmap_id}/boards/{board_id}`

## Roadmap Object

```json
{
  "id": 123,
  "name": "Product Development Roadmap",
  "description": "Q1 2024 Product Development Timeline",
  "start_date": "2024-01-01",
  "end_date": "2024-03-31",
  "view_type": "timeline",
  "is_public": false,
  "created_by": 789,
  "created_at": "2024-01-15T10:30:00Z",
  "updated_at": "2024-01-15T10:30:00Z"
}
```

## View Types

- `timeline` - Gantt chart style timeline
- `kanban` - Kanban board view
- `calendar` - Calendar view
- `list` - List view

## Features

- Interactive timeline
- Milestone tracking
- Dependency management
- Progress visualization
- Export capabilities
- Public sharing

---

*This documentation will be expanded with detailed examples and complete API reference.* 