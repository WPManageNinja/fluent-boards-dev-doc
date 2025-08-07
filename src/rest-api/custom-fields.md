# Custom Fields API

> **Note:** This documentation is under development. The Custom Fields API allows you to manage custom fields for tasks and projects.

## Overview

The Custom Fields API provides endpoints for creating, managing, and retrieving custom fields that can be added to tasks and projects in Fluent Boards.

## Base Endpoint

```
/fluent-boards/v2/custom-fields
```

## Available Endpoints

### List Custom Fields
- **GET** `/projects/{board_id}/custom-fields`

### Create Custom Field
- **POST** `/projects/{board_id}/custom-fields`

### Get Custom Field
- **GET** `/custom-fields/{field_id}`

### Update Custom Field
- **PUT** `/custom-fields/{field_id}`

### Delete Custom Field
- **DELETE** `/custom-fields/{field_id}`

### Get Custom Field Values
- **GET** `/projects/{board_id}/tasks/{task_id}/custom-field-values`

### Update Custom Field Values
- **PUT** `/projects/{board_id}/tasks/{task_id}/custom-field-values`

## Custom Field Object

```json
{
  "id": 123,
  "project_id": 456,
  "name": "Priority Level",
  "type": "select",
  "required": false,
  "options": ["Low", "Medium", "High", "Critical"],
  "default_value": "Medium",
  "created_at": "2024-01-15T10:30:00Z",
  "updated_at": "2024-01-15T10:30:00Z"
}
```

## Field Types

- `text` - Single line text
- `textarea` - Multi-line text
- `number` - Numeric value
- `select` - Dropdown selection
- `checkbox` - Boolean value
- `date` - Date picker
- `url` - URL field
- `email` - Email field

## Features

- Field validation
- Conditional logic
- Field dependencies
- Bulk operations
- Import/export support

---

*This documentation will be expanded with detailed examples and complete API reference.* 