# Tasks API Function

The Tasks API provides methods to interact with task-related data in FluentBoards. This API allows you to retrieve, create, update, manage tasks, and handle task attachments, ensuring operations are secured based on user permissions.

## Initialization
To initialize the Tasks API, use the following code:
```php
$tasksApi = FluentBoardsApi('tasks');
```
`FluentBoardsApi('tasks')` returns an instance of the `FluentBoards\App\Api\Classes\Tasks` class.


## Methods

### getTasksByBoard()
The `getTasksByBoard` method retrieves all tasks associated with a specific board, excluding archived tasks.

**Parameters**
- `$board_id` (int|string): The ID of the board.
- `$with` (array): An array of relationships to include (optional).

**Return** 
- An array of `Task` models or `false` if the board ID is invalid or the user lacks permission.

**Example**
```php
$tasks = $tasksApi->getTasksByBoard(1, ['labels', 'assignees']);
```

### getTask()
The `getTask` method retrieves a single task by its ID.

**Parameters**
- `$id` (int|string): The ID of the task.

**Return**
- A `Task` model with the specified ID or `false` if the task is not found or the user lacks permission.

**Example**
```php
$task = $tasksApi->getTask(1);
```

### getTasksCreatedBy()
The `getTasksCreatedBy` method retrieves all tasks created by a specific user.

**Parameters**
- `$userId` (int|string): The ID of the user.
- `$with` (array): An array of relationships to include (optional).

**Return**
- An array of `Task` models or `false` if the user ID is invalid or the user lacks permission.

**Example**
```php
$tasks = $tasksApi->getTasksCreatedBy(2, ['labels']);
```

### create()
The `create` method creates a new task with the provided data.

**Parameters**
- `$data` (array): The task data, including `title`, `board_id`, and `stage_id` (all required).


**Return**
- The created `Task` model or `false` if creation fails due to missing data or permission issues.

**Example**
```php
$newTask = $tasksApi->create([
    'title' => 'New Task',
    'board_id' => 1,
    'stage_id' => 2,
    'description' => 'Task description'
]);
```

### createTask()
The `createTask` method defines the required and optional fields for creating a task.

**Parameters**
- `$data` (array): Task data including `title`, `board_id`, `stage_id`, and other optional fields.

**Return**
- A Task `model` or `false` if creation fails.

**Example**
```php
$tasksApi->createTask([
    'title' => 'Task Title',
    'board_id' => 1,
    'stage_id' => 2,
    // Additional fields as necessary
]);
```

### addAssignees()
The `addAssignees` method adds one or more assignees to a task.

**Parameters**
- `$task_id` (int): The ID of the task.
- `$assignees` (array): An array of WP user IDs to be added as assignees.

**Return**
- `true` if assignees were successfully added, otherwise `false`.

**Example**
```php
$tasksApi->addAssignees(1, [3, 4]);
```

### removeAssignees()
The `removeAssignees` method removes one or more assignees from a task.

**Parameters**
- `$task_id` (int): The ID of the task.
- `$assignees` (array): An array of WP user IDs to be removed as assignees.


**Return**
- `true` if assignees were successfully removed, otherwise `false`.

**Example**
```php
$tasksApi->removeAssignees(1, [3]);
```

### attachLabels()
The `attachLabels` method attaches one or more labels to a task.

**Parameters**
- `$taskId` (int): The ID of the task.
- `$labelIds` (array): An array of label IDs to be attached.

**Return**
- `true` if labels were successfully attached, otherwise `false`.

**Example**
```php
$tasksApi->attachLabels(1, [5, 6]);
```

### removeLabels()
The `removeLabels` method removes one or more labels from a task.

**Parameters**
- `$taskId` (int): The ID of the task.
- `$labelIds` (array): An array of label IDs to be removed.

**Return**
- `true` if labels were successfully removed, otherwise `false`.

**Example**
```php
$tasksApi->removeLabels(1, [5]);
```

### changeStage()
The `changeStage` method updates the stage of a task.

**Parameters**
- `$task` (int|Task): The ID of the task or a `Task` model.
- `$stageId` (int): The ID of the new stage.

**Return**
- The updated `Task` model or `false` if the operation fails.

**Example**
```php
$tasksApi->changeStage(1, 3);
```

### updateProperty()
The `updateProperty` method updates a specific property of a task.

**Parameters**
- `$taskId` (int): The ID of the task.
- `$property` (string): The property to update (e.g., title, description, due_at).
- `$value` (mixed): The new value for the property.

**Return**
- The updated `Task` model or `false` if the property is not allowed or the user lacks permission.

**Example**
```php
$updatedTask = $tasksApi->updateProperty(1, 'title', 'Updated Task Title');
```

### createTaskAttachment()
The `createTaskAttachment` method creates an attachment for a task.

**Parameters**
- `$boardId` (int): The ID of the board.
- `$taskId` (int): The ID of the task.
- `$data` (array): The attachment data, including title and url (required).

**Return**
- The created `TaskAttachment` model or `false` if creation fails.

**Example**
```php
$attachment = $tasksApi->createTaskAttachment(1, 1, [
    'title' => 'Attachment Title',
    'url' => 'https://example.com/attachment.jpg'
]);
```

### deleteTaskAttachment()
The `deleteTaskAttachment` method deletes an attachment from a task.

**Parameters**
- `$boardId` (int): The ID of the board.
- `$taskId` (int): The ID of the task.
- `$attachmentId` (int): The ID of the attachment.

**Return**
- `true` if the attachment was successfully deleted, otherwise `false`.

**Example**
```php
$tasksApi->deleteTaskAttachment(1, 1, 1);
```

### getInstance()
The `getInstance` method returns the raw `Task` model instance, allowing you to use all the methods of the query builder or ORM.

**Return**
- The `Task` model instance.

**Example**
```php
$taskInstance = $tasksApi->getInstance();
$task = $taskInstance->where('title', 'like', '%Task%')->first();
```