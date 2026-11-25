'use client'

import { ActionBar } from '@tc96/ui/patterns/action-bar/components/action-bar'
import { useDataTable } from '@tc96/ui/patterns/collection/layouts/data-table/use-data-table'
import { type ReactNode, useMemo } from 'react'
import {
  DataCollection,
  type DataCollectionDefinition,
} from '../../shared/collection/data-collection'
import { DataCollectionFrame } from '../../shared/collection/data-collection-frame'
import { dataCollectionLoadState } from '../../shared/collection/data-collection-load-state'
import { DataCollectionSettingsToolbar } from '../../shared/collection/data-collection-settings-toolbar'
import { DataCollectionViewSwitcher } from '../../shared/collection/data-collection-view-switcher'
import {
  useControllable,
  useStableHandler,
} from '../../shared/collection/use-controllable'
import { createInbox1Columns } from './inbox-1-columns'
import { type Inbox1FieldContext, opensEntry } from './inbox-1-fields'
import { Inbox1Footer } from './inbox-1-footer'
import {
  inbox1Categories,
  inbox1CategoryIcons,
  inbox1KindsOf,
} from './inbox-1-options'
import { createInbox1SelectionActions } from './inbox-1-selection-actions'
import { Inbox1Settings } from './inbox-1-settings'
import { Inbox1Skeleton } from './inbox-1-skeleton'
import { resolveInbox1Labels } from './labels'
import type {
  Inbox1Category,
  Inbox1Entry,
  Inbox1Kind,
  Inbox1Props,
  Inbox1ReadFilter,
  Inbox1ReceivedFilter,
  Inbox1Sort,
} from './types'

export {
  inbox1Categories,
  inbox1Kinds,
  inbox1KindsByCategory,
  inbox1Sorts,
} from './inbox-1-options'

type Inbox1View = 'all' | Inbox1Category

const noSelection: NonNullable<Inbox1Props['selectedIds']> = []

const viewIcons = Object.fromEntries(
  Object.entries(inbox1CategoryIcons).map(([view, Icon]) => [
    view,
    <Icon aria-hidden="true" className="size-4" key={view} />,
  ]),
) as Record<Inbox1View, ReactNode>

export function Inbox1({
  categories: categoriesProp,
  category: categoryProp,
  className,
  counts,
  entries,
  error,
  filtered: filteredProp,
  hasMore = false,
  kindFilter: kindFilterProp,
  labels: labelsProp,
  loadingMore = false,
  loadMoreError = false,
  markError = false,
  onCategoryChange,
  onKindFilterChange,
  onLoadMore,
  onMarkRead,
  onOpen,
  onReadChange,
  onReadFilterChange,
  onReceivedFilterChange,
  onRetry,
  onSelectedIdsChange,
  onSortChange,
  originColors,
  pending,
  readFilter: readFilterProp,
  receivedFilter: receivedFilterProp,
  selectedIds: selectedIdsProp,
  sort: sortProp,
}: Readonly<Inbox1Props>) {
  const labels = useMemo(() => resolveInbox1Labels(labelsProp), [labelsProp])
  const categories = useMemo(
    () =>
      categoriesProp
        ? inbox1Categories.filter((item) => categoriesProp.includes(item))
        : inbox1Categories,
    [categoriesProp],
  )
  const [category, setCategory] = useControllable<Inbox1Category | null>(
    categoryProp,
    null,
    onCategoryChange,
  )
  const [sort, setSort] = useControllable<Inbox1Sort>(
    sortProp,
    'newest',
    onSortChange,
  )
  const [readFilter, setReadFilter] = useControllable<Inbox1ReadFilter | null>(
    readFilterProp,
    null,
    onReadFilterChange,
  )
  const [kindFilter, setKindFilter] = useControllable<Inbox1Kind | null>(
    kindFilterProp,
    null,
    onKindFilterChange,
  )
  const [receivedFilter, setReceivedFilter] =
    useControllable<Inbox1ReceivedFilter | null>(
      receivedFilterProp,
      null,
      onReceivedFilterChange,
    )
  const [selectedIds, setSelectedIds] = useControllable<string[]>(
    selectedIdsProp,
    noSelection,
    onSelectedIdsChange,
  )
  const open = useStableHandler(onOpen)
  const changeRead = useStableHandler(onReadChange)

  const changeCategory = (next: Inbox1Category | null) => {
    setCategory(next)
    if (kindFilter && !inbox1KindsOf(next).includes(kindFilter))
      setKindFilter(null)
  }
  const clearFilters = () => {
    setReadFilter(null)
    setKindFilter(null)
    setReceivedFilter(null)
  }
  const activeFilterCount =
    (readFilter ? 1 : 0) + (kindFilter ? 1 : 0) + (receivedFilter ? 1 : 0)
  const views = useMemo<readonly Inbox1View[]>(
    () => ['all', ...categories],
    [categories],
  )
  const viewLabels = useMemo<Record<Inbox1View, string>>(
    () => ({ all: labels.allCategories, ...labels.categories }),
    [labels],
  )

  const context = useMemo<Inbox1FieldContext>(
    () => ({ labels, onOpen: open, onReadChange: changeRead, originColors }),
    [changeRead, labels, open, originColors],
  )
  const collection = useMemo<DataCollectionDefinition<Inbox1Entry>>(
    () => ({
      getKey: (entry) => entry.id,
      getLabel: (entry) => entry.title,
      groupings: [],
      records: entries,
    }),
    [entries],
  )
  const columns = useMemo(() => createInbox1Columns(context), [context])
  const rowSelection = useMemo(
    () => Object.fromEntries(selectedIds.map((id) => [id, true as const])),
    [selectedIds],
  )
  const { table } = useDataTable<Inbox1Entry>({
    columns,
    data: entries,
    enableRowSelection: true,
    getRowId: (entry) => entry.id,
    onRowSelectionChange: (selection) =>
      setSelectedIds(Object.keys(selection).filter((id) => selection[id])),
    rowSelection,
  })

  const loadState = dataCollectionLoadState({
    error,
    labels,
    onRetry,
    pending,
    skeleton: <Inbox1Skeleton label={labels.loading} />,
  })
  const filtered = filteredProp ?? (category !== null || activeFilterCount > 0)

  return (
    <DataCollectionFrame
      className={className}
      data-block="inbox-1"
      data-category={category ?? 'all'}
      title={labels.title}
      toolbar={
        <DataCollectionSettingsToolbar
          activeFilterCount={activeFilterCount}
          labels={labels}
          left={
            <DataCollectionViewSwitcher<Inbox1View>
              counts={counts}
              icons={viewIcons}
              label={labels.categoryList}
              onViewChange={(view) =>
                changeCategory(view === 'all' ? null : view)
              }
              view={category ?? 'all'}
              viewCountName={labels.viewCountName}
              viewLabels={viewLabels}
              views={views}
            />
          }
          loading={Boolean(loadState)}
          onClearFilters={clearFilters}
        >
          <Inbox1Settings
            category={category}
            kindFilter={kindFilter}
            labels={labels}
            onKindFilterChange={setKindFilter}
            onReadFilterChange={setReadFilter}
            onReceivedFilterChange={setReceivedFilter}
            onSortChange={setSort}
            readFilter={readFilter}
            receivedFilter={receivedFilter}
            sort={sort}
          />
        </DataCollectionSettingsToolbar>
      }
    >
      {loadState ?? (
        <DataCollection<Inbox1Entry>
          collection={collection}
          emptyMessage={filtered ? labels.emptyFiltered : labels.empty}
          footer={
            <Inbox1Footer
              hasMore={hasMore}
              labels={labels}
              loadingMore={loadingMore}
              loadMoreError={loadMoreError}
              markError={markError}
              onLoadMore={onLoadMore}
            />
          }
          getRowCanOpen={opensEntry}
          getRowOpenLabel={(entry) => labels.openEntry(entry.title)}
          label={labels.title}
          mode="table"
          onOpen={open ? (entry) => open(entry.id) : undefined}
          selectionActions={({
            clearSelection,
            selectedCount,
            selectedRows,
          }) => (
            <ActionBar
              actions={createInbox1SelectionActions({
                clearSelection,
                labels,
                onMarkRead,
                onOpen: open,
                selectedRows,
              })}
              clearSelectionLabel={labels.clearSelection}
              formatSelection={labels.selectedCount}
              label={labels.selectionActions}
              onClearSelection={clearSelection}
              selectedCount={selectedCount}
              selectedRows={selectedRows}
            />
          )}
          table={table}
        />
      )}
    </DataCollectionFrame>
  )
}
