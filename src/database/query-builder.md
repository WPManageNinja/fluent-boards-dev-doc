# FluentBoards Query Builder

## Introduction

FluentBoards ships the WPFluent database query builder. It gives you a fluent interface for building and running SQL queries against the WordPress database through `$wpdb`.

::: tip
The query builder follows the Laravel Query Builder API. If you know Laravel's query builder, you already know this one.
:::

Get a query builder with the `fluentBoardsDb()` helper. It returns the plugin's database manager (`fluentBoards('db')`), and `table()` starts a query on a table:

```php
$board = fluentBoardsDb()->table('fbs_boards')
    ->orderBy('title', 'ASC')
    ->first();
```

::: tip Table prefix
Pass table names **without** the WordPress prefix. The query builder adds `$wpdb->prefix` for you, so `table('fbs_boards')` queries `wp_fbs_boards` on a default install. The same applies to table names in joins (`users` becomes `wp_users`).
:::

::: warning Query builder vs models
The query builder works on raw rows. It does not apply model global scopes (for example, `table('fbs_boards')` returns folders too), does not fire model events or hooks, and does not serialize or unserialize columns such as `settings`. Use the [models](/database/models/) when you need that behavior.
:::


# Retrieving Results

### Retrieving All Rows From A Table
You may use the `table` method on the `fluentBoardsDb` function to begin a query. The `table` method returns a fluent query builder instance for the given table, allowing you to chain more constraints onto the query and then finally get the results using the `get` method:

```php
$tasks = fluentBoardsDb()->table('fbs_tasks')->get();
```
The `get` method returns a `FluentBoards\Framework\Support\Collection` of results, where each result is a PHP `stdClass` object. You may access each column's value by accessing the column as a property of the object:

```php
foreach ($tasks as $task) {
    echo $task->title;
    echo $task->status;
}
```

### Retrieving A Single Row / Column From A Table
If you just need to retrieve a single row from the database table, you may use the `first` method. This method will return a single stdClass object:

```php
$task = fluentBoardsDb()->table('fbs_tasks')->where('board_id', 1)->first();
 
echo $task->title;
```

If you don't even need an entire row, you may extract a single value from a record using the `value` method. This method will return the value of the column directly:
```php
$taskTitle = fluentBoardsDb()->table('fbs_tasks')->where('board_id', 1)->value('title');
```

### Retrieving A List Of Column Values
If you would like to retrieve the values of a single column, you may use the `pluck` method. It returns a collection of values. In this example, we retrieve the board titles:

```php
$boards = fluentBoardsDb()->table('fbs_boards')->pluck('title');
 
foreach ($boards as $board) {
    echo $board;
}
```

You may also specify a custom key column for the returned collection:
```php
$boards = fluentBoardsDb()->table('fbs_boards')->pluck('title', 'id');
 
foreach ($boards as $id => $title) {
    echo $title;
}
```

### Chunking Results
If you need to work with thousands of database records, consider using the `chunk` method. This method retrieves a small chunk of the results at a time and feeds each chunk into a Closure for processing. This method is useful for processing thousands of records. For example, let's work with the entire `fbs_boards` table in chunks of 10 records at a time:
```php
fluentBoardsDb()->table('fbs_boards')->orderBy('id')->chunk(10, function ($boards) {
    foreach ($boards as $board) {
        //
    }
});
```

You may stop further chunks from being processed by returning false from the Closure:
```php
fluentBoardsDb()->table('fbs_boards')->orderBy('id')->chunk(10, function ($boards) {
    // Process the records...
    
    return false;
});
```

### Aggregates
The query builder also provides a variety of aggregate methods such as `count`, `max`, `min`, `avg`, and `sum`. You may call any of these methods after constructing your query:
```php
$tasks = fluentBoardsDb()->table('fbs_tasks')->count();
```



### Determining If Records Exist
Instead of using the `count` method to determine if any records exist that match your query's constraints, you may use the `exists`:
```php
return fluentBoardsDb()->table('fbs_tasks')->where('id', 1)->exists();
```


## Selects

### Specifying A Select Clause
Of course, you may not always want to select all columns from a database table. Using the `select` method, you can specify a custom `select` clause for the query:
```php
$boards = fluentBoardsDb()->table('fbs_boards')->select('id', 'title')->get();
```

The `distinct` method allows you to force the query to return distinct results:
```php
$tasks = fluentBoardsDb()->table('fbs_tasks')->distinct()->get();
```

If you already have a query builder instance and wish to add a column to its existing select clause, you may use the `addSelect` method:
```php
$query = fluentBoardsDb()->table('fbs_tasks')->select('id');
 
$tasks = $query->addSelect('title')->get();
```


## Raw Expressions
Sometimes you may need to use a raw expression in a query. To create a raw expression, you may use the `raw` method:
```php
$tasks = fluentBoardsDb()->table('fbs_tasks')
                     ->select(fluentBoardsDb()->raw('count(*) as task_count, type'))
                     ->where('type', 'task')
                     ->groupBy('type')
                     ->get();
```

### Raw Methods
Instead of using `fluentBoardsDb()->raw`, you may also use the following methods to insert a raw expression into various parts of your query.

#### `selectRaw`
The `selectRaw` method can be used in place of `select(fluentBoardsDb()->raw(...))`. This method accepts an optional array of bindings as its second argument:
```php
$tasks = fluentBoardsDb()->table('fbs_tasks')
                ->selectRaw('comments_count as total_comments')
                ->get();
```

#### `whereRaw / orWhereRaw`
The `whereRaw` and `orWhereRaw` methods can be used to inject a raw `where` clause into your query. These methods accept an optional array of bindings as their second argument:
```php
$boards = fluentBoardsDb()->table('fbs_boards')
    ->whereRaw('LOWER(title) LIKE ?', ['%' . strtolower($query) . '%'])
    ->orWhereRaw('id LIKE ?', ['%' . $query . '%'])
    ->get();


```

#### `havingRaw / orHavingRaw`
The `havingRaw` and `orHavingRaw` methods may be used to set a raw string as the value of the `having` clause. These methods accept an optional array of bindings as their second argument:
```php
$tasks = fluentBoardsDb()->table('fbs_tasks')
                ->groupBy('type')
                ->havingRaw('SUM(comments_count) > ?', [0])
                ->get();
```

#### `orderByRaw`
The `orderByRaw` method may be used to set a raw string as the value of the `order by` clause:
```php
$tasks = fluentBoardsDb()->table('fbs_tasks')
                ->orderByRaw('updated_at - created_at DESC')
                ->get();
```


## Joins

### Inner Join Clause
The query builder may also be used to write join statements. To perform a basic "inner join", you may use the `join` method on a query builder instance. The first argument passed to the `join` method is the name of the table you need to join to, while the remaining arguments specify the column constraints for the join. Of course, as you can see, you can join to multiple tables in a single query:
```php
$boards = fluentBoardsDb()->table('fbs_boards')
            ->join('users', 'users.ID', '=', 'fbs_boards.created_by')
            ->select('fbs_boards.*', 'users.user_email')
            ->get();
```

### left Join Clause
If you would like to perform a "left join" instead of an "inner join", use the `leftJoin` method. The leftJoin method has the same signature as the join method:
```php
$boards = fluentBoardsDb()->table('fbs_boards')
            ->leftJoin('users', 'users.ID', '=', 'fbs_boards.created_by')
            ->get();
```

### Cross Join Clause
To perform a "cross join" use the `crossJoin` method with the name of the table you wish to cross join to. Cross joins generate a cartesian product between the first table and the joined table:
```php
$boards = fluentBoardsDb()->table('fbs_boards')
            ->crossJoin('users')
            ->get();
```

### Advanced Join Clauses
You may also specify more advanced join clauses. To get started, pass a `Closure` as the second argument into the `join` method. The `Closure` will receive a `JoinClause` object which allows you to specify constraints on the `join` clause:
```php
fluentBoardsDb()->table('fbs_boards')
        ->join('users', function ($join) {
            $join->on('fbs_boards.created_by', '=', 'users.ID')->orOn(...);
        })
        ->get();
```

If you would like to use a "where" style clause on your joins, you may use the `where` and `orWhere` methods on a join. Instead of comparing two columns, these methods will compare the column against a value:
```php
fluentBoardsDb()->table('fbs_boards')
        ->join('users', function ($join) {
            $join->on('fbs_boards.created_by', '=', 'users.ID')
                 ->where('users.ID', '>', 5);
        })
        ->get();
```


## Unions

The query builder also provides a quick way to "union" two queries together. For example, you may create an initial query and use the `union` method to union it with a second query:
```php
$first = fluentBoardsDb()->table('fbs_boards')
            ->whereNull('archived_at');
 
$boards = fluentBoardsDb()->table('fbs_boards')
            ->where('type', 'to-do')
            ->union($first)
            ->get();
```


## Where Clauses

### Simple Where Clauses
You may use the `where` method on a query builder instance to add `where` clauses to the query. The most basic call to where requires three arguments. The first argument is the name of the column. The second argument is an operator, which can be any of the database's supported operators. Finally, the third argument is the value to evaluate against the column.
For example, here is a query that verifies the value of the "title" column is equal to 'Fluent Boards':
```php
$boards = fluentBoardsDb()->table('fbs_boards')->where('title', '=', 'Fluent Boards')->get();
```

For convenience, if you want to verify that a column is equal to a given value, you may pass the value directly as the second argument to the where method:
```php
$boards = fluentBoardsDb()->table('fbs_boards')->where('title', 'Fluent Boards')->get();
```

Of course, you may use a variety of other operators when writing a where clause:
```php
$boards = fluentBoardsDb()->table('fbs_boards')
                ->where('type', '=', 'to-do')
                ->get();

 
$boards = fluentBoardsDb()->table('fbs_boards')
                ->where('title', 'like', 'T%')
                ->get();
```

You may also pass an array of conditions to the where function:
```php
$boards = fluentBoardsDb()->table('fbs_boards')->where([
    ['type', '=', 'to-do'],
    ['title', 'like', 'T%'],
])->get();
```

### Or Statements
You may chain where constraints together as well as add or clauses to the query. The `orWhere` method accepts the same arguments as the `where` method:
```php
$boards = fluentBoardsDb()->table('fbs_boards')
                    ->where('title', 'like', 'fluentBoards%')
                    ->orWhere('title', 'fluentBoards')
                    ->get();
```

### Additional Where Clauses
#### whereBetween
The `whereBetween` method verifies that a column's value is between two values:
```php
$tasks = fluentBoardsDb()->table('fbs_tasks')
             ->whereBetween('board_id', [1, 10])->get();
```

#### whereNotBetween
The `whereNotBetween` method verifies that a column's value lies outside two values:
```php
$tasks = fluentBoardsDb()->table('fbs_tasks')
             ->whereNotBetween('board_id', [1, 10])->get();
```

#### whereIn / whereNotIn
The `whereIn` method verifies that a given column's value is contained within the given array:
```php
$boards = fluentBoardsDb()->table('fbs_boards')
                    ->whereIn('id', [1, 2, 3])
                    ->get();
```

The `whereNotIn` method verifies that the given column's value is not contained in the given array:
```php
$boards = fluentBoardsDb()->table('fbs_boards')
                    ->whereNotIn('id', [1, 2, 3])
                    ->get();
```

#### whereNull / whereNotNull
The `whereNull` method verifies that the value of the given column is NULL:
```php
$boards = fluentBoardsDb()->table('fbs_boards')
                    ->whereNull('archived_at')
                    ->get();
```

The `whereNotNull` method verifies that the column's value is not NULL:
```php
$boards = fluentBoardsDb()->table('fbs_boards')
                    ->whereNotNull('updated_at')
                    ->get();
```

#### whereDate / whereMonth / whereDay / whereYear / whereTime
The `whereDate` method may be used to compare a column's value against a date:
```php
$boards = fluentBoardsDb()->table('fbs_boards')
                ->whereDate('created_at', '2016-12-31')
                ->get();
```

The `whereMonth` method may be used to compare a column's value against a specific month of a year:
```php
$boards = fluentBoardsDb()->table('fbs_boards')
                ->whereMonth('created_at', '12')
                ->get();
```

The `whereDay` method may be used to compare a column's value against a specific day of a month:
```php
$boards = fluentBoardsDb()->table('fbs_boards')
                ->whereDay('created_at', '21')
                ->get();
```

The `whereYear` method may be used to compare a column's value against a specific year:
```php
$boards = fluentBoardsDb()->table('fbs_boards')
                ->whereYear('created_at', '2022')
                ->get();
```

The `whereTime` method may be used to compare a column's value against a specific time:
```php
$boards = fluentBoardsDb()->table('fbs_boards')
                ->whereTime('created_at', '11:20:45')
                ->get();
```

#### whereColumn
The `whereColumn` method verifies that two columns are equal, or compares them with an operator:
```php
$boards = fluentBoardsDb()->table('fbs_boards')
                ->whereColumn('updated_at', 'created_at')
                ->get();
```

You may also pass a comparison operator to the method:
```php
$boards = fluentBoardsDb()->table('fbs_boards')
                 ->whereColumn('updated_at', '>', 'created_at')
                ->get();
```

The `whereColumn` method can also be passed an array of multiple conditions. These conditions will be joined using the and operator:
```php
$boards = fluentBoardsDb()->table('fbs_boards')
                 ->whereColumn([
                    ['updated_at', '>', 'created_at'],
                    ['archived_at', '>', 'created_at']
                ])->get();
```

#### whereExists
The `whereExists` method lets you write `where exists` SQL clauses. It accepts a Closure that receives a query builder for the subquery:
```php
$tasks = fluentBoardsDb()->table('fbs_tasks')
            ->whereExists(function ($query) {
                $query->select(fluentBoardsDb()->raw(1))
                      ->from('fbs_boards')
                      ->whereColumn('fbs_boards.id', 'fbs_tasks.board_id');
            })
            ->get();
```

The query above will produce the following SQL (shown without the table prefix):
```sql
select * from fbs_tasks
where exists (
    select 1 from fbs_boards where fbs_boards.id = fbs_tasks.board_id
)
```


### Ordering, Grouping, Limit, & Offset

#### orderBy
The `orderBy` method allows you to sort the result of the query by a given column. The first argument to the `orderBy` method should be the column you wish to sort by, while the second argument controls the direction of the sort and may be either `asc` or `desc`:
```php
$boards = fluentBoardsDb()->table('fbs_boards')
                 ->orderBy('created_at', 'DESC')
                ->get();
```

#### latest / oldest
The `latest` and `oldest` methods allow you to easily order results by date. By default, result will be ordered by the `created_at` column. Or, you may pass the column name that you wish to sort by:
```php
$boards = fluentBoardsDb()->table('fbs_boards')
                 ->latest()
                ->get();
```

#### inRandomOrder
The `inRandomOrder` method may be used to sort the query results randomly:
```php
$boards = fluentBoardsDb()->table('fbs_boards')
                 ->inRandomOrder()
                ->get();
```

#### groupBy / having
The `groupBy` and `having` methods may be used to group the query results. The `having` method's signature is similar to that of the `where` method:
```php
$stats = fluentBoardsDb()->table('fbs_tasks')
                ->select('board_id', fluentBoardsDb()->raw('COUNT(*) as total'))
                ->groupBy('board_id')
                ->having('total', '>', 10)
                ->get();
```
You may pass multiple arguments to the `groupBy` method to group by multiple columns:
```php
$stats = fluentBoardsDb()->table('fbs_tasks')
                ->select('board_id', 'status', fluentBoardsDb()->raw('COUNT(*) as total'))
                ->groupBy('board_id', 'status')
                ->get();
```

#### skip / take
To limit the number of results returned from the query, or to skip a given number of results in the query, you may use the `skip` and `take` methods:
```php
$boards = fluentBoardsDb()->table('fbs_boards')
                ->skip(10)
                ->take(5)
                ->get();
```
Alternatively, you may use the `limit` and `offset` methods:
```php
$boards = fluentBoardsDb()->table('fbs_boards')
                ->limit(10)
                ->offset(5)
                ->get();
```


### Conditional Clauses
Sometimes you may want clauses to apply to a query only when something else is true. For instance, you may only want to apply a `where` statement if a given input value is present on the incoming request. You may accomplish this using `when` method:
```php
$userId = isset($_GET['user_id']) ? absint($_GET['user_id']) : 0;
 
$boards = fluentBoardsDb()->table('fbs_boards')
                ->when($userId, function ($query, $userId) {
                    return $query->where('created_by', $userId);
                })
                ->get();
```
The `when` method only executes the given `Closure` when the first parameter is truthy. If it is falsy, the Closure is not executed.

You may pass another Closure as the third parameter to the `when` method. This Closure will execute if the first parameter evaluates as falsy. To illustrate how this feature may be used, we will use it to configure the default sorting of a query:
```php
$sortBy = null;
 
$boards = fluentBoardsDb()->table('fbs_boards')
                ->when($sortBy, function ($query, $sortBy) {
                    return $query->orderBy($sortBy);
                }, function ($query) {
                    return $query->orderBy('created_at');
                })
                ->get();
```


### Inserts

The query builder also provides an `insert` method for inserting records into the database table. The `insert` method accepts an array of column names and values. It does not set `created_at` / `updated_at` or any model defaults, so pass every required column yourself:
```php
fluentBoardsDb()->table('fbs_boards')->insert(
    ['title' => 'Board 1', 'description' => 'This is board 1', 'type' => 'to-do', 'created_by' => get_current_user_id()]
);
```
You may even insert several records into the table with a single call to `insert` by passing an array of arrays. Each array represents a row to be inserted into the table:
```php
fluentBoardsDb()->table('fbs_boards')->insert([
    ['title' => 'Board 1', 'description' => 'This is board 1', 'type' => 'to-do', 'created_by' => 1],
    ['title' => 'Board 2', 'description' => 'This is board 2', 'type' => 'to-do', 'created_by' => 1],
]);
```

#### Auto-Incrementing IDs
If the table has an auto-incrementing id, use the `insertGetId` method to insert a record and then retrieve the ID:
```php
$boardId = fluentBoardsDb()->table('fbs_boards')->insertGetId(
    ['title' => 'Board 1', 'description' => 'This is board 1', 'type' => 'to-do', 'created_by' => 1]
);
```


### Updates

Of course, in addition to inserting records into the database, the query builder can also update existing records using the `update` method. The `update` method, like the `insert` method, accepts an array of column and value pairs containing the columns to be updated. You may constrain the `update` query using `where` clauses:
```php
fluentBoardsDb()->table('fbs_boards')
            ->where('id', 1)
            ->update(['title' => 'Board no. 1']);
```


### Increment & Decrement

The query builder also provides convenient methods for incrementing or decrementing the value of a given column. This is a shortcut, providing a more expressive and terse interface compared to manually writing the `update` statement.

Both of these methods accept at least one argument: the column to modify. A second argument may optionally be passed to control the amount by which the column should be incremented or decremented:
```php
fluentBoardsDb()->table('fbs_tasks')->where('id', 42)->increment('comments_count');
 
fluentBoardsDb()->table('fbs_tasks')->where('id', 42)->increment('comments_count', 5);
 
fluentBoardsDb()->table('fbs_tasks')->where('id', 42)->decrement('comments_count');
 
fluentBoardsDb()->table('fbs_tasks')->where('id', 42)->decrement('comments_count', 5);
```
You may also specify additional columns to update during the operation:
```php
fluentBoardsDb()->table('fbs_tasks')
    ->where('id', 42)
    ->increment('comments_count', 1, ['updated_at' => current_time('mysql')]);
```


### Deletes

The query builder may also be used to delete records from the table via the `delete` method. You may constrain delete statements by adding where clauses before calling the `delete` method:
```php
fluentBoardsDb()->table('fbs_tasks')->where('id', 42)->delete();
 
fluentBoardsDb()->table('fbs_tasks')->whereNotNull('archived_at')->delete();
```
Deleting rows this way does not remove related rows (comments, meta, relations, attachments). Use the FluentBoards services or models when you need a full cleanup.

If you wish to truncate the entire table, which will remove all rows and reset the auto-incrementing ID to zero, you may use the `truncate` method. This permanently deletes all FluentBoards data in that table:
```php
fluentBoardsDb()->table('fbs_tasks')->truncate();
```
