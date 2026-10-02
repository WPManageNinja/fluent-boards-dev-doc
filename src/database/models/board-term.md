# BoardTerm Model

| DB Table Name | `{wp_db_prefix}fbs_board_terms` |
|---------------|---------------------------------|
| Schema        | [Check Schema](/database/#fbs-board-terms-table) |
| Source File   | fluent-boards/app/Models/BoardTerm.php |
| Name Space    | FluentBoards\App\Models |
| Class         | FluentBoards\App\Models\BoardTerm |

`BoardTerm` is the base model for the rows in `fbs_board_terms`. It has no global scope, so it sees stages, labels and custom fields together. In most cases use one of the subclasses:

| Subclass | `type` value |
|---|---|
| [Stage](/database/models/stage) | `stage` |
| [Label](/database/models/label) | `label` |
| [CustomField](/database/models/custom-field) | `custom-field` |

You can extend `BoardTerm` to store your own kind of per-board term.

## Attributes

| Attribute | Data Type | Comment |
|---|---|---|
| id | INT UNSIGNED | Primary key |
| board_id | INT UNSIGNED | Board ID |
| title | VARCHAR(100) NULL | Title |
| slug | VARCHAR(100) NULL | Slug |
| type | VARCHAR(50) | `stage`, `label` or `custom-field` |
| position | DECIMAL(10,2) | Sort position |
| color | VARCHAR(50) NULL | Text color |
| bg_color | VARCHAR(50) NULL | Background color |
| settings | TEXT NULL | Serialized; returned as an array |
| archived_at | TIMESTAMP NULL | Archive time |
| created_at | TIMESTAMP NULL | |
| updated_at | TIMESTAMP NULL | |

Fillable: `board_id`, `title`, `slug`, `type`, `position`, `settings`, `color`, `bg_color`, `archived_at`, `updated_at`.

::: tip Settings are merged
Assigning `settings` merges the new keys into the stored settings instead of replacing them. Use `replaceSettings()` to overwrite the whole array.
:::

## Usage

Please check [Model Basic](/database/models/) for common methods.

```php
$term = FluentBoards\App\Models\BoardTerm::find(5);

$term->type;     // "label"
$term->settings; // array
```

## Relations

### board

- Returns `FluentBoards\App\Models\Board`

```php
$board = $term->board;
```

## Methods

### replaceSettings($settings)

Replaces the whole `settings` array (the normal setter merges). Call `save()` afterwards.

- Returns `BoardTerm` (for chaining)

```php
$term->replaceSettings(['default_task_status' => 'open'])->save();
```
