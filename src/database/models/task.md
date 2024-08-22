# Task Model

| DB Table Name | {wp_db_prefix}_fbs_tasks                                            |
|---------------|---------------------------------------------------------------------|
| Schema        | <a :href="$withBase('/database/#fbs-tasks-table')">Check Schema</a> |
| Source File   | fluent-boards/app/Models/Task.php                                   |
| Name Space    | FluentBoards\App\Models                                             |
| Class         | FluentBoards\App\Models\Task                                        |

## Attributes
<table class="nowrap">
   <thead>
      <tr>
         <th>Attribute</th>
         <td>Data Type</td>
         <td>Comment</td>
      </tr>
   </thead>
   <tbody>
      <tr>
         <th>id</th>
         <td>INT UNSIGNED <i>Auto Increment</i></td>
         <td>Primary key of the task</td>
      </tr>
      <tr>
         <th>parent_id</th>
         <td>INT UNSIGNED <i>NULL</i></td>
         <td>Parent task ID if this is a subtask</td>
      </tr>
      <tr>
         <th>board_id</th>
         <td>INT UNSIGNED <i>NULL</i></td>
         <td>ID of the board the task is in</td>
      </tr>
      <tr>
         <th>crm_contact_id</th>
         <td>BIGINT UNSIGNED <i>NULL</i></td>
         <td>User ID, Contact ID, Deal ID, Subscriber ID, etc.</td>
      </tr>
      <tr>
         <th>title</th>
         <td>TEXT <i>NULL</i></td>
         <td>Title or name of the task; it can be longer than 255 characters.</td>
      </tr>
      <tr>
         <th>slug</th>
         <td>VARCHAR(255) <i>NULL</i></td>
         <td>Slug of the task</td>
      </tr>
      <tr>
         <th>type</th>
         <td>VARCHAR(50) <i>NULL</i></td>
         <td>Type of the task, e.g., task, deal, idea, to-do, etc.</td>
      </tr>
      <tr>
         <th>status</th>
         <td>VARCHAR(50) <i>NULL</i> DEFAULT 'open'</td>
         <td>Status of the task: open, completed; for boards: won or lost for pipelines</td>
      </tr>
      <tr>
         <th>stage_id</th>
         <td>INT UNSIGNED <i>NULL</i></td>
         <td>ID of the stage the task is in</td>
      </tr>
      <tr>
         <th>source</th>
         <td>VARCHAR(50) <i>NULL</i> DEFAULT 'web'</td>
         <td>Source of the task, e.g., web, funnel, contact-section, etc.</td>
      </tr>
      <tr>
         <th>source_id</th>
         <td>VARCHAR(255) <i>NULL</i></td>
         <td>Source ID related to the task</td>
      </tr>
      <tr>
         <th>priority</th>
         <td>VARCHAR(50) <i>NULL</i> DEFAULT 'low'</td>
         <td>Priority of the task: low, medium, high</td>
      </tr>
      <tr>
         <th>description</th>
         <td>LONGTEXT <i>NULL</i></td>
         <td>Description of the task</td>
      </tr>
      <tr>
         <th>lead_value</th>
         <td>DECIMAL(10,2) DEFAULT 0.00</td>
         <td>Lead value associated with the task</td>
      </tr>
      <tr>
         <th>created_by</th>
         <td>BIGINT UNSIGNED <i>NULL</i></td>
         <td>ID of the user who created the task</td>
      </tr>
      <tr>
         <th>position</th>
         <td>DECIMAL(10,2) NOT NULL DEFAULT '1'</td>
         <td>Position of the task within the board. 1 = first, 2 = second, etc.</td>
      </tr>
      <tr>
         <th>comments_count</th>
         <td>INT UNSIGNED <i>NULL</i> DEFAULT 0</td>
         <td>Number of comments associated with the task</td>
      </tr>
      <tr>
         <th>issue_number</th>
         <td>INT UNSIGNED <i>NULL</i></td>
         <td>Board-specific issue number to track the task</td>
      </tr>
      <tr>
         <th>reminder_type</th>
         <td>VARCHAR(100) <i>NULL</i> DEFAULT 'none'</td>
         <td>Type of reminder set for the task</td>
      </tr>
      <tr>
         <th>settings</th>
         <td>TEXT <i>NULL</i></td>
         <td>Serialized settings for the task</td>
      </tr>
      <tr>
         <th>remind_at</th>
         <td>TIMESTAMP <i>NULL</i></td>
         <td>Timestamp when a reminder is set for the task</td>
      </tr>
      <tr>
         <th>started_at</th>
         <td>TIMESTAMP <i>NULL</i></td>
         <td>Timestamp when the task was started</td>
      </tr>
      <tr>
         <th>due_at</th>
         <td>TIMESTAMP <i>NULL</i></td>
         <td>Timestamp when the task is due</td>
      </tr>
      <tr>
         <th>last_completed_at</th>
         <td>TIMESTAMP <i>NULL</i></td>
         <td>Timestamp when the task was last completed</td>
      </tr>
      <tr>
         <th>archived_at</th>
         <td>TIMESTAMP <i>NULL</i></td>
         <td>Timestamp when the task was archived</td>
      </tr>
      <tr>
         <th>created_at</th>
         <td>TIMESTAMP <i>NULL</i></td>
         <td>Timestamp when the task was created</td>
      </tr>
      <tr>
         <th>updated_at</th>
         <td>TIMESTAMP <i>NULL</i></td>
         <td>Timestamp when the task was last updated</td>
      </tr>
   </tbody>
</table>
## Usage
Please check <a href="/database/models/">Model Basic</a> for Common methods.

### Accessing Attributes

```php 

$task = FluentBoards\App\Models\Task::find(1);

$task->id; // returns id
$task->title; // returns title
.......
```

## Scopes

This model has the following scopes that you can use

## Scopes

This model has the following scopes that you can use

### type($type)
Filter task by type

- Parameters
  - $type - `string` - Type of the task

#### Usage:

```php 
// Get all boards by user id
$task = FluentBoards\App\Models\Task::type('task')->get();
```

### upcoming()
To check is task upcoming

#### Usage:

```php 
// Is task upcoming
$upcoming = $task->upcoming();
```

### isOverdue()
To check is task overdue

#### Usage:

```php 
// Is task upcoming
$upcoming = $task->isOverdue();
```


## Relations
This model has the following relationships that you can use

### board
Access the associated stages of a model

- return `FluentBoards\App\Models\Board` Model Collection

#### Example:
```php 
// Accessing Board
$taskBoard = $task->board;

```

### stage
Access the associated stages of a task model

- return `FluentBoards\App\Models\Stage` Model Collection

#### Example:
```php 
// Accessing Stage
$taskStage = $task->stage;

```


### labels
Access all the associated labels of a task model

- return `FluentBoards\App\Models\Label` Model Collections

#### Example:
```php 
// Accessing task labels
$taskTasks = $task->labels;

// For Filtering by tags relationship

// Get Task which has label slug: green
$tasks = FluentBoards\App\Models\Task::whereHas('labels', funtion($query) {
    $query->where('slug', 'green');
})->get();

// Get Task which does not have label slug: green
$tasks = FluentBoards\App\Models\Board::whereDoesntHave('tasks', funtion($query) {
    $query->where('slug', 'green');
})->get();
```

### subtasks
Access all the associated subtasks of a task model

- return `FluentBoards\App\Models\Task` Model Collections

#### Example:
```php 
// Accessing task subtasks
$subtasks = $task->subtasks;

// For Filtering by tags relationship

// Get Tasks which has subtask status: open
$tasks = FluentBoards\App\Models\Task::whereHas('subtasks', funtion($query) {
    $query->where('status', 'open');
})->get();

// Get Tasks which does not have subtask status: open
$tasks = FluentBoards\App\Models\Board::whereDoesntHave('tasks', funtion($query) {
    $query->where('status', 'open');
})->get();
```

### parentTask
Access all the associated parentTask of a task model

- return `FluentBoards\App\Models\Task` Model Collections

#### Example:
```php 
// Accessing task subtasks
$parentTask = $task->parentTask;

```

### assignees
Access all the associated assignees of a task model

- return `FluentBoards\App\Models\User` Model Collections

#### Example:
```php 
// Accessing task assignees
$assignees = $task->assignees;

// For Filtering by assignees relationship

// Get Tasks which have assignee with id 1
$tasks = FluentBoards\App\Models\Task::whereHas('assignees', function($query) {
    $query->where('ID', 1);
})->get();

// Get Tasks which do not have assignee with id 1
$tasks = FluentBoards\App\Models\Task::whereDoesntHave('assignees', function($query) {
    $query->where('ID', 1);
})->get();
```

### watchers
Access all the associated watchers of a task model

- return `FluentBoards\App\Models\User` Model Collections

#### Example:
```php 
// Accessing task watchers
$watchers = $task->watchers;

// For filtering by watchers relationship

// Get Tasks which have a watcher with user id 1
$tasks = FluentBoards\App\Models\Task::whereHas('watchers', function($query) {
    $query->where('foreign_id', 1)
          ->where('object_type', Constant::OBJECT_TYPE_USER_TASK_WATCH);
})->get();

// Get Tasks which do not have a watcher with user id 1
$tasks = FluentBoards\App\Models\Task::whereDoesntHave('watchers', function($query) {
    $query->where('foreign_id', 1)
          ->where('object_type', Constant::OBJECT_TYPE_USER_TASK_WATCH);
})->get();

```

### attachments
Access all the associated attachments of a task model

- return `FluentBoards\App\Models\TaskAttachment` Model Collections

#### Example:
```php 
// Accessing task attachments
$attachments = $task->attachments;

// For filtering by attachments relationship

// Get Tasks which have attachments
$tasks = FluentBoards\App\Models\Task::whereHas('attachments', function($query) {
    $query->where('object_type', Constant::OBJECT_TYPE_TASK);
})->get();

// Get Tasks which do not have attachments
$tasks = FluentBoards\App\Models\Task::whereDoesntHave('attachments', function($query) {
    $query->where('object_type', Constant::OBJECT_TYPE_TASK);
})->get();

```

### comments
Access all the associated comments of a task model

- return `FluentBoards\App\Models\Comment` Model Collections

#### Example:
```php 
// Accessing task comments
$comments = $task->comments;

// For filtering by comments relationship

// Get Tasks which have comments
$tasks = FluentBoards\App\Models\Task::whereHas('comments', function($query) {
    $query->where('type', 'comment')
          ->where('parent_id', null);
})->get();

// Get Tasks which do not have comments
$tasks = FluentBoards\App\Models\Task::whereDoesntHave('comments', function($query) {
    $query->where('type', 'comment')
          ->where('parent_id', null);
})->get();

```

### public_comments
Access all the associated public_comments of a task model

- return `FluentBoards\App\Models\Comment` Model Collections

#### Example:
```php 
// Accessing public comments for a task
$publicComments = $task->public_comments;

// For filtering by public comments relationship

// Get Tasks which have public comments
$tasks = FluentBoards\App\Models\Task::whereHas('public_comments')->get();

// Get Tasks which do not have public comments
$tasks = FluentBoards\App\Models\Task::whereDoesntHave('public_comments')->get();

```

### activities
Access all the associated activities of a task model

- return `FluentBoards\App\Models\Activity` Model Collections

#### Example:
```php 
// Accessing task activities
$activities = $task->activities;

// For filtering by activities relationship

// Get Tasks which have activities
$tasks = FluentBoards\App\Models\Task::whereHas('activities', function($query) {
    $query->where('object_type', Constant::ACTIVITY_TASK);
})->get();

// Get Tasks which do not have activities
$tasks = FluentBoards\App\Models\Task::whereDoesntHave('activities', function($query) {
    $query->where('object_type', Constant::ACTIVITY_TASK);
})->get();

```

### customFields
Access all the associated customFields of a task model

- return `FluentBoards\App\Models\CustomField` Model Collections

#### Example:
```php 
// Accessing task custom fields
$customFields = $task->customFields;

// For filtering by custom fields relationship

// Get Tasks which have a custom field with a specific ID
$tasks = FluentBoards\App\Models\Task::whereHas('customFields', function($query) {
    $query->where('foreign_id', 1)
          ->where('object_type', ProConstant::TASK_CUSTOM_FIELD);
})->get();

// Get Tasks which do not have a custom field with a specific ID
$tasks = FluentBoards\App\Models\Task::whereDoesntHave('customFields', function($query) {
    $query->where('foreign_id', 1)
          ->where('object_type', ProConstant::TASK_CUSTOM_FIELD);
})->get();

```

### notifications
Access all the associated notifications of a task model

- return `FluentBoards\App\Models\Notification` Model Collections

#### Example:
```php 
// Accessing task notifications
$notifications = $task->notifications;

// For filtering by notifications relationship

// Get Tasks which have notifications
$tasks = FluentBoards\App\Models\Task::whereHas('notifications')->get();

// Get Tasks which do not have notifications
$tasks = FluentBoards\App\Models\Task::whereDoesntHave('notifications')->get();

```

### taskMeta
Access all the associated taskMeta of a task model

- return `FluentBoards\App\Models\TaskMeta` Model Collections

#### Example:
```php 
// Accessing task metadata
$taskMeta = $task->taskMeta;

// For filtering by task metadata relationship

// Get Tasks which have metadata
$tasks = FluentBoards\App\Models\Task::whereHas('taskMeta')->get();

// Get Tasks which do not have metadata
$tasks = FluentBoards\App\Models\Task::whereDoesntHave('taskMeta')->get();

```

## Methods
Along with Global Model methods, this model has few helper methods.

### createTask($data)

Create a new task.

- Parameters
  - $data `array`: An associative array containing the task data. The array may include keys for 'assignees' and 'labels', among others.
- Returns `Task`: The created task instance.

#### Usage
```php 
$data = [
    'title' => 'New Task Title', // required
    'description' => 'Description of the task', // optional
    'board_id' => 1, // required
    'stage_id' => 1, // required
];

$createdTask = $this->createTask($data);

```

### addOrRemoveAssignee($idToAddOrRemove)

Add or remove an assignee from the task based on their current assignment status.

- Parameters
  - $idToAddOrRemove `int`: The ID of the user to add or remove as an assignee.
- Returns `string`: The operation performed, either `'added'` or `'removed'`.

#### Usage
```php 
$idToModify = 123; // User ID to add or remove

$operation = $task->addOrRemoveAssignee($idToModify);

echo "The user was " . $operation . " as an assignee.";

```

### moveToNewPosition($newIndex)

Move the task to a new position in the list, adjusting the positions of other tasks as necessary.

- Parameters
  - $newIndex `int`: The new position index where the task should be moved. This index is 1-based.
- Returns `self`:  The updated task instance with the new position.

#### Usage
```php 
$newIndex = 3; // The desired new position of the task

$updatedTask = $task->moveToNewPosition($newIndex);

echo "The task has been moved to position " . $updatedTask->position;
```

### adjustSubtaskCount($subTaskParentId)

Adjust the subtask count for a given parent task by updating its settings.

- Parameters
  - $subTaskParentId `int`: The ID of the parent task whose subtask count needs to be updated.
- Returns `void`:  This method does not return a value.

#### Usage
```php 
$parentTaskId = 123; // The ID of the parent task

Task::adjustSubtaskCount($parentTaskId);
```
### updateMeta($key, $value)

Update an existing meta entry or create a new one for the task.

- Parameters
  - $key `string`: The key of the meta entry.
  - $value `mixed`: The value to associate with the key.
- Returns `TaskMeta`: The updated or newly created `TaskMeta` instance.

#### Usage
```php 
$key = 'is_template';
$value = 'yes';

$meta = $task->updateMeta($key, $value);

echo "Meta updated with key: " . $meta->key . " and value: " . $meta->value;

```

### getMeta($key, $default = null)

Retrieve the value of a meta entry for the task. If the meta entry does not exist, return a default value.

- Parameters
  - $key `string`: The key of the meta entry to retrieve.
  - $default `mixed`: The default value to return if the meta entry does not exist. Defaults to `null`.
- Returns `mixed`: The value of the meta entry if it exists, otherwise the default value.

#### Usage
```php 
$key = 'is_template';
$default = 'yes';

$value = $task->getMeta($key, $default);

echo "The meta value is: " . $value;

```

### close()

Mark the task as closed by updating its status and setting the completion time.

- Parameters
  - None.
- Returns `self`: The updated task instance.

#### Usage
```php 
$task = $task->close();

echo "The task has been closed and its status is now: " . $task->status;

```

### reopen()

Reopen the task by changing its status to open and clearing the completion time.

- Parameters
  - None.
- Returns `self`: The updated task instance.

#### Usage
```php 
$task = $task->reopen();

echo "The task has been reopened and its status is now: " . $task->status;

```