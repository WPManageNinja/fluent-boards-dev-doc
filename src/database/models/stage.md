# Stage Model

| DB Table Name | `{wp_db_prefix}fbs_board_terms` (rows with `type = 'stage'`) |
|---------------|-------------------------------------------------------------|
| Schema        | [Check Schema](/database/#fbs-board-terms-table) |
| Source File   | fluent-boards/app/Models/Stage.php |
| Name Space    | FluentBoards\App\Models |
| Class         | FluentBoards\App\Models\Stage |
| Extends       | [BoardTerm](/database/models/board-term) |

Stages are the columns of a board. The model adds a global scope `type = 'stage'`.

On create, the model sets `type` to `stage` and, when `settings` is empty, sets it to `['default_task_status' => 'open', 'is_template' => false]`.

## Attributes

Same columns as [BoardTerm](/database/models/board-term#attributes).

| Attribute | Data Type | Comment |
|---|---|---|
| id | INT UNSIGNED | Primary key |
| board_id | INT UNSIGNED | Board ID |
| title | VARCHAR(100) NULL | Stage title |
| slug | VARCHAR(100) NULL | Stage slug |
| type | VARCHAR(50) | Always `stage` |
| position | DECIMAL(10,2) | Column order on the board |
| color | VARCHAR(50) NULL | Text color |
| bg_color | VARCHAR(50) NULL | Background color |
| settings | TEXT NULL | Array with `default_task_status` (`open` / `closed`) and `is_template` |
| archived_at | TIMESTAMP NULL | Archive time |
| created_at | TIMESTAMP NULL | |
| updated_at | TIMESTAMP NULL | |

## Usage

Please check [Model Basic](/database/models/) for common methods.

```php
$stages = FluentBoards\App\Models\Stage::where('board_id', 1)
    ->whereNull('archived_at')
    ->orderBy('position', 'ASC')
    ->get();
```

## Relations

### tasks

All tasks in the stage (`stage_id`).

- Returns a collection of `FluentBoards\App\Models\Task`

```php
$openTasks = $stage->tasks()->where('status', 'open')->whereNull('archived_at')->get();
```

### board

Inherited from BoardTerm.

- Returns `FluentBoards\App\Models\Board`

## Methods

### defaultTaskStatus()

Returns `'open'` or `'closed'`: the status that tasks get when they are moved into this stage. Returns `'open'` when the stage has no settings.

```php
$status = $stage->defaultTaskStatus();
```

### moveToNewPosition($newIndex)

Moves the stage to a 1-based column index on its board, re-indexing positions when they get too close.

- Returns `Stage`

```php
$stage->moveToNewPosition(2);
```

### Stage::reIndexStagesPositions($stage) <Badge text="static" />

Renumbers the positions (1, 2, 3, ...) of all non-archived stages on the board. `$stage` is an array with a `board_id` key.

```php
FluentBoards\App\Models\Stage::reIndexStagesPositions(['board_id' => 1]);
```
