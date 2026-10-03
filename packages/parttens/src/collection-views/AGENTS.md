# Collection views pattern

Guide for agents working in `packages/parttens/src/collection-views`. The repo-wide rules in the root `AGENTS.md` still apply: no comments in code, Biome formatting, `cn` only at the boundary with an external `className`, COSS through `@tc96/ui/<component>`, no business rules inside the pattern. The folder follows the pattern structure described there (`composition/`, `shared/`, `store/`, `types/`, `views/`, `test/`, `core.ts`), the same layout as `checklist`, `detail-sheet` and `editable`. It is the largest pattern: five independently usable views plus the provider and outlet that switch between them.

## What it is

A controlled set of renderers for one collection: the consumer declares a `CollectionDefinition` (`items`, `getKey`, `getLabel`, `groupings`), `CollectionProvider` holds the `{ view, groupBy }` preferences, and `CollectionViewOutlet` mounts the active view: `KanbanView`, `ListView`, `DataGrid`, `DataTable` or `CalendarView`. Each view also mounts on its own. Kanban and Calendar drag with dnd-kit and report the move to the consumer, who accepts or rejects it; Data Grid and Data Table are built on TanStack Table v9 instances created by `useDataGrid` and `useDataTable`. `shared/` holds the toolbar pieces (search, view selector, view settings, filter submenu, presets, selection action bar) and `projectCollection`, the one function that turns a collection plus a grouping into groups.

## Files

Top level:

| File | Owns | Public |
| --- | --- | --- |
| `index.ts` | the barrel: re-exports `composition/`, `shared/`, `store/`, `types/` and the five `views/*/index.ts` | yes |
| `core.ts` | the React-free surface: calendar date and zoned time helpers from `@tc96/helpers`, `projectCollection`, the collection types, the calendar, data-grid and kanban types, `DATA_GRID_COLUMN_TYPES`, and the kanban drag helpers (`createCardDragId`, `createColumnDropId`, `findCardLocation`, `parseCardDragId`, `parseColumnId`, `projectKanbanColumns`, `resolveKanbanCardMove`) | workspace only; nothing imports it and the barrel does not reach it |
| `test/dom.ts` | the JSDOM setup the test files import; a copy owned by this pattern | — |
| `test/jsdom.d.ts` | `declare module 'jsdom'` for the test setup | — |
| `vite-env.d.ts` | `/// <reference types="vite/client" />` from isolated development; nothing imports it and the registry does not ship it | — |

`composition/`, the compound the consumer mounts:

| File | Owns | Public |
| --- | --- | --- |
| `composition/index.ts` | re-exports `CollectionViewOutlet` and its props types | through the barrel |
| `composition/collection-view-outlet.tsx` | `CollectionViewOutlet` and `CollectionViewOutletProps`, `CollectionCalendarViewProps`, `CollectionDataGridViewProps`, `CollectionDataTableViewProps`, `CollectionKanbanViewProps`, `CollectionListViewProps` | yes |
| `composition/collection-view-outlet.test.tsx` | JSDOM tests: renders `DataTable`, throws without `datatable` or `calendar` | — |
| `composition/prepared-groups.test.tsx` | JSDOM tests: prepared `groups` win over the collection in list and kanban mode | — |

`shared/`, toolbar pieces and the grouping function used by more than one view:

| File | Owns | Public |
| --- | --- | --- |
| `shared/index.ts` | re-exports every shared component below except the menu trigger, plus `projectCollection` | through the barrel |
| `shared/lib/project-collection.ts` | `projectCollection` | yes |
| `shared/components/action-bar.tsx` | `ActionBar` (`role="toolbar"` over the selected rows) and `ActionBarContext`, `ActionBarGroup`, `ActionBarItem`, `ActionBarProps` | yes |
| `shared/components/collection-selection-actions.tsx` | the aliases `CollectionSelectionActions`, `CollectionSelectionAction`, `CollectionSelectionActionContext`, `CollectionSelectionActionGroup`, `CollectionSelectionActionsProps` over `ActionBar` | yes |
| `shared/components/collection-selection-actions.test.tsx` | JSDOM tests for `ActionBar` and the alias | — |
| `shared/components/collection-action.tsx` | `Action`: a primary `ToolbarButton` | yes |
| `shared/components/collection-filter-submenu.tsx` | `FilterRadioSubmenu`: single-value filter with an "all" option | yes |
| `shared/components/collection-filter-submenu.test.tsx` | JSDOM tests for the "all" sentinel | — |
| `shared/components/collection-presets-menu.tsx` | `PresetsMenu`: menu trigger with a count `Badge` | yes |
| `shared/components/collection-search-field.tsx` | `CollectionSearchField`: a `ToolbarInput` form that commits on submit | yes |
| `shared/components/collection-search-field.test.tsx` | JSDOM tests for the commit rules | — |
| `shared/components/collection-selected-view.tsx` | `SelectedViewMenu` (a `Popover`), `SelectedViewSearch`, `SelectedViewItems`, `SelectedViewItem`, `SelectedViewCreate` | yes |
| `shared/components/collection-toolbar-menu-trigger.tsx` | `CollectionToolbarMenuTrigger`: `MenuTrigger` → `ToolbarButton` → ghost `Button` used by the presets and settings menus | no |
| `shared/components/collection-view-settings.tsx` | `ViewSettingsMenu` (mode tabs, children sections, clear and save items) and `ViewSettingsSection` | yes |

`store/`, the preferences context:

| File | Owns | Public |
| --- | --- | --- |
| `store/index.ts` | re-exports `CollectionProvider`, `useCollectionPreferences` and their types | through the barrel |
| `store/collection-provider.tsx` | `CollectionProvider`, `useCollectionPreferences`, `CollectionProviderProps`, `CollectionProviderValue`, `CollectionPreferencesContextValue` | yes |

`types/`, contracts shared across the pattern:

| File | Owns | Public |
| --- | --- | --- |
| `types/index.ts` | re-exports every type of `collection.ts` | through the barrel |
| `types/collection.ts` | `CollectionDefinition`, `CollectionGroupingDimension`, `CollectionGroupingId`, `CollectionOption`, `CollectionGroup`, `CollectionPreferences`, `CollectionPreferencesChangeDetails`, `CollectionPreferencesChangeReason`, `CollectionViewMode` and the deprecated alias `CollectionView` | yes |

`views/calendar/`, month and time-grid calendar with rescheduling:

| File | Owns | Public |
| --- | --- | --- |
| `views/calendar/index.ts` | re-exports the components below, the calendar types and the `@tc96/helpers` date functions (`addCalendarDays`, `calendarDateKey`, `calendarRange`, `compareCalendarDates`, `isSameCalendarDate`, `parseCalendarDateKey`, `startOfWeek`, `fromZonedDateTime`, `getTimeZoneOffsetMs`, `toZonedDateTime`, `ZonedDateTime`) | through the barrel |
| `views/calendar/README.md` | what `CalendarView` is and its `## Benchmark` section: scenarios, how to run and compare, the baseline numbers | — |
| `views/calendar/types.ts` | `CalendarDate`, `CalendarViewMode`, `CalendarItemSchedule`, `CalendarItemPlacement`, `CalendarItemRenderContext`, `CalendarItemReschedule` | yes |
| `views/calendar/components/calendar-view.tsx` | `CalendarView` and `CalendarViewProps`: range, segments, labels, drag provider and overlay | yes |
| `views/calendar/components/calendar-view.test.tsx` | JSDOM tests for month placement, today marks, loading, `+N`, draggable markers, the time grid split, day mode and the now line | — |
| `views/calendar/components/calendar-view-drag.test.tsx` | JSDOM drag tests with layout mocks: an accepted move re-renders only the moved item, rejection and a rejected promise roll back, confirming through props renders nothing | — |
| `views/calendar/components/calendar-month-grid.tsx` | `CalendarMonthGrid`: weekday header and one row per week | yes |
| `views/calendar/components/calendar-month-day-cell.tsx` | `CalendarMonthDayCell`: droppable day cell, visible chips and the `+N` overflow | no |
| `views/calendar/components/calendar-time-grid.tsx` | `CalendarTimeGrid`: day headings, all-day strip, hour labels and the scrolling columns | yes |
| `views/calendar/components/calendar-day-column.tsx` | `CalendarDayColumn`: droppable timed column with lanes and the now line | yes |
| `views/calendar/components/calendar-all-day-cell.tsx` | `CalendarAllDayCell`: droppable all-day cell | yes |
| `views/calendar/components/calendar-event-chip.tsx` | `CalendarEventChip` (`article`), `CalendarEventChipTime`, `CalendarEventChipTitle`, `CalendarEventChipOpenTrigger`, `calendarEventChipVariants` and the tone and display types | yes |
| `views/calendar/components/calendar-item-skeleton.tsx` | `CalendarItemSkeleton` | yes |
| `views/calendar/components/draggable-calendar-item.tsx` | `DraggableCalendarItem` and `CALENDAR_ITEM_SENSORS`: the drag handle wrapper around a segment | no |
| `views/calendar/components/calendar-segment-content.tsx` | `CalendarSegmentContent`: the memoized leaf that rebuilds the render context from primitive props and calls `renderItem` | no |
| `views/calendar/components/calendar-segment-content.test.tsx` | JSDOM tests for each path that re-runs `renderItem` (identity, item, minutes, `isStart`/`isEnd`, navigation) | — |
| `views/calendar/hooks/use-calendar-drag-and-drop.ts` | `useCalendarDragAndDrop`: optimistic overrides, pending reschedule and focus restore | no |
| `views/calendar/hooks/use-calendar-drag-and-drop.test.tsx` | JSDOM tests for accept, rollback, rejection and cancel | — |
| `views/calendar/hooks/use-now.ts` | `useNow`: controlled instant or a one-minute ticker | no |
| `views/calendar/lib/calendar-layout.ts` | `segmentItems`, `timeGridPosition`, `assignTimeGridLanes`, `MINUTES_IN_DAY` and the segment and lane types | no |
| `views/calendar/lib/calendar-layout.test.ts` | unit tests for segmenting, positions and lanes | — |
| `views/calendar/lib/drag-and-drop.ts` | `createCalendarItemDragId`, `parseCalendarItemDragId`, `createCalendarDropId`, `resolveDayDrop`, `snapToSlot`, `resolveTimeColumnDrop`, `resolveCalendarDrop` and the drag data types | no |
| `views/calendar/lib/drag-and-drop.test.ts` | unit tests for drag ids and drop resolution across DST | — |

`views/data-grid/`, the WAI-ARIA grid on TanStack Table (components, hooks and lib; `views/data-grid/AGENTS.md` has the full file map and the invariants, `views/data-grid/README.md` the usage and benchmark):

| File | Owns | Public |
| --- | --- | --- |
| `views/data-grid/index.ts` | re-exports everything public below | through the barrel |
| `views/data-grid/types.ts` | `DataGridCellVariant`, `DATA_GRID_COLUMN_TYPES`, `DataGridColumnType`, `DataGridAlign`, `DataGridDensity`, `DataGridSelectOption`, `DataGridCellValueChange`, `DataGridColumnMeta` | yes |
| `views/data-grid/lib/data-grid-features.ts` | `dataGridFeatures` (the `tableFeatures` set with full `filterFns` and `sortFns`), `DataGridFeatures`, `DataGridTable`, `DataGridColumnDef`, `DataGridColumn`, `DataGridHeader`, `DataGridTableMeta` | yes |
| `views/data-grid/lib/create-select-column.tsx` | `createSelectColumn` | yes |
| `views/data-grid/lib/*.ts` | pure helpers: constants, column layouts, cell registry, selection, group runs, body entries, row index, resize, virtual scroll, value formatting | no |
| `views/data-grid/hooks/use-data-grid.ts` | `useDataGrid`, `UseDataGridOptions`, `UseDataGridReturn` | yes |
| `views/data-grid/hooks/use-data-grid-*.ts`, `use-collapsed-groups.ts`, `use-column-layouts.ts`, `use-latest-callback.ts` | rows model, cell selection, focus, delegated cell events, drag-scroll, virtualizer, row context | no |
| `views/data-grid/components/data-grid.tsx` | `DataGrid` and `DataGridProps` | yes |
| `views/data-grid/components/data-grid-{header-rows,column-header,column-menu,resize-handle,body,row,body-cell,group-row,skeleton-rows,empty-row,add-row,footer,selection-actions}.tsx` | the internal pieces of the grid, one component per file; `DataGridRow` and `DataGridBodyCell` are memoized | no |
| `views/data-grid/components/data-grid-cell.tsx` | `DataGridCell`: the default renderer per `meta.variant` | yes |
| `views/data-grid/components/data-grid-column-type-icon.tsx` | `DATA_GRID_COLUMN_TYPE_ICONS`, `DataGridColumnTypeIcon` | yes |
| `views/data-grid/components/data-grid-pagination.tsx` | `DataGridPagination`, `DataGridPaginationProps`, `PaginatedTable`; renders `CollectionPagination` from `packages/parttens/src/shared` | yes |
| `views/data-grid/components/data-grid-{search,filter-menu,selection-summary,sort-submenu,columns-submenu,density-submenu}.tsx` | the toolbar parts and their props | yes |
| `views/data-grid/**/*.test.ts(x)` | JSDOM tests next to the file they cover | - |

`views/data-table/`, the semantic table on COSS `Table`:

| File | Owns | Public |
| --- | --- | --- |
| `views/data-table/index.ts` | re-exports the two files below | through the barrel |
| `views/data-table/README.md` | what `DataTable` is and its `## Benchmark` section: scenarios, how to run and compare, the baseline numbers | — |
| `views/data-table/data-table.tsx` | `DataTable`, `DataTableProps` | yes |
| `views/data-table/data-table-row.tsx` | `DataTableRow`: the memoized row below the component that calls `useTable`; invalidates on `row`, `selected`, `canSelect`, the visible columns and `meta` | no |
| `views/data-table/data-table-row.test.tsx` | JSDOM tests for each prop that re-renders a row and for the render counts of select, sort and parent re-render | — |
| `views/data-table/use-data-table.ts` | `useDataTable`, `dataTableFeatures`, `DataTableFeatures`, `DataTableTable`, `DataTableColumnDef`, `UseDataTableOptions`, `UseDataTableReturn` | yes |
| `views/data-table/data-table.test.tsx` | JSDOM tests for semantics, `bordered`, selection, footer, empty, loading and pagination | — |

`views/kanban/`, the board:

| File | Owns | Public |
| --- | --- | --- |
| `views/kanban/index.ts` | re-exports the components below, `useActiveColumnId` and the kanban types | through the barrel |
| `views/kanban/README.md` | what `KanbanView` is and its `## Benchmark` section: scenarios, how to run and compare, the baseline numbers | — |
| `views/kanban/types.ts` | `KanbanColumnData`, `KanbanColumnActions`, `KanbanCardMove`, `KanbanColumnOption` | yes |
| `views/kanban/components/kanban-view.tsx` | `KanbanView`, `KanbanViewProps`: column selector, board scroll area, drag provider and overlay | yes |
| `views/kanban/components/kanban-view.test.tsx` | JSDOM tests for loading, column metadata, color overlay, collapsed and hidden columns, header actions | — |
| `views/kanban/components/kanban-column.tsx` | `KanbanColumn`, `KanbanColumnProps` and the internal header, cards list, memoized card wrapper and empty state | yes |
| `views/kanban/components/kanban-card.tsx` | `KanbanCard` (`article`), `KanbanCardHeader`, `KanbanCardTitle`, `KanbanCardDescription`, `KanbanCardAction`, `KanbanCardActionButton`, `KanbanCardOpenTrigger`, `KanbanCardContent`, `KanbanCardBody`, `KanbanCardBodyRow`, `KanbanCardFooter`, `kanbanCardVariants`, `KanbanCardDisplay` and the props types | yes |
| `views/kanban/components/kanban-card.test.tsx` | JSDOM tests for the variants, the card anatomy, `render` and the open-trigger/action contract | — |
| `views/kanban/components/kanban-card-skeleton.tsx` | `KanbanCardSkeleton` | yes |
| `views/kanban/components/kanban-badge.tsx` | `KanbanBadge`: a secondary `Badge`; `tone` is accepted and ignored | yes |
| `views/kanban/components/kanban-column-selector.tsx` | `KanbanColumnSelector`: the `md:hidden` column switcher | yes |
| `views/kanban/components/sortable-kanban-card.tsx` | `SortableKanbanCard` and `KANBAN_CARD_SENSORS`: the `useSortable` wrapper with the drag handle | no |
| `views/kanban/hooks/use-active-column-id.ts` | `useActiveColumnId` | yes |
| `views/kanban/hooks/use-horizontal-drag-scroll.ts` | `useHorizontalDragScroll`: pointer drag-scroll of the board viewport | no |
| `views/kanban/hooks/use-kanban-drag-and-drop.ts` | `useKanbanDragAndDrop`: optimistic columns, pending move and focus restore | no |
| `views/kanban/lib/drag-and-drop.ts` | `createCardDragId`, `parseCardDragId`, `createColumnDropId`, `parseColumnId`, `findCardLocation`, `projectKanbanColumns`, `resolveKanbanCardMove`, `CardLocation` | through `core.ts` only |

`views/list/`, the grouped or flat list:

| File | Owns | Public |
| --- | --- | --- |
| `views/list/index.ts` | re-exports the components below | through the barrel |
| `views/list/README.md` | what `ListView` is and its `## Benchmark` section: scenarios, how to run and compare, the baseline numbers | — |
| `views/list/components/list-view.tsx` | `ListView`, `ListViewProps` | yes |
| `views/list/components/list-view.test.tsx` | JSDOM tests for loading, group metadata, flat mode and `collapseEmptyGroups` | — |
| `views/list/components/list-view-item.tsx` | `ListViewItem`: the memoized leaf that calls `renderItem(item)` in the flat list and in each group | no |
| `views/list/components/list-view-renders.test.tsx` | JSDOM tests for each path that re-runs `renderItem` (identity, replaced item, uncontrolled and controlled collapse) in the flat and grouped paths | — |
| `views/list/components/list-group.tsx` | `ListGroup`, `ListGroupProps`, `ListGroupActions`: a `Collapsible` section with header, count and add button | yes |
| `views/list/components/list-item.tsx` | `ListItem` (`article`) and its slots `ListItemHeader`, `ListItemLeading`, `ListItemBody`, `ListItemTitle`, `ListItemTitleTrigger`, `ListItemDescription`, `ListItemContent`, `ListItemFooter`, `ListItemTrailing`, `ListItemField`, `ListItemAction`, `ListItemDensity`, the props types, and `ListItemHeadingLevelContext` | yes, except `ListItemHeadingLevelContext`, which the barrel does not export |
| `views/list/components/list-item.test.tsx` | JSDOM tests for the anatomy, densities, `always` and the title trigger | — |
| `views/list/components/list-item-skeleton.tsx` | `ListItemSkeleton` | yes |

Only what `index.ts` exports is public, and `packages/parttens/src/index.ts` re-exports this barrel whole plus `KanbanView as Kanban`. The registry follows imports from `index.ts`, so it copies every file this barrel reaches and nothing else: tests, `test/`, `vite-env.d.ts` and `core.ts` do not ship. A new file must be imported from one of these, and nothing in a view's `hooks/`, `lib/` or an internal component should be exported from a barrel without a reason recorded in `docs/architecture/tc96-parttens.md`. The `styles/global.css` this pattern once carried was removed on 2026-10-03; patterns carry no CSS.

Import direction inside the folder: `composition/` → `store/`, `shared/lib/`, `types/` and the five `views/`; each view → its own `components/`, `hooks/`, `lib/`, `types.ts`, plus `shared/lib/project-collection.ts`, `types/` and, in `data-grid`, the `ActionBarContext` type from `shared/components/action-bar.tsx`; `shared/` and `store/` → `types/`; views never import each other. Three files reach the package-level shared area outside this folder: `shared/components/collection-filter-submenu.tsx` and `views/data-grid/components/data-grid-{density,columns}-submenu.tsx` import `packages/parttens/src/shared/components/menu-selection-item`, and `views/data-grid/components/data-grid-pagination.tsx` imports `packages/parttens/src/shared/components/collection-pagination`. Dates come from `@tc96/helpers/calendar-date`, `@tc96/helpers/zoned-date-time` and `@tc96/helpers/date`. Third-party: `@dnd-kit/react`, `@dnd-kit/dom`, `@dnd-kit/abstract`, `@dnd-kit/collision`, `@dnd-kit/helpers`, `@tanstack/react-table`, `@tanstack/react-virtual`, `@base-ui/react` (`merge-props`, `use-render`), `class-variance-authority`, `lucide-react`.

## Public API

```ts
type CollectionViewMode = 'calendar' | 'datagrid' | 'datatable' | 'kanban' | 'list'

interface CollectionDefinition<TItem> {
  getKey: (item: TItem) => string | number
  getLabel: (item: TItem) => string
  groupings: readonly CollectionGroupingDimension<TItem>[]
  items: readonly TItem[]
}

interface CollectionGroupingDimension<TItem> {
  getGroupId: (item: TItem) => string | null   // null lands in the trailing unassigned group
  id: CollectionGroupingId
  label: string
  options: readonly CollectionOption[]          // { icon?, id, label }, one group each, in this order
  unassignedLabel?: string                      // default 'Sem valor'
}

interface CollectionPreferences {
  groupBy: CollectionGroupingId | null          // null is the flat collection; List and DataGrid render it
  view: CollectionViewMode
}

interface CollectionProviderProps<TItem> {
  children: ReactNode | ((context: CollectionProviderValue<TItem>) => ReactNode)
  collection: CollectionDefinition<TItem>
  defaultPreferences?: Partial<CollectionPreferences>   // uncontrolled start; view defaults to 'kanban'
  onPreferencesChange?: (preferences: CollectionPreferences, details: { reason: 'grouping' | 'view' }) => void
  preferences?: CollectionPreferences                   // controlled
}

interface CollectionViewOutletProps<TItem extends RowData> {
  collection: CollectionDefinition<TItem>
  groups?: readonly CollectionGroup<TItem>[]    // prepared groups; skips projectCollection in list and kanban
  calendar?: Omit<CalendarViewProps<TItem>, 'collection'>                   // required when view is 'calendar'
  datagrid?: DataGridProps<TItem>                                           // required when view is 'datagrid'
  datatable?: DataTableProps<TItem>                                         // required when view is 'datatable'
  kanban?: Omit<KanbanViewProps<TItem>, 'columns' | 'getKey' | 'renderCard'>
  list?: Omit<ListViewProps<TItem>, 'collection' | 'grouping' | 'renderItem'>
  renderKanbanItem: (item: TItem) => ReactNode
  renderListItem: (item: TItem) => ReactNode
}

interface KanbanViewProps<TCard> {
  columns: KanbanColumnData<TCard>[]            // { id, title, count, cards, color?, collapsed?, hidden? }
  renderCard: (card: TCard) => ReactNode
  getKey: (card: TCard) => string | number
  getCardLabel?: (card: TCard) => string        // drag handle name "Mover card {label}"
  getColumnActions?: (column: KanbanColumnData<TCard>) => KanbanColumnActions | undefined
  emptyColumnLabel?: string
  loading?: boolean
  loadingCardCount?: number                     // default 1 per column
  loadingCardLabel?: string
  mobileColumnHint?: string
  onMoveCard?: (move: KanbanCardMove<TCard>) => boolean | Promise<boolean>   // enables drag; false rolls back
  renderColumnTitle?: (column: KanbanColumnData<TCard>) => ReactNode
  renderHeaderActions?: (column: KanbanColumnData<TCard>) => ReactNode
}

interface ListViewProps<TItem> {
  collection: CollectionDefinition<TItem>
  groups?: readonly CollectionGroup<TItem>[]
  collapsedGroupIds?: readonly string[]         // controlled; makes collapseEmptyGroups irrelevant
  collapseEmptyGroups?: boolean
  defaultCollapsedGroupIds?: readonly string[]
  emptyGroupLabel?: ReactNode | ((group: CollectionGroup<TItem>) => ReactNode)
  getGroupActions?: (group: CollectionGroup<TItem>) => ListGroupActions | undefined
  grouping: CollectionGroupingId | null         // null reads the collection as a flat list
  loading?: boolean
  loadingItemCount?: number
  loadingItemLabel?: string
  onCollapsedGroupIdsChange?: (groupIds: readonly string[]) => void
  renderGroupTitle?: (group: CollectionGroup<TItem>) => ReactNode
  renderItem: (item: TItem) => ReactNode
}

interface UseDataGridOptions<TData extends RowData> {
  data: TData[]
  columns: DataGridColumnDef<TData>[]           // meta: DataGridColumnMeta (variant, type, align, label, options, editable, badgeVariant)
  getRowId?: (row: TData, index: number) => string
  enableSorting?: boolean                       // default true
  enableRowSelection?: boolean                  // default false
  enableColumnResizing?: boolean                // default true
  enableColumnFilters?: boolean                 // default true
  enablePagination?: boolean                    // default false; client-side when true
  pageSize?: number                             // default 10
  density?: DataGridDensity                     // 'short' | 'medium' | 'tall' | 'extra-tall'
  onCellValueChange?: (change: DataGridCellValueChange) => void   // { columnId, rowId, value }
  tableOptions?: Partial<TableOptions<DataGridFeatures, TData>>
}

interface DataGridProps<TData extends RowData> {
  table: DataGridTable<TData>
  pagination?: boolean                          // default follows the table; false scrolls instead
  fillColumn?: string | false                   // default last unpinned common column
  footer?: ReactNode                            // replaces the pagination slot
  density?: DataGridDensity
  isLoading?: boolean
  loadingRowCount?: number                      // default 5
  emptyMessage?: string
  maxHeight?: number | string
  getRowGroup?: (row: TData) => string | null   // one group row per run of equal values
  collapsedGroupIds?: readonly string[]
  defaultCollapsedGroupIds?: readonly string[]
  onCollapsedGroupIdsChange?: (groupIds: readonly string[]) => void
  getRowSelected?: (row: TData) => boolean
  onRowAdd?: () => void | Promise<void>         // shows the trailing add row
  addRowLabel?: string
  virtualize?: boolean                          // ignored with getRowGroup or while loading
  overscan?: number                             // default 8
  className?: string
  selectionActions?: ReactNode | ((context: ActionBarContext<TData> & { clearSelection: () => void }) => ReactNode)
  'aria-label'?: string
}

interface UseDataTableOptions<TData extends RowData> {
  data: TData[]
  columns: DataTableColumnDef<TData>[]          // a column with `footer` turns the footer on
  getRowId?: (row: TData, index: number) => string
  enableRowSelection?: boolean
  enableSorting?: boolean
  enablePagination?: boolean
  pageSize?: number                             // default 10
  tableOptions?: Partial<TableOptions<DataTableFeatures, TData>>
}

interface DataTableProps<TData extends RowData> extends Omit<ComponentProps<'table'>, 'children'> {
  table: DataTableTable<TData>
  isLoading?: boolean
  loadingRowCount?: number                      // default 5
  emptyMessage?: string
  bordered?: boolean                            // draws the DataGrid frame
}

interface CalendarViewProps<TItem> {
  anchor: Date                                  // projected into timeZone to pick the visible range
  collection: CollectionDefinition<TItem>       // only getKey, getLabel and items are read
  getItemLabel?: (item: TItem) => string        // drag handle name "Mover {label}"
  getItemSchedule: (item: TItem) => CalendarItemSchedule | null   // { start, end: Date | null, isAllDay }; null hides the item
  loading?: boolean
  loadingItemCount?: number                     // default 3
  loadingItemLabel?: string
  locale?: string                               // default 'pt-BR'
  maxVisibleMonthItems?: number                 // default 3, then "+N"
  mode: CalendarViewMode                        // CalendarRangeMode from @tc96/helpers/calendar-date
  now?: Date                                    // controlled instant; otherwise ticks every minute
  onItemReschedule?: (change: CalendarItemReschedule<TItem>) => boolean | Promise<boolean>   // enables drag
  onSelectDay?: (date: CalendarDate) => void    // turns the "+N" into a button
  snapMinutes?: number                          // default 15
  renderItem: (item: TItem, context: CalendarItemRenderContext) => ReactNode
  timeZone: string                              // IANA
  weekStartsOn?: 0 | 1
}
```

Behavior worth knowing before changing it:

- `CollectionProvider` starts uncontrolled at `{ groupBy: collection.groupings[0]?.id ?? null, view: 'kanban' }` merged with `defaultPreferences`, or follows `preferences` when passed. `setPreferences(update, reason)` accepts a value or an updater and always calls `onPreferencesChange(next, { reason })`. `useCollectionPreferences` throws outside the provider.
- `CollectionViewOutlet` throws when the active view is `datagrid`, `datatable` or `calendar` and the matching prop is missing (the test asserts the message). Kanban columns are derived only while the view is `kanban`, from `groups` or `projectCollection(collection, groupBy)`; `getCardLabel` defaults to `collection.getLabel`. In list mode the outlet passes `groups ?? list?.groups`, and an explicit `[]` never falls back to the source items.
- `projectCollection` throws for `groupBy === null` and for an undeclared dimension. It creates one group per option in option order, adds a group on the fly for a value with no option (labelled by the value), and appends a `${groupBy}:unassigned` group for `null` values. Group ids are `${groupBy}:${option.id}` and `count` is the item count.
- Kanban drag: enabled only with `onMoveCard` and not `loading`. The pointer and touch pick up the whole card except inputs, links, menu items, roles such as `button`, `checkbox`, `combobox`, `slider` and `switch`, and any button other than `KanbanCardOpenTrigger`; the open trigger drags only after the 5px distance constraint (touch uses a 250ms delay with 5px tolerance). The grip handle is the keyboard and assistive-technology activator, visible only on focus; keyboard codes are Space to start and end, arrows to move, Escape to cancel, Tab to end. Same-column reorders use dnd-kit's optimistic DOM reorder; a cross-column `dragOver` calls `event.preventDefault()` and goes through state, because a node moved outside React broke `removeChild`.
- Kanban move settlement: `onMoveCard` may return a boolean or a promise. `false`, a rejection or a synchronous throw rolls the optimistic columns back to the source order; `true` keeps them until the `columns` prop shows the card at the target column and index (`isPendingCardMoveConfirmed`), then the override is dropped. A promise resumes dnd-kit's suspension immediately so the drop animation does not wait on the network. After a cross-column move, `KanbanView` focuses the moved card's handle by `data-kanban-card-drag-id`. Card content is memoized, so `renderCard` runs only for the moved card.
- `KanbanView` filters `hidden` columns, renders a `collapsed` column as a 12-unit strip with a vertical title and no drop target, and below `md` shows one column at a time through `KanbanColumnSelector` (`aria-pressed` buttons) with sorting off. The board viewport drag-scrolls horizontally with the pointer only when card drag is enabled; a click right after a drag is suppressed for 500ms. Column header actions (`onAddCard`, `onOpenSettings`) and `renderHeaderActions` are dropped while loading; the add button is hidden on a collapsed column. Loading renders `loadingCardCount` skeletons per column; an empty column shows `emptyColumnLabel` (default `Nenhum item nesta coluna.`). `column.color` tints the column surface through `color-mix` inline styles.
- `KanbanCard` stays an `article` (the test asserts it), `KanbanCardOpenTrigger` is an absolute button over the whole card, and `KanbanCardAction`/`KanbanCardActionButton` carry `data-kanban-card-action`, which the variant raises above the trigger. `display="compact"` hides description, content and footer. `KanbanCardSkeleton` and `ListItemSkeleton` wrap the card in an `output` with `aria-busy`, because an `article` cannot be `status`.
- `ListView` with `grouping === null` and no `groups` renders the flat collection in the consumer's order with `h2` titles (`ListItemHeadingLevelContext` set to 2); grouped lists render `ListGroup` sections with `h3` titles inside. Collapse state is controlled by `collapsedGroupIds` or kept locally from `defaultCollapsedGroupIds`; `collapseEmptyGroups` starts an empty group collapsed, a manual choice wins, an untouched group reopens when it receives items, every group stays open while loading, and `onCollapsedGroupIdsChange` always reports the effective list. `ListItemField` is `hidden lg:flex` unless `always`.
- `DataGrid` is a WAI-ARIA grid (`role="grid"`, `aria-rowcount`, `aria-colcount`) over a Base UI `ScrollArea`. One cell carries `tabIndex=0`; arrows move, Home/End jump within the row and with Ctrl/Meta to the first/last row, Shift extends the cell selection, and rows of collapsed groups are skipped (the tests cover focus staying on the chevron and moving to the first visible row). Columns `select` and `actions` are never the first navigable column, never the fill column and never counted as common columns.
- `DataGrid` pagination follows the table: shown when `table.options.manualPagination` is false, hidden with `pagination={false}`, replaced by `footer`. `DataGridPagination` reads any `PaginatedTable`, so it works for `DataTable` too. The default fill column is the last unpinned common column; `fillColumn={false}` keeps declared widths and shrinks the frame to `w-fit`. `getRowGroup` inserts one group row per run of equal values with the page count; row numbers continue across pages and across group rows (the numbering tests encode the rules). Collapsing hides rows on the page only; select-all still selects them. `virtualize` applies only without `getRowGroup`, not loading and with rows (`@tanstack/react-virtual`, `overscan` 8).
- `DataGrid` column header: a menu with sort ascending/descending (plus clear sorting while sorted), move left/right, pin start/end (or unpin while pinned) and hide; the resize handle is a `role="separator"` that moves 8px per ArrowLeft/ArrowRight (clamped to the column's min and max size, always exposed as `aria-valuemin`/`aria-valuemax`) and resets on double click. The grid is `aria-multiselectable`; rows carry `aria-selected` only when row selection applies. The viewport drag-scrolls with a mouse (not touch) after 8px, skipping interactive targets and `[data-grid-select-trigger]`.
- Editable cells: the `select` variant becomes a `Select` only with `meta.editable`, `meta.options` and an `onCellValueChange` (or `tableOptions.meta.onDataGridCellValueChange`). The trigger is a `Badge` rendered as a button marked `data-grid-select-trigger`; the first pointer press on an unselected cell selects the cell without opening, and a click on an already selected cell forwards to the trigger. The `date` variant formats date-only values on their own calendar day. `createSelectColumn` adds select-all and per-row checkboxes; with `showRowNumbers` (default) the row number swaps for the checkbox on hover, focus-within, selection or a coarse pointer.
- `useDataGrid` keeps all TanStack state locally and exposes `dataGridDensity`, `dataGridPaginationRowOffset`, `onDataGridDensityChange` and `onDataGridCellValueChange` through `table.options.meta`; `DataGridDensitySubmenu` changes density through that meta. `DataGridSearch` drives the global filter (`includesString`) and returns to the first page on every keystroke; `DataGridSortSubmenu`, `DataGridColumnsSubmenu` and `DataGridDensitySubmenu` are sections for `ViewSettingsMenu`; `DataGridSelectionSummary` is `aria-live="polite"`.
- `DataTable` renders COSS `Table` with skeleton rows while loading, an `emptyMessage` row (default `Nenhum registro para exibir.`), `data-state="selected"` on selected rows, a footer only when a column declares `footer`, and the DataGrid frame when `bordered`. `useDataTable` always registers pagination and sets `manualPagination: !enablePagination`, so without the flag the table yields every row.
- `CalendarView` projects `anchor` and `now` into `timeZone`, builds the range with `calendarRange(anchorDate, mode, weekStartsOn)` and slices every item into one segment per visible day (`segmentItems`); an all-day window ending at midnight stays on its single day, items outside the range or with a `null` schedule are dropped, and buckets sort by start then key. Month mode shows `maxVisibleMonthItems` chips and a `+N` control that calls `onSelectDay` when provided. Other modes render an all-day strip plus timed columns with greedy lanes for overlaps (`assignTimeGridLanes`), a 2% minimum height for single instants, a now line on today's column, and an initial scroll to 07:00 (3rem per hour).
- Calendar drag: enabled only with `onItemReschedule` and not `loading`; without it no handle or draggable marker exists (the test asserts it). The handle appears on hover and focus and uses the same sensors and keyboard codes as kanban. Timed items are accepted by time columns and month cells, all-day items by all-day cells and month cells. A drop on a day or all-day cell keeps the wall-clock time and the absolute duration (DST-safe); a drop on a time column snaps the dragged block's top edge to `snapMinutes`. The reschedule is an optimistic override per item until `getItemSchedule` matches it; `false`, rejection or a throw removes the override; a drop that resolves to the same window is ignored; focus returns to the moved chip by `data-calendar-item-drag-id`.
- Toolbar pieces: `CollectionSearchField` commits on submit and when the field is emptied, never per keystroke, and its draft follows an external `value` change. `SelectedViewMenu` is a `Popover` (`role="dialog"`), not a menu: items are `PopoverClose` buttons with `aria-current`, each view's `options` open a side `Menu` whose item press also closes the popover. `ViewSettingsMenu` shows mode tabs only with two or more modes (`w-64` under four, `w-96` from four), disables the clear item at zero `activeFilterCount`, and renders the save item only with `onSavePreference`. `FilterRadioSubmenu` maps the "all" option to `''`. `ActionBar` returns `null` below one selected row; `primary` maps to the default `Button`, `destructive` to a ghost button with `text-destructive-foreground`; `CollectionSelectionActions` is the compatibility alias the test keeps.

## Styling contract

State lives in `data-*` attributes and is styled by their variants, never by a parallel class:

| Attribute | Where | Styled by |
| --- | --- | --- |
| `data-state="selected"` | the `DataGrid` row | `data-[state=selected]:bg-primary/10` on the row and `group-data-[state=selected]/marker:opacity-0` on the row number in `createSelectColumn` |
| `data-state="selected"` | `DataTable` rows and `KanbanCard` | consumers; the card uses the `selected` variant instead |
| `data-selected="true"`, `data-focused="true"` | the `DataGrid` cell | `data-[selected=true]:bg-primary/10`, `data-[focused=true]:ring-1 data-[focused=true]:ring-inset data-[focused=true]:ring-ring` |
| `data-pinned="start\|end"` | `DataGrid` header cells, body cells and add-row cells | `data-[pinned]:bg-background` |
| `data-drag-scroll="dragging"` | the `DataGrid` viewport | `data-[drag-scroll=dragging]:cursor-grabbing` |
| `data-has-overflow-x`, `data-has-overflow-y` | set by the Base UI `ScrollArea` viewport | `data-has-overflow-x:overscroll-x-contain data-has-overflow-y:overscroll-y-contain` on the grid viewport |
| `data-density` | the `DataGrid` viewport, `ListItem`, `KanbanCard` | consumers; the pattern uses the `ROW_DENSITY`/`CELL_DENSITY` lookups, a `py` ternary and the `density` variant instead |
| `data-virtualized="true"`, `data-column-id`, `data-column-type` | `DataGrid` body, header and body cells, the column type icon | consumers |
| `data-collapsed="true"` | the `DataGrid` group row and the `KanbanColumn` | `[&>[data-slot=kanban-column]:not([data-collapsed])]:w-76` and `xl:…:w-88` on the board; the group row is for consumers |
| `data-grid-select-trigger` | the editable select trigger in `DataGridCell` | not styled; the grid reads it to route clicks and to exclude the trigger from drag-scroll |
| `data-bordered` | the `DataTable` frame when `bordered` | consumers |
| `data-kanban-card-action` | `KanbanCardAction`, `KanbanCardActionButton` | `[&_[data-kanban-card-action]]:relative [&_[data-kanban-card-action]]:z-10` in `kanbanCardVariants` |
| `data-pattern="kanban-card"`, `data-display`, `data-variant` | `KanbanCard` | consumers; `data-slot="card"` on the same element is what the header and footer variants read through `in-[[data-slot=card]:has(>[data-slot=card-panel])]` |
| `data-kanban-card-container`, `data-kanban-card-draggable`, `data-kanban-card-drag-handle`, `data-kanban-card-drag-id` | the sortable wrapper and its handle | not styled; `useHorizontalDragScroll` excludes `[data-kanban-card-draggable]` and `KanbanView` restores focus by `data-kanban-card-drag-id` |
| `data-kanban-board-scroll-area`, `data-kanban-horizontal-scrollbar="visible\|hidden"` | the board `ScrollArea` | consumers; the pattern toggles the scrollbar classes by a ternary |
| `data-interactive` | `ListItem` | consumers; the hover class comes from the `interactive` prop |
| `data-collection-grouping` | the `ListView` root | consumers |
| `data-calendar-mode` | the `CalendarView` root | consumers |
| `data-calendar-date`, `data-today`, `data-outside-month`, `data-calendar-all-day-date` | month cells, time columns, the time-grid day heading, all-day cells | consumers and the tests; today and outside-month styles come from ternaries |
| `data-calendar-item-draggable`, `data-calendar-item-id`, `data-calendar-item-drag-handle`, `data-calendar-item-drag-id` | `DraggableCalendarItem` and its handle | not styled; `CalendarView` restores focus by `data-calendar-item-drag-id` |
| `data-calendar-item-action` | a control the consumer places inside `CalendarEventChip` | `[&_[data-calendar-item-action]]:relative [&_[data-calendar-item-action]]:z-10` in `calendarEventChipVariants` |
| `data-completed`, `data-display`, `data-tone` | `CalendarEventChip` | consumers; the `completed` variant strikes `[data-slot=calendar-event-chip-title]` |
| `data-selected` | `SelectedViewItem` | consumers; the background comes from the `selected` prop |
| `data-layout="inline\|stacked"` | the `ViewSettingsMenu` mode tab | consumers; the tab is styled by Base UI's `data-checked:` and `data-highlighted:` |
| `data-checked` | set by the Base UI `Checkbox` in `createSelectColumn` | `data-checked:opacity-100` |

Design axes are `cva` variants in two files: `views/kanban/components/kanban-card.tsx` (`kanbanCardVariants` with `dimmed`, `selected` and `variant: default | interactive`, plus internal surface `density: md | sm` and header, title and description `display` variants) and `views/calendar/components/calendar-event-chip.tsx` (`calendarEventChipVariants` with `completed`, `display: block | chip` and `tone: destructive | neutral | primary | success | warning`). There is no `lib/variants.ts`; the data grid keeps its density scale in the `ROW_DENSITY`, `CELL_DENSITY` and `ROW_HEIGHT` records. Every class is a complete string, so the Tailwind scanner always sees it. Colors come only from theme tokens (`bg-card`, `bg-background`, `bg-muted`, `bg-accent`, `bg-popover`, `bg-primary`, `bg-destructive`, `text-primary-foreground`, `text-muted-foreground`, `text-card-foreground`, `text-destructive-foreground`, `text-success-foreground`, `text-warning-foreground`, `border-border`, `ring-ring`, `ring-primary`); the kanban column tint reads `var(--card)` and the time grid hour lines read `var(--border)`.

Decisions recorded on 2026-10-03 in `docs/architecture/tc96-parttens.md`, section "Acessibilidade dos patterns", that apply here: a condition emits one class (the calendar skeleton, the month day cell, the kanban column header and the data grid resize handle use ternaries that emit `px`, `bg` or `flex-direction` once); nothing is hover-only (the data grid row marker pairs `group-hover/marker:` with `group-focus-within/marker:` and `pointer-coarse:opacity-100`, because `hover:` does not fire on touch in v4); the calendar chip draws `has-focus-visible:ring-2 ring-primary` on the `article` because the open trigger removes the native outline, the same design as `KanbanCard`; only semantic tokens (the mode tab icon tile is `bg-primary text-primary-foreground`, `rounded` became `rounded-sm`); the hour labels of the time grid converged on `text-[0.625rem]`, pending a `--text-2xs: 0.625rem` token in the consumer's theme; kanban column widths use the scale (`w-76`, `xl:w-88`) and `-translate-y-1/2`. Not findings: `outline-none` next to `focus-visible:` follows COSS; `style={{ minWidth: 0 }}` on `ScrollArea.Content` in `components/data-grid.tsx` is deliberate, the only way to beat Base UI's inline `minWidth: fit-content`; `dark:` opacity steps on the chip tones follow COSS. `scripts/override-exceptions.json` has no entry for a file in this pattern; its only mention of collection-views is the reason of the widget shell's `rounded-lg` exception, which copies the kanban card radius.

`data-slot` names set by the pattern: `action-bar`, `selected-view-search`, `selected-view-items`, `selected-view-item`, `selected-view-create`, `view-settings-mode-tab`, `calendar-view`, `calendar-month-grid`, `calendar-time-grid`, `calendar-now-line`, `calendar-event-chip`, `calendar-event-chip-time`, `calendar-event-chip-title`, `calendar-event-chip-open-trigger`, `calendar-item-skeleton`, `data-grid`, `data-grid-header`, `data-grid-header-row`, `data-grid-header-cell`, `data-grid-body`, `data-grid-row`, `data-grid-cell`, `data-grid-group-row`, `data-grid-group-label`, `data-grid-group-count`, `data-grid-add-row-group`, `data-grid-footer`, `data-grid-selection-actions`, `data-grid-row-marker`, `data-grid-column-type-icon`, `data-grid-pagination`, `data-grid-search`, `data-grid-filter-menu`, `data-grid-selection-summary`, `scroll-area-viewport`, `scroll-area-content`, `scroll-area-corner` (set by the grid on the Base UI primitives), `kanban-view`, `kanban-column`, `card` (on `KanbanCard`), `kanban-card-open-trigger`, `kanban-card-body-row`, `kanban-card-action-button`, `list-view`, `list-view-items`, `list-group`, `list-group-header`, `list-group-count`, `list-group-items`, `list-item`, `list-item-header`, `list-item-leading`, `list-item-body`, `list-item-title`, `list-item-title-trigger`, `list-item-description`, `list-item-content`, `list-item-footer`, `list-item-trailing`, `list-item-field`, `list-item-action`.

## Verify

```bash
bun test --isolate packages/parttens/src/collection-views
bunx biome check packages/parttens/src/collection-views
bun run typecheck && bun run boundaries:check && bun run overrides:check && bun run verify:public-api
cd apps/storybook && bunx vitest run --project=storybook src/patterns/collection-views
```

Each view has a benchmark built on the shared harness in `scripts/bench/` (`bench-harness.ts` and `bench-compare.ts`, copied from the tc96-marketplace `react-component-performance` skill; keep the `bench-harness v1` line). The adapters are `scripts/bench/<view>.bench.ts`, the committed baselines `scripts/bench/results/<view>.base.json`, and the numbers and reading live in each view's `README.md`. Before a change that touches rendering, run the view's bench; after it, compare against the baseline and gate on render counts:

```bash
bun run bench:list          # also bench:data-grid, bench:data-table, bench:kanban, bench:calendar
bun scripts/bench/list.bench.ts --compare scripts/bench/results/list.base.json --gate
```

`--gate` exits 1 when a render counter rose or a scenario disappeared; timing only warns. Regenerate a baseline with `--json scripts/bench/results/<view>.base.json` on an otherwise idle machine and update the README table in the same change.

The stories live under `apps/storybook/src/patterns/collection-views/` and run axe with `test: 'error'`: `default.stories.tsx` (`Patterns/CollectionViews`), `views/data-grid.stories.tsx` (`Patterns/CollectionViews/Views/Data Grid`), `views/data-table.stories.tsx` (`Patterns/CollectionViews/Views/Data Table`), `views/list.stories.tsx` (`Patterns/CollectionViews/Views/List`), `views/calendar/calendar-month.stories.tsx` (`Patterns/CollectionViews/Views/Calendar/Month`), `views/calendar/calendar-time-grid.stories.tsx` (`Patterns/CollectionViews/Views/Calendar/Time Grid`), `views/kanban/kanban.stories.tsx` (`Patterns/CollectionViews/Views/Kanban/Usages/Todo`), `views/kanban/sales-pipeline-card.stories.tsx` (`Patterns/CollectionViews/Views/Kanban/Usages/Sales`), `views/kanban/kanban-card.stories.tsx` (`Patterns/CollectionViews/Views/Kanban/Cards`), `views/kanban/kanban-column.stories.tsx` (`Patterns/CollectionViews/Views/Kanban/Column`), `views/kanban/kanban-loading.stories.tsx` (`Patterns/CollectionViews/Views/Kanban/Loading/Board`), `views/kanban/kanban-card-loading.stories.tsx` (`Patterns/CollectionViews/Views/Kanban/Loading/Card`) and `views/kanban/kanban-error.stories.tsx` (`Patterns/CollectionViews/Views/Kanban/Surfaces Error`). `views/kanban/kanban-card-example.tsx` is the shared card fixture, not a story.
