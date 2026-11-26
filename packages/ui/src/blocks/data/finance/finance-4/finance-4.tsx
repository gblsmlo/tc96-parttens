'use client'

import { BuildingsIcon, ScalesIcon } from '@phosphor-icons/react'
import { ActionBar } from '@tc96/ui/patterns/action-bar/components/action-bar'
import type { CollectionKanbanViewProps } from '@tc96/ui/patterns/collection/composition/collection-layout-outlet'
import { useDataTable } from '@tc96/ui/patterns/data-table/use-data-table'
import { PropertyMetaIcon } from '@tc96/ui/property-meta'
import { useMemo } from 'react'
import {
  DataCollection,
  type DataCollectionDefinition,
} from '../../shared/collection/data-collection'
import { DataCollectionFrame } from '../../shared/collection/data-collection-frame'
import { dataCollectionLoadState } from '../../shared/collection/data-collection-load-state'
import { DataCollectionViewSwitcher } from '../../shared/collection/data-collection-view-switcher'
import { defaultDataCollectionLocale } from '../../shared/collection/labels'
import {
  useControllable,
  useStableHandler,
} from '../../shared/collection/use-controllable'
import { createFinance4Columns } from './finance-4-columns'
import {
  createFinance4AmountFormatter,
  type Finance4FieldContext,
} from './finance-4-fields'
import {
  finance4DefaultSortDirection,
  finance4EntryKinds,
  finance4GroupBys,
  finance4KindAppearance,
  finance4NoGroup,
  finance4SituationAppearance,
  finance4Situations,
  finance4Views,
} from './finance-4-options'
import {
  Finance4ListHeader,
  renderFinance4KanbanCard,
  renderFinance4ListRow,
} from './finance-4-records'
import { createFinance4SelectionActions } from './finance-4-selection-actions'
import { Finance4Skeleton } from './finance-4-skeleton'
import { Finance4Toolbar } from './finance-4-toolbar'
import { resolveFinance4Labels } from './labels'
import type {
  Finance4Case,
  Finance4Entry,
  Finance4EntryKind,
  Finance4GroupBy,
  Finance4KanbanGroupBy,
  Finance4Labels,
  Finance4Mode,
  Finance4Option,
  Finance4Props,
  Finance4Situation,
  Finance4Sort,
  Finance4SortColumn,
  Finance4SortDirection,
  Finance4View,
} from './types'

export {
  finance4EntryKinds,
  finance4FeeTypes,
  finance4GroupBys,
  finance4KindDirection,
  finance4Modes,
  finance4Situations,
  finance4Sorts,
  finance4Views,
} from './finance-4-options'

type Finance4Grouping =
  DataCollectionDefinition<Finance4Entry>['groupings'][number]

const defaultFinance4Currency = 'BRL'
const noPeople: NonNullable<Finance4Props['lawyers']> = []
const noClients: NonNullable<Finance4Props['clients']> = []
const noCases: NonNullable<Finance4Props['cases']> = []
const noIds: string[] = []
const groupIcon = 'size-4'

function createFinance4Groupings(
  labels: Finance4Labels,
  clients: readonly Finance4Option[],
  cases: readonly Finance4Case[],
): Finance4Grouping[] {
  return [
    {
      getGroupId: (entry) => entry.situation,
      id: 'situation',
      label: labels.groupings.situation,
      options: finance4Situations.map((situation) => ({
        icon: (
          <PropertyMetaIcon
            className={groupIcon}
            meta={finance4SituationAppearance[situation]}
          />
        ),
        id: situation,
        label: labels.situations[situation],
      })),
    },
    {
      getGroupId: (entry) => entry.kind,
      id: 'kind',
      label: labels.groupings.kind,
      options: finance4EntryKinds.map((kind) => ({
        icon: (
          <PropertyMetaIcon
            className={groupIcon}
            meta={finance4KindAppearance[kind]}
          />
        ),
        id: kind,
        label: labels.kinds[kind],
      })),
    },
    {
      getGroupId: (entry) => entry.clientId ?? finance4NoGroup,
      id: 'client',
      label: labels.groupings.client,
      options: [
        ...clients.map((client) => ({
          icon: <BuildingsIcon aria-hidden="true" />,
          id: client.id,
          label: client.label,
        })),
        { id: finance4NoGroup, label: labels.noClient },
      ],
    },
    {
      getGroupId: (entry) => entry.caseId ?? finance4NoGroup,
      id: 'case',
      label: labels.groupings.case,
      options: [
        ...cases.map((item) => ({
          icon: <ScalesIcon aria-hidden="true" />,
          id: item.id,
          label: item.label,
        })),
        { id: finance4NoGroup, label: labels.noCase },
      ],
    },
  ]
}

function orderByGrouping(
  entries: Finance4Entry[],
  grouping: Finance4Grouping | undefined,
): Finance4Entry[] {
  if (!grouping) return entries
  const rank = new Map(
    grouping.options.map((option, index) => [option.id, index]),
  )
  const rankOf = (entry: Finance4Entry) =>
    rank.get(grouping.getGroupId(entry) ?? '') ?? grouping.options.length
  return [...entries].sort((a, b) => rankOf(a) - rankOf(b))
}

const pickGroupBy = (value: string | null): Finance4GroupBy | null =>
  finance4GroupBys.find((item) => item === value) ?? null

export function Finance4({
  cases = noCases,
  className,
  clients = noClients,
  collapsedGroupIds: collapsedGroupIdsProp,
  counts,
  currency = defaultFinance4Currency,
  entries,
  error,
  filtered = false,
  groupBy: groupByProp,
  kindFilter: kindFilterProp,
  labels: labelsProp,
  lawyerFilter: lawyerFilterProp,
  lawyers = noPeople,
  locale = defaultDataCollectionLocale,
  mode: modeProp,
  onBulkDelete,
  onBulkResponsibleChange,
  onBulkSettle,
  onCollapsedGroupIdsChange,
  onCreate,
  onGroupByChange,
  onKindFilterChange,
  onLawyerFilterChange,
  onModeChange,
  onOpen,
  onRetry,
  onSavedViewCreate,
  onSavedViewDelete,
  onSavedViewDuplicate,
  onSavedViewRename,
  onSavedViewSelect,
  onSavedViewUpdate,
  onSelectedIdsChange,
  onSituationFilterChange,
  onSortChange,
  onViewChange,
  pending,
  savedViewId,
  savedViewModified,
  savedViews,
  savedViewsLoading,
  savedViewsPending,
  selectedIds: selectedIdsProp,
  situationFilter: situationFilterProp,
  sort: sortProp,
  sortDirection: sortDirectionProp,
  view: viewProp,
}: Readonly<Finance4Props>) {
  const labels = useMemo(() => resolveFinance4Labels(labelsProp), [labelsProp])
  const [view, setView] = useControllable<Finance4View>(
    viewProp,
    'all',
    onViewChange,
  )
  const [mode, setMode] = useControllable<Finance4Mode>(
    modeProp,
    'list',
    onModeChange,
  )
  const [sortState, setSortState] = useControllable<{
    direction: Finance4SortDirection
    sort: Finance4Sort
  }>(
    sortProp
      ? {
          direction:
            sortDirectionProp ?? finance4DefaultSortDirection[sortProp],
          sort: sortProp,
        }
      : undefined,
    { direction: finance4DefaultSortDirection.due, sort: 'due' },
    onSortChange
      ? (next) => onSortChange(next.sort, next.direction)
      : undefined,
  )
  const { direction: sortDirection, sort } = sortState
  const setSort = (next: Finance4Sort) =>
    setSortState({ direction: finance4DefaultSortDirection[next], sort: next })
  const sortByColumn = (column: Finance4SortColumn) =>
    setSortState(
      column === sort
        ? { direction: sortDirection === 'asc' ? 'desc' : 'asc', sort }
        : { direction: finance4DefaultSortDirection[column], sort: column },
    )
  const [selectedIds, setSelectedIds] = useControllable<string[]>(
    selectedIdsProp,
    noIds,
    onSelectedIdsChange,
  )
  const selectable = Boolean(
    onBulkDelete || onBulkResponsibleChange || onBulkSettle,
  )
  const selectedSet = useMemo(() => new Set(selectedIds), [selectedIds])
  const toggleSelected = useStableHandler(
    selectable
      ? (entryId: string, checked: boolean) =>
          setSelectedIds(
            checked
              ? [...selectedIds.filter((id) => id !== entryId), entryId]
              : selectedIds.filter((id) => id !== entryId),
          )
      : undefined,
  )
  const [groupBy, setGroupBy] = useControllable<Finance4GroupBy | null>(
    groupByProp,
    'situation',
    onGroupByChange,
  )
  const [situationFilter, setSituationFilter] =
    useControllable<Finance4Situation | null>(
      situationFilterProp,
      null,
      onSituationFilterChange,
    )
  const [kindFilter, setKindFilter] = useControllable<Finance4EntryKind | null>(
    kindFilterProp,
    null,
    onKindFilterChange,
  )
  const [lawyerFilter, setLawyerFilter] = useControllable<string | null>(
    lawyerFilterProp,
    null,
    onLawyerFilterChange,
  )

  const openEntry = useStableHandler(onOpen)

  const clientById = useMemo(
    () => new Map(clients.map((client) => [client.id, client])),
    [clients],
  )
  const caseById = useMemo(
    () => new Map(cases.map((item) => [item.id, item])),
    [cases],
  )
  const formatAmount = useMemo(
    () => createFinance4AmountFormatter(locale, currency),
    [currency, locale],
  )
  const context = useMemo<Finance4FieldContext>(
    () => ({
      caseById,
      clientById,
      formatAmount,
      labels,
      lawyers,
      locale,
      onOpen: openEntry,
      onSelectedChange: toggleSelected,
      selectedIds: selectedSet,
    }),
    [
      caseById,
      clientById,
      formatAmount,
      labels,
      lawyers,
      locale,
      openEntry,
      selectedSet,
      toggleSelected,
    ],
  )

  const kanbanGroupBy: Finance4KanbanGroupBy = 'situation'
  const activeGroupBy = mode === 'kanban' ? kanbanGroupBy : groupBy

  const groupings = useMemo(
    () => createFinance4Groupings(labels, clients, cases),
    [cases, clients, labels],
  )
  const records = useMemo(
    () =>
      mode === 'table'
        ? orderByGrouping(
            entries,
            groupings.find(({ id }) => id === activeGroupBy),
          )
        : entries,
    [activeGroupBy, entries, groupings, mode],
  )
  const collection = useMemo<DataCollectionDefinition<Finance4Entry>>(
    () => ({
      getKey: (entry) => entry.id,
      getLabel: (entry) => entry.description,
      groupings,
      records,
    }),
    [groupings, records],
  )

  const columns = useMemo(
    () => createFinance4Columns(context, selectable),
    [context, selectable],
  )
  const rowSelection = useMemo(
    () => Object.fromEntries(selectedIds.map((id) => [id, true as const])),
    [selectedIds],
  )
  const { table } = useDataTable<Finance4Entry>({
    columns,
    data: records,
    enableRowSelection: selectable,
    getRowId: (entry) => entry.id,
    onRowSelectionChange: (selection) =>
      setSelectedIds(Object.keys(selection).filter((id) => selection[id])),
    rowSelection,
  })

  const kanban = useMemo<CollectionKanbanViewProps<Finance4Entry>>(
    () => ({ emptyGroupLabel: labels.emptyColumn }),
    [labels.emptyColumn],
  )

  const selectedRows = useMemo(
    () => entries.filter((entry) => selectedSet.has(entry.id)),
    [entries, selectedSet],
  )

  const loadState = dataCollectionLoadState({
    error,
    labels,
    onRetry,
    pending,
    skeleton: <Finance4Skeleton label={labels.loading} />,
  })

  const actionBar = (clear: () => void, rows: readonly Finance4Entry[]) => (
    <ActionBar
      actions={createFinance4SelectionActions({
        labels,
        lawyers,
        onBulkDelete,
        onBulkResponsibleChange,
        onBulkSettle,
        onDone: clear,
        selectedRows: rows,
      })}
      className="pointer-events-auto"
      clearSelectionLabel={labels.clearSelection}
      formatSelection={labels.selectedCount}
      label={labels.selectionActions}
      onClearSelection={clear}
      selectedCount={rows.length}
      selectedRows={rows}
    />
  )

  return (
    <DataCollectionFrame
      className={className}
      data-block="finance-4"
      title={labels.title}
      toolbar={
        <Finance4Toolbar
          groupBy={groupBy}
          kanbanGroupBy={kanbanGroupBy}
          kindFilter={kindFilter}
          labels={labels}
          lawyerFilter={lawyerFilter}
          lawyers={lawyers}
          loading={Boolean(loadState)}
          mode={mode}
          onCreate={onCreate}
          onGroupByChange={setGroupBy}
          onKindFilterChange={onKindFilterChange ? setKindFilter : undefined}
          onLawyerFilterChange={
            onLawyerFilterChange ? setLawyerFilter : undefined
          }
          onModeChange={setMode}
          onSituationFilterChange={
            onSituationFilterChange ? setSituationFilter : undefined
          }
          onSortChange={onSortChange ? setSort : undefined}
          situationFilter={situationFilter}
          sort={sort}
          viewSwitcher={
            <DataCollectionViewSwitcher<Finance4View>
              counts={counts}
              label={labels.viewList}
              locale={locale}
              modified={savedViewModified}
              onSavedViewCreate={onSavedViewCreate}
              onSavedViewDelete={onSavedViewDelete}
              onSavedViewDuplicate={onSavedViewDuplicate}
              onSavedViewRename={onSavedViewRename}
              onSavedViewSelect={onSavedViewSelect}
              onSavedViewUpdate={onSavedViewUpdate}
              onViewChange={(next) => {
                setView(next)
                if (savedViewId) onSavedViewSelect?.(null)
              }}
              savedViewId={savedViewId}
              savedViewLabels={labels.savedViews}
              savedViews={savedViews}
              savedViewsLoading={savedViewsLoading}
              savedViewsPending={savedViewsPending}
              view={view}
              viewCountName={labels.viewCountName}
              viewLabels={labels.views}
              views={finance4Views}
            />
          }
        />
      }
    >
      {loadState ?? (
        <DataCollection<Finance4Entry>
          collapseEmptyGroups
          collapsedGroupIds={collapsedGroupIdsProp}
          collection={collection}
          emptyMessage={filtered ? labels.noResult : labels.empty}
          getGroupToggleLabel={labels.groupToggle}
          getRowOpenLabel={(entry) => labels.openEntry(entry.description)}
          groupBy={activeGroupBy}
          kanban={kanban}
          label={labels.title}
          listHeader={
            <Finance4ListHeader
              labels={labels}
              onSort={onSortChange ? sortByColumn : undefined}
              selection={
                selectable && entries.length > 0
                  ? {
                      checked: entries.every((entry) =>
                        selectedSet.has(entry.id),
                      ),
                      indeterminate:
                        selectedSet.size > 0 &&
                        !entries.every((entry) => selectedSet.has(entry.id)),
                      onCheckedChange: (checked) =>
                        setSelectedIds(
                          checked ? entries.map((entry) => entry.id) : noIds,
                        ),
                    }
                  : undefined
              }
              sort={sort}
              sortDirection={sortDirection}
            />
          }
          mode={mode}
          onCollapsedGroupIdsChange={
            onCollapsedGroupIdsChange
              ? (groupIds) => onCollapsedGroupIdsChange([...groupIds])
              : undefined
          }
          onGroupByChange={(next) => setGroupBy(pickGroupBy(next))}
          onOpen={openEntry ? (entry) => openEntry(entry.id) : undefined}
          renderKanbanRecord={renderFinance4KanbanCard(context)}
          renderListRecord={renderFinance4ListRow(context)}
          selectionActions={
            selectable
              ? ({ clearSelection, selectedRows: rows }) =>
                  actionBar(clearSelection, rows)
              : undefined
          }
          table={table}
        />
      )}
      {!loadState && mode === 'list' && selectable ? (
        <div className="pointer-events-none sticky bottom-3 flex justify-center">
          {actionBar(() => setSelectedIds(noIds), selectedRows)}
        </div>
      ) : null}
    </DataCollectionFrame>
  )
}
