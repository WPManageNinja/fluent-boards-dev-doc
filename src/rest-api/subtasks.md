# Subtasks

::: tip Pro
All subtask endpoints are provided by FluentBoards Pro.
:::

The Subtasks API manages subtasks inside a parent task. Subtasks are regular tasks with a `parent_id` and no `stage_id`. They are organized in **subtask groups**, which are task-meta rows (`key: "group_name"`) on the parent task; each subtask points to its group through `meta.subtask_group_id`. Plugin source: Pro.

Board members can read; members who are not "viewer only" can write.

## Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/projects/{board_id}/tasks/{task_id}/subtasks` | List subtasks grouped by subtask group |
| POST | `/projects/{board_id}/tasks/{task_id}/subtasks` | Create a subtask |
| POST | `/projects/{board_id}/tasks/{task_id}/subtasks/bulk` | Create several subtasks at once |
| POST | `/projects/{board_id}/tasks/{task_id}/subtask-group` | Create a subtask group |
| PUT | `/projects/{board_id}/tasks/{task_id}/subtask-group` | Rename a subtask group |
| DELETE | `/projects/{board_id}/tasks/{task_id}/subtask-group` | Delete a subtask group and its subtasks |
| DELETE | `/projects/{board_id}/tasks/{task_id}/delete-subtask` | Delete a subtask |
| POST | `/projects/{board_id}/tasks/{task_id}/move-subtask` | Move subtasks to another group |
| PUT | `/projects/{board_id}/tasks/update-subtask-position/{subtask_id}` | Reorder a subtask |
| PUT | `/projects/{board_id}/tasks/{task_id}/convert-to-subtask` | Convert a task into a subtask |
| PUT | `/projects/{board_id}/tasks/{task_id}/move-to-board` | Convert a subtask back into a task |
| POST | `/projects/{board_id}/tasks/{task_id}/clone-subtask` | Clone a subtask |

Other task operations (title, status, dates, assignees, …) on a subtask use the regular [Update a Task Property](/rest-api/tasks#update-a-task-property) endpoint with the subtask ID.

## Subtask Object

```json
{
  "id": 123,
  "parent_id": 456,
  "board_id": 3,
  "crm_contact_id": null,
  "title": "Create wireframes",
  "slug": "create-wireframes",
  "type": "task",
  "status": "closed",
  "stage_id": null,
  "source": "web",
  "source_id": null,
  "priority": "low",
  "description": "Design wireframes for the new feature",
  "created_by": 1,
  "position": "1.00",
  "comments_count": 0,
  "reminder_type": null,
  "settings": null,
  "remind_at": null,
  "started_at": null,
  "due_at": null,
  "last_completed_at": "2024-01-15 08:01:43",
  "archived_at": null,
  "created_at": "2024-01-15T08:43:52+00:00",
  "updated_at": "2024-01-15T08:01:43+00:00",
  "meta": {
    "subtask_group_id": "127"
  },
  "repeat_task_meta": null,
  "is_pinned": false,
  "assignees": []
}
```

## List Subtasks

Returns all subtasks of a parent task, grouped by subtask group and ordered by position. Subtasks without a group are moved into a newly created "Untitled Group" during this call.

```http
GET /wp-json/fluent-boards/v2/projects/{board_id}/tasks/{task_id}/subtasks
```

**Example Request**

```bash
curl "https://yourdomain.com/wp-json/fluent-boards/v2/projects/3/tasks/456/subtasks" \
  -u "USERNAME:APPLICATION_PASSWORD"
```

**Example Response**

```json
{
  "subtaskGroups": [
    {
      "id": 127,
      "task_id": 456,
      "subtasks": [
        {
          "id": 123,
          "parent_id": 456,
          "board_id": 3,
          "title": "Create wireframes",
          "status": "closed",
          "position": "1.00",
          "meta": {
            "subtask_group_id": "127"
          },
          "assignees": []
        }
      ],
      "value": "Design Phase"
    }
  ]
}
```

## Create a Subtask

Creates a subtask in a group of the parent task. The subtask starts as `open` with priority `low`.

```http
POST /wp-json/fluent-boards/v2/projects/{board_id}/tasks/{task_id}/subtasks
```

**Parameters**

| Parameter | Type | Required | Description |
|---|---|---|---|
| `title` | string | Yes | Subtask title |
| `group_id` | integer | No | Subtask group on this parent task. If omitted, the first group is used (an "Untitled Group" is created when none exists) |
| `description` | string | No | Description |
| `due_at` | string\|null | No | Due date `Y-m-d H:i:s` |
| `reminder_type` | string | No | Reminder preset |
| `remind_at` | string | No | Reminder time |
| `assignees` | integer[] | No | User ID to assign. Only the first ID is used, and it must be a board member |
| `add_to_top` | boolean | No | Put the subtask first in the list (default `false`, appended at the end) |

**Example Request**

```bash
curl "https://yourdomain.com/wp-json/fluent-boards/v2/projects/3/tasks/85/subtasks" \
  -X POST \
  -u "USERNAME:APPLICATION_PASSWORD" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "The new subtask",
    "group_id": 127,
    "due_at": null,
    "add_to_top": false
  }'
```

**Example Response**

```json
{
  "subtask": {
    "id": 284,
    "parent_id": 85,
    "title": "The new subtask",
    "board_id": 3,
    "status": "open",
    "priority": "low",
    "due_at": null,
    "position": 20,
    "created_by": 1,
    "type": "task",
    "slug": "the-new-subtask",
    "updated_at": "2025-08-08T04:12:47+00:00",
    "created_at": "2025-08-08T04:12:47+00:00",
    "assignees": [],
    "meta": {
      "subtask_group_id": "127"
    },
    "repeat_task_meta": null
  },
  "message": "Subtask has been added"
}
```

## Create Subtasks in Bulk

Creates up to 15 subtasks in one transaction (used by the AI "Generate subtasks" flow). They go into the group named `group_title`, which is created if the parent task has no group with that name.

```http
POST /wp-json/fluent-boards/v2/projects/{board_id}/tasks/{task_id}/subtasks/bulk
```

**Parameters**

| Parameter | Type | Required | Description |
|---|---|---|---|
| `titles` | string[] | Yes | Subtask titles; empty values are dropped and only the first 15 are used |
| `group_title` | string | No | Target group name (default "Subtasks") |

**Example Request**

```bash
curl "https://yourdomain.com/wp-json/fluent-boards/v2/projects/3/tasks/85/subtasks/bulk" \
  -X POST \
  -u "USERNAME:APPLICATION_PASSWORD" \
  -H "Content-Type: application/json" \
  -d '{
    "titles": ["Draft outline", "Write content", "Proofread"],
    "group_title": "Writing"
  }'
```

**Example Response**

```json
{
  "group": {
    "id": 560,
    "task_id": 85,
    "key": "group_name",
    "value": "Writing"
  },
  "subtasks": [
    { "id": 301, "parent_id": 85, "title": "Draft outline", "meta": { "subtask_group_id": "560" } },
    { "id": 302, "parent_id": 85, "title": "Write content", "meta": { "subtask_group_id": "560" } },
    { "id": 303, "parent_id": 85, "title": "Proofread", "meta": { "subtask_group_id": "560" } }
  ],
  "message": "Subtasks have been added"
}
```

Returns `400` "No subtasks provided." when `titles` is empty.

## Create a Subtask Group

Creates a new group on the parent task.

```http
POST /wp-json/fluent-boards/v2/projects/{board_id}/tasks/{task_id}/subtask-group
```

**Parameters**

| Parameter | Type | Required | Description |
|---|---|---|---|
| `title` | string | Yes | Group name |

**Example Request**

```bash
curl "https://yourdomain.com/wp-json/fluent-boards/v2/projects/3/tasks/85/subtask-group" \
  -X POST \
  -u "USERNAME:APPLICATION_PASSWORD" \
  -H "Content-Type: application/json" \
  -d '{ "title": "Design Phase" }'
```

**Example Response**

```json
{
  "subtaskGroup": {
    "id": 555,
    "task_id": 85,
    "key": "group_name",
    "value": "Design Phase",
    "created_at": "2025-08-08T04:12:47+00:00",
    "updated_at": "2025-08-08T04:12:47+00:00"
  },
  "message": "New Subtask group has been added"
}
```

## Update a Subtask Group

Renames a group of this parent task.

```http
PUT /wp-json/fluent-boards/v2/projects/{board_id}/tasks/{task_id}/subtask-group
```

**Parameters**

| Parameter | Type | Required | Description |
|---|---|---|---|
| `group_id` | integer | Yes | Group to rename |
| `title` | string | Yes | New name |

**Example Request**

```bash
curl "https://yourdomain.com/wp-json/fluent-boards/v2/projects/3/tasks/85/subtask-group" \
  -X PUT \
  -u "USERNAME:APPLICATION_PASSWORD" \
  -H "Content-Type: application/json" \
  -d '{
    "group_id": 555,
    "title": "Execution Phase"
  }'
```

**Example Response**

```json
{
  "subtaskGroup": {
    "id": 555,
    "task_id": 85,
    "key": "group_name",
    "value": "Execution Phase",
    "created_at": "2025-08-08T04:12:47+00:00",
    "updated_at": "2025-08-08T05:10:12+00:00"
  },
  "message": "Subtask group title has been added"
}
```

## Delete a Subtask Group

Deletes a group **and every subtask in it**, in one transaction.

```http
DELETE /wp-json/fluent-boards/v2/projects/{board_id}/tasks/{task_id}/subtask-group
```

**Parameters**

| Parameter | Type | Required | Description |
|---|---|---|---|
| `group_id` | integer | Yes | Group to delete (sent in the body or query string) |

**Example Request**

```bash
curl "https://yourdomain.com/wp-json/fluent-boards/v2/projects/3/tasks/85/subtask-group" \
  -X DELETE \
  -u "USERNAME:APPLICATION_PASSWORD" \
  -H "Content-Type: application/json" \
  -d '{ "group_id": 555 }'
```

**Example Response**

```json
{
  "message": "Subtask group has been deleted"
}
```

## Delete a Subtask

Deletes a subtask. `{task_id}` in the path is the **subtask** ID. No body is needed.

```http
DELETE /wp-json/fluent-boards/v2/projects/{board_id}/tasks/{task_id}/delete-subtask
```

**Example Request**

```bash
curl "https://yourdomain.com/wp-json/fluent-boards/v2/projects/3/tasks/284/delete-subtask" \
  -X DELETE \
  -u "USERNAME:APPLICATION_PASSWORD"
```

**Example Response**

```json
{
  "deletedSubtask": {
    "id": 284,
    "parent_id": 85,
    "board_id": 3,
    "title": "The new subtask",
    "status": "open",
    "stage_id": null,
    "subtask_group_id": "127",
    "meta": [],
    "repeat_task_meta": null
  },
  "changedSubtasks": [],
  "message": "Task has been deleted"
}
```

`changedSubtasks` lists sibling subtasks updated in the last minute.

## Move Subtasks to a Group

Moves one subtask (or several) into another group of the parent task and appends them at the end.

```http
POST /wp-json/fluent-boards/v2/projects/{board_id}/tasks/{task_id}/move-subtask
```

**Parameters**

| Parameter | Type | Required | Description |
|---|---|---|---|
| `group_id` | integer | Yes | Target group (must belong to `{task_id}`) |
| `subtask_id` | integer \| integer[] | Yes | Subtask ID, or an array of IDs |

**Example Request**

```bash
curl "https://yourdomain.com/wp-json/fluent-boards/v2/projects/3/tasks/85/move-subtask" \
  -X POST \
  -u "USERNAME:APPLICATION_PASSWORD" \
  -H "Content-Type: application/json" \
  -d '{
    "group_id": 127,
    "subtask_id": 284
  }'
```

**Example Response** (`201`)

```json
{
  "subtask": {
    "id": 284,
    "parent_id": 85,
    "position": 21,
    "assignees": []
  },
  "message": "Subtask has been moved"
}
```

When `subtask_id` is an array, `subtask` is an array.

## Update Subtask Position

Reorders a subtask within its group or moves it to another group of the same parent.

```http
PUT /wp-json/fluent-boards/v2/projects/{board_id}/tasks/update-subtask-position/{subtask_id}
```

**Parameters**

| Parameter | Type | Required | Description |
|---|---|---|---|
| `newPosition` | integer | Yes | New 1-based position |
| `newSubtasksGroupId` | integer | Yes | Target group. The key is required; an empty value keeps the current group |

**Example Request**

```bash
curl "https://yourdomain.com/wp-json/fluent-boards/v2/projects/3/tasks/update-subtask-position/285" \
  -X PUT \
  -u "USERNAME:APPLICATION_PASSWORD" \
  -H "Content-Type: application/json" \
  -d '{
    "newPosition": 1,
    "newSubtasksGroupId": 198
  }'
```

**Example Response** (`201`)

```json
{
  "changedSubtasks": [
    {
      "id": 285,
      "parent_id": 85,
      "title": "Hello Subtask",
      "position": "1.00",
      "meta": {
        "subtask_group_id": "198"
      },
      "assignees": []
    }
  ]
}
```

`changedSubtasks` contains the parent's subtasks updated within the last minute.

## Convert a Task to a Subtask

Turns `{task_id}` into a subtask of `parent_id`. Both tasks must be on the board. The task loses its stage, its notifications are removed, and it is added to a group.

```http
PUT /wp-json/fluent-boards/v2/projects/{board_id}/tasks/{task_id}/convert-to-subtask
```

**Parameters**

| Parameter | Type | Required | Description |
|---|---|---|---|
| `parent_id` | integer | Yes | New parent task |
| `subtaskGroupId` | integer | No | Group of the parent to add it to. If omitted, a new "Default Subtask Group" is created on the parent |
| `assigneeId` | integer | No | Replaces the task's assignees and watchers with this user |

**Example Request**

```bash
curl "https://yourdomain.com/wp-json/fluent-boards/v2/projects/3/tasks/150/convert-to-subtask" \
  -X PUT \
  -u "USERNAME:APPLICATION_PASSWORD" \
  -H "Content-Type: application/json" \
  -d '{
    "parent_id": 133,
    "assigneeId": 1
  }'
```

**Example Response**

```json
{
  "message": "Task has been converted to subtask",
  "parentTask": {
    "id": 133,
    "parent_id": null,
    "board_id": 3,
    "title": "Task activity check",
    "status": "open",
    "stage_id": 26,
    "meta": {
      "is_template": "no"
    },
    "repeat_task_meta": null
  }
}
```

## Move a Subtask to the Board

Converts a subtask back into a top-level task in the given stage (placed first). `{task_id}` is the **subtask** ID.

```http
PUT /wp-json/fluent-boards/v2/projects/{board_id}/tasks/{task_id}/move-to-board
```

**Parameters**

| Parameter | Type | Required | Description |
|---|---|---|---|
| `stage_id` | integer | Yes | Stage on this board |

**Example Request**

```bash
curl "https://yourdomain.com/wp-json/fluent-boards/v2/projects/3/tasks/283/move-to-board" \
  -X PUT \
  -u "USERNAME:APPLICATION_PASSWORD" \
  -H "Content-Type: application/json" \
  -d '{ "stage_id": 26 }'
```

**Example Response** (`201`)

```json
{
  "moveSubtask": {
    "id": 283,
    "parent_id": null,
    "board_id": 3,
    "title": "Design Homepage (Cloned)",
    "status": "open",
    "stage_id": 26,
    "position": 0.25,
    "due_at": "2025-07-04 23:45:00"
  },
  "changedSubtasks": []
}
```

## Clone a Subtask

Copies a subtask. `{task_id}` is the **subtask** ID.

```http
POST /wp-json/fluent-boards/v2/projects/{board_id}/tasks/{task_id}/clone-subtask
```

Behavior:

- The title gets the suffix ` (cloned)`.
- `started_at` and `due_at` are kept.
- The clone stays in the same subtask group.
- Assignee and watcher relations are copied.
- The clone is placed between the original and the next subtask in the group, or at the end.

**Example Request**

```bash
curl "https://yourdomain.com/wp-json/fluent-boards/v2/projects/3/tasks/286/clone-subtask" \
  -X POST \
  -u "USERNAME:APPLICATION_PASSWORD"
```

**Example Response**

```json
{
  "subtask": {
    "id": 287,
    "parent_id": 133,
    "board_id": 3,
    "title": "Lorem ipsum (cloned)",
    "status": "open",
    "stage_id": null,
    "position": 2,
    "meta": {
      "subtask_group_id": "200"
    },
    "repeat_task_meta": null,
    "assignees": []
  },
  "message": "Subtask has been cloned successfully"
}
```

## Error Responses

See [Common Error Responses](/rest-api/shared/error-responses) for standard error formats.

Common subtask errors:

- **400** — task, subtask, stage or group not found on this board ("Subtask group not found", "Stage not found"), or a convert between different boards
- **403** — no write access to the board
- **404** — group or subtask not found on delete
- **422** — validation failed (missing `title`, `group_id`, `stage_id`, …)
