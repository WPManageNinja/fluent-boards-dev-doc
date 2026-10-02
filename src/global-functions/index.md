---
pageClass: global-functions
---

# Global Functions

<Badge type="tip" vertical="top" text="FluentBoards Core" />

FluentBoards defines a small set of global PHP functions in `app/Functions/helpers.php`. They are loaded when the plugin boots, so they are available to any add-on code that runs on or after `plugins_loaded`. FluentBoards Pro does not add any global functions.

Always guard your code in case FluentBoards is not active:

```php
if (function_exists('FluentBoardsApi')) {
    $boards = FluentBoardsApi('boards')->getBoards();
}
```

[[toc]]

## Quick reference

| Function | Returns | Purpose |
|---|---|---|
| [`fluentBoards()`](#fluentboards) | `Application` or a bound service | Access the plugin's app container |
| [`FluentBoardsApi()`](#fluentboardsapi) | `FBSApi` proxy or the `Api` registry | Entry point to the PHP API (boards, stages, tasks) |
| [`fluentBoardsDb()`](#fluentboardsdb) | Query builder / DB connection | Run raw queries against FluentBoards tables |
| [`fluent_boards_get_option()`](#fluent-boards-get-option) | `mixed` | Read a FluentBoards option |
| [`fluent_boards_update_option()`](#fluent-boards-update-option) | `Meta` model | Create or update a FluentBoards option |
| [`fluent_boards_get_pref_settings()`](#fluent-boards-get-pref-settings) | `array` | Module preferences (time tracking, frontend portal, menu, recurring tasks) |
| [`fluent_boards_get_features_config()`](#fluent-boards-get-features-config) | `array` | Feature flags (cloud storage) |
| [`fluent_boards_page_url()`](#fluent-boards-page-url) | `string` | Base URL of the FluentBoards app |
| [`fluent_boards_user_avatar()`](#fluent-boards-user-avatar) | `string` | Avatar URL for an email address |
| [`fluent_boards_site_logo()`](#fluent-boards-site-logo) | `string` | Site logo URL used in emails |
| [`fluent_boards_sanitize_description()`](#fluent-boards-sanitize-description) | `string` | Sanitize Markdown/HTML task descriptions |
| [`fluent_boards_string_to_bool()`](#fluent-boards-string-to-bool) | `bool` or original value | Convert `'yes'`/`'no'`/`'1'`/`'0'` style values |
| [`fluent_boards_is_rtl()`](#fluent-boards-is-rtl) | `bool` | Whether the UI renders right-to-left |
| [`FluentBoardsAssetUrl()`](#fluentboardsasseturl) | `string` | URL of the plugin `assets/` directory |
| [`fluent_boards_mix()`](#fluent-boards-mix) | `string` | Internal asset URL helper |
| [`fluentboardsCsvMimes()`](#fluentboardscsvmimes) | `array` | MIME types accepted for CSV import |
| [`fluent_boards_get_upgrade_url()`](#fluent-boards-get-upgrade-url) | `string` | Upgrade-to-Pro URL with UTM parameters |
| [`fbsGetOption()`, `fbsUpdateOption()`, `fbsGetFeaturesConfig()`](#deprecated-functions) | — | Deprecated aliases |

## App and API access

### fluentBoards()

Returns the FluentBoards application container, or a service bound in it.

```php
fluentBoards($module = null)
```

**Parameters**
- `$module` (string|null): A container key such as `'db'`, `'api'`, `'url.assets'` or `'path.app'`. Omit it to get the container itself.

**Return**
- `FluentBoards\Framework\Foundation\Application` when `$module` is `null`, otherwise the resolved service or value.

**Example**
```php
$app       = fluentBoards();
$assetsUrl = fluentBoards('url.assets');
```

### FluentBoardsApi()

Entry point to the [PHP API classes](#php-api-classes).

```php
FluentBoardsApi($key = null)
```

**Parameters**
- `$key` (string|null): `'boards'`, `'stages'` or `'tasks'`. These keys are registered in `app/Api/config.php`.

**Return**
- With a key: a `FluentBoards\App\Api\FBSApi` proxy that forwards every method call to the matching class (`Boards`, `Stages` or `Tasks` in `FluentBoards\App\Api\Classes`).
- Without a key: the `FluentBoards\App\Api\Api` registry. Read a module from it as a property, for example `FluentBoardsApi()->boards`.
- An unknown key throws an `Exception` ("The 'x' doesn't exist in FluentBoardsApi.").

**Example**
```php
$tasksApi = FluentBoardsApi('tasks');
$task     = $tasksApi->getTask(42);

// Equivalent
$task = FluentBoardsApi()->tasks->getTask(42);
```

See [PHP API classes](#php-api-classes) for how errors and permissions behave.

### fluentBoardsDb()

Returns the database query builder bound to the container (`fluentBoards('db')`). Use it for queries that the models do not cover. Table names are passed without the WordPress prefix.

**Return**
- The WPFluent database connection / query builder. It is **not** the application instance.

**Example**
```php
$openCount = fluentBoardsDb()->table('fbs_tasks')
    ->where('board_id', 12)
    ->where('status', 'open')
    ->whereNull('archived_at')
    ->count();
```

## Options and settings

### fluent_boards_get_option()

Reads an option stored by FluentBoards. Options live in the `fbs_metas` table as rows with `object_type = 'option'`, not in `wp_options`.

```php
fluent_boards_get_option($key, $default = null)
```

**Parameters**
- `$key` (string): The option key.
- `$default` (mixed): Returned when the option does not exist. Default `null`.

**Return**
- `mixed`: The stored value (unserialized), or `$default`.

**Example**
```php
$features = fluent_boards_get_option('_fbs_features', []);
```

### fluent_boards_update_option()

Creates or updates an option row in `fbs_metas` (`object_type = 'option'`).

```php
fluent_boards_update_option($key, $value)
```

**Parameters**
- `$key` (string): The option key.
- `$value` (mixed): The value. Arrays are serialized automatically.

**Return**
- `FluentBoards\App\Models\Meta`: The saved meta row.

**Example**
```php
fluent_boards_update_option('my_addon_settings', ['enabled' => 'yes']);
```

### fluent_boards_get_pref_settings()

Returns module preferences. They are read from the WordPress option `fluent_boards_modules` and merged with the defaults below. The result is cached in a static variable for the request.

```php
fluent_boards_get_pref_settings($cached = true)
```

**Parameters**
- `$cached` (bool): Pass `false` to re-read the option. Default `true`.

**Return**
- `array` with these keys (defaults shown):

```php
[
    'timeTracking'   => ['enabled' => 'no', 'all_boards' => 'yes', 'selected_boards' => []],
    'frontend'       => ['enabled' => 'no', 'slug' => 'projects', 'render_type' => 'standalone', 'page_id' => ''],
    'menu_settings'  => ['in_fluent_crm' => 'no', 'menu_position' => 3],
    'recurring_task' => ['enabled' => 'no', 'all_boards' => 'yes', 'selected_boards' => []],
]
```

**Example**
```php
$prefs = fluent_boards_get_pref_settings();

if ($prefs['timeTracking']['enabled'] === 'yes') {
    // Time tracking (Pro) is switched on
}
```

### fluent_boards_get_features_config()

Returns feature flags stored in the `_fbs_features` option and merged with the defaults. `cloud_storage` is forced to `'yes'` when the `FLUENT_BOARDS_CLOUD_STORAGE` constant is defined and truthy.

**Return**
- `array`, for example `['cloud_storage' => 'no']`.

**Example**
```php
$features = fluent_boards_get_features_config();
$usesCloudStorage = $features['cloud_storage'] === 'yes';
```

## URLs and assets

### fluent_boards_page_url()

Returns the base URL of the FluentBoards single-page app. The default is `admin_url('admin.php?page=fluent-boards#/')`. When the Pro frontend portal is active, the URL can point to the front end instead. Filter: `fluent_boards/app_url`.

**Return**
- `string` ending in `#/`. Append a route such as `boards/12` to link to a board.

**Example**
```php
$boardUrl = fluent_boards_page_url() . 'boards/12';
$taskUrl  = fluent_boards_page_url() . 'boards/12/tasks/345';
```

### FluentBoardsAssetUrl()

Returns the URL of the plugin `assets/` directory, optionally with a path appended.

```php
FluentBoardsAssetUrl($path = null)
```

**Example**
```php
$icon = FluentBoardsAssetUrl('images/icon.svg');
```

### fluent_boards_mix()

Internal helper. It returns `fluentBoards('url.assets')` with `$path` appended (the leading `/` is trimmed). The `$manifestDirectory` argument is accepted for backward compatibility and is ignored.

```php
fluent_boards_mix($path, $manifestDirectory = '')
```

### fluent_boards_get_upgrade_url()

Builds the `https://fluentboards.com/pricing/` URL with UTM parameters. `$utmContent` is passed through `sanitize_key()` and added as `utm_content`.

```php
fluent_boards_get_upgrade_url($utmContent = '')
```

## Users and branding

### fluent_boards_user_avatar()

Returns an avatar URL for an email address. For a WordPress user it uses, in order: the FluentBoards profile photo meta, a `wp_user_avatar` attachment, then `get_avatar_url()`. For an unknown email it returns a Gravatar URL; when `$name` is given, it falls back to a ui-avatars.com image. Every result passes through the `fluent_boards/get_avatar` filter.

```php
fluent_boards_user_avatar($email, $name = '')
```

**Parameters**
- `$email` (string): The email address.
- `$name` (string): Optional display name used for the fallback avatar.

**Return**
- `string`: The avatar URL.

**Example**
```php
$avatarUrl = fluent_boards_user_avatar('user@example.com', 'John Doe');
```

### fluent_boards_site_logo()

Returns the URL of the theme's custom logo, or an empty string if none is set. Filter: `fluent_boards/site_logo`.

**Example**
```php
$logoUrl = fluent_boards_site_logo();
```

### fluent_boards_is_rtl()

Returns `true` when the FluentBoards UI should render right-to-left. It currently wraps WordPress `is_rtl()`.

## Data helpers

### fluent_boards_sanitize_description()

Sanitizes a task or board description that may contain Markdown and HTML. It converts `<https://…>` and `<email@…>` autolinks into Markdown links, runs `wp_kses_post()`, and keeps Markdown `>` quote prefixes intact.

```php
fluent_boards_sanitize_description($description): string
```

**Example**
```php
$clean = fluent_boards_sanitize_description($_POST['description'] ?? '');
```

### fluent_boards_string_to_bool()

Converts common string flags to booleans: `'yes'`, `'true'`, `'1'` become `true`, and `'no'`, `'false'`, `'0'` become `false`. Input is trimmed and lower-cased first, and arrays are converted recursively. Unrecognized values are returned unchanged. Filter the map with `fluent_boards/true_false_convert`.

```php
fluent_boards_string_to_bool($value)
```

**Example**
```php
fluent_boards_string_to_bool('Yes');          // true
fluent_boards_string_to_bool(['1', 'no']);    // [true, false]
fluent_boards_string_to_bool('maybe');        // 'maybe'
```

### fluentboardsCsvMimes()

Returns the MIME types accepted when importing a board from CSV. Filter: `fluent_boards_csv_mimes` (note the underscore, not a slash).

## Deprecated functions

These aliases still work, but they trigger `_deprecated_function()` notices. They were deprecated in version 1.90.

| Deprecated | Use instead |
|---|---|
| `fbsGetOption($key, $default = null)` | `fluent_boards_get_option()` |
| `fbsUpdateOption($key, $value)` | `fluent_boards_update_option()` |
| `fbsGetFeaturesConfig()` | `fluent_boards_get_features_config()` |

## PHP API classes

`FluentBoardsApi()` exposes three classes. Each one has its own reference page:

| Key | Class | Reference |
|---|---|---|
| `boards` | `FluentBoards\App\Api\Classes\Boards` | [Boards API](/global-functions/boards-api-function) |
| `stages` | `FluentBoards\App\Api\Classes\Stages` | [Stages API](/global-functions/stages-api-function) |
| `tasks` | `FluentBoards\App\Api\Classes\Tasks` | [Tasks API](/global-functions/tasks-api-function) |

Behavior shared by all three classes:

- **Get the object through the function.** Call `FluentBoardsApi('tasks')` each time, or store the returned object. Do not instantiate the classes directly. There is no `getInstance()` method, and the classes do not expose the underlying model. For raw queries, use the [models](/database/models/) directly.
- **Permissions use the current user.** Read methods require read access to the board and write methods require write access. The check is `PermissionManager::userHasBoardPermission()` against the board the item belongs to. When the check fails, most methods return `false`. In WP-CLI, cron or REST callbacks without a logged-in user, call `wp_set_current_user()` first.
- **Exceptions become `null`.** The `FBSApi` proxy catches any `\Exception` thrown inside a method, including "Method … does not exist" for unknown methods and model-not-found errors from `findOrFail()`. In those cases you get `null`. Check results with `if (!$result)` rather than `=== false`. PHP `Error`s (for example, calling a Pro class when Pro is inactive) are **not** caught.
- **Pro-only methods** (`createTaskAttachment`, `deleteTaskAttachment`, `createSubtask`, `updateSubtask`, `deleteSubtask`) return `false` unless FluentBoards Pro is active (`FLUENT_BOARDS_PRO_VERSION` is defined).
