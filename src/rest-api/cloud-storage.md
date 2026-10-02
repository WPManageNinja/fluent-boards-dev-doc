# Cloud Storage

Read and change where FluentBoards stores uploaded files (task attachments, comment images, board backgrounds): the local uploads folder, or an S3-compatible service. Plugin source: Pro.

::: tip Pro
Both endpoints require Fluent Boards Pro and a WordPress administrator or FluentBoards admin.
:::

FluentBoards does not expose endpoints to browse or download files from the bucket. Files are uploaded through the normal attachment endpoints (see [Attachments](/rest-api/attachments)), which use the configured driver.

## Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/admin/storage-settings` | Get the storage configuration |
| POST | `/admin/storage-settings` | Save the storage configuration |

## Drivers

| `driver` | Service | Required fields |
|---|---|---|
| `local` | WordPress uploads folder | — |
| `cloudflare_r2` | Cloudflare R2 | `access_key`, `secret_key`, `bucket`, `public_url` (URL), `account_id` |
| `amazon_s3` | Amazon S3 | `region`, `access_key`, `secret_key`, `bucket` |
| `digital_ocean` | DigitalOcean Spaces | `region`, `access_key`, `secret_key`, `bucket` |
| `blackblaze_b2` | Backblaze B2 | `endpoint`, `bucket`, `access_key` (key ID), `secret_key` (application key) |

All drivers also accept an optional `sub_folder`.

## Get Storage Settings

Returns the current configuration. Saved keys are never returned: `access_key` and `secret_key` come back as the placeholder `FBS_ENCRYPTED_DATA_KEY`. `regions` lists the selectable Amazon S3 and DigitalOcean regions.

```http
GET /wp-json/fluent-boards/v2/admin/storage-settings
```

**Example Request**

```bash
curl "https://yourdomain.com/wp-json/fluent-boards/v2/admin/storage-settings" \
  -u "USERNAME:APPLICATION_PASSWORD"
```

**Example Response**

```json
{
  "config": {
    "driver": "cloudflare_r2",
    "access_key": "FBS_ENCRYPTED_DATA_KEY",
    "secret_key": "FBS_ENCRYPTED_DATA_KEY",
    "bucket": "fluent-boards",
    "public_url": "https://files.example.com",
    "account_id": "a1b2c3d4e5f6",
    "sub_folder": "site-1",
    "regions": {
      "amazon_s3_region": ["us-east-2", "us-east-1", "us-west-1"],
      "digital_ocean_region": ["nyc1", "nyc2", "nyc3"]
    }
  }
}
```

When storage is configured in `wp-config.php` (constant `FLUENT_BOARDS_CLOUD_STORAGE` and the `FLUENT_BOARDS_CLOUD_STORAGE_*` constants), the response has `"is_defined": true` and the settings cannot be changed through the API.

## Update Storage Settings

Validates the fields for the chosen driver, tests the connection (for R2, S3 and B2), saves the configuration, and turns the `cloud_storage` feature flag on (or off for `local`).

```http
POST /wp-json/fluent-boards/v2/admin/storage-settings
```

**Parameters**

| Parameter | Type | Required | Description |
|---|---|---|---|
| `config` | object | Yes | Driver settings |
| `config.driver` | string | Yes | See [Drivers](#drivers) |
| `config.access_key` | string | Driver | Send `FBS_ENCRYPTED_DATA_KEY` to keep the saved key (R2, S3, B2) |
| `config.secret_key` | string | Driver | Send `FBS_ENCRYPTED_DATA_KEY` to keep the saved secret (R2, S3, B2) |
| `config.bucket` | string | Driver | Bucket name |
| `config.region` | string | Driver | S3 / DigitalOcean region |
| `config.public_url` | string | Driver | R2 public bucket URL |
| `config.account_id` | string | Driver | R2 account ID |
| `config.endpoint` | string | Driver | B2 S3 endpoint |
| `config.sub_folder` | string | No | Folder inside the bucket |

**Example Request**

```bash
curl -X POST "https://yourdomain.com/wp-json/fluent-boards/v2/admin/storage-settings" \
  -u "USERNAME:APPLICATION_PASSWORD" \
  -H "Content-Type: application/json" \
  -d '{
    "config": {
      "driver": "amazon_s3",
      "region": "us-east-1",
      "access_key": "AKIA...",
      "secret_key": "wJalr...",
      "bucket": "my-boards-files",
      "sub_folder": "boards"
    }
  }'
```

**Example Response**

```json
{
  "message": "Storage settings has been updated successfully"
}
```

Switch back to local storage with `{"config": {"driver": "local"}}`.

**Errors**

- `422` with field errors when a required field for the driver is missing.
- `422` when the connection test fails. The `message` is the storage service's error text (because of an operator-precedence bug in the controller, the `Could not connect to the remote storage service. Error:` prefix is dropped); `Could not connect to the remote storage service. Please check your credentials` is returned when no driver can be built.
- `422` `You can not update the storage settings as it is defined in the config file` when storage is set in `wp-config.php`.

See [Common Error Responses](/rest-api/shared/error-responses) for standard error formats.
