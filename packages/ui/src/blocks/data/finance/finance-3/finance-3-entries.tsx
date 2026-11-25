'use client'

import { CollectionSearchField } from '@tc96/ui/patterns/collection/shared/components/collection-search-field'
import { useMemo } from 'react'
import {
  useControllable,
  useStableHandler,
} from '../../shared/collection/use-controllable'
import {
  createFinance3EntriesColumns,
  type Finance3EntriesContext,
} from './finance-3-entries-columns'
import {
  Finance3EntriesSettings,
  finance3ActiveEntryFilterCount,
} from './finance-3-entries-settings'
import {
  createFinance3Formatter,
  defaultFinance3Locale,
} from './finance-3-format'
import { Finance3Frame } from './finance-3-frame'
import { finance3DefaultHiddenColumns } from './finance-3-options'
import { createFinance3EntriesSelectionActions } from './finance-3-selection-actions'
import { Finance3Toolbar, Finance3ToolbarButton } from './finance-3-toolbar'
import { Finance3ViewSwitcher } from './finance-3-view-switcher'
import type {
  Finance3EntriesProps,
  Finance3Entry,
  Finance3EntryColumnId,
  Finance3EntrySort,
  Finance3EntryType,
  Finance3FeeType,
  Finance3Labels,
  Finance3Situation,
  Finance3View,
} from './types'
import { useFinance3Table } from './use-finance-3-table'

const noOptions: NonNullable<Finance3EntriesProps['accounts']> = []
const noCategories: NonNullable<Finance3EntriesProps['categories']> = []
const noMembers: NonNullable<Finance3EntriesProps['members']> = []
const entryId = (item: Finance3Entry) => item.id
const entryTitle = (item: Finance3Entry) => item.description

export function Finance3Entries({
  accountFilter: accountFilterProp,
  accounts = noOptions,
  accountsLoading = false,
  categories = noCategories,
  className,
  counts,
  currency,
  error,
  feeTypeFilter: feeTypeFilterProp,
  filtered = false,
  hiddenColumns: hiddenColumnsProp,
  labels,
  locale = defaultFinance3Locale,
  members = noMembers,
  onAccountChange,
  onAccountFilterChange,
  onBulkResponsibleChange,
  onBulkSettle,
  onCategoryChange,
  onCreate,
  onFeeTypeFilterChange,
  onHiddenColumnsChange,
  onOpen,
  onPageChange,
  onResponsibleChange,
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
  onSituationFilterChange,
  onSortChange,
  onTypeFilterChange,
  onViewChange,
  page,
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
  selectedIds,
  situationFilter: situationFilterProp,
  sort: sortProp,
  total,
  typeFilter: typeFilterProp,
  view: viewProp,
  views,
}: Readonly<
  Omit<Finance3EntriesProps, 'labels'> & { labels: Finance3Labels }
>) {
  const [view, setView] = useControllable<Finance3View>(
    viewProp,
    'all',
    onViewChange,
  )
  const [search, setSearch] = useControllable(searchProp, '', onSearchChange)
  const [sort, setSort] = useControllable<Finance3EntrySort | null>(
    sortProp,
    null,
    onSortChange,
  )
  const [situationFilter, setSituationFilter] =
    useControllable<Finance3Situation | null>(
      situationFilterProp,
      null,
      onSituationFilterChange,
    )
  const [typeFilter, setTypeFilter] = useControllable<Finance3EntryType | null>(
    typeFilterProp,
    null,
    onTypeFilterChange,
  )
  const [feeTypeFilter, setFeeTypeFilter] =
    useControllable<Finance3FeeType | null>(
      feeTypeFilterProp,
      null,
      onFeeTypeFilterChange,
    )
  const [accountFilter, setAccountFilter] = useControllable<string | null>(
    accountFilterProp,
    null,
    onAccountFilterChange,
  )
  const [hiddenColumns, setHiddenColumns] = useControllable<
    Finance3EntryColumnId[]
  >(
    hiddenColumnsProp,
    finance3DefaultHiddenColumns as Finance3EntryColumnId[],
    onHiddenColumnsChange,
  )

  const changeAccount = useStableHandler(onAccountChange)
  const changeCategory = useStableHandler(onCategoryChange)
  const changeResponsible = useStableHandler(onResponsibleChange)
  const format = useMemo(
    () => createFinance3Formatter({ currency, locale }),
    [currency, locale],
  )
  const context = useMemo<Finance3EntriesContext>(
    () => ({
      accounts,
      categories,
      format,
      labels,
      locale,
      members,
      onAccountChange: changeAccount,
      onCategoryChange: changeCategory,
      onResponsibleChange: changeResponsible,
    }),
    [
      accounts,
      categories,
      changeAccount,
      changeCategory,
      changeResponsible,
      format,
      labels,
      locale,
      members,
    ],
  )
  const selectable = Boolean(
    selectedIds ||
      onSelectedIdsChange ||
      onBulkSettle ||
      onBulkResponsibleChange,
  )
  const columns = useMemo(
    () => createFinance3EntriesColumns(context, selectable),
    [context, selectable],
  )
  const table = useFinance3Table<Finance3Entry>({
    columns,
    getId: entryId,
    hiddenColumns,
    onHiddenColumnsChange: (columnIds) =>
      setHiddenColumns(columnIds as Finance3EntryColumnId[]),
    onSelectedIdsChange,
    records,
    selectable,
    selectedIds,
  })
  const filters = { accountFilter, feeTypeFilter, situationFilter, typeFilter }
  const entryLabels = labels.entries

  return (
    <Finance3Frame<Finance3Entry>
      className={className}
      emptyMessage={filtered ? entryLabels.noResult : entryLabels.empty}
      error={error}
      getId={entryId}
      getTitle={entryTitle}
      labels={labels}
      onOpen={onOpen ? (item) => onOpen(item.id) : undefined}
      onPageChange={onPageChange}
      onRetry={onRetry}
      page={page}
      pageCount={pageCount}
      pageSize={pageSize}
      pending={pending}
      records={records}
      selection={
        selectable
          ? {
              actions: (selectedRows, clearSelection) =>
                createFinance3EntriesSelectionActions({
                  accounts,
                  labels,
                  members,
                  onBulkResponsibleChange,
                  onBulkSettle,
                  onDone: clearSelection,
                  selectedRows,
                }),
              label: entryLabels.selectionActions,
            }
          : undefined
      }
      table={table}
      toolbar={(loading) => (
        <Finance3Toolbar
          actions={
            onCreate ? (
              <Finance3ToolbarButton onClick={onCreate} variant="default">
                {labels.create}
              </Finance3ToolbarButton>
            ) : null
          }
          activeFilterCount={finance3ActiveEntryFilterCount(filters)}
          labels={labels}
          left={
            <Finance3ViewSwitcher
              counts={counts}
              labels={labels}
              locale={locale}
              onSavedViewCreate={onSavedViewCreate}
              onSavedViewDelete={onSavedViewDelete}
              onSavedViewDuplicate={onSavedViewDuplicate}
              onSavedViewRename={onSavedViewRename}
              onSavedViewSelect={onSavedViewSelect}
              onSavedViewUpdate={onSavedViewUpdate}
              onViewChange={setView}
              savedViewId={savedViewId}
              savedViewModified={savedViewModified}
              savedViews={savedViews}
              savedViewsLoading={savedViewsLoading}
              savedViewsPending={savedViewsPending}
              view={view}
              views={views}
            />
          }
          loading={loading}
          onClearFilters={() => {
            if (onSituationFilterChange) setSituationFilter(null)
            if (onTypeFilterChange) setTypeFilter(null)
            if (onFeeTypeFilterChange) setFeeTypeFilter(null)
            if (onAccountFilterChange) setAccountFilter(null)
          }}
          onSavePreference={onSavePreference}
          search={
            onSearchChange ? (
              <CollectionSearchField
                label={entryLabels.search}
                onCommit={setSearch}
                placeholder={entryLabels.search}
                value={search}
              />
            ) : null
          }
          settings={
            <Finance3EntriesSettings
              accountFilter={accountFilter}
              accounts={accounts}
              accountsLoading={accountsLoading}
              feeTypeFilter={feeTypeFilter}
              labels={labels}
              onAccountFilterChange={
                onAccountFilterChange ? setAccountFilter : undefined
              }
              onFeeTypeFilterChange={
                onFeeTypeFilterChange ? setFeeTypeFilter : undefined
              }
              onSituationFilterChange={
                onSituationFilterChange ? setSituationFilter : undefined
              }
              onSortChange={onSortChange ? setSort : undefined}
              onTypeFilterChange={
                onTypeFilterChange ? setTypeFilter : undefined
              }
              situationFilter={situationFilter}
              sort={sort}
              table={table}
              typeFilter={typeFilter}
            />
          }
          variantLabels={entryLabels}
        />
      )}
      total={total}
      variant="entries"
      variantLabels={entryLabels}
    />
  )
}
