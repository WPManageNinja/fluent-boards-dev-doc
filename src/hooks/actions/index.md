# FluentBoards Action Hooks

<Badge type="tip" vertical="top" text="FluentBoards Core" /> <Badge type="warning" vertical="top" text="Intermediate" />

FluentBoards has many interesting filter hooks that let developers change default settings and even extend FluentBoards with
new functionality.

## What are Action Hooks

Action hooks are used to run custom code when certain events occur.
 
## Available of Action Hooks in FluentBoard

### Board Specific
<hr />

::: details fluent_boards/board_created
This action runs when a board has been created

**Parameters**
- `$board` Board Model

**Usage:**
```php 
add_action('fluent_boards/board_created', function($board) {
   // Do whatever you want
}, 10, 1);
```
:::

::: details fluent_boards/board_find
This action runs when a board is invoked

**Parameters**
- `$board` Board Model

**Usage:**
```php 
add_action('fluent_boards/board_find', function($board) {
   // Do whatever you want
}, 10, 1);
```
:::

::: details fluent_boards/board_updated
This action runs when a board is updated

**Parameters**
- `$board` Board Model
- `$oldBoard` Board Model

**Usage:**
```php 
add_action('fluent_boards/board_updated', function($board, $oldBoard) {
   // Do whatever you want
}, 10, 2);
```
:::

::: details fluent_boards/board_label_created
This action runs when a label is created in a board

**Parameters**
- `$label` Label Model

**Usage:**
```php 
add_action('fluent_boards/board_label_created', function($label) {
   // Do whatever you want
}, 10, 1);
```
:::

::: details fluent_boards/board_label_updated
This action runs when a label is updated in a board

**Parameters**
- `$label` Label Model

**Usage:**
```php 
add_action('fluent_boards/board_label_updated', function($label) {
   // Do whatever you want
}, 10, 1);
```
:::

::: details fluent_boards/board_label_deleted
This action runs when a label is deleted in a board

**Parameters**
- `$label` Label Model

**Usage:**
```php 
add_action('fluent_boards/board_label_deleted', function($label) {
   // Do whatever you want
}, 10, 1);
```
:::

::: details fluent_boards/board_stages_reordered
This action runs when a stage is moved

**Parameters**
- `$boardId` `int` Board id
- `$stageIds` `array` List of stage ids

**Usage:**
```php 
add_action('fluent_boards/board_stages_reordered', function($boardId, $stageIds) {
   // Do whatever you want
}, 10, 2);
```
:::

::: details fluent_boards/stage_archived
This action runs when a stage is archived

**Parameters**
- `$boardId` `int` Board id
- `$stage` `object`  Stage object

**Usage:**
```php 
add_action('fluent_boards/stage_archived', function($boardId, $stage) {
   // Do whatever you want
}, 10, 2);
```
:::

::: details fluent_boards/board_member_added
This action runs when a member is added to board

**Parameters**
- `$boardId` `int` Board id
- `$boardMember` `object`  User object

**Usage:**
```php 
add_action('fluent_boards/board_member_added', function($boardId, $boardMember) {
   // Do whatever you want
}, 10, 2);
```
:::

::: details fluent_boards/task_archived
This action runs when a task is archived

**Parameters**
- `$task` `object` Task object

**Usage:**
```php 
add_action('fluent_boards/task_archived', function($task) {
   // Do whatever you want
}, 10, 1);
```
:::

::: details fluent_boards/stage_updated
This action runs when a stage's title or background color is updated

**Parameters**
- `$boardId` `int` Board id
- `$updatedStage` `object` Stage object after update
- `$oldStage` `object` Stage object before update

**Usage:**
```php 
add_action('fluent_boards/stage_updated', function($boardId, $updatedStage, $oldStage) {
   // Do whatever you want
}, 10, 3);
```
:::

### Task Specific
<hr />


