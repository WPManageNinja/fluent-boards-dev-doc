# FluentBoards Filter Hooks

<Badge type="tip" vertical="top" text="FluentBoards Core" /> <Badge type="warning" vertical="top" text="Intermediate" />

FluentBoards has many interesting filer hooks that let developers change default settings and even extend FluentBoards with new functionality.

## What are Filter Hooks

A hook is a feature that allows developers to manipulate functionality without modifying core files. A hook can help developers inject some functions or edit default settings.
  
Filter hooks are used to return modified values for certain parameters, based on different factors.

## Available Filter Hooks <hr/>

<explain-block title="fluent_boards/board_find">
When you find a board it returns a board object. But if you want to manipulate that board data and return
modified board object then you can use this filter.

**Parameters**
- `$board` Object

**Usage:**
```php 
/*
* Manipulate board object
*/
add_filter('fluent_boards/board_find', function($board) {
   return $board;
});
```
</explain-block>

<explain-block title="fluent_boards/before_create_board">
But if you want to modify board data before create that board then you can use this filter.

**Parameters**
- `$boardData` Object

**Usage:**
```php 
/*
* Manipulate board data before task create
*/
add_filter('fluent_boards/before_create_board', function($boardData) {
   return $boardData;
});
```
</explain-block>

<explain-block title="fluent_boards/before_task_create">
But if you want to modify task data before create that task then you can use this filter.

**Parameters**
- `$data` Object

**Usage:**
```php 
/*
* Manipulate task data before task create
*/
add_filter('fluent_boards/before_task_create', function($data) {
   return $data;
});
```
</explain-block>

<explain-block title="fluent_boards/uploaded_file_name_prefix">
But if you want to modify uploaded file name prefix then you can use this filter.

**Parameters**
- `$prefix` String

**Usage:**
```php 
/*
* Modify uploaded file name prefix
*/
add_filter('fluent_boards/uploaded_file_name_prefix', function($prefix) {
   return $prefix;
});
```
</explain-block>

<explain-block title="fluent_boards/incoming_webhook_data">
But if you want to modify incoming webhook data then you can use this filter.

**Parameters**
- `$postData` Array
- `$webhook` String

**Usage:**
```php 
/*
* Modify incoming webhook data
*/
add_filter('fluent_boards/incoming_webhook_data', function($postData, $webhook) {
   return $postData;
});
```
</explain-block>

<explain-block title="fluent_boards/webhook_task_data">
But if you want to modify webhook task data then you can use this filter.

**Parameters**
- `$postData` Array
- `$webhook` String

**Usage:**
```php 
/*
* Modify webhook task data
*/
add_filter('fluent_boards/webhook_task_data', function($postData, $webhook) {
   return $postData;
});
```
</explain-block>

<explain-block title="fluent_boards/site_logo">
But if you want to change site logo then you can use this filter.

**Parameters**
- `$logo_url` String

**Usage:**
```php 
/*
* Change site logo
*/
add_filter('fluent_boards/site_logo', function($logo_url) {
   return $logo_url;
});
```
</explain-block>

<explain-block title="fluent_boards/addons_settings">
But if you want to modify addon data in features and module settings then you can use this filter.

**Parameters**
- `$addOns` Array

**Usage:**
```php 
/*
* Modify addon data in features and module settings
*/
add_filter('fluent_boards/addons_settings', function($addOns) {
   return $addOns;
});
```
</explain-block>

<explain-block title="fluent_boards/accepted_plugins">
But if you want to modify accepted free plugins then you can use this filter.

**Parameters**
- `$acceptedFreePlugins` Array

**Usage:**
```php 
/*
* Modify accepted free plugins
*/
add_filter('fluent_boards/accepted_plugins', function($acceptedFreePlugins) {
   return $acceptedFreePlugins;
});
```
</explain-block>

<explain-block title="fluent_boards/save_general_settings">
But if you want to modify general settings before save then you can use this filter.

**Parameters**
- `$settings` Array

**Usage:**
```php 
/*
* Modify general settings before save
*/
add_filter('fluent_boards/save_general_settings', function($settings) {
   return $settings;
});
```
</explain-block>

<explain-block title="fluent_boards/email_footer">
But if you want to modify email footer then you can use this filter.

**Parameters**
- `$footer_text` String

**Usage:**
```php 
/*
* Modify email footer
*/
add_filter('fluent_boards/email_footer', function($footer_text) {
   return $footer_text;
});
```
</explain-block>

<explain-block title="fluent_boards/email_header">
But if you want to modify email header then you can use this filter.

**Parameters**
- `$email_header` String

**Usage:**
```php 
/*
* Modify email header
*/
add_filter('fluent_boards/email_header', function($email_header) {
   return $email_header;
});
```
</explain-block>



