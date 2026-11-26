import {
  Documents5,
  type Documents5GroupBy,
  type Documents5Mode,
  type Documents5Props,
  type Documents5Record,
  type Documents5Sort,
  type Documents5Type,
} from '@tc96/ui/blocks/data/documents/documents-5'
import { useEffect, useMemo, useState } from 'react'
import {
  documents5Labels,
  people,
  records,
  savedViews,
  typeColors,
} from '../fixtures/documents-5.ts'
import type { Documents5Controls } from './documents-5-controls.ts'

type Callbacks = Pick<
  Documents5Props,
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

export interface ComposedDocuments5Props extends Documents5Controls, Callbacks {
  error?: boolean
  pending?: boolean
}

const noop = () => undefined

const compareBy: Record<
  Documents5Sort,
  (a: Documents5Record, b: Documents5Record) => number
> = {
  name: (a, b) => a.name.localeCompare(b.name, 'pt-BR'),
  owner: (a, b) => (a.ownerId ?? '~').localeCompare(b.ownerId ?? '~'),
  type: (a, b) => a.type.localeCompare(b.type),
  updated: (a, b) => b.updatedAt.localeCompare(a.updatedAt),
}

export const ComposedDocuments5 = ({
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
}: Readonly<ComposedDocuments5Props>) => {
  const [items, setItems] = useState<Documents5Record[]>(records)
  const [mode, setMode] = useState<Documents5Mode>(modeControl)
  const [groupBy, setGroupBy] = useState<Documents5GroupBy | null>(
    groupByControl === 'none' ? null : groupByControl,
  )
  const [sort, setSort] = useState<Documents5Sort>('updated')
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [typeFilter, setTypeFilter] = useState<Documents5Type | null>(null)
  const [ownerFilter, setOwnerFilter] = useState<string | null>(null)
  const [savedViewId, setSavedViewId] = useState<string | null>(null)
  const labels = useMemo(
    () => ({ ...documents5Labels, create, title }),
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
    <Documents5
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
      pinnedRecords={pinned ? source.filter((item) => item.pinned) : undefined}
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
