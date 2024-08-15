# FluentCRM Action Hooks

<Badge type="tip" vertical="top" text="FluentCRM Core" /> <Badge type="warning" vertical="top" text="Intermediate" />

FluentCRM has many interesting filter hooks that let developers change default settings and even extend FluentCRM with
new functionality.

## What are Action Hooks

Action hooks are used to run custom code when certain events occur.
 
## Available of Action Hooks in FluentCRM

### Board Specific
<hr />

::: details fluent_boards/board_created
This action runs when a board has been created

**Parameters**
- `$board` Board Model

**Usage:**
```php 
add_action('fluent_boards/board_created', function($board) {
   // Do whatever you want
}, 10, 2);
```
:::

::: details fluent_boards/board_find
This action runs when a board is invoked

**Parameters**
- `$board` Board Model

**Usage:**
```php 
add_action('fluent_boards/board_find', function($board) {
   // Do whatever you want
}, 10, 2);
```
:::

### Admin App & View Specific
<hr />

::: details fluent_crm/admin_app
After Main FluentCRM Admin View

**Usage:**
```php 
add_action('fluent_crm/admin_app', function() {
   echo 'My Custom Content Here';
});
```
:::

### Email Template Design Specific
<hr />

::: details fluent_crm/email_header
If you want to add your own custom CSS for a specific email template or all email template then you can use this hook.

**Parameters**
- `$designSlug` String - Design Name (classic | plain | raw_classic | simple)

**Usage:**
```php 
/*
* Add Custom CSS for plain design type
*/
add_action('fluent_crm/email_header', function($designName) {
   if($designName == 'plain') {
    ?>
    <style>
      h1 {
        color: red;
      }
    </style>
    <?php
   }
});
```
:::

### Double Optin Confirmation Page Actions
<hr />

!!!include(./src/hooks/actions/_double_optin_page.md)!!!

### Manage Subscriptions Page Actions
<hr />

!!!include(./src/hooks/actions/_manage_subscription_page.md)!!!

### Unsubscribe Page Actions
<hr />

!!!include(./src/hooks/actions/_unsubscribe_page_actions.md)!!!

### View On Browser Page Actions

<hr />

!!!include(./src/hooks/actions/_view_on_browser_page_actions.md)!!!

### Fluent Forms - Contact Specific
<hr />

::: details fluent_crm/contact_added_by_fluentform
This action runs when a contact has been added via Fluent Forms

**Parameters**
- `$subscriber` Subscriber Model
- `$entry` Array
- `$form` Object
- `$feed` Array

**Usage:**
```php 
add_action('fluent_crm/contact_added_by_fluentform', function($subscriber, $entry, $form, $feed) {
   // Do whatever you want with the $subscriber created by Fluent Forms
}, 10, 4);
```
:::

::: details fluent_crm/contact_updated_by_fluentform
This action runs when a contact has been updated via Fluent Forms

**Parameters**
- `$subscriber` Subscriber Model
- `$entry` Array
- `$form` Object
- `$feed` Array

**Usage:**
```php 
add_action('fluent_crm/contact_updated_by_fluentform', function($subscriber, $entry, $form, $feed) {
   // Do whatever you want with the $subscriber updated via Fluent Forms
}, 10, 4);
```
:::


fluent_boards/board_created