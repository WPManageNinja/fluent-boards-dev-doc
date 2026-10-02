# Reports

Aggregated data behind the **Reports** screens: overview, tasks, activity, roadmap and timesheet. Every report is limited to the boards the current user can access. Plugin source: free (overview, tasks, activity); the roadmap and timesheet reports need Fluent Boards Pro and return `403` (`This is a pro feature`) without it.

All endpoints require a FluentBoards user (a global admin or a member of at least one board).

## Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/reports/overview` | Task totals, priority, completion, due dates, workload |
| GET | `/reports/tasks` | Tasks by stage, assignee and label; recently completed |
| GET | `/reports/activity` | Activity counts by type and user; recent activity |
| GET | `/reports/roadmap` | Roadmap idea statistics (Pro) |
| GET | `/reports/timesheet` | Committed time entries grouped by task (Pro) |

For per-board timesheets by task or by user, see [Time Tracking](/rest-api/time-tracking).

## Common parameters

The overview, tasks, activity and roadmap reports share these parameters:

| Parameter | Type | Required | Description |
|---|---|---|---|
| `board_id` | integer | No | Limit to one board. A board you cannot access (or a non-numeric value) gives an empty report rather than widening to all boards. |
| `start_date` | string | No | `YYYY-MM-DD`. Default: 6 days before today. |
| `end_date` | string | No | `YYYY-MM-DD`. Default: today. |

Invalid dates fall back to the defaults. Overview, tasks and activity cover `to-do` boards; the roadmap report covers `roadmap` boards. Archived boards and templates are excluded.

A task is counted in a range when it was created, completed or updated inside it. `overdue` is always "overdue right now".

Every report response has one top-level key, `report`.

## Overview Report

```http
GET /wp-json/fluent-boards/v2/reports/overview
```

**Example Request**

```bash
curl "https://yourdomain.com/wp-json/fluent-boards/v2/reports/overview?start_date=2025-09-01&end_date=2025-09-30" \
  -u "USERNAME:APPLICATION_PASSWORD"
```

**Example Response**

```json
{
  "report": {
    "stats": {
      "total": 48,
      "completed": 20,
      "overdue": 3,
      "activeMembers": 5,
      "estimatedTime": "32h 30m"
    },
    "tasksByBoard": [
      { "id": 1, "title": "Website Redesign", "total": 30 },
      { "id": 2, "title": "Marketing", "total": 18 }
    ],
    "priority": {
      "total": 48,
      "items": [
        { "key": "urgent", "label": "Urgent", "value": 4 },
        { "key": "high", "label": "High", "value": 10 },
        { "key": "medium", "label": "Medium", "value": 20 },
        { "key": "low", "label": "Low", "value": 8 },
        { "key": "none", "label": "None", "value": 6 }
      ]
    },
    "completion": [
      { "key": "completed", "label": "Completed", "value": 20 },
      { "key": "incomplete", "label": "Still Open", "value": 25 },
      { "key": "completed_earlier", "label": "Completed Earlier", "value": 3 }
    ],
    "dueDate": [
      { "key": "overdue", "label": "Overdue", "value": 3 },
      { "key": "today", "label": "Today", "value": 2 },
      { "key": "next7days", "label": "Next 7 Days", "value": 9 },
      { "key": "later", "label": "Later", "value": 4 },
      { "key": "no_due_date", "label": "No Due Date", "value": 7 }
    ],
    "assigneeWorkload": [
      {
        "id": 5,
        "name": "Jane Smith",
        "avatar": "https://secure.gravatar.com/avatar/example5?s=128&d=mm&r=g",
        "open": 8,
        "completed": 6,
        "overdue": 1,
        "estimated": "12h",
        "workload": 100
      }
    ]
  }
}
```

| Key | Description |
|---|---|
| `stats` | Tiles: tasks in range, completed in range, overdue now, active members, summed time estimates |
| `tasksByBoard` | Task totals per board (`id`, `title`, `total`) |
| `priority` | Distribution by priority bucket (`urgent`, `high`, `medium`, `low`, `none`) |
| `completion` | Completed / still open / completed before the range; the three values add up to `stats.total` |
| `dueDate` | Open tasks by due date: `overdue`, `today`, `next7days`, `later`, `no_due_date` |
| `assigneeWorkload` | Per-assignee open, completed, overdue, estimated time and `workload` (% of the busiest assignee) |

## Tasks Report

```http
GET /wp-json/fluent-boards/v2/reports/tasks
```

**Example Request**

```bash
curl "https://yourdomain.com/wp-json/fluent-boards/v2/reports/tasks?board_id=1" \
  -u "USERNAME:APPLICATION_PASSWORD"
```

**Example Response**

```json
{
  "report": {
    "byStage": [],
    "byAssignee": [
      { "id": 5, "name": "Jane Smith", "avatar": "https://...", "completed": 6, "total": 14 }
    ],
    "byLabel": [
      { "id": 9, "title": "Bug", "total": 7, "color": "#e11d48" }
    ],
    "priority": { "total": 30, "items": [] },
    "recentlyCompleted": [
      {
        "id": 42,
        "title": "Write release notes",
        "slug": "write-release-notes",
        "boardId": 1,
        "board": "Website Redesign",
        "boardColor": "#2196F3",
        "stage": "Done",
        "priority": "high",
        "assignee": "Jane Smith",
        "assigneeAvatar": "https://...",
        "estimated": "2h"
      }
    ]
  }
}
```

`priority` has the same shape as in the overview report.

## Activity Report

```http
GET /wp-json/fluent-boards/v2/reports/activity
```

**Example Request**

```bash
curl "https://yourdomain.com/wp-json/fluent-boards/v2/reports/activity" \
  -u "USERNAME:APPLICATION_PASSWORD"
```

**Example Response**

```json
{
  "report": {
    "stats": {
      "tasksCreated": 12,
      "stageChanged": 30,
      "commentsAdded": 18,
      "subtasksCreated": 9,
      "attachmentsAdded": 4
    },
    "byUser": [
      { "id": 5, "name": "Jane Smith", "avatar": "https://...", "count": 41 }
    ],
    "byType": [
      { "key": "task_stage_updated", "label": "Stage Change", "icon": "task-stage", "value": 30 },
      { "key": "comment_created", "label": "Comments", "icon": "comment-line", "value": 18 },
      { "key": "task_created", "label": "Task Created", "icon": "plus", "value": 12 },
      { "key": "subtask_added", "label": "Subtasks", "icon": "subtask", "value": 9 },
      { "key": "task_attachment_added", "label": "Attachments", "icon": "paper-clip", "value": 4 },
      { "key": "task_label", "label": "Labels", "icon": "label", "value": 6 },
      { "key": "task_due_date_changed", "label": "Due Dates", "icon": "date", "value": 3 }
    ],
    "recent": [
      {
        "id": 812,
        "taskId": 42,
        "taskSlug": "write-release-notes",
        "boardId": 1,
        "actor": "Jane Smith",
        "action": "moved the task to In Progress",
        "subject": "Write release notes",
        "date": "October 1, 2025, 9:12 am"
      }
    ]
  }
}
```

## Roadmap Report <Badge type="tip" text="Pro" />

Statistics for roadmap boards (ideas). The start date may not be after the end date, and the range may span at most 366 days; otherwise the endpoint returns `400`.

```http
GET /wp-json/fluent-boards/v2/reports/roadmap
```

**Example Request**

```bash
curl "https://yourdomain.com/wp-json/fluent-boards/v2/reports/roadmap?start_date=2025-09-01&end_date=2025-09-30" \
  -u "USERNAME:APPLICATION_PASSWORD"
```

**Example Response**

```json
{
  "report": {
    "stats": {
      "totalIdeas": 120,
      "submittedIdeas": 14,
      "publicIdeas": 9,
      "completedIdeas": 3
    },
    "submissions": [
      { "date": "2025-09-01", "value": 0 },
      { "date": "2025-09-02", "value": 2 }
    ],
    "byStage": [
      { "label": "Under Review", "value": 6, "position": 1 }
    ],
    "popularIdeas": [
      {
        "id": 77,
        "slug": "dark-mode",
        "title": "Dark mode",
        "boardId": 4,
        "board": "Product Roadmap",
        "upvotes": 52,
        "comments": 8,
        "popularity": 60
      }
    ],
    "bySource": []
  }
}
```

`submissions` has one entry per day in the range, including days with no ideas.

## Timesheet Report <Badge type="tip" text="Pro" />

Committed time entries on the boards you can access, grouped by task.

```http
GET /wp-json/fluent-boards/v2/reports/timesheet
```

**Parameters**

| Parameter | Type | Required | Description |
|---|---|---|---|
| `board_id` | integer | No | Limit to one board |
| `start_date` | string | No | `YYYY-MM-DD`. Applied only together with `end_date`. |
| `end_date` | string | No | `YYYY-MM-DD`. Compared against `completed_at`. |

Without both dates, all committed entries are returned.

**Example Request**

```bash
curl "https://yourdomain.com/wp-json/fluent-boards/v2/reports/timesheet?board_id=1&start_date=2025-09-01&end_date=2025-09-30" \
  -u "USERNAME:APPLICATION_PASSWORD"
```

**Example Response**

```json
{
  "message": "Time sheet report",
  "timings": [
    {
      "id": 42,
      "title": "Write release notes",
      "board": { "id": 1, "title": "Website Redesign" },
      "total": 150,
      "times": [
        {
          "id": 301,
          "billable_minutes": 90,
          "working_minutes": 95,
          "completed_at": "2025-09-12 16:00:00",
          "message": "First draft",
          "user": {
            "ID": 5,
            "name": "Jane Smith",
            "avatar": "https://secure.gravatar.com/avatar/example5?s=128&d=mm&r=g",
            "email": "jane@example.com"
          }
        }
      ]
    }
  ]
}
```

`id` is the task ID and `total` the sum of `billable_minutes`. Entries whose user was deleted show `"name": "Deleted user"`.

::: tip Export
The timesheet can also be downloaded as CSV through admin-ajax (`action=fluent_boards_export_timesheet`), not REST. See [Import & Export](/rest-api/import-export#exports-admin-ajax).
:::

See [Common Error Responses](/rest-api/shared/error-responses) for standard error formats.
