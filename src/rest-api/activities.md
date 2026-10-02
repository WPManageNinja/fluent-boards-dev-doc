# Activities

FluentBoards writes an activity log entry when something changes on a board or a task, for example when a task is created, moved or archived, or a label or assignee is added. The Activities API reads that log: per board, per task (alone or merged with comments), and per member. All activity endpoints are read-only. There is no endpoint to create, edit or delete activity entries. Plugin source: free.

## Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/projects/{board_id}/activities` | List board activities |
| GET | `/projects/{board_id}/tasks/{task_id}/activities` | List task activities |
| GET | `/projects/{board_id}/tasks/{task_id}/comments-and-activities` | List task comments and activities as one feed |
| GET | `/member/{id}/activities` | List a member's activities |

Board and task routes use `SingleBoardPolicy`: the user must be a member of the board (viewers included) or a FluentBoards admin. The member route uses `UserPolicy`: the user needs FluentBoards access and must be the member, an admin, or share a board with the member.

## Activity Object

Activities are stored in the `fbs_activities` table.

| Field | Type | Description |
|---|---|---|
| `id` | integer | Activity ID |
| `object_id` | integer | Board ID or task ID, depending on `object_type` |
| `object_type` | string | `board_activity` or `task_activity` |
| `action` | string | What happened, e.g. `created`, `updated`, `added`, `removed`, `changed`, `moved`, `archived`, `restored`, `deleted`. Translated on the board and task endpoints |
| `column` | string\|null | What changed, e.g. `task`, `stage`, `label`, `assignee`, `description`, `priority`, `Due Date`. Translated on the board and task endpoints |
| `old_value` | string\|null | Previous value, when relevant |
| `new_value` | string\|null | New value, when relevant |
| `description` | string\|null | Extra context, e.g. `on stage Feature Requests` |
| `settings` | object\|null | Extra data, e.g. `{ "task_id": 279 }` on board activities about a task |
| `created_by` | integer | User ID of the actor |
| `created_at` | string | When the activity happened |
| `updated_at` | string | Last update timestamp |
| `user` | object | The actor (`ID`, `display_name`, `photo`, …). `user_email` is included only for users who can `list_users` |

The board and task activity endpoints also add `action_key` and `column_key`, which hold the untranslated values of `action` and `column`. Use these keys when you match on the value.

## List Board Activities

Get the activity log of a board, newest first.

```http
GET /wp-json/fluent-boards/v2/projects/{board_id}/activities
```

**Parameters**

| Parameter | Type | Required | Description |
|---|---|---|---|
| `per_page` | integer | No | Activities per page. Default `40` |
| `page` | integer | No | Page number. Default `1` |

**Example Request**

```bash
curl "https://yourdomain.com/wp-json/fluent-boards/v2/projects/3/activities?per_page=40&page=1" \
  -u "USERNAME:APPLICATION_PASSWORD"
```

**Example Response**

```json
{
  "activities": {
    "current_page": 1,
    "data": [
      {
        "id": 538,
        "object_id": 3,
        "object_type": "board_activity",
        "action": "deleted",
        "column": "task",
        "old_value": "Updated Task Title",
        "new_value": null,
        "description": null,
        "created_by": 1,
        "settings": null,
        "created_at": "2025-08-04T09:23:52+00:00",
        "updated_at": "2025-08-04T09:23:52+00:00",
        "action_key": "deleted",
        "column_key": "task",
        "user": {
          "ID": 1,
          "display_name": "John Doe",
          "user_login": "john_doe",
          "photo": "https://secure.gravatar.com/avatar/..."
        }
      },
      {
        "id": 533,
        "object_id": 3,
        "object_type": "board_activity",
        "action": "created",
        "column": "task",
        "old_value": null,
        "new_value": "New Task Title",
        "description": "on stage Feature Requests",
        "created_by": 1,
        "settings": {
          "task_id": 279
        },
        "created_at": "2025-08-04T09:00:39+00:00",
        "updated_at": "2025-08-04T09:00:39+00:00",
        "action_key": "created",
        "column_key": "task",
        "user": {
          "ID": 1,
          "display_name": "John Doe",
          "user_login": "john_doe",
          "photo": "https://secure.gravatar.com/avatar/..."
        }
      }
    ],
    "per_page": 40,
    "total": 94,
    "last_page": 3
  }
}
```

## List Task Activities

Get the activity log of a task. Page size is fixed at 15. Returns an error if the task does not belong to the board.

```http
GET /wp-json/fluent-boards/v2/projects/{board_id}/tasks/{task_id}/activities
```

**Parameters**

| Parameter | Type | Required | Description |
|---|---|---|---|
| `filter` | string | No | `newest` or `oldest`. Without it, no sort order is applied |
| `page` | integer | No | Page number. Default `1` |

**Example Request**

```bash
curl "https://yourdomain.com/wp-json/fluent-boards/v2/projects/3/tasks/279/activities?filter=newest" \
  -u "USERNAME:APPLICATION_PASSWORD"
```

**Example Response**

```json
{
  "activities": {
    "current_page": 1,
    "data": [
      {
        "id": 610,
        "object_id": 279,
        "object_type": "task_activity",
        "action": "changed",
        "column": "priority",
        "old_value": "low",
        "new_value": "high",
        "description": null,
        "created_by": 1,
        "settings": null,
        "created_at": "2025-08-05T11:02:10+00:00",
        "updated_at": "2025-08-05T11:02:10+00:00",
        "action_key": "changed",
        "column_key": "priority",
        "user": {
          "ID": 1,
          "display_name": "John Doe",
          "photo": "https://secure.gravatar.com/avatar/..."
        }
      }
    ],
    "per_page": 15,
    "total": 1,
    "last_page": 1
  }
}
```

## List Task Comments and Activities

Get a task's comments and activity entries merged into one feed, sorted by `created_at`. The task view uses it for its combined timeline. Activity entries about adding or updating comments and replies are left out, because the comments themselves are in the feed. Returns an error (500) if the task does not belong to the board.

```http
GET /wp-json/fluent-boards/v2/projects/{board_id}/tasks/{task_id}/comments-and-activities
```

**Parameters**

| Parameter | Type | Required | Description |
|---|---|---|---|
| `page` | integer | No | Page number. Default `1` |
| `per_page` | integer | No | Items per page. Default `10` |
| `filter` | string | No | `newest` (default) sorts newest first. Any other value sorts oldest first |
| `feed_type` | string | No | `all` (default), `comments` or `activities` |

**Example Request**

```bash
curl "https://yourdomain.com/wp-json/fluent-boards/v2/projects/3/tasks/279/comments-and-activities?page=1&per_page=10&feed_type=all" \
  -u "USERNAME:APPLICATION_PASSWORD"
```

**Example Response**

`comments_and_activities` has a paginator shape built by hand. `data` mixes two kinds of row:

- **Comment rows** have `task_id`, `type` (`comment`, `note` or `reply`), `privacy`, `avatar`, `user` and `replies` (each reply has its own `user`).
- **Activity rows** have `object_type: "task_activity"` and `user`. They do not include `action_key` / `column_key`.

The page URL fields (`path`, `first_page_url`, `next_page_url`, …) currently hold a hard-coded host. Paginate with `page` and `last_page` rather than following those URLs.

```json
{
  "comments_and_activities": {
    "current_page": 1,
    "data": [
      {
        "id": 88,
        "board_id": 3,
        "task_id": 279,
        "parent_id": null,
        "type": "comment",
        "privacy": "public",
        "status": "published",
        "description": "<p>Draft is ready for review.</p>",
        "created_by": 1,
        "settings": null,
        "created_at": "2025-08-05 11:10:00",
        "updated_at": "2025-08-05 11:10:00",
        "avatar": "https://secure.gravatar.com/avatar/...",
        "user": {
          "ID": 1,
          "display_name": "John Doe",
          "photo": "https://secure.gravatar.com/avatar/..."
        },
        "replies": []
      },
      {
        "id": 610,
        "object_id": 279,
        "object_type": "task_activity",
        "action": "changed",
        "column": "priority",
        "old_value": "low",
        "new_value": "high",
        "description": null,
        "created_by": 1,
        "settings": null,
        "created_at": "2025-08-05 11:02:10",
        "updated_at": "2025-08-05 11:02:10",
        "user": {
          "ID": 1,
          "display_name": "John Doe",
          "photo": "https://secure.gravatar.com/avatar/..."
        }
      }
    ],
    "first_page_url": "…?page=1",
    "from": 1,
    "last_page": 1,
    "last_page_url": "…?page=1",
    "links": [],
    "next_page_url": null,
    "path": "…/projects/3/tasks/279/comments-and-activities",
    "per_page": 10,
    "prev_page_url": null,
    "to": 2,
    "total": 2
  }
}
```

## List Member Activities

Get the activities performed by a member, newest first, 40 per page. Only board and task activities on boards the current user can access are returned. Each row has the related `board` (for board activities) or `task` (for task activities) loaded. `action` and `column` are not translated here, and there is no `action_key` / `column_key`.

```http
GET /wp-json/fluent-boards/v2/member/{id}/activities
```

**Parameters**

| Parameter | Type | Required | Description |
|---|---|---|---|
| `id` | integer | Yes | WordPress user ID of the member, in the path |
| `page` | integer | No | Page number. Default `1` |

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
      "id": 702,
      "object_id": 279,
      "object_type": "task_activity",
      "action": "moved",
      "column": "stage",
      "old_value": "Open",
      "new_value": "In Progress",
      "description": null,
      "created_by": 5,
      "settings": null,
      "created_at": "2025-08-06T08:12:00+00:00",
      "updated_at": "2025-08-06T08:12:00+00:00",
      "user": {
        "ID": 5,
        "display_name": "Jane Smith",
        "photo": "https://secure.gravatar.com/avatar/..."
      },
      "task": {
        "id": 279,
        "board_id": 3,
        "title": "Write release notes"
      }
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

See [Common Error Responses](/rest-api/shared/error-responses) for standard error formats.
