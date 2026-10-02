# Team Model

| DB Table Name | `{wp_db_prefix}fbs_teams` |
|---------------|---------------------------|
| Schema        | [Check Schema](/database/#fbs-teams-table) |
| Source File   | fluent-boards/app/Models/Team.php |
| Name Space    | FluentBoards\App\Models |
| Class         | FluentBoards\App\Models\Team |

## Attributes

| Attribute | Data Type | Comment |
|---|---|---|
| id | INT UNSIGNED | Primary key |
| parent_id | INT UNSIGNED NULL | Parent team |
| title | VARCHAR(100) | Team name |
| description | TEXT NULL | Description |
| type | VARCHAR(50) | Team type |
| visibility | VARCHAR(50) | `VISIBLE` (default) or `SECRET` |
| notifications_enabled | TINYINT(1) | Default `1` |
| settings | TEXT NULL | Serialized; returned as an array |
| created_by | BIGINT UNSIGNED | Creator user ID |
| created_at | TIMESTAMP NULL | |
| updated_at | TIMESTAMP NULL | |

## Usage

Please check [Model Basic](/database/models/) for common methods.

```php
$team = FluentBoards\App\Models\Team::create([
    'title'      => 'Design',
    'type'       => 'team',
    'created_by' => get_current_user_id(),
]);
```

## Relations

### parent

The parent team (`parent_id`).

- Returns `FluentBoards\App\Models\Team`

```php
$parentTitle = $team->parent ? $team->parent->title : '';
```
