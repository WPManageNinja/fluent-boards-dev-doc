# Extending the REST API
<Badge type="tip" vertical="top" text="WPFluent Framework" />

This guide shows how to add your own REST endpoints (routes, controllers, policies) under the FluentBoards namespace, using the same router that FluentBoards, Fluent Boards Pro and Fluent Roadmap use.

> If you only need to consume existing endpoints, see the main REST resources pages first.

## How FluentBoards registers routes

FluentBoards is built on the WPFluent framework. On `plugins_loaded` it fires:

```php
do_action('fluent_boards_loaded', $app);
```

`$app` is the `FluentBoards\Framework\Foundation\Application` instance. Its router (`$app->router`, a `FluentBoards\Framework\Http\Router`) collects routes and registers all of them with `register_rest_route()` on `rest_api_init`. Every route lands in the `fluent-boards/v2` namespace.

Fluent Boards Pro uses exactly this hook to add its time-tracking routes, so routes you add on `fluent_boards_loaded` are registered together with the core ones.

FluentBoards uses the WordPress REST API infrastructure, so any WordPress-supported auth method (cookie + `X-WP-Nonce`, Application Passwords, or an auth plugin you add) works for your routes too.

## Routing

```php
add_action('fluent_boards_loaded', function ($app) {
    $app->router->prefix('my-prefix')
        ->withPolicy(\MyPlugin\Policies\MyPolicy::class)
        ->group(function ($router) {
            $router->get('/', [\MyPlugin\Controllers\MyController::class, 'index']);
            $router->post('/', [\MyPlugin\Controllers\MyController::class, 'create']);
            $router->get('/{id}', [\MyPlugin\Controllers\MyController::class, 'show'])->int('id');
        });
});
```

These routes are available at:

```
GET  https://example.com/wp-json/fluent-boards/v2/my-prefix
POST https://example.com/wp-json/fluent-boards/v2/my-prefix
GET  https://example.com/wp-json/fluent-boards/v2/my-prefix/{id}
```

Make sure your classes can be autoloaded before `fluent_boards_loaded` fires (it runs on `plugins_loaded`). Pick a prefix that will not clash with FluentBoards routes such as `projects`, `tasks`, `admin` or `member`.

### Handlers

A handler can be:

- an array: `[MyController::class, 'method']`
- a string: `'MyPlugin\Controllers\MyController@method'`
- a closure: `function (\FluentBoards\Framework\Http\Request\Request $request) { ... }`

Short controller names (`'MyController@index'`) only work inside a `$router->namespace('MyPlugin\Controllers')->group(...)` block, which is how Fluent Boards Pro and Fluent Roadmap load their route files. Elsewhere, use fully qualified class names.

### Route parameters

```php
$router->get('/show/{id}', [MyController::class, 'show'])->int('id');
$router->get('/show/{id}/{name}', [MyController::class, 'show'])->int('id')->alpha('name');
```

Constraint helpers: `int()`, `alpha()`, `alphaNum()`, `alphaNumDash()`, and `where($param, $regex)`. Route parameters are passed to the controller method by name:

```php
public function show(Request $request, $id, $name) { ... }
```

### Available router methods

```php
$router->get($uri, $handler);
$router->post($uri, $handler);
$router->put($uri, $handler);
$router->patch($uri, $handler);
$router->delete($uri, $handler);
$router->any($uri, $handler); // any verb

$router->prefix($prefix);       // URL prefix for a group
$router->namespace($ns);        // controller namespace for a group
$router->withPolicy($policy);   // permission policy for a group
$router->group($callback);
```

## Controllers

Extend the FluentBoards base controller to get `$this->request`, `$this->validate()` and the response helpers:

```php
namespace MyPlugin\Controllers;

use FluentBoards\App\Http\Controllers\Controller;
use FluentBoards\Framework\Http\Request\Request;

class MyController extends Controller
{
    public function index(Request $request)
    {
        return [
            'items' => [],
        ];
    }

    public function create(Request $request)
    {
        $data = $this->validate($request->all(), [
            'title' => 'required',
        ]);

        return $this->response->sendSuccess([
            'message' => 'Created',
            'title'   => sanitize_text_field($data['title']),
        ], 201);
    }

    public function show(Request $request, $id)
    {
        if (!$id) {
            return $this->sendError(['message' => 'Not found'], 404);
        }

        return $this->sendSuccess(['id' => $id]);
    }
}
```

Response helpers:

| Method | Result |
|---|---|
| return an array | Sent as the JSON body with status `200` |
| `$this->sendSuccess($data)` | `200` with `$data` as the body (no envelope). It takes no status argument. |
| `$this->response->sendSuccess($data, $code)` | `$data` with a custom success status, for example `201` |
| `$this->sendError($data, $code = 422)` | `$data` as the body; codes below 400 become `422` |
| `$this->send($data, $code)` | Any status |

A failed `$this->validate()` returns `422` with `{"field": {"rule": "message"}}`. An uncaught exception returns `{"code": "plugin_exception", "message": "..."}` with the exception code (or `500`).

Request helpers: `$request->get('key', $default)`, `$request->getSafe('key', 'sanitize_text_field', $default)`, `$request->all()`, `$request->only([...])`, `$request->files()`.

## Policies

A policy decides whether the current user may call a route. Extend the FluentBoards base policy:

```php
namespace MyPlugin\Policies;

use FluentBoards\App\Http\Policies\BasePolicy;
use FluentBoards\App\Services\PermissionManager;
use FluentBoards\Framework\Http\Request\Request;

class MyPolicy extends BasePolicy
{
    // Default check for every route in the group
    public function verifyRequest(Request $request)
    {
        return PermissionManager::isFluentBoardsUser();
    }

    // Optional: a method with the same name as the controller method overrides verifyRequest
    public function create(Request $request)
    {
        return PermissionManager::isAdmin();
    }
}
```

Return `true` to allow the request. Returning `false` makes WordPress respond with `rest_forbidden` (`401` when not logged in, `403` otherwise).

::: warning Always set a policy
A route without a policy has no permission check and is public. `BasePolicy::verifyRequest()` itself returns `true`, so override it.
:::

You can also reuse the FluentBoards policies (`FluentBoards\App\Http\Policies\...`):

| Policy | Allows |
|---|---|
| `AuthPolicy` | Any logged-in user |
| `BoardUserPolicy` | Admins and users who belong to at least one board |
| `SingleBoardPolicy` | Users with access to the route's `{board_id}` (write methods need a non-viewer role) |
| `AdminPolicy` | WordPress administrators and FluentBoards admins |

Useful `PermissionManager` checks: `isAdmin()`, `isFluentBoardsUser()`, `isBoardManager($boardId)`, `userHasBoardPermission($boardId, $method)`.

## Directory Structure Example

```
my-plugin/
├── my-plugin.php
├── Policies/
│   └── MyPolicy.php
└── Controllers/
    └── MyController.php
```

## Next Steps

- Add more routes for CRUD.
- Introduce caching or permission layers.
- Emit action hooks inside controllers for other add-ons.

> Tip: Keep your REST layer thin. Move business logic into service classes so CLI, cron, or hooks can reuse it.
