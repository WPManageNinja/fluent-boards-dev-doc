# Webhooks

Manage incoming webhooks (an external service posts data to a URL and FluentBoards creates a task) and outgoing webhooks (FluentBoards sends a request to your URL when board events happen). Plugin source: free (management endpoints and incoming webhooks); delivery of outgoing webhooks is done by Fluent Boards Pro.

All endpoints require a WordPress administrator or a FluentBoards admin.

## Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/webhooks` | List incoming webhooks |
| POST | `/webhooks` | Create an incoming webhook |
| PUT | `/webhooks/{id}` | Rename an incoming webhook |
| DELETE | `/webhooks/{id}` | Delete an incoming webhook |
| GET | `/outgoing-webhooks` | List outgoing webhooks |
| POST | `/outgoing-webhooks` | Create an outgoing webhook |
| PUT | `/outgoing-webhooks/{id}` | Update an outgoing webhook |
| DELETE | `/outgoing-webhooks/{id}` | Delete an outgoing webhook |

## Incoming Webhook Object

Incoming webhooks are rows in `fbs_metas` with `object_type = webhook`. The `key` is a UUID that also forms the public URL.

| Field | Type | Description |
|---|---|---|
| `id` | integer | Webhook ID |
| `object_type` | string | Always `webhook` |
| `key` | string | UUID used in the webhook URL |
| `value.name` | string | Webhook name |
| `value.board` | integer | Board new tasks are created on |
| `value.stage` | integer | Stage new tasks are created in |
| `value.url` | string | URL to post task data to: `https://yourdomain.com/?fbs=1&route=task&hash={key}` |
| `created_at`, `updated_at` | string | Timestamps |

Send task fields (see the `fields` list returned by [List Incoming Webhooks](#list-incoming-webhooks)) to `value.url` to create a task.

## List Incoming Webhooks

Returns all incoming webhooks, newest first, and the list of task fields an incoming payload can map to.

```http
GET /wp-json/fluent-boards/v2/webhooks
```

**Parameters**

| Parameter | Type | Required | Description |
|---|---|---|---|
| `search` | string | No | Filter by webhook name (case-insensitive) |

**Example Request**

```bash
curl "https://yourdomain.com/wp-json/fluent-boards/v2/webhooks?search=slack" \
  -u "USERNAME:APPLICATION_PASSWORD"
```

**Example Response**

```json
{
  "webhooks": [
    {
      "id": 11,
      "object_id": null,
      "object_type": "webhook",
      "key": "8771db3e-094b-464f-bd16-e5a55eac5c80",
      "value": {
        "name": "Slack test",
        "board": 2,
        "stage": 15,
        "url": "https://yourdomain.com/?fbs=1&route=task&hash=8771db3e-094b-464f-bd16-e5a55eac5c80"
      },
      "created_at": "2025-08-26T09:08:52+00:00",
      "updated_at": "2025-08-26T09:08:52+00:00"
    }
  ],
  "fields": [
    {
      "key": "title",
      "field": {
        "field": "Title",
        "type": "text",
        "rules": "required",
        "description": "Title of the task."
      }
    },
    {
      "key": "stage",
      "field": {
        "field": "Stage",
        "type": "int|text",
        "rules": "optional",
        "description": "The stage of the task, which can be an ID, title, or slug. Example: 1 | \"open\" | \"Open\""
      }
    },
    {
      "key": "priority",
      "field": {
        "field": "Priority",
        "type": "text",
        "rules": "optional",
        "description": "Priority of the task (low | medium | high). Example: \"medium\" "
      }
    },
    {
      "key": "due_at",
      "field": {
        "field": "Due Date",
        "type": "date",
        "rules": "optional",
        "description": "The due date of the task in the format YYYY-MM-DD hh:mm. Example: 2099-12-31 23:59:59"
      }
    },
    {
      "key": "assignees",
      "field": {
        "field": "Assignees",
        "type": "text|int",
        "rules": "optional",
        "description": "An array of WP User IDs. Example: [1,2,44]"
      }
    }
  ]
}
```

The `fields` array is shortened above. The full list of keys is: `title`, `stage`, `parent_id`, `status`, `description`, `priority`, `due_at`, `started_at`, `source`, `source_id`, `crm_contact_id`, `contact_email`, `contact_first_name`, `contact_last_name`, `labels`, `assignees`.

## Create Incoming Webhook

Creates an incoming webhook for a board and stage and generates its URL.

```http
POST /wp-json/fluent-boards/v2/webhooks
```

**Parameters**

| Parameter | Type | Required | Description |
|---|---|---|---|
| `name` | string | Yes | Webhook name |
| `board` | integer | Yes | Board ID |
| `stage` | integer | Yes | Stage ID |

**Example Request**

```bash
curl -X POST "https://yourdomain.com/wp-json/fluent-boards/v2/webhooks" \
  -u "USERNAME:APPLICATION_PASSWORD" \
  -H "Content-Type: application/json" \
  -d '{"name": "Gmail", "board": 2, "stage": 15}'
```

**Example Response**

```json
{
  "id": 13,
  "webhook": {
    "name": "Gmail",
    "board": 2,
    "stage": 15,
    "url": "https://yourdomain.com/?fbs=1&route=task&hash=8db17df2-f13b-477a-bebf-62bd41622c6a"
  },
  "webhooks": [
    {
      "id": 13,
      "object_id": null,
      "object_type": "webhook",
      "key": "8db17df2-f13b-477a-bebf-62bd41622c6a",
      "value": {
        "name": "Gmail",
        "board": 2,
        "stage": 15,
        "url": "https://yourdomain.com/?fbs=1&route=task&hash=8db17df2-f13b-477a-bebf-62bd41622c6a"
      },
      "created_at": "2025-08-26T09:22:33+00:00",
      "updated_at": "2025-08-26T09:22:33+00:00"
    }
  ],
  "message": "Successfully Created the WebHook"
}
```

`webhooks` is the full, refreshed list. Missing `name`, `board` or `stage` returns `422` with `Name, board and stage are required`.

## Update Incoming Webhook

Renames an incoming webhook. Only `name` can be changed; the board, stage and URL stay the same.

```http
PUT /wp-json/fluent-boards/v2/webhooks/{id}
```

**Parameters**

| Parameter | Type | Required | Description |
|---|---|---|---|
| `name` | string | No | New webhook name |

**Example Request**

```bash
curl -X PUT "https://yourdomain.com/wp-json/fluent-boards/v2/webhooks/13" \
  -u "USERNAME:APPLICATION_PASSWORD" \
  -H "Content-Type: application/json" \
  -d '{"name": "Gmail leads"}'
```

**Example Response**

```json
{
  "webhooks": [
    {
      "id": 13,
      "object_type": "webhook",
      "key": "8db17df2-f13b-477a-bebf-62bd41622c6a",
      "value": {
        "name": "Gmail leads",
        "board": 2,
        "stage": 15,
        "url": "https://yourdomain.com/?fbs=1&route=task&hash=8db17df2-f13b-477a-bebf-62bd41622c6a"
      }
    }
  ],
  "message": "Successfully updated the webhook"
}
```

Returns `404` (`Webhook not found`) for an unknown ID.

## Delete Incoming Webhook

```http
DELETE /wp-json/fluent-boards/v2/webhooks/{id}
```

**Example Request**

```bash
curl -X DELETE "https://yourdomain.com/wp-json/fluent-boards/v2/webhooks/13" \
  -u "USERNAME:APPLICATION_PASSWORD"
```

**Example Response**

```json
{
  "webhooks": [
    {
      "id": 11,
      "object_type": "webhook",
      "key": "8771db3e-094b-464f-bd16-e5a55eac5c80",
      "value": {
        "name": "Slack test",
        "board": 2,
        "stage": 15,
        "url": "https://yourdomain.com/?fbs=1&route=task&hash=8771db3e-094b-464f-bd16-e5a55eac5c80"
      }
    }
  ],
  "message": "Successfully deleted the webhook"
}
```

## Outgoing Webhook Object

Outgoing webhooks are rows in `fbs_metas` with `object_type = outgoing_webhook`. For each board in `board_id`, a row in `fbs_relations` (`object_type = outgoing_webhook_board`) stores the subscribed events.

| Field | Type | Description |
|---|---|---|
| `value.name` | string | Webhook name |
| `value.url` | string | Your endpoint |
| `value.board_id` | array | Board IDs the webhook listens to |
| `value.triggered_events` | array | Event slugs (see below) |
| `value.header_type` | string | `no_headers` or `with_headers` |
| `value.headers` | array | `[{ "name": "...", "value": "..." }]`, used when `header_type` is `with_headers` |
| `value.method` | string | `POST` (default) or `GET`. Only kept by [Update](#update-outgoing-webhook). |
| `value.format` | string | `JSON` (default) or `FORM`. Only kept by [Update](#update-outgoing-webhook). |

::: warning Board list is required for delivery
Delivery looks up the board relations, so a webhook only fires for boards listed in `board_id`. A webhook saved with an empty `board_id` is stored but never sent.
:::

### Events

| Slug | Fired when |
|---|---|
| `task_created` | A task is created |
| `task_stage_changed` | A task moves to another stage |
| `task_closed` | A task is completed |
| `task_archived` | A task is archived |
| `task_date_changed` | A task's start or due date changes |
| `task_priority_changed` | A task's priority changes |
| `task_label_added` | A label is added to a task |
| `task_label_removed` | A label is removed from a task |
| `stage_added` | A stage is added to a board |
| `comment_created` | A comment is added |
| `assignee_added` | An assignee is added to a task |

### Payload <Badge type="tip" text="Pro" />

Fluent Boards Pro queues deliveries through Action Scheduler. A `POST` webhook receives:

```json
{
  "event": "task_created",
  "message": "'Jane Smith' has created task 'Write release notes'",
  "data": {
    "id": 42,
    "title": "Write release notes",
    "board_id": 1,
    "stage_id": 3
  }
}
```

A `GET` webhook receives query parameters `event`, `task_id` and `timestamp`. Custom headers are added to the request.

## List Outgoing Webhooks

```http
GET /wp-json/fluent-boards/v2/outgoing-webhooks
```

**Parameters**

| Parameter | Type | Required | Description |
|---|---|---|---|
| `search` | string | No | Filter by webhook name (case-insensitive) |
| `board_id` | integer | No | Only webhooks that include this board |

**Example Request**

```bash
curl "https://yourdomain.com/wp-json/fluent-boards/v2/outgoing-webhooks?board_id=1" \
  -u "USERNAME:APPLICATION_PASSWORD"
```

**Example Response**

```json
{
  "webhooks": [
    {
      "id": 21,
      "object_id": null,
      "object_type": "outgoing_webhook",
      "key": null,
      "value": {
        "name": "Notify Zapier",
        "url": "https://hooks.zapier.com/hooks/catch/123/abc/",
        "board_id": [1],
        "triggered_events": ["task_created", "task_closed"],
        "header_type": "no_headers"
      },
      "created_at": "2025-09-10T08:00:00+00:00",
      "updated_at": "2025-09-10T08:00:00+00:00"
    }
  ]
}
```

## Create Outgoing Webhook

```http
POST /wp-json/fluent-boards/v2/outgoing-webhooks
```

**Parameters**

| Parameter | Type | Required | Description |
|---|---|---|---|
| `name` | string | Yes | Webhook name |
| `url` | string | Yes | Endpoint to call |
| `board_id` | array | No | Board IDs to listen to. Needed for delivery (see above). |
| `triggered_events` | array | Yes | At least one event slug |
| `header_type` | string | No | `no_headers` or `with_headers` |
| `headers` | array | No | `[{ "name": "X-Token", "value": "secret" }]` |

Other keys (`method`, `format`) are ignored on create, so new webhooks use `POST` + `JSON`. Set them with [Update Outgoing Webhook](#update-outgoing-webhook).

**Example Request**

```bash
curl -X POST "https://yourdomain.com/wp-json/fluent-boards/v2/outgoing-webhooks" \
  -u "USERNAME:APPLICATION_PASSWORD" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Notify Zapier",
    "url": "https://hooks.zapier.com/hooks/catch/123/abc/",
    "board_id": [1],
    "triggered_events": ["task_created", "task_closed"],
    "header_type": "with_headers",
    "headers": [{ "name": "X-Token", "value": "secret" }]
  }'
```

**Example Response**

```json
{
  "id": 21,
  "webhook": {
    "name": "Notify Zapier",
    "url": "https://hooks.zapier.com/hooks/catch/123/abc/",
    "board_id": [1],
    "triggered_events": ["task_created", "task_closed"],
    "header_type": "with_headers",
    "headers": [{ "name": "X-Token", "value": "secret" }]
  },
  "webhooks": [ { "id": 21, "object_type": "outgoing_webhook", "value": { "name": "Notify Zapier" } } ],
  "message": "Successfully Created the Outgoing WebHook"
}
```

Returns `422` when `name` or `url` is missing, or `At least one event must be selected for the webhook to be triggered.` when `triggered_events` is empty.

## Update Outgoing Webhook

Replaces the webhook's stored value with the request body and rebuilds its board relations.

```http
PUT /wp-json/fluent-boards/v2/outgoing-webhooks/{id}
```

**Parameters**

| Parameter | Type | Required | Description |
|---|---|---|---|
| `name` | string | Yes | Webhook name |
| `url` | string | Yes | Endpoint to call |
| `board_id` | array | No | Board IDs to listen to |
| `triggered_events` | array | No | Event slugs |
| `header_type` | string | No | `no_headers` or `with_headers` |
| `headers` | array | No | Custom headers |
| `method` | string | No | `POST` or `GET` |
| `format` | string | No | `JSON` or `FORM` |

**Example Request**

```bash
curl -X PUT "https://yourdomain.com/wp-json/fluent-boards/v2/outgoing-webhooks/21" \
  -u "USERNAME:APPLICATION_PASSWORD" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Notify Zapier",
    "url": "https://hooks.zapier.com/hooks/catch/123/abc/",
    "board_id": [1, 2],
    "triggered_events": ["task_created"],
    "method": "POST",
    "format": "JSON"
  }'
```

**Example Response**

```json
{
  "webhooks": [ { "id": 21, "object_type": "outgoing_webhook", "value": { "name": "Notify Zapier", "board_id": [1, 2] } } ],
  "message": "Successfully updated the outgoing webhook"
}
```

Returns `404` (`Outgoing webhook not found.`) for an unknown ID.

## Delete Outgoing Webhook

Deletes the webhook and its board relations.

```http
DELETE /wp-json/fluent-boards/v2/outgoing-webhooks/{id}
```

**Example Request**

```bash
curl -X DELETE "https://yourdomain.com/wp-json/fluent-boards/v2/outgoing-webhooks/21" \
  -u "USERNAME:APPLICATION_PASSWORD"
```

**Example Response**

```json
{
  "webhooks": [],
  "message": "Successfully deleted the outgoing webhook"
}
```

See [Common Error Responses](/rest-api/shared/error-responses) for standard error formats.
