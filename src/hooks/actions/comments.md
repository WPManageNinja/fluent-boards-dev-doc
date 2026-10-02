# Comment & User Action Hooks

<Badge type="tip" vertical="top" text="FluentBoards Core" /> <Badge type="warning" vertical="top" text="Intermediate" />

Action hooks for task comments, mentions and user profiles. See the [Action Hooks overview](./index.md) for every action hook grouped by area.

Source paths are relative to the plugin root.

## Comments

<explain-block title="fluent_boards/comment_created">

Fires after a comment **or a reply** is added to a task. Check `$comment->parent_id` (or `$comment->type`, which is `'comment'` or `'reply'`) to tell them apart.

**Parameters**
- `$comment` `\FluentBoards\App\Models\Comment`: the new comment or reply

**Usage**
```php
add_action('fluent_boards/comment_created', function ($comment) {
    if ($comment->parent_id) {
        // A reply
    }
}, 10, 1);
```

**Source:** `app/Services/CommentService.php`

</explain-block>

<explain-block title="fluent_boards/comment_updated">

Fires after a top-level comment is edited. Editing a reply does not fire this hook.

**Parameters**
- `$comment` `\FluentBoards\App\Models\Comment`: the comment after the edit
- `$oldComment` `string`: the comment **text** before the edit. This is the previous raw description (`settings['raw_description']`, or `description` as a fallback), not a model.

**Usage**
```php
add_action('fluent_boards/comment_updated', function ($comment, $oldComment) {
    $newText = $comment->settings['raw_description'] ?? $comment->description;
    // $oldComment is the previous text
}, 10, 2);
```

**Source:** `app/Services/CommentService.php`

</explain-block>

<explain-block title="fluent_boards/comment_deleted">

Fires after a top-level comment is deleted. Deleting a reply does not fire this hook.

**Parameters**
- `$comment` `\FluentBoards\App\Models\Comment`: the deleted comment. The row no longer exists, but its attributes (such as `task_id`) can still be read.

**Usage**
```php
add_action('fluent_boards/comment_deleted', function ($comment) {
    // Do whatever you want
}, 10, 1);
```

**Source:** `app/Services/CommentService.php`

</explain-block>

## Mentions & Notifications

<explain-block title="fluent_boards/mention_comment_notification">

Fires after users are mentioned in a comment and their mention emails are queued. The core handler on this hook creates the in-app notifications.

**Parameters**
- `$comment` `\FluentBoards\App\Models\Comment`: the comment that contains the mentions
- `$userIds` `int[]`: unique IDs of the mentioned users

**Usage**
```php
add_action('fluent_boards/mention_comment_notification', function ($comment, $userIds) {
    // Do whatever you want
}, 10, 2);
```

**Source:** `app/Services/NotificationService.php`

</explain-block>

To change email markup, see the [`email_header`](../filters/ui.md#fluent_boards_email_header) and [`email_footer`](../filters/ui.md#fluent_boards_email_footer) filters. Emails are sent from internal Action Scheduler hooks, which are listed under [Internal hooks](./index.md#internal-hooks-do-not-rely-on).

## User Profile

<explain-block title="fluent_boards/profile_name_updated">

Fires after a user changes their display name from the FluentBoards profile screen.

**Parameters**
- `$userId` `int`: the user ID
- `$displayName` `string`: the saved display name

**Usage**
```php
add_action('fluent_boards/profile_name_updated', function ($userId, $displayName) {
    // Do whatever you want
}, 10, 2);
```

**Source:** `app/Services/UserService.php`

</explain-block>

<explain-block title="fluent_boards/profile_photo_updated">

Fires after a user uploads a new profile photo from the FluentBoards profile screen.

**Parameters**
- `$userId` `int`: the user ID
- `$photoUrl` `string`: URL of the new photo

**Usage**
```php
add_action('fluent_boards/profile_photo_updated', function ($userId, $photoUrl) {
    // Do whatever you want
}, 10, 2);
```

**Source:** `app/Services/UserService.php`

</explain-block>
