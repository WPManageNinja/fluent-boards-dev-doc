# Boards API Function

<Badge type="tip" vertical="top" text="FluentBoards Core" />

The Boards API reads boards, stages and labels, and creates boards and labels. All methods run as the current WordPress user. See [PHP API classes](/global-functions/#php-api-classes) for the rules on permissions and error handling that apply to every method.

## Getting the API object

```php
$boardsApi = FluentBoardsApi('boards');
```

`FluentBoardsApi('boards')` returns a `FluentBoards\App\Api\FBSApi` proxy around `FluentBoards\App\Api\Classes\Boards`. Call the methods below on it. The class has no `getInstance()` method. For custom queries, use the `FluentBoards\App\Models\Board` model directly (see [Models](/database/models/)).

## Methods

| Method | Permission | Returns |
|---|---|---|
| [`getBoards()`](#getboards) | Boards the user can access | Collection of `Board` |
| [`getStagesByBoard()`](#getstagesbyboard) | Read | Collection of `Board` (with `stages` loaded) |
| [`getStages()`](#getstages) | Read | Collection of `Stage` |
| [`create()`](#create) | Board creation | `Board` |
| [`getLabels()`](#getlabels) | Read | Collection of `Label` |
| [`createLabel()`](#createlabel) | Write | `Label` |

### getBoards()

Returns the boards the current user can access (`Board::byAccessUser()`). Only regular boards are included. The `Board` global scope limits results to the `to-do` and `roadmap` types, so folders are excluded.

```php
getBoards($with = [], $sortBy = 'title', $sortOrder = 'asc')
```

**Parameters**
- `$with` (array): Relations to eager-load, for example `['stages', 'users']`.
- `$sortBy` (string): Column to sort by. Default `'title'`. Pass an empty value to skip sorting.
- `$sortOrder` (string): `'asc'` or `'desc'`. Default `'asc'`.

**Return**
- A collection of `Board` models.

**Example**
```php
$boards = FluentBoardsApi('boards')->getBoards(['stages'], 'created_at', 'desc');

foreach ($boards as $board) {
    echo $board->title . ' (' . count($board->stages) . " stages)\n";
}
```

### getStagesByBoard()

Returns the board with its `stages` relation loaded. Note that the result is a **collection of `Board` models** (zero or one item), not a list of stages. Use [`getStages()`](#getstages) or the [Stages API](/global-functions/stages-api-function#getstagesbyboard) if you only need the stages.

```php
getStagesByBoard($board_id)
```

**Parameters**
- `$board_id` (int|string): The board ID.

**Return**
- A collection containing the board with `stages` loaded. Returns `[]` for an empty ID and `false` without read access.

**Example**
```php
$result = FluentBoardsApi('boards')->getStagesByBoard(12);
$stages = $result ? $result->first()->stages : [];
```

### getStages()

Returns the non-archived stages of a board, ordered by `position`.

```php
getStages($board_id)
```

**Parameters**
- `$board_id` (int|string): The board ID.

**Return**
- A collection of `Stage` models. Returns `[]` for an empty ID and `false` without read access.

**Example**
```php
$stages = FluentBoardsApi('boards')->getStages(12);
```

### create()

Creates a board, then adds the default labels and the default stages (Open, In Progress, Completed). It fires the `fluent_boards/board_created` action. The current user is attached as a board admin.

```php
create($data)
```

**Parameters**
- `$data` (array): Board data. Values are sanitized with `Helper::sanitizeBoard()`.
  - `title` (string, **required**)
  - `type` (string): `'to-do'` (default) or `'roadmap'`. Pass it explicitly. Omitting it currently raises an "undefined array key" warning on PHP 8.
  - `description` (string): Markdown or HTML.
  - `currency` (string): Default `'USD'`.
  - `background` (array|string): Board background settings.
  - `created_by` (int): Defaults to the current user.
  - `crm_contact_id` (int): Associate a FluentCRM contact with the board.

The data passes through the `fluent_boards/before_create_board` filter before it is saved.

**Return**
- The created `Board` model. Returns `false` when `title` is empty, when the current user cannot create boards (`PermissionManager::userHasBoardCreationPermission()`), or when saving fails.

**Example**
```php
$board = FluentBoardsApi('boards')->create([
    'title'       => 'Website Redesign',
    'type'        => 'to-do',
    'description' => 'Tasks for the Q4 website redesign',
]);

if ($board) {
    $stages = FluentBoardsApi('boards')->getStages($board->id);
}
```

### getLabels()

Returns all labels of a board, oldest first.

```php
getLabels($boardId)
```

**Parameters**
- `$boardId` (int): The board ID.

**Return**
- A collection of `Label` models. Returns `false` without read access, and `null` when the board does not exist (the `findOrFail()` exception is swallowed by the proxy).

**Example**
```php
$labels = FluentBoardsApi('boards')->getLabels(12);
```

### createLabel()

Creates a label on a board.

```php
createLabel($boardId, $data)
```

**Parameters**
- `$boardId` (int): The board ID.
- `$data` (array):
  - `bg_color` (string, **required**): Background color, for example `'#4bce97'`.
  - `color` (string): Text color. Default `'#1B2533'`.
  - `label` (string): The label title. The method reads the title from the `label` key. A `title` key is ignored.
  - `color_preset` (string): Optional preset ID from the built-in label palette. An unknown preset throws an exception, so the method returns `null`.

**Return**
- The created `Label` model. Returns `false` when `bg_color` is missing or the user cannot write to the board.

**Example**
```php
$label = FluentBoardsApi('boards')->createLabel(12, [
    'label'    => 'High Priority',
    'bg_color' => '#ff5733',
    'color'    => '#ffffff',
]);
```
