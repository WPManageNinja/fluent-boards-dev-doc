# TaskMeta Model

| DB Table Name | {wp_db_prefix}_fbs_task_metas                                             |
|---------------|----------------------------------------------------------------------------------|
| Schema        | <a :href="$withBase('/database/#fbs-task-metas-table')">Check Schema</a> |
| Source File   | fluent-TaskMetas/app/Models/TaskMeta.php                         |
| Name Space    | FluentTaskMetas\App\Models                                               |
| Class         | FluentTaskMetas\App\Models\TaskMeta                              |

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
        <td>Primary key of the task meta</td>
      </tr>
      <tr>
        <th>task_id</th>
        <td>INT UNSIGNED</td>
        <td>ID of the associated task</td>
      </tr>
      <tr>
        <th>key</th>
        <td>VARCHAR(100)</td>
        <td>Key for the meta information</td>
      </tr>
      <tr>
        <th>value</th>
        <td>LONGTEXT <i>NULL</i></td>
        <td>Value of the meta information</td>
      </tr>
      <tr>
        <th>created_at</th>
        <td>TIMESTAMP <i>NULL</i></td>
        <td>Timestamp when the meta was created</td>
      </tr>
      <tr>
        <th>updated_at</th>
        <td>TIMESTAMP <i>NULL</i></td>
        <td>Timestamp when the meta was last updated</td>
      </tr>
    </tbody>
</table>

## Usage
Please check <a href="/database/models/">Model Basic</a> for Common methods.

### Accessing Attributes

```php 
$taskMeta = FluentBoards\App\Models\TaskMeta::find(1);

$taskMeta->id; // returns id
$taskMeta->key; // returns key
$taskMeta->value; // returns value (unserialized)
.......
```

## Relations
This model has the following relationships that you can use

### task
Access the associated task

- return `FluentTaskMetas\App\Models\Task` Model Collection

#### Example:
```php 
$task = $taskMeta->task;
```

