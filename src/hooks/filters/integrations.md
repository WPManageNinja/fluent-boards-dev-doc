# Settings & Integration Filter Hooks

<Badge type="tip" vertical="top" text="FluentBoards Core" /> <Badge type="warning" vertical="top" text="Intermediate" />

Filter hooks for global settings, the add-ons screen, AI generation, the MCP (AI agent) server and Pro plugin links and licensing. See the [Filter Hooks overview](./index.md) for every filter grouped by area.

Hooks marked <Badge type="tip" text="Pro" /> run only when FluentBoards Pro is active. Source paths are relative to the plugin root. Paths that start with `fluent-boards-pro/` are in the Pro plugin. Every filter must **return** the value it receives (modified or not).

## Settings & Add-ons

<explain-block title="fluent_boards/save_general_settings">

Filters the general settings right before they are saved to the `general_settings` option. The save endpoint only works when FluentBoards Pro is active.

**Parameters**
- `$settings` `array`: the sanitized settings (key ⇒ string, bool or number)

**Default:** the sanitized request values

**Usage**
```php
add_filter('fluent_boards/save_general_settings', function ($settings) {
    return $settings;
}, 10, 1);
```

**Source:** `app/Http/Controllers/OptionsController.php`

</explain-block>

<explain-block title="fluent_boards/addons_settings">

Filters the list of companion plugins shown on the Features & Modules (add-ons) settings screen.

**Parameters**
- `$addOns` `array`: plugin slug ⇒ descriptor with `title`, `logo`, `is_installed`, `learn_more_url`, `settings_url`, `associate_doc`, `action_text`, `description`, `short_desc` and, for some entries, `install_route` / `install_url`

**Default:** entries for `fluent-crm`, `fluentform`, `fluent-support`, `fluent-smtp` and `fluent-toolkit` (FluentHub)

**Usage**
```php
add_filter('fluent_boards/addons_settings', function ($addOns) {
    unset($addOns['fluent-smtp']);
    return $addOns;
}, 10, 1);
```

**Source:** `app/Http/Controllers/OptionsController.php`

</explain-block>

<explain-block title="fluent_boards/accepted_plugins">

Filters which plugins the "install plugin" endpoint accepts. Requests for slugs that are not in this list are rejected. Built-in slugs are installed by the core background installer. Slugs you add are handed to the [`fluent_boards/install_plugin`](../actions/app.md#fluent_boards_install_plugin) action.

**Parameters**
- `$plugins` `array`: plugin slug ⇒ main plugin file name

**Default:**
```php
[
    'fluent-crm'     => 'fluent-crm.php',
    'fluentform'     => 'fluentform.php',
    'fluent-support' => 'fluent-support.php',
    'fluent-smtp'    => 'fluent-smtp.php',
]
```

**Usage**
```php
add_filter('fluent_boards/accepted_plugins', function ($plugins) {
    $plugins['my-plugin'] = 'my-plugin.php';
    return $plugins;
}, 10, 1);
```

**Source:** `app/Http/Controllers/OptionsController.php`

</explain-block>

## AI

<explain-block title="fluent_boards/wordpress_ai_generate">

A short-circuit filter for the "WordPress" AI provider. Return a non-`null` value to supply the generated text yourself and skip the WordPress AI Client (`wp_ai_client_prompt()`).

**Parameters**
- `$result` `null`: return a `string` (the generated text) or a `\WP_Error` to short-circuit
- `$userPrompt` `string`: the user prompt
- `$systemPrompt` `string`: the system instruction
- `$model` `string`: the configured model
- `$timeout` `int`: the request timeout in seconds

**Default:** `null` (use the WordPress AI Client)

**Usage**
```php
add_filter('fluent_boards/wordpress_ai_generate', function ($result, $userPrompt, $systemPrompt, $model, $timeout) {
    if ($result !== null) {
        return $result;
    }
    return my_ai_complete($systemPrompt, $userPrompt); // string or WP_Error
}, 10, 5);
```

**Source:** `app/Services/AiService.php`

</explain-block>

## MCP (AI Agents)

<explain-block title="fluent_boards/mcp_ability_names">

Filters the ability (tool) names exposed on the FluentBoards MCP server. It also drives the tools count shown in settings. Add the names of abilities you registered on [`fluent_boards/mcp_loaded`](../actions/app.md#fluent_boards_mcp_loaded), or remove core tools.

**Parameters**
- `$names` `string[]`: ability names

**Default:** the names of all core FluentBoards abilities

**Usage**
```php
add_filter('fluent_boards/mcp_ability_names', function ($names) {
    $names[] = 'fluent-boards/my-tool';
    return $names;
}, 10, 1);
```

**Source:** `app/Modules/MCP/MCPInit.php`

</explain-block>

<explain-block title="fluent_boards/mcp_server_namespace">

Filters the REST namespace of the FluentBoards MCP server. It is used both when the server is registered and when the endpoint URL is built.

**Parameters**
- `$namespace` `string`: the REST namespace

**Default:** `'fluent-boards'`

**Usage**
```php
add_filter('fluent_boards/mcp_server_namespace', function ($namespace) {
    return 'my-boards';
}, 10, 1);
```

**Source:** `app/Modules/MCP/MCPInit.php`

</explain-block>

<explain-block title="fluent_boards/mcp_server_route">

Filters the REST route of the FluentBoards MCP server. The endpoint is `/wp-json/{namespace}/{route}`.

**Parameters**
- `$route` `string`: the route

**Default:** `'mcp'`

**Usage**
```php
add_filter('fluent_boards/mcp_server_route', function ($route) {
    return 'agent';
}, 10, 1);
```

**Source:** `app/Modules/MCP/MCPInit.php`

</explain-block>

<explain-block title="fluent_boards/mcp_is_local_dev">

Filters whether the site is treated as a local development environment. The MCP settings screen uses this to generate the client connection snippet.

**Parameters**
- `$isDev` `bool`: the detected value
- `$host` `string`: the site host from `home_url()`

**Default:** `true` when the host ends in `.test`, `.lab`, `.local`, `.localhost`, `.docker` or `.dev`, is `localhost`, `127.0.0.1` or `::1`, or is a private or reserved IP. `false` otherwise.

**Usage**
```php
add_filter('fluent_boards/mcp_is_local_dev', function ($isDev, $host) {
    return $host === 'staging.example.com' ? true : $isDev;
}, 10, 2);
```

**Source:** `app/Http/Controllers/MCPSettingsController.php`

</explain-block>

## Pro Plugin Links & License

<explain-block title="fluent_boards/docs_url">
<Badge type="tip" text="Pro" />

Filters the "Docs" link URL in the FluentBoards Pro row on the Plugins screen.

**Parameters**
- `$url` `string`: the documentation URL

**Default:** `'https://fluentboards.com/docs/'`

**Usage**
```php
add_filter('fluent_boards/docs_url', function ($url) {
    return 'https://intranet.example.com/boards-help';
}, 10, 1);
```

**Source:** `fluent-boards-pro/boot/app.php`

</explain-block>

<explain-block title="fluent_boards/community_support_url">
<Badge type="tip" text="Pro" />

Filters the "Help & Support" link URL in the FluentBoards Pro row on the Plugins screen.

**Parameters**
- `$url` `string`: the support URL

**Default:** `'https://wpmanageninja.com/support-tickets/#/'`

**Usage**
```php
add_filter('fluent_boards/community_support_url', function ($url) {
    return 'https://intranet.example.com/support';
}, 10, 1);
```

**Source:** `fluent-boards-pro/boot/app.php`

</explain-block>

<explain-block title="fluent_boards/license_grace_period_days">
<Badge type="tip" text="Pro" />

Filters the fallback grace period, in days, shown after a valid Pro license expires. It is used only when the license server does not report its own grace length. Return `0` to show no grace period.

**Parameters**
- `$days` `int`: the grace period in days

**Default:** `15`

**Usage**
```php
add_filter('fluent_boards/license_grace_period_days', function ($days) {
    return 7;
}, 10, 1);
```

**Source:** `fluent-boards-pro/app/Http/Controllers/LicenseController.php`

</explain-block>
