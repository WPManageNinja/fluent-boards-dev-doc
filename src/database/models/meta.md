# Meta Model

| DB Table Name | `{wp_db_prefix}fbs_metas` |
|---------------|---------------------------|
| Schema        | [Check Schema](/database/#fbs-metas-table) |
| Source File   | fluent-boards/app/Models/Meta.php |
| Name Space    | FluentBoards\App\Models |
| Class         | FluentBoards\App\Models\Meta |

Generic key/value storage. `object_type` says what the row belongs to. The model has no global scope; always filter by `object_type`.

| object_type | object_id | Used for |
|---|---|---|
| `option` | — | Plugin options (`fluent_boards_get_option()` / `fluent_boards_update_option()`) |
| `board` | Board ID | Board meta (`Board::getMeta()` / `Board::updateMeta()`) |
| `user` | User ID | Per-user settings |
| `webhook` | — | Incoming webhooks ([Webhook](/database/models/webhook) model) |
| `outgoing_webhook` | — | Outgoing webhooks |
| `repeat_task` | Task ID | Repeat task settings (`Task::repeatTaskMeta()`) |
| `fluent_board_admin` | User ID | FluentBoards admin flag |

The [Webhook](/database/models/webhook) model extends this model.

## Attributes

| Attribute | Data Type | Comment |
|---|---|---|
| id | INT UNSIGNED | Primary key |
| object_id | INT UNSIGNED NULL | Related object ID |
| object_type | VARCHAR(100) | See the table above |
| key | VARCHAR(100) NULL | Meta key |
| value | LONGTEXT NULL | Serialized on write, unserialized on read |
| created_at | TIMESTAMP NULL | |
| updated_at | TIMESTAMP NULL | |

## Usage

Please check [Model Basic](/database/models/) for common methods.

For plugin options, use the helpers instead of the model:

```php
fluent_boards_update_option('my_option', ['enabled' => 'yes']);
$value = fluent_boards_get_option('my_option', []);
```

For your own data, use a unique `object_type` so you do not collide with FluentBoards rows:

```php
use FluentBoards\App\Models\Meta;

Meta::create([
    'object_id'   => $board->id,
    'object_type' => 'my_plugin_board_data',
    'key'         => 'sync_status',
    'value'       => ['last_sync' => current_time('mysql')],
]);

$meta = Meta::where('object_type', 'my_plugin_board_data')
    ->where('object_id', $board->id)
    ->where('key', 'sync_status')
    ->first();

$data = $meta ? $meta->value : null; // array
```
