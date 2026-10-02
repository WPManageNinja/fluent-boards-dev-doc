# Database Model Basic

## Introduction

FluentBoards models are built on the WPFluent ORM, an ActiveRecord implementation that follows the Laravel Eloquent API. Each database table has a model class that you use to query the table and to insert, update and delete rows.

::: warning NOTE
For most integrations, prefer the higher-level helpers such as `FluentBoardsApi('tasks')->create()`. They run the service layer, which sets positions and slugs, logs activity and fires hooks. Writing through models directly skips most of that. These model docs are for internal use and for advanced third-party developers.
:::

## Base Model

All FluentBoards models extend `FluentBoards\App\Models\Model` (`fluent-boards/app/Models/Model.php`), which extends the framework model `FluentBoards\Framework\Database\Orm\Model`.

The base model adds:

- `$guarded = ['id', 'ID']`, so primary keys are never mass-assigned.
- `$nullableTimestampAttributes`: a list of date columns that are normalized on read and write. Empty strings, `none`, `null`, `0000-00-00 00:00:00`, years before 1900 and unparseable dates become `NULL`. The [Task](/database/models/task) model uses this for `due_at`, `started_at`, `last_completed_at`, `archived_at` and `remind_at`.

Pro models extend `FluentBoardsPro\App\Models\Model`, which is an empty subclass of the same base model.

## Built-in Models

Free models live in `fluent-boards/app/Models/`. Pro models live in `fluent-boards-pro/app/Models/` and `fluent-boards-pro/app/Modules/`.

| Model | Class | Table | Notes |
|---|---|---|---|
| [Board](/database/models/board) | `FluentBoards\App\Models\Board` | `fbs_boards` | Global scope: `type` is `to-do` or `roadmap` |
| [Folder](/database/models/folder) | `FluentBoards\App\Models\Folder` | `fbs_boards` | Global scope: `type = 'folder'` |
| [BoardTerm](/database/models/board-term) | `FluentBoards\App\Models\BoardTerm` | `fbs_board_terms` | Base class for Stage, Label, CustomField |
| [Stage](/database/models/stage) | `FluentBoards\App\Models\Stage` | `fbs_board_terms` | Global scope: `type = 'stage'` |
| [Label](/database/models/label) | `FluentBoards\App\Models\Label` | `fbs_board_terms` | Global scope: `type = 'label'` |
| [CustomField](/database/models/custom-field) | `FluentBoards\App\Models\CustomField` | `fbs_board_terms` | Global scope: `type = 'custom-field'` |
| [Task](/database/models/task) | `FluentBoards\App\Models\Task` | `fbs_tasks` | Global scope: `type` is `task` or `roadmap` |
| [TaskMeta](/database/models/task-meta) | `FluentBoards\App\Models\TaskMeta` | `fbs_task_metas` | |
| [Comment](/database/models/comment) | `FluentBoards\App\Models\Comment` | `fbs_comments` | Always eager-loads `images` and `replies` |
| [Attachment](/database/models/attachment) | `FluentBoards\App\Models\Attachment` | `fbs_attachments` | Base class for TaskImage, CommentImage, TaskAttachment |
| [TaskImage](/database/models/task-image) | `FluentBoards\App\Models\TaskImage` | `fbs_attachments` | Images in task descriptions |
| [CommentImage](/database/models/comment-image) | `FluentBoards\App\Models\CommentImage` | `fbs_attachments` | Images in comments |
| [Activity](/database/models/activity) | `FluentBoards\App\Models\Activity` | `fbs_activities` | |
| [Notification](/database/models/notification) | `FluentBoards\App\Models\Notification` | `fbs_notifications` | |
| [NotificationUser](/database/models/notification-user) | `FluentBoards\App\Models\NotificationUser` | `fbs_notification_users` | |
| [Meta](/database/models/meta) | `FluentBoards\App\Models\Meta` | `fbs_metas` | Base class for Webhook |
| [Webhook](/database/models/webhook) | `FluentBoards\App\Models\Webhook` | `fbs_metas` | Global scope: `object_type = 'webhook'` |
| [Relation](/database/models/relation) | `FluentBoards\App\Models\Relation` | `fbs_relations` | Pivot rows |
| [Team](/database/models/team) | `FluentBoards\App\Models\Team` | `fbs_teams` | |
| [User](/database/models/user) | `FluentBoards\App\Models\User` | `users` (WordPress) | Primary key `ID` |
| [TaskAttachment](/database/models/task-attachment) <Badge type="warning" text="Pro" /> | `FluentBoardsPro\App\Models\TaskAttachment` | `fbs_attachments` | |
| [TimeTrack](/database/models/time-track) <Badge type="warning" text="Pro" /> | `FluentBoardsPro\App\Modules\TimeTracking\Model\TimeTrack` | `fbs_time_tracks` | |

Pro also ships `FluentBoardsPro\App\Models\CustomField`, a copy of the Free `CustomField` model. New code should use the Free class.

There is no separate Subtask or Template model. Subtasks are `Task` rows with `parent_id` set. Templates are boards whose `settings` contain `is_template = true`; use the `Board::onlyTemplates()` and `Board::excludeTemplates()` scopes.

In this article we use `FluentBoards\App\Models\Board` as the example.

## Global Scopes

Several models add a global scope that filters rows by `type`. This matters because a table can hold several kinds of rows:

```php
use FluentBoards\App\Models\Board;
use FluentBoards\App\Models\Folder;

// Only boards with type 'to-do' or 'roadmap'. Folders are excluded.
$boards = Board::all();

// Only folders.
$folders = Folder::all();

// Remove the scope when you need every row in fbs_boards.
$everything = Board::withoutGlobalScope('type')->get();
```

The same applies to `Stage`, `Label` and `CustomField` (all on `fbs_board_terms`), `Task` (`task` / `roadmap` types) and `Webhook` (`fbs_metas` rows with `object_type = 'webhook'`).

## Retrieving Models

Each model works as a query builder for its table:

```php
use FluentBoards\App\Models\Board;

$boards = Board::all();

foreach ($boards as $board) {
    echo $board->title;
}
```

### Adding Additional Constraints

`all()` returns every row the model can see. To add constraints, chain query builder methods and finish with `get()`:

```php
$boards = FluentBoards\App\Models\Board::where('type', 'to-do')
    ->whereNull('archived_at')
    ->orderBy('created_at', 'DESC')
    ->limit(10)
    ->offset(5)
    ->get();
```

See the [Query Builder](/database/query-builder) page for the full list of methods.

## Retrieving Single Models

Use `find` or `first` to get one model instance instead of a collection:

```php
// By primary key
$board = FluentBoards\App\Models\Board::find(1);

// First row matching the constraints
$board = FluentBoards\App\Models\Board::where('type', 'to-do')->first();
```

Pass an array to `find` to get a collection of matching rows:

```php
$boards = FluentBoards\App\Models\Board::find([1, 2, 3]);
```

## Retrieving Aggregates

`count`, `max`, `min`, `avg` and `sum` return a scalar value:

```php
$count = FluentBoards\App\Models\Board::where('type', 'to-do')->count();

$max = FluentBoards\App\Models\Board::where('type', 'to-do')->max('id');
```

## Inserting & Updating Models

### Inserts

Pass the attributes to `create()`. Only attributes in the model's `$fillable` list (or not in `$guarded`) are saved:

```php
$board = FluentBoards\App\Models\Board::create([
    'title'       => 'My First Board',
    'description' => 'This is my first board',
]);
```

The Board model sets `type` to `to-do` and `created_by` to the current user when you leave them empty. It does not create stages or labels. Use `FluentBoardsApi('boards')->create()` when you need a ready-to-use board.

### Updates

Assign properties and call `save()`:

```php
$board = FluentBoards\App\Models\Board::find(1);

$board->title = 'Updated Title';
$board->description = 'Updated Description';
$board->save();
```

Or pass an array to `update()`:

```php
$board = FluentBoards\App\Models\Board::find(1);

$board->update([
    'title'       => 'Updated Title',
    'description' => 'Updated Description',
]);
```

## Accessing Attributes

Read columns as properties. Serialized columns such as `settings` are returned as arrays:

```php
$board = FluentBoards\App\Models\Board::find(1);

$title    = $board->title;
$settings = $board->settings; // array
```

## Deleting Models

Call `delete()` on a model instance:

```php
$board = FluentBoards\App\Models\Board::find(1);
$board->delete();
```

### Deleting Models By Query

You can also delete every row that matches a query. Mass deletes do not fire model events (`deleting` / `deleted`) for the deleted rows:

```php
FluentBoards\App\Models\Board::whereNotNull('archived_at')->delete();
```

::: warning
Deleting a model does not delete its related rows (tasks, stages, relations, meta). The service layer, for example `BoardService`, handles that cleanup.
:::

## Query Scopes

A local scope is a reusable set of constraints defined as a `scopeName()` method. Call it without the `scope` prefix and with a lowercase first letter. For example, the Board model defines:

```php
public function scopeOnlyTemplates($query)
{
    return $query->whereNotNull('settings')
        ->where(function ($subQuery) {
            $subQuery->where('settings', 'LIKE', '%"is_template";b:1%')
                ->orWhere('settings', 'LIKE', '%"is_template":true%');
        });
}
```

Use it like this:

```php
$templates = FluentBoards\App\Models\Board::onlyTemplates()->get();
```

Each model page lists the scopes that model provides.

## Relationships

Models define relations to each other. For example, a board has many stages and tasks:

```php
$board = FluentBoards\App\Models\Board::find(1);

$tasks  = $board->tasks;  // Collection of FluentBoards\App\Models\Task
$stages = $board->stages; // Collection of FluentBoards\App\Models\Stage
```

A task belongs to a board:

```php
$task  = FluentBoards\App\Models\Task::find(1);
$board = $task->board; // FluentBoards\App\Models\Board
```

Eager-load relations with `with()` to avoid one query per row:

```php
$boards = FluentBoards\App\Models\Board::with(['stages', 'users'])->get();
```

Each model page lists that model's relations.
