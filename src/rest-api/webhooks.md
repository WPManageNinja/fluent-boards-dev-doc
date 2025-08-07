# Webhooks

The Webhooks API allows you to set up and manage webhook integrations in Fluent Boards. You can create, read, update, and delete webhooks to receive real-time notifications when events occur in your boards.

## Webhook Object

A webhook represents an integration endpoint that receives notifications when events occur.

### Properties

| Property | Type | Description |
|----------|------|-------------|
| `id` | integer | Unique identifier for the webhook |
| `name` | string | Webhook name (required) |
| `url` | string | Webhook endpoint URL (required) |
| `events` | array | Array of events to listen for |
| `status` | string | Webhook status (active, inactive) |
| `secret` | string | Secret key for webhook signature |
| `headers` | object | Custom headers to send with webhook |
| `retry_count` | integer | Number of retry attempts on failure |
| `last_triggered` | string | Last time webhook was triggered |
| `created_by` | integer | User ID who created the webhook |
| `created_at` | string | Creation timestamp |
| `updated_at` | string | Last update timestamp |

### Available Events

- `task.created` - When a task is created
- `task.updated` - When a task is updated
- `task.deleted` - When a task is deleted
- `task.moved` - When a task is moved between stages
- `task.completed` - When a task is marked as completed
- `project.created` - When a project is created
- `project.updated` - When a project is updated
- `project.deleted` - When a project is deleted
- `comment.created` - When a comment is created
- `comment.updated` - When a comment is updated
- `comment.deleted` - When a comment is deleted
- `user.added` - When a user is added to a project
- `user.removed` - When a user is removed from a project
- `time_track.started` - When time tracking starts
- `time_track.stopped` - When time tracking stops

## List All Webhooks

Retrieve a paginated list of webhooks.

**HTTP Request**
```
GET /wp-json/fluent-boards/v2/webhooks
```

### Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `per_page` | integer | 10 | Number of webhooks per page |
| `page` | integer | 1 | Page number for pagination |
| `status` | string | - | Filter by status (active, inactive) |

### Example Request

```bash
curl "https://yourdomain.com/wp-json/fluent-boards/v2/webhooks?per_page=5" \
  -H "Authorization: Basic API_USERNAME:API_PASSWORD"
```

### Example Response

```json
{
  "current_page": 1,
  "per_page": 5,
  "total": 8,
  "data": [
    {
      "id": 1,
      "name": "Slack Notifications",
      "url": "https://hooks.slack.com/services/T00000000/B00000000/XXXXXXXXXXXXXXXXXXXXXXXX",
      "events": ["task.created", "task.completed"],
      "status": "active",
      "retry_count": 3,
      "last_triggered": "2023-02-15 14:30:00",
      "created_by": 1,
      "created_at": "2023-01-15 10:30:00",
      "updated_at": "2023-02-01 14:20:00"
    },
    {
      "id": 2,
      "name": "Zapier Integration",
      "url": "https://hooks.zapier.com/hooks/catch/123456/abc123/",
      "events": ["task.created", "task.updated", "project.created"],
      "status": "active",
      "retry_count": 5,
      "last_triggered": "2023-02-15 16:45:00",
      "created_by": 1,
      "created_at": "2023-01-20 09:15:00",
      "updated_at": "2023-02-05 11:30:00"
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

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `name` | string | Yes | Webhook name |
| `url` | string | Yes | Webhook endpoint URL |
| `events` | array | Yes | Array of events to listen for |
| `status` | string | No | Webhook status (active, inactive) |
| `headers` | object | No | Custom headers to send with webhook |
| `retry_count` | integer | No | Number of retry attempts (default: 3) |

### Example Request

```bash
curl -X POST "https://yourdomain.com/wp-json/fluent-boards/v2/webhooks" \
  -H "Authorization: Basic API_USERNAME:API_PASSWORD" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Discord Notifications",
    "url": "https://discord.com/api/webhooks/123456789/abcdefghijklmnop",
    "events": ["task.created", "task.completed", "project.created"],
    "status": "active",
    "headers": {
      "Content-Type": "application/json"
    },
    "retry_count": 5
  }'
```

### Example Response

```json
{
  "data": {
    "id": 3,
    "name": "Discord Notifications",
    "url": "https://discord.com/api/webhooks/123456789/abcdefghijklmnop",
    "events": ["task.created", "task.completed", "project.created"],
    "status": "active",
    "secret": "webhook_secret_key_here",
    "headers": {
      "Content-Type": "application/json"
    },
    "retry_count": 5,
    "last_triggered": null,
    "created_by": 1,
    "created_at": "2023-02-15 17:00:00",
    "updated_at": "2023-02-15 17:00:00"
  },
  "message": "Webhook created successfully"
}
```

## Update a Webhook

Update an existing webhook.

**HTTP Request**
```
PUT /wp-json/fluent-boards/v2/webhooks/{id}
```

### Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `id` | integer | The ID of the webhook |

### Request Body

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `name` | string | No | Webhook name |
| `url` | string | No | Webhook endpoint URL |
| `events` | array | No | Array of events to listen for |
| `status` | string | No | Webhook status |
| `headers` | object | No | Custom headers |
| `retry_count` | integer | No | Number of retry attempts |

### Example Request

```bash
curl -X PUT "https://yourdomain.com/wp-json/fluent-boards/v2/webhooks/1" \
  -H "Authorization: Basic API_USERNAME:API_PASSWORD" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Updated Slack Notifications",
    "events": ["task.created", "task.completed", "task.updated"],
    "retry_count": 5
  }'
```

### Example Response

```json
{
  "data": {
    "id": 1,
    "name": "Updated Slack Notifications",
    "url": "https://hooks.slack.com/services/T00000000/B00000000/XXXXXXXXXXXXXXXXXXXXXXXX",
    "events": ["task.created", "task.completed", "task.updated"],
    "status": "active",
    "retry_count": 5,
    "last_triggered": "2023-02-15 14:30:00",
    "created_by": 1,
    "created_at": "2023-01-15 10:30:00",
    "updated_at": "2023-02-15 18:00:00"
  },
  "message": "Webhook updated successfully"
}
```

## Delete a Webhook

Delete a webhook.

**HTTP Request**
```
DELETE /wp-json/fluent-boards/v2/webhooks/{id}
```

### Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `id` | integer | The ID of the webhook |

### Example Request

```bash
curl -X DELETE "https://yourdomain.com/wp-json/fluent-boards/v2/webhooks/1" \
  -H "Authorization: Basic API_USERNAME:API_PASSWORD"
```

### Example Response

```json
{
  "message": "Webhook deleted successfully"
}
```

## Webhook Payload Format

When a webhook is triggered, it sends a POST request to the specified URL with the following payload structure:

### Task Events

```json
{
  "event": "task.created",
  "timestamp": "2023-02-15T14:30:00Z",
  "data": {
    "id": 1,
    "title": "Design Homepage",
    "description": "Create new homepage design",
    "board_id": 1,
    "stage_id": 2,
    "status": "active",
    "priority": "high",
    "assignees": [1, 3],
    "labels": [1, 2],
    "due_date": "2023-03-15",
    "created_by": 1,
    "created_at": "2023-02-15 14:30:00",
    "updated_at": "2023-02-15 14:30:00"
  },
  "webhook_id": 1,
  "signature": "sha256=abc123def456..."
}
```

### Project Events

```json
{
  "event": "project.created",
  "timestamp": "2023-02-15T14:30:00Z",
  "data": {
    "id": 1,
    "title": "Project Alpha",
    "description": "Main project for Q1 development",
    "status": "active",
    "background": "#4CAF50",
    "created_by": 1,
    "created_at": "2023-02-15 14:30:00",
    "updated_at": "2023-02-15 14:30:00"
  },
  "webhook_id": 1,
  "signature": "sha256=abc123def456..."
}
```

### Comment Events

```json
{
  "event": "comment.created",
  "timestamp": "2023-02-15T14:30:00Z",
  "data": {
    "id": 1,
    "content": "Great progress on this task!",
    "task_id": 1,
    "board_id": 1,
    "user_id": 1,
    "user_name": "John Doe",
    "created_at": "2023-02-15 14:30:00"
  },
  "webhook_id": 1,
  "signature": "sha256=abc123def456..."
}
```

## Webhook Security

### Signature Verification

Each webhook request includes a signature header that you can use to verify the request authenticity:

```
X-FluentBoards-Signature: sha256=abc123def456...
```

### PHP Example for Signature Verification

```php
<?php
function verifyWebhookSignature($payload, $signature, $secret) {
    $expectedSignature = 'sha256=' . hash_hmac('sha256', $payload, $secret);
    return hash_equals($expectedSignature, $signature);
}

// Get the raw payload
$payload = file_get_contents('php://input');
$signature = $_SERVER['HTTP_X_FLUENTBOARDS_SIGNATURE'] ?? '';
$secret = 'your_webhook_secret';

if (verifyWebhookSignature($payload, $signature, $secret)) {
    // Webhook is authentic
    $data = json_decode($payload, true);
    // Process the webhook data
} else {
    // Invalid signature
    http_response_code(401);
    echo 'Invalid signature';
}
?>
```

### Node.js Example for Signature Verification

```javascript
const crypto = require('crypto');

function verifyWebhookSignature(payload, signature, secret) {
    const expectedSignature = 'sha256=' + crypto
        .createHmac('sha256', secret)
        .update(payload)
        .digest('hex');
    
    return crypto.timingSafeEqual(
        Buffer.from(expectedSignature),
        Buffer.from(signature)
    );
}

// In your webhook endpoint
app.post('/webhook', (req, res) => {
    const payload = JSON.stringify(req.body);
    const signature = req.headers['x-fluentboards-signature'];
    const secret = 'your_webhook_secret';
    
    if (verifyWebhookSignature(payload, signature, secret)) {
        // Webhook is authentic
        console.log('Webhook received:', req.body);
        res.status(200).send('OK');
    } else {
        // Invalid signature
        res.status(401).send('Invalid signature');
    }
});
```

## Webhook Response Requirements

Your webhook endpoint should respond with:

- **HTTP 200**: Success - The webhook was processed successfully
- **HTTP 4xx**: Client Error - The webhook will be retried
- **HTTP 5xx**: Server Error - The webhook will be retried

### Example Response

```json
{
  "status": "success",
  "message": "Webhook processed successfully"
}
```

## Webhook Retry Logic

If a webhook fails to deliver, it will be retried according to the following schedule:

1. **First retry**: 1 minute after failure
2. **Second retry**: 5 minutes after first retry
3. **Third retry**: 15 minutes after second retry
4. **Subsequent retries**: Every 30 minutes up to the maximum retry count

## Error Responses

See [Common Error Responses](/rest-api/shared/error-responses) for standard error formats.

### Common Webhook-Specific Errors

- **404 Not Found** - Webhook not found
- **403 Forbidden** - You don't have permission to access this webhook
- **400 Bad Request** - Invalid webhook data or missing required fields

## Best Practices

1. **Always verify signatures** to ensure webhook authenticity
2. **Respond quickly** - webhooks should be processed within 5 seconds
3. **Handle idempotency** - the same webhook may be sent multiple times
4. **Log webhook events** for debugging and monitoring
5. **Use HTTPS** for webhook endpoints in production
6. **Implement proper error handling** to avoid webhook failures

## Next Steps

- [Board Management](/rest-api/boards) - Set up webhooks for board events
- [Task Management](/rest-api/tasks) - Configure task-related webhooks
- [Time Tracking](/rest-api/time-tracking) - Monitor time tracking events
- [User Management](/rest-api/users) - Handle user-related webhooks 