# Activity Model

| DB Table Name | `{wp_db_prefix}fbs_activities` |
|---------------|--------------------------------|
| Schema        | [Check Schema](/database/#fbs-activities-table) |
| Source File   | fluent-boards/app/Models/Activity.php |
| Name Space    | FluentBoards\App\Models |
| Class         | FluentBoards\App\Models\Activity |

The activity log for boards and tasks. `object_type` is `task_activity` (`object_id` = task ID) or `board_activity` (`object_id` = board ID).

On create, the model sets `created_by` to the current user when empty, and sets `created_at` / `updated_at` with `current_time('mysql')`.

## Attributes

| Attribute | Data Type | Comment |
|---|---|---|
| id | INT UNSIGNED | Primary key |
| object_id | INT UNSIGNED | Task or board ID |
| object_type | VARCHAR(100) | `task_activity` or `board_activity` |
| action | VARCHAR(50) | For example `created`, `updated`, `added`, `changed`, `removed`, `deleted` |
| column | VARCHAR(50) NULL | Changed field |
| old_value | VARCHAR(50) NULL | Value before the change |
| new_value | VARCHAR(50) NULL | Value after the change |
| description | LONGTEXT NULL | Description |
| created_by | BIGINT UNSIGNED NULL | User who made the change |
| settings | TEXT NULL | Serialized; returned as an array |
| created_at | TIMESTAMP NULL | |
| updated_at | TIMESTAMP NULL | |

::: tip Custom field activities
`old_value` and `new_value` are limited to 50 characters. For custom field changes the full payload is stored as JSON in `description`, and `settings.custom_field_activity_payload` is set. In that case the `column`, `old_value`, `new_value` and `description` accessors return the values from the JSON payload, so you can read them as usual.
:::

## Usage

Please check [Model Basic](/database/models/) for common methods.

```php
FluentBoards\App\Models\Activity::create([
    'object_id'   => $task->id,
    'object_type' => 'task_activity',
    'action'      => 'changed',
    'column'      => 'priority',
    'old_value'   => 'low',
    'new_value'   => 'high',
]);
```

## Scopes

### type($objectType)

Filter by `object_type`.

```php
$taskActivities = FluentBoards\App\Models\Activity::type('task_activity')
    ->where('object_id', 42)
    ->orderBy('id', 'DESC')
    ->get();
```

## Relations

The `board` and `task` relations both join on `object_id` without checking `object_type`. Use the one that matches the row's `object_type`.

### task

- Returns `FluentBoards\App\Models\Task`

### board

- Returns `FluentBoards\App\Models\Board`

### user

The user who made the change (`created_by`).

- Returns `FluentBoards\App\Models\User`

```php
$activity = FluentBoards\App\Models\Activity::with('user')->find(1);
echo $activity->user->display_name;
```
