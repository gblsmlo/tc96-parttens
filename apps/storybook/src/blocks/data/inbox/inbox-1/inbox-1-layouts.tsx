import {
  Inbox1,
  type Inbox1Category,
  type Inbox1Kind,
  type Inbox1Props,
  type Inbox1ReadFilter,
  type Inbox1ReceivedFilter,
  type Inbox1Sort,
} from '@tc96/ui/blocks/data/inbox/inbox-1'
import { useEffect, useMemo, useState } from 'react'
import {
  asMember,
  entries,
  type Inbox1FixtureEntry,
  memberCategories,
  originColors,
  readInbox,
  unreadCounts,
  withReadState,
} from '../fixtures/inbox-1.ts'
import type { Inbox1Controls } from './inbox-1-controls.ts'

export interface ComposedInbox1Props extends Inbox1Controls {
  onCategoryChange?: Inbox1Props['onCategoryChange']
  onKindFilterChange?: Inbox1Props['onKindFilterChange']
  onLoadMore?: Inbox1Props['onLoadMore']
  onMarkRead?: Inbox1Props['onMarkRead']
  onOpen?: Inbox1Props['onOpen']
  onReadChange?: Inbox1Props['onReadChange']
  onReadFilterChange?: Inbox1Props['onReadFilterChange']
  onReceivedFilterChange?: Inbox1Props['onReceivedFilterChange']
  onSelectedIdsChange?: Inbox1Props['onSelectedIdsChange']
  onSortChange?: Inbox1Props['onSortChange']
}

const noEntries: Inbox1FixtureEntry[] = []

export const ComposedInbox1 = ({
  category: categoryControl,
  colors,
  counts,
  empty,
  loadMoreError,
  markError,
  member,
  onCategoryChange,
  onKindFilterChange,
  onLoadMore,
  onMarkRead,
  onOpen,
  onReadChange,
  onReadFilterChange,
  onReceivedFilterChange,
  onSelectedIdsChange,
  onSortChange,
  openable,
  readToggle,
  title,
}: Readonly<ComposedInbox1Props>) => {
  const initialCategory = categoryControl === 'all' ? null : categoryControl
  const [category, setCategory] = useState<Inbox1Category | null>(
    initialCategory,
  )
  const [sort, setSort] = useState<Inbox1Sort>('newest')
  const [readFilter, setReadFilter] = useState<Inbox1ReadFilter | null>(null)
  const [kindFilter, setKindFilter] = useState<Inbox1Kind | null>(null)
  const [receivedFilter, setReceivedFilter] =
    useState<Inbox1ReceivedFilter | null>(null)
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [marks, setMarks] = useState<ReadonlyMap<string, boolean>>(new Map())
  const [pages, setPages] = useState(1)
  const labels = useMemo(() => ({ title }), [title])

  useEffect(() => {
    setCategory(initialCategory)
    setPages(1)
  }, [initialCategory])

  const source = useMemo(() => {
    const viewed = withReadState(entries, marks)
    return member ? asMember(viewed) : viewed
  }, [marks, member])

  const records = useMemo(() => {
    if (empty) return { hasMore: false, items: noEntries }
    const query = {
      category,
      kind: kindFilter,
      read: readFilter,
      received: receivedFilter,
      sort,
    }
    const items: Inbox1FixtureEntry[] = []
    let cursor: number | null = 0
    for (let page = 0; page < pages && cursor !== null; page += 1) {
      const next = readInbox(source, { ...query, cursor })
      items.push(...next.items)
      cursor = next.nextCursor
    }
    return { hasMore: cursor !== null, items }
  }, [
    category,
    empty,
    kindFilter,
    pages,
    readFilter,
    receivedFilter,
    sort,
    source,
  ])

  const mark = (ids: readonly string[], read: boolean) =>
    setMarks(
      (current) =>
        new Map([...current, ...ids.map((id) => [id, read] as const)]),
    )
  const restart = () => {
    setPages(1)
    setSelectedIds([])
  }

  return (
    <Inbox1
      categories={member ? memberCategories : undefined}
      category={category}
      counts={counts ? unreadCounts(source) : undefined}
      entries={records.items}
      hasMore={records.hasMore || loadMoreError}
      kindFilter={kindFilter}
      labels={labels}
      loadMoreError={loadMoreError}
      markError={markError}
      onCategoryChange={(next) => {
        setCategory(next)
        restart()
        onCategoryChange?.(next)
      }}
      onKindFilterChange={(next) => {
        setKindFilter(next)
        restart()
        onKindFilterChange?.(next)
      }}
      onLoadMore={() => {
        setPages((current) => current + 1)
        onLoadMore?.()
      }}
      onMarkRead={(ids) => {
        mark(ids, true)
        onMarkRead?.(ids)
      }}
      onOpen={
        openable
          ? (id) => {
              mark([id], true)
              onOpen?.(id)
            }
          : undefined
      }
      onReadChange={
        readToggle
          ? (id, read) => {
              mark([id], read)
              onReadChange?.(id, read)
            }
          : undefined
      }
      onReadFilterChange={(next) => {
        setReadFilter(next)
        restart()
        onReadFilterChange?.(next)
      }}
      onReceivedFilterChange={(next) => {
        setReceivedFilter(next)
        restart()
        onReceivedFilterChange?.(next)
      }}
      onSelectedIdsChange={(ids) => {
        setSelectedIds(ids)
        onSelectedIdsChange?.(ids)
      }}
      onSortChange={(next) => {
        setSort(next)
        restart()
        onSortChange?.(next)
      }}
      originColors={colors ? originColors : undefined}
      readFilter={readFilter}
      receivedFilter={receivedFilter}
      selectedIds={selectedIds}
      sort={sort}
    />
  )
}
