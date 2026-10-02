# AI

Endpoints for the AI writing assistant (task description editor) and task-level AI actions (summarize, suggest subtasks, suggest labels and priority). FluentBoards calls the configured provider (OpenAI, Claude, Gemini, or the WordPress 7+ AI client) from the server. Plugin source: free.

## Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/ai/settings` | Get AI settings (admin) |
| POST | `/ai/settings` | Save AI settings (admin) |
| POST | `/ai/models` | List models for a provider (admin) |
| POST | `/ai/test` | Test provider credentials (admin) |
| POST | `/ai/generate` | Generate or transform text |
| POST | `/projects/{board_id}/tasks/{task_id}/ai-assist` | Summarize a task, suggest subtasks, or suggest labels/priority |
| POST | `/projects/{board_id}/tasks/{task_id}/ai-apply-suggestions` | Apply suggested labels and priority |

**Permissions**

- `/ai/settings`, `/ai/models`, `/ai/test`: WordPress administrator or FluentBoards admin.
- `/ai/generate`: a FluentBoards admin or a member of at least one board.
- Task routes: board access. `ai-assist` with `action=summarize` is treated as a read (viewers allowed); other actions need write access to the board.

Requests that reach the provider return `422` with a `message` when AI is not enabled or configured, or when the provider call fails.

## Settings object

| Key | Type | Description |
|---|---|---|
| `is_enabled` | string | `yes` or `no` |
| `provider` | string | `open_ai`, `claude`, `gemini` or `wordpress` (`openai` is accepted as an alias) |
| `model` | string | A model of the provider, or `auto` |
| `api_key` | string | Masked on read (`****` + last 4 characters) |
| `custom_prompt` | string | Extra instructions added to the system prompt |
| `created_by` | string | Plugin that first stored the shared credentials |

Provider, model and API key are stored in the WordPress option `_fluent_ai_creds`, which is shared with FluentCRM and other Fluent plugins. `is_enabled` and `custom_prompt` are FluentBoards-only.

## Get AI Settings

```http
GET /wp-json/fluent-boards/v2/ai/settings
```

**Example Request**

```bash
curl "https://yourdomain.com/wp-json/fluent-boards/v2/ai/settings" \
  -u "USERNAME:APPLICATION_PASSWORD"
```

**Example Response**

```json
{
  "settings": {
    "is_enabled": "yes",
    "provider": "open_ai",
    "api_key": "****9xYz",
    "model": "auto",
    "custom_prompt": "",
    "created_by": "fluent_boards"
  },
  "has_wordpress_ai": false,
  "connectors_url": "https://yourdomain.com/wp-admin/options-connectors.php"
}
```

`has_wordpress_ai` is true on WordPress 7.0 or newer, where the `wordpress` provider can be used.

## Save AI Settings

Saves the settings. An empty or masked `api_key` keeps the stored key, and an empty `provider` or `model` keeps the stored value; the shared key cannot be cleared from this endpoint.

```http
POST /wp-json/fluent-boards/v2/ai/settings
```

**Parameters**

| Parameter | Type | Required | Description |
|---|---|---|---|
| `settings` | object | Yes | Keys `is_enabled`, `provider`, `model`, `api_key`, `custom_prompt` |

**Example Request**

```bash
curl -X POST "https://yourdomain.com/wp-json/fluent-boards/v2/ai/settings" \
  -u "USERNAME:APPLICATION_PASSWORD" \
  -H "Content-Type: application/json" \
  -d '{
    "settings": {
      "is_enabled": "yes",
      "provider": "claude",
      "model": "auto",
      "api_key": "sk-ant-...",
      "custom_prompt": "Write in British English."
    }
  }'
```

**Example Response**

```json
{
  "message": "AI configuration saved successfully."
}
```

Returns `422` for an unknown provider, a model the provider does not support, or the `wordpress` provider on WordPress below 7.0.

## List Models

```http
POST /wp-json/fluent-boards/v2/ai/models
```

**Parameters**

| Parameter | Type | Required | Description |
|---|---|---|---|
| `settings.provider` | string | Yes | `open_ai`, `claude`, `gemini` or `wordpress` |

**Example Request**

```bash
curl -X POST "https://yourdomain.com/wp-json/fluent-boards/v2/ai/models" \
  -u "USERNAME:APPLICATION_PASSWORD" \
  -H "Content-Type: application/json" \
  -d '{"settings": {"provider": "claude"}}'
```

**Example Response**

```json
{
  "models": [
    { "value": "auto", "label": "Auto" },
    { "value": "claude-opus-4-7", "label": "claude-opus-4-7" },
    { "value": "claude-sonnet-4-6", "label": "claude-sonnet-4-6" }
  ]
}
```

The model list is fixed in the plugin (`AiService::$providerModels`). `auto` resolves to a default model per provider.

## Test Connection

Sends a short probe prompt to the provider. If `api_key` is empty or masked, the stored key is used.

```http
POST /wp-json/fluent-boards/v2/ai/test
```

**Parameters**

| Parameter | Type | Required | Description |
|---|---|---|---|
| `settings.provider` | string | Yes | Provider to test |
| `settings.model` | string | Yes | Model or `auto` |
| `settings.api_key` | string | No | Key to test (not needed for `wordpress`) |

**Example Request**

```bash
curl -X POST "https://yourdomain.com/wp-json/fluent-boards/v2/ai/test" \
  -u "USERNAME:APPLICATION_PASSWORD" \
  -H "Content-Type: application/json" \
  -d '{"settings": {"provider": "open_ai", "model": "auto", "api_key": "sk-..."}}'
```

**Example Response**

```json
{
  "message": "Connection successful! Your API key is valid."
}
```

## Generate Text

Writes or transforms text for the task description editor and returns Markdown. Content is truncated to 12,000 characters and the prompt to 2,000.

```http
POST /wp-json/fluent-boards/v2/ai/generate
```

**Parameters**

| Parameter | Type | Required | Description |
|---|---|---|---|
| `action` | string | Yes | `write`, `improve`, `summarize`, `shorten`, `expand`, `format`, `fix_grammar` or `custom` |
| `content` | string | Depends | Text to transform. Required for every action except `write` and `custom`. |
| `prompt` | string | Depends | Instruction for `write` and `custom` (either `prompt` or `content` must be set) |
| `tone` | string | No | Tone hint added to the system prompt |
| `context` | object | No | `task_title` and `board_title` to give the model context |

**Example Request**

```bash
curl -X POST "https://yourdomain.com/wp-json/fluent-boards/v2/ai/generate" \
  -u "USERNAME:APPLICATION_PASSWORD" \
  -H "Content-Type: application/json" \
  -d '{
    "action": "improve",
    "content": "fix login bug users cant login on safari",
    "tone": "professional",
    "context": { "task_title": "Login bug", "board_title": "Website" }
  }'
```

**Example Response**

```json
{
  "content": "## Problem\n\nUsers cannot log in when using Safari.\n\n## Next steps\n\n- [ ] Reproduce on Safari 17\n- [ ] Check cookie settings"
}
```

## Task AI Assist

Runs an AI action on a task, using its title, board name and description. `summarize` also includes up to the 30 most recent comments.

```http
POST /wp-json/fluent-boards/v2/projects/{board_id}/tasks/{task_id}/ai-assist
```

**Parameters**

| Parameter | Type | Required | Description |
|---|---|---|---|
| `action` | string | Yes | `summarize`, `subtasks` or `suggestions` |
| `labels` | array | No | For `suggestions`: label titles the model may choose from |

**Example Request**

```bash
curl -X POST "https://yourdomain.com/wp-json/fluent-boards/v2/projects/1/tasks/42/ai-assist" \
  -u "USERNAME:APPLICATION_PASSWORD" \
  -H "Content-Type: application/json" \
  -d '{"action": "suggestions", "labels": ["Bug", "Feature", "Docs"]}'
```

**Example Responses**

`summarize`:

```json
{
  "type": "summary",
  "content": "**TL;DR:** Safari users cannot log in because the session cookie is rejected..."
}
```

`subtasks`:

```json
{
  "type": "subtasks",
  "items": ["Reproduce the bug on Safari", "Check SameSite cookie attribute", "Add regression test"]
}
```

`suggestions`:

```json
{
  "type": "suggestions",
  "labels": ["Bug"],
  "priority": "high"
}
```

Returns `404` when the task is not on the board and `422` for an unknown `action`. The endpoint only returns suggestions; use [Apply Suggestions](#apply-ai-suggestions) or the regular task endpoints to save them.

## Apply AI Suggestions

Adds labels and/or sets the priority of a task in one transaction.

```http
POST /wp-json/fluent-boards/v2/projects/{board_id}/tasks/{task_id}/ai-apply-suggestions
```

**Parameters**

| Parameter | Type | Required | Description |
|---|---|---|---|
| `label_ids` | array | Depends | Board label IDs to add to the task |
| `priority` | string | Depends | `urgent`, `high`, `medium` or `low` |

At least one of `label_ids` or `priority` is required.

**Example Request**

```bash
curl -X POST "https://yourdomain.com/wp-json/fluent-boards/v2/projects/1/tasks/42/ai-apply-suggestions" \
  -u "USERNAME:APPLICATION_PASSWORD" \
  -H "Content-Type: application/json" \
  -d '{"label_ids": [9], "priority": "high"}'
```

**Example Response**

```json
{
  "task": {
    "id": 42,
    "title": "Login bug",
    "priority": "high",
    "labels": [ { "id": 9, "title": "Bug", "bg_color": "#e11d48" } ]
  },
  "labels": [ { "id": 9, "title": "Bug", "bg_color": "#e11d48" } ],
  "priority": "high",
  "message": "Suggestions applied."
}
```

Returns `422` for an invalid priority or an empty request (`Nothing to apply.`), and `404` when the task is not on the board.

See [Common Error Responses](/rest-api/shared/error-responses) for standard error formats.
