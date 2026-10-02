# TimeTrack Model

<Badge type="warning" text="Pro" />

| DB Table Name | `{wp_db_prefix}fbs_time_tracks` |
|---------------|---------------------------------|
| Schema        | [Check Schema](/database/#fbs-time-tracks-table) |
| Source File   | fluent-boards-pro/app/Modules/TimeTracking/Model/TimeTrack.php |
| Name Space    | FluentBoardsPro\App\Modules\TimeTracking\Model |
| Class         | FluentBoardsPro\App\Modules\TimeTracking\Model\TimeTrack |

A time tracking entry from the Pro Time Tracking module. The table is created when the module is first enabled, so check that the module is on before you query it.

### Model events

- **creating:** defaults `user_id` to the current user, and `started_at` / `completed_at` to the current time.
- **updating:** defaults `completed_at` to the current time when it is empty.

## Attributes

| Attribute | Data Type | Comment |
|---|---|---|
| id | INT UNSIGNED | Primary key |
| user_id | BIGINT UNSIGNED | User who tracked the time |
| board_id | INT UNSIGNED | Board ID |
| task_id | INT UNSIGNED | Task ID |
| started_at | TIMESTAMP NULL | Start time |
| completed_at | TIMESTAMP NULL | End time |
| message | TEXT NULL | Note |
| status | VARCHAR(50) NULL | Saved as `commited` (spelled this way) |
| working_minutes | INT UNSIGNED | Cast to `int` |
| billable_minutes | INT UNSIGNED | Cast to `int` |
| is_manual | TINYINT(1) | Cast to `int`. `1` for manual entries |
| created_at | TIMESTAMP NULL | |
| updated_at | TIMESTAMP NULL | |

Fillable: `user_id`, `board_id`, `task_id`, `started_at`, `completed_at`, `status`, `working_minutes`, `billable_minutes`, `is_manual`, `message`.

The model overrides `getDirty()` so that only fillable attributes count as changed when saving.

## Usage

Please check [Model Basic](/database/models/) for common methods.

```php
use FluentBoardsPro\App\Modules\TimeTracking\Model\TimeTrack;

TimeTrack::create([
    'board_id'         => 1,
    'task_id'          => 42,
    'working_minutes'  => 90,
    'billable_minutes' => 60,
    'is_manual'        => 1,
    'status'           => 'commited',
    'message'          => 'Design review',
]);

// Total minutes logged on a task
$minutes = TimeTrack::where('task_id', 42)->sum('working_minutes');
```

## Relations

### user

- Returns `FluentBoards\App\Models\User`

### board

- Returns `FluentBoards\App\Models\Board`

### task

- Returns `FluentBoards\App\Models\Task`

```php
$entries = TimeTrack::with(['user', 'task'])
    ->where('board_id', 1)
    ->orderBy('id', 'DESC')
    ->get();
```

## Methods

### getWorkingSeconds()

Returns `working_minutes * 60`. When `status` is `active`, also adds the seconds elapsed since `started_at`.

- Returns `int`

```php
$seconds = $entry->getWorkingSeconds();
```
