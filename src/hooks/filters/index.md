# FluentBoards Filter Hooks

<Badge type="tip" vertical="top" text="FluentBoards Core" /> <Badge type="warning" vertical="top" text="Intermediate" />

FluentBoards has many filter hooks. Use them to change default settings and data, and to extend FluentBoards with new functionality.

## What are Filter Hooks

A hook lets developers change functionality without editing core files. Filter hooks pass a value through your callback. Your callback returns the value, modified or unchanged, and FluentBoards uses whatever you return.

```php
add_filter('fluent_boards/task_priorities', function ($priorities) {
    $priorities['critical'] = __('Critical', 'my-plugin');
    return $priorities; // always return the value
}, 10, 1);
```

Conventions used on these pages:

- Pass the correct number of accepted arguments (the 4th parameter of `add_filter()`). If a filter passes extra arguments and you need them, register with that count, for example `10, 2`.
- Almost every hook name starts with `fluent_boards/`. The legacy exception `fluent_boards_csv_mimes` is noted on the hook.
- <Badge type="tip" text="Pro" /> means the filter runs only when FluentBoards Pro is active. Filters without the badge are applied by the free plugin. Pro may apply some of them too.
- **Default** shows the value the filter receives when nothing else has changed it.
- **Source** paths are relative to the plugin root. Paths that start with `fluent-boards-pro/` are in the Pro plugin.

## Available Filter Hooks

### Data & Uploads

See [Data & Upload Filter Hooks](./data.md).

| Hook | Filters |
|---|---|
| [`fluent_boards/board_find`](./data.md#fluent_boards_board_find) | The board returned by the board endpoint |
| [`fluent_boards/before_create_board`](./data.md#fluent_boards_before_create_board) | Board attributes before insert |
| [`fluent_boards/before_task_create`](./data.md#fluent_boards_before_task_create) | Task attributes before insert |
| [`fluent_boards/can_create_board`](./data.md#fluent_boards_can_create_board) | Whether a user may create boards |
| [`fluent_boards/task_priorities`](./data.md#fluent_boards_task_priorities) | The task priority list |
| [`fluent_boards/task_reminder_types`](./data.md#fluent_boards_task_reminder_types) | Allowed reminder types |
| [`fluent_boards/true_false_convert`](./data.md#fluent_boards_true_false_convert) | The string-to-boolean map |
| [`fluent_boards/incoming_webhook_data`](./data.md#fluent_boards_incoming_webhook_data) <Badge type="tip" text="Pro" /> | Raw incoming webhook data |
| [`fluent_boards/webhook_task_data`](./data.md#fluent_boards_webhook_task_data) <Badge type="tip" text="Pro" /> | Task data mapped from a webhook |
| [`fluent_boards/upload_file_size_limit`](./data.md#fluent_boards_upload_file_size_limit) | Maximum upload size |
| [`fluent_boards/upload_allowed_mimes`](./data.md#fluent_boards_upload_allowed_mimes) | Allowed upload types |
| [`fluent_boards/upload_folder_name`](./data.md#fluent_boards_upload_folder_name) | Upload folder name |
| [`fluent_boards/uploaded_file_name_prefix`](./data.md#fluent_boards_uploaded_file_name_prefix) | Stored file name prefix |
| [`fluent_boards/upload_media_data`](./data.md#fluent_boards_upload_media_data) <Badge type="tip" text="Pro" /> | Attachment storage data |
| [`fluent_boards/import_max_file_size`](./data.md#fluent_boards_import_max_file_size) | Maximum import file size |
| [`fluent_boards_csv_mimes`](./data.md#fluent_boards_csv_mimes) | Accepted CSV MIME types |
| [`fluent_boards/task_table_columns`](./data.md#fluent_boards_task_table_columns) <Badge type="tip" text="Pro" /> | CSV import target columns |
| [`fluent_boards/default_templates_remote_url`](./data.md#fluent_boards_default_templates_remote_url) <Badge type="tip" text="Pro" /> | Remote templates endpoint |
| [`fluent_boards/ajax_options_{option_key}`](./data.md#fluent_boards_ajax_options__option_key_) | Options for remote select fields |

### UI & Branding

See [UI & Branding Filter Hooks](./ui.md).

| Hook | Filters |
|---|---|
| [`fluent_boards/app_url`](./ui.md#fluent_boards_app_url) | The app base URL |
| [`fluent_boards/app_vars`](./ui.md#fluent_boards_app_vars) | `window.fluentAddonVars` |
| [`fluent_boards/app_logo`](./ui.md#fluent_boards_app_logo) | Top-bar logo URL |
| [`fluent_boards/app_icon`](./ui.md#fluent_boards_app_icon) | Top-bar icon URL |
| [`fluent_boards/dashboard_notices`](./ui.md#fluent_boards_dashboard_notices) | Dashboard notices |
| [`fluent_boards/skip_no_conflict`](./ui.md#fluent_boards_skip_no_conflict) | Whether to skip script no-conflict mode |
| [`fluent_boards/asset_listed_slugs`](./ui.md#fluent_boards_asset_listed_slugs) | Scripts kept in no-conflict mode |
| [`fluent_boards/portal_asset_listed_slugs`](./ui.md#fluent_boards_portal_asset_listed_slugs) <Badge type="tip" text="Pro" /> | Scripts kept on the frontend portal |
| [`fluent_boards/core_menu_items`](./ui.md#fluent_boards_core_menu_items) | First top-bar menu items |
| [`fluent_boards/menu_items`](./ui.md#fluent_boards_menu_items) | The full top-bar menu |
| [`fluent_boards/board_menu_items`](./ui.md#fluent_boards_board_menu_items) | The board sidebar menu |
| [`fluent_boards/get_avatar`](./ui.md#fluent_boards_get_avatar) | User avatar URLs |
| [`fluent_boards/site_logo`](./ui.md#fluent_boards_site_logo) | Email logo URL |
| [`fluent_boards/email_header`](./ui.md#fluent_boards_email_header) | Email header HTML |
| [`fluent_boards/email_footer`](./ui.md#fluent_boards_email_footer) | Email footer HTML |
| [`fluent_boards/no_permission_message`](./ui.md#fluent_boards_no_permission_message) <Badge type="tip" text="Pro" /> | Portal "no access" message |
| [`fluent_boards/login_header`](./ui.md#fluent_boards_login_header) <Badge type="tip" text="Pro" /> | Portal login heading |
| [`fluent_boards/invitation_form_title`](./ui.md#fluent_boards_invitation_form_title) <Badge type="tip" text="Pro" /> | Invitation form title |
| [`fluent_boards/invitation_form_registration_text`](./ui.md#fluent_boards_invitation_form_registration_text) <Badge type="tip" text="Pro" /> | Invitation form subtitle |
| [`fluent_boards/invite_expiry_seconds`](./ui.md#fluent_boards_invite_expiry_seconds) <Badge type="tip" text="Pro" /> | Invitation link lifetime |

### Settings & Integrations

See [Settings & Integration Filter Hooks](./integrations.md).

| Hook | Filters |
|---|---|
| [`fluent_boards/save_general_settings`](./integrations.md#fluent_boards_save_general_settings) | General settings before save |
| [`fluent_boards/addons_settings`](./integrations.md#fluent_boards_addons_settings) | Add-ons screen entries |
| [`fluent_boards/accepted_plugins`](./integrations.md#fluent_boards_accepted_plugins) | Installable plugins |
| [`fluent_boards/wordpress_ai_generate`](./integrations.md#fluent_boards_wordpress_ai_generate) | WordPress AI provider output (short-circuit) |
| [`fluent_boards/mcp_ability_names`](./integrations.md#fluent_boards_mcp_ability_names) | MCP tools exposed |
| [`fluent_boards/mcp_server_namespace`](./integrations.md#fluent_boards_mcp_server_namespace) | MCP REST namespace |
| [`fluent_boards/mcp_server_route`](./integrations.md#fluent_boards_mcp_server_route) | MCP REST route |
| [`fluent_boards/mcp_is_local_dev`](./integrations.md#fluent_boards_mcp_is_local_dev) | Local-dev detection |
| [`fluent_boards/docs_url`](./integrations.md#fluent_boards_docs_url) <Badge type="tip" text="Pro" /> | Plugins screen Docs link |
| [`fluent_boards/community_support_url`](./integrations.md#fluent_boards_community_support_url) <Badge type="tip" text="Pro" /> | Plugins screen Support link |
| [`fluent_boards/license_grace_period_days`](./integrations.md#fluent_boards_license_grace_period_days) <Badge type="tip" text="Pro" /> | License grace period fallback |

## Removed or non-existent filters

- `fluent_boards/task_tabs` does not exist in FluentBoards or FluentBoards Pro. Each user's task tab order is saved as user meta from the task modal. No filter controls it.
