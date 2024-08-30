---
pageClass: global-functions
---

## Global Functions

FluentBoards provides a set of global functions that can be used throughout the plugin.
In this article, we are documenting few useful functions that you may use. For full understanding, please check the `app/functions/helpers.php` file 

[[toc]]


### fluent_boards_user_avatar
Generate a user avatar URL based on the user's email.

**Parameters**
- `$email`: (string): The user's email address.
- `$name` (string, optional): The user's name to be used as a fallback if no Gravatar is found.

**Return**
- `string`: The URL of the user's avatar.

**Example**
```php
$avatarUrl = fluent_boards_user_avatar('user@example.com', 'John Doe');
```

### fluent_boards_page_url
Get the URL of the FluentBoards admin page.

**Return**
- `string`: The URL of the FluentBoards admin page.

**Example**
```php
$pageUrl = fluent_boards_page_url();
```

### fluent_boards_get_pref_settings
Get the URL of the FluentBoards admin page.

**Parameters**
- `$cached` (boolean, optional): Whether to use cached settings. Defaults to `true`.

**Return**
- `array`: An associative array of preference settings.

**Example**
```php
$settings = fluent_boards_get_pref_settings();
```

### fluent_boards_site_logo
Get the site logo URL.

**Return**
- `string`: The URL of the site's logo.

**Example**
```php
$logoUrl = fluent_boards_site_logo();
```

### fluent_boards_get_option
Get the site logo URL.

**Parameters**
- `$key` (string): The option key.
- `$default` (mixed, optional): The default value to return if the option does not exist. Defaults to `null`.

**Return**
- `mixed`: The value of the option or the default value.

**Example**
```php
$optionValue = fluent_boards_get_option('some_option_key', 'default_value');
```

### fluent_boards_update_option
Get the site logo URL.

**Parameters**
- `key` (string): The option key.
- `$value` (mixed): The value to set for the option.

**Return**
- `\FluentBoards\App\Models\Meta`: The updated `Meta` model instance.

**Example**
```php
$updatedOption = fluent_boards_update_option('some_option_key', 'new_value');
```

### fluentBoardsDb
Get the FluentBoards database instance.

**Return**
- `\FluentBoards\App\App`

**Example**
```php
$db = fluentBoardsDb();
```


This documentation provides a comprehensive overview of the global functions available in the `FluentBoards` plugin, including their usage, parameters, and return values.

