# Activity Model

| DB Table Name | {wp_db_prefix}_fbs_Activity                                            |
|---------------|-----------------------------------------------------------------------|
| Schema        | <a :href="$withBase('/database/#fbs-activities-table')">Check Schema</a> |
| Source File   | fluent-boards/app/Models/Activity.php                                    |
| Name Space    | FluentBoards\App\Models                                               |
| Class         | FluentBoards\App\Models\Activity                                         |

## Attributes
<table class="nowrap">
   <thead>
      <tr>
         <th>Attribute</th>
         <td>Data Type</td>
         <td>Activity</td>
      </tr>
   </thead>
    <tbody>
      <tr>
        <th>id</th>
        <td>INT UNSIGNED <i>Auto Increment</i></td>
        <td>Primary key of the activity log</td>
      </tr>
      <tr>
        <th>object_id</th>
        <td>INT UNSIGNED</td>
        <td>ID of the associated object (e.g., Task ID)</td>
      </tr>
      <tr>
        <th>object_type</th>
        <td>VARCHAR(100)</td>
        <td>Type of the object (e.g., Task, Comment, Board)</td>
      </tr>
      <tr>
        <th>action</th>
        <td>VARCHAR(50)</td>
        <td>Action performed (e.g., create, update, delete)</td>
      </tr>
      <tr>
        <th>column</th>
        <td>VARCHAR(50) <i>NULL</i></td>
        <td>The specific column that was changed (if applicable)</td>
      </tr>
      <tr>
        <th>old_value</th>
        <td>VARCHAR(50) <i>NULL</i></td>
        <td>The old value before the change</td>
      </tr>
      <tr>
        <th>new_value</th>
        <td>VARCHAR(50) <i>NULL</i></td>
        <td>The new value after the change</td>
      </tr>
      <tr>
        <th>description</th>
        <td>LONGTEXT <i>NULL</i></td>
        <td>Description of the activity or change</td>
      </tr>
      <tr>
        <th>created_by</th>
        <td>BIGINT UNSIGNED <i>NULL</i></td>
        <td>ID of the user who performed the action</td>
      </tr>
      <tr>
        <th>settings</th>
        <td>TEXT <i>NULL</i></td>
        <td>Serialized array for additional settings or metadata</td>
      </tr>
      <tr>
        <th>created_at</th>
        <td>TIMESTAMP <i>NULL</i></td>
        <td>Timestamp when the activity was created</td>
      </tr>
      <tr>
        <th>updated_at</th>
        <td>TIMESTAMP <i>NULL</i></td>
        <td>Timestamp when the activity was last updated</td>
      </tr>
    </tbody>
</table>

## Usage
Please check <a href="/database/models/">Model Basic</a> for Common methods.

### Accessing Attributes

```php 

$activity = FluentBoards\App\Models\Activity::find(1);

$activity->id; // returns id
$activity->action; // returns action
.......

```

## Scopes

This model has the following scopes that you can use

### type()
Filter activities by object type

#### Usage:

```php 
$activities = FluentBoards\App\Models\Activity::type('task')->get();
```

## Relations
This model has the following relationships that you can use

### board
Access the board associated with the activity

- return `FluentBoards\App\Models\Board` Model Collection

#### Example:
```php 
$board = $activity->board;
```

### task
Access the task associated with the activity

- return `FluentBoards\App\Models\Task` Model Collection

#### Example:
```php 
$task = $activity->task;
```

### user
Access the user who created the activity

- return `FluentBoards\App\Models\User` Model Collection

#### Example:
```php 
$user = $activity->user;
```

