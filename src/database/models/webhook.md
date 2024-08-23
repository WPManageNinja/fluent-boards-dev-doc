# Webhook Model

| DB Table Name | Inherits from the `Meta` model (presumably `{wp_db_prefix}_meta`)                                        |
|---------------|----------------------------------------------------------------------------------|
| Source File   | fluent-Webhooks/app/Models/Webhook.php                         |
| Name Space    | FluentWebhooks\App\Models                                               |
| Class         | FluentWebhooks\App\Models\Webhook                              |

## Attributes
* object_id: The ID of the object associated with the webhook.
* object_type: The type of the object, which is always 'webhook' for this model.
* key: A unique identifier for the webhook, generated using wp_generate_uuid4().
* value: Stores the data associated with the webhook, including the URL.


## Methods
Along with Global Model methods, this model has few helper methods.


### getFields
This method returns an array of fields that are mappable in tasks.

#### Example:
```php 
$fields = $webhook->getFields();
```


### getSchema
Returns a schema array for the webhook, which includes the `name` and `url`.

#### Example:
```php 
$schema = $webhook->getSchema();
```

### store($data)
Creates a new webhook record with the provided data. The URL is auto-generated using the site URL and a unique hash.

- Parameters
    - $key `$data`
- Returns `array` of the newly created webhook.

#### Example:
```php 
$newWebhook = Webhook::store($data);
```

### saveChanges($newData)
Updates the webhook's `value` field with new data, excluding certain keys like `id` and `url`, and then saves the changes.

- Parameters
    - $newData `array`
- Returns `void` // No return value

#### Example:
```php 
$webhook->saveChanges($newData);
```
```

