# UI & Branding Filter Hooks

<Badge type="tip" vertical="top" text="FluentBoards Core" /> <Badge type="warning" vertical="top" text="Intermediate" />

Filter hooks for the admin app, menus, script loading, avatars and logos, notification emails, and the Pro frontend portal and invitation pages. See the [Filter Hooks overview](./index.md) for every filter grouped by area.

Hooks marked <Badge type="tip" text="Pro" /> run only when FluentBoards Pro is active. Source paths are relative to the plugin root. Paths that start with `fluent-boards-pro/` are in the Pro plugin. Every filter must **return** the value it receives (modified or not).

## Admin App

<explain-block title="fluent_boards/app_url">

Filters the base URL of the FluentBoards app. It is used for app links, email links, task redirects (`fluent_boards_page_url()`) and the `base_url` app variable. When the frontend portal or the board shortcode is active, Pro overrides it at priority `100`.

**Parameters**
- `$url` `string`: the app base URL, ending in `#/`

**Default:** `admin_url('admin.php?page=fluent-boards#/')`

**Usage**
```php
add_filter('fluent_boards/app_url', function ($url) {
    return home_url('/projects/#/');
}, 10, 1);
```

**Source:** `app/Functions/helpers.php`, `app/Hooks/Handlers/ExternalPages.php`, `fluent-boards-pro/boot/app.php`

</explain-block>

<explain-block title="fluent_boards/app_vars">

Filters the variables localized to the app as `window.fluentAddonVars`. This is the main way to pass server data to front-end add-ons.

**Parameters**
- `$vars` `array`: app variables, including `slug`, `nonce`, `rest`, `me`, `has_pro`, `base_url`, `asset_url`, `priorities`, `dashboard_notices`, `board_menu_items`, `file_upload_limit`, `trans` and more

**Default:** the full variables array built by `AdminMenuHandler::getAddonVars()`

**Usage**
```php
add_filter('fluent_boards/app_vars', function ($vars) {
    $vars['my_addon'] = [
        'enabled' => true,
    ];
    return $vars;
}, 10, 1);
```

**Source:** `app/Hooks/Handlers/AdminMenuHandler.php`

</explain-block>

<explain-block title="fluent_boards/app_logo">

Filters the logo URL shown in the app's top bar.

**Parameters**
- `$url` `string`: the logo image URL

**Default:** the plugin's `assets/images/logo.svg`

**Usage**
```php
add_filter('fluent_boards/app_logo', function ($url) {
    return 'https://example.com/my-logo.svg';
}, 10, 1);
```

**Source:** `app/Hooks/Handlers/AdminMenuHandler.php`

</explain-block>

<explain-block title="fluent_boards/app_icon">

Filters the small icon URL shown in the app's top bar. Pro also filters it for the board shortcode.

**Parameters**
- `$url` `string`: the icon image URL

**Default:** the plugin's `assets/images/icon.svg`

**Usage**
```php
add_filter('fluent_boards/app_icon', function ($url) {
    return 'https://example.com/my-icon.svg';
}, 10, 1);
```

**Source:** `app/Hooks/Handlers/AdminMenuHandler.php`

</explain-block>

<explain-block title="fluent_boards/dashboard_notices">

Filters the notices shown at the top of the FluentBoards dashboard. Each item is an HTML string, rendered as raw HTML in the dashboard.

**Parameters**
- `$notices` `string[]`: HTML notice strings

**Default:** `[]`

**Note:** The HTML is output unescaped. Escape any dynamic values yourself.

**Usage**
```php
add_filter('fluent_boards/dashboard_notices', function ($notices) {
    $notices[] = '<p>' . esc_html__('Planned maintenance on Friday.', 'my-plugin') . '</p>';
    return $notices;
}, 10, 1);
```

**Source:** `app/Hooks/Handlers/AdminMenuHandler.php`

</explain-block>

<explain-block title="fluent_boards/skip_no_conflict">

On FluentBoards admin pages, scripts from other plugins are dequeued to avoid conflicts ("no-conflict" mode). Return `true` from this filter to turn that off.

**Parameters**
- `$skip` `bool`: whether to skip no-conflict mode

**Default:** `false`

**Usage**
```php
add_filter('fluent_boards/skip_no_conflict', '__return_true');
```

**Source:** `app/Hooks/Handlers/AdminMenuHandler.php`

</explain-block>

<explain-block title="fluent_boards/asset_listed_slugs">

Filters the allow-list of plugin script paths that no-conflict mode keeps on FluentBoards pages. Each entry is a regex fragment matched against the script `src`. The entries are joined with `|`. Scripts outside the plugins directory are never dequeued.

**Parameters**
- `$slugs` `string[]`: regex fragments with escaped slashes, for example `'\/my-plugin\/'`

**Default:** `['\/fluent-crm\/']`. `'\/fluent-boards\/'` is always appended after the filter runs. On the Pro frontend portal, `'\/fluent-boards-pro\/'` and `'\/fluent-security\/'` are appended too (see `portal_asset_listed_slugs`).

**Usage**
```php
add_filter('fluent_boards/asset_listed_slugs', function ($slugs) {
    $slugs[] = '\/my-addon\/';
    return $slugs;
}, 10, 1);
```

**Source:** `app/Hooks/Handlers/AdminMenuHandler.php`, `fluent-boards-pro/app/Hooks/Handlers/FrontendRenderer.php`

</explain-block>

<explain-block title="fluent_boards/portal_asset_listed_slugs">
<Badge type="tip" text="Pro" />

Filters the final allow-list of plugin script paths kept on the frontend portal page. This list is used only for the portal.

**Parameters**
- `$slugs` `string[]`: the `asset_listed_slugs` result plus `'\/fluent-boards\/'`, `'\/fluent-boards-pro\/'` and `'\/fluent-security\/'`, de-duplicated

**Default:** as described above

**Usage**
```php
add_filter('fluent_boards/portal_asset_listed_slugs', function ($slugs) {
    $slugs[] = '\/my-portal-addon\/';
    return $slugs;
}, 10, 1);
```

**Source:** `fluent-boards-pro/app/Hooks/Handlers/FrontendRenderer.php`

</explain-block>

## Menus

<explain-block title="fluent_boards/core_menu_items">

Filters the first app top-bar menu items, before "Reports", "Community" (admins only) and "Front Portal" are appended. Use it to add items next to Dashboard and Boards.

**Parameters**
- `$menuItems` `array`: menu key ⇒ item. Each item has `key`, `label`, `permalink`, and optionally `target`.

**Default:** `dashboard` and `boards`

**Usage**
```php
add_filter('fluent_boards/core_menu_items', function ($menuItems) {
    $menuItems['my_page'] = [
        'key'       => 'my_page',
        'label'     => __('My Page', 'my-plugin'),
        'permalink' => fluent_boards_page_url() . 'my-page',
    ];
    return $menuItems;
}, 10, 1);
```

**Source:** `app/Hooks/Handlers/AdminMenuHandler.php`

</explain-block>

<explain-block title="fluent_boards/menu_items">

Filters the complete app top-bar menu, after all core items are added. Use it to add, remove or reorder items. The result is re-indexed with `array_values()`.

**Parameters**
- `$menuItems` `array`: menu key ⇒ item (`key`, `label`, `permalink`, optional `target`)

**Default:** `dashboard`, `boards`, `reports`, plus `help` (Community, admins only) and `front` (Front Portal, only when the portal URL differs from the admin URL)

**Usage**
```php
add_filter('fluent_boards/menu_items', function ($menuItems) {
    unset($menuItems['reports']);
    return $menuItems;
}, 10, 1);
```

**Source:** `app/Hooks/Handlers/AdminMenuHandler.php`

</explain-block>

<explain-block title="fluent_boards/board_menu_items">

Filters the items of the board sidebar menu (the board's "More" menu). The result is sorted by `position` and then validated on the server.

**Parameters**
- `$menuItems` `array`: a **list** (numeric array) of menu items

This filter receives **one** argument. It does not pass a board ID, and the menu is built once for the app, not per board.

**Default:** `about_this_board` (1), `board_activity` (2), `change_background` (3), `notification_settings` (4), `board_labels` (5), `custom_fields` (6), `board_members` (7), `archived_items` (8), `webhooks` (9), `associated_crm_contacts` (9, removed when FluentCRM is not active), `duplicate_board` (10), `restore_board` (10), `export` (10.5, Pro), `archive_board` (11), `delete_board` (11). Values in parentheses are `position`.

**Menu item structure**
```php
[
    'key'       => 'unique_identifier', // Required
    'label'     => 'Menu Label',        // Required
    'type'      => 'custom',            // 'default' for core items. Any other value is treated as 'custom'.
    'position'  => 10.5,                // Optional. Lower comes first. Decimals let you slot between items. Missing = 999.
    'icon'      => '<svg>...</svg>',    // Custom items: icon HTML
    'html'      => '<div>...</div>',    // Custom items: panel content HTML
    'width'     => '500px',             // Optional. Must be a non-empty string, or the item is dropped.
    'render_in' => 'drawer',            // Optional: 'drawer' (default) or 'modal'
    'role'      => 'admin',             // Optional: 'admin' hides the item from non-admins
]
```

Items without a `key` or `label` are removed. `icon` and `html` are rendered as raw HTML, so escape dynamic values yourself.

**Usage**
```php
add_filter('fluent_boards/board_menu_items', function ($menuItems) {
    $menuItems[] = [
        'key'       => 'my_custom_item',
        'label'     => 'My Custom Item',
        'type'      => 'custom',
        'position'  => 10.5,
        'icon'      => '<svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><circle cx="8" cy="8" r="6"/></svg>',
        'html'      => '<div>Custom content</div>',
        'width'     => '500px',
        'render_in' => 'drawer',
    ];

    return $menuItems;
}, 10, 1);
```

**Source:** `app/Hooks/Handlers/BoardMenuHandler.php`

</explain-block>

## Avatars & Logos

<explain-block title="fluent_boards/get_avatar">

Filters the avatar URL that FluentBoards shows for a user or email (`fluent_boards_user_avatar()`).

**Parameters**
- `$url` `string`: the avatar URL
- `$email` `string`: the email address

**Default:** the user's FluentBoards profile photo, then a custom avatar attachment, then `get_avatar_url()`. For emails without a WordPress user, the Gravatar URL (with a ui-avatars.com fallback when a name is known).

**Usage**
```php
add_filter('fluent_boards/get_avatar', function ($url, $email) {
    return $url;
}, 10, 2);
```

**Source:** `app/Functions/helpers.php`

</explain-block>

<explain-block title="fluent_boards/site_logo">

Filters the site logo URL used in the header of notification emails.

**Parameters**
- `$logoUrl` `string`: the logo URL

**Default:** the theme's custom logo (`get_theme_mod('custom_logo')`) if set, otherwise `''`. When it is empty, the email header shows the site title as text.

**Usage**
```php
add_filter('fluent_boards/site_logo', function ($logoUrl) {
    return 'https://example.com/email-logo.png';
}, 10, 1);
```

**Source:** `app/Functions/helpers.php`

</explain-block>

## Emails

<explain-block title="fluent_boards/email_header">

Filters the header HTML of FluentBoards notification emails. The result is passed through `wp_kses_post()`.

**Parameters**
- `$headerHtml` `string`: the header markup

**Default:** an `img` tag with the [`site_logo`](#fluent_boards_site_logo) (100px wide) when a logo exists, otherwise a `div` with the site title

**Usage**
```php
add_filter('fluent_boards/email_header', function ($headerHtml) {
    return $headerHtml . '<p>Project updates</p>';
}, 10, 1);
```

**Source:** `app/Views/emails/common-header.php`

</explain-block>

<explain-block title="fluent_boards/email_footer">

Filters the footer HTML of FluentBoards notification emails. The result is passed through `wp_kses_post()`.

**Parameters**
- `$footerText` `string`: the footer markup

**Default:** `''`

**Usage**
```php
add_filter('fluent_boards/email_footer', function ($footerText) {
    return '<p>Sent by Example Inc.</p>';
}, 10, 1);
```

**Source:** `app/Views/emails/template.php`, `app/Views/emails/comment-added.php`

</explain-block>

## Frontend Portal & Invitations

<explain-block title="fluent_boards/no_permission_message">
<Badge type="tip" text="Pro" />

Filters the message shown on the frontend portal or the board shortcode when the logged-in user has no board access. The message is output inside a `div` and is not escaped.

**Parameters**
- `$message` `string`: the message

**Default:** `'You do not have permission to view the projects'` (translatable)

**Usage**
```php
add_filter('fluent_boards/no_permission_message', function ($message) {
    return esc_html__('Ask your project manager for access.', 'my-plugin');
}, 10, 1);
```

**Source:** `fluent-boards-pro/app/Hooks/Handlers/SingleBoardShortCodeHandler.php`, `fluent-boards-pro/app/Hooks/Handlers/FrontendRenderer.php`

</explain-block>

<explain-block title="fluent_boards/login_header">
<Badge type="tip" text="Pro" />

Filters the heading above the login form shown to logged-out visitors on the frontend portal.

**Parameters**
- `$text` `string`: the heading text

**Default:** `'Please login to view the project'` (translatable)

**Usage**
```php
add_filter('fluent_boards/login_header', function ($text) {
    return esc_html__('Sign in to your client area', 'my-plugin');
}, 10, 1);
```

**Source:** `fluent-boards-pro/app/Hooks/Handlers/FrontendRenderer.php`

</explain-block>

<explain-block title="fluent_boards/invitation_form_title">
<Badge type="tip" text="Pro" />

Filters the title of the quick registration form that invited users see.

**Parameters**
- `$title` `string`: the title

**Default:** `'Fluent Boards'`

**Usage**
```php
add_filter('fluent_boards/invitation_form_title', function ($title) {
    return get_bloginfo('name');
}, 10, 1);
```

**Source:** `fluent-boards-pro/app/Views/register_member_form.php`

</explain-block>

<explain-block title="fluent_boards/invitation_form_registration_text">
<Badge type="tip" text="Pro" />

Filters the subtitle of the invitation registration form.

**Parameters**
- `$text` `string`: the subtitle

**Default:** `'Quick Registration Form'` (translatable)

**Usage**
```php
add_filter('fluent_boards/invitation_form_registration_text', function ($text) {
    return esc_html__('Create your account to join the board', 'my-plugin');
}, 10, 1);
```

**Source:** `fluent-boards-pro/app/Views/register_member_form.php`

</explain-block>

<explain-block title="fluent_boards/invite_expiry_seconds">
<Badge type="tip" text="Pro" />

Filters how long a board invitation link stays valid, in seconds.

**Parameters**
- `$seconds` `int`: the link lifetime
- `$boardId` `int`: the board ID
- `$email` `string`: the invited email address

**Default:** `172800` (48 hours). Values below 300 seconds (5 minutes) are raised to 300.

**Usage**
```php
add_filter('fluent_boards/invite_expiry_seconds', function ($seconds, $boardId, $email) {
    return 7 * DAY_IN_SECONDS;
}, 10, 3);
```

**Source:** `fluent-boards-pro/app/Hooks/Handlers/InvitationHandler.php`

</explain-block>
