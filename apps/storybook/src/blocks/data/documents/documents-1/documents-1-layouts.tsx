import {
  Documents1,
  type Documents1GroupBy,
  type Documents1Mode,
  type Documents1Props,
  type Documents1Record,
  type Documents1Sort,
  type Documents1Type,
  type Documents1View,
} from '@tc96/ui/blocks/data/documents/documents-1'
import { useEffect, useMemo, useState } from 'react'
import {
  countDocuments,
  pageSize,
  people,
  queryDocuments,
  records,
  savedViews,
  typeColors,
  uploads,
} from '../fixtures/documents-1.ts'
import type { Documents1Controls } from './documents-1-controls.ts'

type Callbacks = Pick<
  Documents1Props,
  | 'onCollapsedGroupIdsChange'
  | 'onCreateLink'
  | 'onCreateNote'
  | 'onCreatePage'
  | 'onDelete'
  | 'onDownload'
  | 'onGroupByChange'
  | 'onModeChange'
  | 'onOpen'
  | 'onPageChange'
  | 'onPinnedChange'
  | 'onRename'
  | 'onSavedViewCreate'
  | 'onSavedViewSelect'
  | 'onSavePreference'
  | 'onSearchChange'
  | 'onShare'
  | 'onSortChange'
  | 'onTypeFilterChange'
  | 'onUpload'
  | 'onViewChange'
>

export interface ComposedDocuments1Props
  extends Documents1Controls,
    Callbacks {}

const noop = () => undefined

const sizeFormat = new Intl.NumberFormat('pt-BR', {
  maximumFractionDigits: 1,
  style: 'unit',
  unit: 'kilobyte',
  unitDisplay: 'short',
})

export const uploadingRecord = (file: File): Documents1Record => ({
  access: 'private',
  contentType: file.type || 'application/octet-stream',
  createdAt: '2026-11-25T10:00:00.000Z',
  createdById: 'beatriz',
  id: `upload-${file.name}`,
  kind: 'file',
  linkedTo: null,
  name: file.name,
  pinned: false,
  size: sizeFormat.format(file.size / 1000),
  upload: { progress: 0, status: 'uploading' },
})

export const ComposedDocuments1 = ({
  create,
  empty,
  groupBy: groupByControl,
  mode: modeControl,
  onCollapsedGroupIdsChange,
  onCreateLink,
  onCreateNote,
  onCreatePage,
  onDelete,
  onDownload,
  onGroupByChange,
  onModeChange,
  onOpen,
  onPageChange,
  onPinnedChange,
  onRename,
  onSavedViewCreate,
  onSavedViewSelect,
  onSavePreference,
  onSearchChange,
  onShare,
  onSortChange,
  onTypeFilterChange,
  onUpload,
  onViewChange,
  openable,
  paginated,
  rowActions,
  savedViews: withSavedViews,
  searchable,
  title,
  typeColors: withTypeColors,
  uploads: withUploads,
  viewCounts,
}: Readonly<ComposedDocuments1Props>) => {
  const [items, setItems] = useState<Documents1Record[]>(() =>
    withUploads ? [...uploads, ...records] : records,
  )
  const [mode, setMode] = useState<Documents1Mode>(modeControl)
  const [view, setView] = useState<Documents1View>('all')
  const [search, setSearch] = useState('')
  const [sort, setSort] = useState<Documents1Sort | null>(null)
  const [typeFilter, setTypeFilter] = useState<Documents1Type[]>([])
  const [page, setPage] = useState(1)
  const [savedViewId, setSavedViewId] = useState<string | null>(null)
  const [groupBy, setGroupBy] = useState<Documents1GroupBy | null>(
    groupByControl === 'none' ? null : groupByControl,
  )
  const [collapsedGroupIds, setCollapsedGroupIds] = useState<string[]>([])
  const labels = useMemo(() => ({ title }), [title])

  useEffect(() => {
    setMode(modeControl)
  }, [modeControl])

  useEffect(() => {
    setGroupBy(groupByControl === 'none' ? null : groupByControl)
  }, [groupByControl])

  useEffect(() => {
    setItems(withUploads ? [...uploads, ...records] : records)
  }, [withUploads])

  const update = (id: string, change: Partial<Documents1Record>) =>
    setItems((current) =>
      current.map((item) =>
        item.id === id ? ({ ...item, ...change } as Documents1Record) : item,
      ),
    )
  const firstPage = () => setPage(1)

  const matching = empty
    ? []
    : queryDocuments(items, { search, sort, typeFilter, view })
  const visible = paginated
    ? matching.slice((page - 1) * pageSize, page * pageSize)
    : matching

  return (
    <Documents1
      collapsedGroupIds={collapsedGroupIds}
      counts={viewCounts ? countDocuments(empty ? [] : items) : undefined}
      filtered={Boolean(search || typeFilter.length)}
      groupBy={groupBy}
      labels={labels}
      mode={mode}
      onCollapsedGroupIdsChange={(next) => {
        setCollapsedGroupIds(next)
        onCollapsedGroupIdsChange?.(next)
      }}
      onCreateLink={create ? (onCreateLink ?? noop) : undefined}
      onCreateNote={create ? (onCreateNote ?? noop) : undefined}
      onCreatePage={create ? (onCreatePage ?? noop) : undefined}
      onDelete={
        rowActions
          ? (id) => {
              setItems((current) => current.filter((item) => item.id !== id))
              onDelete?.(id)
            }
          : undefined
      }
      onDownload={rowActions ? (onDownload ?? noop) : undefined}
      onGroupByChange={(next) => {
        setGroupBy(next)
        setCollapsedGroupIds([])
        onGroupByChange?.(next)
      }}
      onModeChange={(next) => {
        setMode(next)
        onModeChange?.(next)
      }}
      onOpen={openable ? (onOpen ?? noop) : undefined}
      onPageChange={(next) => {
        setPage(next)
        onPageChange?.(next)
      }}
      onPinnedChange={
        rowActions
          ? (id, pinned) => {
              update(id, { pinned })
              onPinnedChange?.(id, pinned)
            }
          : undefined
      }
      onRename={rowActions ? (onRename ?? noop) : undefined}
      onSavedViewCreate={
        withSavedViews ? (onSavedViewCreate ?? noop) : undefined
      }
      onSavedViewSelect={
        withSavedViews
          ? (id) => {
              setSavedViewId(id)
              onSavedViewSelect?.(id)
            }
          : undefined
      }
      onSavePreference={withSavedViews ? (onSavePreference ?? noop) : undefined}
      onSearchChange={
        searchable
          ? (next) => {
              setSearch(next)
              firstPage()
              onSearchChange?.(next)
            }
          : undefined
      }
      onShare={rowActions ? (onShare ?? noop) : undefined}
      onSortChange={
        searchable
          ? (next) => {
              setSort(next)
              onSortChange?.(next)
            }
          : undefined
      }
      onTypeFilterChange={
        searchable
          ? (next) => {
              setTypeFilter(next)
              firstPage()
              onTypeFilterChange?.(next)
            }
          : undefined
      }
      onUpload={
        create
          ? (files) => {
              setItems((current) => [...files.map(uploadingRecord), ...current])
              onUpload?.(files)
            }
          : undefined
      }
      onViewChange={(next) => {
        setView(next)
        setSavedViewId(null)
        firstPage()
        onViewChange?.(next)
      }}
      page={paginated ? page : undefined}
      pageCount={
        paginated
          ? Math.max(1, Math.ceil(matching.length / pageSize))
          : undefined
      }
      pageSize={paginated ? pageSize : undefined}
      people={people}
      records={visible}
      savedViewId={withSavedViews ? savedViewId : undefined}
      savedViews={withSavedViews ? savedViews : undefined}
      search={search}
      sort={sort}
      total={paginated ? matching.length : undefined}
      typeColors={withTypeColors ? typeColors : undefined}
      typeFilter={typeFilter}
      view={view}
    />
  )
}
