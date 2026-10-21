# Templates package

Installable templates: whole layouts that compose COSS components, `elements`, `helpers` and pattern modules, copied into the consumer by `tc96-parttens add <template>` ([ADR 0005](../../.specs/adr/0005-installable-templates.md)). The first group is `application/shell/` with `AppShell1` to `AppShell4`. A template is controlled like a pattern: data comes through props, links through `renderLink`, events through callbacks; it never fetches, persists, reads cookies or applies a theme. Templates that only live in Storybook (`Templates/Contacts` and the other CRM pages) stay in `apps/storybook/src/templates/` under [ADR 0004](../../.specs/adr/0004-templates-only-in-storybook.md).

## Map

| Folder | Holds |
| --- | --- |
| `src/<category>/<group>/<template>/` | one installable template; its `index.ts` is the module the consumer imports and the entry the registry walks |
| `src/<category>/<group>/shared/` | parts used by more than one template of the group; internal, shipped with every item that imports them |
| `src/application/shell/shared/` | types, labels, `renderAnchor`, `ShellNav`, `WorkspaceSwitcher`, `UserMenu`, `ShellHeader`, `ShellSearch`, `ShellNotifications` |
| `src/application/shell/app-shell-3/` | also `project-nav.tsx` and `usage-card.tsx`, used only there |
| `src/application/shell/app-shell-4/` | also `section-rail.tsx`, used only there |

Import direction: a template folder → its group's `shared/` and its own files; `shared/` → COSS, `@tc96/elements`, `@tc96/helpers`, never a template folder; no template imports another template. Patterns come by file path (`@tc96/parttens/widgets/shared/progress-ring`), never through the `@tc96/parttens` barrel, so the item ships only that file.

## Dependents

- `packages/registry/src/manifest.ts` lists every template in `templateNames` and maps it to its folder in `templateSources`; `manifest.test.ts` fails when a folder with an `index.ts` is missing from the map.
- `scripts/verify-public-api.ts` records each template `index.ts` as `template:<name>` in `docs/architecture/public-api-exports.json`.
- `apps/storybook/src/application/shell/` (stories titled `Application/Shell/AppShell{n}`, at the sidebar root) imports each template through `@tc96/templates/<path>` and the fixtures import the shared types through the `app-shell-1`, `app-shell-3` and `app-shell-4` barrels.
- `apps/storybook/src/templates/fixtures/app-shell.tsx` imports `AppShell1` and the `application/shell/fixtures/shell-data.tsx` fixtures; `withAppShell` wraps every `Templates/*` page as a decorator, with the active nav item and the breadcrumb of that page.
- Nothing in `packages/` imports `@tc96/templates`; `boundaries:check` enforces it.

## Invariants

- Every template folder is reachable as `@tc96/templates/<category>/<group>/<template>` through the package `exports` (`./*` to `./src/*/index.ts`) and installs to the same path under the consumer's `templates` alias.
- `shared/` files are not re-exported by a template `index.ts`; only types are. Renaming a `shared/` file changes the files every installed shell carries.
- Every visible or accessible text is a `ShellLabels` key with a pt-BR default in `shared/labels.ts`; `labels` is partial and merged over the defaults.
- Links render through `renderLink(href)` as the Base UI `render` element of `SidebarMenuButton`, `SidebarMenuSubButton` and `BreadcrumbLink`; the default `renderAnchor` carries a `biome-ignore` because the text arrives through the render prop.
- Active items set both `isActive` (COSS `data-active`) and `aria-current="page"`. A branch with sub items starts open when it or a child is active. A leaf with `actions` shows the actions menu and drops its `badge`, because both sit at the right edge.
- `ShellSearch` owns its open state and the ⌘K / Ctrl+K listener on `document`; picking a route closes the dialog, then calls `onNavigate(href)`.
- `AppShell4` nests two `Sidebar collapsible="none"` (rail and section panel) inside one `Sidebar collapsible="icon"`, with `--sidebar-width` set to the icon width plus `16rem`; collapsing clips the panel and picking a section calls `setOpen(true)`. The workspace switcher and the account menu run `compact` in the rail, with their tooltips always shown.
- The section of `AppShell4` is controlled by `sectionId`; the template keeps no copy of it.
- Every shell gives `SidebarInset` `min-w-0`. The inset is a flex item of the provider's row, so without it a wide child (a `DataTable`, a `KanbanView`) widens the inset past the viewport and the page scrolls sideways instead of the child's own container.

## Styling

- No border, radius, color or shadow class on a COSS part except where listed in `scripts/override-exceptions.json`; layout, size and typography classes are allowed (`SidebarHeader className="h-14 justify-center px-4"`, `Separator className="me-2 h-4"`, `Badge className="absolute -end-1 -top-1"`).
- `AvatarFallback className="text-foreground"` in `shared/user-menu.tsx`: the fallback sits on `bg-border` and inherited the muted `sidebar-foreground` (3.83:1 light). `overrides:check` does not see `AvatarFallback` re-exported by `@tc96/elements/avatar`, so the reason and ratios are in `docs/architecture/tc96-parttens.md` (Templates: App Shells).
- The workspace logo is an `IconFrame` with `bg-sidebar-primary text-sidebar-primary-foreground`, the sidebar's own pair; `bg-muted` vanished on `bg-sidebar` in dark.
- `UsageCard` and the notification rows are template elements on sidebar or popover tokens (`bg-sidebar-accent text-sidebar-accent-foreground`, `hover:bg-accent`).

## Verify

```bash
bunx biome check packages/templates apps/storybook/src/application apps/storybook/src/templates
bun run typecheck && bun run storybook:typecheck
bun run boundaries:check && bun run overrides:check && bun run verify:public-api
bun test --isolate packages/registry/src
cd apps/storybook && bunx vitest run --project=storybook --project=storybook-dark src/application src/templates
bun run test:consumer:registry
```

## Pointers

- [ADR 0005](../../.specs/adr/0005-installable-templates.md) and the plan `.specs/app-shell-templates/tasks/0001-app-shell-templates.md`.
- `docs/architecture/tc96-parttens.md`, section Templates: App Shells, for contrast ratios and the decisions behind the shells.
- `apps/storybook/src/templates/doc.mdx` (`Templates/Doc`) for the consumer commands.
