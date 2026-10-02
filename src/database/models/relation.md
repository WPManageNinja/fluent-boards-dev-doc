# Relation Model

| DB Table Name | `{wp_db_prefix}fbs_relations` |
|---------------|-------------------------------|
| Schema        | [Check Schema](/database/#fbs-relations-table) |
| Source File   | fluent-boards/app/Models/Relation.php |
| Name Space    | FluentBoards\App\Models |
| Class         | FluentBoards\App\Models\Relation |

`fbs_relations` is the generic pivot table behind most many-to-many relations: board members, task assignees, watchers, labels, custom field values, task dependencies and folders. `object_type` says what `object_id` and `foreign_id` point to. The full list of types is in the [schema](/database/#fbs-relations-table).

Most of the time you work with these rows through relations such as `Board::users()`, `Task::assignees()` or `Task::labels()`. Use this model when you need to read or change the pivot row itself.

## Attributes

| Attribute | Data Type | Comment |
|---|---|---|
| id | INT UNSIGNED | Primary key |
| object_id | INT UNSIGNED | Left side (for example board or task ID) |
| object_type | VARCHAR(100) | Relation type, for example `board_user`, `task_assignee` |
| foreign_id | INT UNSIGNED | Right side (for example user, label or board ID) |
| settings | TEXT NULL | Serialized on write, unserialized on read |
| preferences | TEXT NULL | Serialized on write, unserialized on read |
| created_at | TIMESTAMP NULL | Hidden from `toArray()` |
| updated_at | TIMESTAMP NULL | Hidden from `toArray()` |

::: warning Serialization
The model serializes `settings` and `preferences` for you. Pass arrays, not `maybe_serialize()` output, or the value is serialized twice. When you attach rows through a relation (`$task->assignees()->attach(...)`), the pivot is written without the model, so there you must serialize yourself.
:::

## Usage

Please check [Model Basic](/database/models/) for common methods.

```php
use FluentBoards\App\Models\Relation;

// Is user 5 a view-only member of board 1?
$membership = Relation::where('object_type', 'board_user')
    ->where('object_id', 1)
    ->where('foreign_id', 5)
    ->first();

$isViewer = $membership && !empty($membership->settings['is_viewer_only']);

// Make the user a board admin
if ($membership) {
    $settings = $membership->settings;
    $settings['is_admin'] = true;
    $membership->settings = $settings;
    $membership->save();
}
```

Use the constants in `FluentBoards\App\Services\Constant` (for example `Constant::OBJECT_TYPE_BOARD_USER`) instead of string literals.
