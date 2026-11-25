'use client'

import { SquaresFourIcon } from '@phosphor-icons/react'
import { createAmountFormatter } from '@tc96/ui/helpers/format'
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
import { defaultDataCollectionLocale } from '../../shared/collection/labels'
import {
  useControllable,
  useStableHandler,
} from '../../shared/collection/use-controllable'
import { resolveLegal9Labels } from './labels'
import { createLegal9Columns } from './legal-9-columns'
import type { Legal9FieldContext } from './legal-9-fields'
import {
  legal9BillingModels,
  legal9Groupings,
  legal9Statuses,
  pickLegal9,
} from './legal-9-options'
import { renderLegal9ListRow } from './legal-9-records'
import { createLegal9SelectionActions } from './legal-9-selection-actions'
import { Legal9Skeleton } from './legal-9-skeleton'
import { Legal9Toolbar } from './legal-9-toolbar'
import type {
  Legal9BillingModel,
  Legal9GroupBy,
  Legal9Mode,
  Legal9Props,
  Legal9Record,
  Legal9Sort,
  Legal9Status,
} from './types'

export {
  legal9BillingModels,
  legal9Groupings,
  legal9Modes,
  legal9Sorts,
  legal9Statuses,
} from './legal-9-options'

const noOwners: NonNullable<Legal9Props['owners']> = []
const noIds: string[] = []
const defaultView = ['all'] as const
const defaultViewIcons = { all: <SquaresFourIcon aria-hidden="true" /> }

export function Legal9({
  billingModelFilter: billingModelFilterProp,
  className,
  collapsedGroupIds,
  currency = 'BRL',
  error,
  filtered = false,
  groupBy: groupByProp,
  labels: labelsProp,
  locale = defaultDataCollectionLocale,
  mode: modeProp,
  onBillingModelChange,
  onBillingModelFilterChange,
  onBulkBillingModelChange,
  onBulkOwnerChange,
  onCollapsedGroupIdsChange,
  onCreate,
  onDefaultViewSelect,
  onGroupByChange,
  onModeChange,
  onOpen,
  onOwnerChange,
  onOwnerFilterChange,
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
  onStatusFilterChange,
  ownerFilter: ownerFilterProp,
  owners = noOwners,
  ownersLoading = false,
  page: pageProp,
  pageCount,
  pageSize,
  pending,
  records,
  savedViewId,
  savedViewModified,
  savedViews,
  savedViewsLoading = false,
  savedViewsPending,
  search: searchProp,
  selectedIds: selectedIdsProp,
  sort: sortProp,
  statusFilter: statusFilterProp,
  total,
  viewCount,
}: Readonly<Legal9Props>) {
  const labels = useMemo(() => resolveLegal9Labels(labelsProp), [labelsProp])
  const [mode, setMode] = useControllable<Legal9Mode>(
    modeProp,
    'table',
    onModeChange,
  )
  const [groupBy, setGroupBy] = useControllable<Legal9GroupBy | null>(
    groupByProp,
    null,
    onGroupByChange,
  )
  const [search, setSearch] = useControllable(searchProp, '', onSearchChange)
  const [sort, setSort] = useControllable<Legal9Sort>(
    sortProp,
    'updated',
    onSortChange,
  )
  const [statusFilter, setStatusFilter] = useControllable<Legal9Status | null>(
    statusFilterProp,
    null,
    onStatusFilterChange,
  )
  const [billingModelFilter, setBillingModelFilter] =
    useControllable<Legal9BillingModel | null>(
      billingModelFilterProp,
      null,
      onBillingModelFilterChange,
    )
  const [ownerFilter, setOwnerFilter] = useControllable<string | null>(
    ownerFilterProp,
    null,
    onOwnerFilterChange,
  )
  const [selectedIds, setSelectedIds] = useControllable<string[]>(
    selectedIdsProp,
    noIds,
    onSelectedIdsChange,
  )
  const [page, setPage] = useControllable(pageProp, 1, onPageChange)

  const openRecord = useStableHandler(onOpen)
  const changeOwner = useStableHandler(onOwnerChange)
  const changeBillingModel = useStableHandler(onBillingModelChange)

  const context = useMemo<Legal9FieldContext>(() => {
    const formatter = createAmountFormatter({ currency, locale })
    return {
      formatAmount: (cents) => formatter.format(cents / 100),
      labels,
      onBillingModelChange: changeBillingModel,
      onOpen: openRecord,
      onOwnerChange: changeOwner,
      owners,
    }
  }, [
    changeBillingModel,
    changeOwner,
    currency,
    labels,
    locale,
    openRecord,
    owners,
  ])

  const selectable = Boolean(
    selectedIdsProp ||
      onSelectedIdsChange ||
      onBulkBillingModelChange ||
      onBulkOwnerChange,
  )

  const collection = useMemo<DataCollectionDefinition<Legal9Record>>(
    () => ({
      getKey: (item) => item.id,
      getLabel: (item) => item.title,
      groupings: [
        {
          getGroupId: (item) => item.status,
          id: 'status',
          label: labels.groupings.status,
          options: legal9Statuses.map((status) => ({
            id: status,
            label: labels.statuses[status],
          })),
        },
        {
          getGroupId: (item) => item.billingModel,
          id: 'billingModel',
          label: labels.groupings.billingModel,
          options: legal9BillingModels.map((model) => ({
            id: model,
            label: labels.billingModels[model],
          })),
          unassignedLabel: labels.noBillingModel,
        },
        ...(owners.length
          ? [
              {
                getGroupId: (item: Legal9Record) => item.ownerId,
                id: 'owner',
                label: labels.groupings.owner,
                options: owners.map(({ id, label }) => ({ id, label })),
                unassignedLabel: labels.unassigned,
              },
            ]
          : []),
      ],
      records,
    }),
    [labels, owners, records],
  )

  const groupings = useMemo(
    () =>
      legal9Groupings.filter((grouping) =>
        collection.groupings.some(({ id }) => id === grouping),
      ),
    [collection],
  )

  const tableRecords = useMemo(() => {
    const dimension =
      mode === 'table'
        ? collection.groupings.find(({ id }) => id === groupBy)
        : undefined
    if (!dimension) return records
    const rank = new Map(
      dimension.options.map((option, index) => [option.id, index]),
    )
    const rankOf = (item: Legal9Record) => {
      const groupId = dimension.getGroupId(item)
      if (groupId === null) return rank.size + 1
      return rank.get(groupId) ?? rank.size
    }
    return [...records].sort((a, b) => rankOf(a) - rankOf(b))
  }, [collection, groupBy, mode, records])

  const columns = useMemo(
    () => createLegal9Columns(context, selectable),
    [context, selectable],
  )
  const rowSelection = useMemo(
    () => Object.fromEntries(selectedIds.map((id) => [id, true as const])),
    [selectedIds],
  )
  const { table } = useDataTable<Legal9Record>({
    columns,
    data: tableRecords,
    enableRowSelection: selectable,
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
    skeleton: <Legal9Skeleton label={labels.loading} />,
  })

  const hasRecords = total === undefined ? records.length > 0 : total > 0
  const showViews = savedViews !== undefined || savedViewsLoading

  return (
    <DataCollectionFrame
      className={className}
      data-block="legal-9"
      title={labels.title}
      toolbar={
        <Legal9Toolbar
          billingModelFilter={billingModelFilter}
          groupBy={groupBy}
          groupings={groupings}
          labels={labels}
          left={
            showViews ? (
              <DataCollectionViewSwitcher<'all'>
                counts={
                  viewCount === undefined ? undefined : { all: viewCount }
                }
                icons={defaultViewIcons}
                label={labels.viewList}
                locale={locale}
                modified={savedViewModified}
                onSavedViewCreate={onSavedViewCreate}
                onSavedViewDelete={onSavedViewDelete}
                onSavedViewDuplicate={onSavedViewDuplicate}
                onSavedViewRename={onSavedViewRename}
                onSavedViewSelect={onSavedViewSelect}
                onSavedViewUpdate={onSavedViewUpdate}
                onViewChange={() => onDefaultViewSelect?.()}
                savedViewId={savedViewId}
                savedViewLabels={labels.savedViews}
                savedViews={savedViews}
                savedViewsLoading={savedViewsLoading}
                savedViewsPending={savedViewsPending}
                view="all"
                viewCountName={labels.viewCountName}
                viewLabels={{ all: labels.defaultView }}
                views={defaultView}
              />
            ) : undefined
          }
          loading={Boolean(loadState)}
          mode={mode}
          onBillingModelFilterChange={
            onBillingModelFilterChange ? setBillingModelFilter : undefined
          }
          onCreate={onCreate}
          onGroupByChange={onGroupByChange ? setGroupBy : undefined}
          onModeChange={setMode}
          onOwnerFilterChange={setOwnerFilter}
          onSavePreference={onSavePreference}
          onSearchChange={onSearchChange ? setSearch : undefined}
          onSortChange={onSortChange ? setSort : undefined}
          onStatusFilterChange={
            onStatusFilterChange ? setStatusFilter : undefined
          }
          ownerFilter={ownerFilter}
          owners={owners}
          ownersLoading={ownersLoading}
          search={search}
          sort={sort}
          statusFilter={statusFilter}
        />
      }
    >
      {loadState ?? (
        <DataCollection<Legal9Record>
          collapsedGroupIds={collapsedGroupIds}
          collection={collection}
          emptyGroupMessage={labels.emptyGroup}
          emptyMessage={filtered ? labels.noResult : labels.empty}
          footer={
            pageCount !== undefined && hasRecords ? (
              <CollectionPagination
                buttonLabels={labels.paginationButtons}
                formatRange={labels.pageRange}
                label={labels.pagination}
                onPageChange={setPage}
                page={page}
                pageCount={pageCount}
                pageSize={pageSize}
                total={total}
              />
            ) : undefined
          }
          getGroupToggleLabel={labels.groupToggle}
          getRowOpenLabel={(item) => labels.openRecord(item.title)}
          groupBy={groupBy}
          label={labels.title}
          mode={mode}
          onCollapsedGroupIdsChange={
            onCollapsedGroupIdsChange
              ? (groupIds) => onCollapsedGroupIdsChange([...groupIds])
              : undefined
          }
          onGroupByChange={(next) =>
            setGroupBy(pickLegal9(legal9Groupings, next))
          }
          onOpen={openRecord ? (item) => openRecord(item.id) : undefined}
          renderListRecord={renderLegal9ListRow(context)}
          selectionActions={
            selectable
              ? ({ clearSelection, selectedCount, selectedRows }) => (
                  <ActionBar
                    actions={createLegal9SelectionActions({
                      labels,
                      onBulkBillingModelChange,
                      onBulkOwnerChange,
                      onDone: clearSelection,
                      owners,
                      selectedRows,
                    })}
                    clearSelectionLabel={labels.clearSelection}
                    formatSelection={labels.selectedCount}
                    label={labels.selectionActions}
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
