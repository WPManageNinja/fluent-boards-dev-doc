# Stages API Function

The Stages API provides methods to interact with stage-related data in FluentBoards. This API allows you to retrieve, create, update, and manage stages, ensuring that operations are secured based on user permissions.

## Initialization
To initialize the Stages API, use the following code:

```php
$stagesApi = FluentBoardsApi('stages');
```
`FluentBoardsApi('stages')` returns an instance of the `FluentBoards\App\Api\Classes\Stages` class.

## Methods

### getStage()
The `getStage` method retrieves a single stage by its ID, optionally including related data.

**Parameters**
- `$id` (int|string): The ID of the stage.
- `$with` (array): An array of relationships to include (optional).

**Return** 
- A `Stage` model with the specified ID or `false` if the stage is not found or the user lacks permission.

**Example**
```php
$stage = $stagesApi->getStage(1, ['tasks']);
```

### getStagesByBoard()
The `getStagesByBoard` method retrieves all stages associated with a specific board, excluding archived stages.

**Parameters**
- `$boardId` (int|string): The ID of the board.
- `$with` (array): An array of relationships to include (optional).

**Return**
- An array of `Stage` models or `false` if the board ID is invalid or the user lacks permission.

**Example**
```php
$stages = $stagesApi->getStagesByBoard(1, ['tasks']);
```

### create()
The `create` method creates a new stage with the provided data.

**Parameters**
- `$data` (array): The stage data, including `title` and `board_id` (both required).

**Return**
- The created `Stage` model or `false` if creation fails due to missing data or permission issues.

**Example**
```php
$newStage = $stagesApi->create([
    'title' => 'Planning',
    'board_id' => 1
]);
```

### updateProperty()
The `updateProperty` method updates a specific property of a stage.

**Parameters**
- `$stageId` (int): The ID of the stage.
- `$property` (string): The property to update (title, status, or bg_color).
- `$value` (mixed): The new value for the property.

**Return**
- The updated `Stage` model or `false` if the property is not allowed or the user lacks permission.


**Example**
```php
$updatedStage = $stagesApi->updateProperty(1, 'title', 'In Progress');
```

### archiveStage()
The `archiveStage` method archives a specific stage by its ID.

**Parameters**
- `$stageId` (int|string): The ID of the stage.

**Return**
- The archived `Stage` model or `false` if the archive operation fails.


**Example**
```php
$archivedStage = $stagesApi->archiveStage(1);
```

### restoreStage()
The `restoreStage` method restores a previously archived stage by its ID.

**Parameters**
- `$stageId` (int|string): The ID of the stage.

**Return**
- The restored `Stage` model or `false` if the restore operation fails.


**Example**
```php
$restoredStage = $stagesApi->restoreStage(1);
```

### getInstance()
The `getInstance` method returns the raw `Stage` model instance, allowing you to use all the methods of the query builder or ORM.

**Return**
- The `Stage` model instance.


**Example**
```php
$stageInstance = $stagesApi->getInstance();
$stage = $stageInstance->where('title', 'like', '%To Do%')->first();
```

