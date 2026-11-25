import {
  Legal6,
  type Legal6Props,
  type Legal6Sort,
  type Legal6View,
} from '@tc96/ui/blocks/data/legal/legal-6'
import { useEffect, useMemo, useState } from 'react'
import {
  countDeadlineQueues,
  deadlines,
  kinds,
  type Legal6QueueDeadline,
  memberViews,
  owners,
  readDeadlineQueue,
  savedViews,
} from '../fixtures/legal-6.ts'
import {
  type LegalSavedViewCallbacks,
  useLocalSavedViews,
} from '../legal-saved-views.ts'
import type { Legal6Controls } from './legal-6-controls.ts'

export interface ComposedLegal6Props
  extends Legal6Controls,
    LegalSavedViewCallbacks {
  onConfirm?: Legal6Props['onConfirm']
  onCreate?: Legal6Props['onCreate']
  onKindFilterChange?: Legal6Props['onKindFilterChange']
  onLoadMore?: Legal6Props['onLoadMore']
  onOpen?: Legal6Props['onOpen']
  onOwnerFilterChange?: Legal6Props['onOwnerFilterChange']
  onReject?: Legal6Props['onReject']
  onSortChange?: Legal6Props['onSortChange']
  onViewChange?: Legal6Props['onViewChange']
}

const noop = () => undefined
const noDeadlines: Legal6QueueDeadline[] = []

export const ComposedLegal6 = ({
  catalogsLoading,
  counts: countsControl,
  create,
  dateFormat,
  decides,
  empty,
  headerActions,
  loadMoreError,
  manager,
  onConfirm,
  onCreate,
  onKindFilterChange,
  onLoadMore,
  onOpen,
  onOwnerFilterChange,
  onReject,
  onSavedViewCreate,
  onSavedViewDelete,
  onSavedViewDuplicate,
  onSavedViewRename,
  onSavedViewSelect,
  onSavedViewUpdate,
  onSavePreference,
  onSortChange,
  onViewChange,
  openable,
  savedViews: withSavedViews,
  title,
  view: viewControl,
}: Readonly<ComposedLegal6Props>) => {
  const [source, setSource] = useState(deadlines)
  const [view, setView] = useState<Legal6View>(viewControl)
  const [sort, setSort] = useState<Legal6Sort>('fatal')
  const [ownerFilter, setOwnerFilter] = useState<string | null>(null)
  const [kindFilter, setKindFilter] = useState<string | null>(null)
  const [pages, setPages] = useState(1)
  const labels = useMemo(() => ({ create, title }), [create, title])
  const views = useLocalSavedViews(
    savedViews,
    {
      apply: (config) => {
        setView(config.view)
        setSort(config.sort)
        setOwnerFilter(config.ownerFilter)
        setKindFilter(config.kindFilter)
        setPages(1)
      },
      config: { kindFilter, ownerFilter, sort, view },
    },
    {
      onSavedViewCreate,
      onSavedViewDelete,
      onSavedViewDuplicate,
      onSavedViewRename,
      onSavedViewSelect,
      onSavedViewUpdate,
      onSavePreference,
    },
  )

  useEffect(() => {
    setView(viewControl)
    setPages(1)
  }, [viewControl])

  const filters = { kindId: kindFilter, ownerId: ownerFilter }
  const records = useMemo(() => {
    if (empty) return { hasMore: false, items: noDeadlines }
    const query = { kindId: kindFilter, ownerId: ownerFilter, sort, view }
    const items: Legal6QueueDeadline[] = []
    let cursor: number | null = 0
    for (let page = 0; page < pages && cursor !== null; page += 1) {
      const next = readDeadlineQueue(source, { ...query, cursor })
      items.push(...next.items)
      cursor = next.nextCursor
    }
    return { hasMore: cursor !== null, items }
  }, [empty, kindFilter, ownerFilter, pages, sort, source, view])

  const decide = (id: string) =>
    setSource((current) => current.filter((item) => item.id !== id))
  const restart = () => setPages(1)

  return (
    <Legal6
      {...(withSavedViews ? views.props : {})}
      counts={
        countsControl
          ? countDeadlineQueues(
              empty
                ? source.filter((item) => !item.queues.includes(view))
                : source,
              filters,
            )
          : undefined
      }
      dateFormat={dateFormat}
      deadlines={records.items}
      hasMore={records.hasMore || loadMoreError}
      kindFilter={kindFilter}
      kinds={kinds}
      kindsLoading={catalogsLoading}
      labels={labels}
      loadMoreError={loadMoreError}
      onConfirm={
        decides
          ? (id) => {
              decide(id)
              onConfirm?.(id)
            }
          : undefined
      }
      onCreate={headerActions ? (onCreate ?? noop) : undefined}
      onKindFilterChange={(next) => {
        setKindFilter(next)
        restart()
        onKindFilterChange?.(next)
      }}
      onLoadMore={() => {
        setPages((current) => current + 1)
        onLoadMore?.()
      }}
      onOpen={openable ? (onOpen ?? noop) : undefined}
      onOwnerFilterChange={(next) => {
        setOwnerFilter(next)
        restart()
        onOwnerFilterChange?.(next)
      }}
      onReject={
        decides
          ? (id) => {
              decide(id)
              onReject?.(id)
            }
          : undefined
      }
      onSortChange={(next) => {
        setSort(next)
        restart()
        onSortChange?.(next)
      }}
      onViewChange={(next) => {
        setView(next)
        restart()
        views.clear()
        onViewChange?.(next)
      }}
      ownerFilter={ownerFilter}
      owners={owners}
      ownersLoading={catalogsLoading}
      sort={sort}
      view={view}
      views={manager ? undefined : memberViews}
    />
  )
}
