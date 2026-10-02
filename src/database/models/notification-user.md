# NotificationUser Model

| DB Table Name | `{wp_db_prefix}fbs_notification_users` |
|---------------|----------------------------------------|
| Schema        | [Check Schema](/database/#fbs-notification-users-table) |
| Source File   | fluent-boards/app/Models/NotificationUser.php |
| Name Space    | FluentBoards\App\Models |
| Class         | FluentBoards\App\Models\NotificationUser |

Links a [Notification](/database/models/notification) to a recipient and stores whether they read it. On create, the model sets `created_at` / `updated_at` with `current_time('mysql')`.

## Attributes

| Attribute | Data Type | Comment |
|---|---|---|
| id | INT UNSIGNED | Primary key |
| notification_id | INT UNSIGNED NULL | Notification ID |
| user_id | BIGINT UNSIGNED | Recipient user ID |
| marked_read_at | TIMESTAMP NULL | Read time. NULL means unread |
| created_at | TIMESTAMP NULL | |
| updated_at | TIMESTAMP NULL | |

## Usage

Please check [Model Basic](/database/models/) for common methods.

```php
use FluentBoards\App\Models\NotificationUser;

// Mark all notifications of the current user as read
NotificationUser::where('user_id', get_current_user_id())
    ->whereNull('marked_read_at')
    ->update(['marked_read_at' => current_time('mysql')]);

// Unread count
$unread = NotificationUser::where('user_id', get_current_user_id())
    ->whereNull('marked_read_at')
    ->count();
```

## Relations

### notification

- Returns `FluentBoards\App\Models\Notification`

```php
$row = NotificationUser::with('notification')->find(1);
$text = $row->notification->description;
```
