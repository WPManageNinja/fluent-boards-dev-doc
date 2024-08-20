# Board Model

| DB Table Name | {wp_db_prefix}_fbs_boards                                             |
|---------------|-----------------------------------------------------------------------|
| Schema        | <a :href="$withBase('/database/#fbs-boards-table')">Check Schema</a> |
| Source File   | fluent-boards/app/Models/Board.php                                    |
| Name Space    | FluentBoards\App\Models                                               |
| Class         | FluentBoards\App\Models\Board                                         |

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
         <td>Primary key of the board</td>
      </tr>
      <tr>
         <th>parent_id</th>
         <td>INT UNSIGNED <i>NULL</i></td>
         <td>For SuperBoard like Project or Company, for sub-board etc.</td>
      </tr>
      <tr> 
         <th>title</th>
         <td>TEXT <i>NULL</i>
         </td><td>Title of the board, it can be longer than 255 characters.</td>
      </tr>
      <tr> 
         <th>description</th>
         <td>LONGTEXT <i>NULL</i></td>
         <td>Description of the board</td>
      </tr>
      <tr>
         <th>type</th>
         <td>VARCHAR(50) <i>NULL</i></td>
         <td>Type of the board, e.g., to-do, sales-pipeline, roadmap, task, etc.</td>
      </tr>
      <tr>
         <th>currency</th>
         <td>VARCHAR(50) <i>NULL</i></td>
         <td>Currency related to the board</td>
      </tr>
      <tr>
         <th>background</th>
         <td>TEXT <i>NULL</i></td>
         <td>Serialized array for background settings</td>
      </tr>
      <tr>
         <th>settings</th>
         <td>TEXT <i>NULL</i></td>
         <td>Serialized array for other board settings</td>
      </tr>
      <tr>
         <th>created_by</th>
         <td>INT UNSIGNED</td>
         <td>ID of the user who created the board</td>
      </tr>
      <tr>
         <th>archived_at</th>
         <td>TIMESTAMP <i>NULL</i>
         </td><td>Timestamp when the board was archived</td>
      </tr>
      <tr>
         <th>created_at</th>
         <td>TIMESTAMP <i>NULL</i></td>
         <td>Timestamp when the board was created</td>
      </tr>
      <tr>
         <th>updated_at</th>
         <td>TIMESTAMP <i>NULL</i></td>
         <td>Timestamp when the board was last updated</td>
      </tr>
    </tbody>
</table>

## Usage
Please check <a href="/database/models/">Model Basic</a> for Common methods.

### Accessing Attributes

```php 

$board = FluentBoards\App\Models\Board::find(1);

$board->id; // returns id
$board->title; // returns title
.......
```

## Scopes

This model has the following scopes that you can use

### byAccessUser($userId)
Filter board by user id

- Parameters
    - $userId - numeric user id

#### Usage:

```php 
// Get all boards by user id
$bards = FluentBoards\App\Models\Board::byAccessUser($userId)->get();
```


## Relations
This model has the following relationships that you can use

### stages
Access the associated stages of a model

- return `FluentBoards\App\Models\Stage` Model Collection

#### Example:
```php 
// Accessing Stages
$boardStages = $board->stages;

// For Filtering by tags relationship

// Get Boards which has stage slug: completed
$boards = FluentBoards\App\Models\Board::whereHas('tasks', function ($query) {
                $query->where('type', 'task');
            })->get();

// Get Boards which does not have stage slug: completed
$campaigns = FluentBoards\App\Models\Board::whereDoesntHave('tasks', function ($query) {
                $query->where('type', 'task');
            })->get();

```

### tasks
Access all the associated tasks of a model

- return `FluentBoards\App\Models\Task` Model Collections

#### Example:
```php 
// Accessing board tasks
$boardTasks = $board->tasks;

// For Filtering by tags relationship

// Get Board which has task type: task
$boards = FluentBoards\App\Models\Board::whereHas('tasks', funtion($query) {
    $query->where('type', 'task');
})->get();

// Get Board which does not have task type: task
$boards = FluentBoards\App\Models\Board::whereDoesntHave('tasks', funtion($query) {
    $query->where('type', 'task');
})->get();
```

### users
Access all the associated users of a Board model

- return `FluentBoards\App\Models\User` Model Collections

#### Example:
```php 
// Accessing All the users of board
$campaignSubjects = $campaign->users;
```

<hr />

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
$meta = $board->updateMeta('enable_stage_change_email', $enable_stage_change_email);
```
