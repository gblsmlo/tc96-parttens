# Collection

The screen of one collection: the consumer declares a `CollectionDefinition` (`records`, `getKey`, `getLabel`, `groupings`), `CollectionProvider` holds the `{ layout, groupBy }` preferences, `CollectionFrame` places the toolbar, the layout and the footer, and `CollectionLayoutOutlet` mounts the active layout from the props the consumer passes for it (`calendar`, `datagrid`, `datatable`, `gallery`, `kanban`, `list`, and the `render*Record` functions). The layouts are patterns of their own at the root of `patterns/` (`calendar`, `data-grid`, `data-table`, `gallery`, `kanban`, `list-view`), each with its own `AGENTS.md` holding its rules; this file holds only what the collection adds around them. The pattern never fetches, sorts, persists or ships CSS; its only state is the uncontrolled preferences.
## Map

| Folder | Holds |
| --- | --- |
| `composition/` | `CollectionLayoutOutlet`: picks the layout, projects groups, adapts kanban moves to `onRecordChange`; `CollectionFrame`: the header, body and footer around a toolbar and a layout |
| `store/` | `CollectionProvider` and `useCollectionPreferences` |
| `types/` | the collection contracts (definition, grouping, group, preferences, record change) |
| `shared/components/` | toolbar pieces: search, filter submenus (radio and checkbox), sort submenu, presets, `Action`; the parts Data Grid and Data Table share, each taking its `data-slot` and row selector as props: `SelectionActions`, `RowReorderProvider` with `RowDragHandle` (dnd-kit), and `EditableInputCell` |
| `shared/hooks/` | `useScrollbarInsets`, which Data Table and Data Grid use to start the vertical scrollbar below their sticky header and end it above their sticky footer; the table hooks both views use: `useControllableTableState`, `useLatestCallback`, `useCollapsedGroups`, `useEndReached` and the `useRowReorder` context |
| `shared/lib/` | `projectCollection`, the one function that turns a collection plus a grouping into groups; `skeleton-keys`; `interactive-descendants`, the selector the `ListRow` slots and the `DataTable` row use to keep controls clickable above a stretched trigger, and `interactiveControls`, the same list without `[tabindex]`, which `ListRow` uses to tell a control from a focusable property; the React-free rules both table views use: `group-runs` (group runs, counts and the Data Table sections), `end-reached`, `row-reorder` (gate, move and the `RowMove` and `RowDragAnnouncements` types), `editable-cell` (meta, value change, trigger name) and `format-value` |
| `test/` | `test/dom.ts`, the JSDOM setup the tests import, and `test/jsdom.d.ts` |
| `core.ts` | React-free surface: collection, calendar, data-grid and kanban types, kanban drag helpers, date helpers; workspace only, not reached from the barrel |

Import direction: `composition/` → `store/`, `shared/lib/`, `types/` and the six layout patterns by file path; `shared/` and `store/` → `types/`. The layouts import `shared/` and `types/` back by file path (see their `AGENTS.md`), never `composition/` or `store/`. `shared/components/collection-pagination.tsx` imports only `@tc96/ui/pagination`, `@tc96/ui/button`, `@tc96/ui/select`, `@tc96/utils`, `@phosphor-icons/react` and React. Outside the folder, `shared/components/selection-actions.tsx` (rendered by both table views) imports the `ActionBarContext` type from `packages/ui/src/patterns/action-bar/components/action-bar.tsx`, which makes the registry ship `action-bar/` with `collection`; nothing here imports `packages/ui/src/patterns/toolbar/` at runtime, so `itemAreas` in `packages/registry/src/manifest.ts` makes the `collection` item ship it. Outside the pattern, `data-grid/components/data-grid-pagination.tsx` imports `collection-pagination/components/collection-pagination`, `shared/components/collection-presets-menu.tsx` imports `toolbar/components/collection-toolbar-menu-trigger`, and the stories compose `ViewSettingsMenu` from `view-settings-menu/`.

## Dependents

- `packages/ui/src/patterns/index.ts` re-exports `collection/index` and each layout barrel, plus `KanbanView as Kanban` from `kanban/index`. `collection/index` no longer re-exports the layouts.
- The six layouts import `collection/shared/` and `collection/types/` by file path, so moving a shared file breaks them.
- `scripts/bench-views.ts` (run by `release:check` as `bench:views`) imports `shared/lib/project-collection.ts` by path; `scripts/bench/<layout>.bench.ts` import each `<layout>/index`. Moving a view or `projectCollection` breaks them.
- The folder name `collection` is hardcoded in `packages/registry/src/manifest.ts` (which also maps the `view` alias to it), `packages/registry/src/cli.ts`, `scripts/test-patterns.ts`, `scripts/test-consumer-ssr.ts` and `scripts/test-consumer-registry.ts`.

## Invariants

Collection and outlet:

- `CollectionLayoutOutlet` throws when the active layout is `list` (`renderListRecord`), `datagrid`, `datatable`, `calendar`, `gallery` (`renderGalleryRecord`) or `kanban` (`renderKanbanRecord`) and the matching prop is missing; `projectCollection` throws for `groupBy === null` and for an undeclared dimension. Tests assert the messages.
- Prepared `groups` win over `projectCollection` in list and kanban, and an explicit `[]` never falls back to the source records.
- `kanban.onRecordMove` receives the group of each side, so a handler never parses column ids; a column with no matching group rejects the move. Without it, drag is enabled by `onRecordChange` plus `setGroupId` on the active dimension, and a reorder inside one group returns false, because the collection order is the consumer's. `kanban.onRecordMove` wins when both are passed.
- `kanban.getColumnState(group)` is the only way a Kanban column mounted by the outlet gets a `color`; collapse goes through `kanban.collapsedGroupIds` and `onCollapsedGroupIdsChange`, which the outlet passes through. The column `id` is the group `id`, so the settings callbacks report the group.
- The outlet adds no rule to a layout: it passes the consumer's block through, sets only what the collection owns (`collection`, `grouping`, `columns`, `getKey`, `getRecordLabel`, the record renderer) and `loading` as a fallback, and a value set in the block wins, `false` included. A layout rule belongs to that layout's `AGENTS.md`.

Frame:

- `mode="fill"` bounds the frame (`min-h-0 flex-1`) and scrolls the body; it only holds inside a flex column of bounded height, otherwise it grows like `flow`. A layout that scrolls itself (Data Table, Data Grid, `ListView`) is `min-h-0 flex-1`, so inside the `fill` body only its rows move. The body keeps `overflow-auto` for content beside the layout. `flow` lets the body grow and makes the footer `sticky bottom-0`. Body and footer read the mode from context, not a Tailwind group, so nested frames do not leak.
- `CollectionFrameOverlay` goes inside `CollectionFrameFooter` (`absolute bottom-full`): inside the scrolling body an absolute child would scroll with the records. It centers on the frame, not the viewport, like `DataGridSelectionActions`.

Toolbar:

- `CollectionSearchField` commits on submit and when emptied, never per keystroke. `FilterRadioSubmenu` maps the "all" option to `''`, since a `MenuRadioGroup` cannot represent no choice.
- `FilterRadioSubmenu` with `loading` keeps the "all" option and replaces only `options` with `aria-hidden` skeleton rows, with `aria-busy` on the submenu popup: a `role="menu"` cannot own a `status`, so the rows carry no role of their own.
- `FilterCheckboxSubmenu` shares those skeleton rows and keeps its clear item while loading; the clear item renders only with `clearLabel`, is checked while `value` is empty and does not call `onValueChange` when nothing is checked. Groups are `MenuGroup` with `MenuGroupLabel`, so each is a `role="group"` named by its label.
- `SortRadioSubmenu` is a separate component, not a `FilterRadioSubmenu` prop, because its value is never empty: no sentinel, a required `value` and an `onValueChange` that never receives `''`.

## Styling

| Attribute | Where | Read by |
| `data-slot="collection-frame"`, `data-mode`, `data-slot="collection-frame-header\|body\|footer\|overlay"` | the `CollectionFrame` parts | consumers and tests; not styled |
| `data-layout` | the view settings mode tab | consumers |

Each layout lists its own attributes in its `AGENTS.md`.

- Hover-only affordances pair `group-hover` with `group-focus-within` and `pointer-coarse:opacity-100`, because `hover:` does not fire on touch in v4.

## Verify

```bash
bun test --isolate packages/ui/src/patterns/collection
bunx biome check packages/ui/src/patterns/collection
bun run typecheck && bun run boundaries:check && bun run overrides:check && bun run verify:public-api
cd apps/storybook && bunx vitest run --project=storybook src/patterns/collection
```

A change to the outlet runs the plays of each layout it mounts; their commands are in each layout's `AGENTS.md`.

The stories in `apps/storybook/src/patterns/collection/` follow the six component pages of `Get Started/Component Docs`. The root node `Patterns/Collection` sits in the folder itself: `api-reference.mdx` with its hidden `api-reference.stories.tsx` (`Anatomy`), `playground`, `variants` and `behavior` `.stories.tsx`, over the task screen of `collection-layouts.tsx`, and no `Layouts` page, since each layout is a node of its own. The layout is a parameter: the `layout` control of the Playground and of `Variants` picks it, and no story of the root is named after a layout. The root documents the provider, the frame, the outlet (prepared groups included), the toolbar parts (search field, view settings, filter submenu, `Action`, `PresetsMenu`) and `CollectionPagination`, and its `Behavior` holds their `play` functions (the `Pagination*` stories render `CollectionPagination` alone with the page in `useState`). Its `Usages` page is the six files of `usages/`, which share the title `Patterns/Collection/Usages` with one story each, so each screen keeps its named `render` and its helpers in one file. The one bun test here that cannot run in a browser checks that the outlet throws on a missing required prop. Stories run axe with `test: 'error'`. Fixtures in `fixtures/` are per usage: Tasks reads `tasks.ts`, Pipeline `deals.ts`, Contacts `contacts.ts`, Documents `documents.ts` and Calendar `deal-activities.ts` over `deals.ts`; the root node reads `tasks.ts` through `fixtures/collection-tasks.ts`, and the layout nodes read these fixtures too. `tasks.ts` also exports the people, time zone and clock every fixture imports, and the record-dialog stories import `contacts.ts`, so editing either reaches beyond one usage.

The toolbar with the view switcher lives in the root node's task screen and in the Tasks, Pipeline and Contacts usages (`usages/<usage>.stories.tsx`). Each usage file writes its screen in the meta's named `render`, so the Code panel shows the composition; `fixtures/contacts-usage.tsx` and `fixtures/pipeline-usage.tsx` copy the Contacts and Pipeline screens for `apps/storybook/src/templates/contacts.stories.tsx` and `deal-board.stories.tsx`, so a change to one goes to the other. Every usage mounts its toolbar, layout and footer in `CollectionFrame` (`fill`) under an `h-dvh` page. The Calendar usage and `fixtures/calendar-workspace.tsx` (the `Usages` and `Behavior` of the Calendar layout node) carry `fixtures/calendar-toolbar.tsx`: period, range and filters, no view switcher.

## Pointers

- Public API: `index.ts` and the `collection` entry of `docs/architecture/public-api-exports.json`.
- Decisions: `docs/architecture/tc96-ui.md`, sections "Collection layouts: benchmark por layout" and "Collection: `CollectionFrame` separa toolbar, coleção e rodapé"; accessibility: `docs/accessibility.md`, sections "Regras" and "Boas práticas".
- The layouts: `calendar/`, `data-grid/`, `data-table/`, `gallery/`, `kanban/` and `list-view/`, each with its `AGENTS.md`.
