# Boards

Boards (called "projects" in the REST paths) are the top-level containers for stages, labels and tasks. The Boards API lets you list, create, update, archive, duplicate and delete boards, and manage board-level settings such as the background, pinned state, CRM contact and public access. Plugin source: free.

Routes under `/projects` use `AuthPolicy`: any logged-in user can call them, and each endpoint filters results to the boards the user can access. Routes under `/projects/{board_id}` use `SingleBoardPolicy`: the user must be a member of the board (or a FluentBoards admin), and board viewers can only call `GET` endpoints. Stricter requirements are noted per endpoint.

## Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/projects` | List boards |
| POST | `/projects` | Create a board |
| GET | `/projects/get-default-board-colors` | Get the default background palette |
| GET | `/projects/list-of-boards` | List all accessible boards with their stages |
| GET | `/projects/user-accessible-boards` | Search accessible boards (lightweight) |
| GET | `/projects/crm-associated-boards/{associated_id}` | List boards linked to a FluentCRM contact |
| GET | `/projects/currencies` | List supported currencies |
| GET | `/projects/user-admin-in-boards` | List the current user's board relations |
| GET | `/projects/recent-boards` | List recently opened boards |
| GET | `/projects/pinned-boards` | List pinned boards |
| POST | `/projects/onboard` | Create the first board during onboarding |
| PUT | `/projects/skip-onboarding` | Skip onboarding |
| GET | `/projects/{board_id}` | Get a board |
| GET | `/projects/{board_id}/has-data-changed` | Get board changes since a cursor |
| PUT | `/projects/{board_id}` | Update title and description |
| PUT | `/projects/{board_id}/update-board-properties` | Update roadmap page and stage-change email settings |
| DELETE | `/projects/{board_id}` | Delete a board |
| PUT | `/projects/{board_id}/archive-board` | Archive a board |
| PUT | `/projects/{board_id}/restore-board` | Restore an archived board |
| POST | `/projects/{board_id}/duplicate-board` | Duplicate a board |
| PUT | `/projects/{board_id}/pin-board` | Pin a board |
| PUT | `/projects/{board_id}/unpin-board` | Unpin a board |
| PUT | `/projects/{board_id}/upload/background` | Set or reset the background |
| POST | `/projects/{board_id}/upload/background-image` | Upload a background image |
| POST | `/projects/{board_id}/crm-contact` | Set the board's FluentCRM contact |
| GET | `/projects/{board_id}/crm-contacts` | List FluentCRM contacts linked to the board |
| GET | `/projects/{board_id}/board-menu-items` | Get the board menu items |
| GET | `/projects/{board_id}/public-access-settings` | Get public access settings |
| PUT | `/projects/{board_id}/toggle-public-access` | Enable or disable public access |

Related pages: board members are on [Users & Members](/rest-api/users), board activity is on [Activities](/rest-api/activities), stages are on [Stages](/rest-api/stages), and the read-only public board API is on [Public Boards](/rest-api/public-boards).

## Board Object

Boards are stored in the `fbs_boards` table. `created_at` and `updated_at` are hidden from API output.

| Field | Type | Description |
|---|---|---|
| `id` | integer | Board ID |
| `parent_id` | integer\|null | Parent board (unused by the UI) |
| `title` | string | Board title |
| `description` | string\|null | Board description (Markdown/HTML) |
| `type` | string | `to-do`, or `roadmap` when the Fluent Roadmap add-on is active |
| `currency` | string\|null | Currency code, e.g. `USD` |
| `background` | object\|string | `id`, `color`, `image_url`, `is_image`. Empty string when no background is set |
| `settings` | object\|null | Board settings (for example `is_template` on template boards) |
| `created_by` | integer | User ID of the creator |
| `archived_at` | string\|null | Archive timestamp, `null` when active |
| `meta` | object | All board meta as `key: value` pairs (appended) |
| `isUserOnlyViewer` | boolean | `true` when the current user is a viewer on this board (appended) |

List and detail endpoints add extra keys, such as `stages`, `users`, `completed_tasks_count` and `is_pinned`. Each endpoint lists them below.

## List Boards

Get a paginated list of boards the current user can access. Template boards are excluded. Without the Fluent Roadmap add-on, only `to-do` boards are returned. With it, roadmap boards are included too.

```http
GET /wp-json/fluent-boards/v2/projects
```

**Parameters**

| Parameter | Type | Required | Description |
|---|---|---|---|
| `per_page` | integer | No | Boards per page, 1 to 100. Default `100` |
| `page` | integer | No | Page number. Default `1` |
| `searchInput` | string | No | Filter by title (`LIKE %value%`) |
| `option` | string | No | `archived` returns archived boards, `pinned` returns the user's pinned boards. Any other value (or none) returns active boards |
| `fid` | integer | No | Folder ID. Returns only the boards in that folder |
| `order` | string | No | Column to sort by. Default `created_at` |
| `orderBy` | string | No | Sort direction, `ASC` or `DESC`. Default `DESC` |
| `type` | string | No | Read by the controller but currently not applied to the query |

::: warning Parameter naming
`order` holds the column name and `orderBy` holds the direction. This is the reverse of what the names suggest.
:::

**Example Request**

```bash
curl "https://yourdomain.com/wp-json/fluent-boards/v2/projects?per_page=20&page=1&searchInput=launch&order=title&orderBy=ASC" \
  -u "USERNAME:APPLICATION_PASSWORD"
```

**Example Response**

`boards` is a paginator. Each board includes `completed_tasks_count`, `stages`, `users` (with their board `role`) and `is_pinned`. `board_counts` covers all boards the user can access, whatever the filters. `folder_mapping` is keyed by folder ID. When `fid` is sent, `current_folder` is also returned (`id`, `title`, `board_count`), or `null` if the folder is not found.

```json
{
  "boards": {
    "current_page": 1,
    "data": [
      {
        "id": 1,
        "parent_id": null,
        "title": "Product Launch",
        "description": "Tasks for the Q3 launch",
        "type": "to-do",
        "currency": "USD",
        "background": {
          "id": "solid_1",
          "color": "#6A88A7",
          "is_image": false,
          "image_url": null
        },
        "settings": null,
        "created_by": 1,
        "archived_at": null,
        "completed_tasks_count": 5,
        "meta": {},
        "isUserOnlyViewer": false,
        "is_pinned": true,
        "stages": [
          {
            "id": 1,
            "board_id": 1,
            "title": "Open",
            "type": "stage",
            "position": "1.00"
          }
        ],
        "users": [
          {
            "ID": 1,
            "user_login": "admin",
            "display_name": "Admin User",
            "photo": "https://secure.gravatar.com/avatar/example?s=128&d=mm&r=g",
            "role": "Admin"
          }
        ]
      }
    ],
    "per_page": 20,
    "total": 1,
    "last_page": 1
  },
  "board_counts": {
    "all": 12,
    "pinned": 2,
    "archived": 3
  },
  "folder_mapping": {
    "4": {
      "id": 4,
      "title": "Marketing",
      "board_ids": [1, 7]
    }
  }
}
```

## Create a Board

Create a board. Requires board-creation permission: FluentBoards admins, or members when the "allow members to create boards" setting is on (filterable with `fluent_boards/can_create_board`).

If you send no `stages`, the default stages are created. If you send no `labels`, the default labels are created. Roadmap boards (`board[type] = roadmap`) get roadmap stages. The creator is added to the board as a board admin, and `fluent_boards/board_created` fires. `board[currency]` defaults to `USD`.

```http
POST /wp-json/fluent-boards/v2/projects
```

**Parameters**

| Parameter | Type | Required | Description |
|---|---|---|---|
| `board[title]` | string | Yes | Board title |
| `board[type]` | string | Yes | `to-do` or `roadmap` |
| `board[description]` | string | No | Board description |
| `board[currency]` | string | No | Currency code |
| `board[crm_contact_id]` | integer | No | FluentCRM contact to associate with the board |
| `folder_id` | integer | No | Folder to add the board to. The user must be able to modify the folder |
| `background[id]` | string | No | A palette ID from [Get Default Background Colors](#get-default-background-colors), e.g. `solid_1` or `gradient_2`. Unknown IDs are ignored |
| `stages` | array | No | Stage objects: `title` (required), `slug`, `position` |
| `labels` | array | No | Label objects: `label`, `bg_color`, `color`, `color_preset`. An unknown `color_preset` rejects the request |
| `member_ids` | array | No | WordPress user IDs to add as board members |

**Example Request**

```bash
curl "https://yourdomain.com/wp-json/fluent-boards/v2/projects" \
  -X POST \
  -u "USERNAME:APPLICATION_PASSWORD" \
  -H "Content-Type: application/json" \
  -d '{
    "board": {
      "title": "New Project Board",
      "description": "A new project board for development tasks",
      "type": "to-do"
    },
    "background": { "id": "solid_4" },
    "stages": [
      { "title": "Backlog" },
      { "title": "Doing" },
      { "title": "Done" }
    ],
    "member_ids": [5, 9]
  }'
```

**Example Response** (HTTP 201)

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
      "color": "#5f27cd",
      "is_image": false,
      "image_url": null
    },
    "created_by": 1,
    "id": 9,
    "meta": [],
    "isUserOnlyViewer": false
  }
}
```

## Get Default Background Colors

Get the solid and gradient palettes you can use as board backgrounds.

```http
GET /wp-json/fluent-boards/v2/projects/get-default-board-colors
```

**Example Request**

```bash
curl "https://yourdomain.com/wp-json/fluent-boards/v2/projects/get-default-board-colors" \
  -u "USERNAME:APPLICATION_PASSWORD"
```

**Example Response**

```json
{
  "solidColors": [
    { "id": "solid_1", "value": "#6A88A7", "dark_value": "#314253" },
    { "id": "solid_2", "value": "#9E7D61", "dark_value": "#574435" }
  ],
  "gradients": [
    {
      "id": "gradient_1",
      "value": "linear-gradient(145deg, #479176 0%, #0F2C2B 100%)",
      "dark_value": "linear-gradient(145deg, #156A4F 0%, #0D302F 100%)"
    }
  ]
}
```

## List All Boards with Stages

Get every active, non-template board the user can access (no pagination), plus a flat list of their active stages. The UI uses it for board and stage pickers, for example when moving a task to another board.

```http
GET /wp-json/fluent-boards/v2/projects/list-of-boards
```

**Example Request**

```bash
curl "https://yourdomain.com/wp-json/fluent-boards/v2/projects/list-of-boards" \
  -u "USERNAME:APPLICATION_PASSWORD"
```

**Example Response**

```json
{
  "boards": [
    {
      "id": 1,
      "title": "Product Launch",
      "type": "to-do",
      "stages": [
        { "id": 1, "board_id": 1, "title": "Open", "position": "1.00" }
      ]
    }
  ],
  "all_stages": [
    { "id": 1, "board_id": 1, "title": "Open", "position": "1.00" },
    { "id": 2, "board_id": 1, "title": "In Progress", "position": "2.00" }
  ]
}
```

## Search Accessible Boards

Get active, non-template boards the user can access, newest first, without relations. Optionally filter by title.

```http
GET /wp-json/fluent-boards/v2/projects/user-accessible-boards
```

**Parameters**

| Parameter | Type | Required | Description |
|---|---|---|---|
| `searchInput` | string | No | Filter by title (`LIKE %value%`) |

**Example Request**

```bash
curl "https://yourdomain.com/wp-json/fluent-boards/v2/projects/user-accessible-boards?searchInput=launch" \
  -u "USERNAME:APPLICATION_PASSWORD"
```

**Example Response**

```json
{
  "boards": [
    {
      "id": 1,
      "title": "Product Launch",
      "type": "to-do",
      "archived_at": null,
      "meta": {},
      "isUserOnlyViewer": false
    }
  ]
}
```

## List CRM-Associated Boards

Get the active boards linked to a FluentCRM contact, either because the board is associated with the contact or because one of its tasks is. Only boards the user can access are returned. Requires FluentCRM and the `fcrm_read_contacts` FluentCRM permission (403 otherwise).

```http
GET /wp-json/fluent-boards/v2/projects/crm-associated-boards/{associated_id}
```

**Parameters**

| Parameter | Type | Required | Description |
|---|---|---|---|
| `associated_id` | integer | Yes | FluentCRM contact (subscriber) ID, in the path |

**Example Request**

```bash
curl "https://yourdomain.com/wp-json/fluent-boards/v2/projects/crm-associated-boards/42" \
  -u "USERNAME:APPLICATION_PASSWORD"
```

**Example Response**

Each board includes `completed_tasks_count`, `stages` and `users`.

```json
{
  "boards": [
    {
      "id": 3,
      "title": "Onboarding - Acme Inc",
      "type": "to-do",
      "completed_tasks_count": 2,
      "stages": [],
      "users": []
    }
  ]
}
```

## List Currencies

Get the supported currencies as a map of currency code to name. The response is the map itself, with no wrapper key.

```http
GET /wp-json/fluent-boards/v2/projects/currencies
```

**Example Request**

```bash
curl "https://yourdomain.com/wp-json/fluent-boards/v2/projects/currencies" \
  -u "USERNAME:APPLICATION_PASSWORD"
```

**Example Response**

```json
{
  "AED": "United Arab Emirates Dirham",
  "AFN": "Afghan Afghani",
  "AUD": "Australian Dollar",
  "BDT": "Bangladeshi Taka",
  "USD": "United States Dollar"
}
```

## List User Board Relations

Meant to return the current user's active board relations. Requires access to at least one board.

```http
GET /wp-json/fluent-boards/v2/projects/user-admin-in-boards
```

::: warning
The service filters `fbs_relations` on `board_id`, `user_id` and `status`, but that table has no such columns (it uses `object_id`, `foreign_id` and `object_type`). The endpoint does not currently return usable data.
:::

**Example Request**

```bash
curl "https://yourdomain.com/wp-json/fluent-boards/v2/projects/user-admin-in-boards" \
  -u "USERNAME:APPLICATION_PASSWORD"
```

**Response keys:** `userBoards` (array of relation rows).

## List Recent Boards

Get up to 4 boards the current user opened most recently. Opening a board with [Get a Board](#get-a-board) records it. If the user has no recent boards, the first 4 accessible active boards are returned.

```http
GET /wp-json/fluent-boards/v2/projects/recent-boards
```

**Example Request**

```bash
curl "https://yourdomain.com/wp-json/fluent-boards/v2/projects/recent-boards" \
  -u "USERNAME:APPLICATION_PASSWORD"
```

**Example Response**

Each board includes `completed_tasks_count`, `stages`, `users` and `is_pinned`.

```json
{
  "boards": [
    {
      "id": 1,
      "title": "Product Launch",
      "type": "to-do",
      "completed_tasks_count": 5,
      "is_pinned": false,
      "stages": [],
      "users": []
    }
  ]
}
```

## List Pinned Boards

Get the active boards the current user has pinned. Relations are not loaded.

```http
GET /wp-json/fluent-boards/v2/projects/pinned-boards
```

**Example Request**

```bash
curl "https://yourdomain.com/wp-json/fluent-boards/v2/projects/pinned-boards" \
  -u "USERNAME:APPLICATION_PASSWORD"
```

**Example Response**

```json
{
  "pinnedBoards": [
    {
      "id": 1,
      "title": "Product Launch",
      "type": "to-do",
      "archived_at": null,
      "meta": {},
      "isUserOnlyViewer": false
    }
  ]
}
```

## Create First Board (Onboarding)

Create the first board from the onboarding wizard. You can also create its stages and a first task, and install FluentCRM. Requires WordPress admin / FluentBoards admin.

```http
POST /wp-json/fluent-boards/v2/projects/onboard
```

**Parameters**

| Parameter | Type | Required | Description |
|---|---|---|---|
| `board[title]` | string | Yes | Board title |
| `board[type]` | string | Yes | Board type, usually `to-do` |
| `board[description]` | string | No | Board description |
| `board[currency]` | string | No | Currency code |
| `board[crm_contact_id]` | integer | No | FluentCRM contact ID |
| `stages` | array | No | Stage objects with `title` (required) |
| `task[title]` | string | No | Title of a first task, created in the first stage |
| `withFluentCRM` | string | No | `yes` installs and activates FluentCRM if it is not already installed |

**Example Request**

```bash
curl "https://yourdomain.com/wp-json/fluent-boards/v2/projects/onboard" \
  -X POST \
  -u "USERNAME:APPLICATION_PASSWORD" \
  -H "Content-Type: application/json" \
  -d '{
    "board": { "title": "My First Board", "type": "to-do" },
    "stages": [{ "title": "To Do" }, { "title": "Done" }],
    "task": { "title": "Say hello" },
    "withFluentCRM": "no"
  }'
```

**Example Response**

```json
{
  "message": "Board has been created",
  "board": {
    "id": 1,
    "title": "My First Board",
    "type": "to-do",
    "created_by": 1
  }
}
```

## Skip Onboarding

Mark onboarding as complete without creating a board. Requires WordPress admin / FluentBoards admin.

```http
PUT /wp-json/fluent-boards/v2/projects/skip-onboarding
```

**Example Request**

```bash
curl "https://yourdomain.com/wp-json/fluent-boards/v2/projects/skip-onboarding" \
  -X PUT \
  -u "USERNAME:APPLICATION_PASSWORD"
```

**Example Response**

```json
{
  "message": "Onboarding skipped successfully"
}
```

## Get a Board

Get a board with its users, labels, owner and stages. This also records the board in the user's recent boards. The response goes through the `fluent_boards/board_find` filter.

```http
GET /wp-json/fluent-boards/v2/projects/{board_id}
```

**Parameters**

| Parameter | Type | Required | Description |
|---|---|---|---|
| `include_archived` | boolean | No | `true` also returns archived stages. Default `false` |

**Example Request**

```bash
curl "https://yourdomain.com/wp-json/fluent-boards/v2/projects/1" \
  -u "USERNAME:APPLICATION_PASSWORD"
```

**Example Response**

The board also includes `createdOn` (`Y-m-d`), `labelColor` / `labelColorText` (Trello color maps), `labelColorPresets` and `is_pinned`. With Pro, it also includes `custom_fields`. `synced_at` is the server time when the request started. Pass it as `since` to [Get Board Changes](#get-board-changes).

```json
{
  "board": {
    "id": 1,
    "title": "Sample Board",
    "description": "Board description",
    "type": "to-do",
    "currency": "USD",
    "background": {
      "id": "solid_1",
      "color": "#6A88A7",
      "is_image": false,
      "image_url": null
    },
    "settings": null,
    "created_by": 1,
    "archived_at": null,
    "createdOn": "2025-08-01",
    "is_pinned": false,
    "meta": {},
    "isUserOnlyViewer": false,
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
    "labelColorPresets": [
      {
        "id": "green-soft",
        "light_bg_color": "#C1EED9",
        "light_text_color": "#1B2533",
        "dark_bg_color": "#234030",
        "dark_text_color": "#FFFFFF"
      }
    ],
    "users": [
      {
        "ID": 1,
        "user_login": "admin",
        "display_name": "Admin User",
        "photo": "https://secure.gravatar.com/avatar/example?s=128&d=mm&r=g",
        "role": "Admin"
      }
    ],
    "owner": {
      "ID": 1,
      "display_name": "Admin User"
    },
    "stages": [
      { "id": 1, "title": "To Do", "position": "1.00" },
      { "id": 2, "title": "In Progress", "position": "2.00" }
    ],
    "labels": [
      { "id": 1, "title": "bug", "bg_color": "#E6B0AA" },
      { "id": 2, "title": "feature", "bg_color": "#AED6F1" }
    ],
    "custom_fields": []
  },
  "synced_at": "2025-08-06 10:15:00"
}
```

## Get Board Changes

Polling endpoint the board view uses to stay in sync. It returns the stages, labels and tasks that changed since `since`. If you send no `since`, it returns changes from the last 60 seconds. If `since` is malformed, in the future or older than 24 hours, it falls back to a full sync (`sync_reset: true`).

```http
GET /wp-json/fluent-boards/v2/projects/{board_id}/has-data-changed
```

**Parameters**

| Parameter | Type | Required | Description |
|---|---|---|---|
| `since` | string | No | Cursor in `Y-m-d H:i:s` format, normally the previous `synced_at` |
| `include_archived` | boolean | No | Include archived stages, labels and tasks. Default `false` |

**Example Request**

```bash
curl "https://yourdomain.com/wp-json/fluent-boards/v2/projects/1/has-data-changed?since=2025-08-06%2010:15:00" \
  -u "USERNAME:APPLICATION_PASSWORD"
```

**Example Response**

`board` is an empty object when the board itself did not change. When a `*ResetRequired` flag is `true`, the matching list holds the full set rather than a delta, so replace your local copy. `taskDeleted`, `stageDeleted` and `labelDeleted` are legacy aliases of the reset flags.

```json
{
  "board": {},
  "stages": [],
  "labels": [],
  "tasks": [
    {
      "id": 279,
      "title": "Write release notes",
      "stage_id": 2,
      "isOverdue": false,
      "isUpcoming": true,
      "is_watching": false,
      "contact": null,
      "assignees": [],
      "watchers": [],
      "labels": []
    }
  ],
  "taskDeleted": false,
  "stageDeleted": false,
  "labelDeleted": false,
  "taskResetRequired": false,
  "stageResetRequired": false,
  "labelResetRequired": false,
  "has_changes": true,
  "synced_at": "2025-08-06 10:16:00",
  "sync_reset": false
}
```

## Update a Board

Update the board title and description. Requires board manager. Fires `fluent_boards/board_updated`.

```http
PUT /wp-json/fluent-boards/v2/projects/{board_id}
```

**Parameters**

| Parameter | Type | Required | Description |
|---|---|---|---|
| `title` | string | Yes | Board title |
| `description` | string | No | Board description |

**Example Request**

```bash
curl "https://yourdomain.com/wp-json/fluent-boards/v2/projects/9" \
  -X PUT \
  -u "USERNAME:APPLICATION_PASSWORD" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Updated Board Title",
    "description": "Updated board description"
  }'
```

**Example Response**

```json
{
  "message": "Board has been updated",
  "board": {
    "id": 9,
    "title": "Updated Board Title",
    "description": "Updated board description",
    "type": "to-do",
    "background": {
      "id": "solid_4",
      "color": "#5f27cd",
      "is_image": false,
      "image_url": null
    }
  },
  "stages": [
    { "id": 96, "title": "Open", "position": "1.00" },
    { "id": 97, "title": "In Progress", "position": "2.00" },
    { "id": 98, "title": "Completed", "position": "3.00" }
  ]
}
```

## Update Board Properties

Set the roadmap page and the stage-change email toggle. Both values are stored as board meta (`roadmap_page_id`, `enable_stage_change_email`). Send both: a missing value is saved as empty. Requires WordPress admin / FluentBoards admin.

```http
PUT /wp-json/fluent-boards/v2/projects/{board_id}/update-board-properties
```

**Parameters**

| Parameter | Type | Required | Description |
|---|---|---|---|
| `page_id` | integer | No | WordPress page that shows the roadmap |
| `enable_stage_change_email` | string | No | Whether to email users when a task changes stage (e.g. `yes` / `no`) |

**Example Request**

```bash
curl "https://yourdomain.com/wp-json/fluent-boards/v2/projects/9/update-board-properties" \
  -X PUT \
  -u "USERNAME:APPLICATION_PASSWORD" \
  -H "Content-Type: application/json" \
  -d '{ "page_id": 120, "enable_stage_change_email": "yes" }'
```

**Example Response**

```json
{
  "message": "Board has been updated",
  "board": {
    "id": 9,
    "title": "Product Roadmap",
    "type": "roadmap",
    "meta": {
      "roadmap_page_id": "120",
      "enable_stage_change_email": "yes"
    }
  }
}
```

## Delete a Board

Permanently delete a board and its data. Requires WordPress admin / FluentBoards admin.

```http
DELETE /wp-json/fluent-boards/v2/projects/{board_id}
```

**Example Request**

```bash
curl "https://yourdomain.com/wp-json/fluent-boards/v2/projects/9" \
  -X DELETE \
  -u "USERNAME:APPLICATION_PASSWORD"
```

**Example Response**

```json
{
  "message": "Board has been deleted"
}
```

## Archive a Board

Archive a board (sets `archived_at`). Fires `fluent_boards/board_archived`. Requires WordPress admin / FluentBoards admin.

```http
PUT /wp-json/fluent-boards/v2/projects/{board_id}/archive-board
```

**Example Request**

```bash
curl "https://yourdomain.com/wp-json/fluent-boards/v2/projects/9/archive-board" \
  -X PUT \
  -u "USERNAME:APPLICATION_PASSWORD"
```

**Example Response**

```json
{
  "board": {
    "id": 9,
    "title": "Updated Board Title",
    "description": "Updated board description",
    "type": "to-do",
    "archived_at": "2025-08-06 06:40:05"
  },
  "message": "Board has been archived successfully!"
}
```

## Restore a Board

Restore an archived board. Fires `fluent_boards/board_restored`. Requires WordPress admin / FluentBoards admin.

```http
PUT /wp-json/fluent-boards/v2/projects/{board_id}/restore-board
```

**Example Request**

```bash
curl "https://yourdomain.com/wp-json/fluent-boards/v2/projects/9/restore-board" \
  -X PUT \
  -u "USERNAME:APPLICATION_PASSWORD"
```

**Example Response**

```json
{
  "board": {
    "id": 9,
    "title": "Updated Board Title",
    "type": "to-do",
    "archived_at": null
  },
  "message": "Board has been restored successfully!"
}
```

## Duplicate a Board

Create a copy of a board. Stages are always copied. Other content is copied only when you opt in. Requires WordPress admin / FluentBoards admin.

```http
POST /wp-json/fluent-boards/v2/projects/{board_id}/duplicate-board
```

**Parameters**

| Parameter | Type | Required | Description |
|---|---|---|---|
| `board[title]` | string | Yes | Title of the new board |
| `isWithTasks` | string | No | `yes` copies tasks |
| `isWithLabels` | string | No | `yes` copies labels |
| `isWithMembers` | string | No | `yes` copies board members |
| `isWithCustomFields` | string | No | `yes` copies custom fields (Pro). Default `yes` |
| `isWithTemplates` | string | No | `yes` keeps the template flag on copied stages and tasks. Otherwise the copies are plain stages and tasks |

**Example Request**

```bash
curl "https://yourdomain.com/wp-json/fluent-boards/v2/projects/9/duplicate-board" \
  -X POST \
  -u "USERNAME:APPLICATION_PASSWORD" \
  -H "Content-Type: application/json" \
  -d '{
    "board": { "title": "Board Alpha - Copy" },
    "isWithTasks": "yes",
    "isWithLabels": "yes",
    "isWithMembers": "no",
    "isWithTemplates": "no"
  }'
```

**Example Response**

```json
{
  "board": {
    "id": 10,
    "title": "Board Alpha - Copy",
    "type": "to-do",
    "background": {
      "id": "solid_4",
      "color": "#5f27cd",
      "is_image": false,
      "image_url": null
    },
    "created_by": 1
  }
}
```

## Pin a Board

Add the board to the current user's pinned boards. Pinning is per user.

```http
PUT /wp-json/fluent-boards/v2/projects/{board_id}/pin-board
```

**Example Request**

```bash
curl "https://yourdomain.com/wp-json/fluent-boards/v2/projects/9/pin-board" \
  -X PUT \
  -u "USERNAME:APPLICATION_PASSWORD"
```

**Example Response**

```json
{
  "message": "The Board has been pinned"
}
```

## Unpin a Board

Remove the board from the current user's pinned boards. Returns 400 with `Board is not pinned` if the board was not pinned.

```http
PUT /wp-json/fluent-boards/v2/projects/{board_id}/unpin-board
```

**Example Request**

```bash
curl "https://yourdomain.com/wp-json/fluent-boards/v2/projects/9/unpin-board" \
  -X PUT \
  -u "USERNAME:APPLICATION_PASSWORD"
```

**Example Response**

```json
{
  "message": "Board is removed from pinned boards"
}
```

## Set Board Background

Set a color background, switch to a previously uploaded background image, or clear the background. Requires board manager. Fires `fluent_boards/board_background_updated`.

The request needs exactly one of these: `reset`, `image_url`, or `color`. They are checked in that order.

```http
PUT /wp-json/fluent-boards/v2/projects/{board_id}/upload/background
```

**Parameters**

| Parameter | Type | Required | Description |
|---|---|---|---|
| `reset` | boolean | No | `true` clears the background |
| `id` | string\|integer | With `color` or `image_url` | For a color: the palette ID (e.g. `solid_3`). For an image: the attachment ID returned by [Upload Background Image](#upload-background-image) |
| `color` | string | No | Color value (hex or CSS gradient) |
| `image_url` | string | No | Any valid URL. The stored URL comes from the board's attachment `id`, not from this value |

**Example Request**

```bash
curl "https://yourdomain.com/wp-json/fluent-boards/v2/projects/9/upload/background" \
  -X PUT \
  -u "USERNAME:APPLICATION_PASSWORD" \
  -H "Content-Type: application/json" \
  -d '{ "id": "gradient_1", "color": "linear-gradient(145deg, #479176 0%, #0F2C2B 100%)" }'
```

**Example Response**

```json
{
  "message": "Background updated successfully",
  "background": {
    "id": "gradient_1",
    "color": "linear-gradient(145deg, #479176 0%, #0F2C2B 100%)",
    "image_url": null,
    "is_image": false
  }
}
```

## Upload Background Image

Upload an image and set it as the board background. The file is stored as a board attachment (with the Pro storage driver when Pro is active). Requires board manager. Fires `fluent_boards/board_background_updated`.

```http
POST /wp-json/fluent-boards/v2/projects/{board_id}/upload/background-image
```

**Parameters**

| Parameter | Type | Required | Description |
|---|---|---|---|
| `file` | file | Yes | Image file (multipart form field) |

**Example Request**

```bash
curl "https://yourdomain.com/wp-json/fluent-boards/v2/projects/9/upload/background-image" \
  -X POST \
  -u "USERNAME:APPLICATION_PASSWORD" \
  -F "file=@/path/to/background.jpg"
```

**Example Response**

```json
{
  "message": "Background updated successfully",
  "background": {
    "color": null,
    "id": 57,
    "image_url": "https://yourdomain.com/index.php?fbs=1&fbs_type=public_url&fbs_comment_image=5d41402abc4b2a76b9719d911017c592",
    "is_image": true
  }
}
```

## Set Board CRM Contact

Associate the board with a FluentCRM contact. Any existing association is replaced. Fires `fluent_boards/contact_added_to_board`.

```http
POST /wp-json/fluent-boards/v2/projects/{board_id}/crm-contact
```

**Parameters**

| Parameter | Type | Required | Description |
|---|---|---|---|
| `value` | integer | Yes | FluentCRM contact (subscriber) ID |

**Example Request**

```bash
curl "https://yourdomain.com/wp-json/fluent-boards/v2/projects/9/crm-contact" \
  -X POST \
  -u "USERNAME:APPLICATION_PASSWORD" \
  -H "Content-Type: application/json" \
  -d '{ "value": 42 }'
```

**Example Response**

```json
{
  "message": "Associated Crm Member has been updated"
}
```

## List Board CRM Contacts

Get the FluentCRM contacts linked to the board, either as the board contact or through a task's `crm_contact_id`. Board-level contacts come first. Each contact includes the board's tasks linked to it. Returns an empty list when FluentCRM is not active.

```http
GET /wp-json/fluent-boards/v2/projects/{board_id}/crm-contacts
```

**Example Request**

```bash
curl "https://yourdomain.com/wp-json/fluent-boards/v2/projects/9/crm-contacts" \
  -u "USERNAME:APPLICATION_PASSWORD"
```

**Example Response**

```json
{
  "associatedContacts": [
    {
      "id": 42,
      "email": "jane@example.com",
      "first_name": "Jane",
      "last_name": "Doe",
      "full_name": "Jane Doe",
      "photo": "https://secure.gravatar.com/avatar/...",
      "status": "subscribed",
      "contact_type": "lead",
      "name": "Jane Doe",
      "crm_contact_id": 42,
      "is_board_contact": true,
      "tasks": [
        { "id": 279, "title": "Follow up call", "board_id": 9, "crm_contact_id": 42 }
      ]
    }
  ]
}
```

## Get Board Menu Items

Get the items of the board's settings menu, sorted by `position`. Items with role `admin` are removed for non-admins. Add custom items with the `fluent_boards/board_menu_items` filter.

```http
GET /wp-json/fluent-boards/v2/projects/{board_id}/board-menu-items
```

**Example Request**

```bash
curl "https://yourdomain.com/wp-json/fluent-boards/v2/projects/9/board-menu-items" \
  -u "USERNAME:APPLICATION_PASSWORD"
```

**Example Response**

```json
{
  "menu_items": [
    {
      "key": "about_this_board",
      "icon_name": "info",
      "label": "About this Board",
      "type": "default",
      "position": 1,
      "role": ""
    },
    {
      "key": "export",
      "icon_name": "export",
      "label": "Export",
      "type": "default",
      "position": 10.5,
      "role": "manager",
      "pro": true,
      "requires_pro": true
    }
  ]
}
```

## Get Public Access Settings

Get whether public (logged-out) access is on for the board, and the shortcode that embeds it.

```http
GET /wp-json/fluent-boards/v2/projects/{board_id}/public-access-settings
```

**Example Request**

```bash
curl "https://yourdomain.com/wp-json/fluent-boards/v2/projects/9/public-access-settings" \
  -u "USERNAME:APPLICATION_PASSWORD"
```

**Example Response**

`shortcode` is an empty string when public access is off.

```json
{
  "enabled": true,
  "shortcode": "[fluent_board_public id=\"9\"]"
}
```

## Toggle Public Access

Turn public access on or off. When it is on, the `[fluent_board_public]` shortcode renders a read-only board for logged-out visitors, served by the [Public Boards](/rest-api/public-boards) API. Requires board manager.

```http
PUT /wp-json/fluent-boards/v2/projects/{board_id}/toggle-public-access
```

**Parameters**

| Parameter | Type | Required | Description |
|---|---|---|---|
| `enabled` | boolean | Yes | `true` to enable, `false` to disable |

**Example Request**

```bash
curl "https://yourdomain.com/wp-json/fluent-boards/v2/projects/9/toggle-public-access" \
  -X PUT \
  -u "USERNAME:APPLICATION_PASSWORD" \
  -H "Content-Type: application/json" \
  -d '{ "enabled": true }'
```

**Example Response**

```json
{
  "message": "Public access has been enabled",
  "enabled": true,
  "shortcode": "[fluent_board_public id=\"9\"]"
}
```

## Error Responses

- **401 / 403**: not logged in, not a member of the board, a viewer calling a write endpoint, or missing the role an endpoint requires
- **400**: validation failed (for example a missing `board[title]`), or the service rejected the request
- **404**: board not found

See [Common Error Responses](/rest-api/shared/error-responses) for standard error formats.
