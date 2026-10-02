# FluentBoards Action Hooks

<Badge type="tip" vertical="top" text="FluentBoards Core" /> <Badge type="warning" vertical="top" text="Intermediate" />

FluentBoards fires many action hooks. Use them to run your own code when something happens in FluentBoards, for example when a board is created, a task moves to another stage or a comment is posted.

## What are Action Hooks

Action hooks let you run custom code when certain events occur. You attach a callback with `add_action()`. FluentBoards calls it with the arguments listed for each hook. Always pass the correct number of accepted arguments (the 4th parameter of `add_action()`). If you omit it, WordPress passes only the first argument.

```php
add_action('fluent_boards/task_created', function ($task) {
    // $task is a \FluentBoards\App\Models\Task
}, 10, 1);
```

Conventions used on these pages:

- Almost every hook name starts with `fluent_boards/`. The few legacy exceptions are noted on the hook.
- <Badge type="tip" text="Pro" /> means the hook fires only when FluentBoards Pro is active. Hooks without the badge are fired by the free plugin. Pro may fire some of them too.
- **Source** paths are relative to the plugin root. Paths that start with `fluent-boards-pro/` are in the Pro plugin.
- Model arguments are WPFluent ORM models, for example `\FluentBoards\App\Models\Task` or `\FluentBoards\App\Models\Board`.

## Available Action Hooks

### Boards, Members, Stages, Labels & Templates

See [Board Action Hooks](./boards.md).

| Hook | Fires when |
|---|---|
| [`fluent_boards/board_created`](./boards.md#fluent_boards_board_created) | A board is created |
| [`fluent_boards/board_updated`](./boards.md#fluent_boards_board_updated) | Board details are updated |
| [`fluent_boards/before_board_deleted`](./boards.md#fluent_boards_before_board_deleted) | A board is about to be deleted |
| [`fluent_boards/board_archived`](./boards.md#fluent_boards_board_archived) | A board is archived |
| [`fluent_boards/board_restored`](./boards.md#fluent_boards_board_restored) | An archived board is restored |
| [`fluent_boards/board_background_updated`](./boards.md#fluent_boards_board_background_updated) | A board background changes |
| [`fluent_boards/contact_added_to_board`](./boards.md#fluent_boards_contact_added_to_board) | A FluentCRM contact is linked to a board |
| [`fluent_boards/board_member_added`](./boards.md#fluent_boards_board_member_added) | A user gets member access |
| [`fluent_boards/board_viewer_added`](./boards.md#fluent_boards_board_viewer_added) | A user gets viewer access |
| [`fluent_boards/board_admin_added`](./boards.md#fluent_boards_board_admin_added) | A user becomes a board admin |
| [`fluent_boards/board_admin_removed`](./boards.md#fluent_boards_board_admin_removed) | A user loses board admin rights |
| [`fluent_boards/send_invitation`](./boards.md#fluent_boards_send_invitation) | An email without an account is invited |
| [`fluent_boards/board_stage_added`](./boards.md#fluent_boards_board_stage_added) | A stage is added |
| [`fluent_boards/stage_updated`](./boards.md#fluent_boards_stage_updated) | A stage title or color changes |
| [`fluent_boards/board_stages_reordered`](./boards.md#fluent_boards_board_stages_reordered) | Stages are reordered |
| [`fluent_boards/stage_archived_with_tasks`](./boards.md#fluent_boards_stage_archived_with_tasks) | A stage is archived |
| [`fluent_boards/stage_archived`](./boards.md#fluent_boards_stage_archived) | A stage is archived (legacy) |
| [`fluent_boards/stage_restored_with_tasks`](./boards.md#fluent_boards_stage_restored_with_tasks) | A stage is restored |
| [`fluent_boards/board_stage_restored`](./boards.md#fluent_boards_board_stage_restored) | A stage is restored (legacy) |
| [`fluent_boards/tasks_moved_between_stages`](./boards.md#fluent_boards_tasks_moved_between_stages) | All tasks of a stage are moved |
| [`fluent_boards/default_assignees_updated`](./boards.md#fluent_boards_default_assignees_updated) | Stage default assignees change |
| [`fluent_boards/default_watchers_updated`](./boards.md#fluent_boards_default_watchers_updated) | Stage default watchers change |
| [`fluent_boards/board_label_created`](./boards.md#fluent_boards_board_label_created) | A board label is created |
| [`fluent_boards/board_label_updated`](./boards.md#fluent_boards_board_label_updated) | A board label is edited |
| [`fluent_boards/board_label_deleted`](./boards.md#fluent_boards_board_label_deleted) | A board label is deleted |
| [`fluent_boards/board_created_from_template`](./boards.md#fluent_boards_board_created_from_template) <Badge type="tip" text="Pro" /> | A board is created from a template |
| [`fluent_boards/board_created_from_automation`](./boards.md#fluent_boards_board_created_from_automation) <Badge type="tip" text="Pro" /> | A FluentCRM automation creates a board |
| [`fluent_boards/board_converted_to_template`](./boards.md#fluent_boards_board_converted_to_template) <Badge type="tip" text="Pro" /> | A board is turned into a template |
| [`fluent_boards/template_converted_to_board`](./boards.md#fluent_boards_template_converted_to_board) <Badge type="tip" text="Pro" /> | A template is turned into a board |

### Tasks, Subtasks, Attachments & Time Tracking

See [Task Action Hooks](./tasks.md).

| Hook | Fires when |
|---|---|
| [`fluent_boards/task_created`](./tasks.md#fluent_boards_task_created) | A top-level task is created |
| [`fluent_boards/task_updated`](./tasks.md#fluent_boards_task_updated) | A task is moved (position) |
| [`fluent_boards/task_stage_updated`](./tasks.md#fluent_boards_task_stage_updated) | A task changes stage |
| [`fluent_boards/task_content_updated`](./tasks.md#fluent_boards_task_content_updated) | Task title or description changes |
| [`fluent_boards/task_completed_activity`](./tasks.md#fluent_boards_task_completed_activity) | A task is completed or reopened |
| [`fluent_boards/task_priority_changed`](./tasks.md#fluent_boards_task_priority_changed) | Task priority changes |
| [`fluent_boards/task_date_changed`](./tasks.md#fluent_boards_task_date_changed) | Task dates are saved and changed |
| [`fluent_boards/task_due_date_changed`](./tasks.md#fluent_boards_task_due_date_changed) | A due date is set |
| [`fluent_boards/task_due_date_removed`](./tasks.md#fluent_boards_task_due_date_removed) | A due date is cleared |
| [`fluent_boards/task_start_date_changed`](./tasks.md#fluent_boards_task_start_date_changed) | A start date is set |
| [`fluent_boards/task_reminder_type_changed`](./tasks.md#fluent_boards_task_reminder_type_changed) | The reminder type is saved |
| [`fluent_boards/task_archived`](./tasks.md#fluent_boards_task_archived) | A task is archived or restored |
| [`fluent_boards/task_assignee_added`](./tasks.md#fluent_boards_task_assignee_added) | A user is assigned |
| [`fluent_boards/assign_another_user`](./tasks.md#fluent_boards_assign_another_user) | Someone other than the current user is assigned |
| [`fluent_boards/task_assignee_removed`](./tasks.md#fluent_boards_task_assignee_removed) | A user is unassigned |
| [`fluent_boards/task_label`](./tasks.md#fluent_boards_task_label) | A label is added to or removed from a task |
| [`fluent_boards/task_moved_from_board`](./tasks.md#fluent_boards_task_moved_from_board) | A task moves to another board |
| [`fluent_boards/task_cloned`](./tasks.md#fluent_boards_task_cloned) | A task is duplicated |
| [`fluent_boards/task_cloned_activity`](./tasks.md#fluent_boards_task_cloned_activity) | After clone activity cleanup |
| [`fluent_boards/before_task_deleted`](./tasks.md#fluent_boards_before_task_deleted) | A task is about to be deleted |
| [`fluent_boards/task_deleted`](./tasks.md#fluent_boards_task_deleted) | A task was deleted (after commit) |
| [`fluent_boards/bulk_action_completed`](./tasks.md#fluent_boards_bulk_action_completed) | A bulk task action finishes |
| [`fluent_boards/task_moved_update_time_tracking`](./tasks.md#fluent_boards_task_moved_update_time_tracking) | A task moves boards (time tracking) |
| [`fluent_boards/subtask_added`](./tasks.md#fluent_boards_subtask_added) <Badge type="tip" text="Pro" /> | A subtask is added |
| [`fluent_boards/subtask_cloned`](./tasks.md#fluent_boards_subtask_cloned) <Badge type="tip" text="Pro" /> | A subtask is duplicated |
| [`fluent_boards/subtask_deleted_activity`](./tasks.md#fluent_boards_subtask_deleted_activity) | A subtask is deleted |
| [`fluent_boards/subtask_group_created`](./tasks.md#fluent_boards_subtask_group_created) <Badge type="tip" text="Pro" /> | A subtask group is created |
| [`fluent_boards/subtask_group_title_updated`](./tasks.md#fluent_boards_subtask_group_title_updated) <Badge type="tip" text="Pro" /> | A subtask group is renamed |
| [`fluent_boards/subtask_group_deleted_activity`](./tasks.md#fluent_boards_subtask_group_deleted_activity) <Badge type="tip" text="Pro" /> | A subtask group is deleted |
| [`fluent_boards/task_attachment_added`](./tasks.md#fluent_boards_task_attachment_added) <Badge type="tip" text="Pro" /> | An attachment is added |
| [`fluent_boards/task_attachment_deleted`](./tasks.md#fluent_boards_task_attachment_deleted) | An attachment or cover image is deleted |
| [`fluent_boards/task_custom_field_changed`](./tasks.md#fluent_boards_task_custom_field_changed) <Badge type="tip" text="Pro" /> | A custom field value is saved |
| [`fluent_boards/task_dependency_added`](./tasks.md#fluent_boards_task_dependency_added) <Badge type="tip" text="Pro" /> | A task dependency is added |
| [`fluent_boards/task_dependency_removed`](./tasks.md#fluent_boards_task_dependency_removed) <Badge type="tip" text="Pro" /> | A task dependency is removed |
| [`fluent_boards/repeat_task_set`](./tasks.md#fluent_boards_repeat_task_set) <Badge type="tip" text="Pro" /> | Recurrence is enabled on a task |
| [`fluent_boards/repeat_task_updated`](./tasks.md#fluent_boards_repeat_task_updated) <Badge type="tip" text="Pro" /> | Recurrence settings change |
| [`fluent_boards/repeat_task`](./tasks.md#fluent_boards_repeat_task) <Badge type="tip" text="Pro" /> | A recurring task is due to repeat |
| [`fluent_boards/repeat_task_created`](./tasks.md#fluent_boards_repeat_task_created) <Badge type="tip" text="Pro" /> | The next recurring copy is created |
| [`fluent_boards/task_added_from_fluent_form`](./tasks.md#fluent_boards_task_added_from_fluent_form) | Fluent Forms creates a task |
| [`fluent_boards/contact_added_to_task`](./tasks.md#fluent_boards_contact_added_to_task) | A FluentCRM contact is linked to a task |
| [`fluent_boards/associate_user_add_change_remove_activity`](./tasks.md#fluent_boards_associate_user_add_change_remove_activity) | A task's CRM contact changes |
| [`fluent_boards/support_ticket_unlinked`](./tasks.md#fluent_boards_support_ticket_unlinked) | A Fluent Support ticket is unlinked |

### Comments, Notifications & Users

See [Comment & User Action Hooks](./comments.md).

| Hook | Fires when |
|---|---|
| [`fluent_boards/comment_created`](./comments.md#fluent_boards_comment_created) | A comment or reply is added |
| [`fluent_boards/comment_updated`](./comments.md#fluent_boards_comment_updated) | A comment is edited |
| [`fluent_boards/comment_deleted`](./comments.md#fluent_boards_comment_deleted) | A comment is deleted |
| [`fluent_boards/mention_comment_notification`](./comments.md#fluent_boards_mention_comment_notification) | Users are mentioned in a comment |
| [`fluent_boards/profile_name_updated`](./comments.md#fluent_boards_profile_name_updated) | A user changes their display name |
| [`fluent_boards/profile_photo_updated`](./comments.md#fluent_boards_profile_photo_updated) | A user uploads a profile photo |

### App, Admin UI, Settings & MCP

See [App & Admin Action Hooks](./app.md).

| Hook | Fires when |
|---|---|
| [`fluent_boards_loaded`](./app.md#fluent_boards_loaded) | FluentBoards has booted (`plugins_loaded`) |
| [`fluent-boards_loading_app`](./app.md#fluent_boards_loading_app) | App assets are being enqueued (legacy name) |
| [`fluent_boards/after_enqueue_assets`](./app.md#fluent_boards_after_enqueue_assets) | App assets are enqueued |
| [`fluent_boards/rendering_app`](./app.md#fluent_boards_rendering_app) | The admin app page starts rendering |
| [`fluent_boards/after_core_menu_items`](./app.md#fluent_boards_after_core_menu_items) | The wp-admin submenu is registered |
| [`fluent_boards/in_menu_actions`](./app.md#fluent_boards_in_menu_actions) | The app top bar renders |
| [`fluent_boards/front_head`](./app.md#fluent_boards_front_head) <Badge type="tip" text="Pro" /> | The frontend portal `head` renders |
| [`fluent_boards/front_footer`](./app.md#fluent_boards_front_footer) <Badge type="tip" text="Pro" /> | The frontend portal footer renders |
| [`fluent_boards/saving_addons`](./app.md#fluent_boards_saving_addons) | Module settings are about to be saved |
| [`fluent_boards/recurring_task_disabled`](./app.md#fluent_boards_recurring_task_disabled) | The recurring-task module is turned off |
| [`fluent_boards/install_plugin`](./app.md#fluent_boards_install_plugin) | A non-core accepted plugin install is requested |
| [`fluent_boards/mcp_loaded`](./app.md#fluent_boards_mcp_loaded) | Core MCP abilities are registered |
| [`fluent_boards/mcp_tool_exception`](./app.md#fluent_boards_mcp_tool_exception) | An MCP tool throws |

## Internal hooks (do not rely on)

FluentBoards dispatches these hooks itself through Action Scheduler or WP-Cron to run queued work. They are internal plumbing. Their names, arguments and timing can change without notice. Do not call them, and do not depend on them in your own code.

- `fluent_boards/one_time_schedule_send_email_for_{type}`: queued notification emails. `{type}` is one of `comment`, `mention`, `stage_change`, `add_assignee`, `remove_assignee`, `due_date_update`, `task_archived`, `removed_from_task`.
- `fluent_boards/check_upload_protection`: one-off check that the upload folder is protected
- `fluent_boards/five_minutes_scheduler`, `fluent_boards/hourly_scheduler`, `fluent_boards/daily_scheduler` (Pro): recurring schedulers
- `fluent_boards/repeat_task_scheduler`, `fluent_boards/daily_task_reminder`, `fluent_boards/task_reminder_scheduler_for_rest` (Pro): recurring-task and reminder runners
- `fluent_boards/async_{event}_webhook` (Pro): queued outgoing webhook deliveries, for example `async_task_created_webhook`
- `fluent_boards/process_trello_import` (Pro): Trello import worker
- `fluent_boards/async_create_tasks_from_template`, `fluent_boards/async_copy_tasks_from_user_template` (Pro): template task copy workers
- `fluent-boards-pro/update_verification_failed` (Pro): plugin updater internals

The following names appear only in commented-out code and are **never fired**: `fluent_boards/task_moved_to_new_stage`, `fluent_boards/task_prop_changed`, `fluent_boards/task_comment_updated`. Use `task_stage_updated`, the specific task property hooks and `comment_updated` instead.
