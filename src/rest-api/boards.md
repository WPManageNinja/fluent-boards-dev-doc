# Boards

The Boards API allows you to manage boards in Fluent Boards. You can create, read, update, and delete boards, as well as manage their members, stages, and settings.

## Board Object

A board represents a project board in your Fluent Boards system.

### Properties

| Property | Type | Description |
|----------|------|-------------|
| `id` | integer | Unique identifier for the board |
| `parent_id` | integer | Parent board ID (for nested boards) |
| `title` | string | Board title (required) |
| `description` | string | Board description |
| `type` | string | Board type (to-do, roadmap) |
| `currency` | string | Currency for the board |
| `background` | object | Background configuration (color/image) |
| `settings` | object | Board settings and configuration (serialized) |
| `created_by` | integer | User ID who created the board |
| `archived_at` | string | Archive timestamp (null if active) |
| `completed_tasks_count` | string | Number of completed tasks in the board |
| `created_at` | string | Creation timestamp (hidden in model) |
| `updated_at` | string | Last update timestamp (hidden in model) |
| `meta` | object | Additional board metadata (appended) |
| `isUserOnlyViewer` | boolean | Whether current user is only a viewer (appended) |
| `users` | array | Array of board members with their roles and preferences (relationship) |
| `owner` | object | Board owner information (relationship) |
| `stages` | array | Array of board stages (relationship) |
| `labels` | array | Array of board labels (relationship) |
| `custom_fields` | array | Array of custom fields (relationship) |
| `tasks` | array | Array of board tasks (relationship) |
| `completed_tasks` | array | Array of completed tasks (relationship) |
| `notifications` | array | Array of board notifications (relationship) |
| `comments` | array | Array of board comments (relationship) |
| `activities` | array | Array of board activities (relationship) |

### Board Types

- `to-do` - Standard task board (default)
- `roadmap` - Roadmap board

### Archive Status

Boards use `archived_at` timestamp to determine status:
- `null` - Active board
- `timestamp` - Archived board

### Model Structure

The Board model has the following characteristics:

#### Hidden Fields
- `created_at` - Creation timestamp (hidden from JSON responses)
- `updated_at` - Last update timestamp (hidden from JSON responses)

#### Appended Attributes
- `meta` - Dynamically generated from board metadata table
- `isUserOnlyViewer` - Calculated based on current user permissions

#### Fillable Fields
- `parent_id` - Parent board ID for nested boards
- `title` - Board title
- `description` - Board description
- `type` - Board type (to-do, roadmap)
- `currency` - Currency for the board
- `background` - Background configuration (serialized)
- `settings` - Board settings (serialized)
- `created_by` - User ID who created the board
- `archived_at` - Archive timestamp

#### Relationships
- `users` - Many-to-many relationship with users through `fbs_relations` table
- `owner` - Belongs to relationship with User model
- `stages` - One-to-many relationship with Stage model
- `labels` - One-to-many relationship with Label model
- `custom_fields` - One-to-many relationship with CustomField model
- `tasks` - One-to-many relationship with Task model
- `completed_tasks` - One-to-many relationship with completed tasks
- `notifications` - One-to-many relationship with Notification model
- `comments` - One-to-many relationship with Comment model
- `activities` - One-to-many relationship with Activity model

### Background Object

The `background` object is serialized in the database and contains:
- `id` - Background identifier (from predefined solid colors or custom image)
- `color` - Background color (null if using image)
- `image_url` - Background image URL (null if using color)
- `is_image` - Boolean indicating if background is an image

The background is automatically set to a random solid color if not provided during creation.

### Settings Object

The `settings` object is serialized in the database and can contain various board configuration options:
- `tasks_count` - Number of tasks in the board
- `enable_time_tracking` - Whether time tracking is enabled
- Custom settings as needed

### Label Color Palettes

The `labelColor` and `labelColorText` objects provide predefined color palettes for labels:

#### Base Colors
- `green`, `yellow`, `orange`, `red`, `purple`, `blue`, `sky`, `lime`, `pink`, `black`

#### Color Variants
Each base color has three variants:
- **Regular**: Standard color (e.g., `green: "#4bce97"`)
- **Dark**: Darker variant (e.g., `green_dark: "#1f845a"`)
- **Light**: Lighter variant (e.g., `green_light: "#baf3db"`)

#### Text Colors
The `labelColorText` object provides optimized text colors for each background:
- Dark backgrounds use white text (`#fff`)
- Light backgrounds use dark text (`#1B2533`)
- Regular backgrounds use dark text (`#1B2533`)

### User Object

Each user in the `users` array contains:
- `ID` - User ID
- `user_login` - WordPress username
- `user_nicename` - URL-friendly username
- `user_email` - User email address
- `user_url` - User's website URL
- `user_registered` - User registration date
- `user_status` - User status
- `display_name` - User's display name
- `role` - User's role in the board (Member, Admin, etc.)
- `photo` - User's avatar URL
- `pivot` - Relationship data including:
  - `object_id` - Board ID
  - `foreign_id` - User ID
  - `settings` - Serialized user settings (e.g., is_admin flag)
  - `preferences` - Serialized notification preferences
  - `created_at` - When user was added to board
  - `updated_at` - When user settings were last updated

### Owner Object

The `owner` object contains the board creator's information (belongs to relationship):
- `ID` - Owner's user ID
- `user_login` - Owner's WordPress username
- `user_nicename` - Owner's URL-friendly username
- `user_email` - Owner's email address
- `user_url` - Owner's website URL
- `user_registered` - Owner's registration date
- `user_status` - Owner's status
- `display_name` - Owner's display name
- `photo` - Owner's avatar URL

### Stage Object

Each stage in the `stages` array contains (one-to-many relationship):
- `id` - Stage ID
- `board_id` - Board ID this stage belongs to
- `title` - Stage title
- `slug` - Stage slug
- `type` - Stage type (usually "stage")
- `position` - Stage position (decimal for ordering)
- `color` - Stage color
- `bg_color` - Stage background color
- `settings` - Stage settings including default task status
- `archived_at` - Archive timestamp (null if active)
- `created_at` - Creation timestamp
- `updated_at` - Last update timestamp

Stages are ordered by position in ascending order and only non-archived stages are included.

### Label Object

Each label in the `labels` array contains (one-to-many relationship):
- `id` - Label ID
- `board_id` - Board ID this label belongs to
- `title` - Label title
- `slug` - Label slug
- `type` - Label type (usually "label")
- `position` - Label position (decimal for ordering)
- `color` - Label color
- `bg_color` - Label background color
- `settings` - Label settings
- `archived_at` - Archive timestamp (null if active)
- `created_at` - Creation timestamp
- `updated_at` - Last update timestamp

Labels are ordered by position in ascending order and only non-archived labels are included.

### Meta Object

The `meta` object contains dynamically generated board metadata:
- Key-value pairs from the `fbs_meta` table
- Object type: `Constant::OBJECT_TYPE_BOARD`
- Examples: `custom_field_positions`, `board_settings`, etc.

### Custom Fields Object

Each custom field in the `custom_fields` array contains (one-to-many relationship):
- `id` - Custom field ID
- `board_id` - Board ID this field belongs to
- `title` - Field title
- `type` - Field type
- `position` - Field position for ordering
- `settings` - Field configuration
- `archived_at` - Archive timestamp (null if active)
- `created_at` - Creation timestamp
- `updated_at` - Last update timestamp

Custom fields are ordered by position in ascending order and only non-archived fields are included.

### Tasks Object

The `tasks` relationship provides access to all tasks in the board:
- One-to-many relationship with Task model
- Includes all tasks regardless of status

### Completed Tasks Object

The `completed_tasks` relationship provides access to completed tasks:
- One-to-many relationship with Task model
- Only includes non-archived tasks with `parent_id` null and `status` closed

### Notifications Object

The `notifications` relationship provides access to board notifications:
- One-to-many relationship with Notification model
- Object type: `Constant::OBJECT_TYPE_BOARD_NOTIFICATION`

### Comments Object

The `comments` relationship provides access to board comments:
- One-to-many relationship with Comment model
- Comments associated with the board

### Activities Object

The `activities` relationship provides access to board activities:
- One-to-many relationship with Activity model
- Object type: `Constant::ACTIVITY_BOARD`


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

### Response Structure

The response includes:

#### Pagination Data
- `current_page` - Current page number
- `data` - Array of board objects
- `first_page_url` - URL for the first page
- `from` - Starting record number
- `last_page` - Total number of pages
- `last_page_url` - URL for the last page
- `links` - Array of pagination links
- `next_page_url` - URL for the next page (null if on last page)
- `path` - Base URL for pagination
- `per_page` - Number of records per page
- `prev_page_url` - URL for the previous page (null if on first page)
- `to` - Ending record number
- `total` - Total number of records

#### Board Objects in List Response
Each board object in the `data` array includes:
- Core board properties (id, title, description, type, etc.)
- `completed_tasks_count` - Number of completed tasks
- `users` - Array of board members with roles and preferences
- `stages` - Array of board stages
- `meta` - Board metadata
- `isUserOnlyViewer` - Current user's viewer status

Note: The list response does not include `owner`, `labels`, `custom_fields`, `labelColor`, `labelColorText`, `folder`, `has_timer`, or `front_url` fields.

#### Folder Mapping
- `folder_mapping` - Array containing folder information (currently empty in this example)

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

### Board Creation Process

When a board is created, the following actions occur automatically:

1. **Default Stages**: For `to-do` boards, default stages are created (To Do, In Progress, Done)
2. **Default Label**: A default label is automatically created
3. **Roadmap Stages**: For `roadmap` boards, custom stages can be provided via the `stages` parameter
4. **CRM Integration**: If `crm_contact_id` is provided, the board is associated with the CRM contact
5. **Folder Assignment**: If `folder_id` is provided (Pro feature), the board is added to the specified folder
6. **Background**: A random background color is automatically assigned if not specified

### Roadmap Board Example

```json
{
  "board": {
    "title": "Product Roadmap",
    "description": "Product development roadmap",
    "type": "roadmap"
  },
  "stages": [
    "Planning",
    "Development",
    "Testing",
    "Release"
  ]
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

Archive a board (soft delete).

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

### Board Duplication Process

When a board is duplicated, the following actions occur based on the provided parameters:

1. **Board Creation**: A new board is created with the specified title
2. **Stages Copy**: All stages from the source board are copied (required for task copying)
3. **Labels Copy**: If `isWithLabels` is "yes", all labels from the source board are copied
4. **Tasks Copy**: If `isWithTasks` is "yes", all tasks are copied with their relationships to stages and labels
5. **Templates**: If `isWithTemplates` is "yes", template-related data is included in the duplication
6. **Admin Permission**: Only admin users can duplicate boards

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

## Next Steps

- [Manage Tasks](/rest-api/tasks) - Work with board tasks
- [Handle Stages](/rest-api/stages) - Manage board stages
- [User Management](/rest-api/users) - Add/remove board members
- [Labels](/rest-api/labels) - Organize tasks with labels 