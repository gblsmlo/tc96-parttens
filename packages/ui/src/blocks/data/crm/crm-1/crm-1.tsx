'use client'

import { ActionBar } from '@tc96/ui/patterns/action-bar/components/action-bar'
import { useDataTable } from '@tc96/ui/patterns/collection/layouts/data-table/use-data-table'
import { CollectionPagination } from '@tc96/ui/patterns/collection-pagination/components/collection-pagination'
import { useMemo } from 'react'
import {
  DataCollection,
  type DataCollectionDefinition,
} from '../../shared/collection/data-collection'
import { DataCollectionFrame } from '../../shared/collection/data-collection-frame'
import { dataCollectionLoadState } from '../../shared/collection/data-collection-load-state'
import { DataCollectionViewSwitcher } from '../../shared/collection/data-collection-view-switcher'
import {
  useControllable,
  useStableHandler,
} from '../../shared/collection/use-controllable'
import { createCrm1Columns } from './crm-1-columns'
import type { Crm1FieldContext, Crm1Row } from './crm-1-fields'
import { crm1Variants } from './crm-1-options'
import { renderCrm1ListRow } from './crm-1-records'
import { createCrm1SelectionActions } from './crm-1-selection-actions'
import { Crm1Skeleton } from './crm-1-skeleton'
import { Crm1Toolbar } from './crm-1-toolbar'
import { resolveCrm1Labels } from './labels'
import type {
  Crm1Archived,
  Crm1LeadStatus,
  Crm1Mode,
  Crm1Option,
  Crm1Props,
  Crm1Sort,
  Crm1Variant,
} from './types'

export { crm1Modes, crm1Sorts, crm1Variants } from './crm-1-options'

const noOptions: Crm1Option[] = []
const noIds: string[] = []

export function Crm1(props: Readonly<Crm1Props>) {
  const {
    archivedFilter: archivedFilterProp,
    className,
    counts,
    error,
    filtered = false,
    labels: labelsProp,
    leadFilter: leadFilterProp,
    mode: modeProp,
    onArchivedFilterChange,
    onBulkArchive,
    onBulkUnarchive,
    onCreate,
    onLeadFilterChange,
    onModeChange,
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
    onSearchChange,
    onSelectedIdsChange,
    onSortChange,
    onTagFilterChange,
    onVariantChange,
    page: pageProp,
    pageCount,
    pageSize,
    pending,
    records,
    savedViewId,
    savedViewModified,
    savedViews,
    savedViewsLoading,
    savedViewsPending,
    search: searchProp,
    selectedIds: selectedIdsProp,
    sort: sortProp,
    tagFilter: tagFilterProp,
    tags = noOptions,
    tagsLoading = false,
    total,
    variant,
  } = props
  const sectors =
    (props.variant === 'companies' ? props.sectors : undefined) ?? noOptions
  const onBulkSectorChange =
    props.variant === 'companies' ? props.onBulkSectorChange : undefined

  const labels = useMemo(() => resolveCrm1Labels(labelsProp), [labelsProp])
  const variantLabels = labels[variant]
  const [mode, setMode] = useControllable<Crm1Mode>(
    modeProp,
    'list',
    onModeChange,
  )
  const [search, setSearch] = useControllable(searchProp, '', onSearchChange)
  const [sort, setSort] = useControllable<Crm1Sort>(
    sortProp,
    'name_asc',
    onSortChange,
  )
  const [archivedFilter, setArchivedFilter] =
    useControllable<Crm1Archived | null>(
      archivedFilterProp,
      null,
      onArchivedFilterChange,
    )
  const [leadFilter, setLeadFilter] = useControllable<Crm1LeadStatus | null>(
    leadFilterProp,
    null,
    onLeadFilterChange,
  )
  const [tagFilter, setTagFilter] = useControllable<string[]>(
    tagFilterProp,
    noIds,
    onTagFilterChange,
  )
  const [selectedIds, setSelectedIds] = useControllable<string[]>(
    selectedIdsProp,
    noIds,
    onSelectedIdsChange,
  )
  const [page, setPage] = useControllable(pageProp, 1, onPageChange)

  const openRecord = useStableHandler(onOpen)

  const context = useMemo<Crm1FieldContext>(
    () => ({ labels, onOpen: openRecord, sectors, tags, variant }),
    [labels, openRecord, sectors, tags, variant],
  )

  const selectable = Boolean(
    selectedIdsProp ||
      onSelectedIdsChange ||
      onBulkArchive ||
      onBulkUnarchive ||
      onBulkSectorChange,
  )

  const collection = useMemo<DataCollectionDefinition<Crm1Row>>(
    () => ({
      getKey: (item) => item.id,
      getLabel: (item) => item.name,
      groupings: [],
      records,
    }),
    [records],
  )

  const columns = useMemo(
    () => createCrm1Columns(context, selectable),
    [context, selectable],
  )
  const rowSelection = useMemo(
    () => Object.fromEntries(selectedIds.map((id) => [id, true as const])),
    [selectedIds],
  )
  const { table } = useDataTable<Crm1Row>({
    columns,
    data: records,
    enableRowSelection: selectable,
    getRowId: (item) => item.id,
    onRowSelectionChange: (selection) =>
      setSelectedIds(Object.keys(selection).filter((id) => selection[id])),
    rowSelection,
  })

  const loadState = dataCollectionLoadState({
    error,
    labels: { ...labels, ...variantLabels },
    onRetry,
    pending,
    skeleton: <Crm1Skeleton label={variantLabels.loading} variant={variant} />,
  })

  const changeVariant = (next: Crm1Variant) => {
    if (next !== variant && selectedIds.length > 0) setSelectedIds([])
    onVariantChange?.(next)
  }

  const hasRecords = total === undefined ? records.length > 0 : total > 0

  return (
    <DataCollectionFrame
      className={className}
      data-block="crm-1"
      data-variant={variant}
      title={variantLabels.title}
      toolbar={
        <Crm1Toolbar
          archivedFilter={archivedFilter}
          labels={labels}
          leadFilter={leadFilter}
          left={
            onVariantChange ? (
              <DataCollectionViewSwitcher<Crm1Variant>
                counts={counts}
                label={labels.viewList}
                modified={savedViewModified}
                onSavedViewCreate={onSavedViewCreate}
                onSavedViewDelete={onSavedViewDelete}
                onSavedViewDuplicate={onSavedViewDuplicate}
                onSavedViewRename={onSavedViewRename}
                onSavedViewSelect={onSavedViewSelect}
                onSavedViewUpdate={onSavedViewUpdate}
                onViewChange={changeVariant}
                savedViewId={savedViewId}
                savedViewLabels={labels.savedViews}
                savedViews={savedViews}
                savedViewsLoading={savedViewsLoading}
                savedViewsPending={savedViewsPending}
                view={variant}
                viewCountName={labels.viewCountName}
                viewLabels={{
                  companies: labels.companies.title,
                  people: labels.people.title,
                }}
                views={crm1Variants}
              />
            ) : undefined
          }
          loading={Boolean(loadState)}
          mode={mode}
          onArchivedFilterChange={
            onArchivedFilterChange ? setArchivedFilter : undefined
          }
          onCreate={onCreate}
          onLeadFilterChange={onLeadFilterChange ? setLeadFilter : undefined}
          onModeChange={setMode}
          onSavePreference={onSavePreference}
          onSearchChange={onSearchChange ? setSearch : undefined}
          onSortChange={onSortChange ? setSort : undefined}
          onTagFilterChange={setTagFilter}
          search={search}
          sort={sort}
          tagFilter={tagFilter}
          tags={tags}
          tagsLoading={tagsLoading}
          variant={variant}
        />
      }
    >
      {loadState ?? (
        <DataCollection<Crm1Row>
          collection={collection}
          emptyMessage={filtered ? variantLabels.noResult : variantLabels.empty}
          footer={
            pageCount !== undefined && hasRecords ? (
              <CollectionPagination
                buttonLabels={labels.paginationButtons}
                formatRange={labels.pageRange}
                label={variantLabels.pagination}
                onPageChange={setPage}
                page={page}
                pageCount={pageCount}
                pageSize={pageSize}
                total={total}
              />
            ) : undefined
          }
          getRowOpenLabel={(item) => labels.openRecord(item.name)}
          label={variantLabels.title}
          mode={mode}
          onOpen={openRecord ? (item) => openRecord(item.id) : undefined}
          renderListRecord={renderCrm1ListRow(context)}
          selectionActions={
            selectable
              ? ({ clearSelection, selectedCount, selectedRows }) => (
                  <ActionBar
                    actions={createCrm1SelectionActions({
                      labels,
                      onBulkArchive,
                      onBulkSectorChange,
                      onBulkUnarchive,
                      onDone: clearSelection,
                      sectors,
                      selectedRows,
                    })}
                    clearSelectionLabel={labels.clearSelection}
                    formatSelection={labels.selectedCount}
                    label={variantLabels.selectionActions}
                    onClearSelection={clearSelection}
                    selectedCount={selectedCount}
                    selectedRows={selectedRows}
                  />
                )
              : undefined
          }
          table={table}
        />
      )}
    </DataCollectionFrame>
  )
}
