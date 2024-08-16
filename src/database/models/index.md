# Database Model Basic

## Introduction
FluentBoards ORM provides a beautiful, simple ActiveRecord implementation for working with database tables. Each database table has a corresponding "Model" which is used to interact with that table. Models allow you to query for data in db tables, as well as insert new records into the table.

::: warning NOTE
FluentBoards offers helper functions and methods to interact with FluentBoards's database so you may use those things instead of Models directly. We are documenting these for our internal usage and very-high level usage by 3rd-party developers.
:::


## Built-in FluentBoards DB Models
All the built-in database models are available at

- `fluent-boards/app/Models/` (Free version)
- `fluent-boards-pro/app/Models/` (Pro version)

In this Article we will use `FluentBoards\App\Models\Board` model as an example.

## Retrieving Models
Think of each Eloquent model as a powerful query builder allowing you to fluently query the database table associated with the model. For example:

```php
<?php
 
$boards = FluentBoards\App\Models\Board::all();
 
foreach ($boards as $board) {
    echo $board->title;
}

```

### Adding Additional Constraints

The ORM all method will return all of the results in the model's table. Since each model serves as a query builder, you may also add constraints to queries, and then use the get method to retrieve the results:

```php 
$boards = FluentBoards\App\Models\Boards::where('type', 'to-do')
               ->orderBy('created_at', 'DESC')
               ->limit(10)
               ->skip(5)
               ->get();
```

## Retrieving Single Models / Aggregates

Of course, in addition to retrieving all of the records for a given table, you may also retrieve single records using find or first. Instead of returning a collection of models, these methods return a single model instance:

```php
// Retrieve a model by its primary key...
$board = FluentBoards\App\Models\Board::find(1);
 
// Retrieve the first model matching the query constraints...
$board = FluentBoards\App\Models\Board::where('type', 'to-do')->first();
```

You may also call the find method with an array of primary keys, which will return a collection of the matching records:

```php
$boards = FluentBoards\App\Models\Board::find([1,2,3]);
 ```

## Retrieving Aggregates

You may also use the count, sum, max, and other aggregate methods available. These methods return the appropriate scalar value instead of a full model instance:
```php
$count = FluentBoards\App\Models\Board::where('type', 'to-do')->count();

$max = FluentBoards\App\Models\Board::where('type', 'to-do')->max('id');
```

Available aggregate methods such as `count`, `max`, `min`, `avg`, and `sum`.


# Inserting & Updating Models

## Inserts
To create a new record in the database, create a new model instance, set attributes on the model, then call the save method:

```php 
$board = FluentBoards\App\Models\Board::create([
        'title' => 'My First Board',
        'description'  => 'This is my first board',    
]);
```

## Updates

You can update a model few different way. You can assign property and then call `save()` method

```php 
$board = FluentBoards\App\Models\Board::find(1);

$board->title = 'Updated Title';
$board->description = 'Updated Description';
$board->save();
```

You can also update with an array

```php 
$board = FluentBoards\App\Models\Board::find(1);

$board->update([
    'title' => 'Updated Title',
    'last_name' => 'Updated Description'
]);
```

# Accessing Attributes

You can just call the database table column name for accessing the attributes

```php 
$board = FluentBoards\App\Models\Board::find(1);

$title = $board->title;
$description = $board->description;
```

# Deleting Models

To delete a model, call the delete method on a model instance:

```php 
  $board = FluentBoards\App\Models\Board::find(1);
  $board->delete();
```

### Deleting Models By Query

Of course, you may also run a delete statement on a set of models. In this example, we will delete all flights that are marked as inactive. Like mass updates, mass deletes will not fire any model events for the models that are deleted:

```php
FluentBoards\App\Models\Board::where('type', 'to-do')->delete();
```

# Query Scopes
Scopes allow you to define common sets of constraints that you may easily re-use throughout application. For example, you may need to frequently retrieve all boards by given types.In FluentBoards Board model we already have this scope defined like this.

```php

    /**
     * Local scope to filter boards by search/query string
     * @param \FluentBoards\Framework\Database\Query\Builder $query
     * @param array $types
     * @return \FluentBoards\Framework\Database\Query\Builder $query
     */
    public function scopeFilterByType($query, $types)
    {
        if ($types) {
            $query->whereIn('type', $types);
        }

        return $query;
    }

```

Now say you want to get boards where types equal to-do and roadmap

```php 
$boards = FluentBoards\App\Models\Board::filterByType(['type', 'to-do'])->get();
```
Please note that, the first letter will be small case.

In the individual model documentation, you will find which FluentBoards models have scopes.

# Relationships
Database tables are often related to one another. For example, a board has multiple tasks, or multiple stages. FluentBoards ORM makes managing and working with these relationships easy.
Each Model has predefined relationships and you will find those in the individual model documentation.

```php 

$board = FluentBoards\App\Models\Board::find(1);

// These will return corresponding Tag and List collection
$tasks = $board->tasks;
$stage = $board->stages;

```

For a single relation like and `Task` belongs to a board

```php 

$task = FluentBoards\App\Models\Task::find(1);
$board = $task->board; // will return FluentBoards\App\Models\Board
```
