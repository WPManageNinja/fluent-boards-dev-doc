# Common Error Responses

Fluent Boards API errors use standard HTTP status codes. The body depends on where the request failed. There is no single error envelope.

## Permission check failed (401 / 403)

Every route has a permission policy. When it denies the request, WordPress answers with its standard error. The status is `401` when the request is not authenticated and `403` when the user is logged in but not allowed.

```json
{
  "code": "rest_forbidden",
  "message": "Sorry, you are not allowed to do that.",
  "data": {
    "status": 403
  }
}
```

Wrong Application Password credentials are rejected by WordPress before the policy runs, for example:

```json
{
  "code": "incorrect_password",
  "message": "The provided password is an invalid application password.",
  "data": {
    "status": 401
  }
}
```

## Validation error (422)

When request validation fails, the body maps each field to the failed rule and its message:

```json
{
  "title": {
    "required": "The title field is required."
  }
}
```

## Endpoint errors (4xx)

Most controllers return a JSON object with a `message`, and sometimes extra keys:

```json
{
  "message": "Task not found."
}
```

A few endpoints send the message as a plain JSON string instead:

```json
"Name, board and stage are required"
```

The status is whatever the endpoint sets (`400`, `403`, `404`, `409`, `422`). When an endpoint asks for a status below 400, the framework sends `422` instead.

## Record not found (404)

When a requested record does not exist, the framework returns:

```json
{
  "message": "No query results for model [FluentBoards\\App\\Models\\Board] 999"
}
```

## Unhandled exception (500)

An uncaught exception returns the exception message, with the exception code as the status (or `500`):

```json
{
  "code": "plugin_exception",
  "data": {},
  "message": "Something went wrong"
}
```

With `WP_DEBUG` on, `data` contains the `file` and `line` of the exception.

## Unknown route (404)

A path or method that does not exist returns the WordPress REST error:

```json
{
  "code": "rest_no_route",
  "message": "No route was found matching the URL and request method.",
  "data": {
    "status": 404
  }
}
```

## Status codes

| Code | Meaning |
|------|---------|
| 400 | Bad request or failed operation |
| 401 | Not authenticated, or invalid credentials |
| 403 | Authenticated but not allowed |
| 404 | Route or record not found |
| 409 | Conflict (for example, user already a board member) |
| 422 | Validation or business-rule error |
| 500 | Unhandled server error |
