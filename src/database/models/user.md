# User Model

| DB Table Name | {wp_db_prefix}_users                                            |
|---------------|-----------------------------------------------------------------|
| Schema        | <a :href="$withBase('/database/#users-table')">Check Schema</a> |
| Source File   | fluent-boards/app/Models/User.php                               |
| Name Space    | FluentBoards\App\Models                                          |
| Class         | FluentBoards\App\Models\User                                     |

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
         <th>ID</th>
         <td>Integer</td>
         <td></td>
      </tr>
      <tr>
         <th>user_login</th>
         <td>String</td>
         <td></td>
      </tr>
      <tr>
         <th>user_pass</th>
         <td>String</td>
         <td></td>
      </tr>
      <tr>
         <th>user_nicename</th>
         <td>String</td>
         <td></td>
      </tr>
      <tr>
         <th>user_email</th>
         <td>String</td>
         <td></td>
      </tr>
      <tr>
         <th>user_url</th>
         <td>String</td>
         <td></td>
      </tr>
      <tr>
         <th>user_registered</th>
         <td>Date Time</td>
         <td></td>
      </tr>
      <tr>
         <th>user_activation_key</th>
         <td>String</td>
         <td></td>
      </tr>
      <tr>
         <th>user_status</th>
         <td>Integer</td>
         <td></td>
      </tr>
      <tr>
         <th>display_name</th>
         <td>String</td>
         <td></td>
      </tr>
   </tbody>
</table>

## Usage
Please check <a href="/database/models/">Model Basic</a> for Common methods.

### Accessing Attributes

```php 

$user = FluentBoards\App\Models\User::find(1);

$user->ID; // returns user ID
$user->user_email; // returns email
.......
```


## Relations
This model has the following relationships that you can use

### tasks
Access tasks associated with the user.

- return `FluentUsers\App\Models\Task` Model Collection

#### Example:
```php 
$userTasks = $user->tasks;
```

### watchingTasks
Access tasks that the user is watching.

- return `FluentUsers\App\Models\Task` Model Collections

#### Example:
```php 
$watchingTasks = $user->watchingTasks;
```

### highPriorityTasks
Access all the associated users of a User model

- return `FluentUsers\App\Models\Task` Model Collections

#### Example:
```php 
$highPriorityTasks = $user->highPriorityTasks;
```

### overDueTasks
Access overdue tasks associated with the user.

- return `FluentUsers\App\Models\Task` Model Collections

#### Example:
```php 
$overDueTasks = $user->overDueTasks;
```

### upcomingTasks
Access upcoming tasks associated with the user.

- return `FluentUsers\App\Models\Task` Model Collections

#### Example:
```php 
$upcomingTasks = $user->upcomingTasks;
```


### upcomingWithoutDuedate
Access upcoming tasks without a due date.

- return `FluentUsers\App\Models\Task` Model Collections

#### Example:
```php 
$upcomingTasksNoDueDate = $user->upcomingWithoutDuedate;
```


### boards
Access boards associated with the user.

- return `FluentUsers\App\Models\Board` Model Collections

#### Example:
```php 
$userBoards = $user->boards;
```

### whichBoards
Access boards where the user has a specific relationship.

- return `FluentUsers\App\Models\Board` Model Collections

#### Example:
```php 
$userWhichBoards = $user->whichBoards;
```

### notifications
Access notifications associated with the user.

- return `FluentUsers\App\Models\Notification` Model Collections

#### Example:
```php 
$userNotifications = $user->notifications;
```

<hr />

