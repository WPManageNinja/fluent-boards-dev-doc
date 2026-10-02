# Board Model

| DB Table Name | `{wp_db_prefix}fbs_boards` |
|---------------|----------------------------|
| Schema        | [Check Schema](/database/#fbs-boards-table) |
| Source File   | fluent-boards/app/Models/Board.php |
| Name Space    | FluentBoards\App\Models |
| Class         | FluentBoards\App\Models\Board |

::: warning Global scope
The Board model only sees rows whose `type` is `to-do` or `roadmap`. Folders, which live in the same table, are read with the [Folder](/database/models/folder) model. Use `Board::withoutGlobalScope('type')` to query every row.
:::

## Attributes

| Attribute | Data Type | Comment |
|---|---|---|
| id | INT UNSIGNED | Primary key |
| parent_id | INT UNSIGNED NULL | Parent board or folder |
| title | TEXT NULL | Board title |
| description | LONGTEXT NULL | Board description |
| type | VARCHAR(50) NULL | `to-do` (default) or `roadmap` |
| currency | VARCHAR(50) NULL | Currency code |
| background | TEXT NULL | Background settings. Serialized; returned as an array |
| settings | TEXT NULL | Board settings. Serialized; returned as an array |
| created_by | INT UNSIGNED | Creator user ID. Defaults to the current user |
| archived_at | TIMESTAMP NULL | Archive time |
| created_at | TIMESTAMP NULL | Hidden from `toArray()` |
| updated_at | TIMESTAMP NULL | Hidden from `toArray()` |

Appended attributes (included in `toArray()` / JSON):

| Attribute | Comment |
|---|---|
| meta | Board meta from `fbs_metas` (`object_type = 'board'`) as a `key => value` array. Same as `getMeta()` |
| isUserOnlyViewer | `true` when the current user is a view-only member of the board. Always `false` for FluentBoards admins |

## Usage

Please check [Model Basic](/database/models/) for common methods.

```php
$board = FluentBoards\App\Models\Board::find(1);

$board->id;       // 1
$board->title;    // "Marketing"
$board->settings; // array
$board->meta;     // array of board meta
```

## Scopes

### byAccessUser($userId)

Boards the user can access. FluentBoards admins get every board; other users get the boards they are a member of (`board_user` relation).

```php
$boards = FluentBoards\App\Models\Board::byAccessUser(get_current_user_id())->get();
```

### excludeTemplates()

Leaves out boards marked as templates (`settings.is_template = true`).

```php
$boards = FluentBoards\App\Models\Board::excludeTemplates()->get();
```

### onlyTemplates()

Only boards marked as templates.

```php
$templates = FluentBoards\App\Models\Board::onlyTemplates()->get();
```

### availableInCurrentInstall()

Limits the query to `type = 'to-do'` unless the Fluent Roadmap plugin is active (`FLUENT_ROADMAP` defined).

```php
$boards = FluentBoards\App\Models\Board::availableInCurrentInstall()
    ->whereNull('archived_at')
    ->get();
```

## Relations

### tasks

All tasks of the board, including subtasks and archived tasks.

- Returns a collection of `FluentBoards\App\Models\Task`

```php
$tasks = $board->tasks;

// Boards that have at least one open task
$boards = FluentBoards\App\Models\Board::whereHas('tasks', function ($query) {
    $query->where('status', 'open');
})->get();
```

### completedTasks

Closed, non-archived, top-level tasks (`status = 'closed'`, `parent_id` NULL).

- Returns a collection of `FluentBoards\App\Models\Task`

```php
$count = $board->completedTasks()->count();
```

### stages

Non-archived stages ordered by `position`.

- Returns a collection of `FluentBoards\App\Models\Stage`

```php
$stages = $board->stages;
```

### labels

Non-archived labels ordered by `position`.

- Returns a collection of `FluentBoards\App\Models\Label`

```php
$labels = $board->labels;
```

### customFields

Non-archived custom field definitions ordered by `position`.

- Returns a collection of `FluentBoards\App\Models\CustomField`

```php
$fields = $board->customFields;
```

### users

Board members, through `fbs_relations` with `object_type = 'board_user'`. The pivot has `settings` (for example `is_admin`, `is_viewer_only`) and `preferences` (notification preferences).

- Returns a collection of `FluentBoards\App\Models\User`

```php
foreach ($board->users as $user) {
    $settings = maybe_unserialize($user->pivot->settings);
}
```

### boardUserEmailNotificationSettings

Members with their email notification settings (`object_type = 'board_user_email'`). Pivot: `settings`.

- Returns a collection of `FluentBoards\App\Models\User`

### boardUserNotificationSettings

Legacy relation (`object_type = 'board_user_notification'`). The code marks it for removal. Pivot: `settings`.

- Returns a collection of `FluentBoards\App\Models\User`

### owner

The user who created the board (`created_by`).

- Returns `FluentBoards\App\Models\User`

```php
$ownerName = $board->owner ? $board->owner->display_name : '';
```

### comments

All comments on the board's tasks.

- Returns a collection of `FluentBoards\App\Models\Comment`

### notifications

Notifications for the board (`object_type = 'board_notification'`).

- Returns a collection of `FluentBoards\App\Models\Notification`

### activities

Board-level activity log (`object_type = 'board_activity'`).

- Returns a collection of `FluentBoards\App\Models\Activity`

```php
$latest = $board->activities()->orderBy('id', 'DESC')->limit(20)->get();
```

## Methods

### getMeta()

Returns all board meta as a `key => value` array.

```php
$meta = $board->getMeta();
```

### getMetaByKey($key)

Returns one board meta value, or `null` when it does not exist.

```php
$value = $board->getMetaByKey('enable_stage_change_email');
```

### updateMeta($key, $value)

Creates or updates a board meta row.

- Returns `FluentBoards\App\Models\Meta`

```php
$board->updateMeta('enable_stage_change_email', 'yes');
```

### syncUsers($userIds)

Adds the given user IDs as board members with default settings and notification preferences. Users that are already members are skipped; nobody is removed.

- Returns `array` of newly added user IDs

```php
$added = $board->syncUsers([2, 5, 9]);
```

### getUsers()

Returns all users with access to the board, via `UserService::allFluentBoardsUsers()`.

```php
$users = $board->getUsers();
```

### removeBoardFromFolder()

Deletes the relation that places this board in a folder, if there is one.

```php
$board->removeBoardFromFolder();
```

### Board::isBoardExists($boardId) <Badge text="static" />

Returns `true` when a board with this ID exists (respecting the global scope).

```php
if (FluentBoards\App\Models\Board::isBoardExists(12)) {
    // ...
}
```

### Board::getColor() <Badge text="static" />

Returns a random color from the built-in board color palette.

```php
$color = FluentBoards\App\Models\Board::getColor(); // e.g. "#3F51B5"
```
