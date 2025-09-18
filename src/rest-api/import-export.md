# Import/Export API

> **Note:** This is a Pro feature. The Import/Export API allows you to import and export data from various sources.

## Overview

The Import/Export API provides endpoints for importing and exporting boards, tasks, and other data from various sources and formats in Fluent Boards Pro.

## Base Endpoint

```
/fluent-boards/v2/import-export
```

## Available Endpoints

### List Import Jobs
- **GET** `/import-export/imports`

### Start Import
- **POST** `/import-export/import`

### Get Import Status
- **GET** `/import-export/imports/{import_id}`

### Cancel Import
- **DELETE** `/import-export/imports/{import_id}`

### Export Data
- **POST** `/import-export/export`

### Get Export Status
- **GET** `/import-export/exports/{export_id}`

### Download Export
- **GET** `/import-export/exports/{export_id}/download`

## Supported Formats

### Import Formats
- CSV
- JSON
- XML
- Excel (.xlsx, .xls)
- Trello Export
- Asana Export
- Jira Export

### Export Formats
- CSV
- JSON
- Excel (.xlsx)
- PDF
- HTML

## Import Job Object

```json
{
  "id": 123,
  "type": "project_import",
  "status": "processing",
  "progress": 75,
  "total_items": 100,
  "processed_items": 75,
  "file_name": "boards.csv",
  "created_at": "2024-01-15T10:30:00Z",
  "updated_at": "2024-01-15T10:30:00Z"
}
```

## Features

- Bulk import/export
- Data validation
- Error handling
- Progress tracking
- Scheduled exports
- Template-based imports

---

*This documentation will be expanded with detailed examples and complete API reference.* 