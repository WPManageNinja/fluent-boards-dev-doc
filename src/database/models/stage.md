# Stage Model

| DB Table Name | {wp_db_prefix}_fbs_board_terms                                              |
|---------------|-----------------------------------------------------------------------------|
| Schema        | <a :href="$withBase('/database/#fbs-board-terms-table')">Check Schema</a> |
| Source File   | fluent-boards/app/Models/Stage.php                                          |
| Name Space    | FluentBoards\App\Models                                                     |
| Class         | FluentBoards\App\Models\Stage                                               |

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
        <td>Primary key of the term</td>
     </tr>
     <tr>
        <th>board_id</th>
        <td>INT UNSIGNED</td>
        <td>ID of the board associated with the term</td>
     </tr>
     <tr>
        <th>title</th>
        <td>VARCHAR(100) <i>NULL</i></td>
        <td>Title of the stage or label. In case of a label, the title can be null with only a color.</td>
     </tr>
     <tr>
        <th>slug</th>
        <td>VARCHAR(100) <i>NULL</i></td>
        <td>Slug of the stage or label</td>
     </tr>
     <tr>
        <th>type</th>
        <td>VARCHAR(50) NOT NULL DEFAULT 'stage'</td>
        <td>Type of the term: 'stage' or 'label'</td>
     </tr>
     <tr>
        <th>position</th>
        <td>DECIMAL(10,2) NOT NULL DEFAULT '1'</td>
        <td>Position of the stage or label. 1 = first, 2 = second, etc.</td>
     </tr>
     <tr>
        <th>color</th>
        <td>VARCHAR(50) <i>NULL</i></td>
        <td>Text color of the stage or label</td>
     </tr>
     <tr>
        <th>bg_color</th>
        <td>VARCHAR(50) <i>NULL</i></td>
        <td>Background color of the stage or label</td>
     </tr>
     <tr>
        <th>settings</th>
        <td>TEXT <i>NULL</i>
        </td><td>Serialized settings for the term</td>
     </tr>
     <tr>
        <th>archived_at</th>
        <td>TIMESTAMP <i>NULL</i>
        </td><td>Timestamp when the term was archived</td>
     </tr>
     <tr>
        <th>created_at</th>
        <td>TIMESTAMP <i>NULL</i></td>
        <td>Timestamp when the term was created</td>
     </tr>
     <tr>
        <th>updated_at</th>
        <td>TIMESTAMP <i>NULL</i></td>
        <td>Timestamp when the term was last updated</td>
     </tr>
</tbody>
</table>

## Usage
Please check <a href="/database/models/">Model Basic</a> for Common methods.

### Accessing Attributes

```php 

$stage = FluentBoards\App\Models\Stage::find(1);

$stage->id; // returns id
$stage->title; // returns title
.......
```

## Methods
Along with Global Model methods, this model has few helper methods.

### moveToNewPosition($newIndex)

Move the stage to a new position within the board. This method repositions the stage to the specified index within the board. If the new position is already taken, it reindexes the positions of all stages and retries the move operation.

- Parameters
  - $newIndex `numeric`
- Returns `array` updated stage

#### Usage
```php 
$stage->moveToNewPosition($position);
```
