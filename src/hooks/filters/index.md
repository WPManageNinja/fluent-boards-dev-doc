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

<explain-block title="fluent_boards/task_priorities">
If you want to modify task priorities then you can use this filter.

**Parameters**
- `$priorities` Array - 'high', 'medium', 'low'

**Usage:**
```php
/*
* Modify task priorities
*/
add_filter('fluent_boards/task_priorities', function($priorities) {
    $priorities['urgent'] = __('Urgent', 'fluent-boards');
    return $priorities;
});
```
</explain-block>

<explain-block title="fluent_boards/task_tabs">
If you want to modify the order of activity, comment log in task modal then you can use this filter.

**Parameters**
- `$tabs` Array - 'all', 'comment', 'activity'

**Usage:**
```php
/*
* Modify task tabs
*/
add_filter('fluent_boards/task_tabs', function($tabs) {
    $reorderedTabs = [
        'activity' => $tabs['activity'], //1st 
        'comment' => $tabs['comment'], //2nd
        'all' => $tabs['all'], //3rd  
    ];
    
    return $reorderedTabs;
});
```
</explain-block>


<explain-block title="fluent_boards/board_menu_items">
Modify board menu items - add, remove, or reorder menu items in the board sidebar. This filter runs when the board menu is loaded and allows you to customize the sidebar menu that appears on the right side of the board.

**Parameters**
- `$menuItems` Array - Array of existing menu items with their properties (key, label, type, position, etc.)
- `$board_id` Integer - The current board ID

**Menu Item Structure:**
```php
[
    'key' => 'unique_identifier',        // Required: Unique key for the menu item
    'label' => 'Menu Label',             // Required: Display text
    'type' => 'default|custom',          // Required: Item type
    'position' => 1,                     // Optional: Position in menu (lower = higher)
    'icon' => '<svg>...</svg>',          // Required for custom items: SVG icon HTML
    'html' => '<div>Content</div>',      // Required for custom items: HTML content
    'width' => '500px',                  // Optional: Modal/drawer width
    'is_drawer' => true,                 // Optional: Open as drawer instead of modal
    'role' => 'manager|admin'            // Optional: Required user role
]
```

**Usage:**
```php
/*
* Modify board menu items
*/
add_filter('fluent_boards/board_menu_items', function($menuItems, $board_id) {
   // Remove unwanted default menu items
   $itemsToRemove = ['board_activity', 'custom_fields'];
   $menuItems = array_filter($menuItems, function($item) use ($itemsToRemove) {
       return !in_array($item['key'], $itemsToRemove);
   });
   
   // Add custom menu item
   $menuItems['my_custom_item'] = [
       'key' => 'my_custom_item',
       'label' => 'My Custom Item',
       'type' => 'custom',
       'position' => 1,
       'icon' => '<svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><path d="M8 1a7 7 0 100 14A7 7 0 008 1zM3.5 8a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0z"/></svg>',
       'html' => '<div>Custom content</div>',
       'width' => '500px'
   ];
   
   return $menuItems;
}, 10, 2);
```

**Default Menu Items Available (in order):**

1. `about_this_board` - About this Board
2. `board_activity` - Board Activity  
3. `change_background` - Change Background (managers & admins, non-archived boards)
4. `notification_settings` - Notification Settings (not for viewer-only users)
5. `board_labels` - Board Labels
6. `custom_fields` - Custom Fields (pro feature)
7. `board_members` - Board Members
8. `archived_items` - Archived Items
9. `associated_crm_contacts` - Associated CRM Contacts (if FluentCRM active)
10. `duplicate_board` - Duplicate Board (managers & admins, non-archived boards)
11. `export` - Export Board (pro feature, managers & admins, non-archived boards)
12. `archive_board` - Archive Board (managers & admins, non-archived boards)
13. `restore_board` - Restore Board (managers & admins, archived boards)
14. `delete_board` - Delete Board (admins only, archived boards)

</explain-block>

<explain-block title="fluent_boards/menu_items">
If you want to modify the menu items ( add new menu or remove/replace existing ones) in FluentBoards, you can use this filter.

**Parameters**
- `$menuItems` Array

**Usage:**
```php
/*
* Modify menu items
*/
add_filter('fluent_boards/menu_items', function($menuItems) {
   // your modification logic here

   return $menuItems;
});
```
</explain-block>
