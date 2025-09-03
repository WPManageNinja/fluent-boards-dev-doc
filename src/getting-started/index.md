# What is FluentBoards?

<Badge type="tip" vertical="top" text="FluentBoards Core" /> <Badge type="warning" vertical="top" text="Basic" />

FluentBoards is a Project Management Plugin designed to facilitate collaborative work among team members. It offers the ability to showcase your team’s workflow directly on your WordPress site, eliminating the need for additional tools.

With FluentBoards, you can display your boards within the WordPress backend or on the front-end portal of your website. Packed with essential features, FluentBoards ensures seamless project planning and execution.

## What You Can Really Do / Extend

FluentBoards is a developer powerhouse. Think of these as capability lanes you can mix & match:

<div class="capabilities-showcase">
	<div class="cap-row">
		<div class="cap-icon">🧭</div>
		<div class="cap-body">
			<h3>Custom Menus & UI Surfaces</h3>
			<p>Add global navigation items, per‑board menu drawers, modal panels or extra task tabs without touching core.</p>
			<div class="badges">
				<code>fluent_boards/menu_items</code>
				<code>fluent_boards/board_menu_items</code>
				<code>fluent_boards/task_tabs</code>
			</div>
		</div>
	</div>
	<div class="cap-row">
		<div class="cap-icon">🧪</div>
		<div class="cap-body">
			<h3>Data Validation & Transformation</h3>
			<p>Enforce business rules, inject defaults, or reshape payloads before they persist to the database.</p>
			<div class="badges">
				<code>fluent_boards/before_task_create</code>
				<code>fluent_boards/before_create_board</code>
				<code>fluent_boards/uploaded_file_name_prefix</code>
			</div>
		</div>
	</div>
	<div class="cap-row">
		<div class="cap-icon">⚡️</div>
		<div class="cap-body">
			<h3>Reactive Automations</h3>
			<p>Listen to lifecycle events & trigger notifications, syncing, scoring or downstream processes.</p>
			<div class="badges">
				<code>fluent_boards/task_created</code>
				<code>fluent_boards/stage_updated</code>
				<code>fluent_boards/task_due_date_changed</code>
			</div>
		</div>
	</div>
	<div class="cap-row">
		<div class="cap-icon">🌐</div>
		<div class="cap-body">
			<h3>Headless / External Apps</h3>
			<p>Build dashboards, reporting layers or mobile apps over REST & Webhooks. Perfect for multi‑site orchestration.</p>
			<div class="badges">
				<code>GET /boards</code>
				<code>POST /tasks</code>
				<code>webhooks</code>
			</div>
		</div>
	</div>
	<div class="cap-row">
		<div class="cap-icon">🎨</div>
		<div class="cap-body">
			<h3>Branding & UX Polish</h3>
			<p>Adjust email header/footer, add priorities, reorder tabs, change logos, tailor copy & micro‑interactions.</p>
			<div class="badges">
				<code>fluent_boards/email_header</code>
				<code>fluent_boards/task_priorities</code>
				<code>fluent_boards/email_footer</code>
			</div>
		</div>
	</div>
	<div class="cap-row">
		<div class="cap-icon">🚀</div>
		<div class="cap-body">
			<h3>Scale with Confidence</h3>
			<p>Move from a 5‑line hook to full multi‑module integrations safely—keep everything in a separate add‑on plugin.</p>
			<div class="badges">
				<code>Hooks API</code>
				<code>Helper Functions</code>
				<code>Services</code>
			</div>
		</div>
	</div>
</div>

<p class="capabilities-foot-note alt">No core edits. Clean upgrade path. Compose capabilities like building blocks.</p>

::: tip Notes
The FluentBoards Developer Docs are the powerhouse for customization and extension of the FluentBoards app: one unified source for UI injections, data shaping, workflow automation, and cross‑platform integrations built on stable hooks, helper APIs, and a modern REST layer.
:::


<div class="getting-started-cards">
	<div class="gs-card">
		<h3>1. Explore the Data Model</h3>
		<p>Start with the <a href="/database/">Database Schema</a> & learn how boards, stages and tasks relate to each other.</p>
	</div>
	<div class="gs-card">
		<h3>2. Try the REST API</h3>
		<p>Use the <a href="/rest-api/">REST API</a> to fetch or create tasks from external services and automate workflows.</p>
	</div>
	<div class="gs-card">
		<h3>3. Extend via Hooks</h3>
		<p>Tap into <a href="/hooks/actions/">Action</a> & <a href="/hooks/filters/">Filter</a> hooks to modify default behavior cleanly.</p>
	</div>
	<div class="gs-card">
		<h3>4. Use Helper Functions</h3>
		<p>Speed up development with ready helpers & APIs listed under <a href="/global-functions/">Global Functions</a>.</p>
	</div>
</div>

## Requirements

| Component | Recommended | Minimum |
|-----------|-------------|---------|
| PHP       | 8.1+        | 7.4     |
| WordPress | 6.4+        | 5.9     |
| MySQL     | 5.7+ / MariaDB 10.3+ | 5.6 |
| Web Server| Nginx / Apache (mod_rewrite) | * |

Ensure `WP_DEBUG` is enabled on development sites for better error visibility.

## Install (Developer Flow)

1. Install the public plugin (Core or Pro) through the WP dashboard or by placing it into `wp-content/plugins/`.
2. Activate it in `Plugins` → `Installed Plugins`.
3. (Optional) For local development run build tools inside a clone of the plugin repository (if contributing core code).
4. Create a custom integration plugin (recommended) rather than editing core.

### Minimal Add‑On Boilerplate

```php
<?php
/**
 * Plugin Name: FluentBoards Dev Sample
 * Description: Demo extension showing how to hook into task creation.
 */

add_action('plugins_loaded', function() {
	// Safety: only run if FluentBoards is active
	if(!defined('FLUENT_BOARDS')) {
		return; 
	}

	// Example: append a suffix to every new task title
	add_action('fluent_boards/task_created', function($task){
		// $task is an Eloquent-like model instance
		$task->title = $task->title . ' ✅';
		$task->save();
	});
});
```

Drop that file in its own directory under `wp-content/plugins/fluentboards-dev-sample/fluentboards-dev-sample.php` and activate.

## FluentBoards Versions

FluentBoards comes in different versions:

**FluentBoards Core** is a free WordPress plugin.  A Board serves as a centralized hub for organizing workflow-related information. Whether you’re initiating a new project, planning, or managing ongoing tasks, the board provides a comprehensive overview of your team’s progress..

**FluentBoards Pro** is a paid version that adds a number of advanced features and options not found in the free version. It includes additional features such as: adding attachments to tasks, subtasks, custom fields, and more.

## Core Entities (Glossary)

| Entity | Description | Key Attributes |
|--------|-------------|----------------|
| Board  | Top level container for workflow | id, title, statuses, visibility |
| Stage  | A column / pipeline step within a board | id, board_id, position |
| Task   | Work item that moves across stages | id, board_id, stage_id, assignees, status |
| Label  | Color coded tag for grouping tasks | id, name, color |
| Comment| Discussion entry on a task | id, task_id, user_id, content |
| Webhook| Outbound event trigger | id, event, url |

Understanding these first reduces debugging time later.

## Directory Structure

```yaml
├── app
│   ├── Api         # contains PHP API Utility classes
│   └── Functions   # contains global functions
│   └── Hooks       # actions and filters handlers
│   └── Http        # REST API routes, controllers, policies
│   └── Models      # Database Molders
│   └── Services    # Module Services
│   └── views       # php view files
│   └── App.php
│
├── assets          # contains css,js, media files
├── boot            # [internal] contains plugin boot files
├── config          # [internal] contains plugin framework top level config
├── database        # [internal] Database migration files
├── includes        # [internal] Old Framework deprecated classes
├── language        # [internal] Language Files
├── vendor          # [internal] Core Framework Files
│
└── fluent-boards.php  # Plugin entry File
```


## Development Environment (Short List)

| Need | Recommended |
|------|-------------|
| Code Editor | VS Code / PhpStorm |
| Local Site | wp-env, Lando, DDEV, Laravel Herd,  Valet, or any AMP stack |
| Debug | `WP_DEBUG` + (optional) Xdebug |
| API Tests | curl / Postman / Bruno |
| Versioning | Git (keep add‑ons separate) |

::: tip
Keep custom code in a separate plugin so updates never overwrite your work.
:::

## Community & Support

<div class="community-links">
	<ul class="resource-badges">
		<li><a class="badge-link site" href="https://fluentboards.com/" target="_blank" rel="noopener">🌐 Website</a></li>
		<li><a class="badge-link docs" href="https://fluentboards.com/docs/" target="_blank" rel="noopener">📘 User Docs</a></li>
		<li><a class="badge-link dev" href="/getting-started/">🛠 Developer Docs</a></li>
		<li><a class="badge-link blog" href="https://fluentboards.com/blog/" target="_blank" rel="noopener">📰 Blog & Releases</a></li>
		<li><a class="badge-link community" href="https://community.wpmanageninja.com/portal/space/fluent-boards/" target="_blank" rel="noopener">👥 Community Portal</a></li>
		<li><a class="badge-link roadmap" href="https://community.wpmanageninja.com/road-maps/fluent-boards/" target="_blank" rel="noopener">🧭 Official Roadmap</a></li>
		<li><a class="badge-link facebook" href="https://www.facebook.com/groups/fluentcrm" target="_blank" rel="noopener">💬 Facebook Group</a></li>
		<li><a class="badge-link support" href="https://wpmanageninja.com/support-tickets/" target="_blank" rel="noopener">🆘 Technical Support</a></li>
		<li><a class="badge-link feature" href="https://community.wpmanageninja.com/road-maps/fluent-boards/" target="_blank" rel="noopener">💡 Feature Requests</a></li>
	</ul>
	<p class="hint">Need something else? Open a support ticket or propose an idea in the community portal.</p>
</div>

### When to Use What
* User-facing configuration question → User Docs
* Building / extending via code → Developer Docs & Hooks sections
* Suspected bug → Reproduce on clean install, then open issue / ticket
* Integration idea / enhancement → Feature request channel

### Contributing Improvements
Small wording fixes, examples, and missing hook docs are welcome. Use the "Edit this page" link to submit a PR. Keep examples minimal & runnable.


## REST API Authentication

By default endpoints are namespaced under: `/wp-json/fluent-boards/v1/`.

Use one of:

1. Cookie + Nonce (browser / WP admin context) – send `X-WP-Nonce` header.
2. Application Passwords (Basic Auth) – for server-to-server integrations.
3. OAuth / JWT (custom) – implement your own auth layer via hooks if needed.

Example (Application Password) request:

```bash
curl -u user:app_password \
	https://example.com/wp-json/fluent-boards/v1/boards
```

## Create a Task (Examples)

### Via REST
```bash
curl -u user:app_password \
	-H 'Content-Type: application/json' \
	-d '{
				"board_id": 12,
				"stage_id": 45,
				"title": "Research API Endpoints",
				"description": "Collect requirements and draft spec"
			}' \
	https://example.com/wp-json/fluent-boards/v1/tasks
```

### Via PHP (Inside Your Add‑On)
```php
use FluentBoards\App\Models\Task;

$task = Task::create([
		'board_id'    => 12,
		'stage_id'    => 45,
		'title'       => 'Research API Endpoints',
		'description' => 'Collect requirements and draft spec',
		'created_by'  => get_current_user_id(),
]);
```

## Debug Tips

- Enable query log: define `FB_DEBUG_SQL` true (if available) or use standard WP `SAVEQUERIES`.
- Use the browser network panel to inspect REST payloads your own UI triggers.
- Log hook payloads: `error_log(print_r($task->toArray(), true));`

---
Need something not covered here? Open an issue or PR via the Edit link at the top of the page.

