# Boards API Function

The Boards API provides various methods to interact with board-related data. You can use these methods to retrieve, create, and manage boards, stages, and labels in your custom PHP snippets or plugins.

## Initialization
To initialize the Boards API, use the following code:
```php 
$boardsApi = FluentBoardsApi('boards');
```
`FluentBoardsApi('boards')` returns an instance of the `FluentBoards\App\Api\Classes\Boards` class.

## Methods

### getBoards()
The `getBoards` method retrieves a list of boards accessible by the current user. You can optionally include related data and specify sorting options.

**Parameters**
- `$with` (array): An array of relationships to include (optional).
- `$sortBy` (string): The column to sort by (default: title).
- `$sortOrder` (string): The sorting order (asc or desc, default: asc).

**Return** 
- An array of `Board` models.

**Example**
```php
$boards = $boardsApi->getBoards(['stages'], 'created_at', 'desc');
```

### getStagesByBoard()
The `getStagesByBoard` method retrieves stages associated with a specific board.

**Parameters**
- `$board_id` (int|string): The ID of the board.


**Return**
- An array of `Stage` models.

**Example**
```php
$stages = $boardsApi->getStagesByBoard(1);
```

### create()
The `create` method creates a new board with the provided data. It also creates default labels and stages for the board.

**Parameters**
- `$data` (array): The board data, including `title` (required).

**Return**
- The created `Board` model or `false` if creation fails.

**Example**
```php
$newBoard = $boardsApi->create([
    'title' => 'New Project Board',
    'description' => 'A board for managing new projects'
]);
```

### getStages()
The `getStages` method retrieves stages associated with a specific board, excluding archived stages.

**Parameters**
- `$board_id` (int|string): The ID of the board.

**Return**
- An array of `Stage` models.

**Example**
```php
$stages = $boardsApi->getStages(1);
```

### getInstance()
The `getInstance` method returns the raw `Board` model instance, allowing you to use all the methods of the query builder or ORM.

**Return**
- The `Board` model instance.

**Example**
```php
$boardInstance = $boardsApi->getInstance();
$board = $boardInstance->where('title', 'like', '%Project%')->first();
```

### getLabels()
The `getLabels` method retrieves labels associated with a specific board.

**Parameters**
- `$boardId` (int): The ID of the board.

**Return**
- An array of `Label` models or `false` if the board is not found or the user lacks access.

**Example**
```php
$labels = $boardsApi->getLabels(1);
```

### createLabel()
The `createLabel` method creates a new label for a specific board.

**Parameters**
- `$boardId` (int): The ID of the board.
- `$data` (array): The label data, including `bg_color` (required) and `color` (optional).

**Return**
- The created `Label` model or `false` if creation fails.

**Example**
```php
$newLabel = $boardsApi->createLabel(1, [
    'bg_color' => '#ff5733',
    'color' => '#ffffff',
    'title' => 'High Priority'
]);
```

