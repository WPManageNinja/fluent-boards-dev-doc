# Modules and Extending FluentBoards

<Badge type="tip" vertical="top" text="FluentBoards Core" />

FluentBoards organizes work as **boards** that contain **stages** (columns), which contain **tasks**. The pages in this section are task-oriented guides for each of these objects. They show how to work with them from your own plugin through the PHP API, and where to hook in.

| Page | What it covers |
|---|---|
| [Boards](/modules/boards) | Listing boards, creating a board (with default stages and labels), reading stages and labels, creating labels |
| [Stages](/modules/stages) | Listing and reading stages, adding a stage, renaming or recoloring it, setting its default task status, archiving and restoring |
| [Tasks](/modules/tasks) | Creating tasks, assigning users and labels, moving tasks between stages, updating fields, subtasks and attachments (Pro) |
| [Navigation](/modules/navigation-modules) | Adding items to the top navigation and to the board menu, and customizing the app URL, logo and icon |

For the full method signatures and return values, see the API reference pages: [Boards API](/global-functions/boards-api-function), [Stages API](/global-functions/stages-api-function) and [Tasks API](/global-functions/tasks-api-function).

## Building an add-on

Keep your code in its own plugin so FluentBoards updates never overwrite it. A typical add-on:

1. **Waits for FluentBoards to load.** FluentBoards fires `fluent_boards_loaded` (with the application instance) on `plugins_loaded`. Register that listener when your plugin file loads, not inside another `plugins_loaded` callback that runs later.
2. **Uses the PHP API for writes.** `FluentBoardsApi('boards' | 'stages' | 'tasks')` checks the current user's permissions and runs the same services as the app, so positions, activities and hooks stay consistent.
3. **Uses the models for reads the API does not cover.** The models are in `FluentBoards\App\Models` (`Board`, `Stage`, `Task`, `Label`, `Comment`, …). See [Models](/database/models/).
4. **Reacts to events with hooks.** See [Action hooks](/hooks/actions/) (for example `fluent_boards/task_created`, `fluent_boards/board_created`, `fluent_boards/task_stage_updated`) and [Filter hooks](/hooks/filters/) (for example `fluent_boards/before_task_create`, `fluent_boards/task_priorities`).
5. **Exposes data remotely through the REST API** under `/wp-json/fluent-boards/v2/`. See [REST API](/rest-api/).

```php
<?php
/**
 * Plugin Name: My Boards Add-on
 */

defined('ABSPATH') || exit;

add_action('fluent_boards_loaded', function ($app) {

    // Label every new task that comes from a specific source
    add_action('fluent_boards/task_created', function ($task) {
        if ($task->source !== 'my-addon') {
            return;
        }

        $labels = FluentBoardsApi('boards')->getLabels($task->board_id);
        $label  = $labels ? $labels->firstWhere('title', 'Imported') : null;

        if ($label) {
            FluentBoardsApi('tasks')->attachLabels($task->id, [$label->id]);
        }
    });

    // Rename the "Urgent" priority (keys stay the same, only labels change)
    add_filter('fluent_boards/task_priorities', function ($priorities) {
        $priorities['urgent'] = __('Fire!', 'my-addon');
        return $priorities;
    });
});
```

::: tip Permissions in background jobs
The PHP API checks the **current** WordPress user. In cron jobs, Action Scheduler callbacks, webhooks or WP-CLI there is often no user, so calls return `false`. Switch to a user who has access with `wp_set_current_user($userId)` before you call the API.
:::

## Modules in the code base

"Module" also refers to optional feature modules that can be switched on in **Settings → Modules**. Their state is stored in the WordPress option `fluent_boards_modules` and read with [`fluent_boards_get_pref_settings()`](/global-functions/#fluent-boards-get-pref-settings).

| Module | Where | Notes |
|---|---|---|
| Time tracking | Pro: `app/Modules/TimeTracking` | Adds the `fbs_time_tracks` table and timer endpoints. Pref key `timeTracking`. |
| Frontend portal | Pro | Serves the app on a front-end page or slug. Pref key `frontend`. |
| Recurring tasks | Pro | Pref key `recurring_task` |
| Cloud storage | Pro: `app/Modules/CloudStorage` | S3, Cloudflare R2, DigitalOcean Spaces and Backblaze drivers. Flag `cloud_storage` in [`fluent_boards_get_features_config()`](/global-functions/#fluent-boards-get-features-config). |
| MCP / AI abilities | Core and Pro: `app/Modules/MCP` | Registers board, stage, task and comment abilities through the WordPress Abilities API, exposed on a FluentBoards MCP server when the WP MCP Adapter is installed. Extend it on `fluent_boards/mcp_loaded`. |
| Menu placement | Core | Show FluentBoards inside the FluentCRM menu. Pref key `menu_settings`. |
