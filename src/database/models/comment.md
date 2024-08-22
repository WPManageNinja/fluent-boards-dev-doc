# Comment Model

| DB Table Name | {wp_db_prefix}_fbs_comment                                            |
|---------------|-----------------------------------------------------------------------|
| Schema        | <a :href="$withBase('/database/#fbs-comments-table')">Check Schema</a> |
| Source File   | fluent-boards/app/Models/Comment.php                                    |
| Name Space    | FluentBoards\App\Models                                               |
| Class         | FluentBoards\App\Models\Comment                                         |

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
        <td>Primary key of the comment</td>
      </tr>
      <tr>
        <th>board_id</th>
        <td>INT UNSIGNED</td>
        <td>ID of the associated board</td>
      </tr>
      <tr>
        <th>task_id</th>
        <td>INT UNSIGNED</td>
        <td>ID of the associated task</td>
      </tr>
      <tr>
        <th>parent_id</th>
        <td>BIGINT UNSIGNED <i>NULL</i></td>
        <td>ID of the parent comment if it's a reply</td>
      </tr>
      <tr>
        <th>type</th>
        <td>VARCHAR(50) <i>DEFAULT 'comment'</i></td>
        <td>Type of the entry (comment, note, reply)</td>
      </tr>
      <tr>
        <th>privacy</th>
        <td>VARCHAR(50) <i>DEFAULT 'public'</i></td>
        <td>Privacy level of the comment (public, private)</td>
      </tr>
      <tr>
        <th>status</th>
        <td>VARCHAR(50) <i>DEFAULT 'published'</i></td>
        <td>Status of the comment (published, draft, spam)</td>
      </tr>
      <tr>
        <th>author_name</th>
        <td>VARCHAR(192) <i>DEFAULT ''</i></td>
        <td>Name of the comment author</td>
      </tr>
      <tr>
        <th>author_email</th>
        <td>VARCHAR(192) <i>DEFAULT ''</i></td>
        <td>Email of the comment author</td>
      </tr>
      <tr>
        <th>author_ip</th>
        <td>VARCHAR(50) <i>DEFAULT ''</i></td>
        <td>IP address of the comment author</td>
      </tr>
      <tr>
        <th>description</th>
        <td>TEXT <i>NULL</i></td>
        <td>Content of the comment</td>
      </tr>
      <tr>
        <th>created_by</th>
        <td>BIGINT UNSIGNED <i>NULL</i></td>
        <td>ID of the user who created the comment</td>
      </tr>
      <tr>
        <th>created_at</th>
        <td>TIMESTAMP <i>NULL</i></td>
        <td>Timestamp when the comment was created</td>
      </tr>
      <tr>
        <th>updated_at</th>
        <td>TIMESTAMP <i>NULL</i></td>
        <td>Timestamp when the comment was last updated</td>
      </tr>
    </tbody>
</table>

## Usage
Please check <a href="/database/models/">Model Basic</a> for Common methods.

### Accessing Attributes

```php 

$comment = FluentBoards\App\Models\Comment::find(1);

$comment->id; // returns id
$comment->author_name; // returns author_name
.......

```

## Relations
This model has the following relationships that you can use

### user
Access the user who created the comment

- return `FluentBoards\App\Models\User` Model Collection

#### Example:
```php 
$user = $comment->user;
```

### task
Access the associated task of the comment

- return `FluentBoards\App\Models\Task` Model Collection

#### Example:
```php 
$task = $comment->task;
```

### replies
Access the replies to the comment

- return `FluentBoards\App\Models\Comment` Model Collection

#### Example:
```php 
$replies = $comment->replies;
```

### parentComment
Access the parent comment if it exists

- return `FluentBoards\App\Models\Comment` Model Collection

#### Example:
```php 
$parent = $comment->parentComment;
```
### images
Access images associated with the comment

- return `FluentBoards\App\Models\CommentImage` Model Collection

#### Example:
```php 
$images = $comment->images;
```
