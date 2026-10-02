# Managers & Roles

Site-wide member management: list every FluentBoards user with their board roles, grant or revoke FluentBoards admin access, add users to many boards at once, and sync one user's roles across boards. These are the endpoints behind **Settings → Members & Roles**. Plugin source: Pro.

::: tip Pro
All endpoints on this page require Fluent Boards Pro. They also require a WordPress administrator (`manage_options`) or a FluentBoards admin.
:::

To change a single user's role on one board, use the board-level endpoints on [Users & Members](/rest-api/users#board-roles).

## Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/managers` | List FluentBoards users and all boards |
| POST | `/managers/add-admins` | Make users FluentBoards admins |
| POST | `/managers/remove-admins` | Revoke FluentBoards admin access |
| POST | `/managers/add-users-to-boards` | Add users to several boards |
| POST | `/managers/roles/{user_id}` | Sync one user's board roles |
| DELETE | `/managers/roles/{user_id}` | Remove a user from all boards |
| POST | `/managers` | Add a user to several boards (broken, see below) |

## Permission model

| Level | Who | Access |
|---|---|---|
| WordPress administrator | Users with `manage_options` | Everything, all boards |
| FluentBoards admin | Users added with [Add Admins](#add-admins) (stored in `fbs_metas`, `object_type = fluent_board_admin`) | Everything, all boards |
| Board manager | Board role `manager` | Manage that board, its members and settings |
| Board member | Board role `member` | Create and edit tasks on that board |
| Board viewer | Board role `viewer` | Read-only on that board |

## List Users and Boards

Returns every FluentBoards admin and every user who belongs to at least one board, plus a list of all boards (for building role pickers).

```http
GET /wp-json/fluent-boards/v2/managers
```

**Example Request**

```bash
curl "https://yourdomain.com/wp-json/fluent-boards/v2/managers" \
  -u "USERNAME:APPLICATION_PASSWORD"
```

**Example Response**

```json
{
  "users": [
    {
      "ID": 1,
      "display_name": "John Doe",
      "photo": "https://secure.gravatar.com/avatar/example1?s=128&d=mm&r=g",
      "email": "john@example.com",
      "boards": [],
      "is_super": true,
      "is_wpadmin": true
    },
    {
      "ID": 2,
      "display_name": "Jane Smith",
      "photo": "https://secure.gravatar.com/avatar/example2?s=128&d=mm&r=g",
      "email": "jane@example.com",
      "boards": [
        { "id": 1, "title": "Project Alpha", "role": "admin" },
        { "id": 2, "title": "Project Beta", "role": "viewer" }
      ],
      "is_super": false,
      "is_wpadmin": false
    }
  ],
  "boards": [
    { "id": 1, "title": "Project Alpha" },
    { "id": 2, "title": "Project Beta" }
  ]
}
```

- `is_super`: the user is a FluentBoards admin. Their `boards` list is empty because admins see every board.
- `boards[].role`: `admin` (board manager), `member` or `viewer`.

## Add Admins

Marks users as FluentBoards admins, giving them access to every board and to admin settings. Unknown user IDs are skipped.

```http
POST /wp-json/fluent-boards/v2/managers/add-admins
```

**Parameters**

| Parameter | Type | Required | Description |
|---|---|---|---|
| `user_ids` | array | Yes | WordPress user IDs |

**Example Request**

```bash
curl -X POST "https://yourdomain.com/wp-json/fluent-boards/v2/managers/add-admins" \
  -u "USERNAME:APPLICATION_PASSWORD" \
  -H "Content-Type: application/json" \
  -d '{"user_ids": [5, 7]}'
```

**Example Response**

```json
{
  "message": "Selected users has been added as admin"
}
```

## Remove Admins

Revokes FluentBoards admin access. Users keep their individual board memberships. WordPress administrators keep full access through `manage_options` regardless.

```http
POST /wp-json/fluent-boards/v2/managers/remove-admins
```

**Parameters**

| Parameter | Type | Required | Description |
|---|---|---|---|
| `user_ids` | array | Yes | WordPress user IDs |

**Example Request**

```bash
curl -X POST "https://yourdomain.com/wp-json/fluent-boards/v2/managers/remove-admins" \
  -u "USERNAME:APPLICATION_PASSWORD" \
  -H "Content-Type: application/json" \
  -d '{"user_ids": [7]}'
```

**Example Response**

```json
{
  "message": "Selected user has been deleted from admin access. Please check individual board accesses."
}
```

## Add Users to Boards

Adds every user in `user_ids` to every board in `board_ids`. Users who are already members of a board are skipped (their role is not changed).

```http
POST /wp-json/fluent-boards/v2/managers/add-users-to-boards
```

**Parameters**

| Parameter | Type | Required | Description |
|---|---|---|---|
| `user_ids` | array | Yes | WordPress user IDs |
| `board_ids` | array | Yes | Board IDs |
| `is_viewer_only` | string | No | `yes` to add as viewers, `no` (or omitted) for members |

**Example Request**

```bash
curl -X POST "https://yourdomain.com/wp-json/fluent-boards/v2/managers/add-users-to-boards" \
  -u "USERNAME:APPLICATION_PASSWORD" \
  -H "Content-Type: application/json" \
  -d '{"user_ids": [5, 7], "board_ids": [1, 2], "is_viewer_only": "no"}'
```

**Example Response**

```json
{
  "message": "Selected users has been added to selected boards"
}
```

## Sync Board Roles

Sets one user's role on each board in a single call:

- Boards in `roles` where the user is already a member get the new role.
- Boards where the user is a member but that are missing from `roles` (or have an empty value) remove the user from that board.
- Boards in `roles` where the user is not yet a member add the user as a **member** (the requested role is not applied on this first call).

Fails for WordPress administrators and FluentBoards admins (`You can not sync access for super admin.`).

```http
POST /wp-json/fluent-boards/v2/managers/roles/{user_id}
```

**Parameters**

| Parameter | Type | Required | Description |
|---|---|---|---|
| `roles` | object | Yes | Map of board ID to role: `admin` (manager), `member` or `viewer` |

**Example Request**

```bash
curl -X POST "https://yourdomain.com/wp-json/fluent-boards/v2/managers/roles/5" \
  -u "USERNAME:APPLICATION_PASSWORD" \
  -H "Content-Type: application/json" \
  -d '{
    "roles": {
      "1": "admin",
      "2": "member",
      "3": "viewer"
    }
  }'
```

**Example Response**

```json
{
  "message": "User roles has been synced successfully."
}
```

## Remove User from All Boards

Revokes FluentBoards admin access, removes the user from every board, and detaches them from every task as assignee or watcher. Not allowed for WordPress administrators.

```http
DELETE /wp-json/fluent-boards/v2/managers/roles/{user_id}
```

**Example Request**

```bash
curl -X DELETE "https://yourdomain.com/wp-json/fluent-boards/v2/managers/roles/5" \
  -u "USERNAME:APPLICATION_PASSWORD"
```

**Example Response**

```json
{
  "message": "User has been removed from all boards."
}
```

## Add User to Boards (`POST /managers`)

```http
POST /wp-json/fluent-boards/v2/managers
```

::: warning Not usable
This route is registered, but its controller method (`BoardUserController@addUserToBoards`) expects a `{user_id}` route parameter that the path does not have, so the call fails. Use [Add Users to Boards](#add-users-to-boards) instead.
:::

See [Common Error Responses](/rest-api/shared/error-responses) for standard error formats.
