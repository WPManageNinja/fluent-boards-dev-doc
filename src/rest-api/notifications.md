# Notifications

In-app notifications tell users about activity on tasks they are assigned to or watching (comments, mentions, stage moves, due date changes, and so on). The Notifications API lets the current user read their notifications, mark them as read, and manage their email and watch preferences globally or per board. Plugin source: free.

All endpoints act on the **current user** only; there is no way to read or change another user's notifications.

## Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/notifications` | List notifications |
| GET | `/notifications/unread` | List unread notifications |
| GET | `/notifications/unread-count` | Count unread notifications |
| PUT | `/notifications/read` | Mark one or all notifications as read |
| GET | `/get-global-notification-settings` | Get global notification preferences |
| POST | `/update-global-notification-settings` | Update global notification preferences |
| GET | `/projects/{board_id}/notification-settings` | Get board notification preferences |
| PUT | `/projects/{board_id}/update-notification-settings` | Update board notification preferences |

**Access.** The `/notifications/*` routes use `UserPolicy` (any logged-in user). The global settings routes use `BoardUserPolicy` (any FluentBoards user). The board settings routes use `SingleBoardPolicy` (board members; viewers can only read).

## Notification Object

Notifications are stored in `fbs_notifications`; per-user delivery and read state live in `fbs_notification_users`.

| Field | Type | Description |
|---|---|---|
| `id` | integer | Notification ID |
| `object_id` | integer | Board ID |
| `object_type` | string | Always `board_notification` |
| `activity_by` | integer | User who triggered the notification |
| `task_id` | integer | Related task |
| `action` | string | Event type (see below) |
| `description` | string | Human-readable text, for example `has added you as an assignee.` |
| `settings` | object\|null | Extra data for some actions |
| `created_at` | string | Creation timestamp |
| `updated_at` | string | Last update timestamp |
| `activitist` | object | The user in `activity_by` |
| `task` | object | The related task, with its `stage` and `board` |
| `read` | boolean | Whether the current user has read it (list endpoint only) |

### Action values

| Action | Sent when |
|---|---|
| `comment_created` | A comment is added to a task |
| `task_reply_added` | A reply is added to a comment |
| `task_comment_mentioned` | The user is mentioned in a comment |
| `subtask_added` | A subtask is added |
| `task_due_date_changed` | The due date changes |
| `task_start_date_changed` | The start date changes |
| `task_moved_to_new_stage` | The task moves to another stage |
| `task_priority_changed` | The priority changes |
| `board_task_archived` | The task is archived |
| `board_task_restored` | The task is restored |
| `task_title_updated` | The title changes |
| `task_assignee_changed` | The user is assigned to or removed from the task |

## List Notifications

Return the current user's notifications, newest first, with a `read` flag on each.

```http
GET /wp-json/fluent-boards/v2/notifications
```

**Parameters**

| Parameter | Type | Required | Description |
|---|---|---|---|
| `per_page` | integer | No | Notifications per page. Default `20` |
| `page` | integer | No | Page number. Default `1` |
| `action` | string | No | Only return this [action](#action-values). Default `all` |

**Example Request**

```bash
curl "https://yourdomain.com/wp-json/fluent-boards/v2/notifications?per_page=20&page=1" \
  -u "USERNAME:APPLICATION_PASSWORD"
```

**Example Response**

The response body is the paginator itself (no wrapper key).

```json
{
  "current_page": 1,
  "data": [
    {
      "id": 812,
      "object_id": "3",
      "object_type": "board_notification",
      "activity_by": "2",
      "task_id": "149",
      "action": "task_assignee_changed",
      "description": "has added you as an assignee.",
      "settings": null,
      "created_at": "2025-08-12 09:15:02",
      "updated_at": "2025-08-12 09:15:02",
      "read": false,
      "activitist": {
        "ID": 2,
        "display_name": "Jane Doe",
        "photo": "https://secure.gravatar.com/avatar/...?s=128&d=mm&r=g"
      },
      "task": {
        "id": 149,
        "board_id": "3",
        "title": "Design homepage",
        "slug": "design-homepage",
        "stage": { "id": 12, "title": "In Progress" },
        "board": { "id": 3, "title": "Website Redesign" }
      }
    }
  ],
  "per_page": 20,
  "total": 1,
  "last_page": 1,
  "from": 1,
  "to": 1
}
```

## List Unread Notifications

Return only the current user's unread notifications, newest first. The shape matches [List Notifications](#list-notifications), without the `read` flag.

```http
GET /wp-json/fluent-boards/v2/notifications/unread
```

**Parameters**

| Parameter | Type | Required | Description |
|---|---|---|---|
| `per_page` | integer | No | Notifications per page. Default `20` |
| `page` | integer | No | Page number. Default `1` |

**Example Request**

```bash
curl "https://yourdomain.com/wp-json/fluent-boards/v2/notifications/unread?per_page=10" \
  -u "USERNAME:APPLICATION_PASSWORD"
```

**Example Response**

```json
{
  "current_page": 1,
  "data": [
    {
      "id": 812,
      "object_id": "3",
      "object_type": "board_notification",
      "activity_by": "2",
      "task_id": "149",
      "action": "task_assignee_changed",
      "description": "has added you as an assignee.",
      "created_at": "2025-08-12 09:15:02",
      "activitist": { "ID": 2, "display_name": "Jane Doe" },
      "task": { "id": 149, "title": "Design homepage" }
    }
  ],
  "per_page": 10,
  "total": 1,
  "last_page": 1
}
```

## Count Unread Notifications

Return how many unread notifications the current user has.

```http
GET /wp-json/fluent-boards/v2/notifications/unread-count
```

**Example Request**

```bash
curl "https://yourdomain.com/wp-json/fluent-boards/v2/notifications/unread-count" \
  -u "USERNAME:APPLICATION_PASSWORD"
```

**Example Response**

```json
{
  "total_unread": 4
}
```

## Mark Notifications as Read

Mark one notification as read by passing `notification_id`, or mark all of the current user's notifications as read by leaving it out.

```http
PUT /wp-json/fluent-boards/v2/notifications/read
```

**Parameters**

| Parameter | Type | Required | Description |
|---|---|---|---|
| `notification_id` | integer | No | Notification to mark as read. Omit to mark all as read |

**Example Request**

```bash
curl "https://yourdomain.com/wp-json/fluent-boards/v2/notifications/read" \
  -X PUT \
  -u "USERNAME:APPLICATION_PASSWORD" \
  -H "Content-Type: application/json" \
  -d '{"notification_id": 812}'
```

**Example Response**

For a single notification, `notification` is the user's delivery row. When marking all as read, `notification` is `null`.

```json
{
  "message": "Notification is updated",
  "notification": {
    "id": 1934,
    "notification_id": 812,
    "user_id": 1,
    "marked_read_at": "2025-08-12 10:02:44",
    "created_at": "2025-08-12 09:15:02",
    "updated_at": "2025-08-12 10:02:44"
  }
}
```

Returns `400` with `Notification could not be found` when the notification was not sent to the current user.

## Notification Preferences

Preferences are booleans. Global preferences are the user's defaults; board preferences override them for one board.

| Key | Scope | Description |
|---|---|---|
| `email_after_comment` | global, board | Email when someone comments on my tasks |
| `email_after_task_assign` | global, board | Email when I am assigned to a task |
| `email_after_task_stage_change` | global, board | Email when my task changes stage |
| `email_after_task_due_date_change` | global, board | Email when my task's due date changes |
| `email_after_remove_from_task` | global, board | Email when I am removed from a task |
| `email_after_task_archive` | global, board | Email when my task is archived |
| `watch_on_creating_task` | global, board | Watch tasks I create |
| `watch_on_commenting` | global, board | Watch tasks I comment on |
| `watch_on_assigning` | global, board | Watch tasks I am assigned to |
| `dashboard_notification` | board | Show in-app notifications for this board |

## Get Global Notification Settings

Return the current user's global preferences. Missing keys are filled with defaults (`true`), and the defaults are saved on first call.

```http
GET /wp-json/fluent-boards/v2/get-global-notification-settings
```

**Example Request**

```bash
curl "https://yourdomain.com/wp-json/fluent-boards/v2/get-global-notification-settings" \
  -u "USERNAME:APPLICATION_PASSWORD"
```

**Example Response**

```json
{
  "currentSettings": {
    "email_after_comment": true,
    "email_after_task_stage_change": true,
    "email_after_task_assign": true,
    "email_after_task_due_date_change": true,
    "email_after_remove_from_task": true,
    "email_after_task_archive": true,
    "watch_on_creating_task": true,
    "watch_on_commenting": true,
    "watch_on_assigning": false
  }
}
```

## Update Global Notification Settings

Save the current user's global preferences. Unknown keys are ignored and keys you leave out are reset to `true`. The saved settings are also copied to every board the user can access.

```http
POST /wp-json/fluent-boards/v2/update-global-notification-settings
```

**Parameters**

| Parameter | Type | Required | Description |
|---|---|---|---|
| `updatedSettings` | object | Yes | Map of [preference keys](#notification-preferences) to booleans (`true`/`false`, `1`/`0` or `"true"`/`"false"`) |

**Example Request**

```bash
curl "https://yourdomain.com/wp-json/fluent-boards/v2/update-global-notification-settings" \
  -X POST \
  -u "USERNAME:APPLICATION_PASSWORD" \
  -H "Content-Type: application/json" \
  -d '{
    "updatedSettings": {
      "email_after_comment": true,
      "email_after_task_stage_change": false,
      "email_after_task_assign": true,
      "email_after_task_due_date_change": true,
      "email_after_remove_from_task": true,
      "email_after_task_archive": false,
      "watch_on_creating_task": true,
      "watch_on_commenting": true,
      "watch_on_assigning": false
    }
  }'
```

**Example Response**

```json
{
  "message": "Notification settings are updated"
}
```

::: warning
Call [Get Global Notification Settings](#get-global-notification-settings) at least once for a user before updating. The update expects the settings row that the GET call creates and fails if it does not exist yet.
:::

## Get Board Notification Settings

Return the current user's preferences for one board. Keys not saved for the board fall back to the defaults, and the `watch_on_*` keys fall back to the user's global settings.

```http
GET /wp-json/fluent-boards/v2/projects/{board_id}/notification-settings
```

**Example Request**

```bash
curl "https://yourdomain.com/wp-json/fluent-boards/v2/projects/3/notification-settings" \
  -u "USERNAME:APPLICATION_PASSWORD"
```

**Example Response**

```json
{
  "currentSettings": {
    "email_after_comment": true,
    "email_after_task_assign": true,
    "email_after_task_stage_change": false,
    "email_after_task_due_date_change": true,
    "email_after_remove_from_task": true,
    "email_after_task_archive": true,
    "dashboard_notification": true,
    "watch_on_creating_task": true,
    "watch_on_commenting": true,
    "watch_on_assigning": true
  }
}
```

## Update Board Notification Settings

Save the current user's preferences for one board. The saved set replaces the previous one: unknown keys are dropped, and keys you leave out fall back to the defaults on the next read. Nothing is saved if the user is not a member of the board.

```http
PUT /wp-json/fluent-boards/v2/projects/{board_id}/update-notification-settings
```

**Parameters**

| Parameter | Type | Required | Description |
|---|---|---|---|
| `updatedSettings` | object | Yes | Map of [preference keys](#notification-preferences) to booleans |

**Example Request**

```bash
curl "https://yourdomain.com/wp-json/fluent-boards/v2/projects/3/update-notification-settings" \
  -X PUT \
  -u "USERNAME:APPLICATION_PASSWORD" \
  -H "Content-Type: application/json" \
  -d '{
    "updatedSettings": {
      "email_after_comment": true,
      "email_after_task_assign": true,
      "email_after_task_stage_change": false,
      "email_after_task_due_date_change": true,
      "email_after_remove_from_task": true,
      "email_after_task_archive": true,
      "dashboard_notification": true,
      "watch_on_creating_task": true,
      "watch_on_commenting": true,
      "watch_on_assigning": true
    }
  }'
```

**Example Response**

```json
{
  "message": "Board notification settings have been updated"
}
```

See [Common Error Responses](/rest-api/shared/error-responses) for standard error formats.
