# Navigation

<Badge type="tip" vertical="top" text="FluentBoards Core" />

FluentBoards has two navigation surfaces that add-ons can extend:

1. **The top navigation bar** of the app (Dashboard, Boards, Reports, …). It is rendered in PHP by `AdminMenuHandler::getMenuItems()` and `app/Views/admin/menu.php`.
2. **The board menu**, the settings drawer opened from a board's menu button (About this Board, Board Activity, Board Labels, …). It is built by `FluentBoards\App\Hooks\Handlers\BoardMenuHandler` and rendered by the Vue app.

## Top navigation

### `fluent_boards/menu_items`

Filters the items of the top navigation bar. The array is keyed by item key. Default items: `dashboard`, `boards`, `reports`, `help` (admins only, labeled "Community"), and `front` (only when the frontend portal URL differs from the admin URL).

| Item key | Type | Description |
|---|---|---|
| `key` | string | Unique key, added as the `fframe_item_{key}` CSS class and `data-key` attribute |
| `label` | string | Link text |
| `permalink` | string | Link URL. For app routes, use [`fluent_boards_page_url()`](/global-functions/#fluent-boards-page-url) plus the route. |
| `target` | string | Optional. Any non-empty value opens the link in a new tab and shows an external-link icon. |
| `class` | string | Optional extra CSS class |
| `sub_items` | array | Optional dropdown. Each sub-item needs `label` and `permalink`. |

```php
add_filter('fluent_boards/menu_items', function ($items) {
    $items['time_report'] = [
        'key'       => 'time_report',
        'label'     => __('Time Report', 'my-addon'),
        'permalink' => admin_url('admin.php?page=my-addon-time-report'),
    ];

    // Remove the Community link
    unset($items['help']);

    return $items;
});
```

The Pro frontend portal uses this same filter to remove the `help` item.

### `fluent_boards/core_menu_items`

Runs earlier, on just the `dashboard` and `boards` items, before `reports`, `help` and `front` are added. Use it when your item should appear before **Reports**.

### Other navigation hooks

| Hook | Type | Use |
|---|---|---|
| `fluent_boards/in_menu_actions` | Action | Print extra HTML in the action area on the right of the top bar |
| `fluent_boards/app_url` | Filter | Change the base URL of the app (used by `fluent_boards_page_url()`, and by Pro to point links at the frontend portal) |
| `fluent_boards/app_logo`, `fluent_boards/app_icon` | Filter | Replace the logo or icon URL |
| `fluent_boards/after_core_menu_items` | Action | Add WordPress admin submenu pages under the **FluentBoards** admin menu, after "Boards" |

## Board menu

### `fluent_boards/board_menu_items`

Filters the board menu items. Unlike the top navigation, this is a plain list (not keyed). The filter receives only the items, not the board, so the same items appear on every board.

**Default items**

| Key | Position | Role |
|---|---|---|
| `about_this_board` | 1 | — |
| `board_activity` | 2 | — |
| `change_background` | 3 | manager |
| `notification_settings` | 4 | — |
| `board_labels` | 5 | — |
| `custom_fields` | 6 | — (Pro) |
| `board_members` | 7 | — |
| `archived_items` | 8 | — |
| `webhooks` | 9 | — |
| `associated_crm_contacts` | 9 | — (only when FluentCRM is active) |
| `duplicate_board` | 10 | manager |
| `restore_board` | 10 | admin |
| `make_template`, `convert_to_board` | 10.2, 10.3 | manager (added by Pro) |
| `export` | 10.5 | manager (Pro) |
| `archive_board`, `delete_board` | 11 | admin |

**Custom item keys**

| Key | Required | Description |
|---|---|---|
| `key` | Yes | Unique key. It must not be one of the default keys. |
| `label` | Yes | Menu text |
| `type` | — | Leave it out or set `'custom'`. The server sets `'custom'` on any item that is not `'default'`. |
| `position` | No | Sort order (float). Decimals insert between defaults, for example `10.7`. Items without a position go last (999). |
| `icon` | No | Inline SVG/HTML for the icon |
| `html` | No | HTML rendered inside the drawer or dialog when the item is clicked. `<script>` tags inside it are executed. |
| `render_in` | No | `'drawer'` (default) or `'modal'`. Modal items need `html`. |
| `width` | No | Drawer or dialog width, for example `'500px'` (default `'600px'`). It must be a non-empty string, or the item is dropped. |
| `role` | No | `'admin'` removes the item for users who are not FluentBoards admins, on the server and in the browser. `'manager'` hides it in the browser for users who are not admins or managers of the current board. This is a display rule only, so check permissions again in any endpoint your item calls. |

```php
add_filter('fluent_boards/board_menu_items', function ($items) {
    $items[] = [
        'key'       => 'my_addon_sync',
        'label'     => __('Sync with CRM', 'my-addon'),
        'position'  => 9.5,
        'render_in' => 'modal',
        'width'     => '480px',
        'role'      => 'admin',
        'html'      => '<div class="my-addon-sync"><p>Last sync: never</p><button class="el-button el-button--primary" id="my-addon-sync-btn">Sync now</button></div>',
    ];

    return $items;
});
```

Escape any dynamic values you put into `html`. Because the HTML is not tied to a board, read the current board ID in your script from the app URL (`#/boards/{id}`).

The menu items are sent to the browser in `window.fluentAddonVars.board_menu_items`. They are also available from `GET /wp-json/fluent-boards/v2/projects/{board_id}/board-menu-items`. The server drops items without a `key` or `label`, and removes `admin` items for users who are not admins. The Vue app validates them again.

## Module toggles

The **Settings → Modules** screen stores its state in the WordPress option `fluent_boards_modules`. Read it with [`fluent_boards_get_pref_settings()`](/global-functions/#fluent-boards-get-pref-settings), for example to show your navigation item only when a module is on:

```php
add_filter('fluent_boards/menu_items', function ($items) {
    $prefs = fluent_boards_get_pref_settings();

    if ($prefs['timeTracking']['enabled'] === 'yes') {
        $items['time_report'] = [
            'key'       => 'time_report',
            'label'     => __('Time Report', 'my-addon'),
            'permalink' => admin_url('admin.php?page=my-addon-time-report'),
        ];
    }

    return $items;
});
```
