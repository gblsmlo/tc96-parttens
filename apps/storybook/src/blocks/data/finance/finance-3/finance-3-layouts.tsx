import {
  Finance3,
  type Finance3ClientMoneyProps,
  type Finance3EntriesProps,
  type Finance3Entry,
  type Finance3EntryColumnId,
  type Finance3EntrySort,
  type Finance3EntryType,
  type Finance3FeeType,
  type Finance3Receivable,
  type Finance3ReceivablesProps,
  type Finance3Situation,
  type Finance3StatementProps,
  type Finance3View,
} from '@tc96/ui/blocks/data/finance/finance-3'
import { useEffect, useMemo, useState } from 'react'
import {
  accounts,
  categories,
  clientBalances,
  counts,
  entries,
  entryInView,
  members,
  pageSize,
  periods,
  receivables,
  statementLines,
  statementSummary,
} from '../fixtures/finance-3.ts'
import type { Finance3Controls } from './finance-3-controls.ts'

type EntriesCallbacks = Pick<
  Finance3EntriesProps,
  | 'onAccountChange'
  | 'onAccountFilterChange'
  | 'onBulkResponsibleChange'
  | 'onBulkSettle'
  | 'onCategoryChange'
  | 'onCreate'
  | 'onFeeTypeFilterChange'
  | 'onHiddenColumnsChange'
  | 'onOpen'
  | 'onPageChange'
  | 'onResponsibleChange'
  | 'onSavePreference'
  | 'onSearchChange'
  | 'onSelectedIdsChange'
  | 'onSituationFilterChange'
  | 'onSortChange'
  | 'onTypeFilterChange'
  | 'onViewChange'
>

type ReceivablesCallbacks = Pick<
  Finance3ReceivablesProps,
  'onContact' | 'onIssueCharge' | 'onMarkCollected' | 'onReissueCharge'
>

type StatementCallbacks = Pick<
  Finance3StatementProps,
  'onExport' | 'onPeriodChange'
> & { onStatementAccountChange?: (accountId: string | null) => void }

type ClientMoneyCallbacks = {
  onOpenClient?: Finance3ClientMoneyProps['onOpen']
}

export interface ComposedFinance3Props
  extends Finance3Controls,
    EntriesCallbacks,
    ReceivablesCallbacks,
    StatementCallbacks,
    ClientMoneyCallbacks {}

const noop = () => undefined
const defaultHidden: Finance3EntryColumnId[] = [
  'account',
  'category',
  'feeType',
  'responsible',
]

const typeKinds: Record<Finance3EntryType, readonly string[]> = {
  expense: ['expense'],
  income: ['fee', 'other_income'],
  transfer: ['transfer'],
}

const sortValue = (item: Finance3Entry, sort: Finance3EntrySort) => {
  if (sort.column === 'amount') return item.amount
  if (sort.column === 'due') return item.dueOn
  if (sort.column === 'payer') return item.payer ?? ''
  if (sort.column === 'target') return item.target ?? ''
  return item.description
}

const sortEntries = (items: Finance3Entry[], sort: Finance3EntrySort | null) =>
  sort
    ? [...items].sort((a, b) => {
        const left = sortValue(a, sort)
        const right = sortValue(b, sort)
        const order =
          typeof left === 'number' && typeof right === 'number'
            ? left - right
            : String(left).localeCompare(String(right), 'pt-BR')
        return sort.direction === 'asc' ? order : -order
      })
    : items

const pageOf = <TRecord,>(
  items: TRecord[],
  page: number,
  paginated: boolean,
) =>
  paginated
    ? {
        page,
        pageCount: Math.max(1, Math.ceil(items.length / pageSize)),
        pageSize,
        records: items.slice((page - 1) * pageSize, page * pageSize),
        total: items.length,
      }
    : { records: items }

export const ComposedFinance3 = ({
  allColumns,
  bulkActions,
  create,
  editable,
  empty,
  headerActions,
  onAccountChange,
  onAccountFilterChange,
  onBulkResponsibleChange,
  onBulkSettle,
  onCategoryChange,
  onContact,
  onCreate,
  onExport,
  onFeeTypeFilterChange,
  onHiddenColumnsChange,
  onIssueCharge,
  onMarkCollected,
  onOpen,
  onOpenClient,
  onPageChange,
  onPeriodChange,
  onReissueCharge,
  onResponsibleChange,
  onSavePreference,
  onSearchChange,
  onSelectedIdsChange,
  onSituationFilterChange,
  onSortChange,
  onStatementAccountChange,
  onTypeFilterChange,
  onViewChange,
  openable,
  paginated,
  truncated,
  variant: variantControl,
  viewCounts,
}: Readonly<ComposedFinance3Props>) => {
  const initialView: Finance3View =
    variantControl === 'receivables' ? 'collection' : 'all'
  const [view, setView] = useState<Finance3View>(initialView)
  const [items, setItems] = useState<Finance3Entry[]>(entries)
  const [queue, setQueue] = useState<Finance3Receivable[]>(receivables)
  const [search, setSearch] = useState('')
  const [sort, setSort] = useState<Finance3EntrySort | null>(null)
  const [situationFilter, setSituationFilter] =
    useState<Finance3Situation | null>(null)
  const [typeFilter, setTypeFilter] = useState<Finance3EntryType | null>(null)
  const [feeTypeFilter, setFeeTypeFilter] = useState<Finance3FeeType | null>(
    null,
  )
  const [accountFilter, setAccountFilter] = useState<string | null>(null)
  const [hiddenColumns, setHiddenColumns] = useState<Finance3EntryColumnId[]>(
    allColumns ? [] : defaultHidden,
  )
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [page, setPage] = useState(1)
  const [statementAccount, setStatementAccount] = useState<string | null>(null)
  const [period, setPeriod] = useState<string | null>('month')
  const labels = useMemo(() => ({ create }), [create])

  useEffect(() => {
    setView(variantControl === 'receivables' ? 'collection' : 'all')
    setPage(1)
    setSelectedIds([])
  }, [variantControl])

  const ledger =
    variantControl === 'entries' || variantControl === 'receivables'
  const variant = ledger
    ? view === 'collection'
      ? 'receivables'
      : 'entries'
    : variantControl
  const firstPage = () => setPage(1)
  const changePage = (next: number) => {
    setPage(next)
    onPageChange?.(next)
  }
  const updateEntries = (
    ids: readonly string[],
    change: Partial<Finance3Entry>,
  ) =>
    setItems((current) =>
      current.map((item) =>
        ids.includes(item.id) ? { ...item, ...change } : item,
      ),
    )
  const changeSelection = (next: string[]) => {
    setSelectedIds(next)
    onSelectedIdsChange?.(next)
  }
  const ledgerProps = {
    counts: viewCounts ? counts : undefined,
    labels,
    onCreate: headerActions ? (onCreate ?? noop) : undefined,
    onSelectedIdsChange: bulkActions ? changeSelection : undefined,
    onViewChange: (next: Finance3View) => {
      setView(next)
      setSelectedIds([])
      firstPage()
      onViewChange?.(next)
    },
    selectedIds: bulkActions ? selectedIds : undefined,
    view,
  }

  if (variant === 'receivables') {
    const paged = pageOf(empty ? [] : queue, page, paginated)
    return (
      <Finance3
        {...ledgerProps}
        {...paged}
        onContact={onContact ?? noop}
        onIssueCharge={onIssueCharge ?? noop}
        onMarkCollected={
          bulkActions
            ? (ids) => {
                setQueue((current) =>
                  current.filter((item) => !ids.includes(item.id)),
                )
                onMarkCollected?.(ids)
              }
            : undefined
        }
        onPageChange={changePage}
        onReissueCharge={onReissueCharge ?? noop}
        truncated={truncated}
        variant="receivables"
      />
    )
  }

  if (variant === 'statement') {
    const paged = pageOf(empty ? [] : statementLines, page, paginated)
    return (
      <Finance3
        {...paged}
        accountFilter={statementAccount}
        accounts={accounts}
        onAccountFilterChange={(next) => {
          setStatementAccount(next)
          onStatementAccountChange?.(next)
        }}
        onExport={headerActions ? (onExport ?? noop) : undefined}
        onOpen={openable ? (onOpen ?? noop) : undefined}
        onPageChange={changePage}
        onPeriodChange={(next) => {
          setPeriod(next)
          onPeriodChange?.(next)
        }}
        period={period}
        periods={periods}
        summary={statementSummary}
        variant="statement"
      />
    )
  }

  if (variant === 'clientMoney') {
    const paged = pageOf(empty ? [] : clientBalances, page, paginated)
    return (
      <Finance3
        {...paged}
        onOpen={openable ? (onOpenClient ?? noop) : undefined}
        onPageChange={changePage}
        variant="clientMoney"
      />
    )
  }

  const matching = empty
    ? []
    : sortEntries(
        items.filter(
          (item) =>
            entryInView(item, view) &&
            item.description.toLowerCase().includes(search.toLowerCase()) &&
            (!situationFilter || item.situation === situationFilter) &&
            (!typeFilter || typeKinds[typeFilter].includes(item.kind)) &&
            (!feeTypeFilter || item.feeType === feeTypeFilter) &&
            (!accountFilter || item.accountId === accountFilter),
        ),
        sort,
      )
  const paged = pageOf(matching, page, paginated)

  return (
    <Finance3
      {...ledgerProps}
      {...paged}
      accountFilter={accountFilter}
      accounts={accounts}
      categories={categories}
      feeTypeFilter={feeTypeFilter}
      filtered={Boolean(
        search ||
          situationFilter ||
          typeFilter ||
          feeTypeFilter ||
          accountFilter,
      )}
      hiddenColumns={hiddenColumns}
      members={members}
      onAccountChange={
        editable
          ? (id, accountId) => {
              updateEntries([id], { accountId })
              onAccountChange?.(id, accountId)
            }
          : undefined
      }
      onAccountFilterChange={(next) => {
        setAccountFilter(next)
        firstPage()
        onAccountFilterChange?.(next)
      }}
      onBulkResponsibleChange={
        bulkActions
          ? (ids, responsibleId) => {
              updateEntries(ids, { responsibleId })
              onBulkResponsibleChange?.(ids, responsibleId)
            }
          : undefined
      }
      onBulkSettle={
        bulkActions
          ? (ids, accountId) => {
              updateEntries(ids, {
                accountId,
                canEdit: false,
                canSettle: false,
                situation: 'settled',
              })
              onBulkSettle?.(ids, accountId)
            }
          : undefined
      }
      onCategoryChange={
        editable
          ? (id, categoryId) => {
              updateEntries([id], { categoryId })
              onCategoryChange?.(id, categoryId)
            }
          : undefined
      }
      onFeeTypeFilterChange={(next) => {
        setFeeTypeFilter(next)
        firstPage()
        onFeeTypeFilterChange?.(next)
      }}
      onHiddenColumnsChange={(next) => {
        setHiddenColumns(next)
        onHiddenColumnsChange?.(next)
      }}
      onOpen={openable ? (onOpen ?? noop) : undefined}
      onPageChange={changePage}
      onResponsibleChange={
        editable
          ? (id, responsibleId) => {
              updateEntries([id], { responsibleId })
              onResponsibleChange?.(id, responsibleId)
            }
          : undefined
      }
      onSavePreference={onSavePreference ?? noop}
      onSearchChange={
        headerActions
          ? (next) => {
              setSearch(next)
              firstPage()
              onSearchChange?.(next)
            }
          : undefined
      }
      onSituationFilterChange={(next) => {
        setSituationFilter(next)
        firstPage()
        onSituationFilterChange?.(next)
      }}
      onSortChange={(next) => {
        setSort(next)
        onSortChange?.(next)
      }}
      onTypeFilterChange={(next) => {
        setTypeFilter(next)
        firstPage()
        onTypeFilterChange?.(next)
      }}
      search={search}
      situationFilter={situationFilter}
      sort={sort}
      typeFilter={typeFilter}
      variant="entries"
    />
  )
}
