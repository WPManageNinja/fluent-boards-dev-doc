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

::: details fluent_boards/task_created
This action runs when a task is created

**Parameters**
- `$task` `object` Task 

**Usage:**
```php 
add_action('fluent_boards/task_created', function($task) {
   // Do whatever you want
}, 10, 1);
```
:::

::: details fluent_boards/task_deleted
This action runs when a task is deleted

**Parameters**
- `$task` `object` Task

**Usage:**
```php 
add_action('fluent_boards/task_deleted', function($task) {
   // Do whatever you want
}, 10, 1);
```
:::

::: details fluent_boards/task_stage_updated
This action runs when stage of a task is updated

**Parameters**
- `$task` `object` Task
- `$oldStageId` `int` stage id

**Usage:**
```php 
add_action('fluent_boards/task_stage_updated', function($task, $oldStageId) {
   // Do whatever you want
}, 10, 2);
```
:::

::: details fluent_boards/comment_created
This action runs when comment is added to a task

**Parameters**
- `$comment` `object` Comment

**Usage:**
```php 
add_action('fluent_boards/comment_created', function($comment) {
   // Do whatever you want
}, 10, 1);
```
:::

::: details fluent_boards/comment_updated
This action runs when a comment is updated

**Parameters**
- `$comment` `object` Comment
- `$oldComment` `object` Comment before updated

**Usage:**
```php 
add_action('fluent_boards/comment_updated', function($comment, $oldComment) {
   // Do whatever you want
}, 10, 2);
```
:::

::: details fluent_boards/comment_deleted
This action runs when a comment is deleted

**Parameters**
- `$comment` `object` Comment

**Usage:**
```php 
add_action('fluent_boards/comment_deleted', function($comment) {
   // Do whatever you want
}, 10, 1);
```
:::

::: details fluent_boards/task_added_from_fluent_form
This action runs when a task is added from fluent form plugin

**Parameters**
- `$task` `object` Task

**Usage:**
```php 
add_action('fluent_boards/task_added_from_fluent_form', function($task) {
   // Do whatever you want
}, 10, 1);
```
:::

::: details fluent_boards/task_assignee_added
This action runs when a assignee is added to a task

**Parameters**
- `$task` `object` Task
- `$assigneeId` `int` id of the user

**Usage:**
```php 
add_action('fluent_boards/task_assignee_added', function($task, $assigneeId) {
   // Do whatever you want
}, 10, 2);
```
:::

::: details fluent_boards/task_assignee_removed
This action runs when a assignee is removed from a task

**Parameters**
- `$task` `object` Task
- `$assigneeId` `int` id of the user

**Usage:**
```php 
add_action('fluent_boards/task_assignee_removed', function($task, $assigneeId) {
   // Do whatever you want
}, 10, 2);
```
:::

::: details fluent_boards/task_start_date_changed
This action runs when start date of a task is changed

**Parameters**
- `$task` `object` Task
- `$oldStartDateValue` `datetime` format `YYYY-MM-DD HH:MM:SS`

**Usage:**
```php 
add_action('fluent_boards/task_start_date_changed', function($task, $oldStartDateValue) {
   // Do whatever you want
}, 10, 2);
```
:::

::: details fluent_boards/task_due_date_changed
This action runs when due date of a task is changed

**Parameters**
- `$task` `object` Task
- `$oldDueDateValue` `datetime` format `YYYY-MM-DD HH:MM:SS`

**Usage:**
```php 
add_action('fluent_boards/task_due_date_changed', function($task, $oldDueDateValue) {
   // Do whatever you want
}, 10, 2);
```
:::

::: details fluent_boards/task_deleted
This action runs when a task has been deleted

**Parameters**
- `$task` `object` Task

**Usage:**
```php 
add_action('fluent_boards/task_deleted', function($task) {
   // Do whatever you want
}, 10, 1);
```
:::









