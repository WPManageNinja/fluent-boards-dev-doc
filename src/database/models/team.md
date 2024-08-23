# Team Model

| DB Table Name | {wp_db_prefix}_fbs_teams                                             |
|---------------|----------------------------------------------------------------------------------|
| Schema        | <a :href="$withBase('/database/#fbs-teams-table')">Check Schema</a> |
| Source File   | fluent-Teams/app/Models/Team.php                         |
| Name Space    | FluentTeams\App\Models                                               |
| Class         | FluentTeams\App\Models\Team                              |

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
        <th>parent_id</th>
        <td>INT UNSIGNED <i>NULL</i></td>
        <td>ID of the parent team if this is a sub-team</td>
      </tr>
      <tr>
        <th>title</th>
        <td>VARCHAR(100)</td>
        <td>Name of the team</td>
      </tr>
      <tr>
        <th>description</th>
        <td>TEXT <i>NULL</i></td>
        <td>Description of the team</td>
      </tr>
      <tr>
        <th>type</th>
        <td>VARCHAR(50)</td>
        <td>Type of the team (e.g., project, department)</td>
      </tr>
      <tr>
        <th>visibility</th>
        <td>VARCHAR(50) <i>DEFAULT 'VISIBLE'</i></td>
        <td>Visibility of the team (VISIBLE/SECRET)</td>
      </tr>
      <tr>
        <th>notifications_enabled</th>
        <td>TINYINT(1) <i>DEFAULT 1</i></td>
        <td>Whether notifications are enabled for the team</td>
      </tr>
      <tr>
        <th>settings</th>
        <td>TEXT <i>NULL</i></td>
        <td>Serialized settings for the team</td>
      </tr>
      <tr>
        <th>created_by</th>
        <td>BIGINT UNSIGNED</td>
        <td>ID of the user who created the team</td>
      </tr>
      <tr>
        <th>created_at</th>
        <td>TIMESTAMP <i>NULL</i></td>
        <td>Timestamp when the team was created</td>
      </tr>
      <tr>
        <th>updated_at</th>
        <td>TIMESTAMP <i>NULL</i></td>
        <td>Timestamp when the team was last updated</td>
      </tr>
    </tbody>
</table>

## Usage
Please check <a href="/database/models/">Model Basic</a> for Common methods.

### Accessing Attributes

```php 
$team = FluentBoards\App\Models\Team::find(1);

$team->id; // returns id
$team->name; // returns name
$team->settings; // returns settings (unserialized)
.......
```

## Relations
This model has the following relationships that you can use

### parent
Access the parent team, if any

- return `FluentTeams\App\Models\Team` Model Collection

#### Example:
```php 
$parentTeam = $team->parent;
```

