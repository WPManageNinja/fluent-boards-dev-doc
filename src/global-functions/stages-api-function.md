# Stages API Function

<Badge type="tip" vertical="top" text="FluentBoards Core" />

Stages are the columns of a board. The Stages API reads, creates, updates, archives and restores them. All methods run as the current WordPress user. See [PHP API classes](/global-functions/#php-api-classes) for the rules on permissions and error handling that apply to every method.

## Getting the API object

```php
$stagesApi = FluentBoardsApi('stages');
```

`FluentBoardsApi('stages')` returns a `FluentBoards\App\Api\FBSApi` proxy around `FluentBoards\App\Api\Classes\Stages`. The class has no `getInstance()` method. For custom queries, use the `FluentBoards\App\Models\Stage` model directly (see [Models](/database/models/)).

## Methods

| Method | Permission | Returns |
|---|---|---|
| [`getStage()`](#getstage) | Read | `Stage` |
| [`getStagesByBoard()`](#getstagesbyboard) | Read | Collection of `Stage` |
| [`create()`](#create) | Write | `Stage` |
| [`updateProperty()`](#updateproperty) | Write | `Stage` |
| [`archiveStage()`](#archivestage) | Write | `Stage` |
| [`restoreStage()`](#restorestage) | Write | `Stage` |

### getStage()

Returns one stage by ID.

```php
getStage($id, $with = [])
```

**Parameters**
- `$id` (int|string): The stage ID.
- `$with` (array): Relations to eager-load, for example `['tasks', 'board']`.

**Return**
- The `Stage` model, or `false` when the ID is empty, the stage does not exist, or the user cannot read its board.

**Example**
```php
$stage = FluentBoardsApi('stages')->getStage(45, ['tasks']);
```

### getStagesByBoard()

Returns the non-archived stages of a board, ordered by `position`.

```php
getStagesByBoard($boardId, $with = [])
```

**Parameters**
- `$boardId` (int|string): The board ID.
- `$with` (array): Relations to eager-load.

**Return**
- A collection of `Stage` models, or `false` when the ID is empty or the user cannot read the board.

**Example**
```php
$stages = FluentBoardsApi('stages')->getStagesByBoard(12, ['tasks']);
```

### create()

Adds a stage to a board. By default the new stage goes after the last non-archived stage.

```php
create($data)
```

**Parameters**
- `$data` (array):
  - `title` (string, **required**)
  - `board_id` (int, **required**)
  - `status` (string): The default status for tasks in this stage, `'open'` (default) or `'closed'`. It is stored as `settings['default_task_status']`. Use `'closed'` for a "Done" column: tasks moved into it in the app are closed automatically. `FluentBoardsApi('tasks')->changeStage()` does not apply this rule.
  - `position` (int): Optional target position. Other stages are shifted to make room.

**Return**
- The created `Stage` model, or `false` when `title` or `board_id` is missing or the user cannot write to the board.

**Example**
```php
$stage = FluentBoardsApi('stages')->create([
    'title'    => 'Review',
    'board_id' => 12,
    'status'   => 'open',
]);
```

### updateProperty()

Updates one property of a stage.

```php
updateProperty($stageId, $property, $value)
```

**Parameters**
- `$stageId` (int): The stage ID.
- `$property` (string): One of:
  - `'title'`: The stage title. A changed title fires `fluent_boards/stage_updated`.
  - `'status'`: The default task status for the stage, `'open'` or `'closed'` (stored in `settings['default_task_status']`).
  - `'bg_color'`: The column background color, for example `'#DAF7A6'`.
- `$value` (string): The new value.

**Return**
- The updated `Stage` model. Returns `false` for any other property or without write access, and `null` if the stage does not exist.

**Example**
```php
FluentBoardsApi('stages')->updateProperty(45, 'title', 'In Review');
FluentBoardsApi('stages')->updateProperty(45, 'status', 'closed');
```

### archiveStage()

Archives a stage: it sets `archived_at` and moves the stage to position `0`. The core `StageArchiveHandler` then handles the stage's tasks. Fires `fluent_boards/stage_archived` and `fluent_boards/stage_archived_with_tasks`.

```php
archiveStage($stageId)
```

**Return**
- The archived `Stage` model. Returns `false` for an empty ID or without write access, and `null` if the stage does not exist.

**Example**
```php
FluentBoardsApi('stages')->archiveStage(45);
```

### restoreStage()

Restores an archived stage and places it after the last active stage. Fires `fluent_boards/board_stage_restored` and `fluent_boards/stage_restored_with_tasks`.

```php
restoreStage($stageId)
```

**Return**
- The restored `Stage` model. Returns `false` for an empty ID or without write access, and `null` if the stage does not exist.

**Example**
```php
FluentBoardsApi('stages')->restoreStage(45);
```
