# Users & Members

The Users & Members API allows you to manage board members, permissions, and user roles in Fluent Boards. You can add, remove, and manage user permissions across projects.

::: warning Note
Endpoints labeled "Pro" require Fluent Boards Pro.
:::

## List All Users

Retrieve all users in the system with their board memberships and roles.

**HTTP Request**
```
GET /wp-json/fluent-boards/v2/fluent-boards-users
```

### Example Request

```bash
curl "https://yourdomain.com/wp-json/fluent-boards/v2/fluent-boards-users" \
  -H "Authorization: Basic API_USERNAME:API_PASSWORD"
```



### Example Response

```json
{
  "users": [
    {
      "ID": 1,
      "display_name": "John Doe",
      "photo": "https://secure.gravatar.com/avatar/example1?s=128&d=mm&r=g",
      "email": "john@example.com",
      "boards": [
        {
          "id": 1,
          "title": "Project Alpha",
          "role": "admin"
        },
        {
          "id": 2,
          "title": "Project Beta",
          "role": "member"
        }
      ],
      "is_super": false,
      "is_wpadmin": true
    },
    {
      "ID": 2,
      "display_name": "Jane Smith",
      "photo": "https://secure.gravatar.com/avatar/example2?s=128&d=mm&r=g",
      "email": "jane@example.com",
      "boards": [
        {
          "id": 1,
          "title": "Project Alpha",
          "role": "member"
        }
      ],
      "is_super": false,
      "is_wpadmin": false
    }
  ],
  "boards": [
    {
      "id": 1,
      "title": "Project Alpha",
      "meta": {
        "custom_field_positions": "yes"
      },
      "isUserOnlyViewer": false
    },
    {
      "id": 2,
      "title": "Project Beta",
      "meta": {
        "custom_field_positions": "yes"
      },
      "isUserOnlyViewer": false
    }
  ]
}
```

## Search Users

Search for users by display name. Returns users who are members of boards and match the search criteria.

**HTTP Request**
```
GET /wp-json/fluent-boards/v2/search-fluent-boards-users
```

### Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `searchInput` | string | Search term for user display name |

### Example Request

```bash
curl "https://yourdomain.com/wp-json/fluent-boards/v2/search-fluent-boards-users" \
  -H "Authorization: Basic API_USERNAME:API_PASSWORD" \
  -H "Content-Type: application/json" \
  -d '{
    "searchInput": "john"
  }'
```



### Example Response

```json
[
  {
    "ID": 1,
    "user_login": "johndoe",
    "user_nicename": "john-doe",
    "user_email": "john@example.com",
    "user_url": "http://example.com",
    "user_registered": "2024-01-15 10:30:00",
    "user_status": "0",
    "display_name": "John Doe",
    "photo": "https://secure.gravatar.com/avatar/example1?s=128&d=mm&r=g",
    "which_boards": [
      {
        "id": 1,
        "parent_id": null,
        "title": "Project Alpha",
        "description": "Main project board",
        "type": "to-do",
        "currency": "USD",
        "background": {
          "id": "solid_1",
          "is_image": false,
          "image_url": null,
          "color": "#2196F3"
        },
        "settings": {
          "tasks_count": 25
        },
        "created_by": "1",
        "archived_at": null,
        "meta": {
          "custom_field_positions": "yes"
        },
        "isUserOnlyViewer": false,
        "pivot": {
          "foreign_id": "1",
          "object_id": "1",
          "settings": "a:1:{s:8:\"is_admin\";b:1;}",
          "preferences": "a:7:{s:19:\"email_after_comment\";b:1;s:23:\"email_after_task_assign\";b:1;s:29:\"email_after_task_stage_change\";b:1;s:32:\"email_after_task_due_date_change\";b:1;s:28:\"email_after_remove_from_task\";b:1;s:24:\"email_after_task_archive\";b:1;s:22:\"dashboard_notification\";b:1;}",
          "created_at": "2024-01-15T10:30:00+00:00",
          "updated_at": "2024-01-15T10:30:00+00:00"
        }
      }
    ],
    "is_wpadmin": true,
    "is_super": false
  },
  {
    "ID": 2,
    "user_login": "janesmith",
    "user_nicename": "jane-smith",
    "user_email": "jane@example.com",
    "user_url": "",
    "user_registered": "2024-02-01 09:15:00",
    "user_status": "0",
    "display_name": "Jane Smith",
    "photo": "https://secure.gravatar.com/avatar/example2?s=128&d=mm&r=g",
    "which_boards": [
      {
        "id": 2,
        "parent_id": null,
        "title": "Project Beta",
        "description": "Secondary project board",
        "type": "to-do",
        "currency": "USD",
        "background": {
          "id": "solid_2",
          "is_image": false,
          "image_url": null,
          "color": "#4CAF50"
        },
        "settings": {
          "tasks_count": 15
        },
        "created_by": "1",
        "archived_at": null,
        "meta": {
          "custom_field_positions": "yes"
        },
        "isUserOnlyViewer": false,
        "pivot": {
          "foreign_id": "2",
          "object_id": "2",
          "settings": "a:1:{s:8:\"is_admin\";b:0;}",
          "preferences": "a:7:{s:19:\"email_after_comment\";b:1;s:23:\"email_after_task_assign\";b:1;s:29:\"email_after_task_stage_change\";b:1;s:32:\"email_after_task_due_date_change\";b:1;s:28:\"email_after_remove_from_task\";b:1;s:24:\"email_after_task_archive\";b:1;s:22:\"dashboard_notification\";b:1;}",
          "created_at": "2024-02-01T09:15:00+00:00",
          "updated_at": "2024-02-01T09:15:00+00:00"
        }
      }
    ],
    "all_boards": null,
    "is_super": false,
    "is_wpadmin": false
  }
]
```

## Get Project Members

Retrieve all members of a specific project.

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
      "user_login": "johndoe",
      "email": "john@example.com",
      "photo": "https://secure.gravatar.com/avatar/example1?s=128&d=mm&r=g",
      "role": "admin",
      "is_super": false,
      "is_wpadmin": true
    },
    {
      "ID": 2,
      "display_name": "Jane Smith",
      "user_login": "janesmith",
      "email": "jane@example.com",
      "photo": "https://secure.gravatar.com/avatar/example2?s=128&d=mm&r=g",
      "role": "member",
      "is_super": false,
      "is_wpadmin": false
    }
  ],
  "global_admins": []
}
```

## Add Members to Project

Add a single user to a project. The user can be added as a regular member or as a viewer only.

**HTTP Request**
```
POST /wp-json/fluent-boards/v2/projects/{board_id}/add-members
```

### Request Body

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `memberId` | integer | Yes | ID of the user to add |
| `isViewerOnly` | string | No | Set to 'yes' to add as viewer only |



### Example Request

```bash
curl "https://yourdomain.com/wp-json/fluent-boards/v2/projects/{board_id}/add-members" \
  -X POST \
  -H "Authorization: Basic API_USERNAME:API_PASSWORD" \
  -H "Content-Type: application/json" \
  -d '{
    "memberId": 5,
    "isViewerOnly": "yes"
  }'
```

### Example Response

```json
{
  "message": "Member added successfully",
  "member": {
    "ID": 5,
    "user_login": "janesmith",
    "user_nicename": "jane-smith",
    "user_email": "jane@example.com",
    "user_url": "",
    "user_registered": "2024-02-01 09:15:00",
    "user_status": "0",
    "display_name": "Jane Smith",
    "photo": "https://secure.gravatar.com/avatar/example5?s=128&d=mm&r=g"
  }
}
```

## Remove User from Project

Remove a user from a project.

**HTTP Request**
```
POST /wp-json/fluent-boards/v2/projects/{board_id}/user/{user_id}/remove
```

### Example Request

```bash
curl "https://yourdomain.com/wp-json/fluent-boards/v2/projects/{board_id}/user/{user_id}/remove" \
  -X POST \
  -H "Authorization: Basic API_USERNAME:API_PASSWORD"
```

### Example Response

```json
{
  "message": "Member removed successfully"
}
```

## Make User Manager

Promote a user to manager role in a project. This gives the user administrative privileges for the specific board. **Note:** The user must already be a member of the board before they can be promoted to manager.

> Pro

**HTTP Request**
```
POST /wp-json/fluent-boards/v2/projects/{board_id}/user/{user_id}/make-manager
```

### Example Request

```bash
curl "https://yourdomain.com/wp-json/fluent-boards/v2/projects/{board_id}/user/{user_id}/make-manager" \
  -X POST \
  -H "Authorization: Basic API_USERNAME:API_PASSWORD"
```


### Example Response

```json
{
  "message": "Role updated successfully",
  "member": {
    "ID": 5,
    "user_login": "janesmith",
    "user_nicename": "jane-smith",
    "user_email": "jane@example.com",
    "user_url": "",
    "user_registered": "2024-02-01 09:15:00",
    "user_status": "0",
    "display_name": "Jane Smith",
    "is_admin": true,
    "is_board_admin": true,
    "photo": "https://secure.gravatar.com/avatar/example5?s=128&d=mm&r=g"
  }
}
```

## Remove Manager Role

Remove manager role from a user.

> Pro

**HTTP Request**
```
POST /wp-json/fluent-boards/v2/projects/{board_id}/user/{user_id}/remove-manager
```

### Example Request

```bash
curl "https://yourdomain.com/wp-json/fluent-boards/v2/projects/{board_id}/user/{user_id}/remove-manager" \
  -X POST \
  -H "Authorization: Basic API_USERNAME:API_PASSWORD"
```


### Example Response

```json
{
  "message": "Role updated successfully",
  "member": {
    "ID": 5,
    "user_login": "janesmith",
    "user_nicename": "jane-smith",
    "user_email": "jane@example.com",
    "user_url": "",
    "user_registered": "2024-02-01 09:15:00",
    "user_status": "0",
    "display_name": "Jane Smith",
    "is_admin": false,
    "is_board_admin": false,
    "photo": "https://secure.gravatar.com/avatar/example5?s=128&d=mm&r=g"
  }
}
```

## Make User Member

Set a user's role to member in a project. This endpoint can convert admins to regular members (removing admin privileges) or upgrade viewers to members (increasing permissions). Members have full access to tasks and boards. **Note:** The user must already be a board viewer or manager before they can be converted to a member.

> Pro

**HTTP Request**
```
POST /wp-json/fluent-boards/v2/projects/{board_id}/user/{user_id}/make-member
```

### Example Request

```bash
curl "https://yourdomain.com/wp-json/fluent-boards/v2/projects/{board_id}/user/{user_id}/make-member" \
  -X POST \
  -H "Authorization: Basic API_USERNAME:API_PASSWORD"
```


### Example Response

```json
{
  "message": "Role updated successfully",
  "member": {
    "ID": 5,
    "user_login": "janesmith",
    "user_nicename": "jane-smith",
    "user_email": "jane@example.com",
    "user_url": "",
    "user_registered": "2024-02-01 09:15:00",
    "user_status": "0",
    "display_name": "Jane Smith",
    "is_admin": false,
    "is_board_admin": false,
    "photo": "https://secure.gravatar.com/avatar/example5?s=128&d=mm&r=g"
  }
}
```

## Make User Viewer

Set a user's role to viewer in a project. This endpoint can convert admins or members to viewers (reducing permissions). Viewers have read-only access to tasks and boards. **Note:** The user must already be a board member or manager before they can be converted to a viewer.

> Pro

**HTTP Request**
```
POST /wp-json/fluent-boards/v2/projects/{board_id}/user/{user_id}/make-viewer
```

### Example Request

```bash
curl "https://yourdomain.com/wp-json/fluent-boards/v2/projects/{board_id}/user/{user_id}/make-viewer" \
  -X POST \
  -H "Authorization: Basic API_USERNAME:API_PASSWORD"
```


### Example Response

```json
{
  "message": "Role updated successfully",
  "member": {
    "ID": 5,
    "user_login": "janesmith",
    "user_nicename": "jane-smith",
    "user_email": "jane@example.com",
    "user_url": "",
    "user_registered": "2024-02-01 09:15:00",
    "user_status": "0",
    "display_name": "Jane Smith",
    "is_admin": false,
    "is_board_admin": false,
    "photo": "https://secure.gravatar.com/avatar/example5?s=128&d=mm&r=g"
  }
}
```

<!-- ## Get User Permissions

Retrieve user permissions for a specific board. Returns the user's role and permissions for the specified board.

**HTTP Request**
```
GET /wp-json/fluent-boards/v2/get-user-permissions
```

### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `boardId` | integer | Yes | The ID of the board |
| `userId` | integer | Yes | The ID of the user |



### Example Response

```json
{
  "success": true,
  "board_id": 1,
  "user_id": 2,
  "is_admin": false,
  "permissions": {
    "manage_tasks": true,
    "view_projects": true,
    "create_tasks": true,
    "edit_tasks": true
  },
  "status": "ACTIVE"
}
```

## Update User Permissions

Update user permissions globally.

**HTTP Request**
```
PUT /wp-json/fluent-boards/v2/update-user-permissions
```

### Request Body

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `user_id` | integer | Yes | The ID of the user |
| `permissions` | object | Yes | Object with permission keys and boolean values |



### Example Response

```json
{
  "data": {
    "user_id": 2,
    "permissions": {
      "manage_projects": false,
      "manage_tasks": true,
      "manage_users": false,
      "view_reports": true
    }
  },
  "message": "User permissions updated successfully"
}
``` -->

<!-- ## Set Permission All Board Admin

Set a user as admin for all boards.

**HTTP Request**
```
POST /wp-json/fluent-boards/v2/set-permission-all-board-admin
```

### Request Body

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `user_id` | integer | Yes | The ID of the user |



### Example Response

```json
{
  "message": "User set as admin for all boards successfully"
}
``` -->

## Remove User from Board

Remove a user from a specific board.

**HTTP Request**
```
DELETE /wp-json/fluent-boards/v2/remove-user-from-board
```

### Request Body

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `boardId` | integer | Yes | The ID of the board |
| `userId` | integer | Yes | The ID of the user |

### Example Request

```bash
curl "https://yourdomain.com/wp-json/fluent-boards/v2/remove-user-from-board" \
  -X DELETE \
  -H "Authorization: Basic API_USERNAME:API_PASSWORD" \
  -H "Content-Type: application/json" \
  -d '{
    "boardId": 3,
    "userId": 5
  }'
```

### Example Response

```json
{
  "message": "User Removed from Board successfully!"
}
```

## Sync Board Roles

Synchronize user roles across multiple boards. This endpoint allows you to update or remove user roles from multiple boards in a single request. **Note:** Super admin users cannot have their roles synced.

> Pro

**HTTP Request**
```
POST /wp-json/fluent-boards/v2/managers/roles/{user_id}
```

### Request Body

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `roles` | object | Yes | Object with board_id as key and role as value. Valid roles: `admin`, `member`, `viewer`. Empty values will remove the user from that board. |

### Example Request

```bash
curl "https://yourdomain.com/wp-json/fluent-boards/v2/managers/roles/{user_id}" \
  -X POST \
  -H "Authorization: Basic API_USERNAME:API_PASSWORD" \
  -H "Content-Type: application/json" \
  -d '{
    "roles": {
      "1": "admin",
      "2": "member",
      "3": "viewer"
    }
  }'
```

### Example Response

```json
{
  "message": "User roles has been synced successfully."
}
```

## Get Project Assignees

Get all users who can be assigned to tasks in a project.

**HTTP Request**
```
GET /wp-json/fluent-boards/v2/projects/{board_id}/assignees
```

### Example Request

```bash
curl "https://yourdomain.com/wp-json/fluent-boards/v2/projects/{board_id}/assignees" \
  -H "Authorization: Basic API_USERNAME:API_PASSWORD"
```


### Example Response

```json
{
  "data": [
    {
      "ID": 1,
      "user_login": "john_doe",
      "user_nicename": "john-doe",
      "user_email": "john.doe@example.com",
      "user_url": "https://example.com",
      "user_registered": "2024-01-15 10:30:00",
      "user_status": "0",
      "display_name": "John Doe",
      "photo": "https://secure.gravatar.com/avatar/example123?s=128&d=mm&r=g",
      "pivot": {
        "object_id": "3",
        "foreign_id": "1",
        "settings": "a:1:{s:8:\"is_admin\";b:0;}",
        "preferences": "a:6:{s:19:\"email_after_comment\";b:0;s:29:\"email_after_task_stage_change\";b:0;s:23:\"email_after_task_assign\";b:0;s:32:\"email_after_task_due_date_change\";b:0;s:28:\"email_after_remove_from_task\";b:0;s:24:\"email_after_task_archive\";b:0;}",
        "created_at": "2025-01-15T10:30:00+00:00",
        "updated_at": "2025-01-20T14:45:00+00:00"
      }
    },
    {
      "ID": 2,
      "user_login": "jane_smith",
      "user_nicename": "jane-smith",
      "user_email": "jane.smith@example.com",
      "user_url": "https://janesmith.com",
      "user_registered": "2024-02-20 09:15:00",
      "user_status": "0",
      "display_name": "Jane Smith",
      "photo": "https://secure.gravatar.com/avatar/example456?s=128&d=mm&r=g",
      "pivot": {
        "object_id": "3",
        "foreign_id": "2",
        "settings": "a:1:{s:8:\"is_admin\";b:1;}",
        "preferences": "a:6:{s:19:\"email_after_comment\";b:1;s:29:\"email_after_task_stage_change\";b:1;s:23:\"email_after_task_assign\";b:1;s:32:\"email_after_task_due_date_change\";b:1;s:28:\"email_after_remove_from_task\";b:0;s:24:\"email_after_task_archive\";b:0;}",
        "created_at": "2025-01-10T08:00:00+00:00",
        "updated_at": "2025-01-18T16:30:00+00:00"
      }
    }
  ]
}
```

## Error Responses

See [Common Error Responses](/rest-api/shared/error-responses) for standard error formats.

### Common User-Specific Errors

- **404 Not Found** - User not found
- **403 Forbidden** - You don't have permission to manage users
- **400 Bad Request** - Invalid user data or missing required fields

## Next Steps

- [Board Management](/rest-api/boards) - Manage board members
- [Task Management](/rest-api/tasks) - Assign users to tasks
- [Permissions](/rest-api/permissions) - Understand permission system
- [Notifications](/rest-api/notifications) - Handle user notifications 