# Board

<Badge type="tip" vertical="top" text="FluentBoards Core" />

A board is the top-level workspace in FluentBoards. It holds the stages (columns), the tasks inside them, the board's labels, and its members. Boards are stored in `fbs_boards` and represented by the `FluentBoards\App\Models\Board` model. A board's `type` is `to-do` (default) or `roadmap`. Folders are rows in the same table with `type = 'folder'`, and the `Board` model's global scope excludes them.

Use `FluentBoardsApi('boards')` to work with boards from PHP. Every call runs as the current WordPress user. The full method reference is on the [Boards API](/global-functions/boards-api-function) page.

## Creating a board

```php
$board = FluentBoardsApi('boards')->create([
    'title'       => 'Client Onboarding',   // required
    'type'        => 'to-do',               // pass it explicitly (see the note below)
    'description' => 'Steps for every new client',
]);
```

`create()` does the following:

- It returns `false` if `title` is empty or the current user is not allowed to create boards.
- It passes the data through the `fluent_boards/before_create_board` filter, then saves the board with the current user as a board admin.
- It creates the default labels and three default stages: **Open**, **In Progress** and **Completed**.
- It fires `fluent_boards/board_created` with the new `Board` model.

Optional keys: `currency` (default `USD`), `background`, `created_by`, `crm_contact_id`.

::: warning
In version 2.1.0, omitting `type` raises an "Undefined array key" warning on PHP 8. Always pass `'type' => 'to-do'` (or `'roadmap'`).
:::

## Getting boards

```php
$boards = FluentBoardsApi('boards')->getBoards($with = [], $sortBy = 'title', $sortOrder = 'asc');
```

This returns a collection of the boards the current user can access. `$with` eager-loads relations, for example `['stages', 'users']`.

```php
foreach (FluentBoardsApi('boards')->getBoards(['stages']) as $board) {
    printf("%d: %s (%d stages)\n", $board->id, $board->title, count($board->stages));
}
```

## Getting the stages of a board

```php
$stages = FluentBoardsApi('boards')->getStages($boardId);
```

This returns the non-archived stages ordered by position. It returns `false` if the user cannot read the board. You can get the same result from `FluentBoardsApi('stages')->getStagesByBoard($boardId)`, which also accepts relations to eager-load. See [Stages](/modules/stages).

`FluentBoardsApi('boards')->getStagesByBoard($boardId)` also exists, but it returns the **board** (in a collection) with its `stages` loaded, not the stages themselves.

## Getting the labels of a board

```php
$labels = FluentBoardsApi('boards')->getLabels($boardId);
```

## Creating a label

```php
$label = FluentBoardsApi('boards')->createLabel($boardId, [
    'label'    => 'Important', // the label title
    'bg_color' => '#4bce97',   // required
    'color'    => '#1B2533',   // text color, default '#1B2533'
]);
```

The title is read from the **`label`** key. A `title` key is ignored, and the label is saved without a title. The method returns `false` if `bg_color` is missing or the user cannot write to the board.

To attach labels to tasks, see [Tasks](/modules/tasks#labels).

## Related hooks

| Hook | Type | When |
|---|---|---|
| `fluent_boards/before_create_board` | Filter | Before a board is saved. Receives the board data array. |
| `fluent_boards/board_created` | Action | After a board is created (app, REST, PHP API or MCP) |

See [Action hooks](/hooks/actions/) and [Filter hooks](/hooks/filters/) for the full list.
