# Notification Model

| DB Table Name | {wp_db_prefix}_fbs_notifications                                            |
|---------------|-----------------------------------------------------------------------------|
| Schema        | <a :href="$withBase('/database/#fbs-notifications-table')">Check Schema</a> |
| Source File   | fluent-boards/app/Models/Notification.php                            |
| Name Space    | FluentBoards\App\Models                                              |
| Class         | FluentBoards\App\Models\Notification                                 |

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
      <td>Primary key of the notification</td>
    </tr>
    <tr>
      <th>object_id</th>
      <td>INT UNSIGNED</td>
      <td>ID of the associated object (e.g., Task ID, Board ID)</td>
    </tr>
    <tr>
      <th>object_type</th>
      <td>VARCHAR(100)</td>
      <td>Type of the object (e.g., Task, Comment, Board)</td>
    </tr>
    <tr>
      <th>task_id</th>
      <td>INT UNSIGNED <i>NULL</i></td>
      <td>ID of the task associated with the notification (if applicable)</td>
    </tr>
    <tr>
      <th>action</th>
      <td>VARCHAR(255) <i>NULL</i></td>
      <td>Action performed (e.g., task\_created, priority\_changed)</td>
    </tr>
    <tr>
      <th>activity_by</th>
      <td>BIGINT UNSIGNED</td>
      <td>ID of the user who performed the action</td>
    </tr>
    <tr>
      <th>description</th>
      <td>LONGTEXT <i>NULL</i></td>
      <td>Description of the notification or action</td>
    </tr>
    <tr>
      <th>settings</th>
      <td>TEXT <i>NULL</i></td>
      <td>Serialized array for additional settings or metadata</td>
    </tr>
    <tr>
      <th>created_at</th>
      <td>TIMESTAMP <i>NULL</i></td>
      <td>Timestamp when the notification was created</td>
    </tr>
    <tr>
      <th>updated_at</th>
      <td>TIMESTAMP <i>NULL</i></td>
      <td>Timestamp when the notification was last updated</td>
    </tr>
  </tbody>
</table>

## Usage
Please check <a href="/database/models/">Model Basic</a> for Common methods.

### Accessing Attributes

```php 

$notification = FluentBoards\App\Models\Notification::find(1);

$notification->id; // returns id
$notification->action; // returns action
.......
```

## Relations
This model has the following relationships that you can use

### activitist
Access the user who triggered the activity

- return `FluentNotifications\App\Models\User` Model Collection

#### Example:
```php 
$activitist = $notification->activitist;
```

### board
Access the board associated with the notification

- return `FluentNotifications\App\Models\Board` Model Collections

#### Example:
```php 
$board = $notification->board;
```

### task
Access the task associated with the notification

- return `FluentNotifications\App\Models\Task` Model Collections

#### Example:
```php 
$task = $notification->task;
```

### users
Access the users associated with the notification

- return `FluentNotifications\App\Models\User` Model Collections

#### Example:
```php 
$users = $notification->users;
```

<hr />

## Methods
Along with Global Model methods, this model has few helper methods.

### checkReadOrNot

Check if the notification has been read by the current user.

#### Usage
```php 
$isRead = $notification->checkReadOrNot();
```
