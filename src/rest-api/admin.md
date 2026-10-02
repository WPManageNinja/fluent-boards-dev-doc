# Admin Settings

Global settings for FluentBoards: feature modules and add-ons, general settings, the MCP connection for AI agents, the WordPress pages picker, and the Pro license. Plugin source: free (settings, MCP, pages) and Pro (license).

All endpoints require a WordPress administrator or a FluentBoards admin. Saving modules and general settings also requires Fluent Boards Pro.

Related admin pages: [Folders](/rest-api/folders), [Managers & Roles](/rest-api/permissions), [Cloud Storage](/rest-api/cloud-storage), [Webhooks](/rest-api/webhooks), [AI](/rest-api/ai).

## Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/admin/feature-modules` | Get feature modules and add-on plugins |
| POST | `/admin/feature-modules` | Save feature modules (Pro) |
| POST | `/admin/feature-modules/install-plugin` | Install/activate a companion plugin |
| GET | `/admin/general-settings` | Get general settings |
| POST | `/admin/general-settings` | Save general settings (Pro) |
| GET | `/admin/pages` | List published WordPress pages |
| GET | `/admin/mcp/status` | MCP adapter status |
| POST | `/admin/mcp/toggle` | Enable or disable FluentBoards MCP tools |
| POST | `/admin/mcp/install-adapter` | Install the FluentHub MCP adapter |
| GET | `/admin/mcp/config-snippet` | MCP client configuration snippet |
| GET | `/license` | License status (Pro) |
| POST | `/license` | Activate a license key (Pro) |
| DELETE | `/license` | Deactivate the license (Pro) |

## Get Feature Modules

Returns the add-on plugins shown on the Modules screen and the stored module preferences (WordPress option `fluent_boards_modules`).

```http
GET /wp-json/fluent-boards/v2/admin/feature-modules
```

**Example Request**

```bash
curl "https://yourdomain.com/wp-json/fluent-boards/v2/admin/feature-modules" \
  -u "USERNAME:APPLICATION_PASSWORD"
```

**Example Response**

```json
{
  "addons": {
    "fluent-crm": {
      "title": "FluentCRM",
      "logo": "https://yourdomain.com/wp-content/plugins/fluent-boards/assets/images/addons/fluent-crm.svg",
      "is_installed": true,
      "learn_more_url": "https://fluentcrm.com/",
      "associate_doc": "https://fluentboards.com/docs/fluentboards-integration-with-fluentcrm/",
      "action_text": "Activate FluentCRM",
      "description": "FluentCRM is a Self Hosted Email Marketing Automation Plugin for WordPress...",
      "short_desc": "Email marketing automation"
    }
  },
  "featureModules": {
    "timeTracking": { "enabled": "no", "all_boards": "yes", "selected_boards": [] },
    "frontend": { "enabled": "no", "slug": "projects", "render_type": "standalone", "page_id": "" },
    "menu_settings": { "in_fluent_crm": "no", "menu_position": 3 },
    "recurring_task": { "enabled": "no", "all_boards": "yes", "selected_boards": [] },
    "panel_url": "https://yourdomain.com/wp-admin/admin.php?page=fluent-boards#/"
  }
}
```

`addons` keys: `fluent-crm`, `fluentform`, `fluent-support`, `fluent-smtp`, `fluent-toolkit` (filter `fluent_boards/addons_settings`).

## Save Feature Modules <Badge type="tip" text="Pro" />

Merges the given modules into the stored preferences. Only the known top-level keys (`timeTracking`, `frontend`, `menu_settings`, `recurring_task`) are kept. `frontend.slug` is sanitized and falls back to `projects`; when the `FLUENT_BOARDS_SLUG` constant is defined, it always overrides the sent slug.

```http
POST /wp-json/fluent-boards/v2/admin/feature-modules
```

**Parameters**

| Parameter | Type | Required | Description |
|---|---|---|---|
| `settings` | object | Yes | Module settings, same shape as `featureModules` above |

**Example Request**

```bash
curl -X POST "https://yourdomain.com/wp-json/fluent-boards/v2/admin/feature-modules" \
  -u "USERNAME:APPLICATION_PASSWORD" \
  -H "Content-Type: application/json" \
  -d '{
    "settings": {
      "timeTracking": { "enabled": "yes", "all_boards": "yes", "selected_boards": [] },
      "frontend": { "enabled": "yes", "slug": "projects", "render_type": "standalone", "page_id": "" }
    }
  }'
```

**Example Response**

```json
{
  "message": "Settings are saved",
  "featureModules": {
    "timeTracking": { "enabled": "yes", "all_boards": "yes", "selected_boards": [] },
    "frontend": { "enabled": "yes", "slug": "projects", "render_type": "standalone", "page_id": "" },
    "menu_settings": { "in_fluent_crm": "no", "menu_position": 3 },
    "recurring_task": { "enabled": "no", "all_boards": "yes", "selected_boards": [] }
  }
}
```

Without Pro the endpoint returns `422` (`This feature is only available in Fluent Boards Pro`).

## Install Companion Plugin

Installs and activates a companion plugin from WordPress.org. Requires the `install_plugins` capability.

```http
POST /wp-json/fluent-boards/v2/admin/feature-modules/install-plugin
```

**Parameters**

| Parameter | Type | Required | Description |
|---|---|---|---|
| `plugin` | string | Yes | `fluent-crm`, `fluentform`, `fluent-support` or `fluent-smtp` (more via filter `fluent_boards/accepted_plugins`) |

**Example Request**

```bash
curl -X POST "https://yourdomain.com/wp-json/fluent-boards/v2/admin/feature-modules/install-plugin" \
  -u "USERNAME:APPLICATION_PASSWORD" \
  -H "Content-Type: application/json" \
  -d '{"plugin": "fluent-smtp"}'
```

**Example Response**

```json
{
  "message": "Plugin is being installed"
}
```

## Get General Settings

```http
GET /wp-json/fluent-boards/v2/admin/general-settings
```

**Example Request**

```bash
curl "https://yourdomain.com/wp-json/fluent-boards/v2/admin/general-settings" \
  -u "USERNAME:APPLICATION_PASSWORD"
```

**Example Response**

```json
{
  "settings": {
    "daily_reminder_enabled": "true",
    "daily_remind_at": "08:00",
    "business_name": "Acme Inc",
    "business_address": "1 Main Street, Springfield",
    "business_logo": "https://yourdomain.com/wp-content/uploads/logo.png",
    "allow_members_to_create_boards": true
  },
  "server_timezone": "Europe/London"
}
```

`settings` is whatever was last saved (an empty array before the first save).

## Save General Settings <Badge type="tip" text="Pro" />

Replaces the general settings. Every value is sanitized as text (booleans and numbers are kept). When `daily_reminder_enabled` is truthy, the daily reminder is rescheduled. Extra keys can be handled with the `fluent_boards/save_general_settings` filter.

```http
POST /wp-json/fluent-boards/v2/admin/general-settings
```

**Parameters**

| Parameter | Type | Required | Description |
|---|---|---|---|
| `updatedSettings` | object | Yes | Flat key/value settings |

Keys used by the settings screen: `daily_reminder_enabled`, `daily_remind_at`, `business_name`, `business_address`, `business_logo`, `allow_members_to_create_boards`.

**Example Request**

```bash
curl -X POST "https://yourdomain.com/wp-json/fluent-boards/v2/admin/general-settings" \
  -u "USERNAME:APPLICATION_PASSWORD" \
  -H "Content-Type: application/json" \
  -d '{
    "updatedSettings": {
      "daily_reminder_enabled": true,
      "daily_remind_at": "08:00",
      "business_name": "Acme Inc",
      "allow_members_to_create_boards": false
    }
  }'
```

**Example Response**

```json
{
  "settings": {
    "daily_reminder_enabled": true,
    "daily_remind_at": "08:00",
    "business_name": "Acme Inc",
    "allow_members_to_create_boards": false
  },
  "message": "Settings are saved"
}
```

## List Pages

Published WordPress pages, sorted by title. Used to pick the page that hosts the frontend portal.

```http
GET /wp-json/fluent-boards/v2/admin/pages
```

**Example Request**

```bash
curl "https://yourdomain.com/wp-json/fluent-boards/v2/admin/pages" \
  -u "USERNAME:APPLICATION_PASSWORD"
```

**Example Response**

```json
{
  "pages": [
    { "id": 12, "title": "Projects", "url": "https://yourdomain.com/projects/" },
    { "id": 2, "title": "Sample Page", "url": "https://yourdomain.com/sample-page/" }
  ]
}
```

## MCP Status

FluentBoards registers its tools as WordPress abilities. An MCP adapter (the standalone `mcp-adapter` plugin or the one bundled in FluentHub) exposes them to AI agents over HTTP. This endpoint reports what is installed and active.

```http
GET /wp-json/fluent-boards/v2/admin/mcp/status
```

**Example Request**

```bash
curl "https://yourdomain.com/wp-json/fluent-boards/v2/admin/mcp/status" \
  -u "USERNAME:APPLICATION_PASSWORD"
```

**Example Response**

```json
{
  "adapter_installed": true,
  "adapter_active": true,
  "adapter_provider": "toolkit",
  "standalone_adapter_installed": false,
  "toolkit_installed": true,
  "toolkit_active": true,
  "toolkit_adapter_available": true,
  "adapter_runtime_available": true,
  "adapter_version": "0.3.0",
  "toolkit_version": "1.2.0",
  "abilities_api_loaded": true,
  "endpoint_url": "https://yourdomain.com/wp-json/fluent-boards/mcp",
  "tools_count": 42,
  "mcp_enabled": true,
  "app_passwords_url": "https://yourdomain.com/wp-admin/profile.php#application-passwords-section",
  "plugins_url": "https://yourdomain.com/wp-admin/plugins.php",
  "can_auto_install_adapter": false,
  "toolkit_download_url": "https://github.com/WPManageNinja/fluent-toolkit",
  "current_user_login": "admin",
  "is_local_dev": false
}
```

`adapter_provider` is `plugin`, `toolkit` or an empty string. `tools_count` is `0` when the WordPress Abilities API is not loaded.

## Toggle MCP Tools

Turns the FluentBoards MCP tools on or off (option `mcp_enabled`, default on).

```http
POST /wp-json/fluent-boards/v2/admin/mcp/toggle
```

**Parameters**

| Parameter | Type | Required | Description |
|---|---|---|---|
| `mcp_enabled` | boolean\|string | Yes | `true`, `"yes"`, `"true"` or `"1"` enables; anything else disables |

**Example Request**

```bash
curl -X POST "https://yourdomain.com/wp-json/fluent-boards/v2/admin/mcp/toggle" \
  -u "USERNAME:APPLICATION_PASSWORD" \
  -H "Content-Type: application/json" \
  -d '{"mcp_enabled": true}'
```

**Example Response**

```json
{
  "ok": true,
  "mcp_enabled": true,
  "message": "MCP tools enabled. New requests will see the Fluent Boards abilities."
}
```

## Install MCP Adapter

Installs and activates FluentHub (which bundles the MCP adapter). Requires the `install_plugins` capability and only works when auto-install is allowed (filter `fluent_kit/can_auto_install` or `fluent_toolkit/can_auto_install`); otherwise it returns `422` with `toolkit_download_url` for a manual install.

```http
POST /wp-json/fluent-boards/v2/admin/mcp/install-adapter
```

**Example Request**

```bash
curl -X POST "https://yourdomain.com/wp-json/fluent-boards/v2/admin/mcp/install-adapter" \
  -u "USERNAME:APPLICATION_PASSWORD"
```

**Example Response**

```json
{
  "is_installed": true,
  "adapter_active": true,
  "toolkit_active": true,
  "toolkit_adapter_available": true,
  "message": "FluentHub installed and activated. Reload the page to register Fluent Boards MCP tools."
}
```

## Get MCP Config Snippet

Returns a ready-to-paste configuration for an MCP client. Credentials are placeholders: fill in a WordPress username and Application Password.

```http
GET /wp-json/fluent-boards/v2/admin/mcp/config-snippet
```

**Parameters**

| Parameter | Type | Required | Description |
|---|---|---|---|
| `client` | string | No | `claude-code` (default), `claude-desktop`, `cursor`, `codex` or `generic` |
| `local_dev` | string | No | `yes`/`no` to override local-development detection (reported in `is_local_dev`) |

**Example Request**

```bash
curl "https://yourdomain.com/wp-json/fluent-boards/v2/admin/mcp/config-snippet?client=cursor" \
  -u "USERNAME:APPLICATION_PASSWORD"
```

**Example Response**

```json
{
  "client": "cursor",
  "snippet": "{\n    \"mcpServers\": {\n        \"fluent-boards\": {\n            \"url\": \"https://yourdomain.com/wp-json/fluent-boards/mcp\",\n            \"type\": \"http\",\n            \"headers\": {\n                \"Authorization\": \"Basic <base64(your-username:application-password)>\"\n            }\n        }\n    }\n}",
  "instructions": "Paste this into Cursor Settings > MCP, then restart Cursor.",
  "endpoint": "https://yourdomain.com/wp-json/fluent-boards/mcp",
  "app_passwords_url": "https://yourdomain.com/wp-admin/profile.php#application-passwords-section",
  "is_local_dev": false
}
```

An unknown `client` falls back to `claude-code`.

## Get License Status <Badge type="tip" text="Pro" />

Checks the license with the store and returns display-ready data. The raw license key and activation hash are never returned. If the store cannot be reached, the locally stored status is returned with `connection_error: true`.

```http
GET /wp-json/fluent-boards/v2/license
```

**Example Request**

```bash
curl "https://yourdomain.com/wp-json/fluent-boards/v2/license" \
  -u "USERNAME:APPLICATION_PASSWORD"
```

**Example Response**

```json
{
  "status": "valid",
  "variation_id": "2",
  "variation_title": "Agency",
  "expires": "2026-09-30 23:59:59",
  "last_checked": "2025-10-02 10:00:00",
  "renew_url": "https://fluentboards.com/account/",
  "purchase_url": "https://fluentboards.com/pricing/",
  "account_url": "https://fluentboards.com/account/",
  "support_url": "https://fluentboards.com/support/",
  "license_key_masked": "A1B2••••••••••••••••7F3A",
  "masked_license_key": "A1B2••••••••••••••••7F3A",
  "product_title": "Fluent Boards Pro",
  "is_lifetime": false,
  "expires_human": "September 30, 2026",
  "days_remaining": 363,
  "last_checked_human": "5 mins ago",
  "in_grace_period": false,
  "grace_period_days": null
}
```

`status` is `valid`, `expired`, `unregistered` or another status reported by the store. `masked_license_key` is a legacy alias of `license_key_masked`. `in_grace_period` is true when a `valid` license is past its expiry date but still inside the store's grace window.

## Activate License <Badge type="tip" text="Pro" />

```http
POST /wp-json/fluent-boards/v2/license
```

**Parameters**

| Parameter | Type | Required | Description |
|---|---|---|---|
| `license_key` | string | Yes | License key |

**Example Request**

```bash
curl -X POST "https://yourdomain.com/wp-json/fluent-boards/v2/license" \
  -u "USERNAME:APPLICATION_PASSWORD" \
  -H "Content-Type: application/json" \
  -d '{"license_key": "XXXX-XXXX-XXXX-7F3A"}'
```

**Example Response**

```json
{
  "license_data": {
    "status": "valid",
    "license_key_masked": "A1B2••••••••••••••••7F3A",
    "expires_human": "September 30, 2026"
  },
  "message": "Your license key has been successfully updated"
}
```

`license_data` has the same shape as [Get License Status](#get-license-status). An invalid key returns `422` with the store's `message`.

## Deactivate License <Badge type="tip" text="Pro" />

```http
DELETE /wp-json/fluent-boards/v2/license
```

**Example Request**

```bash
curl -X DELETE "https://yourdomain.com/wp-json/fluent-boards/v2/license" \
  -u "USERNAME:APPLICATION_PASSWORD"
```

**Example Response**

```json
{
  "license_data": {
    "status": "unregistered",
    "license_key_masked": ""
  },
  "message": "Your license key has been successfully deactivated"
}
```

See [Common Error Responses](/rest-api/shared/error-responses) for standard error formats.
