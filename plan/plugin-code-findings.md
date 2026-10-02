# Plugin code findings (found while syncing docs)

Not fixed in this work — docs repo only. Each needs verification by the plugin owners before acting.
Severity is a first guess: **S** = security/data-loss, **B** = bug, **C** = cleanup.

## Routes
- B — Pro `app/Http/Routes/api.php` ~L88–95: 7 `time-tracks` routes point to a non-existent `FluentBoardsPro\App\Http\Controllers\TimeTrackController`; two duplicate live TimeTracking-module routes.
- C — Free `api.php`: `GET /global-search` registered twice (BoardUserPolicy L40, UserPolicy L283).
- C — Six UserController methods (`/fluent-boards-users`, `/search-fluent-boards-users`, `/get-user-permissions`, `/update-user-permissions`, `/set-permission-all-board-admin`, `/remove-user-from-board`) are no longer routed.

## Boards / public boards (from boards writer)
- S — `BoardService::deleteBoard` deletes every `fbs_relations` row whose `object_id` is one of the board's task IDs regardless of `object_type` → may delete other boards' member rows.
- S — `PublicBoardController::find` does not hide appended `meta`: logged-out viewers get all board meta incl. CRM contact id and `public_token_salt`.
- S — `PublicAccessService::revokeAccessToken` never called: disabling then re-enabling public access keeps old tokens valid.
- S — `GET projects/{id}/crm-contacts` returns FluentCRM contact data (email, lifetime value) to any board member incl. viewers; no `fcrm_read_contacts` check.
- S — Comments in comments-and-activities feed include `author_email`, `author_ip`; private comments not filtered.
- B — `BoardService::getUsersOfBoards` (`GET projects/user-admin-in-boards`) queries columns (`board_id`, `user_id`, `status`) that don't exist on `fbs_relations` → broken endpoint.
- B — `BoardController::getBoards`: `order` is used as sort column and `orderBy` as direction (swapped naming); client column passed to `orderBy()` unchecked; `type` read but unused.
- B — `TaskService::getCommentsAndActivities` hard-codes `https://wordpress.test/...` in pagination URLs; `per_page=0` divides by zero.
- B — `PUT projects/{id}/upload/background` stores any `color`/`id` string (create-board validates against palette).
- B — `GET tasks/{task_id}/activities` has no ordering when `filter` missing.
- B — `POST projects/{id}/crm-contact` stores `value` unsanitized.

## Hooks (from hooks inventory)
- B — `task_attachment_deleted` passes 1 or 2 args depending on caller.
- B — Pro repeat-task fires `task_due_date_changed` with the new start date as the "old due date".
- B — `board_admin_removed` fires for users who were never admins.
- C — `ajax_options_task_assignees` filter unreachable.

## Tasks / subtasks / comments (from tasks writer)
- B — `TaskController::updateTaskProperties`: `stage_id` validated but never saved; `lead_value`, `scope`, `start_at`, `last_completed` accepted but no-ops.
- B — `CommentService::delete` / `deleteReply`: non-author gets 200 "deleted" while nothing is deleted.
- C — `CommentController::updateCommentPrivacy`: stray `"0": "public"` key in response (assignment inside array literal).
- B — `OptionService::updateDashboardViewSettings`: fatal when user's settings row missing (property on null).
- B — `OptionsController::getDashboardViewSettings`: `$currentSettings` undefined when stored value empty.
- B — `TaskController::getAssociatedCrmContacts`: uses FluentCRM `Subscriber` without existence check → fatal without FluentCRM.
- B — `SubtaskService::cloneSubtask`: crashes for subtask without group; `pluck('id')` on WP users (column is `ID`).
- B — `SubtaskService::getLastMinuteUpdatedSubtasks` calls non-existent `$this->sendError()`.
- B — `ConvertTaskToSubtask` without `subtaskGroupId` creates a new "Default Subtask Group" each call.
- B — `DependencyController::addDependency` ignores `{task_id}` path param; `removeDependency` returns 200 when none exists.
- B — `ProTaskController::createOrUpdateTaskRepeatMeta` returns stale `repeat_task_meta`.
- B — `getTasksForBoardsByCategory('mentioned')` ignores its limit of 6.
- B — `TaskController::detachYourselfFromTask` toggles (assigns you if not assigned).

## Models (from DB writer)
- B — `Task::customFields()` uses `FluentBoardsPro\App\Services\Constant` → fatal when Pro inactive (free `Constant::TASK_CUSTOM_FIELD` exists).
- B — Static `Task::upcoming()` hits instance method `upcoming()` instead of `scopeUpcoming`.
- C — `Task::labels()` relates to `BoardTerm` not `Label`.
- B — `Task::setArchivedAttribute()` writes non-existent `is_archived` column.
- B — `User::highPriorityTasks/overDueTasks/upcomingTasks/upcomingWithoutDuedate` filter on non-existent `is_archived`, `due_date`.
- B — `User::boards()` keys reversed (joins `object_id` to user id).
- B — `Comment::parentComment()` is `hasOne` on `parent_id` → returns first reply, not parent.
- B — `TaskImage::scopeWithTask/WithComment` eager-load undefined relations.
- B — `Attachment::$appends` has `secure_url` with no accessor → base `toArray()` fails.
- B — `Notification::checkReadOrNot()` null property read when current user isn't recipient.
- B — `Relation::create()` gets `maybe_serialize()` output in `DependencyService`/`WebhookController` → double-serialized.
- C — `Constant::OBJECT_TYPE_FOLDER_BOARD` holds old class name `FluentBoardsPro\App\Models\Folder`; Pro duplicates `CustomField` model.
- B — Time track status spelled `commited`; `getWorkingSeconds()` checks `active`, never written.
- B — `Task::creating` always overrides `type`; errors when `board_id` missing.

## Stages / labels / templates / folders / time tracking / roadmap / notifications (from writer C)
- **S (high)** — fluent-roadmap `DELETE roadmaps/idea/comments/{id}`: policy allows all, no ownership check → anyone, incl. logged-out, can delete any FluentBoards comment by id.
- S — fluent-roadmap: `enable_*` / `*_require_auth` settings not enforced server-side; ideas/comments/votes always accepted.
- S — fluent-roadmap `changeIdeaStage`, `getStageIdeas`, `addComment`: no check idea/stage belongs to URL board; `changeIdeaStage` allowed for board viewers.
- S — Pro `templates/task-creation-status`: `board_id` from query, no board permission check → any user reads any board's task counts.
- B — fluent-roadmap `POST admin/roadmap/settings`: required `add_user_to_crm_new_idea_submission` stripped when FluentCRM inactive → save always fails.
- B — fluent-roadmap `addComment`/`storeReplies`: author name/email written to guarded fields (lost); checks non-existent `add_user_to_crm` key.
- B — fluent-roadmap `getStageIdeas`: `per_page` defaults to 1; `all-ideas` undefined variable with no public stages.
- B — Pro timesheet routes: board-manager policy reads absent `{board_id}` → only admins pass.
- B — Pro TimeTrack `manualCommitTrack`/`updateCommitTrack`: undefined variable warning when `completed_at` omitted.
- B — Pro `CustomFieldService::formatDate` only handles JS `Date.toString()` strings.
- B — Pro `updateCustomField` returns success with `customField: false` on duplicate name.
- B — Pro default board templates disabled (`getCachedDefaultTemplates` returns `[]`) → `template_type=default` always "Template not found".
- C — Pro `createFromTemplate` passes 201 to `sendSuccess`, which ignores it.
- B — Free `OptionService::updateGlobalNotificationSettings` fatal if settings row not yet created.
- B — Free `NotificationHandler::changeBoardNotification`: wrong `createNotification` args; board id looked up as task id.
- C — Free `StageController::updateStageProperty`: `settings` validated but unhandled; unknown property silently no-ops.
- B — Free `sortStageTasks`: invalid `order`/`orderBy` throws uncaught exception.
- C — Free `FolderService::assertCanModifyFolder` only used on add-board (others still admin-only via policy).

## Hooks (from hooks writer, additions)
- B — `addMembersInBoard()`: `isViewerOnly='no'` stores member access but fires `board_viewer_added` (`!$isViewerOnly` on a string).
- B — `board_member_added`/`board_viewer_added` pass User or Relation depending on path.
- B — `board_stages_reordered` passes old order / single moved stage, never new order.
- B — `task_archived` also fires on restore.
- B — `board_menu_items` never passes a board id.
- B — Pro `send_invitation` listener accepts 3 args → invited role ignored.

## PHP API / CLI / helpers (from functions writer)
- B — `Tasks::createTaskAttachment()` calls non-existent `AttachmentService::addTaskAttachment()` (Pro 2.1.0) → fatal not caught by proxy.
- B — `Commands::crm_role_assign()` saves members to `$board->id` (last loop item) not `$selectedBoard->id` → wrong board.
- C — `crm_role_assign()` says "Invalid Board ID" for a bad tag id.
- B — `Tasks::create()` reads `assignees`, `labels`, `contact_*` without isset → PHP 8 warnings.
- B — `BoardService::createBoard()` reads `$boardData['type']` without isset.
- C — `Tasks::createTask()` empty stub returning null.
- B — `Tasks::deleteSubtask()` returns nothing on success.
- B — `Tasks::updateSubtask()` handles `started_at` but it is not in allowed list → always false.
- B — `Tasks::addAssignees()` reads `$task->board_id` before null check.
- C — `Boards::createLabel()` reads title from `label` key.
- B — `FBSApi` catches `\Exception` only, not `\Error`.
- C — Pro `AttachmentService` imports `FluentCommunity\Framework\Support\Arr` (unused).
- B — `BoardController::getBoardMenuItems()` passes `$board_id` to arg-less `BoardMenuHandler::getMenuItems()`.
- C — `Helper::getFormattedStagesByBoardId()` formatting line commented out.

## Users / managers / webhooks / reports / import / admin (from writer D)
- S — `GET /all-invitations` returns invitation acceptance `hash` (token) to board managers.
- S — Trello import session stores API key + token in plain text in `fbs_metas`.
- S — `wp_ajax_fluent_boards_export_timesheet` has no nonce check (CSV/JSON exports do).
- S — `MCPSettingsController@getConfigSnippet`: `claude-desktop` snippet always sets `NODE_TLS_REJECT_UNAUTHORIZED=0` (`$isLocalDev` unused).
- S — `ReportController@getTimeSheetReport` returns user emails to any board user.
- B — `POST /managers` (`BoardUserController@addUserToBoards`) needs `$userId` the route doesn't provide → broken.
- B — `BoardUserController@removeAdmins`: `sendError()` without `return` for WP admins; execution continues.
- B — `syncBoardRoles` adds new boards as `member`, ignoring requested role.
- C — `addUsersToBoards` rule typo `'nullable||string|in:yes,no'`.
- C — `sendInvitationToBoard` uses status 304 → becomes 422.
- B — `createOutgoingWebhook` drops `method`/`format` via `only([...])`; update stores full body (inconsistent).
- B — Outgoing webhook with no `board_id` ("all boards") creates no relations → never fires.
- C — `task_label_removed` webhook event fires but not offered in UI.
- B — `updateOutgoingWebhook` reads `triggered_events` without isset.
- B — `ProAdminController@updateStorageSettings`: precedence bug calls `get_error_message()` on `false`; DigitalOcean key placeholder (`FBS_ENCRYPTED_DATA_KEY`) not swapped back → re-save stores placeholder; DO never connection-tested.
- B — `getTimeSheetReport` date-only `whereBetween('completed_at')` excludes end date.
- B — Pro `/process-json-import` and `/import-csv` ignore `folderId`.
- B — `CsvController@importBoard` runs `createDefaultStages` per page when no stage column → duplicate stages.
- B — `UserService::memberAssociatedTaskUsers` `->whichBoards` on possibly-null user → `Error` not caught.
- C — `CsvController`, `ProAdminController` use wrong text domains (`fluent-crm`, `fluent-community`).
- C — `CsvController` sets `staus` (typo) instead of `status` for rows without status.
