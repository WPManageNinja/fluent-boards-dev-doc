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
Access the associated stages of a model

- return `FluentBoards\App\Models\Stage` Model Collection

#### Example:
```php 
// Accessing Stage
$taskStage = $task->stage;

```


### labels
Access all the associated labels of a model

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
Access all the associated subtasks of a model

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
Access all the associated parentTask of a model

- return `FluentBoards\App\Models\Task` Model Collections

#### Example:
```php 
// Accessing task subtasks
$parentTask = $task->parentTask;

```

## Methods
Along with Global Model methods, this model has few helper methods.

### updateMeta($key, $value)

Update or create a meta entry for the board.

- Parameters
  - $key `string`
  - $key `string`
- Returns `array`

#### Usage
```php 
$meta = $task->updateMeta('enable_stage_change_email', $enable_stage_change_email);
```
