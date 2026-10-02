# Webhook Model

| DB Table Name | `{wp_db_prefix}fbs_metas` (rows with `object_type = 'webhook'`) |
|---------------|----------------------------------------------------------------|
| Schema        | [Check Schema](/database/#fbs-metas-table) |
| Source File   | fluent-boards/app/Models/Webhook.php |
| Name Space    | FluentBoards\App\Models |
| Class         | FluentBoards\App\Models\Webhook |
| Extends       | [Meta](/database/models/meta) |

An incoming webhook. Each webhook is a `fbs_metas` row; the model adds a global scope `object_type = 'webhook'`. Outgoing webhooks are stored with `object_type = 'outgoing_webhook'` and do not use this model.

## Attributes

| Attribute | Data Type | Comment |
|---|---|---|
| id | INT UNSIGNED | Primary key |
| object_id | INT UNSIGNED NULL | Not used |
| object_type | VARCHAR(100) | Always `webhook` |
| key | VARCHAR(100) | Unique hash generated with `wp_generate_uuid4()` |
| value | LONGTEXT | Array with the webhook settings (`name`, `board`, `stage`, `url`) |
| created_at | TIMESTAMP NULL | |
| updated_at | TIMESTAMP NULL | |

Fillable: `object_id`, `object_type`, `key`, `value`.

## Usage

Please check [Model Basic](/database/models/) for common methods.

```php
use FluentBoards\App\Models\Webhook;

$webhooks = Webhook::orderBy('id', 'DESC')->get();

foreach ($webhooks as $webhook) {
    echo $webhook->value['url'];
}
```

## Methods

### store($data)

Creates a webhook. Generates `key` and adds the receiving `url` (`site_url('?fbs=1&route=task&hash={key}')`) to the stored value.

- Parameters
    - `$data` `array`: webhook settings, `name`, `board` (board ID) and `stage` (stage ID)
- Returns `Webhook`

```php
$webhook = (new Webhook())->store([
    'name'     => 'Leads form',
    'board'    => 1,
    'stage'    => 3,
]);

$endpoint = $webhook->value['url'];
```

### saveChanges($data)

Merges `$data` into `value` (ignoring `id` and `url`) and saves.

- Parameters
    - `$data` `array`
- Returns `Webhook`

```php
$webhook->saveChanges(['name' => 'Renamed webhook']);
```

### getFields()

Returns the task fields that an incoming payload can map to, built from `Task::mappableFields()`.

- Returns `array` with a `fields` list of `['key' => ..., 'field' => ...]`

```php
$fields = $webhook->getFields();
```

### getSchema()

Returns the default webhook shape: `['name' => '', 'url' => '']`.

```php
$schema = $webhook->getSchema();
```
