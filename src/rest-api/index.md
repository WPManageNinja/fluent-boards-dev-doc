# Fluent Boards REST API

Welcome to the Fluent Boards REST API documentation. This guide will help you integrate with Fluent Boards using RESTful HTTP requests to manage boards, tasks, stages, and more.

## Overview

The Fluent Boards REST API provides programmatic access to your Fluent Boards data through standard HTTP methods. You can use this API to:

- **Manage Boards**: Create, read, update, archive and delete boards
- **Handle Tasks**: Manage tasks, subtasks, assignees, comments and attachments
- **Control Stages**: Organize tasks with custom stages and workflows
- **Administer**: Manage members and roles, webhooks, imports and global settings

Endpoints marked **Pro** need Fluent Boards Pro. Roadmap endpoints need the Fluent Roadmap add-on.

## Base URL

All API requests should be made to:

```
https://yourdomain.com/wp-json/fluent-boards/v2
```

## Quick Start

1. [Set up authentication](/rest-api/authentication) with a WordPress Application Password.
2. [List your boards](/rest-api/boards):

```bash
curl "https://yourdomain.com/wp-json/fluent-boards/v2/projects" \
  -u "USERNAME:APPLICATION_PASSWORD"
```

## Resources

| Resource | What it covers |
|---|---|
| [Boards](/rest-api/boards) | Boards (`/projects`): list, create, update, archive, duplicate |
| [Tasks](/rest-api/tasks) | Tasks on a board: create, update, move, clone |
| [Subtasks](/rest-api/subtasks) | Subtasks and subtask groups (Pro) |
| [Stages](/rest-api/stages) | Board stages (columns) |
| [Labels](/rest-api/labels) | Board labels and task labels |
| [Comments](/rest-api/comments) | Task comments and replies |
| [Attachments](/rest-api/attachments) | Task attachments (Pro) |
| [Custom Fields](/rest-api/custom-fields) | Board custom fields and task values (Pro) |
| [Folders](/rest-api/folders) | Board folders |
| [Users & Members](/rest-api/users) | Board members, invitations, board roles, member profiles |
| [Managers & Roles](/rest-api/permissions) | Global admins and bulk board access (Pro) |
| [Notifications](/rest-api/notifications) | User notifications and notification settings |
| [Activities](/rest-api/activities) | Board, task and member activity logs |
| [Time Tracking](/rest-api/time-tracking) | Time entries and timesheets (Pro) |
| [Templates](/rest-api/templates) | Board and task templates (Pro) |
| [Roadmaps](/rest-api/roadmaps) | Roadmap ideas, votes and comments (Fluent Roadmap add-on) |
| [Reports](/rest-api/reports) | Overview, tasks, activity, roadmap and timesheet reports |
| [Webhooks](/rest-api/webhooks) | Incoming and outgoing webhooks |
| [Cloud Storage](/rest-api/cloud-storage) | File storage driver settings (Pro) |
| [Import & Export](/rest-api/import-export) | JSON, Trello, Asana and CSV imports |
| [Admin Settings](/rest-api/admin) | Modules, general settings, MCP, license |
| [AI](/rest-api/ai) | AI writing assistant and task AI actions |
| [Dashboard & Utilities](/rest-api/dashboard) | Dashboard tasks, global search, selector options |
| [Public Boards](/rest-api/public-boards) | Read-only access to boards shared publicly |

To add your own endpoints under the same namespace, see [Extending the REST API](/rest-api/extend).

## Response Format

Responses are JSON. There is no shared envelope: each endpoint returns the object its controller builds, so the top-level keys differ per endpoint. For example, `GET /projects/{board_id}/labels` returns `{"labels": [...]}`, and `POST /projects/{board_id}/user/{user_id}/make-manager` returns:

```json
{
  "message": "Role updated successfully",
  "member": {
    "ID": 5,
    "display_name": "Jane Smith"
  }
}
```

Each endpoint page shows the exact keys. Paginated lists use the framework paginator, which includes `current_page`, `data`, `per_page`, `total` and `last_page` inside the key that holds the list (for example `boards` in `GET /projects`).

## Error Handling

Errors use standard HTTP status codes. Their body depends on where the request failed:

```json
{
  "code": "rest_forbidden",
  "message": "Sorry, you are not allowed to do that.",
  "data": {
    "status": 403
  }
}
```

```json
{
  "title": {
    "required": "The title field is required."
  }
}
```

The first comes from WordPress when the permission check fails; the second is a `422` validation error. Most endpoint-specific errors return `{"message": "..."}`. See [Common Error Responses](/rest-api/shared/error-responses) for all formats.

## Common HTTP Status Codes

| Code | Description |
|------|-------------|
| 200 | Success (also used for creates) |
| 400 | Bad Request |
| 401 | Not authenticated |
| 403 | Forbidden |
| 404 | Not Found |
| 409 | Conflict (for example, user already a board member) |
| 422 | Validation or business-rule error |
| 500 | Internal Server Error |

## SDKs and Tools

We don't provide official SDKs. The API works with any HTTP client library:

- **PHP**: Guzzle, cURL, `wp_remote_request()`
- **JavaScript**: Axios, Fetch API
- **Python**: Requests
- **Ruby**: Net::HTTP, HTTParty
- Any language that supports HTTP requests

## Support

For support and assistance:

- **Documentation Issues**: [Submit a GitHub issue](https://github.com/WPManageNinja/fluent-boards-dev-doc/issues)
- **API Questions**: [Contact support](https://wpmanageninja.com/support-tickets/)
- **Feature Requests/Suggestions**: [Community forum](https://community.wpmanageninja.com/portal/space/fluent-boards/)

## What's Next?

Ready to start building? Begin with [Authentication](/rest-api/authentication) to set up your API access.
