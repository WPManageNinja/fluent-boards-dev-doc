# Roadmaps

Roadmaps are boards with type `roadmap`. This section documents the Roadmap model and the REST endpoints for public idea interactions and admin settings, organized similarly to boards.

## Base Path

```
/wp-json/fluent-boards/v2
```

## Roadmap Board Object

Roadmap boards use the same model as boards but are globally scoped to type `roadmap`.

### Properties

| Property | Type | Description |
|----------|------|-------------|
| `id` | integer | Roadmap board ID |
| `title` | string | Roadmap title |
| `type` | string | Always `roadmap` |
| `background` | object | Background config |
| `settings` | object | Board settings (serialized) |
| `created_by` | integer | Creator user ID |
| `stages` | array | Non-archived stages ordered by `position` |
| `meta` | object | Key-value metadata |

### Stage Visibility (Public States)

Roadmap boards can expose public stages. A simplified public state item:

```json
{ "id": 10, "slug": "planned", "label": "Planned", "stage_type": "planned" }
```


## List Ideas in a Stage

Parameters:
- `stage_id`: a numeric stage ID or the literal `all-ideas` to fetch ideas from all public stages.


**HTTP Request**
```
GET /wp-json/fluent-boards/v2/roadmaps/{board_id}/stages/{stage_id}/ideas
```

**Example Response (stage_id is numeric)**
```json
{
  "ideas": {
    "current_page": 1,
    "data": [
      {
        "id": 300,
        "board_id": 13,
        "title": "Example Idea",
        "type": "roadmap",
        "status": "open",
        "stage_id": 118,
        "author": { "name": "John Doe", "user_id": 1 },
        "isVoted": false,
        "vote_count": 0
      }
    ],
    "per_page": 20,
    "total": 2
  }
}
```

**Example Response (stage_id = all-ideas)**
```json
{
  "ideas": [ { "id": 202, "title": "Idea across public stages", "status": "open" } ]
}
```

## Create Idea

**HTTP Request**
```
POST /wp-json/fluent-boards/v2/roadmaps/{board_id}/ideas
```

**Request Body**

| Field | Type | Required | Description |
|------|------|----------|-------------|
| `idea[title]` | string | Yes | Idea title (max 192 chars) |
| `idea[description]` | string | Yes | Idea description (HTML allowed if authenticated) |
| `idea[author][name]` | string | Cond. | Required if unauthenticated |
| `idea[author][email]` | string | Cond. | Required if unauthenticated |

**Example Request**
```json
{
  "idea": {
    "title": "New Idea",
    "description": "Short description.",
    "author": { "name": "John Doe", "email": "john@example.com" }
  }
}
```

**Example Response**
```json
{
  "idea": { "id": 300, "title": "New Idea", "stage_id": 10, "type": "roadmap" },
  "message": "Idea has been created",
  "confirmation_text": "Thank you for your idea. Once it's reviewed, approved for planning by our team, we will notify you via email."
}
```

## Get Idea

**HTTP Request**
```
GET /wp-json/fluent-boards/v2/roadmaps/{board_id}/ideas/{task_id}
```

**Example Response**
```json
{
  "idea": {
    "id": 999,
    "board_id": 1,
    "title": "Example Idea",
    "slug": "example-idea",
    "type": "roadmap",
    "status": "open",
    "stage_id": 10,
    "stage": {
      "id": 10,
      "title": "Pending",
      "settings": { "is_public": false, "default_task_status": "open", "is_template": false }
    },
    "author": { "name": "John Doe", "avatar": "https://example.com/avatar.png", "user_id": 1 },
    "isVoted": false,
    "vote_count": 0,
    "comments_count": 0,
    "public_comments": [],
    "edit_link": "https://example.com/projects#/boards/1/tasks/999-example-idea"
  }
}
```

Notes:
- Comment sensitive fields (`author_email`, `author_ip`) are hidden.
- `badget` is set to `author` when the commenter is the idea author, or `admin` when the commenter has admin capability.


## Add Comment

**HTTP Request**
```
POST /wp-json/fluent-boards/v2/roadmaps/{board_id}/ideas/{idea_id}/comments
```

**Request Body**

| Field | Type | Required | Description |
|------|------|----------|-------------|
| `comment[message]` | string | Yes | Comment text (min 10 chars) |
| `comment[author][author_name]` | string | Conditional | Required if unauthenticated |
| `comment[author][author_email]` | string | Conditional | Required if unauthenticated |

**Example Request**
```json
{
  "comment": {
    "message": "Great idea! This would help a lot.",
    "author": { "author_name": "Jane Doe", "author_email": "jane@example.com" }
  }
}
```

**Example (form fields)**
```
comment[message]: Lorem Ipsum
comment[author][author_name]: Jane Doe
comment[author][author_email]: jane@example.com
```

**Example Response **
```json
{
  "message": "Your comment has been added",
  "comment": {
    "id": 10,
    "created_by": 1,
    "board_id": { "ref": "{board_id}" },
    "task_id": { "ref": "{idea_id}" },
    "type": "comment",
    "privacy": "public",
    "status": "published",
    "description": "<p>Lorem Ipsum</p>\n",
    "author_ip": "150.228.135.29",
    "author_email": "jane@example.com",
    "author_name": "Jane Doe",
    "avatar": "https://secure.gravatar.com/avatar/{hash}?s=128&d=mm&r=g",
    "created_at": "2025-08-12T03:46:14+00:00",
    "updated_at": "2025-08-12T03:46:14+00:00",
    "task": {
      "id": { "ref": "{idea_id}" },
      "board_id": { "ref": "{board_id}" },
      "title": "New task",
      "slug": "new-task",
      "type": "roadmap",
      "status": "open",
      "stage_id": 119,
      "created_by": 1,
      "comments_count": 2,
      "settings": {
        "integration_type": "feature",
        "author": { "email": "jane@example.com" }
      },
      "created_at": "2025-08-11T06:42:19+00:00",
      "updated_at": "2025-08-12T03:46:14+00:00",
      "meta": { "comments_count": "2" }
    }
  }
}
```

Notes:
- If authenticated, author info is taken from the current user; omit `author` fields.
- Message is sanitized and wrapped in paragraphs.
- If enabled in settings, the commenter may be added/updated in CRM.

## Delete Comment

**HTTP Request**
```
DELETE /wp-json/fluent-boards/v2/roadmaps/idea/comments/{comment_id}
```

**Path Parameters**
- `comment_id` (integer): The comment ID to delete.

**Example Response**
```json
{
  "message": "Comment has been deleted successfully"
}
```

## Vote Idea

Toggles an upvote for the current actor.

**HTTP Request**
```
POST /wp-json/fluent-boards/v2/roadmaps/vote-idea/{idea_id}
```

**Path Parameters**
- `idea_id` (integer): The idea ID to vote/unvote.

**Request Body**
- None

**Example Response (vote added)**
```json
{
  "isVoted": true,
  "new_count": 5
}
```

**Example Response (vote removed)**
```json
{
  "isVoted": false,
  "new_count": 4
}
```

## Day-wise Ideas

Returns counts of ideas created per day for a board. Requires board permission.

**HTTP Request**
```
GET /wp-json/fluent-boards/v2/roadmaps/{board_id}/day-wise-ideas
```

**Path Parameters**
- `board_id` (integer): Roadmap board ID.

**Example Response**
```json
{
  "dayWiseTasks": [
    { "date": "2025-08-10", "total": 3 },
    { "date": "2025-08-11", "total": 7 },
    { "date": "2025-08-12", "total": 2 }
  ]
}
```

## Popular Ideas

Returns ideas for a board with a computed `popular` count. Requires board permission.

**HTTP Request**
```
GET /wp-json/fluent-boards/v2/roadmaps/{board_id}/popular-ideas
```

**Path Parameters**
- `board_id` (integer): Roadmap board ID.

**Example Response**
```json
{
  "ideas": [
    { "id": 301, "title": "New task", "type": "roadmap", "popular": 12 },
    { "id": 302, "title": "Another idea", "type": "roadmap", "popular": 5 }
  ]
}
```

## Change Idea Stage

Updates an idea's stage. Requires board permission.

**HTTP Request**
```
POST /wp-json/fluent-boards/v2/roadmaps/{board_id}/idea/{idea_id}/change-stage
```

**Path Parameters**
- `board_id` (integer): Roadmap board ID
- `idea_id` (integer): Idea ID

**Request Body**

| Field | Type | Required | Description |
|------|------|----------|-------------|
| `stage_id` | integer | Yes | Target stage ID |

**Example Request**
```json
{ "stage_id": 119 }
```

**Example Response**
```json
{
  "idea": {
    "id": { "ref": "{idea_id}" },
    "board_id": { "ref": "{board_id}" },
    "stage_id": 119,
    "stage": { "id": 119, "title": "In Progress" }
  },
  "message": "Idea stage has been changed"
}
```

## Admin Endpoints

Require admin permissions.

- GET `/admin/roadmap/settings`
- POST `/admin/roadmap/settings`
- GET `/admin/roadmap/page-settings`
- POST `/admin/roadmap/page-settings`

## Get Settings

**HTTP Request**
```
GET /wp-json/fluent-boards/v2/admin/roadmap/settings
```

**Example Response**
```json
{ "settings": { "enabled": true } }
```

## Update Settings

**HTTP Request**
```
POST /wp-json/fluent-boards/v2/admin/roadmap/settings
```

**Example Request**
```json
{
  "settings": {
    "enable_new_idea_submission": "yes",
    "new_idea_require_auth": "no",
    "enable_new_comment_submission": "yes",
    "new_idea_comment_require_auth": "no",
    "enable_new_vote_submission": "yes",
    "new_idea_vote_require_auth": "no"
  }
}
```

**Example Response**
```json
{
  "message": "Settings has been updated successfully",
  "settings": { /* updated settings */ }
}
```

## Get/Update Page Settings

## Error Responses

See [Common Error Responses](/rest-api/shared/error-responses) for standard error formats.

### Common Roadmap-Specific Errors

- 404 Not Found - Roadmap board or idea not found
- 403 Forbidden - You don't have permission for this action
- 400 Bad Request - Invalid data or missing required fields

## Next Steps

- Boards - Manage roadmap board metadata and members
- Tasks - Manage idea tasks (internal)

**HTTP Requests**
```
GET  /wp-json/fluent-boards/v2/admin/roadmap/page-settings
POST /wp-json/fluent-boards/v2/admin/roadmap/page-settings
```

**Update Example Request**
```json
{
  "selectedPages": {
    "{roadmap_id}": 123
  }
}
```

**Example Response**
```json
{
  "message": "Roadmap Board & Page Mapping Updated Successfully",
  "page_settings": [ { "roadmap_id": 1, "page_id": 123 } ]
}
```

Notes:
- Roadmap boards are filtered at the model level to `type = roadmap`.
- Use placeholders `{board_id}`, `{stage_id}`, `{task_id}`, `{idea_id}`, `{comment_id}`.