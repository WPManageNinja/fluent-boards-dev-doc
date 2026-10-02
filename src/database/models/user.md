# User Model

| DB Table Name | `{wp_db_prefix}users` (WordPress core) |
|---------------|----------------------------------------|
| Schema        | [Check Schema](/database/#users-table) |
| Source File   | fluent-boards/app/Models/User.php |
| Name Space    | FluentBoards\App\Models |
| Class         | FluentBoards\App\Models\User |

A read model over the WordPress `users` table. The primary key is `ID` (uppercase). Use WordPress functions such as `wp_insert_user()` to create or change users; this model is for querying and relations.

## Attributes

| Attribute | Data Type | Serialized by `toArray()`? |
|---|---|---|
| ID | BIGINT UNSIGNED | Yes |
| user_login | VARCHAR(60) | Yes |
| user_pass | VARCHAR(255) | Never |
| user_nicename | VARCHAR(50) | Never |
| user_email | VARCHAR(100) | Only for privileged contexts (see below) |
| user_url | VARCHAR(100) | Never |
| user_registered | DATETIME | Never |
| user_activation_key | VARCHAR(255) | Never |
| user_status | INT | Never |
| display_name | VARCHAR(250) | Yes |

Appended attributes:

| Attribute | Comment |
|---|---|
| photo | Avatar URL from `fluent_boards_user_avatar()` |

### Hidden fields

The model always hides the fields listed in `User::ALWAYS_HIDDEN` (`user_pass`, `user_activation_key`, `user_nicename`, `user_url`, `user_registered`, `user_status`) when it is converted to an array or JSON.

`user_email` is listed in `User::PRIVILEGED_ONLY`. It is included only when the current user has the `list_users` capability, or when privileged serialization is turned on:

```php
use FluentBoards\App\Models\User;

User::serializePrivilegedFields(true);
$data = $user->toArray(); // includes user_email
User::serializePrivilegedFields(false);
```

The hidden fields are still readable as properties (`$user->user_email`); hiding only affects serialization.

## Usage

Please check [Model Basic](/database/models/) for common methods.

```php
$user = FluentBoards\App\Models\User::find(1);

$user->ID;
$user->display_name;
$user->photo;
```

## Relations

### whichBoards

Boards the user is a member of (`fbs_relations`, `object_type = 'board_user'`). Pivot: `settings`, `preferences`.

- Returns a collection of `FluentBoards\App\Models\Board`

```php
// object_id on the board_user pivot row is the board ID
$boardIds = $user->whichBoards()->pluck('object_id')->toArray();
```

### boards

::: warning
This relation joins `fbs_relations.object_id` to the user ID, but for `board_user` rows `object_id` is the board ID. It does not return the user's boards. Use `whichBoards` instead.
:::

- Returns a collection of `FluentBoards\App\Models\Board`

### assignedTasks

Tasks assigned to the user (`object_type = 'task_assignee'`). Pivot: `settings`.

- Returns a collection of `FluentBoards\App\Models\Task`

```php
$open = $user->assignedTasks()->where('status', 'open')->whereNull('archived_at')->get();
```

### watchingTasks

Tasks the user watches (`object_type = 'task_user_watch'`). Pivot: `settings`.

- Returns a collection of `FluentBoards\App\Models\Task`

### tasks

Same query as `watchingTasks`.

- Returns a collection of `FluentBoards\App\Models\Task`

### mentionedTasks()

Not a relation: a method that returns a `Task` query builder for tasks with a `task_comment_mentioned` notification sent to this user.

```php
$mentioned = $user->mentionedTasks()->whereNull('archived_at')->get();
```

### notifications

Notifications the user received (`fbs_notification_users`). Pivot: `marked_read_at`.

- Returns a collection of `FluentBoards\App\Models\Notification`

```php
$unread = $user->notifications()->wherePivot('marked_read_at', null)->count();
```

### highPriorityTasks / overDueTasks / upcomingTasks / upcomingWithoutDuedate

::: warning
These relations filter on `is_archived` and `due_date`, which are not columns of `fbs_tasks` (the real columns are `archived_at` and `due_at`). Queries that use them fail. Build the query from `watchingTasks()` or `assignedTasks()` instead.
:::

### boardUser

Placeholder that returns `null`. Do not use.

## Methods

### User::serializePrivilegedFields($enabled = true) <Badge text="static" />

Turns inclusion of `user_email` in `toArray()` on or off for all User models.

### getHidden()

Returns the hidden field list for the current context (always-hidden fields, plus `user_email` when not privileged).
