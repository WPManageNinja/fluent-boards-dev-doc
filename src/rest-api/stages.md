# Stages

Stages are the columns of a board. The Stages API lets you create, rename, reorder, archive and restore stages, and run bulk actions on the tasks inside a stage (move, archive, sort). Plugin source: free, except the default assignee/watcher endpoints, which need Pro.

All endpoints use `SingleBoardPolicy`: the user must be a member of the board, and board viewers can only call `GET` endpoints.

## Endpoints

| Method | Endpoint | Description |
|---|---|---|
| POST | `/projects/{board_id}/stage-create` | Create a stage |
| PUT | `/projects/{board_id}/update-stage-property/{stage_id}` | Update one stage property |
| PUT | `/projects/{board_id}/update-stage/{stage_id}` | Update title and cover (deprecated) |
| PUT | `/projects/{board_id}/archive-stage/{stage_id}` | Archive a stage |
| PUT | `/projects/{board_id}/restore-stage/{stage_id}` | Restore an archived stage |
| GET | `/projects/{board_id}/archived-stages` | List archived stages |
| PUT | `/projects/{board_id}/re-position-stages` | Reorder all stages |
| PUT | `/projects/{board_id}/drag-stage` | Move one stage to a new position |
| PUT | `/projects/{board_id}/stage-view/{stage_id}` | Toggle stage public/private |
| PUT | `/projects/{board_id}/stage-move-all-task` | Move all tasks to another stage |
| PUT | `/projects/{board_id}/stage/{stage_id}/archive-all-task` | Archive all tasks in a stage |
| PUT | `/projects/{board_id}/stage/{stage_id}/sort-task` | Sort tasks in a stage |
| GET | `/projects/{board_id}/stage-task-available-positions/{stage_id}` | Get drop positions in a stage |
| PUT | `/projects/{board_id}/stage/{stage_id}/default-assignees` | Set default assignees (Pro) |
| PUT | `/projects/{board_id}/stage/{stage_id}/default-watchers` | Set default watchers (Pro) |

Stage templates (`update-stage-template`, `template-stages`) are documented on the [Templates](/rest-api/templates) page.

## Stage Object

Stages are stored in the `fbs_board_terms` table with `type = "stage"`.

| Field | Type | Description |
|---|---|---|
| `id` | integer | Stage ID |
| `board_id` | integer | Board the stage belongs to |
| `title` | string | Stage title |
| `slug` | string\|null | Slug |
| `type` | string | Always `stage` |
| `position` | number | Sort position (decimal, lower comes first). Archived stages have `0` |
| `color` | string\|null | Text color |
| `bg_color` | string\|null | Background (cover) color |
| `settings` | object | `default_task_status` (`open` or `closed`), `default_task_assignees` (user IDs), `default_task_watchers` (user IDs, Pro), `is_template` (bool, Pro), `is_public` (bool), `archived_by_id` (user ID) |
| `archived_at` | string\|null | Archive timestamp, `null` when active |
| `created_at` | string | Creation timestamp |
| `updated_at` | string | Last update timestamp |

## Create a Stage

Create a new stage. The stage is added at the end of the board, then moved to `position` if you pass one.

```http
POST /wp-json/fluent-boards/v2/projects/{board_id}/stage-create
```

**Parameters**

| Parameter | Type | Required | Description |
|---|---|---|---|
| `title` | string | Yes | Stage title |
| `position` | numeric | No | 1-based position among active stages |
| `status` | string | No | Default status for tasks created in this stage (`open` or `closed`). Defaults to `open` |

**Example Request**

```bash
curl "https://yourdomain.com/wp-json/fluent-boards/v2/projects/10/stage-create" \
  -X POST \
  -u "USERNAME:APPLICATION_PASSWORD" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Review",
    "position": 3,
    "status": "open"
  }'
```

**Example Response**

`updatedStages` holds every stage of the board updated in the last minute (the new stage, plus any stage whose position shifted).

```json
{
  "updatedStages": [
    {
      "id": 107,
      "board_id": "10",
      "title": "Review",
      "slug": null,
      "type": "stage",
      "position": "2.50",
      "color": null,
      "bg_color": null,
      "settings": {
        "default_task_status": "open",
        "default_task_assignees": []
      },
      "archived_at": null,
      "created_at": "2025-08-06T10:45:32+00:00",
      "updated_at": "2025-08-06T10:45:32+00:00"
    }
  ],
  "message": "stage has been created"
}
```

## Update a Stage Property

Update a single property of a stage. This is the endpoint the board UI uses for renaming a stage, changing its colors and changing the default task status.

```http
PUT /wp-json/fluent-boards/v2/projects/{board_id}/update-stage-property/{stage_id}
```

**Parameters**

| Parameter | Type | Required | Description |
|---|---|---|---|
| `property` | string | Yes | One of `title`, `status`, `color`, `bg_color`, `archived_at` |
| `value` | string | Yes | New value. For `title` and `status` it must not be empty. `status` sets `settings.default_task_status` (`open` or `closed`) |

To archive a stage, prefer [Archive a Stage](#archive-a-stage), which also resets the position and records who archived it.

**Example Request**

```bash
curl "https://yourdomain.com/wp-json/fluent-boards/v2/projects/10/update-stage-property/107" \
  -X PUT \
  -u "USERNAME:APPLICATION_PASSWORD" \
  -H "Content-Type: application/json" \
  -d '{
    "property": "title",
    "value": "In Development"
  }'
```

**Example Response**

```json
{
  "message": "Stage has been updated",
  "stage": {
    "id": 107,
    "board_id": "10",
    "title": "In Development",
    "slug": null,
    "type": "stage",
    "position": "2.50",
    "color": null,
    "bg_color": null,
    "settings": {
      "default_task_status": "open",
      "default_task_assignees": []
    },
    "archived_at": null,
    "created_at": "2025-08-06T10:45:32+00:00",
    "updated_at": "2025-08-06T11:02:10+00:00"
  }
}
```

If the stage does not belong to the board, the endpoint returns `404` with `Stage not found`.

## Update a Stage (Deprecated)

::: warning Deprecated
This route is marked for removal in the plugin code. Use [Update a Stage Property](#update-a-stage-property) instead.
:::

Update a stage's title and cover color in one call. Both values are read from a `stage` object, and the title is required.

```http
PUT /wp-json/fluent-boards/v2/projects/{board_id}/update-stage/{stage_id}
```

**Parameters**

| Parameter | Type | Required | Description |
|---|---|---|---|
| `stage[title]` | string | Yes | Stage title |
| `stage[cover_bg]` | string | No | Background color, saved to `bg_color`. Omitting it clears the color |

**Example Request**

```bash
curl "https://yourdomain.com/wp-json/fluent-boards/v2/projects/10/update-stage/107" \
  -X PUT \
  -u "USERNAME:APPLICATION_PASSWORD" \
  -H "Content-Type: application/json" \
  -d '{
    "stage": {
      "title": "In Development",
      "cover_bg": "#E3F2FD"
    }
  }'
```

**Example Response**

```json
{
  "success": true,
  "stages": [
    { "id": 104, "title": "Open", "position": "1.00", "...": "..." },
    { "id": 107, "title": "In Development", "position": "2.50", "...": "..." }
  ],
  "updatedStage": {
    "id": 107,
    "board_id": "10",
    "title": "In Development",
    "bg_color": "#E3F2FD",
    "settings": {
      "default_task_status": "open",
      "default_task_assignees": []
    },
    "archived_at": null,
    "updated_at": "2025-08-06T11:02:10+00:00"
  },
  "message": "Stage has been updated"
}
```

## Archive a Stage

Archive a stage (soft delete). The stage position is set to `0` and the current user is saved in `settings.archived_by_id`.

```http
PUT /wp-json/fluent-boards/v2/projects/{board_id}/archive-stage/{stage_id}
```

**Example Request**

```bash
curl "https://yourdomain.com/wp-json/fluent-boards/v2/projects/10/archive-stage/107" \
  -X PUT \
  -u "USERNAME:APPLICATION_PASSWORD"
```

**Example Response**

```json
{
  "updatedStage": {
    "id": 107,
    "board_id": "10",
    "title": "Review",
    "slug": null,
    "type": "stage",
    "position": 0,
    "color": null,
    "bg_color": null,
    "settings": {
      "default_task_status": "open",
      "default_task_assignees": [],
      "archived_by_id": 1
    },
    "archived_at": "2025-08-06 11:18:56",
    "created_at": "2025-08-06T10:45:32+00:00",
    "updated_at": "2025-08-06T11:18:56+00:00"
  },
  "message": "Stage has been archived"
}
```

## Restore a Stage

Restore an archived stage. The stage is placed after the last active stage.

```http
PUT /wp-json/fluent-boards/v2/projects/{board_id}/restore-stage/{stage_id}
```

**Example Request**

```bash
curl "https://yourdomain.com/wp-json/fluent-boards/v2/projects/10/restore-stage/107" \
  -X PUT \
  -u "USERNAME:APPLICATION_PASSWORD"
```

**Example Response**

```json
{
  "success": true,
  "updatedStage": {
    "id": 107,
    "board_id": "10",
    "title": "Review",
    "slug": null,
    "type": "stage",
    "position": 4,
    "color": null,
    "bg_color": null,
    "settings": {
      "default_task_status": "open",
      "default_task_assignees": [],
      "archived_by_id": null
    },
    "archived_at": null,
    "created_at": "2025-08-06T10:45:32+00:00",
    "updated_at": "2025-08-06T11:21:13+00:00"
  },
  "message": "Stage has been restored"
}
```

## List Archived Stages

Retrieve the archived stages of a board, newest first. Each stage includes `archived_by_id` and `archived_by` (the user who archived it, or `null`).

```http
GET /wp-json/fluent-boards/v2/projects/{board_id}/archived-stages
```

**Parameters**

| Parameter | Type | Required | Description |
|---|---|---|---|
| `noPagination` | boolean | No | If true, returns all archived stages as a plain array. Default `false` |
| `per_page` | integer | No | Stages per page, 1 to 50. Default `30` |
| `page` | integer | No | Page number. Default `1` |

**Example Request**

```bash
curl "https://yourdomain.com/wp-json/fluent-boards/v2/projects/1/archived-stages?per_page=30&page=1" \
  -u "USERNAME:APPLICATION_PASSWORD"
```

**Example Response**

With pagination, `stages` is a paginator object. With `noPagination=true`, `stages` is an array of stage objects.

```json
{
  "stages": {
    "current_page": 1,
    "data": [
      {
        "id": 5,
        "board_id": "1",
        "title": "Old Stage",
        "slug": "old-stage",
        "type": "stage",
        "position": "0.00",
        "color": null,
        "bg_color": null,
        "settings": {
          "default_task_status": "open",
          "archived_by_id": 1
        },
        "archived_at": "2023-02-10 12:00:00",
        "created_at": "2023-01-15T10:30:00+00:00",
        "updated_at": "2023-02-10T12:00:00+00:00",
        "archived_by_id": 1,
        "archived_by": {
          "ID": 1,
          "display_name": "Jane Doe",
          "photo": "https://secure.gravatar.com/avatar/..."
        }
      }
    ],
    "from": 1,
    "to": 1,
    "total": 1,
    "per_page": 30,
    "last_page": 1,
    "first_page_url": "https://yourdomain.com/wp-json/fluent-boards/v2/projects/1/archived-stages/?page=1",
    "last_page_url": "https://yourdomain.com/wp-json/fluent-boards/v2/projects/1/archived-stages/?page=1",
    "next_page_url": null,
    "prev_page_url": null,
    "path": "https://yourdomain.com/wp-json/fluent-boards/v2/projects/1/archived-stages"
  }
}
```

## Re-position Stages

Reorder all stages of a board in one call. Each stage in `list` is moved to its index (1-based), and stage positions are re-indexed automatically when they get too close.

```http
PUT /wp-json/fluent-boards/v2/projects/{board_id}/re-position-stages
```

**Parameters**

| Parameter | Type | Required | Description |
|---|---|---|---|
| `list` | array | Yes | Stage IDs in the desired order. Every ID must belong to the board |

**Example Request**

```bash
curl "https://yourdomain.com/wp-json/fluent-boards/v2/projects/10/re-position-stages" \
  -X PUT \
  -u "USERNAME:APPLICATION_PASSWORD" \
  -H "Content-Type: application/json" \
  -d '{
    "list": [107, 106, 105, 104]
  }'
```

**Example Response**

```json
{
  "message": "Stages Reordered",
  "updatedStages": [
    {
      "id": 104,
      "board_id": "10",
      "title": "Open",
      "slug": "open",
      "type": "stage",
      "position": "1.88",
      "color": null,
      "bg_color": null,
      "settings": {
        "default_task_status": "open"
      },
      "archived_at": null,
      "created_at": "2025-08-06T06:46:17+00:00",
      "updated_at": "2025-08-06T11:31:45+00:00"
    },
    {
      "id": 105,
      "board_id": "10",
      "title": "In Progress",
      "slug": "in-progress",
      "type": "stage",
      "position": "0.88",
      "color": null,
      "bg_color": null,
      "settings": {
        "default_task_status": "open"
      },
      "archived_at": null,
      "created_at": "2025-08-06T06:46:17+00:00",
      "updated_at": "2025-08-06T11:31:45+00:00"
    }
  ]
}
```

## Drag a Stage

Move a single stage to a new position. Use this when one stage is dragged; use [Re-position Stages](#re-position-stages) to send the full order.

```http
PUT /wp-json/fluent-boards/v2/projects/{board_id}/drag-stage
```

**Parameters**

| Parameter | Type | Required | Description |
|---|---|---|---|
| `stageId` | integer | Yes | Stage to move. Must belong to the board |
| `newPosition` | integer | Yes | New 1-based position among active stages |

**Example Request**

```bash
curl "https://yourdomain.com/wp-json/fluent-boards/v2/projects/10/drag-stage" \
  -X PUT \
  -u "USERNAME:APPLICATION_PASSWORD" \
  -H "Content-Type: application/json" \
  -d '{
    "stageId": 107,
    "newPosition": 1
  }'
```

**Example Response**

```json
{
  "message": "Board stage has been updated",
  "updatedStages": [
    {
      "id": 107,
      "board_id": "10",
      "title": "Review",
      "type": "stage",
      "position": "0.50",
      "settings": {
        "default_task_status": "open"
      },
      "archived_at": null,
      "updated_at": "2025-08-06T11:40:02+00:00"
    }
  ]
}
```

## Toggle Stage Visibility

Toggle `settings.is_public` on a stage. The first call makes the stage public; the next call makes it private again. No body is needed.

```http
PUT /wp-json/fluent-boards/v2/projects/{board_id}/stage-view/{stage_id}
```

**Example Request**

```bash
curl "https://yourdomain.com/wp-json/fluent-boards/v2/projects/10/stage-view/107" \
  -X PUT \
  -u "USERNAME:APPLICATION_PASSWORD"
```

**Example Response**

`message` is `The stage is made public!` or `The stage is made private!`.

```json
{
  "message": "The stage is made public!",
  "stage": {
    "id": 107,
    "board_id": "10",
    "title": "Review",
    "type": "stage",
    "settings": {
      "default_task_status": "open",
      "is_public": true
    },
    "archived_at": null
  }
}
```

## Move All Tasks to Another Stage

Move every active top-level task from one stage to another. Tasks are appended after the last task in the target stage. Both stages must belong to the board.

```http
PUT /wp-json/fluent-boards/v2/projects/{board_id}/stage-move-all-task
```

**Parameters**

| Parameter | Type | Required | Description |
|---|---|---|---|
| `oldStageId` | integer | Yes | Source stage ID |
| `newStageId` | integer | Yes | Target stage ID |

**Example Request**

```bash
curl "https://yourdomain.com/wp-json/fluent-boards/v2/projects/10/stage-move-all-task" \
  -X PUT \
  -u "USERNAME:APPLICATION_PASSWORD" \
  -H "Content-Type: application/json" \
  -d '{
    "oldStageId": 104,
    "newStageId": 105
  }'
```

**Example Response**

```json
{
  "message": "Tasks have been moved",
  "updatedTasks": [
    {
      "id": 282,
      "board_id": "10",
      "stage_id": 105,
      "title": "New task",
      "position": 6,
      "watchers": []
    }
  ]
}
```

Returns `400` with `Invalid stage IDs provided` when either ID is missing, or `One or both stages do not exist or do not belong to this board`.

## Archive All Tasks in Stage

Archive every active top-level task in a stage. Each task gets `position = 0` and an `archived_at` timestamp.

```http
PUT /wp-json/fluent-boards/v2/projects/{board_id}/stage/{stage_id}/archive-all-task
```

**Example Request**

```bash
curl "https://yourdomain.com/wp-json/fluent-boards/v2/projects/9/stage/78/archive-all-task" \
  -X PUT \
  -u "USERNAME:APPLICATION_PASSWORD"
```

**Example Response**

```json
{
  "message": "Tasks have been archived",
  "updatedTasks": [
    {
      "id": 282,
      "parent_id": null,
      "board_id": "9",
      "crm_contact_id": null,
      "title": "New task",
      "slug": "new-task",
      "type": "task",
      "position": 0,
      "archived_at": "2025-08-06 11:36:48"
    }
  ]
}
```

## Sort Tasks in Stage

Sort the active top-level tasks of a stage. Task positions are rewritten to `1..n` in the new order. When sorting by `due_at` ascending, tasks without a due date go last.

```http
PUT /wp-json/fluent-boards/v2/projects/{board_id}/stage/{stage_id}/sort-task
```

**Parameters**

| Parameter | Type | Required | Description |
|---|---|---|---|
| `order` | string | Yes | Sort field: `priority`, `due_at`, `position`, `created_at` or `title` |
| `orderBy` | string | Yes | Sort direction: `ASC` or `DESC` |

**Example Request**

```bash
curl "https://yourdomain.com/wp-json/fluent-boards/v2/projects/9/stage/78/sort-task" \
  -X PUT \
  -u "USERNAME:APPLICATION_PASSWORD" \
  -H "Content-Type: application/json" \
  -d '{
    "order": "title",
    "orderBy": "DESC"
  }'
```

**Example Response**

Each task includes `assignees`, `labels`, `watchers`, and the computed `isOverdue`, `isUpcoming`, `is_watching` and `contact`.

```json
{
  "message": "Tasks has been sorted",
  "updatedTasks": [
    {
      "id": 248,
      "title": "Security validation checks",
      "stage_id": "78",
      "position": 1,
      "isOverdue": false,
      "isUpcoming": false,
      "is_watching": false,
      "contact": null,
      "assignees": [],
      "labels": [],
      "watchers": []
    }
  ]
}
```

## Get Stage Task Available Positions

Get the drop slots in a stage, for "move task" dialogs. Each slot is described by the IDs of its neighbouring tasks. Pass `task_id` when the task already lives in this stage, so it is excluded from the list and its current slot is marked.

```http
GET /wp-json/fluent-boards/v2/projects/{board_id}/stage-task-available-positions/{stage_id}
```

**Parameters**

| Parameter | Type | Required | Description |
|---|---|---|---|
| `task_id` | integer | No | The task being moved |

**Example Request**

```bash
curl "https://yourdomain.com/wp-json/fluent-boards/v2/projects/10/stage-task-available-positions/105?task_id=282" \
  -u "USERNAME:APPLICATION_PASSWORD"
```

**Example Response**

```json
{
  "availablePositions": [1, 2, 3],
  "moveTargets": [
    { "key": "slot_1", "label": 1, "prevTaskId": null, "nextTaskId": 280, "isCurrent": false },
    { "key": "slot_2", "label": 2, "prevTaskId": 280, "nextTaskId": 281, "isCurrent": true },
    { "key": "slot_3", "label": 3, "prevTaskId": 281, "nextTaskId": null, "isCurrent": false }
  ],
  "currentMoveTargetKey": "slot_2",
  "defaultMoveTargetKey": "slot_3"
}
```

## Set Default Assignees <Badge type="tip" text="Pro" />

Set the users who are assigned automatically to tasks in this stage. The list is saved to `settings.default_task_assignees` and applied to the existing tasks of the stage. Requires board manager.

```http
PUT /wp-json/fluent-boards/v2/projects/{board_id}/stage/{stage_id}/default-assignees
```

**Parameters**

| Parameter | Type | Required | Description |
|---|---|---|---|
| `assigneeIds` | array | Yes | User IDs. Send an empty array to clear |

**Example Request**

```bash
curl "https://yourdomain.com/wp-json/fluent-boards/v2/projects/10/stage/105/default-assignees" \
  -X PUT \
  -u "USERNAME:APPLICATION_PASSWORD" \
  -H "Content-Type: application/json" \
  -d '{
    "assigneeIds": [1, 5]
  }'
```

**Example Response**

```json
{
  "stage": {
    "id": 105,
    "board_id": "10",
    "title": "In Progress",
    "type": "stage",
    "settings": {
      "default_task_status": "open",
      "default_task_assignees": [1, 5]
    },
    "archived_at": null
  },
  "message": "Stage updated successfully"
}
```

## Set Default Watchers <Badge type="tip" text="Pro" />

Set the users who watch tasks in this stage automatically. The list is saved to `settings.default_task_watchers` and applied to the existing tasks of the stage. Requires board manager.

```http
PUT /wp-json/fluent-boards/v2/projects/{board_id}/stage/{stage_id}/default-watchers
```

**Parameters**

| Parameter | Type | Required | Description |
|---|---|---|---|
| `watcherIds` | array | Yes | User IDs. Send an empty array to clear |

**Example Request**

```bash
curl "https://yourdomain.com/wp-json/fluent-boards/v2/projects/10/stage/105/default-watchers" \
  -X PUT \
  -u "USERNAME:APPLICATION_PASSWORD" \
  -H "Content-Type: application/json" \
  -d '{
    "watcherIds": [2]
  }'
```

**Example Response**

```json
{
  "stage": {
    "id": 105,
    "board_id": "10",
    "title": "In Progress",
    "type": "stage",
    "settings": {
      "default_task_status": "open",
      "default_task_assignees": [1, 5],
      "default_task_watchers": [2]
    },
    "archived_at": null
  },
  "message": "Stage updated successfully"
}
```

## Error Responses

Most stage endpoints return `400` (or `404` for update-stage-property) with `Stage not found` when the stage does not belong to `{board_id}`.

See [Common Error Responses](/rest-api/shared/error-responses) for standard error formats.
