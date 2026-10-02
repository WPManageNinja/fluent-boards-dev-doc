# Base Endpoint

All API requests are made to the FluentBoards REST namespace:

```
/fluent-boards/v2/{resource}
```

**Base URL:** `https://yourdomain.com/wp-json/fluent-boards/v2/{resource}`

**Authentication:** WordPress Application Passwords over HTTP Basic auth (`curl -u "USERNAME:APPLICATION_PASSWORD"`). See [Authentication](/rest-api/authentication).

**Content-Type:** `application/json` for POST/PUT request bodies; `multipart/form-data` for file uploads.
