# Folder Model

| DB Table Name | `{wp_db_prefix}fbs_boards` (rows with `type = 'folder'`) |
|---------------|---------------------------------------------------------|
| Schema        | [Check Schema](/database/#fbs-boards-table) |
| Source File   | fluent-boards/app/Models/Folder.php |
| Name Space    | FluentBoards\App\Models |
| Class         | FluentBoards\App\Models\Folder |

Folders group boards. They are stored in `fbs_boards` with `type = 'folder'`; the model adds that as a global scope and sets it on create, along with `created_by` (current user). Boards are placed in a folder through `fbs_relations` rows with `object_type = 'FluentBoardsPro\App\Models\Folder'` (`Constant::OBJECT_TYPE_FOLDER_BOARD`), where `object_id` is the folder ID and `foreign_id` is the board ID.

## Attributes

| Attribute | Data Type | Comment |
|---|---|---|
| id | INT UNSIGNED | Primary key |
| parent_id | INT UNSIGNED NULL | Parent folder (for sub-folders) |
| title | TEXT NULL | Folder name |
| description | LONGTEXT NULL | Description |
| type | VARCHAR(50) | Always `folder` |
| background | TEXT NULL | Serialized; returned as an array |
| settings | TEXT NULL | Serialized; returned as an array |
| created_by | INT UNSIGNED | Creator user ID |
| archived_at | TIMESTAMP NULL | Archive time |
| created_at | TIMESTAMP NULL | Hidden |
| updated_at | TIMESTAMP NULL | Hidden |

Appended attribute `meta`: folder meta from `fbs_metas` (`object_type = 'board'`) as a `key => value` array.

::: tip toArray()
`toArray()` is overridden and returns only `id`, `title`, `created_by` and `boards_ids` (the IDs of the boards in the folder). It loads the `boards` relation to do so.
:::

## Usage

Please check [Model Basic](/database/models/) for common methods.

```php
use FluentBoards\App\Models\Folder;

$folder = Folder::create(['title' => 'Client Projects']);

// Put board 12 in the folder
$folder->boards()->attach(12, [
    'object_type' => \FluentBoards\App\Services\Constant::OBJECT_TYPE_FOLDER_BOARD,
]);

$folders = Folder::whereNull('archived_at')->get();
```

## Relations

### boards

Boards in the folder. Pivot: `settings`. The Board global scope applies, so only `to-do` and `roadmap` boards are returned.

- Returns a collection of `FluentBoards\App\Models\Board`

```php
$boardTitles = $folder->boards->pluck('title');
```

### parentFolder

- Returns `FluentBoards\App\Models\Folder` or `null`

### subFolders

Non-archived child folders.

- Returns a collection of `FluentBoards\App\Models\Folder`

See also `Board::removeBoardFromFolder()` on the [Board](/database/models/board#removeboardfromfolder) page.
