# FluentBoards Query Builder


## Introduction
Fluent's database query builder provides a convenient, fluent interface to creating and running database queries. It can be used to perform most database operations in your application.

::: tip

Our Query Builder is compatible the PHP Laravel Framework's Query Builder. If you are familiar with Laravel's Query Builder, you will feel right at home using the FluentBoards' Query Builder.
:::
### Example
Here is an example Fluent Query Builder 

```php
$query = fluentBoardsDb()->table('fbs_boards')
            ->orderBy('title', 'ASC')
            ->first();
```


# Retrieving Results

### Retrieving All Rows From A Table
You may use the `table` method on the `fluentBoardsDb` function to begin a query. The `table` method returns a fluent query builder instance for the given table, allowing you to chain more constraints onto the query and then finally get the results using the `get` method:

```php
<?php
 
namespace FluentBoards\App\Http\Controllers;
 
class TaskController extends Controller
{
    /**
     * Show a list of all the tasks
     *
     * @return Response
     */
    public function index()
    {
        $tasks = fluentBoardsDb()->table('fbs_tasks')->get();
 
        return [
            'tasks' => $tasks
        ];   
    }
}
```
The `get` method returns an array containing the results where each result is an instance of the PHP stdClass object. You may access each column's value by accessing the column as a property of the object:

```php
foreach ($tasks as $task) {
    echo $task->title;
    echo $task->status;
}
```

### Retrieving A Single Row / Column From A Table
If you just need to retrieve a single row from the database table, you may use the `first` method. This method will return a single stdClass object:

```php
$task = FluentBoardsDb()->table('fbs_tasks')->where('board_id', 1)->first();
 
echo $task->title;
```

If you don't even need an entire row, you may extract a single value from a record using the `value` method. This method will return the value of the column directly:
```php
$taskTitle = FluentBoardsDb()->table('fbs_tasks')->where('board_id', 1)->value('title');
```

### Retrieving A List Of Column Values
If you would like to retrieve an array containing the values of a single column, you may use the `pluck` method. In this example, we'll retrieve an array of title:

```php
$boards = FluentBoardsDb()->table('fbs_boards')->pluck('title');
 
foreach ($boards as $board) {
    echo $board;
}
```

You may also specify a custom key column for the returned Collection:
```php
$boards = FluentBoardsDb()->table('fbs_boards')->pluck('title', 'id');
 
foreach ($boards as $id => $title) {
    echo $title;
}
```

### Chunking Results
If you need to work with thousands of database records, consider using the `chunk` method. This method retrieves a small chunk of the results at a time and feeds each chunk into a Closure for processing. This method is very useful for process thousands of records. For example, let's work with the entire `fbs_boards` table in chunks of 10 records at a time:
```php
FluentBoardsDb()->table('fbs_boards')->orderBy('id')->chunk(10, function ($boards) {
    foreach ($boards as $board) {
        //
    }
});
```

You may stop further chunks from being processed by returning false from the Closure:
```php
FluentBoardsDb()->table('fbs_boards')->orderBy('id')->chunk(10, function ($boards) {
    // Process the records...
    
    return false;
});
```

### Aggregates
The query builder also provides a variety of aggregate methods such as `count`, `max`, `min`, `avg`, and `sum`. You may call any of these methods after constructing your query:
```php
$tasks = FluentBoardsDb()->table('fbs_tasks')->count();
```



### Determining If Records Exist
Instead of using the `count` method to determine if any records exist that match your query's constraints, you may use the `exists`:
```php
return FluentBoardsDb()->table('fbs_tasks')->where('id', 1)->exists();
```


## Selects

### Specifying A Select Clause
Of course, you may not always want to select all columns from a database table. Using the `select` method, you can specify a custom `select` clause for the query:
```php
$boards = FluentBoardsDb()->table('fbs_boards')->select('id', 'title')->get();
```

The `distinct` method allows you to force the query to return distinct results:
```php
$tasks = FluentBoardsDb()->table('fbs_tasks')->distinct()->get();
```

If you already have a query builder instance and wish to add a column to its existing select clause, you may use the `addSelect` method:
```php
$query = FluentBoardsDb()->table('fbs_tasks')->select('id');
 
$tasks = $query->addSelect('title')->get();
```


## Raw Expressions
Sometimes you may need to use a raw expression in a query. To create a raw expression, you may use the `raw` method:
```php
$tasks = FluentBoardsDb()->table('fbs_tasks')
                     ->select(FluentBoardsDb()->raw('count(*) as comments_count, type'))
                     ->where('type', 'task')
                     ->groupBy('type')
                     ->get();
```

### Raw Methods
Instead of using `FluentBoardsDb()->raw`, you may also use the following methods to insert a raw expression into various parts of your query.

#### `selectRaw`
The `selectRaw` method can be used in place of `select(FluentBoardsDb()->raw(...))`. This method accepts an optional array of bindings as its second argument:
```php
$tasks = FluentBoardsDb()->table('fbs_tasks')
                ->selectRaw('comments_count as total_comments')
                ->get();
```

#### `whereRaw / orWhereRaw`
The `whereRaw` and `orWhereRaw` methods can be used to inject a raw `where` clause into your query. These methods accept an optional array of bindings as their second argument:
```php
$boards = FluentBoardsDb()->table('fbs_boards')
    ->whereRaw('LOWER(title) LIKE ?', ['%' . strtolower($query) . '%'])
    ->orWhereRaw('id LIKE ?', ['%' . $query . '%'])
    ->get();


```

#### `havingRaw / orHavingRaw`
The `havingRaw` and `orHavingRaw` methods may be used to set a raw string as the value of the `having` clause. These methods accept an optional array of bindings as their second argument:
```php
$tasks = FluentBoardsDb()->table('fbs_tasks')
                ->groupBy('type')
                ->havingRaw('SUM(comments_count) > ?', [0])
                ->get();
```

#### `orderByRaw`
The `orderByRaw` method may be used to set a raw string as the value of the `order by` clause:
```php
$tasks = FluentBoardsDb()->table('fbs_tasks')
                ->orderByRaw('updated_at - created_at DESC')
                ->get();
```


## Joins

### Inner Join Clause
The query builder may also be used to write join statements. To perform a basic "inner join", you may use the `join` method on a query builder instance. The first argument passed to the `join` method is the name of the table you need to join to, while the remaining arguments specify the column constraints for the join. Of course, as you can see, you can join to multiple tables in a single query:
```php
$boards = FluentBoardsDb()->table('fbs_boards')
            ->join('users', 'users.id', '=', 'fbs_boards.created_by')
            ->select('fbs_boards.*', 'users.user_email')
            ->get();
```

### left Join Clause
If you would like to perform a "left join" instead of an "inner join", use the `leftJoin` method. The leftJoin method has the same signature as the join method:
```php
$boards = FluentBoardsDb()->table('fbs_boards')
            ->leftJoin('users', 'users.ID', '=', 'fbs_boards.created_by')
            ->get();
```

### Cross Join Clause
To perform a "cross join" use the `crossJoin` method with the name of the table you wish to cross join to. Cross joins generate a cartesian product between the first table and the joined table:
```php
$boards = FluentBoardsDb()->table('fbs_boards')
            ->crossJoin('users')
            ->get();
```

### Advanced Join Clauses
You may also specify more advanced join clauses. To get started, pass a `Closure` as the second argument into the `join` method. The `Closure` will receive a `JoinClause` object which allows you to specify constraints on the `join` clause:
```php
FluentBoardsDb()->table('fbs_boards')
        ->join('users', function ($join) {
            $join->on('fbs_boards.created_by', '=', 'users.ID')->orOn(...);
        })
        ->get();
```

If you would like to use a "where" style clause on your joins, you may use the `where` and `orWhere` methods on a join. Instead of comparing two columns, these methods will compare the column against a value:
```php
FluentBoardsDb()->table('fbs_boards')
        ->join('users', function ($join) {
            $join->on('fbs_boards.created_by', '=', 'users.ID')
                 ->where('users.ID', '>', 5);
        })
        ->get();
```


## Unions

The query builder also provides a quick way to "union" two queries together. For example, you may create an initial query and use the `union` method to union it with a second query:
```php
$first = FluentBoardsDb()->table('fbs_boards')
            ->whereNull('archived_at');
 
$boards = FluentBoardsDb()->table('fbs_boards')
            ->where('type', 'to-do')
            ->union($first)
            ->get();
```


## Where Clauses

### Simple Where Clauses
You may use the `where` method on a query builder instance to add `where` clauses to the query. The most basic call to where requires three arguments. The first argument is the name of the column. The second argument is an operator, which can be any of the database's supported operators. Finally, the third argument is the value to evaluate against the column.
For example, here is a query that verifies the value of the "title" column is equal to 'Fluent Boards':
```php
$boards = FluentBoardsDb()->table('fbs_boards')->where('title', '=', 'Fluent Boards')->get();
```

For convenience, if you want to verify that a column is equal to a given value, you may pass the value directly as the second argument to the where method:
```php
$boards = FluentBoardsDb()->table('fbs_boards')->where('title', 'Fluent Boards')->get();
```

Of course, you may use a variety of other operators when writing a where clause:
```php
$boards = FluentBoardsDb()->table('fbs_boards')
                ->where('type', '=', 'to-do')
                ->get();

 
$boards = FluentBoardsDb()->table('fbs_boards')
                ->where('title', 'like', 'T%')
                ->get();
```

You may also pass an array of conditions to the where function:
```php
$boards = FluentBoardsDb()->table('fbs_boards')->where([
    ['type', '=', 'to-do'],
    ['title', 'like', 'T%'],
])->get();
```

### Or Statements
You may chain where constraints together as well as add or clauses to the query. The `orWhere` method accepts the same arguments as the `where` method:
```php
$boards = FluentBoardsDb()->table('fbs_boards')
                    ->where('title', 'like', 'fluentBoards%')
                    ->orWhere('title', 'fluentBoards')
                    ->get();
```

### Additional Where Clauses
#### whereBetween
The `whereBetween` method verifies that a column's value is between two values:
```php
$tasks = FluentBoardsDb()->table('fbs_tasks')
             ->whereBetween('board_id', [1, 10])->get();
```

#### whereNotBetween
The `whereNotBetween` method verifies that a column's value lies outside two values:
```php
$tasks = FluentBoardsDb()->table('fbs_tasks')
             ->whereNotBetween('board_id', [1, 10])->get();
```

#### whereIn / whereNotIn
The `whereIn` method verifies that a given column's value is contained within the given array:
```php
$boards = FluentBoardsDb()->table('fbs_boards')
                    ->whereIn('id', [1, 2, 3])
                    ->get();
```

The `whereNotIn` method verifies that the given column's value is not contained in the given array:
```php
$boards = FluentBoardsDb()->table('fbs_boards')
                    ->whereNotIn('id', [1, 2, 3])
                    ->get();
```

#### whereNull / whereNotNull
The `whereNull` method verifies that the value of the given column is NULL:
```php
$boards = FluentBoardsDb()->table('fbs_boards')
                    ->whereNull('archived_at')
                    ->get();
```

The `whereNotNull` method verifies that the column's value is not NULL:
```php
$boards = FluentBoardsDb()->table('fbs_boards')
                    ->whereNotNull('updated_at')
                    ->get();
```

#### whereDate / whereMonth / whereDay / whereYear / whereTime
The `whereDate` method may be used to compare a column's value against a date:
```php
$boards = FluentBoardsDb()->table('fbs_boards')
                ->whereDate('created_at', '2016-12-31')
                ->get();
```

The `whereMonth` method may be used to compare a column's value against a specific month of a year:
```php
$boards = FluentBoardsDb()->table('fbs_boards')
                ->whereMonth('created_at', '12')
                ->get();
```

The `whereDay` method may be used to compare a column's value against a specific day of a month:
```php
$boards = FluentBoardsDb()->table('fbs_boards')
                ->whereDay('created_at', '21')
                ->get();
```

The `whereYear` method may be used to compare a column's value against a specific year:
```php
$boards = FluentBoardsDb()->table('fbs_boards')
                ->whereYear('created_at', '2022')
                ->get();
```

The `whereTime` method may be used to compare a column's value against a specific time:
```php
$boards = FluentBoardsDb()->table('fbs_boards')
                ->whereTime('created_at', '11:20:45')
                ->get();
```

The `whereTimestamp` method may be used to compare a column's value against a specific time:
```php
$boards = FluentBoardsDb()->table('fbs_boards')
                ->whereTimestamp('created_at', '2022-11-21 11:20:45')
                ->get();
```

You may also pass a comparison operator to the method:
```php
$boards = FluentBoardsDb()->table('fbs_boards')
                 ->whereColumn('updated_at', '>', 'created_at')
                ->get();
```

The `whereColumn` method can also be passed an array of multiple conditions. These conditions will be joined using the and operator:
```php
$boards = FluentBoardsDb()->table('fbs_boards')
                 ->whereColumn([
                    ['title', '=', 'Fluent Boards'],
                    ['updated_at', '>', 'created_at']
                ])->get();
```


The query above will produce the following SQL:
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
$boards = FluentBoardsDb()->table('fbs_boards')
                 ->orderBy('created_at', 'DESC')
                ->get();
```

#### latest / oldest
The `latest` and `oldest` methods allow you to easily order results by date. By default, result will be ordered by the `created_at` column. Or, you may pass the column name that you wish to sort by:
```php
$boards = FluentBoardsDb()->table('fbs_boards')
                 ->latest()
                ->get();
```

#### inRandomOrder
The `inRandomOrder` method may be used to sort the query results randomly. For example, you may use this method to fetch a random user:
```php
$boards = FluentBoardsDb()->table('fbs_boards')
                 ->inRandomOrder()
                ->get();
```

#### groupBy / having
The `groupBy` and `having` methods may be used to group the query results. The `having` method's signature is similar to that of the `where` method:
```php
$boards = FluentBoardsDb()->table('fbs_boards')
                ->groupBy('id')
                ->having('id', '>', 10)
                ->get();
```
You may pass multiple arguments to the `groupBy` method to group by multiple columns:
```php
$boards = FluentBoardsDb()->table('fbs_boards')
                ->groupBy('id', 'type')
                ->having('id', '>', 100)
                ->get();
```

#### skip / take
To limit the number of results returned from the query, or to skip a given number of results in the query, you may use the `skip` and `take` methods:
```php
$boards = FluentBoardsDb()->table('fbs_boards')
                ->skip(10)
                ->take(5)
                ->get();
```
Alternatively, you may use the `limit` and `offset` methods:
```php
$boards = FluentBoardsDb()->table('fbs_boards')
                ->limit(10)
                ->offset(5)
                ->get();
```


### Conditional Clauses
Sometimes you may want clauses to apply to a query only when something else is true. For instance, you may only want to apply a `where` statement if a given input value is present on the incoming request. You may accomplish this using `when` method:
```php
$user = $request->get('user');
 
$boards = FluentBoardsDb()->table('fbs_boards')
                ->when($user, function ($query, $user) {
                    return $query->where('created_by', $user.ID);
                })
                ->get();
```
The `when` method only executes the given `Closure` when the first parameter is `true`. If the first parameter is `false`, the Closure will not be executed.

You may pass another Closure as the third parameter to the `when` method. This Closure will execute if the first parameter evaluates as `false`. To illustrate how this feature may be used, we will use it to configure the default sorting of a query:
```php
$sortBy = null;
 
$boards = FluentBoardsDb()->table('fbs_boards')
                ->when($sortBy, function ($query, $sortBy) {
                    return $query->orderBy($sortBy);
                }, function ($query) {
                    return $query->orderBy('created_at');
                })
                ->get();
```


### Inserts

The query builder also provides an `insert` method for inserting records into the database table. The `insert` method accepts an array of column names and values:
```php
FluentBoardsDb()->table('fbs_boards')->insert(
    ['title' => 'Board 1', 'description' => 'This is board 1', 'type' => 'to-do']
);
```
You may even insert several records into the table with a single call to `insert` by passing an array of arrays. Each array represents a row to be inserted into the table:
```php
FluentBoardsDb()->table('fbs_boards')->insert([
    ['title' => 'Board 1', 'description' => 'This is board 1', 'type' => 'to-do'],
    ['title' => 'Board 2', 'description' => 'This is board 2', 'type' => 'to-do'],
]);
```

#### Auto-Incrementing IDs
If the table has an auto-incrementing id, use the `insertGetId` method to insert a record and then retrieve the ID:
```php
FluentBoardsDb()->table('fbs_boards')->insertGetId(
    ['title' => 'Board 1', 'description' => 'This is board 1']
);
```


### Updates

Of course, in addition to inserting records into the database, the query builder can also update existing records using the `update` method. The `update` method, like the `insert` method, accepts an array of column and value pairs containing the columns to be updated. You may constrain the `update` query using `where` clauses:
```php
FluentBoardsDb()->table('fbs_boards')
            ->where('id', 1)
            ->update(['title' => 'Board no. 1']);
```


### Increment & Decrement

The query builder also provides convenient methods for incrementing or decrementing the value of a given column. This is a shortcut, providing a more expressive and terse interface compared to manually writing the `update` statement.

Both of these methods accept at least one argument: the column to modify. A second argument may optionally be passed to control the amount by which the column should be incremented or decremented:
```php
FluentBoardsDb()->table('fbs_tasks')->increment('comments_count');
 
FluentBoardsDb()->table('fbs_tasks')->increment('comments_count', 5);
 
FluentBoardsDb()->table('fbs_tasks')->decrement('comments_count');
 
FluentBoardsDb()->table('fbs_tasks')->decrement('comments_count', 5);
```
You may also specify additional columns to update during the operation:
```php
FluentBoardsDb()->table('fbs_tasks')->increment('comments_count', 1, ['comments_count' => '5']);
```


### Deletes

The query builder may also be used to delete records from the table via the `delete` method. You may constrain delete statements by adding where clauses before calling the `delete` method:
```php
FluentBoardsDb()->table('fbs_tasks')->delete();
 
FluentBoardsDb()->table('fbs_tasks')->where('comments_count', '>', 5)->delete();
```
If you wish to truncate the entire table, which will remove all rows and reset the auto-incrementing ID to zero, you may use the `truncate` method:
```php
FluentBoardsDb()->table('fbs_tasks')->truncate();
```
