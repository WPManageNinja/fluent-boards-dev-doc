# Stage

<Badge type="tip" vertical="top" text="FluentBoards Core" />

Each board is made up of stages, the columns that tasks move through (for example Open, In Progress, Completed). Stages are stored in `fbs_board_terms` with `type = 'stage'` and represented by the `FluentBoards\App\Models\Stage` model. A stage has a `title`, a `position`, an optional `bg_color`, and a **default task status** stored in `settings['default_task_status']`.

Use `FluentBoardsApi('stages')` to work with stages from PHP. Every call runs as the current WordPress user. The full method reference is on the [Stages API](/global-functions/stages-api-function) page.

## Creating a stage

```php
$stage = FluentBoardsApi('stages')->create([
    'title'    => 'Review', // required
    'board_id' => 12,       // required
    'status'   => 'open',   // default task status: 'open' (default) or 'closed'
]);
```

- `$stageData['title']` (string, **required**)
- `$stageData['board_id']` (int, **required**)
- `$stageData['status']` (string): The default status for tasks in this stage, `'open'` or `'closed'`. Default `'open'`. Use `'closed'` for a "Done" column, so tasks dragged into it in the app are marked complete.
- `$stageData['position']` (int): Optional. By default the stage is added after the last active stage.

It returns the new `Stage` model, or `false` if a required key is missing or the user cannot write to the board.

## Getting the stages of a board

```php
$stages = FluentBoardsApi('stages')->getStagesByBoard($boardId, $with = []);
```

**Parameters**
- `$boardId` (int, **required**)
- `$with` (array): Relations to eager-load, for example `['tasks']`.

**Return**: A collection of non-archived `Stage` models ordered by position, or `false`.

## Getting a stage

```php
$stage = FluentBoardsApi('stages')->getStage($stageId, $with = []);
```

**Parameters**
- `$stageId` (int, **required**)
- `$with` (array): Relations to eager-load, for example `['tasks', 'board']`.

**Return**: The `Stage` model, or `false` if the stage does not exist or the user cannot read its board.

## Updating a stage

```php
FluentBoardsApi('stages')->updateProperty($stageId, $property, $value);
```

**Parameters**
- `$stageId` (int, **required**)
- `$property` (string, **required**): `'title'`, `'status'` or `'bg_color'`
- `$value` (string, **required**)

| Property | Value | Effect |
|---|---|---|
| `title` | Any string | Renames the stage. Fires `fluent_boards/stage_updated` when the title changes. |
| `status` | `'open'` or `'closed'` | Sets the stage's default task status (`settings['default_task_status']`). It does not change existing tasks. |
| `bg_color` | A hex color, for example `'#DAF7A6'` | Sets the column background color |

**Return**: The updated `Stage` model. Returns `false` for any other property or without write access.

```php
FluentBoardsApi('stages')->updateProperty(45, 'title', 'Done');
FluentBoardsApi('stages')->updateProperty(45, 'status', 'closed');
```

## Archiving a stage

```php
FluentBoardsApi('stages')->archiveStage($stageId);
```

Sets `archived_at`, moves the stage to position `0`, and fires `fluent_boards/stage_archived` and `fluent_boards/stage_archived_with_tasks`.

**Return**: The archived `Stage` model, or `false`.

## Restoring an archived stage

```php
FluentBoardsApi('stages')->restoreStage($stageId);
```

Clears `archived_at`, places the stage after the last active stage, and fires `fluent_boards/board_stage_restored` and `fluent_boards/stage_restored_with_tasks`.

**Return**: The restored `Stage` model, or `false`.

## Moving tasks between stages

To move a task to another stage, use the Tasks API:

```php
FluentBoardsApi('tasks')->changeStage($taskId, $newStageId);
```

See [Tasks](/modules/tasks#moving-a-task-to-another-stage).
