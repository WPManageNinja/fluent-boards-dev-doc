# Roadmaps <Badge type="info" text="Roadmap add-on" />

Roadmaps are boards with type `roadmap`. Their tasks are **ideas** (tasks with `type = "roadmap"`) that visitors can submit, vote on and comment on from a public roadmap page. This page covers the public idea endpoints and the roadmap admin settings. Plugin source: Fluent Roadmap add-on.

::: tip Roadmap add-on
These endpoints are registered by the **Fluent Roadmap** add-on (`fluent-roadmap`). They use the FluentBoards router, so they live under the same `fluent-boards/v2` namespace.
:::

**Access.** The `/roadmaps/*` routes use `PublicPolicy`, which lets every request through, including unauthenticated visitors. A few endpoints add their own check (noted per endpoint). The `/admin/roadmap/*` routes require a WordPress administrator (`manage_options`).

## Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/roadmaps/{board_id}/stages/{stage_id}/ideas` | List ideas in a stage |
| POST | `/roadmaps/{board_id}/ideas` | Submit an idea |
| GET | `/roadmaps/{board_id}/ideas/{task_id}` | Get an idea with its public comments |
| POST | `/roadmaps/vote-idea/{idea_id}` | Toggle an upvote |
| POST | `/roadmaps/{board_id}/ideas/{idea_id}/comments` | Comment on an idea |
| POST | `/roadmaps/idea/comments/{comment_id}/replies` | Reply to a comment |
| DELETE | `/roadmaps/idea/comments/{comment_id}` | Delete a comment |
| GET | `/roadmaps/{board_id}/day-wise-ideas` | Ideas created per day |
| GET | `/roadmaps/{board_id}/popular-ideas` | Ideas with popularity counts |
| POST | `/roadmaps/{board_id}/idea/{idea_id}/change-stage` | Move an idea to another stage |
| GET | `/admin/roadmap/settings` | Get roadmap settings |
| POST | `/admin/roadmap/settings` | Update roadmap settings |
| GET | `/admin/roadmap/page-settings` | Get roadmap-to-page mapping |
| POST | `/admin/roadmap/page-settings` | Update roadmap-to-page mapping |

## Roadmap Board Object

Roadmap boards use the board model, scoped to type `roadmap`.

| Property | Type | Description |
|---|---|---|
| `id` | integer | Roadmap board ID |
| `title` | string | Roadmap title |
| `type` | string | Always `roadmap` |
| `background` | object | Background config |
| `settings` | object | Board settings |
| `created_by` | integer | Creator user ID |
| `stages` | array | Non-archived stages ordered by `position` |
| `meta` | object | Key-value metadata |

### Public stages

Only stages with `settings.is_public = true` are shown on the public roadmap (toggle it with [Toggle Stage Visibility](/rest-api/stages#toggle-stage-visibility)). A public stage is described as:

```json
{ "id": 10, "slug": "planned", "label": "Planned", "stage_type": "planned" }
```

New ideas always go into the first active stage of the board, which is usually kept private for review.

## List Ideas in a Stage

Return a page of active ideas from one stage, or from all public stages. Each idea gets `author`, `isVoted`, `vote_count` and `comments_count`; `settings` is removed.

```http
GET /wp-json/fluent-boards/v2/roadmaps/{board_id}/stages/{stage_id}/ideas
```

**Parameters**

| Parameter | Type | Required | Description |
|---|---|---|---|
| `stage_id` | integer\|string | Yes (path) | A stage ID, or `all-ideas` for every public stage (ideas then include their `stage`) |
| `sort` | string | No | `recent` (default), `comment` (most comments) or `vote` (most votes) |
| `per_page` | integer | No | Ideas per page. Default `1`, so always send it |
| `page` | integer | No | Page number. Default `1` |

**Example Request**

```bash
curl "https://yourdomain.com/wp-json/fluent-boards/v2/roadmaps/13/stages/118/ideas?sort=vote&per_page=20&page=1"
```

**Example Response**

```json
{
  "ideas": {
    "current_page": 1,
    "data": [
      {
        "id": 300,
        "board_id": 13,
        "title": "Dark mode",
        "slug": "dark-mode",
        "type": "roadmap",
        "status": "open",
        "stage_id": 118,
        "created_at": "2025-08-11T06:42:19+00:00",
        "author": { "name": "John Doe", "avatar": "https://secure.gravatar.com/avatar/...", "user_id": 1 },
        "isVoted": false,
        "vote_count": 12,
        "comments_count": 3
      }
    ],
    "per_page": 20,
    "total": 1,
    "last_page": 1
  }
}
```

## Submit an Idea

Create a new idea in the first stage of a roadmap board. Logged-in users are recorded as the author; guests must send a name and email.

```http
POST /wp-json/fluent-boards/v2/roadmaps/{board_id}/ideas
```

**Parameters**

All fields are sent inside an `idea` object.

| Parameter | Type | Required | Description |
|---|---|---|---|
| `idea[title]` | string | Yes | Idea title, max 192 characters |
| `idea[description]` | string | Yes | At least 10 characters. HTML is kept for logged-in users and stripped for guests |
| `idea[author][name]` | string | Guests only | Author name, max 192 characters |
| `idea[author][email]` | string | Guests only | Author email |

When the roadmap setting `add_user_to_crm_new_idea_submission` is `yes` and FluentCRM is active, the author is also added to FluentCRM with the configured tags and lists.

**Example Request**

```bash
curl "https://yourdomain.com/wp-json/fluent-boards/v2/roadmaps/13/ideas" \
  -X POST \
  -H "Content-Type: application/json" \
  -d '{
    "idea": {
      "title": "Dark mode",
      "description": "Please add a dark theme for the dashboard.",
      "author": { "name": "John Doe", "email": "john@example.com" }
    }
  }'
```

**Example Response**

```json
{
  "idea": {
    "id": 300,
    "board_id": 13,
    "title": "Dark mode",
    "slug": "dark-mode",
    "type": "roadmap",
    "stage_id": 117,
    "source": "page",
    "created_at": "2025-08-11T06:42:19+00:00"
  },
  "message": "Idea has been created",
  "confirmation_text": "Thank you for your idea. Once it's reviewed, approved for planning by our team, we will notify you via email."
}
```

Returns an error with `You can not create idea in this board` when the board has no active stage.

## Get an Idea

Return one idea with its `stage` and `public_comments`. The idea must belong to `{board_id}`.

```http
GET /wp-json/fluent-boards/v2/roadmaps/{board_id}/ideas/{task_id}
```

**Example Request**

```bash
curl "https://yourdomain.com/wp-json/fluent-boards/v2/roadmaps/1/ideas/999"
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
      "title": "Planned",
      "settings": { "is_public": true, "default_task_status": "open" }
    },
    "public_comments": [
      {
        "id": 55,
        "description": "<p>Would love this.</p>\n",
        "author_name": "Jane Doe",
        "created_by": null,
        "created_at": "2025-08-12T03:46:14+00:00",
        "badget": ""
      }
    ],
    "author": { "name": "John Doe", "avatar": "https://example.com/avatar.png", "user_id": 1 },
    "isVoted": false,
    "vote_count": 0,
    "comments_count": 1,
    "edit_link": "https://example.com/wp-admin/admin.php?page=fluent-boards#/boards/1/tasks/999-example-idea"
  }
}
```

Notes:

- `author_email` and `author_ip` are hidden on comments.
- `badget` is `author` when the commenter is the idea author, `admin` when the commenter can edit comments, and empty for guests.
- `edit_link` is only present when the current user has access to the board.

## Vote on an Idea

Toggle an upvote on an idea. Logged-in users are matched by user ID, guests by IP address. No body is needed.

```http
POST /wp-json/fluent-boards/v2/roadmaps/vote-idea/{idea_id}
```

**Example Request**

```bash
curl "https://yourdomain.com/wp-json/fluent-boards/v2/roadmaps/vote-idea/300" -X POST
```

**Example Response**

`isVoted` is `true` when the vote was added and `false` when it was removed.

```json
{
  "isVoted": true,
  "new_count": 5
}
```

## Comment on an Idea

Add a public comment to an idea. Logged-in users are recorded as the author; guests must send a name and email.

```http
POST /wp-json/fluent-boards/v2/roadmaps/{board_id}/ideas/{idea_id}/comments
```

**Parameters**

All fields are sent inside a `comment` object.

| Parameter | Type | Required | Description |
|---|---|---|---|
| `comment[message]` | string | Yes | Comment text, at least 10 characters. Tags are stripped and the text is wrapped in paragraphs |
| `comment[author][author_name]` | string | Guests only | Author name, max 192 characters |
| `comment[author][author_email]` | string | Guests only | Author email |

**Example Request**

```bash
curl "https://yourdomain.com/wp-json/fluent-boards/v2/roadmaps/13/ideas/300/comments" \
  -X POST \
  -H "Content-Type: application/json" \
  -d '{
    "comment": {
      "message": "Great idea! This would help a lot.",
      "author": { "author_name": "Jane Doe", "author_email": "jane@example.com" }
    }
  }'
```

**Example Response**

`comment` is the stored comment, with its `task` (the idea).

```json
{
  "message": "Your comment has been added",
  "comment": {
    "id": 10,
    "board_id": 13,
    "task_id": 300,
    "type": "comment",
    "privacy": "public",
    "status": "published",
    "description": "<p>Great idea! This would help a lot.</p>\n",
    "author_name": "Jane Doe",
    "author_email": "jane@example.com",
    "author_ip": "203.0.113.10",
    "created_at": "2025-08-12T03:46:14+00:00",
    "updated_at": "2025-08-12T03:46:14+00:00"
  }
}
```

## Reply to a Comment

Add a public reply to an idea comment. The reply is attached to the parent comment's idea and board.

```http
POST /wp-json/fluent-boards/v2/roadmaps/idea/comments/{comment_id}/replies
```

**Parameters**

| Parameter | Type | Required | Description |
|---|---|---|---|
| `message` | string | Yes | Reply text. Tags are stripped and the text is wrapped in paragraphs |
| `author[name]` | string | No | Guest name (defaults to `Guest`) |
| `author[email]` | string | No | Guest email |

**Example Request**

```bash
curl "https://yourdomain.com/wp-json/fluent-boards/v2/roadmaps/idea/comments/10/replies" \
  -X POST \
  -u "USERNAME:APPLICATION_PASSWORD" \
  -H "Content-Type: application/json" \
  -d '{"message": "Thanks, we have planned this for Q4."}'
```

**Example Response**

```json
{
  "message": "Reply has been added",
  "reply": {
    "id": 11,
    "parent_id": 10,
    "task_id": 300,
    "board_id": 13,
    "type": "reply",
    "privacy": "public",
    "status": "published",
    "description": "<p>Thanks, we have planned this for Q4.</p>\n",
    "created_by": 1,
    "created_at": "2025-08-12T05:10:00+00:00"
  }
}
```

## Delete a Comment

Delete a comment by ID.

```http
DELETE /wp-json/fluent-boards/v2/roadmaps/idea/comments/{comment_id}
```

**Example Request**

```bash
curl "https://yourdomain.com/wp-json/fluent-boards/v2/roadmaps/idea/comments/10" \
  -X DELETE \
  -u "USERNAME:APPLICATION_PASSWORD"
```

**Example Response**

```json
{
  "message": "Comment has been deleted successfully"
}
```

## Ideas Per Day

Count the board's tasks by creation date. The current user must have access to the board.

```http
GET /wp-json/fluent-boards/v2/roadmaps/{board_id}/day-wise-ideas
```

**Example Request**

```bash
curl "https://yourdomain.com/wp-json/fluent-boards/v2/roadmaps/13/day-wise-ideas" \
  -u "USERNAME:APPLICATION_PASSWORD"
```

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

Without board access the endpoint returns `You don't have permission`.

## Popular Ideas

Return all ideas of the board, each with a computed `popular` count. The current user must have access to the board.

```http
GET /wp-json/fluent-boards/v2/roadmaps/{board_id}/popular-ideas
```

**Example Request**

```bash
curl "https://yourdomain.com/wp-json/fluent-boards/v2/roadmaps/13/popular-ideas" \
  -u "USERNAME:APPLICATION_PASSWORD"
```

**Example Response**

```json
{
  "ideas": [
    { "id": 301, "board_id": 13, "title": "Dark mode", "type": "roadmap", "stage_id": 118, "popular": 12 },
    { "id": 302, "board_id": 13, "title": "CSV export", "type": "roadmap", "stage_id": 119, "popular": 5 }
  ]
}
```

## Change Idea Stage

Move an idea to another stage. The current user must have access to the board.

```http
POST /wp-json/fluent-boards/v2/roadmaps/{board_id}/idea/{idea_id}/change-stage
```

**Parameters**

| Parameter | Type | Required | Description |
|---|---|---|---|
| `stage_id` | integer | Yes | Target stage ID |

**Example Request**

```bash
curl "https://yourdomain.com/wp-json/fluent-boards/v2/roadmaps/13/idea/300/change-stage" \
  -X POST \
  -u "USERNAME:APPLICATION_PASSWORD" \
  -H "Content-Type: application/json" \
  -d '{"stage_id": 119}'
```

**Example Response**

```json
{
  "idea": {
    "id": 300,
    "board_id": 13,
    "title": "Dark mode",
    "stage_id": 119,
    "stage": { "id": 119, "title": "In Progress" }
  },
  "message": "Idea stage has been changed"
}
```

## Get Roadmap Settings

Return the global roadmap settings, merged with defaults. Requires WordPress administrator.

```http
GET /wp-json/fluent-boards/v2/admin/roadmap/settings
```

**Example Request**

```bash
curl "https://yourdomain.com/wp-json/fluent-boards/v2/admin/roadmap/settings" \
  -u "USERNAME:APPLICATION_PASSWORD"
```

**Example Response**

The `add_user_to_crm_new_idea_submission`, `crm_tags` and `crm_lists` keys are only present when FluentCRM is active.

```json
{
  "settings": {
    "enable_new_idea_submission": "yes",
    "new_idea_require_auth": "yes",
    "enable_new_comment_submission": "yes",
    "new_idea_comment_require_auth": "yes",
    "enable_new_vote_submission": "yes",
    "new_idea_vote_require_auth": "yes",
    "auth_html": "<p>Please login to vote, comment and add new ideas.</p> <a href='{login_url}'>Login</a>",
    "add_user_to_crm_new_idea_submission": "no",
    "crm_tags": [],
    "crm_lists": []
  }
}
```

## Update Roadmap Settings

Save the global roadmap settings. Keys that are not in the current settings are ignored. Requires WordPress administrator.

```http
POST /wp-json/fluent-boards/v2/admin/roadmap/settings
```

**Parameters**

All fields are sent inside a `settings` object. Toggle values are `yes` or `no`.

| Parameter | Type | Required | Description |
|---|---|---|---|
| `settings[enable_new_idea_submission]` | string | Yes | Allow new ideas |
| `settings[new_idea_require_auth]` | string | Yes | Require login to submit ideas |
| `settings[enable_new_comment_submission]` | string | Yes | Allow comments |
| `settings[new_idea_comment_require_auth]` | string | Yes | Require login to comment |
| `settings[enable_new_vote_submission]` | string | Yes | Allow votes |
| `settings[new_idea_vote_require_auth]` | string | Yes | Require login to vote |
| `settings[auth_html]` | string | Yes | HTML shown to guests when login is required. `{login_url}` is replaced with the login URL |
| `settings[add_user_to_crm_new_idea_submission]` | string | Yes | Add idea authors to FluentCRM |
| `settings[crm_tags]` | array | No | FluentCRM tag IDs to apply |
| `settings[crm_lists]` | array | No | FluentCRM list IDs to apply |

::: warning
`add_user_to_crm_new_idea_submission` is validated as required, but it is dropped from the request when FluentCRM is not active. On sites without FluentCRM this endpoint currently fails validation.
:::

**Example Request**

```bash
curl "https://yourdomain.com/wp-json/fluent-boards/v2/admin/roadmap/settings" \
  -X POST \
  -u "USERNAME:APPLICATION_PASSWORD" \
  -H "Content-Type: application/json" \
  -d '{
    "settings": {
      "enable_new_idea_submission": "yes",
      "new_idea_require_auth": "no",
      "enable_new_comment_submission": "yes",
      "new_idea_comment_require_auth": "no",
      "enable_new_vote_submission": "yes",
      "new_idea_vote_require_auth": "no",
      "auth_html": "<p>Please log in to take part.</p>",
      "add_user_to_crm_new_idea_submission": "no",
      "crm_tags": [],
      "crm_lists": []
    }
  }'
```

**Example Response**

```json
{
  "message": "Settings has been updated successfully",
  "settings": {
    "enable_new_idea_submission": "yes",
    "new_idea_require_auth": "no",
    "enable_new_comment_submission": "yes",
    "new_idea_comment_require_auth": "no",
    "enable_new_vote_submission": "yes",
    "new_idea_vote_require_auth": "no",
    "auth_html": "<p>Please log in to take part.</p>",
    "add_user_to_crm_new_idea_submission": "no",
    "crm_tags": [],
    "crm_lists": []
  }
}
```

## Get Page Settings

Return which WordPress page shows which roadmap board. Requires WordPress administrator.

```http
GET /wp-json/fluent-boards/v2/admin/roadmap/page-settings
```

**Example Request**

```bash
curl "https://yourdomain.com/wp-json/fluent-boards/v2/admin/roadmap/page-settings" \
  -u "USERNAME:APPLICATION_PASSWORD"
```

**Example Response**

```json
{
  "page_settings": [
    { "roadmap_id": "1", "page_id": 123 }
  ]
}
```

## Update Page Settings

Replace the roadmap-to-page mapping. Requires WordPress administrator.

```http
POST /wp-json/fluent-boards/v2/admin/roadmap/page-settings
```

**Parameters**

| Parameter | Type | Required | Description |
|---|---|---|---|
| `selectedPages` | object | Yes | Map of roadmap board ID to WordPress page ID. Entries with an empty page ID are dropped |

**Example Request**

```bash
curl "https://yourdomain.com/wp-json/fluent-boards/v2/admin/roadmap/page-settings" \
  -X POST \
  -u "USERNAME:APPLICATION_PASSWORD" \
  -H "Content-Type: application/json" \
  -d '{
    "selectedPages": {
      "1": 123,
      "4": 456
    }
  }'
```

**Example Response**

```json
{
  "message": "Roadmap Board & Page Mapping Updated Successfully",
  "page_settings": [
    { "roadmap_id": 1, "page_id": 123 },
    { "roadmap_id": 4, "page_id": 456 }
  ]
}
```

See [Common Error Responses](/rest-api/shared/error-responses) for standard error formats.
