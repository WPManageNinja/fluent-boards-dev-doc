# App & Admin Action Hooks

<Badge type="tip" vertical="top" text="FluentBoards Core" /> <Badge type="warning" vertical="top" text="Intermediate" />

Action hooks for plugin bootstrap, the admin app shell, the Pro frontend portal, module settings and the MCP (AI agent) module. See the [Action Hooks overview](./index.md) for every action hook grouped by area.

Hooks marked <Badge type="tip" text="Pro" /> fire only when FluentBoards Pro is active. Source paths are relative to the plugin root. Paths that start with `fluent-boards-pro/` are in the Pro plugin.

## App Lifecycle

<explain-block title="fluent_boards_loaded">

Fires on `plugins_loaded` once the FluentBoards application is booted. This is the safest place to register code that depends on FluentBoards classes. FluentBoards Pro boots itself from this hook.

The name uses an underscore, not the `fluent_boards/` prefix.

**Parameters**
- `$app` `\FluentBoards\Framework\Foundation\Application`: the FluentBoards application container

**Usage**
```php
add_action('fluent_boards_loaded', function ($app) {
    // FluentBoards is ready
}, 10, 1);
```

**Source:** `boot/app.php`

</explain-block>

<explain-block title="fluent-boards_loading_app">

**Legacy name** (slug with a hyphen, then `_loading_app`). Fires while the app assets are being enqueued, right before the main app script is registered. It fires in wp-admin, and in Pro also for the single-board shortcode. Use it to enqueue assets that must load before the FluentBoards app script.

**Parameters**
None.

**Usage**
```php
add_action('fluent-boards_loading_app', function () {
    // wp_enqueue_script(...)
}, 10, 0);
```

**Source:** `app/Hooks/Handlers/AdminMenuHandler.php`, `fluent-boards-pro/app/Hooks/Handlers/SingleBoardShortCodeHandler.php`

</explain-block>

<explain-block title="fluent_boards/after_enqueue_assets">

Fires after the FluentBoards app scripts are enqueued and `fluentAddonVars` is localized. It fires in wp-admin, on the Pro frontend portal (which reuses the admin enqueue) and for the Pro single-board shortcode. Use it to enqueue add-on scripts that depend on the app.

**Parameters**
- `$app` `\FluentBoards\Framework\Foundation\Application`: the application container

**Usage**
```php
add_action('fluent_boards/after_enqueue_assets', function ($app) {
    // wp_enqueue_script('my-addon', ..., ['fluent-boards_admin_app']);
}, 10, 1);
```

**Source:** `app/Hooks/Handlers/AdminMenuHandler.php`, `fluent-boards-pro/app/Hooks/Handlers/SingleBoardShortCodeHandler.php`

</explain-block>

<explain-block title="fluent_boards/rendering_app">

Fires at the start of rendering the FluentBoards admin page, before the app view is output.

**Parameters**
None.

**Usage**
```php
add_action('fluent_boards/rendering_app', function () {
    // Do whatever you want
}, 10, 0);
```

**Source:** `app/Hooks/Handlers/AdminMenuHandler.php`

</explain-block>

<explain-block title="fluent_boards/after_core_menu_items">

Fires while the wp-admin menu is registered, after the "Dashboard" and "Boards" submenu pages and before "Settings". Use it to add your own `add_submenu_page()` entries under the `fluent-boards` parent.

**Parameters**
- `$permissions` `array`: always an empty array `[]`
- `$isAdmin` `bool`: always `true`

Both arguments are fixed values. Do not use them for permission checks. Check capabilities yourself.

**Usage**
```php
add_action('fluent_boards/after_core_menu_items', function ($permissions, $isAdmin) {
    add_submenu_page('fluent-boards', 'My Page', 'My Page', 'manage_options', 'fluent-boards#/my-page', '__return_null');
}, 10, 2);
```

**Source:** `app/Hooks/Handlers/AdminMenuHandler.php`

</explain-block>

<explain-block title="fluent_boards/in_menu_actions">

Fires inside the FluentBoards top navigation bar markup, after the menu items. Use it to print extra action buttons or links into the header.

**Parameters**
None.

**Usage**
```php
add_action('fluent_boards/in_menu_actions', function () {
    echo '<a class="fbs_menu_item" href="#">My action</a>';
}, 10, 0);
```

**Source:** `app/Views/admin/menu.php`

</explain-block>

To change the menu items themselves, use the [`core_menu_items`](../filters/ui.md#fluent_boards_core_menu_items) and [`menu_items`](../filters/ui.md#fluent_boards_menu_items) filters.

## Frontend Portal

<explain-block title="fluent_boards/front_head">
<Badge type="tip" text="Pro" />

Fires inside the `<head>` of the standalone frontend portal page, after the core head output. Use it to print extra meta tags, styles or scripts.

**Parameters**
None.

**Usage**
```php
add_action('fluent_boards/front_head', function () {
    echo '<meta name="robots" content="noindex">';
}, 10, 0);
```

**Source:** `fluent-boards-pro/app/Views/front-app.php`

</explain-block>

<explain-block title="fluent_boards/front_footer">
<Badge type="tip" text="Pro" />

Fires at the end of the frontend portal page, after `wp_footer()`.

**Parameters**
None.

**Usage**
```php
add_action('fluent_boards/front_footer', function () {
    // Print footer markup or scripts
}, 10, 0);
```

**Source:** `fluent-boards-pro/app/Views/front-app.php`

</explain-block>

## Settings & Add-ons

<explain-block title="fluent_boards/saving_addons">

Fires when the Features & Modules settings are saved, right before the `fluent_boards_modules` option is updated.

**Parameters**
- `$settings` `array`: the new module settings that are about to be saved
- `$prefSettings` `array`: the current (previous) module settings

**Usage**
```php
add_action('fluent_boards/saving_addons', function ($settings, $prefSettings) {
    // Do whatever you want
}, 10, 2);
```

**Source:** `app/Http/Controllers/OptionsController.php`

</explain-block>

<explain-block title="fluent_boards/recurring_task_disabled">

Fires after the module settings are saved with the recurring-task module turned off. Pro listens to this hook to clear the recurring-task scheduler.

**Parameters**
None.

**Usage**
```php
add_action('fluent_boards/recurring_task_disabled', function () {
    // Do whatever you want
}, 10, 0);
```

**Source:** `app/Http/Controllers/OptionsController.php`

</explain-block>

<explain-block title="fluent_boards/install_plugin">

Fires when an admin asks to install a plugin that is accepted by the [`fluent_boards/accepted_plugins`](../filters/integrations.md#fluent_boards_accepted_plugins) filter but is **not** in the built-in free list (`fluent-crm`, `fluentform`, `fluent-support`, `fluent-smtp`). Built-in plugins use the core background installer. Everything else is handed to this hook, which Pro also handles.

**Parameters**
- `$pluginToInstall` `array`: `['name' => string, 'repo-slug' => string, 'file' => string]`
- `$slug` `string`: the requested plugin slug

**Usage**
```php
add_action('fluent_boards/install_plugin', function ($pluginToInstall, $slug) {
    // Install the plugin
}, 10, 2);
```

**Source:** `app/Http/Controllers/OptionsController.php`

</explain-block>

## MCP (AI Agents)

<explain-block title="fluent_boards/mcp_loaded">

Fires on `wp_abilities_api_init`, after FluentBoards registers its core MCP abilities. Register extra abilities under the same `fluent-boards/` namespace here. To expose them on the FluentBoards MCP server, add their names with the [`fluent_boards/mcp_ability_names`](../filters/integrations.md#fluent_boards_mcp_ability_names) filter.

**Parameters**
None.

**Usage**
```php
add_action('fluent_boards/mcp_loaded', function () {
    wp_register_ability('fluent-boards/my-tool', [
        // ability args
    ]);
}, 10, 0);
```

**Source:** `app/Modules/MCP/MCPInit.php`

</explain-block>

<explain-block title="fluent_boards/mcp_tool_exception">

Fires when a FluentBoards MCP tool throws. The exception is caught and turned into an error response, so use this hook for logging.

**Parameters**
- `$exception` `\Throwable`: the thrown exception
- `$toolName` `string`: the ability (tool) name
- `$params` `array|mixed`: the input passed to the tool

**Usage**
```php
add_action('fluent_boards/mcp_tool_exception', function ($exception, $toolName, $params) {
    error_log($toolName . ': ' . $exception->getMessage());
}, 10, 3);
```

**Source:** `app/Modules/MCP/AbilitiesRegistrar.php`

</explain-block>
