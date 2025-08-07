# Common Error Responses

All Fluent Boards API endpoints may return the following standard error responses:

## 400 Bad Request

```json
{
  "code": "rest_invalid_param",
  "message": "Invalid parameter: title is required",
  "data": {
    "status": 400
  }
}
```

## 401 Unauthorized

```json
{
  "code": "rest_unauthorized",
  "message": "Authentication required",
  "data": {
    "status": 401
  }
}
```

## 403 Forbidden

```json
{
  "code": "rest_forbidden",
  "message": "You don't have permission to access this resource",
  "data": {
    "status": 403
  }
}
```

## 404 Not Found

```json
{
  "code": "rest_not_found",
  "message": "Resource not found",
  "data": {
    "status": 404
  }
}
```

## 422 Validation Error

```json
{
  "code": "rest_invalid_param",
  "message": "Validation failed",
  "data": {
    "status": 422,
    "params": {
      "title": "Title is required"
    }
  }
}
```

## 500 Internal Server Error

```json
{
  "code": "rest_server_error",
  "message": "Internal server error",
  "data": {
    "status": 500
  }
}
```

## Error Response Format

All error responses follow this structure:

| Field | Type | Description |
|-------|------|-------------|
| `code` | string | Error code identifier |
| `message` | string | Human-readable error message |
| `data.status` | integer | HTTP status code |
| `data.params` | object | Validation errors (422 only) |

## Common Error Codes

- `rest_invalid_param` - Invalid or missing parameters
- `rest_unauthorized` - Authentication required
- `rest_forbidden` - Insufficient permissions
- `rest_not_found` - Resource not found
- `rest_server_error` - Internal server error 