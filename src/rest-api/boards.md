# Boards

The Boards API allows you to manage boards in Fluent Boards. You can create, read, update, and delete boards, as well as manage their members, stages, and settings.
## List All Boards

Retrieve a paginated list of boards.

**HTTP Request**
```
GET /wp-json/fluent-boards/v2/projects
```

### Example Request

```bash
curl "https://yourdomain.com/wp-json/fluent-boards/v2/projects?per_page=10&page=1" \
  -H "Authorization: Basic API_USERNAME:API_PASSWORD"
```

### Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `per_page` | integer | 10 | Number of boards per page |
| `page` | integer | 1 | Page number for pagination |
| `search` | string | - | Search boards by title |
| `type` | string | - | Filter by board type (to-do, roadmap) |
| `order_by` | string | id | Sort field (id, title, created_at) |
| `order_type` | string | DESC | Sort direction (ASC, DESC) |



### Example Response

```json
{
  "boards": {
  "current_page": 1,
  "data": [
    {
      "id": 1,
        "title": "Sample Board",
      "type": "to-do",
      "background": {
          "color": "#2196F3",
          "id": "solid_1"
        },
        "settings": {
          "tasks_count": 15
        },
        "completed_tasks_count": "5",
        "users": [
          {
            "ID": 1,
            "user_login": "admin",
            "display_name": "Admin User",
            "role": "Admin",
            "photo": "https://secure.gravatar.com/avatar/example?s=128&d=mm&r=g"
          }
        ],
        "stages": [
          {
            "id": 1,
            "title": "To Do",
            "position": "1.00"
          }
        ]
      }
    ],
    "per_page": 20,
    "total": 1
  },
  "folder_mapping": []
}
```



## Get a Single Board

Retrieve a specific board by ID.

**HTTP Request**
```
GET /wp-json/fluent-boards/v2/projects/{board_id}
```

### Example Request

```bash
curl "https://yourdomain.com/wp-json/fluent-boards/v2/projects/{board_id}" \
  -H "Authorization: Basic API_USERNAME:API_PASSWORD"
```



### Example Response

```json
{
  "board": {
    "id": 1,
    "title": "Sample Board",
    "type": "to-do",
    "background": {
      "color": "#2196F3",
      "id": "solid_1"
    },
    "settings": {
      "tasks_count": 15
    },
    "labelColor": {
      "green": "#4bce97",
      "blue": "#579dff",
      "red": "#f87168"
    },
    "labelColorText": {
      "green": "#1B2533",
      "blue": "#1B2533",
      "red": "#1B2533"
    },
    "users": [
      {
        "ID": 1,
        "user_login": "admin",
        "display_name": "Admin User",
        "role": "Admin"
      }
    ],
    "owner": {
      "ID": 1,
      "display_name": "Admin User"
    },
    "stages": [
      {
        "id": 1,
        "title": "To Do",
        "position": "1.00"
      },
      {
        "id": 2,
        "title": "In Progress",
        "position": "2.00"
      }
    ],
    "labels": [
      {
        "id": 1,
        "title": "bug",
        "bg_color": "#E6B0AA"
      },
      {
        "id": 2,
        "title": "feature",
        "bg_color": "#AED6F1"
      }
    ],
    "custom_fields": []
  }
}
```

## Create a Board

Create a new board.

**HTTP Request**
```
POST /wp-json/fluent-boards/v2/projects
```

### Request Body

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `board[title]` | string | Yes | Board title |
| `board[description]` | string | No | Board description |
| `board[type]` | string | Yes | Board type (to-do, roadmap) |
| `board[currency]` | string | No | Currency for the board |
| `folder_id` | integer | No | Folder ID to add board to (Pro feature) |
| `stages` | array | No | Custom stages for roadmap boards |

### Example Request

```bash
curl "https://yourdomain.com/wp-json/fluent-boards/v2/projects" \
  -X POST \
  -H "Authorization: Basic API_USERNAME:API_PASSWORD" \
  -H "Content-Type: application/json" \
  -d '{
    "board": {
      "title": "New Project Board",
      "description": "A new project board for development tasks",
      "type": "to-do"
    }
  }'
```

### Example Response

```json
{
  "message": "Board has been created successfully",
  "board": {
    "title": "New Project Board",
    "type": "to-do",
    "description": "A new project board for development tasks",
    "currency": "USD",
    "background": {
      "id": "solid_4",
      "is_image": false,
      "image_url": null,
      "color": "#5f27cd"
    },
    "created_by": 1,
    "id": 9,
    "meta": [],
    "isUserOnlyViewer": false
  }
}
```

## Update a Board

Update an existing board.

**HTTP Request**
```
PUT /wp-json/fluent-boards/v2/projects/{board_id}
```

### Example Request

```bash
curl "https://yourdomain.com/wp-json/fluent-boards/v2/projects/{board_id}" \
  -X PUT \
  -H "Authorization: Basic API_USERNAME:API_PASSWORD" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Updated Board Title",
    "description": "Updated board description"
  }'
```

### Request Body

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `title` | string | Yes | Board title |
| `description` | string | No | Board description |

### Example Request

```json
{
    "title": "Updated Board Title",
  "description": "Updated board description"
}
```

### Example Response

```json
{
  "message": "Board has been updated",
  "board": {
    "id": 9,
    "title": "Updated Board Title",
    "description": "Updated board description",
    "type": "to-do",
    "background": {
      "color": "#5f27cd"
    }
    // ... other board properties
  },
  "stages": [
    {
      "id": 96,
      "title": "Open",
      "position": "1.00"
      // ... other stage properties
    },
    {
      "id": 97,
      "title": "In Progress",
      "position": "2.00"
      // ... other stage properties
    },
    {
      "id": 98,
      "title": "Completed",
      "position": "3.00"
      // ... other stage properties
    }
  ]
}
```

## Delete a Board

Delete a board.

**HTTP Request**
```
DELETE /wp-json/fluent-boards/v2/projects/{board_id}
```

### Example Request

```bash
curl "https://yourdomain.com/wp-json/fluent-boards/v2/projects/{board_id}" \
  -X DELETE \
  -H "Authorization: Basic API_USERNAME:API_PASSWORD"
```



### Example Response

```json
{
  "message": "Board deleted successfully"
}
```

## Archive a Board

Archive a board .

**HTTP Request**
```
PUT /wp-json/fluent-boards/v2/projects/{board_id}/archive-board
```

### Example Request

```bash
curl "https://yourdomain.com/wp-json/fluent-boards/v2/projects/{board_id}/archive-board" \
  -X PUT \
  -H "Authorization: Basic API_USERNAME:API_PASSWORD"
```



### Example Response

```json
{
  "board": {
    "id": 9,
    "title": "Updated Board Title",
    "description": "Updated board description",
    "type": "to-do",
    "background": {
      "color": "#5f27cd"
    },
    "archived_at": "2025-08-06 06:40:05"
    // ... other board properties
  },
  "message": "Board has been archived successfully!"
}
```

## Restore a Board

Restore an archived board.

**HTTP Request**
```
PUT /wp-json/fluent-boards/v2/projects/{board_id}/restore-board
```

### Example Request

```bash
curl "https://yourdomain.com/wp-json/fluent-boards/v2/projects/{board_id}/restore-board" \
  -X PUT \
  -H "Authorization: Basic API_USERNAME:API_PASSWORD"
```



### Example Response

```json
{
  "board": {
    "id": 9,
    "title": "Updated Board Title",
    "description": "Updated board description",
    "type": "to-do",
    "background": {
      "color": "#5f27cd"
    },
    "archived_at": null
    // ... other board properties
  },
  "message": "Board has been restored successfully!"
}
```

## Duplicate a Board

Create a copy of an existing board.

**HTTP Request**
```
POST /wp-json/fluent-boards/v2/projects/{board_id}/duplicate-board
```

### Example Request

```bash
curl "https://yourdomain.com/wp-json/fluent-boards/v2/projects/{board_id}/duplicate-board" \
  -X POST \
  -H "Authorization: Basic API_USERNAME:API_PASSWORD" \
  -H "Content-Type: application/json" \
  -d '{
    "board": {"title": "Board Alpha - Copy"},
    "isWithTasks": "yes",
    "isWithLabels": "yes",
    "isWithTemplates": "no"
  }'
```

### Request Body

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `board[title]` | string | Yes | Title for the duplicated board |
| `isWithTasks` | string | No | Whether to include tasks ("yes" or "no") |
| `isWithLabels` | string | No | Whether to include labels ("yes" or "no") |
| `isWithTemplates` | string | No | Whether to include templates ("yes" or "no") |

### Example Request

```json
{
  "board": {
    "title": "Board Alpha - Copy"
  },
  "isWithTasks": "yes",
  "isWithLabels": "yes",
  "isWithTemplates": "no"
}
```

### Example Response

```json
{
  "board": {
    "id": 10,
    "title": "Board Alpha - Copy",
    "type": "to-do",
    "background": {
      "color": "#5f27cd"
    },
    "created_by": 1
    // ... other board properties
  }
}
```

## Get Board Members

Retrieve all members of a board.

**HTTP Request**
```
GET /wp-json/fluent-boards/v2/projects/{board_id}/users
```

### Example Request

```bash
curl "https://yourdomain.com/wp-json/fluent-boards/v2/projects/{board_id}/users" \
  -H "Authorization: Basic API_USERNAME:API_PASSWORD"
```



### Example Response

```json
{
  "users": [
    {
      "ID": 1,
      "display_name": "John Doe",
      "user_login": "john_doe",
      "email": "john@example.com",
      "photo": "https://secure.gravatar.com/avatar/...",
      "role": "member",
      "is_super": false,
      "is_wpadmin": true
    },
    {
      "ID": 2,
      "display_name": "Jane Smith",
      "user_login": "jane_smith",
      "email": "jane@example.com",
      "photo": "https://secure.gravatar.com/avatar/...",
      "role": "member",
      "is_super": false,
      "is_wpadmin": false
    }
  ],
  "global_admins": []
}
```

## Get Board Activities

Retrieve recent activities for a board.

**HTTP Request**
```
GET /wp-json/fluent-boards/v2/projects/{board_id}/activities
```

### Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `per_page` | integer | 20 | Number of activities per page |
| `page` | integer | 1 | Page number for pagination |

### Example Request

```bash
curl "https://yourdomain.com/wp-json/fluent-boards/v2/projects/{board_id}/activities?per_page=40&page=1" \
  -H "Authorization: Basic API_USERNAME:API_PASSWORD"
```



### Example Response

```json
{
  "activities": {
  "current_page": 1,
  "data": [
    {
        "id": 538,
        "object_id": "3",
        "object_type": "board_activity",
        "action": "deleted",
        "column": "task",
        "old_value": "Updated Task Title",
        "new_value": null,
        "description": null,
        "created_by": "1",
        "settings": null,
        "created_at": "2025-08-04T09:23:52+00:00",
        "user": {
          "ID": 1,
          "display_name": "John Doe",
          "user_login": "john_doe",
          "email": "john@example.com",
          "photo": "https://secure.gravatar.com/avatar/..."
        }
      },
      {
        "id": 533,
        "object_id": "3",
        "object_type": "board_activity",
        "action": "created",
        "column": "task",
        "old_value": null,
        "new_value": "New Task Title",
        "description": "on stage Feature Requests",
        "created_by": "1",
        "settings": {
          "task_id": 279
        },
        "created_at": "2025-08-04T09:00:39+00:00",
        "user": {
          "ID": 1,
          "display_name": "John Doe",
          "user_login": "john_doe",
          "email": "john@example.com",
          "photo": "https://secure.gravatar.com/avatar/..."
        }
      }
    ],
    "per_page": 40,
    "total": 94
    // ... other pagination properties
  }
}
```

## Error Responses

See [Common Error Responses](/rest-api/shared/error-responses) for standard error formats.

### Common Board-Specific Errors

- **404 Not Found** - Board not found
- **403 Forbidden** - You don't have permission to access this board
- **400 Bad Request** - Invalid board data or missing required fields
