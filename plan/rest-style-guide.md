# REST API page style guide (for Phase 3 writers)

Site: VitePress (`src/`). Pages live in `src/rest-api/*.md`. Source of truth is the PLUGIN CODE, not old docs.

- Free plugin: `/Users/masiur/Projects/php-wp/authlab/wp-content/plugins/fluent-boards` (routes `app/Http/Routes/api.php`, controllers `app/Http/Controllers`, services `app/Services`, policies `app/Http/Policies`)
- Pro plugin: `/Users/masiur/Projects/php-wp/authlab/wp-content/plugins/fluent-boards-pro` (routes `app/Http/Routes/api.php`, `app/Modules/TimeTracking/routes.php`)
- Roadmap addon: `/Users/masiur/Projects/php-wp/authlab/wp-content/plugins/fluent-roadmap/app/Http/api.php`
- Route inventory with gaps: `dev-docs/plan/inventory-rest-api.md`

## Rules

1. Every live route in your groups gets a section. Remove sections for routes that do not exist in code.
2. Never invent params or response keys. Read the controller method (and the service it calls when the response
   shape depends on it). Response examples: use the keys the controller passes to `sendSuccess([...])`; values may
   be illustrative but realistic. If a shape is too deep to trace, show the top-level keys and say what they hold.
3. Keep correct existing content (prose, examples) when it matches code; fix drift (param names, methods, paths).
4. Pro-only routes: put `<Badge type="tip" text="Pro" />` at the end of the endpoint's `###` heading. Addon-only
   (fluent-roadmap): `<Badge type="info" text="Roadmap add-on" />`. If a whole page is Pro, add a `::: tip Pro` block at the top instead.
5. Mention the policy-level requirement in one line when it is not plain board membership
   (e.g. "Requires board admin", "Requires WordPress admin / FluentBoards manager").

## Page skeleton

```md
# Resource Name

One-paragraph description. Plugin source: free / Pro.

## Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/projects/{board_id}/...` | ... |

## Resource Object        (optional, only when there is a stable model shape)

## List Things

Short description.

```http
GET /wp-json/fluent-boards/v2/projects/{board_id}/things
```

**Parameters**

| Parameter | Type | Required | Description |
|---|---|---|---|

**Example Request**

```bash
curl "https://yourdomain.com/wp-json/fluent-boards/v2/projects/1/things" \
  -u "USERNAME:APPLICATION_PASSWORD"
```

**Example Response**

```json
{ ... }
```
```

- Section headings: `##` per endpoint (keeps the right-hand outline useful; outline shows h2+h3).
- Use `-u "USERNAME:APPLICATION_PASSWORD"` in curl (replace old `-H "Authorization: Basic API_USERNAME:API_PASSWORD"`, which is wrong — the header needs base64).
- POST/PUT bodies: `-H "Content-Type: application/json" -d '{...}'`. File uploads: `-F "file=@/path/file.png"`.
- Internal links: absolute, no `.md`, no trailing slash for non-index pages (`/rest-api/tasks#list-tasks`). Index pages: `/rest-api/`.
- End with: `See [Common Error Responses](/rest-api/shared/error-responses) for standard error formats.`
- Do NOT edit `src/.vitepress/**` (sidebar/config) and do NOT run `vitepress build` (another writer may be building). Report new/removed file names in your final reply.
- VitePress markdown: Vue interpolation `{{ }}` outside code blocks breaks the build — wrap in backticks or code blocks. Raw `<tags>` in prose must be in backticks.
