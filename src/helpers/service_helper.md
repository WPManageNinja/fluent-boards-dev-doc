# FluentBoards Core Helper Class

- Class with Namespace: `\FluentBoards\App\Services\Helper`
- File: `app/Services/Helper.php`
- Method Types: `static`

```php
use FluentBoards\App\Services\Helper;
```

The core uses these methods internally. They are public, so add-ons can call them too. They do **not** check permissions. Check access yourself, for example with `PermissionManager::userHasBoardPermission($boardId, 'GET')`, before you expose data to a user.

[[toc]]

## Strings and URLs

### Helper::snake_case($string)
Converts a camelCase or StudlyCase string to snake_case by inserting `_` before each capital letter and lower-casing the result. Spaces are not converted.

```php
Helper::snake_case('dueDateChanged'); // 'due_date_changed'
```

### Helper::slugify($text, $id = '', $length = 20)
Truncates `$text` to `$length` characters, slugifies it with `Str::slug()`, and optionally prefixes `$id-`.

```php
Helper::slugify('Hello World', '12345', 10); // '12345-hello-worl'
```

### Helper::getTaskUrl($taskId, $boardId)
Returns the app URL of a task, or `''` if either ID is empty. The URL is built from [`fluent_boards_page_url()`](/global-functions/#fluent-boards-page-url).

```php
Helper::getTaskUrl(15, 3);
// 'https://example.com/wp-admin/admin.php?page=fluent-boards#/boards/3/tasks/15'
```

### Helper::getTaskUrlByTask($task)
Same as `getTaskUrl()`, but reads `id` and `board_id` from a task object.

```php
$url = Helper::getTaskUrlByTask($task);
```

### Helper::getBoardUrl($boardId)
Returns the app URL of a board, for example `…admin.php?page=fluent-boards#/boards/3`, or `''` for an empty ID.

### Helper::obfuscateEmail($email)
Masks an email address for display to users who should not see it. Invalid emails are returned unchanged.

```php
Helper::obfuscateEmail('johndoe@example.com'); // 'joh****@****le.com'
```

## Boards and stages

### Helper::getBoards()
Returns all boards ordered by `created_at`, **without** an access check. The `Board` global scope still applies, so only `to-do` and `roadmap` boards are returned.

```php
$boards = Helper::getBoards(); // Collection of Board
```

### Helper::getStage($stageId)
Returns a `Stage` model. It uses `findOrFail()`, so a missing ID throws an exception.

### Helper::getBoardByStageId($stageId)
Returns the `Board` that a stage belongs to. It throws if the stage does not exist.

### Helper::getFormattedStagesByBoardId($boardId)
Despite its name, this returns the **raw** stage collection of the board (`$board->stages()->get()`). Returns `[]` for an empty ID and throws if the board does not exist.

### Helper::getStagesByBoardId($boardId)
Returns the board's stages formatted for select inputs with [`formateStage()`](#helper-formatestage-stages).

```php
Helper::getStagesByBoardId(1);
// [
//     ['id' => '4', 'title' => 'Board A - Open'],
//     ['id' => '5', 'title' => 'Board A - In Progress'],
// ]
```

### Helper::formateStage($stages)
Maps stage models to `['id' => (string) $stage->id, 'title' => "{$board->title} - {$stage->title}"]`. Each stage must have a loadable `board` relation.

### Helper::getStagesByBoardGroup()
Returns every board with its stages, grouped for grouped select inputs (the FluentCRM "Create Task" automation action uses it). It does not check access.

```php
// [
//     ['title' => 'Board A', 'slug' => 'aaa_1', 'options' => [ ['id' => '4', 'title' => 'Board A - Open'], ... ]],
//     ...
// ]
```

### Helper::getIdTitleArray($data)
Maps a collection of objects that have `id` and `title` to a list of `['id' => …, 'title' => …]` arrays.

```php
Helper::getIdTitleArray($contact->tags);
// [ ['id' => 1, 'title' => 'VIP'], ['id' => 2, 'title' => 'Lead'] ]
```

## Tasks

### Helper::getPriorityOptions()
Returns the built-in priority options.

```php
// [
//     ['id' => '',       'title' => 'No priority'],
//     ['id' => 'urgent', 'title' => 'Urgent'],
//     ['id' => 'high',   'title' => 'High'],
//     ['id' => 'medium', 'title' => 'Medium'],
//     ['id' => 'low',    'title' => 'Low'],
// ]
```

This list is static. To add priorities, use the `fluent_boards/task_priorities` filter (see [Filters](/hooks/filters/)).

### Helper::taskReminderTypes()
Returns the allowed task reminder types as `key => label`. Filter: `fluent_boards/task_reminder_types`.

```php
// [
//     '30_minutes_before' => '30 minutes before',
//     '1_hour_before'     => '1 hour before',
//     '2_hours_before'    => '2 hours before',
//     '1_day_before'      => '1 day before',
//     '2_days_before'     => '2 days before',
//     '1_week_before'     => '1 week before',
// ]
```

### Helper::dueDateConversion($due_time, $unit)
Returns `now + $due_time $unit` as `Y-m-d H:i:s`, relative to the site's `current_time('mysql')`. Returns `null` when `$due_time` is `0` or less. `$unit` is any `strtotime()` unit, such as `'hours'`, `'days'` or `'weeks'`.

```php
Helper::dueDateConversion(3, 'days'); // e.g. '2026-10-05 14:30:00'
```

### Helper::normalizeDateValue($value)
Normalizes a nullable date value. It returns `null` for `null`, booleans, empty strings, `'none'`, `'null'`, zero dates (`0000-00-00…`), years before 1900, and strings `strtotime()` cannot parse. Any other value is returned unchanged.

### Helper::normalizeDates($data, $dateKeys = [])
Runs `normalizeDateValue()` on each key in `$dateKeys` that exists in `$data`, and returns the array.

```php
$data = Helper::normalizeDates($data, ['due_at', 'started_at', 'remind_at']);
```

### Helper::createActivity($data)
Creates a row in `fbs_activities` and returns the `Activity` model. When `$data['settings']['custom_field_id']` is set, the column, old value, new value and description are packed into `description` as JSON.

```php
use FluentBoards\App\Services\Constant;

Helper::createActivity([
    'object_type' => Constant::ACTIVITY_TASK, // 'task_activity' (or ACTIVITY_BOARD)
    'object_id'   => $task->id,
    'action'      => 'updated',
    'column'      => 'priority',
    'old_value'   => 'low',
    'new_value'   => 'high',
    'description' => '',
]);
```

### Helper::translateActivities($activities)
Translates the `action` and `column` of each activity in place. It keeps the raw values in `action_key` and `column_key`. Returns nothing.

### Helper::crm_contact($id)
Returns a FluentCRM contact as an array, including `id`, `email`, `first_name`, `last_name`, `full_name`, `avatar`, `photo`, `status`, `contact_type`, `last_activity`, `life_time_value`, `total_points`, `user_id`, `created_at`, `tags` and `lists`. `tags` and `lists` are in [`getIdTitleArray()`](#helper-getidtitlearray-data) format.

Requires FluentCRM. Returns `''` when FluentCRM is not active, and `null` for an empty ID or an unknown contact.

## Users

### Helper::searchWordPressUsers($searchQuery, $limit = 20)
Searches WordPress users by login, email and nicename (`WP_User_Query` wildcard search), and by the `first_name`/`last_name` meta. The two result sets are merged and de-duplicated.

```php
$users = Helper::searchWordPressUsers('john', 10); // WP_User[]
```

### Helper::sanitizeUserCollections($users)
Prepares a user collection for output. It sets a `role` attribute (`Admin`, `Viewer` or `Member`) from each user's board pivot settings. If the current user cannot `list_users`, it also hides `user_email`, `user_nicename`, `user_registered`, `user_url` and `user_status`.

### Helper::sanitizeUsersArray($users, $boardId = null, $isBoardManager = null)
For users who cannot `list_users` and are not managers of `$boardId`, it obfuscates `email` / `user_email` with `obfuscateEmail()`. The current user's own entry is left unchanged. Pass `$isBoardManager` when you have already resolved it, to skip the permission lookup.

## Input sanitizers

These methods run a sanitizing callback on each known key that has a non-empty, non-array value. **Unknown keys are kept unchanged**, so they are not whitelists. Validate the keys yourself.

| Method | Keys and callbacks |
|---|---|
| `sanitizeTask($data)` | `title`, `type`, `stage`, `priority`, `source`, `source_id`, dates… (`sanitize_text_field`); `board_id`, `parent_id`, `crm_contact_id`, `assignees`, `position`… (`intval`); `lead_value` (`doubleval`); `description` (`fluent_boards_sanitize_description`) |
| `sanitizeTaskForWebHook($data)` | Same as `sanitizeTask()` without `assignees`. It also keeps only `settings.author` (`name`, `email`, `photo`, each sanitized) and drops any other `settings`. Used by `FluentBoardsApi('tasks')->create()` and incoming webhooks. |
| `sanitizeBoard($data)` | `title`, `type`, `currency`, `color`, `id` (text); `board_id`, `parent_id`, `crm_contact_id`, `created_by`, `is_auth_require` (`intval`); `description` (`fluent_boards_sanitize_description`); `image_url` (`sanitize_url`); `is_image`, `reset` (`rest_sanitize_boolean`) |
| `sanitizeStage($data)` | `title`, `slug`, `type`, `status` (text) |
| `sanitizeLabel($data)` | `bg_color`, `color`, `label` (text); `color_preset` (`sanitize_key`); `boardId`, `task_id`, `meta_value` (`intval`) |
| `sanitizeComment($data)` | `description` (`wp_kses_post`); `created_by`, `task_id` (`intval`); `type` (text) |
| `sanitizeSubtask($data)` | Text, date and int fields of a subtask, including `group_id`, `add_to_top` (boolean). It also keeps at most **one** assignee and casts `labels` to ints. |
| `sanitizeTaskMeta($data)` | `title` (text), `url` (`sanitize_url`) |
| `sanitizeTaskAttachment($data)` | `title` (text), `url` (`sanitize_url`) |
| `sanitizeTaskRepeatData($data)` | Repeat-task settings: `repeat_type`, `selected_month`, `time`, `time_zone`, `next_repeat_date`, `repeat_in_month_type` (text); `create_new`, `repeat_in`, `repeat_when_complete`, `selected_stage`, `board_id` (`intval`) |

```php
$clean = Helper::sanitizeTask([
    'title'    => '<b>Launch</b>',
    'board_id' => '12',
]);
// ['title' => 'Launch', 'board_id' => 12]
```

## Views

### Helper::loadView($template, $data)
Renders a PHP template from the plugin's `app/Views/` directory and returns the output as a string. Dots in `$template` map to directory separators, and the keys of `$data` become variables in the template. Templates can only be loaded from the core `app/Views` directory.

```php
$html = Helper::loadView('emails.comment2', $data); // app/Views/emails/comment2.php
```
