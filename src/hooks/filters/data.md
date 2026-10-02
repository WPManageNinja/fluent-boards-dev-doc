# Data & Upload Filter Hooks

<Badge type="tip" vertical="top" text="FluentBoards Core" /> <Badge type="warning" vertical="top" text="Intermediate" />

Filter hooks that change board and task data, permissions, incoming webhooks, file uploads, imports and selector options. See the [Filter Hooks overview](./index.md) for every filter grouped by area.

Hooks marked <Badge type="tip" text="Pro" /> run only when FluentBoards Pro is active. Source paths are relative to the plugin root. Paths that start with `fluent-boards-pro/` are in the Pro plugin. Every filter must **return** the value it receives (modified or not).

## Boards & Tasks

<explain-block title="fluent_boards/board_find">

Filters the board model before it is returned by the single-board endpoint. That endpoint loads a board, and also returns the board after its properties are updated. Core uses this filter to attach the board's folder.

**Parameters**
- `$board` `\FluentBoards\App\Models\Board`: the board, with its relations loaded for the board view

**Default:** the loaded board

**Usage**
```php
add_filter('fluent_boards/board_find', function ($board) {
    $board->my_extra = 'value';
    return $board;
}, 10, 1);
```

**Source:** `app/Http/Controllers/BoardController.php`

</explain-block>

<explain-block title="fluent_boards/before_create_board">

Filters the attribute array right before a board row is created. Callers: normal board creation, board duplication, and (Pro) creating a board from a template.

**Parameters**
- `$boardData` `array`: the board attributes. On normal creation the keys are `title`, `type` (default `'to-do'`), `description`, `currency` (default `'USD'`), `background` and `created_by`. Duplication and template creation pass the attributes they copy.

**Default:** the prepared attribute array

**Usage**
```php
add_filter('fluent_boards/before_create_board', function ($boardData) {
    $boardData['currency'] = 'EUR';
    return $boardData;
}, 10, 1);
```

**Source:** `app/Services/BoardService.php`, `fluent-boards-pro/app/Services/TemplateService.php`

</explain-block>

<explain-block title="fluent_boards/before_task_create">

Filters the task attribute array in `Task::createTask()`, right before the task row is created. Callers: the board UI and REST API (through `TaskService`), Fluent Forms, the FluentCRM "create task" action and Pro incoming webhooks.

**Parameters**
- `$data` `array`: task attributes such as `title`, `board_id`, `stage_id`, `description`, `priority`, `due_at`, `started_at`, `crm_contact_id`, and optionally `assignees` (user IDs) and `labels` (label IDs)

**Default:** the attribute array prepared by the caller. If you remove `priority`, it is reset to `''` (no priority).

**Usage**
```php
add_filter('fluent_boards/before_task_create', function ($data) {
    if (empty($data['priority'])) {
        $data['priority'] = 'medium';
    }
    return $data;
}, 10, 1);
```

**Source:** `app/Models/Task.php`

</explain-block>

<explain-block title="fluent_boards/can_create_board">

Filters whether a user may create boards. It runs on every outcome of the board-creation permission check.

**Parameters**
- `$canCreate` `bool`: the computed permission
- `$userId` `int`: the user being checked

**Default:** `true` for FluentBoards admins. Also `true` when the "allow members to create boards" setting is on and the user has access to at least one board. `false` otherwise.

**Usage**
```php
add_filter('fluent_boards/can_create_board', function ($canCreate, $userId) {
    return $canCreate || user_can($userId, 'edit_others_posts');
}, 10, 2);
```

**Source:** `app/Services/PermissionManager.php`

</explain-block>

<explain-block title="fluent_boards/task_priorities">

Filters the list of task priorities. The list feeds the UI (admin app, Pro single-board shortcode, Fluent Forms feed) and validation (task updates, the PHP API, MCP tools and Pro incoming webhooks). Keys you add become valid priority values.

**Parameters**
- `$priorities` `array`: priority key ⇒ label

**Default:**
```php
[
    ''       => 'No priority',
    'urgent' => 'Urgent',
    'high'   => 'High',
    'medium' => 'Medium',
    'low'    => 'Low',
]
```

**Usage**
```php
add_filter('fluent_boards/task_priorities', function ($priorities) {
    $priorities['critical'] = __('Critical', 'my-plugin');
    return $priorities;
}, 10, 1);
```

**Source:** `app/Hooks/Handlers/AdminMenuHandler.php`, `app/Hooks/Handlers/ShortcodeHandler.php`, `app/Services/TaskService.php`, `app/Api/Classes/Tasks.php`, `app/Modules/MCP/Tools/TaskTools.php`, `app/Services/Intergrations/FluentFormIntegration/Bootstrap.php`, `fluent-boards-pro/app/Hooks/Handlers/ExternalPages.php`

</explain-block>

<explain-block title="fluent_boards/task_reminder_types">

Filters the allowed task reminder types. A reminder type that is not in this list is saved as `null`.

**Parameters**
- `$types` `array`: reminder key ⇒ label

**Default:** `30_minutes_before`, `1_hour_before`, `2_hours_before`, `1_day_before`, `2_days_before`, `1_week_before`

**Usage**
```php
add_filter('fluent_boards/task_reminder_types', function ($types) {
    unset($types['30_minutes_before']);
    return $types;
}, 10, 1);
```

**Source:** `app/Services/Helper.php`

</explain-block>

<explain-block title="fluent_boards/true_false_convert">

Filters the lookup map used by `fluent_boards_string_to_bool()` to turn request strings into booleans.

**Parameters**
- `$map` `array`: input value ⇒ `bool`

**Default:** `'yes'`, `'true'`, `'1'` ⇒ `true`. `'no'`, `'false'`, `'0'` ⇒ `false`. Boolean `true` and `false` map to themselves.

**Usage**
```php
add_filter('fluent_boards/true_false_convert', function ($map) {
    $map['on']  = true;
    $map['off'] = false;
    return $map;
}, 10, 1);
```

**Source:** `app/Functions/helpers.php`

</explain-block>

## Incoming Webhooks

<explain-block title="fluent_boards/incoming_webhook_data">
<Badge type="tip" text="Pro" />

Filters the raw request data of an incoming webhook, before a task is created from it.

**Parameters**
- `$postData` `array`: the incoming request data
- `$webhook` `\FluentBoards\App\Models\Webhook`: the matched incoming webhook

**Default:** the request data as received

**Usage**
```php
add_filter('fluent_boards/incoming_webhook_data', function ($postData, $webhook) {
    if (empty($postData['title']) && !empty($postData['subject'])) {
        $postData['title'] = $postData['subject'];
    }
    return $postData;
}, 10, 2);
```

**Source:** `fluent-boards-pro/app/Hooks/Handlers/ExternalPages.php`

</explain-block>

<explain-block title="fluent_boards/webhook_task_data">
<Badge type="tip" text="Pro" />

Filters the mapped task data built from an incoming webhook, right before the task is created.

**Parameters**
- `$data` `array`: the task data, including `board_id` and `stage_id` from the webhook settings
- `$verifiedWebhook` `\FluentBoards\App\Models\Webhook`: the verified incoming webhook

**Default:** the mapped task data

**Note:** You can enrich the data, but you cannot change the target board or stage. `board_id` and `stage_id` are reset to the webhook's values after the filter runs.

**Usage**
```php
add_filter('fluent_boards/webhook_task_data', function ($data, $verifiedWebhook) {
    $data['priority'] = 'high';
    return $data;
}, 10, 2);
```

**Source:** `fluent-boards-pro/app/Hooks/Handlers/ExternalPages.php`

</explain-block>

## Uploads & Files

<explain-block title="fluent_boards/upload_file_size_limit">

Filters the maximum upload size for task attachments and media, in bytes. The value is also passed to the app as `file_upload_limit`.

**Parameters**
- `$bytes` `int`: the size limit

**Default:** `104857600` (100 MB)

**Usage**
```php
add_filter('fluent_boards/upload_file_size_limit', function ($bytes) {
    return 20 * 1024 * 1024; // 20 MB
}, 10, 1);
```

**Source:** `app/Services/UploadService.php`

</explain-block>

<explain-block title="fluent_boards/upload_allowed_mimes">

Filters the allowed upload types as an extension ⇒ MIME map (`'jpg|jpeg|jpe' => 'image/jpeg'` style).

**Parameters**
- `$map` `array`: extension pattern ⇒ MIME type

**Default:** WordPress `get_allowed_mime_types()` plus `json`, `md`/`markdown`, `csv`, `txt`, `log`, `xml`, `yaml`/`yml`, `webp`, `avif`, `heic`, `zip`, `rar`, `7z`, `tar`, `gz`/`gzip`

**Note:** After the filter runs, executable and browser-active extensions are always removed, so you cannot allow them: `php*`, `phtml`, `phar`, `html`, `htm`, `shtml`, `xhtml`, `xht`, `js`, `mjs`, `svg`, `svgz`, `xml`, `xsl`, `xslt`, `swf`, `htaccess`.

**Usage**
```php
add_filter('fluent_boards/upload_allowed_mimes', function ($map) {
    $map['dwg'] = 'image/vnd.dwg';
    return $map;
}, 10, 1);
```

**Source:** `app/Services/UploadService.php`

</explain-block>

<explain-block title="fluent_boards/upload_folder_name">

Filters the FluentBoards upload folder name, relative to the WordPress uploads directory. Board files are stored in `board_{id}` subfolders. The value is also used for the upload-protection check and its admin notice.

**Parameters**
- `$folder` `string`: the folder name

**Default:** `'fluent-boards'` (the `FLUENT_BOARDS_UPLOAD_DIR` constant)

**Note:** Changing this on a site that already has uploads does not move existing files.

**Usage**
```php
add_filter('fluent_boards/upload_folder_name', function ($folder) {
    return 'project-files';
}, 10, 1);
```

**Source:** `app/Services/Libs/FileSystem.php`, `app/Services/AttachmentFileService.php`, `app/Hooks/actions.php`

</explain-block>

<explain-block title="fluent_boards/uploaded_file_name_prefix">

Filters the prefix added to the name of every stored upload. This applies to regular uploads, and in Pro also to chunked attachment uploads.

**Parameters**
- `$prefix` `string`: the prefix

**Default:** a random UUID v4 followed by a hyphen, from `wp_generate_uuid4() . '-'`

**Note:** The random prefix makes upload URLs hard to guess. If you return an empty or predictable prefix, files become easier to find.

**Usage**
```php
add_filter('fluent_boards/uploaded_file_name_prefix', function ($prefix) {
    return gmdate('Ymd') . '-' . $prefix;
}, 10, 1);
```

**Source:** `app/Services/Libs/FileSystem.php`, `fluent-boards-pro/app/Http/Controllers/AttachmentController.php`

</explain-block>

<explain-block title="fluent_boards/upload_media_data">
<Badge type="tip" text="Pro" />

Filters the storage data of an uploaded (non-URL) task attachment before it is saved. Use it to offload files to another storage driver.

**Parameters**
- `$data` `array`: `type`, `driver` (default `'local'`), `file_path` (absolute path), `full_url`, `settings` (default `''`)
- `$file` `array|object`: the uploaded file

**Default:** the local storage data shown above

**Usage**
```php
add_filter('fluent_boards/upload_media_data', function ($data, $file) {
    // Upload $data['file_path'] to remote storage, then:
    // $data['driver'] = 's3';
    // $data['full_url'] = $remoteUrl;
    return $data;
}, 10, 2);
```

**Source:** `fluent-boards-pro/app/Services/AttachmentService.php`

</explain-block>

## Import & Templates

<explain-block title="fluent_boards/import_max_file_size">

Filters the maximum size of a board import file, in bytes. It applies to the free JSON import and the Pro importers, and to both the total file and the combined chunked uploads.

**Parameters**
- `$bytes` `int`: the size limit

**Default:** `67108864` (64 MB)

**Usage**
```php
add_filter('fluent_boards/import_max_file_size', function ($bytes) {
    return 128 * 1024 * 1024;
}, 10, 1);
```

**Source:** `app/Services/JsonImportService.php`, `fluent-boards-pro/app/Http/Controllers/ImportController.php`

</explain-block>

<explain-block title="fluent_boards_csv_mimes">

Filters the MIME types accepted for CSV board imports. The name uses an underscore, not the `fluent_boards/` prefix.

**Parameters**
- `$mimes` `string[]`: accepted MIME types

**Default:** `text/csv`, `text/plain`, `application/csv`, `text/comma-separated-values`, `application/excel`, `application/vnd.ms-excel`, `application/vnd.msexcel`, `text/anytext`, `application/octet-stream`, `application/txt`

**Usage**
```php
add_filter('fluent_boards_csv_mimes', function ($mimes) {
    $mimes[] = 'text/x-csv';
    return $mimes;
}, 10, 1);
```

**Source:** `app/Functions/helpers.php`

</explain-block>

<explain-block title="fluent_boards/task_table_columns">
<Badge type="tip" text="Pro" />

Filters the list of task columns offered as mapping targets in the CSV import screen.

**Parameters**
- `$columns` `string[]`: task column keys

**Default:** the keys of `Task::mappables()`

**Note:** The automatic header-to-column suggestions are computed from the default list before this filter runs. Columns you add can be chosen manually but are not auto-matched.

**Usage**
```php
add_filter('fluent_boards/task_table_columns', function ($columns) {
    return $columns;
}, 10, 1);
```

**Source:** `fluent-boards-pro/app/Http/Controllers/CsvController.php`

</explain-block>

<explain-block title="fluent_boards/default_templates_remote_url">
<Badge type="tip" text="Pro" />

Filters the remote endpoint that lists the built-in board templates. Return an empty value to turn off remote templates.

**Parameters**
- `$url` `string`: the endpoint URL

**Default:** the `TemplateService::REMOTE_TEMPLATES_URL` constant

**Usage**
```php
add_filter('fluent_boards/default_templates_remote_url', function ($url) {
    return 'https://staging.example.com/wp-json/wp/v2/board-templates';
}, 10, 1);
```

**Source:** `fluent-boards-pro/app/Services/TemplateService.php`

</explain-block>

## Selector Options

<explain-block title="fluent_boards/ajax_options_{option_key}">

A dynamic filter that supplies options for the app's remote select fields (`GET /wp-json/fluent-boards/v2/ajax-options?option_key=...`). Any `option_key` that core does not handle directly falls through to `fluent_boards/ajax_options_{option_key}`, so you can add your own option sources.

Core registers listeners for `ajax_options_non_board_wordpress_users` and `ajax_options_crm_contacts`. A listener also exists for `ajax_options_task_assignees`, but that key is handled before the filter runs, so the listener is never reached.

**Parameters**
- `$options` `array`: the options list, starting empty
- `$search` `string`: the search term
- `$includedIds` `array|mixed`: IDs that must be included (the request `values`, used to preload selected items)

**Default:** `[]`

**Note:** The route is open to any user with board access. Do your own capability checks inside the callback.

**Usage**
```php
add_filter('fluent_boards/ajax_options_my_clients', function ($options, $search, $includedIds) {
    if (!current_user_can('edit_posts')) {
        return $options;
    }
    // Return items shaped like the core selectors: ['id' => ..., 'title' => ...]
    return [
        ['id' => 1, 'title' => 'Client A'],
    ];
}, 10, 3);
```

**Source:** `app/Http/Controllers/OptionsController.php`

</explain-block>
