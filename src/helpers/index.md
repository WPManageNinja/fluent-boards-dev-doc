# Helper Classes

FluentBoards ships a few helper classes that you can use when you build an add-on. The plugin uses them internally, and you are free to use them in your own code.

| Page | Class | What it covers |
|---|---|---|
| [Core Helper](/helpers/service_helper) | `\FluentBoards\App\Services\Helper` | Task/board URLs, stage lists, priorities and reminder types, date normalization, activity logging, user search, input sanitizers, views |
| [Arr](/helpers/arr) | `\FluentBoards\Framework\Support\Arr` | Array helpers from the bundled WPFluent framework (`Arr::get()`, `Arr::only()`, `Arr::pluck()`, …) |
| [Str](/helpers/str) | `\FluentBoards\Framework\Support\Str` | String helpers from the bundled WPFluent framework (`Str::slug()`, `Str::limit()`, `Str::uuid()`, …) |

`Arr` and `Str` live in `vendor/wpfluent/framework/src/WPFluent/Support/` and are autoloaded under the `FluentBoards\Framework\` namespace. Each class has more methods than these pages list, so read the source for the full set.

For the global functions (`FluentBoardsApi()`, `fluent_boards_get_option()`, …), see [Global Functions](/global-functions/).

::: tip
Helper methods do not check permissions. When you use them to return data to a user, check access first, for example with `\FluentBoards\App\Services\PermissionManager::userHasBoardPermission($boardId, 'GET')`.
:::
