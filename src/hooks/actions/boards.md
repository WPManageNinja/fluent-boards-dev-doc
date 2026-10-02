# Board Action Hooks

<Badge type="tip" vertical="top" text="FluentBoards Core" /> <Badge type="warning" vertical="top" text="Intermediate" />

Action hooks for boards, board members, stages, labels and board templates. See the [Action Hooks overview](./index.md) for every action hook grouped by area.

Hooks marked <Badge type="tip" text="Pro" /> fire only when FluentBoards Pro is active. Source paths are relative to the plugin root. Paths that start with `fluent-boards-pro/` are in the Pro plugin.

## Boards

<explain-block title="fluent_boards/board_created">

Fires after a new board is created. Callers: the board create screen, the first-board onboarding flow, the PHP API (`app/Api/Classes/Boards.php`) and the MCP board tool. In Pro, it also fires for the Pro create-board route and for boards created by CSV and Asana imports.

It does **not** fire when a board is duplicated or created from a template. For templates, use `fluent_boards/board_created_from_template`.

**Parameters**
- `$board` `\FluentBoards\App\Models\Board`: the new board

**Usage**
```php
add_action('fluent_boards/board_created', function ($board) {
    // Do whatever you want
}, 10, 1);
```

**Source:** `app/Http/Controllers/BoardController.php`, `app/Api/Classes/Boards.php`, `app/Modules/MCP/Tools/BoardTools.php`, `fluent-boards-pro/app/Http/Controllers/ProBoardController.php`, `fluent-boards-pro/app/Http/Controllers/CsvController.php`, `fluent-boards-pro/app/Services/AsanaImporter.php`

</explain-block>

<explain-block title="fluent_boards/board_updated">

Fires after a board's details (title, description, and other fillable fields) are saved from the board settings screen.

**Parameters**
- `$board` `\FluentBoards\App\Models\Board`: the board after the update
- `$oldBoard` `\FluentBoards\App\Models\Board`: a clone of the board taken before the update

**Usage**
```php
add_action('fluent_boards/board_updated', function ($board, $oldBoard) {
    if ($board->title !== $oldBoard->title) {
        // Title changed
    }
}, 10, 2);
```

**Source:** `app/Http/Controllers/BoardController.php`

</explain-block>

<explain-block title="fluent_boards/before_board_deleted">

Fires right before a board is deleted, while the board and its data still exist. Use it to clean up your own data that is linked to the board.

**Parameters**
- `$board` `\FluentBoards\App\Models\Board`: the board that is about to be deleted
- `$options` `null`: reserved. Always `null`.

**Usage**
```php
add_action('fluent_boards/before_board_deleted', function ($board, $options) {
    // Clean up your data for $board->id
}, 10, 2);
```

**Source:** `app/Services/BoardService.php`

</explain-block>

<explain-block title="fluent_boards/board_archived">

Fires after a board is archived (its `archived_at` is set).

**Parameters**
- `$board` `\FluentBoards\App\Models\Board`: the archived board

**Usage**
```php
add_action('fluent_boards/board_archived', function ($board) {
    // Do whatever you want
}, 10, 1);
```

**Source:** `app/Services/BoardService.php`

</explain-block>

<explain-block title="fluent_boards/board_restored">

Fires after an archived board is restored (its `archived_at` is cleared).

**Parameters**
- `$board` `\FluentBoards\App\Models\Board`: the restored board

**Usage**
```php
add_action('fluent_boards/board_restored', function ($board) {
    // Do whatever you want
}, 10, 1);
```

**Source:** `app/Services/BoardService.php`

</explain-block>

<explain-block title="fluent_boards/board_background_updated">

Fires after a board's background is changed: a solid color or gradient, an uploaded image, or a reset to no background.

**Parameters**
- `$boardId` `int`: the board ID
- `$oldBackground` `array|null`: the background value before the change

**Usage**
```php
add_action('fluent_boards/board_background_updated', function ($boardId, $oldBackground) {
    // Do whatever you want
}, 10, 2);
```

**Source:** `app/Http/Controllers/BoardController.php`, `app/Services/BoardService.php`

</explain-block>

<explain-block title="fluent_boards/contact_added_to_board">

Fires after a FluentCRM contact is associated with a board.

**Parameters**
- `$board` `\FluentBoards\App\Models\Board`: the board
- `$contactId` `int`: the FluentCRM subscriber ID

**Usage**
```php
add_action('fluent_boards/contact_added_to_board', function ($board, $contactId) {
    // Do whatever you want
}, 10, 2);
```

**Source:** `app/Services/BoardService.php`

</explain-block>

## Board Members

<explain-block title="fluent_boards/board_member_added">

Fires after a user gets "member" access to a board. Callers: adding a member, changing a user's role to member, copying members when a board is duplicated, and converting a viewer or admin to a member.

**Parameters**
- `$boardId` `int`: the board ID
- `$member` `\FluentBoards\App\Models\User|\FluentBoards\App\Models\Relation`: usually the `User` model. When an existing board user is switched to member (`BoardService::makeMember()`), this is the board-user `Relation` model, and the user ID is in `$member->foreign_id`.

**Note:** Because the second argument can be either model, read the user ID defensively. A `User` model has `ID`, and a `Relation` has `foreign_id`.

**Usage**
```php
add_action('fluent_boards/board_member_added', function ($boardId, $member) {
    $userId = $member instanceof \FluentBoards\App\Models\Relation
        ? (int) $member->foreign_id
        : (int) $member->ID;
}, 10, 2);
```

**Source:** `app/Services/BoardService.php`

</explain-block>

<explain-block title="fluent_boards/board_viewer_added">

Fires after a user gets "viewer" (read-only) access to a board. Callers: adding a viewer, changing a user's role to viewer, copying viewers when a board is duplicated, and converting a member to a viewer.

**Parameters**
- `$boardId` `int`: the board ID
- `$member` `\FluentBoards\App\Models\User|\FluentBoards\App\Models\Relation`: usually the `User` model. When an existing board user is switched to viewer (`BoardService::makeViewer()`), this is the board-user `Relation` model, and the user ID is in `$member->foreign_id`.

**Usage**
```php
add_action('fluent_boards/board_viewer_added', function ($boardId, $member) {
    // Do whatever you want
}, 10, 2);
```

**Source:** `app/Services/BoardService.php`

</explain-block>

<explain-block title="fluent_boards/board_admin_added">

Fires after a user is made an admin (manager) of a board. This happens on an explicit role change, when admins are copied to a duplicated board, and (Pro) when a user's board roles are synced from the member profile.

**Parameters**
- `$boardId` `int`: the board ID
- `$userId` `int`: the WordPress user ID

**Usage**
```php
add_action('fluent_boards/board_admin_added', function ($boardId, $userId) {
    // Do whatever you want
}, 10, 2);
```

**Source:** `app/Services/BoardService.php`, `fluent-boards-pro/app/Http/Controllers/BoardUserController.php`

</explain-block>

<explain-block title="fluent_boards/board_admin_removed">

Fires after a user loses admin (manager) rights on a board.

**Parameters**
- `$boardId` `int`: the board ID
- `$userId` `int`: the WordPress user ID

**Note:** The Pro member-role sync (`BoardUserController`) fires this hook for every board where the new role is not admin, even if the user was never an admin on that board.

**Usage**
```php
add_action('fluent_boards/board_admin_removed', function ($boardId, $userId) {
    // Do whatever you want
}, 10, 2);
```

**Source:** `app/Services/BoardService.php`, `fluent-boards-pro/app/Http/Controllers/BoardUserController.php`

</explain-block>

<explain-block title="fluent_boards/send_invitation">

Fires when someone invites an email address that has no WordPress account. Pro listens to this hook to create and email the invitation link.

**Parameters**
- `$boardId` `int`: the board ID
- `$email` `string`: the invited email address
- `$inviterUserId` `int`: ID of the user who sent the invitation
- `$role` `string`: `'manager'`, `'member'` or `'viewer'`. Any other value falls back to `'member'`.

**Usage**
```php
add_action('fluent_boards/send_invitation', function ($boardId, $email, $inviterUserId, $role) {
    // Do whatever you want
}, 10, 4);
```

**Source:** `app/Services/BoardService.php`

</explain-block>

## Stages

<explain-block title="fluent_boards/board_stage_added">

Fires after a new stage (list) is added to a board from the board screen or the MCP stage tool.

**Parameters**
- `$board` `\FluentBoards\App\Models\Board`: the board
- `$stage` `\FluentBoards\App\Models\Stage`: the new stage

**Usage**
```php
add_action('fluent_boards/board_stage_added', function ($board, $stage) {
    // Do whatever you want
}, 10, 2);
```

**Source:** `app/Http/Controllers/BoardController.php`, `app/Modules/MCP/Tools/StageTools.php`

</explain-block>

<explain-block title="fluent_boards/stage_updated">

Fires after a stage's title or color is changed. It fires from the stage edit form, and from single-property updates when the title actually changes.

**Parameters**
- `$boardId` `int`: the board ID
- `$updatedStage` `array`: the new values. This is **not** a Stage model. From property updates, it is `['title' => ..., 'cover_bg' => ...]`. From the stage edit form, it is the submitted request array, which also contains `title` and `cover_bg`.
- `$oldStage` `\FluentBoards\App\Models\Stage`: a clone of the stage taken before the update

**Usage**
```php
add_action('fluent_boards/stage_updated', function ($boardId, $updatedStage, $oldStage) {
    $newTitle = $updatedStage['title'] ?? '';
    $oldTitle = $oldStage->title;
}, 10, 3);
```

**Source:** `app/Services/StageService.php`

</explain-block>

<explain-block title="fluent_boards/board_stages_reordered">

Fires after stages are reordered on a board.

**Parameters**
- `$boardId` `int`: the board ID
- `$stageIds` `array|\FluentBoards\Framework\Support\Collection`: what this holds depends on the caller:
  - When the full stage list is repositioned (`BoardService::repositionStages()`), it is a Collection of stage IDs in the **previous** order, captured before the move.
  - When a single stage is dragged (`StageController`), it is a one-item array with the moved stage ID: `[$stageId]`.

**Note:** Neither form gives you the new order. To get it, query the board's stages ordered by `position` inside your callback.

**Usage**
```php
add_action('fluent_boards/board_stages_reordered', function ($boardId, $stageIds) {
    $newOrder = \FluentBoards\App\Models\Stage::where('board_id', $boardId)
        ->where('type', 'stage')
        ->whereNull('archived_at')
        ->orderBy('position')
        ->pluck('id');
}, 10, 2);
```

**Source:** `app/Services/BoardService.php`, `app/Http/Controllers/StageController.php`

</explain-block>

<explain-block title="fluent_boards/stage_archived_with_tasks">

Fires after a stage is archived. Use this hook in new code. The legacy `fluent_boards/stage_archived` fires right before it with the same arguments.

**Parameters**
- `$boardId` `int`: the board ID
- `$stage` `\FluentBoards\App\Models\Stage`: the archived stage

**Usage**
```php
add_action('fluent_boards/stage_archived_with_tasks', function ($boardId, $stage) {
    // Do whatever you want
}, 10, 2);
```

**Source:** `app/Services/BoardService.php`

</explain-block>

<explain-block title="fluent_boards/stage_archived">

**Legacy.** The code marks this as the "old hook". Use `fluent_boards/stage_archived_with_tasks` instead. It fires after a stage is archived, immediately before `stage_archived_with_tasks`.

**Parameters**
- `$boardId` `int`: the board ID
- `$stage` `\FluentBoards\App\Models\Stage`: the archived stage

**Usage**
```php
add_action('fluent_boards/stage_archived', function ($boardId, $stage) {
    // Do whatever you want
}, 10, 2);
```

**Source:** `app/Services/BoardService.php`

</explain-block>

<explain-block title="fluent_boards/stage_restored_with_tasks">

Fires after an archived stage is restored. Use this hook in new code. The legacy `fluent_boards/board_stage_restored` fires right before it.

**Parameters**
- `$boardId` `int`: the board ID
- `$stage` `\FluentBoards\App\Models\Stage`: the restored stage

**Usage**
```php
add_action('fluent_boards/stage_restored_with_tasks', function ($boardId, $stage) {
    // Do whatever you want
}, 10, 2);
```

**Source:** `app/Services/BoardService.php`

</explain-block>

<explain-block title="fluent_boards/board_stage_restored">

**Legacy.** The code marks this as the "old hook". Use `fluent_boards/stage_restored_with_tasks` instead. It fires after an archived stage is restored.

**Parameters**
- `$boardId` `int`: the board ID
- `$stageTitle` `string`: the restored stage's title (not the model)

**Usage**
```php
add_action('fluent_boards/board_stage_restored', function ($boardId, $stageTitle) {
    // Do whatever you want
}, 10, 2);
```

**Source:** `app/Services/BoardService.php`

</explain-block>

<explain-block title="fluent_boards/tasks_moved_between_stages">

Fires once after the "move all tasks" stage action moves every open, non-archived top-level task from one stage to another. It fires only when at least one task moved and the stages differ. Each moved task also fires `fluent_boards/task_stage_updated`.

**Parameters**
- `$boardId` `int`: the board ID
- `$sourceStage` `\FluentBoards\App\Models\Stage`: the stage the tasks came from
- `$targetStage` `\FluentBoards\App\Models\Stage`: the stage the tasks moved to
- `$count` `int`: number of tasks moved

**Usage**
```php
add_action('fluent_boards/tasks_moved_between_stages', function ($boardId, $sourceStage, $targetStage, $count) {
    // Do whatever you want
}, 10, 4);
```

**Source:** `app/Services/StageService.php`

</explain-block>

<explain-block title="fluent_boards/default_assignees_updated">

Fires after a stage's default task assignees are saved.

**Parameters**
- `$stage` `\FluentBoards\App\Models\Stage`: the stage
- `$assignees` `int[]`: the default assignee user IDs

**Usage**
```php
add_action('fluent_boards/default_assignees_updated', function ($stage, $assignees) {
    // Do whatever you want
}, 10, 2);
```

**Source:** `app/Services/StageService.php`

</explain-block>

<explain-block title="fluent_boards/default_watchers_updated">

Fires after a stage's default task watchers are saved.

**Parameters**
- `$stage` `\FluentBoards\App\Models\Stage`: the stage
- `$watchers` `int[]`: the default watcher user IDs

**Usage**
```php
add_action('fluent_boards/default_watchers_updated', function ($stage, $watchers) {
    // Do whatever you want
}, 10, 2);
```

**Source:** `app/Services/StageService.php`

</explain-block>

## Labels

<explain-block title="fluent_boards/board_label_created">

Fires after a label is created on a board from the board screen or the MCP label tool.

**Parameters**
- `$label` `\FluentBoards\App\Models\Label`: the new label

**Usage**
```php
add_action('fluent_boards/board_label_created', function ($label) {
    // Do whatever you want
}, 10, 1);
```

**Source:** `app/Http/Controllers/LabelController.php`, `app/Modules/MCP/Tools/LabelTools.php`

</explain-block>

<explain-block title="fluent_boards/board_label_updated">

Fires after a board label is edited.

**Parameters**
- `$label` `\FluentBoards\App\Models\Label`: the updated label

**Usage**
```php
add_action('fluent_boards/board_label_updated', function ($label) {
    // Do whatever you want
}, 10, 1);
```

**Source:** `app/Http/Controllers/LabelController.php`, `app/Modules/MCP/Tools/LabelTools.php`

</explain-block>

<explain-block title="fluent_boards/board_label_deleted">

Fires after a board label is deleted and detached from all tasks.

**Parameters**
- `$label` `\FluentBoards\App\Models\Label`: the deleted label. The row no longer exists, but the object's attributes can still be read.

**Usage**
```php
add_action('fluent_boards/board_label_deleted', function ($label) {
    // Do whatever you want
}, 10, 1);
```

**Source:** `app/Services/LabelService.php`

</explain-block>

For adding or removing a label on a task, see [`fluent_boards/task_label`](./tasks.md#fluent_boards_task_label).

## Templates

<explain-block title="fluent_boards/board_created_from_template">
<Badge type="tip" text="Pro" />

Fires after a board is created from a template, either from the template picker or from the FluentCRM "Create Board from Template" automation action. Task copying from the template runs asynchronously, so the tasks may not exist yet when this hook fires.

**Parameters**
- `$board` `\FluentBoards\App\Models\Board`: the new board
- `$templateType` `string`: `'default'` for a built-in remote template, or `'user'` for a saved user template. The FluentCRM action always passes `'user'`.
- `$templateId` `int|string`: the template ID (a remote template ID when the type is `'default'`)

**Usage**
```php
add_action('fluent_boards/board_created_from_template', function ($board, $templateType, $templateId) {
    // Do whatever you want
}, 10, 3);
```

**Source:** `fluent-boards-pro/app/Http/Controllers/TemplateController.php`, `fluent-boards-pro/app/Services/Integrations/FluentCRM/CreateBoardFromTemplateAction.php`

</explain-block>

<explain-block title="fluent_boards/board_created_from_automation">
<Badge type="tip" text="Pro" />

Fires after the FluentCRM "Create Board from Template" automation action creates a board for a contact. It fires right after `fluent_boards/board_created_from_template`.

**Parameters**
- `$board` `\FluentBoards\App\Models\Board`: the new board
- `$subscriber` `\FluentCrm\App\Models\Subscriber`: the FluentCRM contact
- `$funnelSubscriberId` `int`: the funnel subscriber (automation run) ID

**Usage**
```php
add_action('fluent_boards/board_created_from_automation', function ($board, $subscriber, $funnelSubscriberId) {
    // Do whatever you want
}, 10, 3);
```

**Source:** `fluent-boards-pro/app/Services/Integrations/FluentCRM/CreateBoardFromTemplateAction.php`

</explain-block>

<explain-block title="fluent_boards/board_converted_to_template">
<Badge type="tip" text="Pro" />

Fires after an existing board is converted into a template.

**Parameters**
- `$board` `\FluentBoards\App\Models\Board`: the board, now marked as a template

**Usage**
```php
add_action('fluent_boards/board_converted_to_template', function ($board) {
    // Do whatever you want
}, 10, 1);
```

**Source:** `fluent-boards-pro/app/Http/Controllers/TemplateController.php`

</explain-block>

<explain-block title="fluent_boards/template_converted_to_board">
<Badge type="tip" text="Pro" />

Fires after a template is converted back into a regular board.

**Parameters**
- `$board` `\FluentBoards\App\Models\Board`: the board

**Usage**
```php
add_action('fluent_boards/template_converted_to_board', function ($board) {
    // Do whatever you want
}, 10, 1);
```

**Source:** `fluent-boards-pro/app/Http/Controllers/TemplateController.php`

</explain-block>
