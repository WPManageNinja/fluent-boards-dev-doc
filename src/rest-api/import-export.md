# Import & Export

Import boards from a FluentBoards JSON export, Trello, Asana or a CSV file. Plugin source: free (FluentBoards JSON import under `/fluent-boards-import/*`) and Pro (Trello, Asana, CSV, and the un-prefixed JSON import routes).

All import endpoints require a WordPress administrator or a FluentBoards admin.

::: warning Exports are not REST endpoints
Board export (CSV or JSON) and timesheet export are served by Fluent Boards Pro over `admin-ajax.php`, not the REST API. See [Exports (admin-ajax)](#exports-admin-ajax).
:::

## Endpoints

| Method | Endpoint | Description |
|---|---|---|
| POST | `/fluent-boards-import/import-file` | Import a FluentBoards JSON file in one request |
| POST | `/fluent-boards-import/upload-json-chunk` | Upload one chunk of a large JSON file |
| POST | `/fluent-boards-import/process-json-import` | Create the board and import tasks page by page |
| POST | `/import-file` | Import a FluentBoards, Trello or Asana JSON file (Pro) |
| POST | `/upload-json-chunk` | Upload one chunk of a JSON file (Pro) |
| POST | `/process-json-import` | Process a chunked JSON upload (Pro) |
| POST | `/trello-boards` | List Trello boards for an API key and token (Pro) |
| POST | `/import-trello-board` | Start a background Trello import (Pro) |
| POST | `/trello-import-status` | Poll a Trello import (Pro) |
| POST | `/asana-workspaces` | List Asana workspaces (Pro) |
| POST | `/asana-projects` | List projects in an Asana workspace (Pro) |
| POST | `/import-asana-project` | Import an Asana project through the API (Pro) |
| POST | `/csv-upload` | Upload a CSV and get a column map (Pro) |
| POST | `/import-csv` | Import CSV rows page by page (Pro) |

## FluentBoards JSON import

A FluentBoards export is a JSON object with a `key` containing `FluentBoards` and a `board` object (with `tasks`). Two flows are available:

1. **Small files:** send the whole file to `import-file`.
2. **Large files:** split the file into chunks, send each to `upload-json-chunk` with the same `uploadId`, then call `process-json-import` with the returned `filePath` until `has_more` is `false`.

The maximum file size is 64 MB (filter `fluent_boards/import_max_file_size`).

The free routes live under `/fluent-boards-import/` and only accept `importFrom=FluentBoards`. With Pro active, the un-prefixed routes (`/import-file`, `/upload-json-chunk`, `/process-json-import`) take the same parameters and also accept `importFrom=Trello` or `importFrom=Asana` (JSON exports from those tools).

## Import JSON File

Imports a complete JSON export in one request.

```http
POST /wp-json/fluent-boards/v2/fluent-boards-import/import-file
```

**Parameters** (multipart form)

| Parameter | Type | Required | Description |
|---|---|---|---|
| `file` | file | Yes | `.json` file |
| `importFrom` | string | Yes | `FluentBoards` (Pro route also: `Trello`, `Asana`) |

**Example Request**

```bash
curl -X POST "https://yourdomain.com/wp-json/fluent-boards/v2/fluent-boards-import/import-file" \
  -u "USERNAME:APPLICATION_PASSWORD" \
  -F "importFrom=FluentBoards" \
  -F "file=@/path/to/board-export.json"
```

**Example Response**

```json
{
  "message": "Processed and Imported successfully",
  "board_id": 12,
  "success": true
}
```

Errors return `422` with a `message`, for example `Only .json import files are allowed.` or `Invalid JSON.`

## Upload JSON Chunk

Appends one chunk to a staged import file (stored outside the public uploads directory).

```http
POST /wp-json/fluent-boards/v2/fluent-boards-import/upload-json-chunk
```

**Parameters** (multipart form)

| Parameter | Type | Required | Description |
|---|---|---|---|
| `chunk` | file | Yes | The chunk bytes |
| `chunkIndex` | integer | Yes | Zero-based chunk index |
| `totalChunks` | integer | Yes | Number of chunks |
| `uploadId` | string | Yes | Unique ID for this upload session (same for every chunk) |

**Example Request**

```bash
curl -X POST "https://yourdomain.com/wp-json/fluent-boards/v2/fluent-boards-import/upload-json-chunk" \
  -u "USERNAME:APPLICATION_PASSWORD" \
  -F "chunk=@/tmp/export.part0" \
  -F "chunkIndex=0" \
  -F "totalChunks=3" \
  -F "uploadId=upload_1759400000"
```

**Example Response**

```json
{
  "chunkIndex": 0,
  "isComplete": false,
  "filePath": "upload_1759400000.json"
}
```

`filePath` is a file name only; pass it to [Process JSON Import](#process-json-import).

## Process JSON Import

On page 1, reads the uploaded file, creates the board (stages, labels, members, custom fields), stages the tasks in batches of 200 and imports the first batch. Each later page imports one more batch. Call it with `importing_page` = 1, 2, 3… until `has_more` is `false`.

```http
POST /wp-json/fluent-boards/v2/fluent-boards-import/process-json-import
```

**Parameters**

| Parameter | Type | Required | Description |
|---|---|---|---|
| `importing_page` | integer | No | Page number, default `1` |
| `filePath` | string | Page 1 | `filePath` from the last chunk upload |
| `importFrom` | string | Page 1 | `FluentBoards` (Pro route also: `Trello`, `Asana`) |
| `folder_id` | integer | No | Page 1, free route: add the new board to this folder |
| `board_id` | integer | Page 2+ | `board_id` returned by page 1 |

**Example Request**

```bash
curl -X POST "https://yourdomain.com/wp-json/fluent-boards/v2/fluent-boards-import/process-json-import" \
  -u "USERNAME:APPLICATION_PASSWORD" \
  -H "Content-Type: application/json" \
  -d '{"importing_page": 1, "filePath": "upload_1759400000.json", "importFrom": "FluentBoards"}'
```

**Example Response**

```json
{
  "total": 450,
  "completed": 200,
  "total_page": 3,
  "has_more": true,
  "last_page": 1,
  "board_id": 12,
  "message": "Processing..."
}
```

Trello and Asana files (Pro route) are imported in one pass and return `{"message": "Imported successfully", "board_id": 12, "has_more": false}`.

## List Trello Boards <Badge type="tip" text="Pro" />

Lists the open boards of the Trello account behind the API key and token.

```http
POST /wp-json/fluent-boards/v2/trello-boards
```

**Parameters**

| Parameter | Type | Required | Description |
|---|---|---|---|
| `api_key` | string | Yes | Trello API key |
| `token` | string | Yes | Trello token |

**Example Request**

```bash
curl -X POST "https://yourdomain.com/wp-json/fluent-boards/v2/trello-boards" \
  -u "USERNAME:APPLICATION_PASSWORD" \
  -H "Content-Type: application/json" \
  -d '{"api_key": "TRELLO_KEY", "token": "TRELLO_TOKEN"}'
```

**Example Response**

```json
{
  "boards": [
    { "id": "5f1a2b3c4d5e6f7a8b9c0d1e", "name": "Product Launch", "url": "https://trello.com/b/AbCdEf/product-launch", "closed": false }
  ]
}
```

## Import Trello Board <Badge type="tip" text="Pro" />

Starts a background import through Action Scheduler and returns the import session.

```http
POST /wp-json/fluent-boards/v2/import-trello-board
```

**Parameters**

| Parameter | Type | Required | Description |
|---|---|---|---|
| `api_key` | string | Yes | Trello API key |
| `token` | string | Yes | Trello token |
| `trello_board_id` | string | Yes | Trello board ID from [List Trello Boards](#list-trello-boards) |
| `import_users` | boolean | No | Also import Trello members |

**Example Request**

```bash
curl -X POST "https://yourdomain.com/wp-json/fluent-boards/v2/import-trello-board" \
  -u "USERNAME:APPLICATION_PASSWORD" \
  -H "Content-Type: application/json" \
  -d '{"api_key": "TRELLO_KEY", "token": "TRELLO_TOKEN", "trello_board_id": "5f1a2b3c4d5e6f7a8b9c0d1e", "import_users": true}'
```

**Example Response**

```json
{
  "message": "Trello import started.",
  "import": {
    "import_id": "0b6f1c1e-2d1a-4a43-9a0e-6b0d2f9a1c11",
    "status": "queued",
    "phase": "queued",
    "percentage": 0,
    "completed": 0,
    "total": 0,
    "board_id": null,
    "message": "Preparing Trello import..."
  }
}
```

## Get Trello Import Status <Badge type="tip" text="Pro" />

Returns the current state of an import started by the same user. Poll until `status` is `completed` or `failed`.

```http
POST /wp-json/fluent-boards/v2/trello-import-status
```

**Parameters**

| Parameter | Type | Required | Description |
|---|---|---|---|
| `import_id` | string | Yes | `import.import_id` from [Import Trello Board](#import-trello-board) |

**Example Request**

```bash
curl -X POST "https://yourdomain.com/wp-json/fluent-boards/v2/trello-import-status" \
  -u "USERNAME:APPLICATION_PASSWORD" \
  -H "Content-Type: application/json" \
  -d '{"import_id": "0b6f1c1e-2d1a-4a43-9a0e-6b0d2f9a1c11"}'
```

**Example Response**

```json
{
  "import": {
    "import_id": "0b6f1c1e-2d1a-4a43-9a0e-6b0d2f9a1c11",
    "status": "completed",
    "phase": "completed",
    "percentage": 100,
    "completed": 84,
    "total": 84,
    "board_id": 13,
    "message": "Board imported successfully from Trello"
  }
}
```

## List Asana Workspaces <Badge type="tip" text="Pro" />

```http
POST /wp-json/fluent-boards/v2/asana-workspaces
```

**Parameters**

| Parameter | Type | Required | Description |
|---|---|---|---|
| `pat` | string | Yes | Asana personal access token |

**Example Request**

```bash
curl -X POST "https://yourdomain.com/wp-json/fluent-boards/v2/asana-workspaces" \
  -u "USERNAME:APPLICATION_PASSWORD" \
  -H "Content-Type: application/json" \
  -d '{"pat": "ASANA_PAT"}'
```

**Example Response**

```json
{
  "workspaces": [
    { "gid": "1201234567890", "name": "Acme Inc", "resource_type": "workspace" }
  ]
}
```

## List Asana Projects <Badge type="tip" text="Pro" />

Lists non-archived projects in a workspace (all pages).

```http
POST /wp-json/fluent-boards/v2/asana-projects
```

**Parameters**

| Parameter | Type | Required | Description |
|---|---|---|---|
| `pat` | string | Yes | Asana personal access token |
| `workspace_gid` | string | Yes | Workspace GID |

**Example Request**

```bash
curl -X POST "https://yourdomain.com/wp-json/fluent-boards/v2/asana-projects" \
  -u "USERNAME:APPLICATION_PASSWORD" \
  -H "Content-Type: application/json" \
  -d '{"pat": "ASANA_PAT", "workspace_gid": "1201234567890"}'
```

**Example Response**

```json
{
  "projects": [
    { "gid": "1209876543210", "name": "Q4 Launch", "permalink_url": "https://app.asana.com/0/1209876543210" }
  ]
}
```

## Import Asana Project <Badge type="tip" text="Pro" />

Fetches the project (tasks, subtasks, tags, sections) from Asana and creates a board in one request.

```http
POST /wp-json/fluent-boards/v2/import-asana-project
```

**Parameters**

| Parameter | Type | Required | Description |
|---|---|---|---|
| `pat` | string | Yes | Asana personal access token |
| `project_gid` | string | Yes | Project GID |
| `folder_id` | integer | No | Add the new board to this folder |

**Example Request**

```bash
curl -X POST "https://yourdomain.com/wp-json/fluent-boards/v2/import-asana-project" \
  -u "USERNAME:APPLICATION_PASSWORD" \
  -H "Content-Type: application/json" \
  -d '{"pat": "ASANA_PAT", "project_gid": "1209876543210"}'
```

**Example Response**

```json
{
  "message": "Project imported successfully from Asana",
  "board_id": 14
}
```

## Upload CSV <Badge type="tip" text="Pro" />

Stores the CSV file and returns its headers with a suggested map to task columns.

```http
POST /wp-json/fluent-boards/v2/csv-upload
```

**Parameters** (multipart form)

| Parameter | Type | Required | Description |
|---|---|---|---|
| `file` | file | Yes | CSV file |
| `delimiter` | string | No | `comma` (default) or `semicolon` (any other value is treated as `;`) |

**Example Request**

```bash
curl -X POST "https://yourdomain.com/wp-json/fluent-boards/v2/csv-upload" \
  -u "USERNAME:APPLICATION_PASSWORD" \
  -F "delimiter=comma" \
  -F "file=@/path/to/tasks.csv"
```

**Example Response**

```json
{
  "file": "fluent-boards-1759400000-tasks.csv",
  "headers": ["Task Title", "Stage", "Priority", "Due Date"],
  "fields": {
    "task_title": "Task Title",
    "slug": "Slug",
    "board_title": "Board Title",
    "status": "Status",
    "type": "Type",
    "description": "Description",
    "priority": "Priority",
    "due_at": "Due Date",
    "started_at": "Start Date",
    "archived_at": "Archive Date",
    "stage": "Stage",
    "board": "Board",
    "source": "Source",
    "position": "Position",
    "subtasks": "Subtasks",
    "completion": "Completion"
  },
  "columns": ["task_title", "slug", "board_title", "status", "type", "description", "priority", "due_at", "started_at", "archived_at", "stage", "board", "source", "position", "subtasks", "completion"],
  "map": [
    { "csv": "Task Title", "table": "task_title" },
    { "csv": "Stage", "table": "stage" },
    { "csv": "Priority", "table": "priority" },
    { "csv": "Due Date", "table": null }
  ]
}
```

Headers that match a column key (case-insensitive, spaces as underscores) are pre-mapped; the rest have `table: null`. `columns` can be changed with the `fluent_boards/task_table_columns` filter. A CSV with duplicate header names is rejected.

## Import CSV <Badge type="tip" text="Pro" />

Imports 100 rows per call. Page 1 creates a new board (named `{board_title} (imported)` from the first row's `board_title`) unless `board_id` is given; send the returned `board_id` with each later page until `has_more` is `false`.

```http
POST /wp-json/fluent-boards/v2/import-csv
```

**Parameters**

| Parameter | Type | Required | Description |
|---|---|---|---|
| `file` | string | Yes | `file` returned by [Upload CSV](#upload-csv) |
| `map` | array | Yes | `[{ "csv": "Header", "table": "column" }]`; rows with `table: null` are skipped |
| `delimiter` | string | No | `comma` (default) or `semicolon` |
| `importing_page` | integer | No | Default `1` |
| `board_id` | integer | No | Import into this board (required on page 2+) |

**Example Request**

```bash
curl -X POST "https://yourdomain.com/wp-json/fluent-boards/v2/import-csv" \
  -u "USERNAME:APPLICATION_PASSWORD" \
  -H "Content-Type: application/json" \
  -d '{
    "file": "fluent-boards-1759400000-tasks.csv",
    "delimiter": "comma",
    "importing_page": 1,
    "map": [
      { "csv": "Task Title", "table": "task_title" },
      { "csv": "Stage", "table": "stage" },
      { "csv": "Priority", "table": "priority" }
    ]
  }'
```

**Example Response**

```json
{
  "total": 240,
  "completed": 100,
  "total_page": 3,
  "has_more": true,
  "last_page": 1,
  "offset": 0,
  "board_id": 15,
  "message": "Board has been imported successfully"
}
```

`completed` is the number of rows imported by this call. The uploaded file is deleted after the last page.

## Exports (admin-ajax)

Fluent Boards Pro streams exports from `wp-admin/admin-ajax.php`. These are not REST routes: they use cookie authentication (a logged-in browser session), not Application Passwords.

| `action` | Method | Parameters | Who | Output |
|---|---|---|---|---|
| `fluent_boards_export_json` | POST | `board_id`, `_wpnonce` (the `wp_rest` nonce) | Board manager | JSON file that [Import JSON File](#import-json-file) accepts |
| `fluent_boards_export_csv` | POST | `board_id`, `_wpnonce` | Board manager | CSV file of the board's tasks |
| `fluent_boards_export_timesheet` | GET | `board_id`, `date_range[]` (start, end) | Board manager | CSV of committed time entries |

Board exports send `Content-Disposition: attachment` and an `X-FBS-Export-Task-Count` header.

```js
// From a logged-in admin page (window.fluentAddonVars is set by FluentBoards)
const response = await fetch(window.fluentAddonVars.ajaxurl, {
  method: 'POST',
  credentials: 'same-origin',
  body: new URLSearchParams({
    action: 'fluent_boards_export_json',
    board_id: 12,
    _wpnonce: window.fluentAddonVars.rest.nonce
  })
});
const blob = await response.blob();
```

See [Common Error Responses](/rest-api/shared/error-responses) for standard error formats.
