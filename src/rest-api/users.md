# Users & Members

Manage who belongs to a board, change board roles, send email invitations, and read member profiles. Plugin source: free (board members, member profile) and Pro (invitations, board role changes).

Site-wide user management (FluentBoards admins, bulk board access) lives on [Managers & Roles](/rest-api/permissions).

## Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/projects/{board_id}/users` | List board members |
| POST | `/projects/{board_id}/add-members` | Add a user to a board |
| POST | `/projects/{board_id}/user/{user_id}/remove` | Remove a user from a board |
| GET | `/projects/{board_id}/assignees` | List board members who are task assignees |
| POST | `/projects/{board_id}/user/{user_id}/make-manager` | Make a member a board manager (Pro) |
| POST | `/projects/{board_id}/user/{user_id}/remove-manager` | Remove the manager role (Pro) |
| POST | `/projects/{board_id}/user/{user_id}/make-member` | Set role to member (Pro) |
| POST | `/projects/{board_id}/user/{user_id}/make-viewer` | Set role to viewer (Pro) |
| POST | `/projects/{board_id}/send-invitation` | Invite an email address to a board (Pro) |
| GET | `/projects/{board_id}/all-invitations` | List pending invitations (Pro) |
| DELETE | `/projects/{board_id}/invitation/{invitation_id}` | Delete an invitation (Pro) |
| GET | `/member/{id}` | Get a member profile |
| GET | `/member/{id}/projects` | Boards the member belongs to |
| GET | `/member/{id}/tasks` | Member's tasks, by tab |
| GET | `/member/{id}/task-counts` | Task counts per tab |
| GET | `/member/{id}/activities` | Activities created by the member |
| GET | `/member/{id}/stats` | Profile stat tiles |
| POST | `/member/{id}/display-name` | Update your own display name |
| POST | `/member/{id}/photo` | Upload your own profile photo |
| GET | `/member-associated-users/{id}` | Users who share boards with a member |

::: tip Email visibility
User objects only include `user_email` when the requesting user has the WordPress `list_users` capability. In the formatted member lists below (`email` key), board members who are not managers see other users' emails obfuscated.
:::

## Board roles

A board membership is stored in `fbs_relations` (`object_type = board_user`) with a `settings` array:

| Role | `settings` | Notes |
|---|---|---|
| `manager` | `is_admin: true` | Can manage members, settings and stages of that board |
| `member` | `is_admin: false`, `is_viewer_only: false` | Can create and edit tasks |
| `viewer` | `is_viewer_only: true` | Read-only access |

WordPress administrators and FluentBoards admins (see [Managers & Roles](/rest-api/permissions)) can access every board without a membership row.

## List Board Members

Returns the members of a board. For FluentBoards admins the response also lists the global admins who are not members of the board (`global_admins`); other users get an empty array.

```http
GET /wp-json/fluent-boards/v2/projects/{board_id}/users
```

**Example Request**

```bash
curl "https://yourdomain.com/wp-json/fluent-boards/v2/projects/1/users" \
  -u "USERNAME:APPLICATION_PASSWORD"
```

**Example Response**

```json
{
  "users": [
    {
      "ID": 2,
      "display_name": "Jane Smith",
      "email": "jane@example.com",
      "photo": "https://secure.gravatar.com/avatar/example2?s=128&d=mm&r=g",
      "role": "member",
      "is_super": false,
      "is_wpadmin": false
    },
    {
      "ID": 1,
      "display_name": "John Doe",
      "email": "john@example.com",
      "photo": "https://secure.gravatar.com/avatar/example1?s=128&d=mm&r=g",
      "role": "manager",
      "is_super": false,
      "is_wpadmin": true
    }
  ],
  "global_admins": []
}
```

`role` is `manager`, `member` or `viewer`. `is_super` is true for FluentBoards admins, `is_wpadmin` for users with `manage_options`. Users are sorted by `display_name`.

## Add Member to Board

Adds one user to a board as a member, or as a viewer. Requires board manager.

```http
POST /wp-json/fluent-boards/v2/projects/{board_id}/add-members
```

**Parameters**

| Parameter | Type | Required | Description |
|---|---|---|---|
| `memberId` | integer | Yes | WordPress user ID to add |
| `isViewerOnly` | string | No | `yes` to add the user as a viewer |

**Example Request**

```bash
curl -X POST "https://yourdomain.com/wp-json/fluent-boards/v2/projects/1/add-members" \
  -u "USERNAME:APPLICATION_PASSWORD" \
  -H "Content-Type: application/json" \
  -d '{"memberId": 5, "isViewerOnly": "yes"}'
```

**Example Response**

```json
{
  "message": "Member added successfully",
  "is_admin": false,
  "member": {
    "ID": 5,
    "user_login": "janesmith",
    "display_name": "Jane Smith",
    "photo": "https://secure.gravatar.com/avatar/example5?s=128&d=mm&r=g"
  }
}
```

`is_admin` tells whether the added user is a FluentBoards/WordPress admin. Returns `404` when the user or board does not exist and `409` (`User already a member`) when the user is already on the board.

## Remove Member from Board

Removes a user from the board, detaches them from the board's tasks (assignee and watcher), and clears their board notification settings. Users can always remove themselves; removing someone else requires board manager, and removing a global admin requires a global admin.

```http
POST /wp-json/fluent-boards/v2/projects/{board_id}/user/{user_id}/remove
```

**Example Request**

```bash
curl -X POST "https://yourdomain.com/wp-json/fluent-boards/v2/projects/1/user/5/remove" \
  -u "USERNAME:APPLICATION_PASSWORD"
```

**Example Response**

```json
{
  "message": "Member removed successfully"
}
```

## List Board Assignees

Returns board members who are assigned to at least one task (on any board). Each item is a user object with the board relation in `pivot`.

```http
GET /wp-json/fluent-boards/v2/projects/{board_id}/assignees
```

**Example Request**

```bash
curl "https://yourdomain.com/wp-json/fluent-boards/v2/projects/1/assignees" \
  -u "USERNAME:APPLICATION_PASSWORD"
```

**Example Response**

```json
{
  "data": [
    {
      "ID": 1,
      "user_login": "john_doe",
      "display_name": "John Doe",
      "photo": "https://secure.gravatar.com/avatar/example123?s=128&d=mm&r=g",
      "pivot": {
        "object_id": 1,
        "foreign_id": 1,
        "settings": "a:1:{s:8:\"is_admin\";b:0;}",
        "preferences": "a:6:{...}",
        "created_at": "2025-01-15T10:30:00+00:00",
        "updated_at": "2025-01-20T14:45:00+00:00"
      }
    }
  ]
}
```

## Make Board Manager <Badge type="tip" text="Pro" />

Promotes an existing board member to manager. Requires board manager; when the target user is a global admin, requires a global admin.

```http
POST /wp-json/fluent-boards/v2/projects/{board_id}/user/{user_id}/make-manager
```

**Example Request**

```bash
curl -X POST "https://yourdomain.com/wp-json/fluent-boards/v2/projects/1/user/5/make-manager" \
  -u "USERNAME:APPLICATION_PASSWORD"
```

**Example Response**

```json
{
  "message": "Role updated successfully",
  "member": {
    "ID": 5,
    "user_login": "janesmith",
    "display_name": "Jane Smith",
    "photo": "https://secure.gravatar.com/avatar/example5?s=128&d=mm&r=g",
    "is_admin": true,
    "is_board_admin": true
  }
}
```

The user must already be a board member.

## Remove Board Manager <Badge type="tip" text="Pro" />

Demotes a manager to member. Same permission rules as [Make Board Manager](#make-board-manager).

```http
POST /wp-json/fluent-boards/v2/projects/{board_id}/user/{user_id}/remove-manager
```

**Example Request**

```bash
curl -X POST "https://yourdomain.com/wp-json/fluent-boards/v2/projects/1/user/5/remove-manager" \
  -u "USERNAME:APPLICATION_PASSWORD"
```

**Example Response**

```json
{
  "message": "Role updated successfully",
  "member": {
    "ID": 5,
    "user_login": "janesmith",
    "display_name": "Jane Smith",
    "photo": "https://secure.gravatar.com/avatar/example5?s=128&d=mm&r=g",
    "is_admin": false,
    "is_board_admin": false
  }
}
```

## Make Member <Badge type="tip" text="Pro" />

Sets an existing manager or viewer to the member role. Same permission rules as [Make Board Manager](#make-board-manager).

```http
POST /wp-json/fluent-boards/v2/projects/{board_id}/user/{user_id}/make-member
```

**Example Request**

```bash
curl -X POST "https://yourdomain.com/wp-json/fluent-boards/v2/projects/1/user/5/make-member" \
  -u "USERNAME:APPLICATION_PASSWORD"
```

**Example Response**

Same shape as [Remove Board Manager](#remove-board-manager): `message` and `member` with `is_admin: false`, `is_board_admin: false`.

## Make Viewer <Badge type="tip" text="Pro" />

Sets an existing manager or member to the read-only viewer role. Same permission rules as [Make Board Manager](#make-board-manager).

```http
POST /wp-json/fluent-boards/v2/projects/{board_id}/user/{user_id}/make-viewer
```

**Example Request**

```bash
curl -X POST "https://yourdomain.com/wp-json/fluent-boards/v2/projects/1/user/5/make-viewer" \
  -u "USERNAME:APPLICATION_PASSWORD"
```

**Example Response**

Same shape as [Remove Board Manager](#remove-board-manager).

## Send Board Invitation <Badge type="tip" text="Pro" />

Emails an invitation link to an address that does not belong to a WordPress user yet. The invitation expires after 48 hours (filter `fluent_boards/invite_expiry_seconds`). Requires board manager.

```http
POST /wp-json/fluent-boards/v2/projects/{board_id}/send-invitation
```

**Parameters**

| Parameter | Type | Required | Description |
|---|---|---|---|
| `email` | string | Yes | Email address to invite |

**Example Request**

```bash
curl -X POST "https://yourdomain.com/wp-json/fluent-boards/v2/projects/1/send-invitation" \
  -u "USERNAME:APPLICATION_PASSWORD" \
  -H "Content-Type: application/json" \
  -d '{"email": "new.person@example.com"}'
```

**Example Response**

```json
{
  "message": "Invitation sent successfully!"
}
```

If the email already belongs to a WordPress user, no invitation is sent and the endpoint returns `422` with `"message": "Already a wordpress member"` (the controller asks for `304`, which the framework turns into `422`). Add that user with [Add Member to Board](#add-member-to-board) instead.

## List Invitations <Badge type="tip" text="Pro" />

Returns the board's invitation records (stored in `fbs_metas`). Requires board manager.

```http
GET /wp-json/fluent-boards/v2/projects/{board_id}/all-invitations
```

**Example Request**

```bash
curl "https://yourdomain.com/wp-json/fluent-boards/v2/projects/1/all-invitations" \
  -u "USERNAME:APPLICATION_PASSWORD"
```

**Example Response**

```json
{
  "invitations": [
    {
      "id": 31,
      "object_id": 1,
      "object_type": "board",
      "key": "board_email_invitation",
      "value": {
        "email": "new.person@example.com",
        "hash": "3f9c1b7e2d...",
        "issued_at": 1759400000,
        "expires_at": 1759572800,
        "used": false
      },
      "created_at": "2025-10-02T10:13:20+00:00",
      "updated_at": "2025-10-02T10:13:20+00:00"
    }
  ]
}
```

## Delete Invitation <Badge type="tip" text="Pro" />

Deletes one invitation of the board. Requires board manager.

```http
DELETE /wp-json/fluent-boards/v2/projects/{board_id}/invitation/{invitation_id}
```

**Example Request**

```bash
curl -X DELETE "https://yourdomain.com/wp-json/fluent-boards/v2/projects/1/invitation/31" \
  -u "USERNAME:APPLICATION_PASSWORD"
```

**Example Response**

```json
{
  "message": "Invitation deleted successfully!"
}
```

Returns `404` (`Invitation not found.`) when the invitation does not belong to the board.

## Get Member Profile

Returns a member's profile. The caller must be logged in and either be the member, a FluentBoards admin, or share a board with the member. Returns `403` when the target user is not a FluentBoards user.

```http
GET /wp-json/fluent-boards/v2/member/{id}
```

**Example Request**

```bash
curl "https://yourdomain.com/wp-json/fluent-boards/v2/member/5" \
  -u "USERNAME:APPLICATION_PASSWORD"
```

**Example Response**

```json
{
  "user": {
    "ID": 5,
    "user_login": "janesmith",
    "display_name": "Jane Smith",
    "photo": "https://secure.gravatar.com/avatar/example5?s=128&d=mm&r=g",
    "fbs_role": "member",
    "is_wp_admin": "no"
  }
}
```

`fbs_role` is `fbs_admin` for FluentBoards admins, otherwise `member`. When FluentCRM is active, the user also has `fluentcrm_subscriber` (the linked contact or `null`).

## Get Member Boards

Boards the member belongs to. Unless you are the member or an admin, the list is limited to boards you share with them.

```http
GET /wp-json/fluent-boards/v2/member/{id}/projects
```

**Example Request**

```bash
curl "https://yourdomain.com/wp-json/fluent-boards/v2/member/5/projects" \
  -u "USERNAME:APPLICATION_PASSWORD"
```

**Example Response**

```json
{
  "boards": [
    {
      "id": 1,
      "title": "Website Redesign",
      "type": "to-do",
      "background": { "color": "#2196F3" },
      "archived_at": null,
      "pivot": { "foreign_id": 5, "object_id": 1 }
    }
  ]
}
```

## Get Member Tasks

Paginated tasks for one tab of the member profile. Results are limited to boards the caller can access.

```http
GET /wp-json/fluent-boards/v2/member/{id}/tasks
```

**Parameters**

| Parameter | Type | Required | Description |
|---|---|---|---|
| `taskType` | string | No | `assigned`, `mentioned`, `upcoming`, `due_today`, `overdue`, `completed`. Any other value (default) returns watched tasks with no due date. |
| `boardIds` | array | No | Limit to these board IDs |
| `per_page` | integer | No | 1–50, default `15` |
| `page` | integer | No | Default `1` |
| `orderBy` | string | No | `priority`, `due_at`, `position`, `created_at` (default) or `title` |
| `order` | string | No | `ASC` (default) or `DESC` |

**Example Request**

```bash
curl "https://yourdomain.com/wp-json/fluent-boards/v2/member/5/tasks?taskType=assigned&orderBy=due_at&order=ASC" \
  -u "USERNAME:APPLICATION_PASSWORD"
```

**Example Response**

```json
{
  "tasks": [
    {
      "id": 42,
      "title": "Write release notes",
      "board_id": 1,
      "stage_id": 3,
      "priority": "high",
      "status": "open",
      "due_at": "2025-10-05 17:00:00",
      "stage": { "id": 3, "title": "In Progress" },
      "board": { "id": 1, "title": "Website Redesign" },
      "labels": []
    }
  ],
  "paginationInfo": {
    "current_page": 1,
    "last_page": 1,
    "per_page": 15,
    "total": 1
  }
}
```

An invalid `orderBy` or `order` returns `404` with `Invalid sort or orderBy parameter`.

## Get Member Task Counts

Counts for each profile task tab, limited the same way as [Get Member Tasks](#get-member-tasks).

```http
GET /wp-json/fluent-boards/v2/member/{id}/task-counts
```

**Parameters**

| Parameter | Type | Required | Description |
|---|---|---|---|
| `boardIds` | array | No | Limit to these board IDs |

**Example Request**

```bash
curl "https://yourdomain.com/wp-json/fluent-boards/v2/member/5/task-counts" \
  -u "USERNAME:APPLICATION_PASSWORD"
```

**Example Response**

```json
{
  "counts": {
    "due_today": 1,
    "assigned": 6,
    "upcoming": 3,
    "overdue": 2,
    "mentioned": 1,
    "completed": 14,
    "others": 4
  }
}
```

## Get Member Activities

Activities created by the member on boards and tasks the caller can access, 40 per page, newest first.

```http
GET /wp-json/fluent-boards/v2/member/{id}/activities
```

**Parameters**

| Parameter | Type | Required | Description |
|---|---|---|---|
| `page` | integer | No | Default `1` |

**Example Request**

```bash
curl "https://yourdomain.com/wp-json/fluent-boards/v2/member/5/activities?page=1" \
  -u "USERNAME:APPLICATION_PASSWORD"
```

**Example Response**

```json
{
  "activities": [
    {
      "id": 812,
      "object_type": "task",
      "object_id": 42,
      "action": "changed",
      "column": "stage",
      "old_value": "Open",
      "new_value": "In Progress",
      "created_by": 5,
      "created_at": "2025-10-01T09:12:00+00:00",
      "user": { "ID": 5, "display_name": "Jane Smith" },
      "task": { "id": 42, "title": "Write release notes" }
    }
  ],
  "pagination": {
    "current_page": 1,
    "last_page": 1,
    "per_page": 40,
    "total": 1
  }
}
```

Board activities carry a `board` object instead of `task`.

## Get Member Stats

Four counts for the profile header. `unread_notifications` is only filled for yourself or for admins; otherwise it is `0`.

```http
GET /wp-json/fluent-boards/v2/member/{id}/stats
```

**Example Request**

```bash
curl "https://yourdomain.com/wp-json/fluent-boards/v2/member/5/stats" \
  -u "USERNAME:APPLICATION_PASSWORD"
```

**Example Response**

```json
{
  "assigned_tasks": 6,
  "completed_tasks": 14,
  "total_boards": 3,
  "unread_notifications": 2
}
```

## Update Display Name

Changes the WordPress display name. You can only change your own (`{id}` must be the current user).

```http
POST /wp-json/fluent-boards/v2/member/{id}/display-name
```

**Parameters**

| Parameter | Type | Required | Description |
|---|---|---|---|
| `display_name` | string | Yes | New name, up to 250 characters |

**Example Request**

```bash
curl -X POST "https://yourdomain.com/wp-json/fluent-boards/v2/member/5/display-name" \
  -u "USERNAME:APPLICATION_PASSWORD" \
  -H "Content-Type: application/json" \
  -d '{"display_name": "Jane S."}'
```

**Example Response**

```json
{
  "message": "Display name has been updated",
  "user": {
    "display_name": "Jane S."
  }
}
```

Validation failures return `400` with a `message`.

## Upload Profile Photo

Uploads a new avatar for yourself (`{id}` must be the current user). JPG, PNG, GIF or WebP, up to 2 MB and 4096 px per side. Send it as multipart form field `photo`.

```http
POST /wp-json/fluent-boards/v2/member/{id}/photo
```

**Example Request**

```bash
curl -X POST "https://yourdomain.com/wp-json/fluent-boards/v2/member/5/photo" \
  -u "USERNAME:APPLICATION_PASSWORD" \
  -F "photo=@/path/to/avatar.png"
```

**Example Response**

```json
{
  "message": "Profile photo has been updated",
  "user": {
    "photo": "https://yourdomain.com/wp-content/uploads/2025/10/avatar-128x128.png"
  }
}
```

## Get Associated Users

Users who share boards with member `{id}`, limited to boards the caller can also see, plus each user's board relation rows. Requires a FluentBoards user.

```http
GET /wp-json/fluent-boards/v2/member-associated-users/{id}
```

**Example Request**

```bash
curl "https://yourdomain.com/wp-json/fluent-boards/v2/member-associated-users/5" \
  -u "USERNAME:APPLICATION_PASSWORD"
```

**Example Response**

```json
{
  "users": [
    {
      "ID": 7,
      "user_login": "mike",
      "display_name": "Mike Lee",
      "photo": "https://secure.gravatar.com/avatar/example7?s=128&d=mm&r=g",
      "which_boards": [ { "id": 1, "title": "Website Redesign" } ],
      "all_boards": [ { "id": 1, "title": "Website Redesign" } ],
      "is_super": false,
      "is_wpadmin": false
    }
  ],
  "userWiseBoardDesignation": [
    {
      "id": 90,
      "object_id": 1,
      "object_type": "board_user",
      "foreign_id": 7,
      "settings": { "is_admin": false }
    }
  ]
}
```

`all_boards` is only set for users who are neither WordPress admins nor FluentBoards admins.

See [Common Error Responses](/rest-api/shared/error-responses) for standard error formats.
