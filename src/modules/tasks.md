# Task
Tasks are the fundamental units of work within a board. They represent individual item that need to be managed, tracked, or completed.
Tasks are highly versatile and can be customized to hold all the information related to a specific work.

## Creating a Task
If you want to create a task:
```php
FluentBoardsApi('tasks')->create($taskData);
```
`FluentBoardsApi()` this is fluent-boards global api function. You need to pass `'tasks'` argument to access all task related api.
`create()` method is used to create a new task. This function takes `$taskData` as an argument which must be an associative array.

```php
$taskData = [
    'title'       => 'Test Task',
    'board_id'    => 1,
    'stage_id'    => 2,
    'priority'    => 'low',
    'status'      => 'open'
];
```
- `$taskData['title']` `string` required
- `$taskData['board_id']` `integer` required
- `$taskData['stage_id']` `integer` required
- `$taskData['priority']` `integer`
- `$taskData['status']` `integer`

## Getting Tasks of a Board
```php
FluentBoardsApi('tasks')->getTasksByBoard($boardId, $with = []);
```

**Parameters**
- $boardId `int` required
- $with `array` 

**Return** `array`

## Getting a task
```php
FluentBoardsApi('tasks')->getTask($taskId);
```

**Parameters**
- $taskId `int` required

**Return** `object`

## Getting tasks created by an user
```php
FluentBoardsApi('tasks')->getTasksCreatedBy($userId, $with = []);
```

**Parameters**
- $userId `int` required
- $with `array` 

**Return** `array`

## Adding assignees to a task
```php
FluentBoardsApi('tasks')->addAssignees($taskId, $assigneeIds = []);
```

**Parameters**
- $taskId `int` required
- $assigneeIds `array` required

**Return** `boolean`

## Removing assignees from a task
```php
FluentBoardsApi('tasks')->removeAssignees($taskId, $assigneeIds = []);
```

**Parameters**
- $taskId `int` required
- $assigneeIds `array` required

**Return** `boolean`

## Attaching labels to a task
```php
FluentBoardsApi('tasks')->attachLabels($taskId, $labelIds = []);
```

**Parameters**
- $taskId `int` required
- $labelIds `array` required

**Return** `boolean`

## Removing labels from a task
```php
FluentBoardsApi('tasks')->removeLabels($taskId, $labelIds = []);
```

**Parameters**
- $taskId `int` required
- $labelIds `array` required

**Return** `boolean`