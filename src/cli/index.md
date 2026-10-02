# FluentBoards CLI

<Badge type="tip" vertical="top" text="FluentBoards Core" /> <Badge type="warning" vertical="top" text="Advanced" />

FluentBoards registers a small set of [WP-CLI](https://wp-cli.org/) commands under the `fluent_boards` namespace. The class is `FluentBoards\App\Hooks\Cli\Commands` (`app/Hooks/Cli/Commands.php`). It is registered in `app/Hooks/actions.php` only when `WP_CLI` is defined. FluentBoards Pro adds no CLI commands.

## Syntax

```bash
wp fluent_boards <command> [--argument=<value>]
```

List the available commands:

```bash
wp help fluent_boards
```

## Commands

| Command | Purpose | Requires |
|---|---|---|
| [`crm_role_assign`](#crm-role-assign) | Add the WordPress users behind FluentCRM contacts with a tag as members of a board | FluentCRM, FluentBoards Pro |
| [`create_random_tasks`](#create-random-tasks) | Bulk-insert placeholder tasks into a board, for load testing or demo data | — |

### crm_role_assign

Adds FluentCRM contacts that have a selected tag **and** a linked WordPress user as members of a board. Each member is added with the default member settings and notification preferences. Users who are already members are skipped.

```bash
wp fluent_boards crm_role_assign
```

The command takes no arguments and runs interactively. It reads from STDIN:

1. It lists all boards (`ID : Title`) and asks for a board ID.
2. It lists all FluentCRM tags (`ID : Title`) and asks for a tag ID.
3. It prints a table (`UserID`, `Email`, `Name`) of the contacts that will be added.
4. It asks for confirmation. Type `yes` to proceed. Any other input cancels.

It exits with an error when FluentCRM is not active ("FluentCRM is not installed"), when FluentBoards Pro is not active, or when the board or tag ID is invalid.

**Example session**

```text
$ wp fluent_boards crm_role_assign
You are about to add Members to your Project Boards from FluentCRM Tags
Please select the Project Board you want to add Members to:
12 : Client Onboarding
14 : Website Redesign

Enter the ID of the board you want to add members to:
12
3 : Customers
5 : VIP

Enter the Tag ID by which the contacts will be added as the member of the select board:
5
Following contacts will be added to the board as members:
+--------+-------------------+-------------+
| UserID | Email             | Name        |
+--------+-------------------+-------------+
| 21     | jane@example.com  | Jane Doe    |
+--------+-------------------+-------------+
Do you want to proceed? (yes/no)
yes
Success: Operation Completed. 1 contacts added to the board
```

::: danger Known issue in version 2.1.0
The relation rows are created with the ID of the **last board in the list** (the loop variable `$board`), not the board you selected. Only the duplicate check uses the selected board. Until this is fixed, check the board membership after you run the command. If you are on a version with the bug, add members through the app or the [REST API](/rest-api/) instead.
:::

Because the command reads STDIN, it cannot run unattended. Piping the answers in works:

```bash
printf "12\n5\nyes\n" | wp fluent_boards crm_role_assign
```

### create_random_tasks

Bulk-inserts tasks titled `Task Random 1`, `Task Random 2`, … into a board. Each task goes into a random stage of that board.

```bash
wp fluent_boards create_random_tasks [--board_id=<board_id>] [--count=<count>]
```

**Options**

| Option | Default | Description |
|---|---|---|
| `--board_id=<board_id>` | First board found | The board to fill |
| `--count=<count>` | `10` | Number of tasks to create |

**Examples**

```bash
# 10 tasks in the first board
wp fluent_boards create_random_tasks

# 1,000 tasks in board 85
wp fluent_boards create_random_tasks --board_id=85 --count=1000
```

It shows a progress bar and ends with `Success: <count> tasks created successfully for board ID: <id>`. It exits with an error if the board does not exist or has no stages.

::: warning Development use only
The tasks are written with a single bulk `INSERT` (`Task::insert()`). Model events do not run, so `fluent_boards/task_created` does not fire, no activity is logged, no notifications are sent, and `position`, `slug` and `settings` are left at their database defaults. Do not run it on a production site.
:::

## Running commands as a user

WP-CLI runs without a logged-in user by default. The two commands above do not check permissions. If your own CLI code calls the [PHP API](/global-functions/#php-api-classes) (`FluentBoardsApi()`), set a user first, because those methods check the current user's board permissions:

```bash
wp --user=admin eval 'print_r( FluentBoardsApi("boards")->getBoards()->pluck("title") );'
```
