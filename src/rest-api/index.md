# Fluent Boards REST API

Welcome to the Fluent Boards REST API documentation. This comprehensive guide will help you integrate with Fluent Boards using RESTful HTTP requests to manage boards, tasks, stages, and more.

## Overview

The Fluent Boards REST API provides programmatic access to your Fluent Boards data through standard HTTP methods. You can use this API to:

- **Manage Boards**: Create, read, update, and delete boards
- **Handle Tasks**: Manage tasks, subtasks, and task assignments
- **Control Stages**: Organize tasks with custom stages and workflows
- **Access Analytics**: Retrieve performance data and reports
- **Configure Integrations**: Set up webhooks and external connections
- **Manage Users**: Handle board members, permissions, and roles
- **Time Tracking**: Track time spent on tasks and generate reports
- **File Management**: Handle task attachments and file uploads

## Base URL

All API requests should be made to:
```
https://yourdomain.com/wp-json/fluent-boards/v2
```

## Quick Start

1. [Explore available endpoints](/rest-api/boards)
2. [Make your first API call](/rest-api/boards#list-all-boards)

## Available Resources

### Core Resources
- **[Boards](/rest-api/boards)** - Manage boards
- **[Tasks](/rest-api/tasks)** - Handle tasks and task operations
- **[Stages](/rest-api/stages)** - Manage project stages and workflows
- **[Users & Members](/rest-api/users)** - Handle board members and permissions
- **[Labels](/rest-api/labels)** - Organize tasks with labels
- **[Comments](/rest-api/comments)** - Handle task comments and discussions


### Pro Features
- **[Subtasks](/rest-api/subtasks)** - Manage task subtasks and checklists
- **[Attachments](/rest-api/attachments)** - Manage task files and attachments
- **[Time Tracking](/rest-api/time-tracking)** - Track time and generate reports
- **[Custom Fields](/rest-api/custom-fields)** - Handle custom task data
- **[Folders](/rest-api/folders)** - Organize boards into folders
- **[Templates](/rest-api/templates)** - Work with board and task templates
- **[Roadmaps](/rest-api/roadmaps)** - Manage project roadmaps and timelines
- **[Cloud Storage](/rest-api/cloud-storage)** - Configure external storage
- **[Import/Export](/rest-api/import-export)** - Import and export data

### Integration & Automation
- **[Webhooks](/rest-api/webhooks)** - Set up webhook integrations
- **[Notifications](/rest-api/notifications)** - Handle user notifications

### Analytics & Monitoring
- **[Reports](/rest-api/reports)** - Access analytics and performance data
- **[Activities](/rest-api/activities)** - Track board and task activities

### Administration
- **[Admin](/rest-api/admin)** - Platform administration and management
- **[Settings](/rest-api/settings)** - Platform settings and configuration
- **[Permissions](/rest-api/permissions)** - User permissions and access control

## Response Format

All API responses are returned in JSON format with consistent structure:

```json
{
  "data": {}, // Response data
  "message": "Success message",
  "total": 100, // For paginated responses
  "current_page": 1,
  "per_page": 15
}
```

## Error Handling

The API uses standard HTTP status codes and returns detailed error messages:

```json
{
  "code": "rest_invalid_param",
  "message": "Invalid parameter: title is required",
  "data": {
    "status": 400
  }
}
```

## Common HTTP Status Codes

| Code | Description |
|------|-------------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request |
| 401 | Unauthorized |
| 403 | Forbidden |
| 404 | Not Found |
| 422 | Validation Error |
| 500 | Internal Server Error |

## SDKs and Tools

While we don't provide official SDKs, the API works with any HTTP client library:
- **PHP**: Guzzle, cURL
- **JavaScript**: Axios, Fetch API
- **Python**: Requests
- **Ruby**: HTTParty
- Any language that supports HTTP requests

## Support

For support and assistance:

- **Documentation Issues**: [Submit a GitHub issue](https://github.com/FluentBoards/fluent-boards-developers-docs/issues)
- **API Questions**: [Contact support](https://wpmanageninja.com/support-tickets/)
- **Feature Requests/Suggestions**: [Community forum](https://community.wpmanageninja.com/portal/space/fluent-boards/)

## What's Next?

Ready to start building? Begin with [Boards](/rest-api/boards) to explore the available endpoints. 