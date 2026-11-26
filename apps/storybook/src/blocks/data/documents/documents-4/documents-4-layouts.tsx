import {
  Documents4,
  type Documents4GroupBy,
  type Documents4Mode,
  type Documents4Props,
  type Documents4Record,
  type Documents4Sort,
  type Documents4Type,
} from '@tc96/ui/blocks/data/documents/documents-4'
import { useEffect, useMemo, useState } from 'react'
import {
  documents4Labels,
  people,
  records,
  savedViews,
  typeColors,
} from '../fixtures/documents-4.ts'
import type { Documents4Controls } from './documents-4-controls.ts'

type Callbacks = Pick<
  Documents4Props,
  | 'onBulkDelete'
  | 'onBulkDownload'
  | 'onBulkPinnedChange'
  | 'onCreateLink'
  | 'onCreateNote'
  | 'onDelete'
  | 'onDownload'
  | 'onGroupByChange'
  | 'onModeChange'
  | 'onOpen'
  | 'onOwnerFilterChange'
  | 'onPinnedChange'
  | 'onSavedViewSelect'
  | 'onSelectedIdsChange'
  | 'onSortChange'
  | 'onTypeFilterChange'
  | 'onUpload'
>

export interface ComposedDocuments4Props extends Documents4Controls, Callbacks {
  error?: boolean
  pending?: boolean
}

const noop = () => undefined

const compareBy: Record<
  Documents4Sort,
  (a: Documents4Record, b: Documents4Record) => number
> = {
  name: (a, b) => a.name.localeCompare(b.name, 'pt-BR'),
  owner: (a, b) => (a.ownerId ?? '~').localeCompare(b.ownerId ?? '~'),
  type: (a, b) => a.type.localeCompare(b.type),
  updated: (a, b) => b.updatedAt.localeCompare(a.updatedAt),
}

export const ComposedDocuments4 = ({
  create,
  createActions,
  empty,
  error = false,
  filters,
  groupBy: groupByControl,
  mode: modeControl,
  onBulkDelete,
  onBulkDownload,
  onBulkPinnedChange,
  onCreateLink,
  onCreateNote,
  onDelete,
  onDownload,
  onGroupByChange,
  onModeChange,
  onOpen,
  onOwnerFilterChange,
  onPinnedChange,
  onSavedViewSelect,
  onSelectedIdsChange,
  onSortChange,
  onTypeFilterChange,
  onUpload,
  openable,
  pending = false,
  pinned,
  rowActions,
  selectable,
  title,
}: Readonly<ComposedDocuments4Props>) => {
  const [items, setItems] = useState<Documents4Record[]>(records)
  const [mode, setMode] = useState<Documents4Mode>(modeControl)
  const [groupBy, setGroupBy] = useState<Documents4GroupBy | null>(
    groupByControl === 'none' ? null : groupByControl,
  )
  const [sort, setSort] = useState<Documents4Sort>('updated')
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [typeFilter, setTypeFilter] = useState<Documents4Type | null>(null)
  const [ownerFilter, setOwnerFilter] = useState<string | null>(null)
  const [savedViewId, setSavedViewId] = useState<string | null>(null)
  const labels = useMemo(
    () => ({ ...documents4Labels, create, title }),
    [create, title],
  )

  useEffect(() => {
    setMode(modeControl)
  }, [modeControl])

  useEffect(() => {
    setGroupBy(groupByControl === 'none' ? null : groupByControl)
  }, [groupByControl])

  const setPinned = (ids: readonly string[], next: boolean) =>
    setItems((current) =>
      current.map((item) =>
        ids.includes(item.id) ? { ...item, pinned: next } : item,
      ),
    )
  const removeMany = (ids: readonly string[]) => {
    setItems((current) => current.filter((item) => !ids.includes(item.id)))
    setSelectedIds((current) => current.filter((id) => !ids.includes(id)))
  }
  const when = <TArgs extends unknown[]>(
    on: boolean,
    apply: (...args: TArgs) => void,
    report: ((...args: TArgs) => void) | undefined,
  ) =>
    on
      ? (...args: TArgs) => {
          apply(...args)
          report?.(...args)
        }
      : undefined

  const source = empty ? [] : items
  const visible = source
    .filter(
      (item) =>
        (!typeFilter || item.type === typeFilter) &&
        (!ownerFilter || item.ownerId === ownerFilter),
    )
    .sort(compareBy[sort])

  return (
    <Documents4
      error={error}
      filtered={Boolean(typeFilter || ownerFilter)}
      groupBy={groupBy}
      labels={labels}
      mode={mode}
      onBulkDelete={when(selectable, removeMany, onBulkDelete)}
      onBulkDownload={when<[string[]]>(selectable, noop, onBulkDownload)}
      onBulkPinnedChange={when(selectable, setPinned, onBulkPinnedChange)}
      onCreateLink={when(createActions, noop, onCreateLink)}
      onCreateNote={when(createActions, noop, onCreateNote)}
      onDelete={when(rowActions, (id: string) => removeMany([id]), onDelete)}
      onDownload={when<[string]>(rowActions, noop, onDownload)}
      onGroupByChange={(next) => {
        setGroupBy(next)
        onGroupByChange?.(next)
      }}
      onModeChange={(next) => {
        setMode(next)
        onModeChange?.(next)
      }}
      onOpen={openable ? (onOpen ?? noop) : undefined}
      onOwnerFilterChange={when(filters, setOwnerFilter, onOwnerFilterChange)}
      onPinnedChange={when(
        rowActions,
        (id: string, next: boolean) => setPinned([id], next),
        onPinnedChange,
      )}
      onRetry={noop}
      onSavedViewSelect={(next) => {
        setSavedViewId(next)
        onSavedViewSelect?.(next)
      }}
      onSelectedIdsChange={(next) => {
        setSelectedIds(next)
        onSelectedIdsChange?.(next)
      }}
      onSortChange={(next) => {
        setSort(next)
        onSortChange?.(next)
      }}
      onTypeFilterChange={when(filters, setTypeFilter, onTypeFilterChange)}
      onUpload={when<[File[]]>(createActions, noop, onUpload)}
      ownerFilter={ownerFilter}
      pending={pending}
      people={people}
      records={visible}
      savedViewId={savedViewId}
      savedViews={savedViews}
      selectedIds={selectedIds}
      sort={sort}
      typeColors={typeColors}
      typeFilter={typeFilter}
    />
  )
}
