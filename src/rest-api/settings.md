# Settings API

> **Note:** This documentation is under development. The Settings API provides endpoints for managing platform settings and configuration.

## Overview

The Settings API provides endpoints for managing Fluent Boards platform settings, user preferences, and system configuration.

## Base Endpoint

```
/fluent-boards/v2/settings
```

## Available Endpoints

### Get Settings
- **GET** `/settings`
- **GET** `/settings/{setting_group}`

### Update Settings
- **PUT** `/settings`
- **PUT** `/settings/{setting_group}`

### Reset Settings
- **POST** `/settings/reset`

### Export Settings
- **GET** `/settings/export`

### Import Settings
- **POST** `/settings/import`

## Setting Groups

### General Settings
- `general` - General platform settings
- `appearance` - UI and appearance settings
- `notifications` - Notification preferences
- `security` - Security and privacy settings

### Project Settings
- `projects` - Default board settings
- `tasks` - Default task settings
- `stages` - Default stage settings
- `labels` - Label configuration

### Integration Settings
- `integrations` - Third-party integrations
- `webhooks` - Webhook configuration
- `api` - API settings and limits

## Settings Object

```json
{
  "general": {
    "site_name": "Fluent Boards",
    "timezone": "UTC",
    "date_format": "Y-m-d",
    "time_format": "H:i:s",
    "language": "en"
  },
  "appearance": {
    "theme": "light",
    "primary_color": "#7742e6",
    "sidebar_collapsed": false,
    "compact_mode": false
  },
  "notifications": {
    "email_notifications": true,
    "push_notifications": true,
    "task_assignments": true,
    "project_updates": true,
    "due_date_reminders": true
  },
  "security": {
    "session_timeout": 3600,
    "password_policy": "strong",
    "two_factor_auth": false,
    "ip_whitelist": []
  }
}
```

## Features

- Hierarchical settings
- Setting validation
- Import/export functionality
- Setting inheritance
- User-specific overrides
- Setting history

---

*This documentation will be expanded with detailed examples and complete API reference.* 