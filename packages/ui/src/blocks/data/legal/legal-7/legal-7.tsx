'use client'

import { ActionBar } from '@tc96/ui/patterns/action-bar/components/action-bar'
import { CollectionPagination } from '@tc96/ui/patterns/collection-pagination/components/collection-pagination'
import { useDataTable } from '@tc96/ui/patterns/data-table/use-data-table'
import { useMemo } from 'react'
import {
  DataCollection,
  type DataCollectionDefinition,
} from '../../shared/collection/data-collection'
import { DataCollectionFrame } from '../../shared/collection/data-collection-frame'
import { dataCollectionLoadState } from '../../shared/collection/data-collection-load-state'
import { DataCollectionViewSwitcher } from '../../shared/collection/data-collection-view-switcher'
import {
  defaultDataCollectionLocale,
  defaultDataCollectionTimeZone,
} from '../../shared/collection/labels'
import {
  useControllable,
  useStableHandler,
} from '../../shared/collection/use-controllable'
import { resolveLegal7Labels } from './labels'
import { createLegal7Columns } from './legal-7-columns'
import { type Legal7FieldContext, legal7DateOf } from './legal-7-fields'
import { renderLegal7ListRow } from './legal-7-records'
import {
  createLegal7SelectionActions,
  isLegal7MixedSelection,
} from './legal-7-selection-actions'
import { Legal7Skeleton } from './legal-7-skeleton'
import { Legal7Toolbar } from './legal-7-toolbar'
import type {
  Legal7LawsuitFilter,
  Legal7Mode,
  Legal7Props,
  Legal7Publication,
  Legal7Sort,
} from './types'

const noTribunals: NonNullable<Legal7Props['tribunals']> = []
const noSelection: NonNullable<Legal7Props['selectedIds']> = []
const legal7Views = ['all'] as const

export function Legal7({
  className,
  error,
  filtered,
  labels: labelsProp,
  lawsuitFilter: lawsuitFilterProp,
  locale = defaultDataCollectionLocale,
  mode: modeProp,
  onCreateDeadline,
  onCreateLawsuit,
  onCreateTask,
  onDiscard,
  onLawsuitFilterChange,
  onLinkDeadline,
  onLinkLawsuit,
  onModeChange,
  onNoDeadline,
  onOpen,
  onPageChange,
  onRetry,
  onSavedViewCreate,
  onSavedViewDelete,
  onSavedViewDuplicate,
  onSavedViewRename,
  onSavedViewSelect,
  onSavedViewUpdate,
  onSavePreference,
  onSelectedIdsChange,
  onSortChange,
  onTribunalFilterChange,
  page: pageProp,
  pageCount = 1,
  pageSize,
  pending,
  publications,
  savedViewId,
  savedViewModified,
  savedViews,
  savedViewsLoading,
  savedViewsPending,
  selectedIds: selectedIdsProp,
  sort: sortProp,
  timeZone = defaultDataCollectionTimeZone,
  total = 0,
  tribunalFilter: tribunalFilterProp,
  tribunals = noTribunals,
  tribunalsLoading = false,
}: Readonly<Legal7Props>) {
  const labels = useMemo(() => resolveLegal7Labels(labelsProp), [labelsProp])
  const [mode, setMode] = useControllable<Legal7Mode>(
    modeProp,
    'table',
    onModeChange,
  )
  const [sort, setSort] = useControllable<Legal7Sort>(
    sortProp,
    'oldest',
    onSortChange,
  )
  const [lawsuitFilter, setLawsuitFilter] =
    useControllable<Legal7LawsuitFilter | null>(
      lawsuitFilterProp,
      null,
      onLawsuitFilterChange,
    )
  const [tribunalFilter, setTribunalFilter] = useControllable<string | null>(
    tribunalFilterProp,
    null,
    onTribunalFilterChange,
  )
  const [page, setPage] = useControllable<number>(pageProp, 1, onPageChange)
  const [selectedIds, setSelectedIds] = useControllable<string[]>(
    selectedIdsProp,
    noSelection,
    onSelectedIdsChange,
  )
  const openPublication = useStableHandler(onOpen)

  const context = useMemo<Legal7FieldContext>(() => {
    const format = (value: string) => {
      const date = legal7DateOf(value, timeZone)
      return new Intl.DateTimeFormat(locale, {
        day: '2-digit',
        month: '2-digit',
        timeZone: date.timeZone,
        year: 'numeric',
      }).format(new Date(date.value))
    }
    return {
      formatDate: format,
      labels,
      locale,
      onOpen: openPublication,
      timeZone,
    }
  }, [labels, locale, openPublication, timeZone])

  const openLabelOf = (item: Legal7Publication) =>
    labels.openPublication(context.formatDate(item.availableOn), item.tribunal)

  const collection = useMemo<DataCollectionDefinition<Legal7Publication>>(
    () => ({
      getKey: (item) => item.id,
      getLabel: (item) => labels.kindAndTribunal(item.kind, item.tribunal),
      groupings: [],
      records: publications,
    }),
    [labels, publications],
  )

  const columns = useMemo(() => createLegal7Columns(context), [context])
  const rowSelection = useMemo(
    () => Object.fromEntries(selectedIds.map((id) => [id, true as const])),
    [selectedIds],
  )
  const { table } = useDataTable<Legal7Publication>({
    columns,
    data: publications,
    enableRowSelection: true,
    getRowId: (item) => item.id,
    onRowSelectionChange: (selection) =>
      setSelectedIds(Object.keys(selection).filter((id) => selection[id])),
    rowSelection,
  })

  const loadState = dataCollectionLoadState({
    error,
    labels,
    onRetry,
    pending,
    skeleton: <Legal7Skeleton label={labels.loading} />,
  })
  const hasSavedViews = Boolean(
    savedViews ||
      savedViewsLoading ||
      onSavedViewCreate ||
      onSavedViewDelete ||
      onSavedViewDuplicate ||
      onSavedViewRename ||
      onSavedViewSelect ||
      onSavedViewUpdate,
  )
  const isFiltered =
    filtered ?? (lawsuitFilter !== null || tribunalFilter !== null)

  return (
    <DataCollectionFrame
      className={className}
      data-block="legal-7"
      title={labels.title}
      toolbar={
        <Legal7Toolbar
          labels={labels}
          lawsuitFilter={lawsuitFilter}
          left={
            hasSavedViews ? (
              <DataCollectionViewSwitcher
                label={labels.viewList}
                modified={savedViewModified}
                onSavedViewCreate={onSavedViewCreate}
                onSavedViewDelete={onSavedViewDelete}
                onSavedViewDuplicate={onSavedViewDuplicate}
                onSavedViewRename={onSavedViewRename}
                onSavedViewSelect={onSavedViewSelect}
                onSavedViewUpdate={onSavedViewUpdate}
                onViewChange={() => onSavedViewSelect?.(null)}
                savedViewId={savedViewId}
                savedViewLabels={labels.savedViews}
                savedViews={savedViews}
                savedViewsLoading={savedViewsLoading}
                savedViewsPending={savedViewsPending}
                view="all"
                viewLabels={{ all: labels.allPublications }}
                views={legal7Views}
              />
            ) : undefined
          }
          loading={Boolean(loadState)}
          mode={mode}
          onLawsuitFilterChange={setLawsuitFilter}
          onModeChange={setMode}
          onSavePreference={onSavePreference}
          onSortChange={setSort}
          onTribunalFilterChange={setTribunalFilter}
          sort={sort}
          tribunalFilter={tribunalFilter}
          tribunals={tribunals}
          tribunalsLoading={tribunalsLoading}
        />
      }
    >
      {loadState ?? (
        <DataCollection<Legal7Publication>
          collection={collection}
          emptyMessage={isFiltered ? labels.noResult : labels.empty}
          footer={
            total > 0 ? (
              <CollectionPagination
                label={labels.pagination}
                onPageChange={setPage}
                page={page}
                pageCount={pageCount}
                pageSize={pageSize}
                total={total}
              />
            ) : undefined
          }
          getRowOpenLabel={openLabelOf}
          label={labels.title}
          mode={mode}
          onOpen={
            openPublication ? (item) => openPublication(item.id) : undefined
          }
          renderListRecord={renderLegal7ListRow(context)}
          selectionActions={({
            clearSelection,
            selectedCount,
            selectedRows,
          }) => (
            <ActionBar
              actions={createLegal7SelectionActions({
                labels,
                onCreateDeadline,
                onCreateLawsuit,
                onCreateTask,
                onDiscard,
                onLinkDeadline,
                onLinkLawsuit,
                onNoDeadline,
                selectedRows,
              })}
              clearSelectionLabel={labels.clearSelection}
              formatSelection={labels.selectedCount}
              label={labels.selectionActions}
              notice={
                isLegal7MixedSelection(selectedRows)
                  ? labels.bulkHint
                  : undefined
              }
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
