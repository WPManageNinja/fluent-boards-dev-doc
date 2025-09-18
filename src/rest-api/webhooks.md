# Webhooks

The Webhooks API allows you to set up and manage webhook integrations in Fluent Boards. You can create, read, update, and delete webhooks to receive real-time notifications when events occur in your boards.

## Webhook Object

A webhook represents an integration endpoint that receives notifications when events occur.

## List All Webhooks

Retrieve a paginated list of webhooks.

**HTTP Request**
```
GET /wp-json/fluent-boards/v2/webhooks
```

### Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `search` | string | No | ''(empty string) | Search term to filter webhooks by name. |


### Example Response

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
                "board": "2",
                "stage": "15",
                "query_timestamp": "1756199331378",
                "url": "https://bipulkarmokar.wp1.site/?fbs=1&route=task&hash=8771db3e-094b-464f-bd16-e5a55eac5c80"
            },
            "created_at": "2025-08-26T09:08:52+00:00",
            "updated_at": "2025-08-26T09:08:52+00:00"
        },
        {
            "id": 9,
            "object_id": null,
            "object_type": "webhook",
            "key": "b3c51ea0-ef5c-4d72-a335-6bede48c31e4",
            "value": {
                "name": "Webhook Test",
                "board": "2",
                "stage": "14",
                "query_timestamp": "1756199191548",
                "url": "https://bipulkarmokar.wp1.site/?fbs=1&route=task&hash=b3c51ea0-ef5c-4d72-a335-6bede48c31e4"
            },
            "created_at": "2025-08-21T04:30:47+00:00",
            "updated_at": "2025-08-26T09:06:32+00:00"
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
            "key": "parent_id",
            "field": {
                "field": "Parent Task",
                "type": "int",
                "rules": "optional",
                "description": "Parent Task ID of the subtask. Example: 1"
            }
        },
        {
            "key": "status",
            "field": {
                "field": "Status",
                "type": "text",
                "rules": "optional",
                "description": "The status of the task (open | closed). Example: \"closed\""
            }
        },
        {
            "key": "description",
            "field": {
                "field": "Description",
                "type": "textarea",
                "rules": "optional",
                "description": "Description of the task"
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
            "key": "started_at",
            "field": {
                "field": "Start Date",
                "type": "date",
                "rules": "optional",
                "description": "The start date of the task in the format YYYY-MM-DD. Example: 2099-12-31"
            }
        },
        {
            "key": "source",
            "field": {
                "field": "Source",
                "type": "text",
                "rules": "optional",
                "description": "The source of the task. Example: \"jira\""
            }
        },
        {
            "key": "source_id",
            "field": {
                "field": "Source Id",
                "type": "text|int",
                "rules": "optional",
                "description": "The source Id of the task (if any). Example: \"bcy664fh177\""
            }
        },
        {
            "key": "crm_contact_id",
            "field": {
                "field": "CRM Contact Id",
                "type": "int",
                "rules": "optional",
                "description": "The ID of the associated FluentCRM contact. Example: 6465"
            }
        },
        {
            "key": "contact_email",
            "field": {
                "field": "CRM Contact Email",
                "type": "text",
                "rules": "optional",
                "description": "The email of the associated CRM contact. Example: \"john.doe@example.com\""
            }
        },
        {
            "key": "contact_first_name",
            "field": {
                "field": "Contact First Name",
                "type": "text",
                "rules": "optional",
                "description": "Associated CRM Contact First Name. Example: \"John\""
            }
        },
        {
            "key": "contact_last_name",
            "field": {
                "field": "Contact Last Name",
                "type": "text",
                "rules": "optional",
                "description": "Associated CRM Contact Last Name"
            }
        },
        {
            "key": "labels",
            "field": {
                "field": "Labels",
                "type": "text|int",
                "rules": "optional",
                "description": "An array of label IDs or titles. Example: [1, \"feature\", 44]"
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

## Create a Webhook

Create a new webhook.

**HTTP Request**
```
POST /wp-json/fluent-boards/v2/webhooks
```

### Request Body

| Parameter     | Type    | Required | Description                           |
|---------------|---------|----------|---------------------------------------|
| `name`        | string  | Yes | Webhook name                          |
| `board`       | integer | Yes | Board ID                              |
| `stage`       | Integer | Yes | Stage ID                              |


### Example Response

```json
{
  "id": 13,
  "webhook": {
    "name": "Gmail",
    "board": "2",
    "stage": "15",
    "url": "https://bipulkarmokar.wp1.site/?fbs=1&route=task&hash=8db17df2-f13b-477a-bebf-62bd41622c6a"
  },
  "webhooks": [
    {
      "id": 13,
      "object_id": null,
      "object_type": "webhook",
      "key": "8db17df2-f13b-477a-bebf-62bd41622c6a",
      "value": {
        "name": "Gmail",
        "board": "2",
        "stage": "15",
        "url": "https://bipulkarmokar.wp1.site/?fbs=1&route=task&hash=8db17df2-f13b-477a-bebf-62bd41622c6a"
      },
      "created_at": "2025-08-26T09:22:33+00:00",
      "updated_at": "2025-08-26T09:22:33+00:00"
    },
    {
      "id": 12,
      "object_id": null,
      "object_type": "webhook",
      "key": "d5f02242-c894-4725-9b81-cc141ca4ee08",
      "value": {
        "name": "Discord",
        "board": "2",
        "stage": "15",
        "query_timestamp": "1756200073976",
        "url": "https://bipulkarmokar.wp1.site/?fbs=1&route=task&hash=d5f02242-c894-4725-9b81-cc141ca4ee08"
      },
      "created_at": "2025-08-26T09:21:14+00:00",
      "updated_at": "2025-08-26T09:21:14+00:00"
    },
    {
      "id": 11,
      "object_id": null,
      "object_type": "webhook",
      "key": "8771db3e-094b-464f-bd16-e5a55eac5c80",
      "value": {
        "name": "Slack test",
        "board": "2",
        "stage": "15",
        "query_timestamp": "1756199331378",
        "url": "https://bipulkarmokar.wp1.site/?fbs=1&route=task&hash=8771db3e-094b-464f-bd16-e5a55eac5c80"
      },
      "created_at": "2025-08-26T09:08:52+00:00",
      "updated_at": "2025-08-26T09:08:52+00:00"
    },
    {
      "id": 9,
      "object_id": null,
      "object_type": "webhook",
      "key": "b3c51ea0-ef5c-4d72-a335-6bede48c31e4",
      "value": {
        "name": "Webhook Test",
        "board": "2",
        "stage": "14",
        "query_timestamp": "1756199191548",
        "url": "https://bipulkarmokar.wp1.site/?fbs=1&route=task&hash=b3c51ea0-ef5c-4d72-a335-6bede48c31e4"
      },
      "created_at": "2025-08-21T04:30:47+00:00",
      "updated_at": "2025-08-26T09:06:32+00:00"
    }
  ],
  "message": "Successfully Created the WebHook"
}
```

## Delete a Webhook

Delete a webhook.

**HTTP Request**
```
DELETE /wp-json/fluent-boards/v2/webhooks/{id}
```

### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | integer | Yes | The ID of the webhook |



### Example Response

```json
{
    "webhooks": [
        {
            "id": 12,
            "object_id": null,
            "object_type": "webhook",
            "key": "d5f02242-c894-4725-9b81-cc141ca4ee08",
            "value": {
                "name": "Discord",
                "board": "2",
                "stage": "15",
                "query_timestamp": "1756200073976",
                "url": "https://bipulkarmokar.wp1.site/?fbs=1&route=task&hash=d5f02242-c894-4725-9b81-cc141ca4ee08"
            },
            "created_at": "2025-08-26T09:21:14+00:00",
            "updated_at": "2025-08-26T09:21:14+00:00"
        },
        {
            "id": 11,
            "object_id": null,
            "object_type": "webhook",
            "key": "8771db3e-094b-464f-bd16-e5a55eac5c80",
            "value": {
                "name": "Slack test",
                "board": "2",
                "stage": "15",
                "query_timestamp": "1756199331378",
                "url": "https://bipulkarmokar.wp1.site/?fbs=1&route=task&hash=8771db3e-094b-464f-bd16-e5a55eac5c80"
            },
            "created_at": "2025-08-26T09:08:52+00:00",
            "updated_at": "2025-08-26T09:08:52+00:00"
        },
        {
            "id": 9,
            "object_id": null,
            "object_type": "webhook",
            "key": "b3c51ea0-ef5c-4d72-a335-6bede48c31e4",
            "value": {
                "name": "Webhook Test",
                "board": "2",
                "stage": "14",
                "query_timestamp": "1756199191548",
                "url": "https://bipulkarmokar.wp1.site/?fbs=1&route=task&hash=b3c51ea0-ef5c-4d72-a335-6bede48c31e4"
            },
            "created_at": "2025-08-21T04:30:47+00:00",
            "updated_at": "2025-08-26T09:06:32+00:00"
        }
    ],
    "message": "Successfully deleted the webhook"
}
```
