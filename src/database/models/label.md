# Label Model

| DB Table Name | `{wp_db_prefix}fbs_board_terms` (rows with `type = 'label'`) |
|---------------|-------------------------------------------------------------|
| Schema        | [Check Schema](/database/#fbs-board-terms-table) |
| Source File   | fluent-boards/app/Models/Label.php |
| Name Space    | FluentBoards\App\Models |
| Class         | FluentBoards\App\Models\Label |
| Extends       | [BoardTerm](/database/models/board-term) |

Labels are per-board tags for tasks. The model adds a global scope `type = 'label'` and sets `type` to `label` on create.

## Attributes

Same columns as [BoardTerm](/database/models/board-term#attributes). For labels, `title` may be empty (a color-only label), and `color` / `bg_color` hold the label colors.

## Usage

Please check [Model Basic](/database/models/) for common methods.

```php
$labels = FluentBoards\App\Models\Label::where('board_id', 1)
    ->whereNull('archived_at')
    ->get();

$label = FluentBoards\App\Models\Label::create([
    'board_id' => 1,
    'title'    => 'Bug',
    'color'    => '#1B2533',
    'bg_color' => '#F87171',
]);
```

## Relations

### tasks

Tasks that have this label (`fbs_relations`, `object_type = 'task_label'`). Pivot: `settings`, `preferences`.

- Returns a collection of `FluentBoards\App\Models\Task`

```php
$tasks = $label->tasks;

// Labels that are not used on any task
$unused = FluentBoards\App\Models\Label::where('board_id', 1)
    ->whereDoesntHave('tasks')
    ->get();
```

### board

Inherited from BoardTerm.

- Returns `FluentBoards\App\Models\Board`
