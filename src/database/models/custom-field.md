# CustomField Model

| DB Table Name | `{wp_db_prefix}fbs_board_terms` (rows with `type = 'custom-field'`) |
|---------------|--------------------------------------------------------------------|
| Schema        | [Check Schema](/database/#fbs-board-terms-table) |
| Source File   | fluent-boards/app/Models/CustomField.php |
| Name Space    | FluentBoards\App\Models |
| Class         | FluentBoards\App\Models\CustomField |
| Extends       | [BoardTerm](/database/models/board-term) |

A custom field definition for a board. The model adds a global scope `type = 'custom-field'` and sets that type on create. The value of a field on a task is stored in `fbs_relations` (`object_type = 'task_custom_field'`), not in this table.

The custom fields feature is part of FluentBoards Pro, but the model lives in the Free plugin and is the one `Board::customFields()` and `Task::customFields()` use. Pro also contains an identical `FluentBoardsPro\App\Models\CustomField` class (`fluent-boards-pro/app/Models/CustomField.php`); prefer the Free class in new code.

## Attributes

Same columns as [BoardTerm](/database/models/board-term#attributes). `title` is the field label and `settings` holds the field configuration (field type, options, and so on).

## Usage

Please check [Model Basic](/database/models/) for common methods.

```php
$fields = FluentBoards\App\Models\CustomField::where('board_id', 1)
    ->whereNull('archived_at')
    ->orderBy('position')
    ->get();
```

## Relations

### tasks

Tasks that have a value for this field. The value is in the pivot `settings` (serialized). Pivot: `settings`, `preferences`.

- Returns a collection of `FluentBoards\App\Models\Task`

```php
foreach ($customField->tasks as $task) {
    $value = maybe_unserialize($task->pivot->settings);
}
```

### board

- Returns `FluentBoards\App\Models\Board`

```php
$board = $customField->board;
```
