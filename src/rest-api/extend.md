# Extending the REST API
<Badge type="tip" vertical="top" text="Fluent Framework" />

This guide shows how to add custom REST endpoints (routes, controllers, policies) to FluentBoards using the underlying Fluent Framework.

> If you only need to consume existing endpoints, see the main REST resources pages first.

## Registering a Custom Endpoint
(Coming from previous guide text – revise examples below to match your namespace/app.)

FluentBoards uses the WordPress REST API infrastructure, so any WP‑supported auth method (cookies+nonce, Application Passwords, OAuth layer you add) will work.

You can register routes, apply policies, and point to controller methods.

## Routing
```php
add_action( 'fluent_boards_loaded', function( $app ) {
    $app->router->prefix( 'my-prefix' )
        ->withPolicy( 'MyPlugin\\Policies\\MyPolicy' )
        ->group( function( $router ) {
            $router->get( '/', 'MyPlugin\\Controllers\\MyController@index' );
            // more routes go here
        } );
});
```
The above code registers a route that will be accessible at:
```
https://example.com/wp-json/fluent-boards/v2/my-prefix/
```
Base URL pattern:
```
https://example.com/wp-json/fluent-boards/v2/
```
NOTE: Ensure your classes autoload before the fluent_boards_loaded action fires.

```php
$app->router->post( '/your-url-path/', 'MyPlugin\\Controllers\\MyController@create');
```
### Route Parameters
```php
$app->router->get('/show/{id}', 'MyPlugin\\Controllers\\MyController@show')->int('id');
$app->router->get('/show/{id}/{name}', 'MyPlugin\\Controllers\\MyController@show')->int('id')->alpha('name');
```
Controller method will receive parameters directly.

### Available Router Methods
```php
$router->get($uri, $callback);
$router->post($uri, $callback);
$router->put($uri, $callback);
$router->patch($uri, $callback);
$router->delete($uri, $callback);
$router->any($uri, $callback); // any verb
```
## Controllers
```php
namespace MyPlugin\Controllers;
use FluentCrm\Framework\Http\Controller;
class MyController extends Controller {
    public function index() {
        return $this->sendSuccess(['ok' => true], 200);
    }
    public function create() {
        $data = $this->request->all();
        return $this->sendSuccess($data, 201);
    }
}
```
Key helper methods:
- send / sendSuccess / sendError
- request
- response

## Policies
```php
namespace MyPlugin\Policies;
use FluentCrm\App\Http\Policies\BasePolicy;
use FluentCrm\Framework\Request\Request;
class MyPolicy extends BasePolicy {
    public function verifyRequest(Request $request) {
        return current_user_can('manage_options');
    }
}
```
Return true to authorize. Add capability checks or custom logic.

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
- Emit action hooks inside controllers for other add‑ons.

> Tip: Keep your REST layer thin—move business logic into service classes so CLI, cron, or hooks can reuse it.
