# Public Boards

The Public Boards API serves the read-only board view embedded with the `[fluent_board_public id="…"]` shortcode. Logged-out visitors can call it: it needs no WordPress login, nonce or application password. Instead, each request carries a signed per-board `public_token`. Plugin source: free.

Turn public access on with [Toggle Public Access](/rest-api/boards#toggle-public-access), and read the current state with [Get Public Access Settings](/rest-api/boards#get-public-access-settings).

## Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/public/boards/{board_id}` | Get the public board |
| GET | `/public/boards/{board_id}/tasks` | List all public board tasks |
| GET | `/public/boards/{board_id}/tasks/by-stage` | List the first 20 tasks of each stage |
| GET | `/public/boards/{board_id}/tasks/stage-page` | Page through one stage's tasks |

## Access Rules

All routes use `PublicBoardPolicy`. A request is allowed only when all of these hold:

- The method is `GET`. Every other method is rejected.
- `public_token` is valid for the `board_id` in the URL.
- The board exists and is not archived.
- Public access is enabled on the board (board meta `public_access_enabled`).

**The `public_token` parameter**

| Parameter | Type | Required | Description |
|---|---|---|---|
| `public_token` | string | Yes | Signed board token. Send it as a query parameter on every request |

The token is a URL-safe base64 string of `{board_id}|{signature}`, where the signature is an HMAC-SHA256 keyed with the site's `auth` salt and a per-board salt. The shortcode page generates the token and passes it to the embedded app as `fluentAddonVars.public_token`. You cannot generate one through the REST API. If the per-board salt is rotated (`PublicAccessService::revokeAccessToken()`), previously issued tokens stop working.

**What is hidden**

Public responses never include private data:

- Users (board members and task assignees) are reduced to `ID`, `display_name`, `photo` and `role`.
- Boards hide `settings`, `currency`, `crm_contact_id`, `created_by` and `updated_at`.
- Tasks hide `description`, `crm_contact_id`, `lead_value`, `created_by`, `source`, `source_id`, `settings`, `reminder_type`, `remind_at`, `slug`, `started_at`, `last_completed_at`, `comments_count`, `archived_at`, `parent_id` and `type`. They return `watchers: []`, `notifications: []`, `contact: null` and `is_watching: false`.

Only active (non-archived) stages and top-level, non-archived tasks are returned.

## Get Public Board

Get the board with its stages, labels and members.

```http
GET /wp-json/fluent-boards/v2/public/boards/{board_id}
```

**Example Request**

```bash
curl "https://yourdomain.com/wp-json/fluent-boards/v2/public/boards/9?public_token=OXw1ZTg4NDg5OGRhMjgwNDcxNTFkMGU1NmY4ZGM2MjkyNzczNjAzZDBk..."
```

**Example Response**

```json
{
  "board": {
    "id": 9,
    "parent_id": null,
    "title": "Product Roadmap",
    "description": "What we are working on",
    "type": "to-do",
    "background": {
      "id": "solid_1",
      "color": "#6A88A7",
      "is_image": false,
      "image_url": null
    },
    "archived_at": null,
    "createdOn": "2025-08-01",
    "meta": {},
    "isUserOnlyViewer": true,
    "is_pinned": false,
    "stages": [
      { "id": 41, "board_id": 9, "title": "Planned", "position": "1.00" },
      { "id": 42, "board_id": 9, "title": "In Progress", "position": "2.00" }
    ],
    "labels": [
      { "id": 12, "board_id": 9, "title": "feature", "bg_color": "#AED6F1" }
    ],
    "users": [
      {
        "ID": 1,
        "display_name": "Admin User",
        "photo": "https://secure.gravatar.com/avatar/...",
        "role": "Admin"
      }
    ]
  }
}
```

## List Public Board Tasks

Get every top-level, non-archived task in the board's active stages, sorted by `due_at`. There is no pagination.

```http
GET /wp-json/fluent-boards/v2/public/boards/{board_id}/tasks
```

**Example Request**

```bash
curl "https://yourdomain.com/wp-json/fluent-boards/v2/public/boards/9/tasks?public_token=OXw1ZTg4NDg5OGRh..."
```

**Example Response**

```json
{
  "tasks": [
    {
      "id": 301,
      "board_id": 9,
      "title": "Dark mode",
      "status": "open",
      "stage_id": 42,
      "priority": "medium",
      "position": "1.00",
      "issue_number": 14,
      "due_at": "2025-09-01 00:00:00",
      "created_at": "2025-08-02T10:00:00+00:00",
      "updated_at": "2025-08-05T12:30:00+00:00",
      "isOverdue": false,
      "isUpcoming": true,
      "is_watching": false,
      "contact": null,
      "notifications": [],
      "watchers": [],
      "labels": [
        { "id": 12, "title": "feature", "bg_color": "#AED6F1" }
      ],
      "assignees": [
        {
          "ID": 1,
          "display_name": "Admin User",
          "photo": "https://secure.gravatar.com/avatar/...",
          "role": "Member"
        }
      ]
    }
  ]
}
```

## List Tasks by Stage

Get the first 20 tasks (by `position`) of each active stage, with cursor information for loading more through [Page Through Stage Tasks](#page-through-stage-tasks).

```http
GET /wp-json/fluent-boards/v2/public/boards/{board_id}/tasks/by-stage
```

**Example Request**

```bash
curl "https://yourdomain.com/wp-json/fluent-boards/v2/public/boards/9/tasks/by-stage?public_token=OXw1ZTg4NDg5OGRh..."
```

**Example Response**

`tasks` is a flat list across all stages, with the same task shape as [List Public Board Tasks](#list-public-board-tasks). `pagination_by_stage` is keyed by stage ID.

```json
{
  "tasks": [
    { "id": 301, "stage_id": 42, "title": "Dark mode", "position": "1.00" }
  ],
  "pagination_by_stage": {
    "41": {
      "stage_id": 41,
      "total_count": 0,
      "limit": 20,
      "direction": "next",
      "cursor": null,
      "has_more": false,
      "has_more_before": false,
      "has_more_after": false,
      "start_cursor": null,
      "end_cursor": null
    },
    "42": {
      "stage_id": 42,
      "total_count": 35,
      "limit": 20,
      "direction": "next",
      "cursor": null,
      "has_more": true,
      "has_more_before": false,
      "has_more_after": true,
      "start_cursor": 1,
      "end_cursor": 20
    }
  }
}
```

## Page Through Stage Tasks

Get one page of tasks in a stage, using the task `position` as a cursor. To load more, pass the previous page's `end_cursor` as `cursor` with `direction=next`. To go back, pass `start_cursor` with `direction=prev`.

```http
GET /wp-json/fluent-boards/v2/public/boards/{board_id}/tasks/stage-page
```

**Parameters**

| Parameter | Type | Required | Description |
|---|---|---|---|
| `stage_id` | integer | Yes | Active stage on this board. 400 if missing, 404 if not found |
| `limit` | integer | No | Tasks per page, 1 to 100. Default `20` |
| `direction` | string | No | `next` (default) returns tasks after the cursor, `prev` returns tasks before it. Any other value returns 400 |
| `cursor` | number | No | Task `position` to page from. Without it, the page starts at the beginning of the stage |

**Example Request**

```bash
curl "https://yourdomain.com/wp-json/fluent-boards/v2/public/boards/9/tasks/stage-page?stage_id=42&cursor=20&direction=next&limit=20&public_token=OXw1ZTg4NDg5OGRh..."
```

**Example Response**

Tasks are always returned in ascending `position` order, whatever the `direction`. `has_more` tells you whether more tasks exist in the requested direction.

```json
{
  "tasks": [
    { "id": 330, "stage_id": 42, "title": "Export to PDF", "position": "21.00" }
  ],
  "pagination": {
    "stage_id": 42,
    "limit": 20,
    "direction": "next",
    "cursor": 20,
    "has_more": false,
    "has_more_before": true,
    "has_more_after": false,
    "start_cursor": 21,
    "end_cursor": 35
  }
}
```

## Error Responses

- **401 / 403**: missing or invalid `public_token`, public access disabled, board archived, or a non-`GET` method
- **400**: missing `stage_id`, or an invalid `direction` (stage-page only)
- **404**: board or stage not found

See [Common Error Responses](/rest-api/shared/error-responses) for standard error formats.
