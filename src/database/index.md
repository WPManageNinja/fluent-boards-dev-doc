# FluentBoards Database Schema

<Badge type="tip" vertical="top" text="FluentBoards Core" /> <Badge type="warning" vertical="top" text="Advanced" />

FluentBoards use custom database tables to store all the Boards data. Here are the list of database tables and it's schema to
understand overall database design and related data attributes of each model.
## Schema Design
<img :src="$withBase('/assets/img/schema-design.png')" alt="Schema Design" />

## Database Tables


## _fbs_boards Table

This table stores the basic information of a board.

<table cellspacing="0" class="nowrap">
<thead><tr><th>Column</th><th>Type</th><th>Comment</th></tr></thead>
<tbody>
<tr><th>id</th><td>INT UNSIGNED <i>Auto Increment</i></td><td>Primary key of the board</td></tr>
<tr><th>parent_id</th><td>INT UNSIGNED <i>NULL</i></td><td>For SuperBoard like Project or Company, for sub-board etc.</td></tr>
<tr><th>title</th><td>TEXT <i>NULL</i></td><td>Title of the board, it can be longer than 255 characters.</td></tr>
<tr><th>description</th><td>LONGTEXT <i>NULL</i></td><td>Description of the board</td></tr>
<tr><th>type</th><td>VARCHAR(50) <i>NULL</i></td><td>Type of the board, e.g., to-do, sales-pipeline, roadmap, task, etc.</td></tr>
<tr><th>currency</th><td>VARCHAR(50) <i>NULL</i></td><td>Currency related to the board</td></tr>
<tr><th>background</th><td>TEXT <i>NULL</i></td><td>Serialized array for background settings</td></tr>
<tr><th>settings</th><td>TEXT <i>NULL</i></td><td>Serialized array for other board settings</td></tr>
<tr><th>created_by</th><td>INT UNSIGNED</td><td>ID of the user who created the board</td></tr>
<tr><th>archived_at</th><td>TIMESTAMP <i>NULL</i></td><td>Timestamp when the board was archived</td></tr>
<tr><th>created_at</th><td>TIMESTAMP <i>NULL</i></td><td>Timestamp when the board was created</td></tr>
<tr><th>updated_at</th><td>TIMESTAMP <i>NULL</i></td><td>Timestamp when the board was last updated</td></tr>
</tbody>
</table>


## _fbs_board_terms Table

This table is used for storing the board labels and stages.

<table cellspacing="0" class="nowrap">
<thead><tr><th>Column</th><th>Type</th><th>Comment</th></tr></thead>
<tbody>
<tr><th>id</th><td>INT UNSIGNED <i>Auto Increment</i></td><td>Primary key of the term</td></tr>
<tr><th>board_id</th><td>INT UNSIGNED</td><td>ID of the board associated with the term</td></tr>
<tr><th>title</th><td>VARCHAR(100) <i>NULL</i></td><td>Title of the stage or label. In case of a label, the title can be null with only a color.</td></tr>
<tr><th>slug</th><td>VARCHAR(100) <i>NULL</i></td><td>Slug of the stage or label</td></tr>
<tr><th>type</th><td>VARCHAR(50) NOT NULL DEFAULT 'stage'</td><td>Type of the term: 'stage' or 'label'</td></tr>
<tr><th>position</th><td>DECIMAL(10,2) NOT NULL DEFAULT '1'</td><td>Position of the stage or label. 1 = first, 2 = second, etc.</td></tr>
<tr><th>color</th><td>VARCHAR(50) <i>NULL</i></td><td>Text color of the stage or label</td></tr>
<tr><th>bg_color</th><td>VARCHAR(50) <i>NULL</i></td><td>Background color of the stage or label</td></tr>
<tr><th>settings</th><td>TEXT <i>NULL</i></td><td>Serialized settings for the term</td></tr>
<tr><th>archived_at</th><td>TIMESTAMP <i>NULL</i></td><td>Timestamp when the term was archived</td></tr>
<tr><th>created_at</th><td>TIMESTAMP <i>NULL</i></td><td>Timestamp when the term was created</td></tr>
<tr><th>updated_at</th><td>TIMESTAMP <i>NULL</i></td><td>Timestamp when the term was last updated</td></tr>
</tbody>
</table>

## _fbs_tasks Table

This table is used for managing tasks within the board.

<table cellspacing="0" class="nowrap">
<thead><tr><th>Column</th><th>Type</th><th>Comment</th></tr></thead>
<tbody>
<tr><th>id</th><td>INT UNSIGNED <i>Auto Increment</i></td><td>Primary key of the task</td></tr>
<tr><th>parent_id</th><td>INT UNSIGNED <i>NULL</i></td><td>Parent task ID if this is a subtask</td></tr>
<tr><th>board_id</th><td>INT UNSIGNED <i>NULL</i></td><td>ID of the board the task is in</td></tr>
<tr><th>crm_contact_id</th><td>BIGINT UNSIGNED <i>NULL</i></td><td>User ID, Contact ID, Deal ID, Subscriber ID, etc.</td></tr>
<tr><th>title</th><td>TEXT <i>NULL</i></td><td>Title or name of the task; it can be longer than 255 characters.</td></tr>
<tr><th>slug</th><td>VARCHAR(255) <i>NULL</i></td><td>Slug of the task</td></tr>
<tr><th>type</th><td>VARCHAR(50) <i>NULL</i></td><td>Type of the task, e.g., task, deal, idea, to-do, etc.</td></tr>
<tr><th>status</th><td>VARCHAR(50) <i>NULL</i> DEFAULT 'open'</td><td>Status of the task: open, completed; for boards: won or lost for pipelines</td></tr>
<tr><th>stage_id</th><td>INT UNSIGNED <i>NULL</i></td><td>ID of the stage the task is in</td></tr>
<tr><th>source</th><td>VARCHAR(50) <i>NULL</i> DEFAULT 'web'</td><td>Source of the task, e.g., web, funnel, contact-section, etc.</td></tr>
<tr><th>source_id</th><td>VARCHAR(255) <i>NULL</i></td><td>Source ID related to the task</td></tr>
<tr><th>priority</th><td>VARCHAR(50) <i>NULL</i> DEFAULT 'low'</td><td>Priority of the task: low, medium, high</td></tr>
<tr><th>description</th><td>LONGTEXT <i>NULL</i></td><td>Description of the task</td></tr>
<tr><th>lead_value</th><td>DECIMAL(10,2) DEFAULT 0.00</td><td>Lead value associated with the task</td></tr>
<tr><th>created_by</th><td>BIGINT UNSIGNED <i>NULL</i></td><td>ID of the user who created the task</td></tr>
<tr><th>position</th><td>DECIMAL(10,2) NOT NULL DEFAULT '1'</td><td>Position of the task within the board. 1 = first, 2 = second, etc.</td></tr>
<tr><th>comments_count</th><td>INT UNSIGNED <i>NULL</i> DEFAULT 0</td><td>Number of comments associated with the task</td></tr>
<tr><th>issue_number</th><td>INT UNSIGNED <i>NULL</i></td><td>Board-specific issue number to track the task</td></tr>
<tr><th>reminder_type</th><td>VARCHAR(100) <i>NULL</i> DEFAULT 'none'</td><td>Type of reminder set for the task</td></tr>
<tr><th>settings</th><td>TEXT <i>NULL</i></td><td>Serialized settings for the task</td></tr>
<tr><th>remind_at</th><td>TIMESTAMP <i>NULL</i></td><td>Timestamp when a reminder is set for the task</td></tr>
<tr><th>started_at</th><td>TIMESTAMP <i>NULL</i></td><td>Timestamp when the task was started</td></tr>
<tr><th>due_at</th><td>TIMESTAMP <i>NULL</i></td><td>Timestamp when the task is due</td></tr>
<tr><th>last_completed_at</th><td>TIMESTAMP <i>NULL</i></td><td>Timestamp when the task was last completed</td></tr>
<tr><th>archived_at</th><td>TIMESTAMP <i>NULL</i></td><td>Timestamp when the task was archived</td></tr>
<tr><th>created_at</th><td>TIMESTAMP <i>NULL</i></td><td>Timestamp when the task was created</td></tr>
<tr><th>updated_at</th><td>TIMESTAMP <i>NULL</i></td><td>Timestamp when the task was last updated</td></tr>
</tbody>
</table>


## _fbs_task_metas Table

This table is used for storing metadata related to tasks.

<table cellspacing="0" class="nowrap">
<thead><tr><th>Column</th><th>Type</th><th>Comment</th></tr></thead>
<tbody>
<tr><th>id</th><td>INT UNSIGNED <i>Auto Increment</i></td><td>Primary key of the task meta</td></tr>
<tr><th>task_id</th><td>INT UNSIGNED</td><td>ID of the associated task</td></tr>
<tr><th>key</th><td>VARCHAR(100)</td><td>Key for the meta information</td></tr>
<tr><th>value</th><td>LONGTEXT <i>NULL</i></td><td>Value of the meta information</td></tr>
<tr><th>created_at</th><td>TIMESTAMP <i>NULL</i></td><td>Timestamp when the meta was created</td></tr>
<tr><th>updated_at</th><td>TIMESTAMP <i>NULL</i></td><td>Timestamp when the meta was last updated</td></tr>
</tbody>
</table> 

## _fbs_attachments Table

This table stores information about attachments related to tasks.

<table cellspacing="0" class="nowrap">
<thead><tr><th>Column</th><th>Type</th><th>Comment</th></tr></thead>
<tbody>
<tr><th>id</th><td>INT UNSIGNED <i>Auto Increment</i></td><td>Primary key of the attachment</td></tr>
<tr><th>object_id</th><td>INT UNSIGNED</td><td>ID of the associated object (Task ID, Comment ID, or Board ID)</td></tr>
<tr><th>object_type</th><td>VARCHAR(100) <i>DEFAULT 'TASK'</i></td><td>Type of the object (TASK, COMMENT, BOARD)</td></tr>
<tr><th>attachment_type</th><td>VARCHAR(100) <i>NULL</i></td><td>Type of the attachment</td></tr>
<tr><th>file_path</th><td>TEXT <i>NULL</i></td><td>File path of the attachment</td></tr>
<tr><th>full_url</th><td>TEXT <i>NULL</i></td><td>Full URL of the attachment</td></tr>
<tr><th>settings</th><td>TEXT <i>NULL</i></td><td>Serialized settings</td></tr>
<tr><th>title</th><td>VARCHAR(192) <i>NULL</i></td><td>Title of the attachment</td></tr>
<tr><th>file_hash</th><td>VARCHAR(192) <i>NULL</i></td><td>File hash for verifying integrity</td></tr>
<tr><th>driver</th><td>VARCHAR(100) <i>DEFAULT 'local'</i></td><td>Storage driver (local, cloud, etc.)</td></tr>
<tr><th>status</th><td>VARCHAR(100) <i>DEFAULT 'ACTIVE'</i></td><td>Status of the attachment (ACTIVE, INACTIVE, DELETED)</td></tr>
<tr><th>file_size</th><td>VARCHAR(100) <i>NULL</i></td><td>Size of the file</td></tr>
<tr><th>created_at</th><td>TIMESTAMP <i>NULL</i></td><td>Timestamp when the attachment was created</td></tr>
<tr><th>updated_at</th><td>TIMESTAMP <i>NULL</i></td><td>Timestamp when the attachment was last updated</td></tr>
</tbody>
</table>

## _fbs_comments Table

This table stores comments, notes, and replies related to tasks on boards.

<table cellspacing="0" class="nowrap">
<thead><tr><th>Column</th><th>Type</th><th>Comment</th></tr></thead>
<tbody>
<tr><th>id</th><td>INT UNSIGNED <i>Auto Increment</i></td><td>Primary key of the comment</td></tr>
<tr><th>board_id</th><td>INT UNSIGNED</td><td>ID of the associated board</td></tr>
<tr><th>task_id</th><td>INT UNSIGNED</td><td>ID of the associated task</td></tr>
<tr><th>parent_id</th><td>BIGINT UNSIGNED <i>NULL</i></td><td>ID of the parent comment if it's a reply</td></tr>
<tr><th>type</th><td>VARCHAR(50) <i>DEFAULT 'comment'</i></td><td>Type of the entry (comment, note, reply)</td></tr>
<tr><th>privacy</th><td>VARCHAR(50) <i>DEFAULT 'public'</i></td><td>Privacy level of the comment (public, private)</td></tr>
<tr><th>status</th><td>VARCHAR(50) <i>DEFAULT 'published'</i></td><td>Status of the comment (published, draft, spam)</td></tr>
<tr><th>author_name</th><td>VARCHAR(192) <i>DEFAULT ''</i></td><td>Name of the comment author</td></tr>
<tr><th>author_email</th><td>VARCHAR(192) <i>DEFAULT ''</i></td><td>Email of the comment author</td></tr>
<tr><th>author_ip</th><td>VARCHAR(50) <i>DEFAULT ''</i></td><td>IP address of the comment author</td></tr>
<tr><th>description</th><td>TEXT <i>NULL</i></td><td>Content of the comment</td></tr>
<tr><th>created_by</th><td>BIGINT UNSIGNED <i>NULL</i></td><td>ID of the user who created the comment</td></tr>
<tr><th>created_at</th><td>TIMESTAMP <i>NULL</i></td><td>Timestamp when the comment was created</td></tr>
<tr><th>updated_at</th><td>TIMESTAMP <i>NULL</i></td><td>Timestamp when the comment was last updated</td></tr>
</tbody>
</table>

## _fbs_activities Table

This table stores activity logs for tasks, including changes and actions taken on various objects.

<table cellspacing="0" class="nowrap">
<thead><tr><th>Column</th><th>Type</th><th>Comment</th></tr></thead>
<tbody>
<tr><th>id</th><td>INT UNSIGNED <i>Auto Increment</i></td><td>Primary key of the activity log</td></tr>
<tr><th>object_id</th><td>INT UNSIGNED</td><td>ID of the associated object (e.g., Task ID)</td></tr>
<tr><th>object_type</th><td>VARCHAR(100)</td><td>Type of the object (e.g., Task, Comment, Board)</td></tr>
<tr><th>action</th><td>VARCHAR(50)</td><td>Action performed (e.g., create, update, delete)</td></tr>
<tr><th>column</th><td>VARCHAR(50) <i>NULL</i></td><td>The specific column that was changed (if applicable)</td></tr>
<tr><th>old_value</th><td>VARCHAR(50) <i>NULL</i></td><td>The old value before the change</td></tr>
<tr><th>new_value</th><td>VARCHAR(50) <i>NULL</i></td><td>The new value after the change</td></tr>
<tr><th>description</th><td>LONGTEXT <i>NULL</i></td><td>Description of the activity or change</td></tr>
<tr><th>created_by</th><td>BIGINT UNSIGNED <i>NULL</i></td><td>ID of the user who performed the action</td></tr>
<tr><th>settings</th><td>TEXT <i>NULL</i></td><td>Serialized array for additional settings or metadata</td></tr>
<tr><th>created_at</th><td>TIMESTAMP <i>NULL</i></td><td>Timestamp when the activity was created</td></tr>
<tr><th>updated_at</th><td>TIMESTAMP <i>NULL</i></td><td>Timestamp when the activity was last updated</td></tr>
</tbody>
</table>

## _fbs_notifications Table

This table is designed to store notifications related to task management, including various actions performed on tasks.

<table cellspacing="0" class="nowrap">
<thead><tr><th>Column</th><th>Type</th><th>Comment</th></tr></thead>
<tbody>
<tr><th>id</th><td>INT UNSIGNED <i>Auto Increment</i></td><td>Primary key of the notification</td></tr>
<tr><th>object_id</th><td>INT UNSIGNED</td><td>ID of the associated object (e.g., Task ID, Board ID)</td></tr>
<tr><th>object_type</th><td>VARCHAR(100)</td><td>Type of the object (e.g., Task, Comment, Board)</td></tr>
<tr><th>task_id</th><td>INT UNSIGNED <i>NULL</i></td><td>ID of the task associated with the notification (if applicable)</td></tr>
<tr><th>action</th><td>VARCHAR(255) <i>NULL</i></td><td>Action performed (e.g., task_created, priority_changed)</td></tr>
<tr><th>activity_by</th><td>BIGINT UNSIGNED</td><td>ID of the user who performed the action</td></tr>
<tr><th>description</th><td>LONGTEXT <i>NULL</i></td><td>Description of the notification or action</td></tr>
<tr><th>settings</th><td>TEXT <i>NULL</i></td><td>Serialized array for additional settings or metadata</td></tr>
<tr><th>created_at</th><td>TIMESTAMP <i>NULL</i></td><td>Timestamp when the notification was created</td></tr>
<tr><th>updated_at</th><td>TIMESTAMP <i>NULL</i></td><td>Timestamp when the notification was last updated</td></tr>
</tbody>
</table>

### Keys and Indexes:
- **`object_id`**: Index for the associated object ID.
- **`object_type`**: Index for the type of the associated object.
- **`activity_by`**: Index for the user who performed the action.

## _fbs_notification_users Table

This table is designed to track which users have received and read specific notifications.

<table cellspacing="0" class="nowrap">
<thead><tr><th>Column</th><th>Type</th><th>Comment</th></tr></thead>
<tbody>
<tr><th>id</th><td>INT UNSIGNED <i>Auto Increment</i></td><td>Primary key of the record</td></tr>
<tr><th>notification_id</th><td>INT UNSIGNED <i>NULL</i></td><td>ID of the related notification</td></tr>
<tr><th>user_id</th><td>BIGINT UNSIGNED</td><td>ID of the user who received the notification</td></tr>
<tr><th>marked_read_at</th><td>TIMESTAMP <i>NULL</i></td><td>Timestamp when the notification was marked as read</td></tr>
<tr><th>created_at</th><td>TIMESTAMP <i>NULL</i></td><td>Timestamp when the record was created</td></tr>
<tr><th>updated_at</th><td>TIMESTAMP <i>NULL</i></td><td>Timestamp when the record was last updated</td></tr>
</tbody>
</table>

### Keys and Indexes:
- **`notification_id`**: Index for the related notification ID.
- **`user_id`**: Index for the user ID who received the notification.

## _fbs_teams Table

This table stores information about teams within the system.

<table cellspacing="0" class="nowrap">
<thead><tr><th>Column</th><th>Type</th><th>Comment</th></tr></thead>
<tbody>
<tr><th>id</th><td>INT UNSIGNED <i>Auto Increment</i></td><td>Primary key of the record</td></tr>
<tr><th>parent_id</th><td>INT UNSIGNED <i>NULL</i></td><td>ID of the parent team if this is a sub-team</td></tr>
<tr><th>title</th><td>VARCHAR(100)</td><td>Name of the team</td></tr>
<tr><th>description</th><td>TEXT <i>NULL</i></td><td>Description of the team</td></tr>
<tr><th>type</th><td>VARCHAR(50)</td><td>Type of the team (e.g., project, department)</td></tr>
<tr><th>visibility</th><td>VARCHAR(50) <i>DEFAULT 'VISIBLE'</i></td><td>Visibility of the team (VISIBLE/SECRET)</td></tr>
<tr><th>notifications_enabled</th><td>TINYINT(1) <i>DEFAULT 1</i></td><td>Whether notifications are enabled for the team</td></tr>
<tr><th>settings</th><td>TEXT <i>NULL</i></td><td>Serialized settings for the team</td></tr>
<tr><th>created_by</th><td>BIGINT UNSIGNED</td><td>ID of the user who created the team</td></tr>
<tr><th>created_at</th><td>TIMESTAMP <i>NULL</i></td><td>Timestamp when the team was created</td></tr>
<tr><th>updated_at</th><td>TIMESTAMP <i>NULL</i></td><td>Timestamp when the team was last updated</td></tr>
</tbody>
</table>

### Keys and Indexes:
- **`type`**: Index for the type of team.
- **`visibility`**: Index for the visibility status of the team.
- **`created_by`**: Index for the ID of the user who created the team.
- **`parent_id`**: Index for the parent team ID.
- **`notifications_enabled`**: Index for the notification settings.
- **`title`**: Index for the team title.

## _fbs_metas Table

This table stores metadata associated with various objects in the system.

<table cellspacing="0" class="nowrap">
<thead><tr><th>Column</th><th>Type</th><th>Comment</th></tr></thead>
<tbody>
<tr><th>id</th><td>INT UNSIGNED <i>Auto Increment</i></td><td>Primary key of the record</td></tr>
<tr><th>object_id</th><td>INT UNSIGNED <i>NULL</i></td><td>ID of the associated object (e.g., task, comment)</td></tr>
<tr><th>object_type</th><td>VARCHAR(100)</td><td>Type of the object (e.g., task, comment)</td></tr>
<tr><th>key</th><td>VARCHAR(100) <i>NULL</i></td><td>Metadata key</td></tr>
<tr><th>value</th><td>LONGTEXT <i>NULL</i></td><td>Metadata value</td></tr>
<tr><th>created_at</th><td>TIMESTAMP <i>NULL</i></td><td>Timestamp when the metadata was created</td></tr>
<tr><th>updated_at</th><td>TIMESTAMP <i>NULL</i></td><td>Timestamp when the metadata was last updated</td></tr>
</tbody>
</table>

### Keys and Indexes:
- **`object_id`**: Index for the ID of the associated object.

## _fbs_relations Table

This table manages relationships between different objects.

<table cellspacing="0" class="nowrap">
<thead><tr><th>Column</th><th>Type</th><th>Comment</th></tr></thead>
<tbody>
<tr><th>id</th><td>INT UNSIGNED <i>Auto Increment</i></td><td>Primary key of the record</td></tr>
<tr><th>object_id</th><td>INT UNSIGNED</td><td>ID of the primary object</td></tr>
<tr><th>object_type</th><td>VARCHAR(100)</td><td>Type of the primary object (e.g., task, comment)</td></tr>
<tr><th>foreign_id</th><td>INT UNSIGNED</td><td>ID of the related object</td></tr>
<tr><th>settings</th><td>TEXT <i>NULL</i></td><td>Serialized settings for the relationship</td></tr>
<tr><th>preferences</th><td>TEXT <i>NULL</i></td><td>Serialized preferences for the relationship</td></tr>
<tr><th>created_at</th><td>TIMESTAMP <i>NULL</i></td><td>Timestamp when the relationship was created</td></tr>
<tr><th>updated_at</th><td>TIMESTAMP <i>NULL</i></td><td>Timestamp when the relationship was last updated</td></tr>
</tbody>
</table>

### Keys and Indexes:
- **`object_type`**: Index for the type of the primary object.
- **`object_id`**: Index for the ID of the primary object.
- **`foreign_id`**: Index for the ID of the related object.

## _fbs_time_tracks Table

This table tracks time-related information for tasks.

<table cellspacing="0" class="nowrap">
<thead><tr><th>Column</th><th>Type</th><th>Comment</th></tr></thead>
<tbody>
<tr><th>id</th><td>INT UNSIGNED <i>Auto Increment</i></td><td>Primary key of the record</td></tr>
<tr><th>user_id</th><td>BIGINT UNSIGNED</td><td>ID of the user who tracked the time</td></tr>
<tr><th>board_id</th><td>INT UNSIGNED</td><td>ID of the board</td></tr>
<tr><th>task_id</th><td>INT UNSIGNED</td><td>ID of the task</td></tr>
<tr><th>started_at</th><td>TIMESTAMP <i>NULL</i></td><td>Timestamp when the time tracking started</td></tr>
<tr><th>completed_at</th><td>TIMESTAMP <i>NULL</i></td><td>Timestamp when the time tracking was completed</td></tr>
<tr><th>message</th><td>TEXT <i>NULL</i></td><td>Optional message or note related to the time tracking</td></tr>
<tr><th>status</th><td>VARCHAR(50) <i>NULL DEFAULT 'commited'</i></td><td>Status of the time track (e.g., committed)</td></tr>
<tr><th>working_minutes</th><td>INT UNSIGNED <i>NOT NULL DEFAULT 0</i></td><td>Total minutes worked</td></tr>
<tr><th>billable_minutes</th><td>INT UNSIGNED <i>NOT NULL DEFAULT 0</i></td><td>Minutes that are billable</td></tr>
<tr><th>is_manual</th><td>TINYINT(1) <i>NOT NULL DEFAULT 0</i></td><td>Indicates if the time track was entered manually</td></tr>
<tr><th>created_at</th><td>TIMESTAMP <i>NULL</i></td><td>Timestamp when the record was created</td></tr>
<tr><th>updated_at</th><td>TIMESTAMP <i>NULL</i></td><td>Timestamp when the record was last updated</td></tr>
</tbody>
</table>

### Keys and Indexes:
- **`user_id`**: Index for the ID of the user.
- **`status`**: Index for the status of the time track.
- **`task_id`**: Index for the ID of the task.
- **`board_id`**: Index for the ID of the board.