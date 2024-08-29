# FluentBoards Core Helper Class

- Class with Namespace: `\FluentBoards\App\Services\Helper`
- Method Types: `static`

# Methods

### Helper::snake_case($string)
Converts a given string to snake_case.

**Parameters**
- `$string` (string): The string to convert.

**Return**
- `string` (string): The snake_case version of the input string.

**Example**
```php
$snakeCase = Helper::snake_case('Hello World');
// Output: hello_world
```

### Helper::slugify($text, $id = '', $length = 20)
Generates a URL-friendly slug from a given text, optionally prepended with an ID and limited to a specified length.

**Parameters**
- `text` (string): The text to convert.
- `id` (string, optional): An optional ID to prepend.
- `length` (int, optional): The maximum length of the slug (default is 20).


**Return**
- (string): The generated slug.

**Example**
```php
$slug = Helper::slugify('Hello World', '12345', 10);
// Output: 12345-hello-w
```

### Helper::createActivity($data)
Creates an activity log entry in the database.

**Parameters**
- `$data` (array): The activity data to save.

**Return**
- (Activity): The created activity.

**Example**
```php
$activity_data = ['action' => 'Task Created', 'details' => 'Task ID 123 created.'];
$activity = Helper::createActivity($activity_data);
// Output: An instance of the Activity model with the created data.
```

### Helper::getFormattedStagesByBoardId($boardId)
Get the formatted stages for a board.

**Parameters**
- `$boardId` (int): The ID of the board.

**Return**
- (array): An associative array of formatted stages.

**Example**
```php
$formatted_stages = Helper::getFormattedStagesByBoardId(1);
// Output: [
//     ['id' => '1', 'title' => 'Board A - Stage 1'],
//     ['id' => '2', 'title' => 'Board A - Stage 2'],
// ]
```

### Helper::getStagesByBoardId($boardId)
Get the stages for a board.

**Parameters**
- `$boardId` (int): The ID of the board.

**Return**
- (array): An associative array of stages.

**Example**
```php
$stages = Helper::getStagesByBoardId(1);
// Output: An array of stage objects related to the board with ID 1.
```

### Helper::formateStage($stages)
Format the stages for display.

**Parameters**
- `$stages` (array): An array of stages.

**Return**
- (array): An associative array of formatted stages.

**Example**
```php
$stages = [
    (object) ['id' => 1, 'board' => (object) ['title' => 'Board A'], 'title' => 'Stage 1'],
    (object) ['id' => 2, 'board' => (object) ['title' => 'Board A'], 'title' => 'Stage 2'],
];
$formatted_stages = Helper::formateStage($stages);
// Output: [
//     ['id' => '1', 'title' => 'Board A - Stage 1'],
//     ['id' => '2', 'title' => 'Board A - Stage 2'],
// ]
```

### Helper::getIdTitleArray($data)
Get an associative array of IDs and titles from a collection.

**Parameters**
- `$data` (Collection): The collection to extract IDs and titles from.

**Return**
- (array): An associative array of IDs and titles.

**Example**
```php
$collection = collect([
    (object) ['id' => 1, 'title' => 'Item 1'],
    (object) ['id' => 2, 'title' => 'Item 2'],
]);
$id_title_array = Helper::getIdTitleArray($collection);
// Output: [1 => 'Item 1', 2 => 'Item 2']
```

### Helper::getTaskUrl($taskId, $boardId)
The `Helper::getTaskUrl($taskId, $boardId)` method generates the URL for a specific task within a board.

**Parameters**
- `$taskId` (int): The ID of the task.
- `$boardId` (int): The ID of the board.

**Return**
- (string): The URL of the task.

**Example**
```php
$taskId = 15;
$boardId = 3;
$taskUrl = Helper::getTaskUrl($taskId, $boardId);

// Output: 'https://example.com/boards/3/tasks/15'
```

### Helper::getTaskUrlByTask($task)
The `Helper::getTaskUrlByTask($task)` method generates the URL for a task object.

**Parameters**
- `$task` (Task): The task object.

**Return**
- (string): The URL of the task.

**Example**
```php
$task = (object) ['id' => 15, 'board_id' => 3];
$taskUrl = Helper::getTaskUrlByTask($task);

// Output: 'https://example.com/boards/3/tasks/15'
```

### Helper::getBoardUrl($boardId)
The `Helper::getBoardUrl($boardId)` method generates the URL for a specific board.

**Parameters**
- `$boardId` (int): The ID of the board.

**Return**
- (string): The URL of the board.

**Example**
```php
$boardId = 3;
$boardUrl = Helper::getBoardUrl($boardId);

// Output: 'https://example.com/boards/3'
```

### Helper::crm_contact($id)
The `Helper::crm_contact($id)` method retrieves the CRM contact details for a given ID.

**Parameters**
- `$id` (int): The ID of the CRM contact.

**Return**
- (array): The contact details.

**Example**
```php
$contactId = 100;
$contactDetails = Helper::crm_contact($contactId);

// Output: 
/*
[
    'id' => 100,
    'email' => 'contact@example.com',
    'first_name' => 'John',
    'last_name' => 'Doe',
    ...
]
*/
```

### Helper::getStagesByBoardGroup()
The `Helper::getStagesByBoardGroup()` method retrieves the stages for a board group.

**Return**
- (array): An associative array of stages.

**Example**
```php
$stageGroups = Helper::getStagesByBoardGroup();

// Output: 
/*
[
    [
        'title' => 'Board A',
        'slug' => 'aaa_1',
        'options' => [ ...stages... ]
    ],
    [
        'title' => 'Board B',
        'slug' => 'aaa_2',
        'options' => [ ...stages... ]
    ],
    ...
]
*/
```

### Helper::getBoards()
The `Helper::getBoards()` method retrieves all boards.

**Return**
- (array): An array of boards.

**Example**
```php
$boards = Helper::getBoards();

// Output: A collection of Board objects ordered by creation date.
```

### Helper::getStage($stageId)
The `Helper::getStage($stageId)` method retrieves a stage by its ID.

**Parameters**
- `$stageId` (int): The ID of the stage.

**Return**
- (Stage): The stage object.

**Example**
```php
$stageId = 5;
$stage = Helper::getStage($stageId);

// Output: A Stage object corresponding to the given stage ID.
```

### Helper::getBoardByStageId($stageId)
The `Helper::getBoardByStageId($stageId)` method retrieves the board associated with a stage.

**Parameters**
- `$stageId` (int): The ID of the stage.

**Return**
- (Board): The board object.

**Example**
```php
$stageId = 7;
$board = Helper::getBoardByStageId($stageId);

// Output: The Board object associated with the given stage ID.
```

### Helper::getPriorityOptions()
The `Helper::getPriorityOptions()` method retrieves the priority options.

**Return**
- (array): An array of priority options.

**Example**
```php
$priorityOptions = Helper::getPriorityOptions();

// Output: 
/*
[
    ['id' => 'low', 'title' => 'Low'],
    ['id' => 'medium', 'title' => 'Medium'],
    ['id' => 'high', 'title' => 'High'],
]
*/
```

### Helper::dueDateConversion($due_time, $unit)
The `Helper::dueDateConversion($due_time, $unit)` method converts a due date to a specific unit.

**Parameters**
- $due_time (int): The amount of time until the due date.
- $unit (string): The unit of time (e.g., 'days', 'hours').

**Return**
- (string): The formatted due date.

**Example**
```php
$due_time = 3;
$unit = 'days';
$dueDate = Helper::dueDateConversion($due_time, $unit);

// Output: '2024-09-01 00:00:00' (based on the current date)
```

### Helper::searchWordPressUsers($searchQuery, $limit = 20)
The `Helper::searchWordPressUsers($searchQuery, $limit = 20)` method searches for WordPress users by login, email, nicename, first name, or last name.

**Parameters**
- $searchQuery (string): The search term.
- $limit (int, optional): The maximum number of results to return. Defaults to 20.

**Return**
- (array): An array of user objects.

**Example**
```php
$searchQuery = 'John';
$users = Helper::searchWordPressUsers($searchQuery, 10);

// Output: A list of user objects matching the search query.
```

This documentation focuses on the functional aspects of each method, providing examples to demonstrate how they can be used in practice.