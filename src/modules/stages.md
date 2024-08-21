#  Stage
In FLuentBoards, each board is made up of one or more stages. These stages are normally arranged side by side on the board,
allowing you to see your entire workflow at a glance.

## Creating a stage
If you want to create a stage in a board:
```php
FluentBoardsApi('stages')->create($stageData);
```
`FluentBoardsApi()` this is fluent-boards global api function. You need to pass `'stages'` argument to access all stage related api.
`create()` method is used to create a new stage. This function takes `$stageData` as an argument which must be an associative array.

```php
$taskData = [
    'title'       => 'Test Stage',
    'board_id'    => 1,
    'status'      => 'open'
];
```
- `$taskData['title']` `string` required
- `$taskData['board_id']` `integer` required
- `$taskData['status']` `string` values: `'open'` or `'closed'`, default: `'open'`

## Getting Stages of a Board
```php
FluentBoardsApi('stages')->getStagesByBoard($boardId, $with = []);
```

**Parameters**
- $boardId `int` required
- $with `array`

**Return** `array`

## Getting a task
```php
FluentBoardsApi('stages')->getStage($taskId, $with = []);
```

**Parameters**
- $taskId `int` required
- $with `array`

**Return** `object`

## Updating a stage
```php
FluentBoardsApi('stages')->updateProperty($stageId, $property, $value);
```

**Parameters**
- $stageId `int` required
- $property `string` required, possible values: `'title'` or `'status'` or `'bg_color'`
- $value `string` required

`$value` could be either a value of `title` or `status` or `bg_color`. For `title` it will be a regular 
string, for `status` it must be a string valued either 'open' or 'closed' and for `bg_color` will must be 
color hex code like `'#DAF7A6'`

**Return** `object`

## Archiving a stage
```php
FluentBoardsApi('stages')->archiveStage($stageId);
```

**Parameters**
- $stageId `int` required

**Return** `object`

## Restoring a archived stage
```php
FluentBoardsApi('stages')->restoreStage($stageId);
```

**Parameters**
- $stageId `int` required

**Return** `object`