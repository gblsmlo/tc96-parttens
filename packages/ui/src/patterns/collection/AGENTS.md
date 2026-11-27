# Collection

## Overview

Collection is the screen of one set of records: a toolbar, the layout the user picked, and a footer. The consumer brings the records already prepared. The provider remembers the active layout and grouping. The frame stacks those three areas. The outlet mounts the layout. The pattern never fetches, sorts, persists or ships CSS. Its only state is the uncontrolled preferences.

The six layouts (`calendar`, `data-grid`, `data-table`, `gallery`, `kanban`, `list-view`) are patterns of their own, each with its own `AGENTS.md`. This file holds only what the collection adds around them.

Decisions: `docs/architecture/tc96-ui.md`, sections "Collection layouts: benchmark por layout" and "Collection: `CollectionFrame` separa toolbar, coleção e rodapé". Accessibility: `docs/accessibility.md`, sections "Regras" and "Boas práticas".

## How Can I use

```tsx
<CollectionProvider
  collection={collection}
  defaultPreferences={{ groupBy: null, layout: 'list' }}
>
  <CollectionFrame height="fill">
    <CollectionFrameHeader>
      <CollectionToolbar left={search} right={settings} />
    </CollectionFrameHeader>
    <CollectionFrameBody aria-label="Tarefas">
      <CollectionLayoutOutlet
        collection={collection}
        renderListRecord={renderRow}
      />
    </CollectionFrameBody>
    <CollectionFrameFooter>
      <CollectionPagination
        label="Paginação de tarefas"
        onPageChange={setPage}
        page={page}
        pageCount={pageCount}
        pageSize={pageSize}
        total={total}
      />
      <CollectionFrameOverlay>{selectionActions}</CollectionFrameOverlay>
    </CollectionFrameFooter>
  </CollectionFrame>
</CollectionProvider>
```

`collection`, `search`, `settings`, `renderRow`, the page values and `selectionActions` belong to the consumer. `height="fill"` takes the free height of the parent and scrolls the body. `height="content"` grows with the records and keeps the footer in view. Pass the `render*Record` function, or the `datagrid`, `datatable`, `calendar`, `gallery` or `kanban` block, for each layout the screen offers. Header, toolbar and footer are optional.

## Arquitetura

### Layout

Imports only go down. A layout pattern may import `shared/` and `types/` back by file path. It does not import `composition/` or `store/`.

`index.ts` is the public barrel. `packages/ui/src/patterns/index.ts` re-exports it and each layout barrel, plus `KanbanView as Kanban` from `kanban/index`.

- Has the re-exports meant to be public.
- Does not re-export the six layouts. Does not reach `core.ts`.

`composition/` is the screen the consumer mounts: `CollectionLayoutOutlet` (picks the layout, projects groups, adapts kanban moves to `onRecordChange`) and `CollectionFrame` (header, body and footer).

- Has imports of `store/`, `shared/lib/`, `types/` and the six layout patterns by file path.
- Does not hold a rule that belongs to one layout. Does not fetch, sort, persist or ship CSS.

`store/` is the preferences: `CollectionProvider` and `useCollectionPreferences`.

- Has the `{ layout, groupBy }` state and imports of `types/`.
- Does not import `composition/`, `shared/` or a layout. Does not fetch or persist.

`types/` is the contracts shared across the pattern: definition, grouping, group, preferences, record change.

- Has a type used by more than one folder.
- Does not have React, runtime code, or a type used by one file. That type stays next to the file.

`shared/components/` is the UI used by more than one layout. Toolbar pieces: search, filter submenus (radio and checkbox), sort submenu, presets, `Action`. Table parts, each taking its `data-slot` and row selector as props: `SelectionActions`, `RowReorderProvider` with `RowDragHandle` (dnd-kit), `EditableInputCell`.

- Has a component at least two layouts render.
- Does not import `composition/` or `store/`. `selection-actions.tsx` may import the `ActionBarContext` type from `action-bar/components/action-bar.tsx`, which makes the registry ship `action-bar/` with `collection`. `collection-presets-menu.tsx` imports `toolbar/components/collection-toolbar-menu-trigger`. Nothing else here imports `toolbar/` at runtime, so `itemAreas` in `packages/registry/src/manifest.ts` makes the `collection` item ship it. Stories compose `ViewSettings` from `view-settings/`. Pagination stays in `collection-pagination/`; `data-grid/components/data-grid-pagination.tsx` imports it by path.

`shared/hooks/` is the React state both table views share: `useScrollbarInsets` (the vertical scrollbar starts below the sticky header and ends above the sticky footer), `useControllableTableState`, `useLatestCallback`, `useCollapsedGroups`, `useEndReached` and the `useRowReorder` context.

- Has a hook at least two layouts call.
- Does not render UI. Does not import `composition/` or `store/`.

`shared/lib/` is React-free. `projectCollection` is the one function that turns a collection plus a grouping into groups. Also `skeleton-keys`, `interactive-descendants` (the `ListRow` slots and the `DataTable` row keep controls clickable above a stretched trigger), `interactiveControls` (the same list without `[tabindex]`, so `ListRow` tells a control from a focusable property), and the table rules `group-runs`, `end-reached`, `row-reorder` (`RowMove`, `RowDragAnnouncements`), `editable-cell` and `format-value`.

- Has a pure function at least two layouts share.
- Does not import React, a component, `composition/` or `store/`. `scripts/bench-views.ts` (run by `release:check` as `bench:views`) imports `project-collection.ts` by path, so moving it breaks the bench.

`test/` is the JSDOM setup a bun test imports (`test/dom.ts`, `test/jsdom.d.ts`). Each pattern owns its copy.

- Has the DOM setup.
- Does not have assertions or components.

`core.ts` is the React-free surface for this workspace: collection, calendar, data-grid and kanban types, kanban drag helpers, date helpers.

- Has code that runs without rendering.
- Does not ship through the barrel.

The six layouts import `shared/` and `types/` by file path, so moving a shared file breaks them. `scripts/bench/<layout>.bench.ts` import each `<layout>/index`. The folder name `collection` is hardcoded in `packages/registry/src/manifest.ts` (which also maps the `view` alias to it), `packages/registry/src/cli.ts`, `scripts/test-patterns.ts`, `scripts/test-consumer-ssr.ts` and `scripts/test-consumer-registry.ts`.

### Variants

`height` is the only variant of the frame: `"fill"` (default) and `"content"`. The body and the footer read it from context, not from a Tailwind group, so a nested frame keeps its own height.

The six layouts are not variants of this folder. In the stories, `layout` is a control of the Playground and of Variants. No story of the root is named after a layout, and the root has no Layouts page, because each layout is a node of its own.

## Styling

The pattern ships no CSS. Layout classes only.

| Attribute | Where | Read by |
| --- | --- | --- |
| `data-slot="collection-frame"`, `data-height`, `data-slot="collection-frame-header\|body\|footer\|overlay"` | the `CollectionFrame` parts | consumers and tests; not styled |
| `data-layout` | the view settings mode tab | consumers |

Each layout lists its own attributes in its `AGENTS.md`.

Hover-only affordances pair `group-hover` with `group-focus-within` and `pointer-coarse:opacity-100`, because `hover:` does not fire on touch in v4.

## Usabilidade

`height="fill"` bounds the frame (`min-h-0 flex-1`) and scrolls the body. It holds only inside a flex column of bounded height. Anywhere else the frame grows like `"content"`. A layout that scrolls itself (Data Table, Data Grid, `ListView`) is `min-h-0 flex-1`, so inside a `fill` body only its rows move. The body keeps `overflow-auto` for content placed beside the layout. `height="content"`, the default, sizes the body to the records: a short list keeps its pagination under the last record instead of at the bottom of the page, and inside a bounded flex column the body scrolls once the records overflow (`min-h-0 overflow-auto`, no `flex-1`), so the collection owns the scroll without a scrolling parent. The footer is `sticky bottom-0`. `"fill"` stretches the body to the free height, which pins the footer to the bottom of the frame.

`CollectionFrameOverlay` sits inside `CollectionFrameFooter` (`absolute bottom-full`). Inside the scrolling body an absolute child would scroll with the records. It centers on the frame, not the viewport, like `DataGridSelectionActions`.

`CollectionSearchField` commits on submit and when emptied, never per keystroke. A `FilterRadioSubmenu` or `FilterCheckboxSubmenu` with `loading` keeps its standing option (the "all" option, or the clear item when `clearLabel` is set) and replaces only `options` with `aria-hidden` skeleton rows. `aria-busy` is on the submenu popup: a `role="menu"` cannot own a `status`, so the rows carry no role of their own.

## Testing

The stories in `apps/storybook/src/patterns/collection/` follow the six component pages of `Get Started/Component Docs`. The root node `Patterns/Collection` sits in the folder itself: `api-reference.mdx` with its hidden `api-reference.stories.tsx` (`Anatomy`), `playground`, `variants` and `behavior` `.stories.tsx`, over the task screen of `collection-layouts.tsx`. The root documents the provider, the frame, the outlet (prepared groups included), the toolbar parts (search field, view settings, filter submenu, `Action`, `PresetsMenu`) and `CollectionPagination`. `Behavior` holds their `play` functions. The `Pagination*` stories render `CollectionPagination` alone with the page in `useState`. `Usages` is the six files of `usages/`, which share the title `Patterns/Collection/Usages` with one story each, so each screen keeps its named `render` and its helpers in one file. Stories run axe with `test: 'error'`.

The one bun test here that cannot run in a browser checks that the outlet throws on a missing required prop. A change to the outlet also runs the plays of each layout it mounts. Those commands are in each layout's `AGENTS.md`.

Fixtures in `fixtures/` are per usage: Tasks reads `tasks.ts`, Pipeline `deals.ts`, Contacts `contacts.ts`, Documents `documents.ts` and Calendar `deal-activities.ts` over `deals.ts`. The root node reads `tasks.ts` through `fixtures/collection-tasks.ts`, and the layout nodes read these fixtures too. `tasks.ts` also exports the people, time zone and clock every fixture imports, and the record-dialog stories import `contacts.ts`, so editing either reaches beyond one usage.

The toolbar with the view switcher lives in the root node's task screen and in the Tasks, Pipeline and Contacts usages (`usages/<usage>.stories.tsx`). Each usage file writes its screen in the meta's named `render`, so the Code panel shows the composition. `fixtures/contacts-usage.tsx` and `fixtures/pipeline-usage.tsx` copy the Contacts and Pipeline screens for `apps/storybook/src/templates/contacts.stories.tsx` and `deal-board.stories.tsx`, so a change to one goes to the other. Every usage mounts its toolbar, layout and footer in `CollectionFrame` (`fill`) under an `h-dvh` page. The Calendar usage and `fixtures/calendar-workspace.tsx` (the `Usages` and `Behavior` of the Calendar layout node) carry `fixtures/calendar-toolbar.tsx`: period, range and filters, no view switcher.

## Rules e Guardrails

Outlet:

- `CollectionLayoutOutlet` throws when the active layout is `list` (`renderListRecord`), `datagrid`, `datatable`, `calendar`, `gallery` (`renderGalleryRecord`) or `kanban` (`renderKanbanRecord`) and the matching prop is missing. `projectCollection` throws for `groupBy === null` and for an undeclared dimension. Tests assert the messages.
- Prepared `groups` win over `projectCollection` in list and kanban, and an explicit `[]` never falls back to the source records.
- `kanban.onRecordMove` receives the group of each side, so a handler never parses column ids. A column with no matching group rejects the move. Without it, drag is enabled by `onRecordChange` plus `setGroupId` on the active dimension, and a reorder inside one group returns false, because the collection order is the consumer's. `kanban.onRecordMove` wins when both are passed.
- `kanban.getColumnState(group)` is the only way a Kanban column mounted by the outlet gets a `color`. Collapse goes through `kanban.collapsedGroupIds` and `onCollapsedGroupIdsChange`, which the outlet passes through. The column `id` is the group `id`, so the settings callbacks report the group.
- The outlet adds no rule to a layout. It passes the consumer's block through, sets only what the collection owns (`collection`, `grouping`, `columns`, `getKey`, `getRecordLabel`, the record renderer) and `loading` as a fallback, and a value set in the block wins, `false` included. A layout rule belongs to that layout's `AGENTS.md`.

Toolbar:

- `FilterRadioSubmenu` maps the "all" option to `''`, since a `MenuRadioGroup` cannot represent no choice.
- `FilterCheckboxSubmenu` keeps its clear item while loading. The clear item renders only with `clearLabel`, is checked while `value` is empty and does not call `onValueChange` when nothing is checked. Groups are `MenuGroup` with `MenuGroupLabel`, so each is a `role="group"` named by its label.
- `SortRadioSubmenu` is a separate component, not a `FilterRadioSubmenu` prop, because its value is never empty: no sentinel, a required `value` and an `onValueChange` that never receives `''`.

Moving a file under `shared/` or `types/`, re-exporting a layout from `collection/index`, or renaming the `collection` folder breaks the layouts, the benches or the registry. See Layout.

## Comandos

```bash
bun run test:scope collection          # biome, bun test, boundaries, overrides and the plays of src/patterns/collection/ (62s)
bun run test:scope collection --deps   # adds the plays of the six layouts the outlet mounts (4 min)
bun test --isolate packages/ui/src/patterns/collection
bunx biome check packages/ui/src/patterns/collection
bun run typecheck && bun run boundaries:check && bun run overrides:check && bun run verify:public-api
cd apps/storybook && bunx vitest run --project=storybook src/patterns/collection
```
