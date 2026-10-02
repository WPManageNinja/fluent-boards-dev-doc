# TaskMeta Model

| DB Table Name | `{wp_db_prefix}fbs_task_metas` |
|---------------|--------------------------------|
| Schema        | [Check Schema](/database/#fbs-task-metas-table) |
| Source File   | fluent-boards/app/Models/TaskMeta.php |
| Name Space    | FluentBoards\App\Models |
| Class         | FluentBoards\App\Models\TaskMeta |

Key/value meta for tasks. In most cases use `Task::getMeta()` and `Task::updateMeta()` instead of this model.

Keys used by the plugin include:

| Key | Meaning |
|---|---|
| `is_pinned` | Task is pinned (read by `Task::$is_pinned`) |
| `group_name` | Name of a subtask group on the parent task |
| `subtask_group_id` | On a subtask: the ID of its subtask group meta row |
| `upvote` | Roadmap upvotes |

## Attributes

| Attribute | Data Type | Comment |
|---|---|---|
| id | INT UNSIGNED | Primary key |
| task_id | INT UNSIGNED | Task ID |
| key | VARCHAR(100) | Meta key |
| value | LONGTEXT NULL | Serialized on write, unserialized on read |
| created_at | TIMESTAMP NULL | |
| updated_at | TIMESTAMP NULL | |

## Usage

Please check [Model Basic](/database/models/) for common methods.

```php
use FluentBoards\App\Models\TaskMeta;

TaskMeta::create([
    'task_id' => 42,
    'key'     => 'my_plugin_data',
    'value'   => ['foo' => 'bar'], // stored serialized
]);

$value = TaskMeta::where('task_id', 42)->where('key', 'my_plugin_data')->value('value');
```

::: tip
`value()` on the query builder returns the raw column, so serialized data comes back as a string. Load the model (`->first()->value`) to get it unserialized.
:::

## Relations

### task

- Returns `FluentBoards\App\Models\Task`

### subtasks

For a subtask group row (`key = 'group_name'`): the subtasks that belong to the group, found through `subtask_group_id` meta rows whose `value` is this row's ID.

- Returns a collection of `FluentBoards\App\Models\Task`

```php
foreach ($task->subtaskGroup as $group) {
    $groupName = $group->value;
    $subtasks  = $group->subtasks;
}
```
