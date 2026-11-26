import {
  Finance4,
  type Finance4Entry,
  type Finance4EntryKind,
  type Finance4GroupBy,
  type Finance4Mode,
  type Finance4Props,
  type Finance4Situation,
  type Finance4Sort,
  type Finance4SortDirection,
  type Finance4View,
  finance4KindDirection,
} from '@tc96/ui/blocks/data/finance/finance-4'
import { useEffect, useMemo, useState } from 'react'
import {
  cases,
  clients,
  entries,
  lawyers,
  ptBRLabels,
  savedViews,
} from '../fixtures/finance-4.ts'
import type { Finance4Controls } from './finance-4-controls.ts'

type Callbacks = Pick<
  Finance4Props,
  | 'onBulkDelete'
  | 'onBulkResponsibleChange'
  | 'onBulkSettle'
  | 'onCollapsedGroupIdsChange'
  | 'onCreate'
  | 'onGroupByChange'
  | 'onKindFilterChange'
  | 'onLawyerFilterChange'
  | 'onModeChange'
  | 'onOpen'
  | 'onSavedViewSelect'
  | 'onSelectedIdsChange'
  | 'onSituationFilterChange'
  | 'onSortChange'
  | 'onViewChange'
>

export interface ComposedFinance4Props extends Finance4Controls, Callbacks {
  error?: boolean
  pending?: boolean
}

const noop = () => undefined

const clientLabel = (entry: Finance4Entry) =>
  clients.find((client) => client.id === entry.clientId)?.label ?? ''

const compareBy: Record<
  Finance4Sort,
  (a: Finance4Entry, b: Finance4Entry) => number
> = {
  amount: (a, b) => a.amount - b.amount,
  client: (a, b) => clientLabel(a).localeCompare(clientLabel(b)),
  due: (a, b) => a.dueOn.localeCompare(b.dueOn),
  updated: (a, b) => a.updatedAt.localeCompare(b.updatedAt),
}

const matchesView = (entry: Finance4Entry, view: Finance4View) =>
  view === 'all' ||
  (view === 'receivable'
    ? finance4KindDirection[entry.kind] === 'in'
    : finance4KindDirection[entry.kind] === 'out')

export const ComposedFinance4 = ({
  create,
  empty,
  error = false,
  filters,
  groupBy: groupByControl,
  headerActions,
  mode: modeControl,
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
  onSavedViewSelect,
  onSelectedIdsChange,
  onSituationFilterChange,
  onSortChange,
  onViewChange,
  openable,
  pending = false,
  selectable,
  title,
}: Readonly<ComposedFinance4Props>) => {
  const [items, setItems] = useState<Finance4Entry[]>(entries)
  const [view, setView] = useState<Finance4View>('all')
  const [mode, setMode] = useState<Finance4Mode>(modeControl)
  const [groupBy, setGroupBy] = useState<Finance4GroupBy | null>(
    groupByControl === 'none' ? null : groupByControl,
  )
  const [sort, setSort] = useState<Finance4Sort>('due')
  const [sortDirection, setSortDirection] =
    useState<Finance4SortDirection>('asc')
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [situationFilter, setSituationFilter] =
    useState<Finance4Situation | null>(null)
  const [kindFilter, setKindFilter] = useState<Finance4EntryKind | null>(null)
  const [lawyerFilter, setLawyerFilter] = useState<string | null>(null)
  const [savedViewId, setSavedViewId] = useState<string | null>(null)
  const labels = useMemo(
    () => ({ ...ptBRLabels, create, title }),
    [create, title],
  )

  useEffect(() => {
    setMode(modeControl)
  }, [modeControl])

  useEffect(() => {
    setGroupBy(groupByControl === 'none' ? null : groupByControl)
  }, [groupByControl])

  const updateMany = (ids: readonly string[], change: Partial<Finance4Entry>) =>
    setItems((current) =>
      current.map((entry) =>
        ids.includes(entry.id) ? { ...entry, ...change } : entry,
      ),
    )
  const bulk = <TArgs extends unknown[]>(
    apply: (...args: TArgs) => void,
    report: ((...args: TArgs) => void) | undefined,
  ) =>
    selectable
      ? (...args: TArgs) => {
          apply(...args)
          setSelectedIds([])
          report?.(...args)
        }
      : undefined
  const filter = <TValue,>(
    apply: (value: TValue) => void,
    report: ((value: TValue) => void) | undefined,
  ) =>
    filters
      ? (value: TValue) => {
          apply(value)
          report?.(value)
        }
      : undefined

  const inView = items.filter((entry) => matchesView(entry, view))
  const visible = empty
    ? []
    : inView
        .filter(
          (entry) =>
            (!situationFilter || entry.situation === situationFilter) &&
            (!kindFilter || entry.kind === kindFilter) &&
            (!lawyerFilter || entry.responsibleId === lawyerFilter),
        )
        .sort(
          (a, b) => compareBy[sort](a, b) * (sortDirection === 'asc' ? 1 : -1),
        )
  const counts = empty
    ? undefined
    : {
        all: items.length,
        payable: items.filter((entry) => matchesView(entry, 'payable')).length,
        receivable: items.filter((entry) => matchesView(entry, 'receivable'))
          .length,
      }

  return (
    <Finance4
      cases={cases}
      clients={clients}
      counts={counts}
      entries={visible}
      error={error}
      filtered={Boolean(situationFilter || kindFilter || lawyerFilter)}
      groupBy={groupBy}
      kindFilter={kindFilter}
      labels={labels}
      lawyerFilter={lawyerFilter}
      lawyers={lawyers}
      mode={mode}
      onBulkDelete={bulk(
        (ids: string[]) =>
          setItems((current) =>
            current.filter((entry) => !ids.includes(entry.id)),
          ),
        onBulkDelete,
      )}
      onBulkResponsibleChange={bulk(
        (ids: string[], responsibleId: string) =>
          updateMany(ids, { responsibleId }),
        onBulkResponsibleChange,
      )}
      onBulkSettle={bulk(
        (ids: string[]) =>
          updateMany(ids, { canSettle: false, situation: 'settled' }),
        onBulkSettle,
      )}
      onCollapsedGroupIdsChange={onCollapsedGroupIdsChange}
      onCreate={headerActions ? (onCreate ?? noop) : undefined}
      onGroupByChange={(next) => {
        setGroupBy(next)
        onGroupByChange?.(next)
      }}
      onKindFilterChange={filter(setKindFilter, onKindFilterChange)}
      onLawyerFilterChange={filter(setLawyerFilter, onLawyerFilterChange)}
      onModeChange={(next) => {
        setMode(next)
        onModeChange?.(next)
      }}
      onOpen={openable ? (onOpen ?? noop) : undefined}
      onRetry={noop}
      onSavedViewSelect={(next) => {
        setSavedViewId(next)
        onSavedViewSelect?.(next)
      }}
      onSelectedIdsChange={(next) => {
        setSelectedIds(next)
        onSelectedIdsChange?.(next)
      }}
      onSituationFilterChange={filter(
        setSituationFilter,
        onSituationFilterChange,
      )}
      onSortChange={(next, direction) => {
        setSort(next)
        setSortDirection(direction)
        onSortChange?.(next, direction)
      }}
      onViewChange={(next) => {
        setView(next)
        setSelectedIds([])
        onViewChange?.(next)
      }}
      pending={pending}
      savedViewId={savedViewId}
      savedViews={savedViews}
      selectedIds={selectedIds}
      situationFilter={situationFilter}
      sort={sort}
      sortDirection={sortDirection}
      view={view}
    />
  )
}
