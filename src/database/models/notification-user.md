# NotificationUser Model

| DB Table Name | {wp_db_prefix}_fbs_NotificationUsers                                             |
|---------------|----------------------------------------------------------------------------------|
| Schema        | <a :href="$withBase('/database/#fbs-notification-users-table')">Check Schema</a> |
| Source File   | fluent-NotificationUsers/app/Models/NotificationUser.php                         |
| Name Space    | FluentNotificationUsers\App\Models                                               |
| Class         | FluentNotificationUsers\App\Models\NotificationUser                              |

## Attributes
<table class="nowrap">
   <thead>
      <tr>
         <th>Attribute</th>
         <td>Data Type</td>
         <td>Comment</td>
      </tr>
   </thead>
    <tbody>
      <tr>
        <th>id</th>
        <td>INT UNSIGNED <i>Auto Increment</i></td>
        <td>Primary key of the record</td>
      </tr>
      <tr>
        <th>notification_id</th>
        <td>INT UNSIGNED <i>NULL</i></td>
        <td>ID of the related notification</td>
      </tr>
      <tr>
        <th>user_id</th>
        <td>BIGINT UNSIGNED</td>
        <td>ID of the user who received the notification</td>
      </tr>
      <tr>
        <th>marked_read_at</th>
        <td>TIMESTAMP <i>NULL</i></td>
        <td>Timestamp when the notification was marked as read</td>
      </tr>
      <tr>
        <th>created_at</th>
        <td>TIMESTAMP <i>NULL</i></td>
        <td>Timestamp when the record was created</td>
      </tr>
      <tr>
        <th>updated_at</th>
        <td>TIMESTAMP <i>NULL</i></td>
        <td>Timestamp when the record was last updated</td>
      </tr>
    </tbody>
</table>

## Usage
Please check <a href="/database/models/">Model Basic</a> for Common methods.

### Accessing Attributes

```php 
$notificationUser = FluentBoards\App\Models\NotificationUser::find(1);

$notificationUser->id; // returns id
$notificationUser->user_id; // returns user_id
.......
```

## Relations
This model has the following relationships that you can use

### notification
Access the associated notification

- return `FluentNotificationUsers\App\Models\Notification` Model Collection

#### Example:
```php 
$notification = $notificationUser->notification;
```

