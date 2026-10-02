# Notification Model

| DB Table Name | `{wp_db_prefix}fbs_notifications` |
|---------------|-----------------------------------|
| Schema        | [Check Schema](/database/#fbs-notifications-table) |
| Source File   | fluent-boards/app/Models/Notification.php |
| Name Space    | FluentBoards\App\Models |
| Class         | FluentBoards\App\Models\Notification |

An in-app notification. Recipients and read state are stored in `fbs_notification_users` ([NotificationUser](/database/models/notification-user)).

On create, the model sets `activity_by` to the current user when empty, and sets `created_at` / `updated_at` with `current_time('mysql')`.

## Attributes

| Attribute | Data Type | Comment |
|---|---|---|
| id | INT UNSIGNED | Primary key |
| object_id | INT UNSIGNED | Board ID |
| object_type | VARCHAR(100) | `board_notification` |
| task_id | INT UNSIGNED NULL | Related task |
| action | VARCHAR(255) NULL | For example `task_created`, `task_comment_mentioned` |
| activity_by | BIGINT UNSIGNED | User who triggered it |
| description | LONGTEXT NULL | Notification text |
| settings | TEXT NULL | Serialized; returned as an array |
| created_at | TIMESTAMP NULL | |
| updated_at | TIMESTAMP NULL | |

## Usage

Please check [Model Basic](/database/models/) for common methods.

```php
// Latest notifications for the current user
$notifications = FluentBoards\App\Models\Notification::whereHas('users', function ($query) {
        $query->where('user_id', get_current_user_id());
    })
    ->orderBy('id', 'DESC')
    ->limit(20)
    ->get();
```

## Relations

### activitist

The user who triggered the notification (`activity_by`).

- Returns `FluentBoards\App\Models\User`

### board

- Returns `FluentBoards\App\Models\Board`

### task

The related task, with `stage` and `board` eager-loaded.

- Returns `FluentBoards\App\Models\Task`

### users

Recipients (`fbs_notification_users`). Pivot: `marked_read_at`.

- Returns a collection of `FluentBoards\App\Models\User`

```php
foreach ($notification->users as $user) {
    $isRead = (bool) $user->pivot->marked_read_at;
}
```

## Methods

### checkReadOrNot()

Returns `true` when the current user has marked the notification as read.

::: warning
The method assumes the current user is a recipient. If there is no matching `fbs_notification_users` row it reads a property of `null`.
:::

```php
$isRead = $notification->checkReadOrNot();
```
