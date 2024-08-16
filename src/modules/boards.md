# Board
In FluentBoards, a board is the central organizational structure that acts as a digital workspace where all tasks, ideas,
and projects are visualized and managed. It’s essentially the canvas on which you can plan, organize, and track the progress of your work.

## Creating a board
If you want to create a board:
```php
FluentBoardsApi('boards')->create($boardData);
```
`FluentBoardsApi()` this is fluent-boards global api function. You need to pass `'boards'` argument to access all board related api.
`create()` method is used to create a new board. This function takes `$boardData` as an argument which must be an associative array.

```php
$boardData = [
    'title'           => 'Test Board',
    'description'     => 'test board description',
];
```
`$boardData` can have `title` and `description` initially but `title` is required.

## Getting boards
```php
FluentBoardsApi('boards')->getBoards();
```
`getBoards()` method is used to get boards. This method can have some optional parameters

**Parameters**
- $with `array` - default value empty array `[]`
- $sortBy `string` - default value `'title'`
- $sortOrder `string` - default value `'asc'`

**Return** `array`

## Getting stages of a board
```php
FluentBoardsApi('boards')->getStages($boardId);
```
**Parameters**
- $boardId `int` required

## Getting labels of a board
```php
FluentBoardsApi('boards')->getLabels($boardId);
```
**Parameters**
- $boardId `int` required

## Creating label of a board
```php
FluentBoardsApi('boards')->createLabel($boardId, $labelData);
```
**Parameters**
- $boardId `int` required
- $labelData `array` required

```php
$labelData = [
    'bg_color'  => '#4bce97',
    'color'     => '#1B2533',
    'title'     => 'important'
];
```
Here `bg_color` indicates background color of label, `color` indicates text color and `title` indicates title of the label. `bg_color` is required.