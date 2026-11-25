import {
  Legal7,
  type Legal7LawsuitFilter,
  type Legal7Mode,
  type Legal7Props,
  type Legal7Sort,
} from '@tc96/ui/blocks/data/legal/legal-7'
import { useEffect, useMemo, useState } from 'react'
import {
  pageSize,
  publications,
  queryPublications,
  savedViews,
} from '../fixtures/legal-7.ts'
import {
  type LegalSavedViewCallbacks,
  useLocalSavedViews,
} from '../legal-saved-views.ts'
import type { Legal7Controls } from './legal-7-controls.ts'

type Callbacks = Pick<
  Legal7Props,
  | 'onCreateDeadline'
  | 'onCreateLawsuit'
  | 'onCreateTask'
  | 'onDiscard'
  | 'onLawsuitFilterChange'
  | 'onLinkDeadline'
  | 'onLinkLawsuit'
  | 'onModeChange'
  | 'onNoDeadline'
  | 'onOpen'
  | 'onPageChange'
  | 'onSelectedIdsChange'
  | 'onSortChange'
  | 'onTribunalFilterChange'
>

export interface ComposedLegal7Props
  extends Legal7Controls,
    Callbacks,
    LegalSavedViewCallbacks {
  initialTribunalFilter?: string | null
}

const noop = () => undefined

export const ComposedLegal7 = ({
  catalogsLoading,
  decisions,
  empty,
  initialTribunalFilter = null,
  mode: modeControl,
  onCreateDeadline,
  onCreateLawsuit,
  onCreateTask,
  onDiscard,
  onLawsuitFilterChange,
  onLinkDeadline,
  onLinkLawsuit,
  onModeChange,
  onNoDeadline,
  onOpen,
  onPageChange,
  onSavedViewCreate,
  onSavedViewDelete,
  onSavedViewDuplicate,
  onSavedViewRename,
  onSavedViewSelect,
  onSavedViewUpdate,
  onSavePreference,
  onSelectedIdsChange,
  onSortChange,
  onTribunalFilterChange,
  openable,
  savedViews: withSavedViews,
  title,
}: Readonly<ComposedLegal7Props>) => {
  const [mode, setMode] = useState<Legal7Mode>(modeControl)
  const [sort, setSort] = useState<Legal7Sort>('oldest')
  const [lawsuit, setLawsuit] = useState<Legal7LawsuitFilter | null>(null)
  const [tribunal, setTribunal] = useState<string | null>(initialTribunalFilter)
  const [page, setPage] = useState(1)
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const labels = useMemo(() => ({ title }), [title])
  const queue = useMemo(
    () =>
      queryPublications(empty ? [] : publications, {
        lawsuit,
        page,
        sort,
        tribunal,
      }),
    [empty, lawsuit, page, sort, tribunal],
  )

  useEffect(() => {
    setMode(modeControl)
  }, [modeControl])

  const restart = () => {
    setPage(1)
    setSelectedIds([])
  }
  const views = useLocalSavedViews(
    savedViews,
    {
      apply: (config) => {
        setLawsuit(config.lawsuit)
        setSort(config.sort)
        setTribunal(config.tribunal)
        restart()
      },
      config: { lawsuit, sort, tribunal },
      reset: () => {
        setLawsuit(null)
        setSort('oldest')
        setTribunal(null)
        restart()
      },
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

  return (
    <Legal7
      {...(withSavedViews ? views.props : {})}
      labels={labels}
      lawsuitFilter={lawsuit}
      mode={mode}
      onCreateDeadline={decisions ? (onCreateDeadline ?? noop) : undefined}
      onCreateLawsuit={decisions ? (onCreateLawsuit ?? noop) : undefined}
      onCreateTask={decisions ? (onCreateTask ?? noop) : undefined}
      onDiscard={decisions ? (onDiscard ?? noop) : undefined}
      onLawsuitFilterChange={(next) => {
        setLawsuit(next)
        restart()
        onLawsuitFilterChange?.(next)
      }}
      onLinkDeadline={decisions ? (onLinkDeadline ?? noop) : undefined}
      onLinkLawsuit={decisions ? (onLinkLawsuit ?? noop) : undefined}
      onModeChange={(next) => {
        setMode(next)
        onModeChange?.(next)
      }}
      onNoDeadline={decisions ? (onNoDeadline ?? noop) : undefined}
      onOpen={openable ? (onOpen ?? noop) : undefined}
      onPageChange={(next) => {
        setPage(next)
        setSelectedIds([])
        onPageChange?.(next)
      }}
      onSelectedIdsChange={(next) => {
        setSelectedIds(next)
        onSelectedIdsChange?.(next)
      }}
      onSortChange={(next) => {
        setSort(next)
        restart()
        onSortChange?.(next)
      }}
      onTribunalFilterChange={(next) => {
        setTribunal(next)
        restart()
        onTribunalFilterChange?.(next)
      }}
      page={page}
      pageCount={Math.max(1, Math.ceil(queue.total / pageSize))}
      pageSize={pageSize}
      publications={queue.items}
      selectedIds={selectedIds}
      sort={sort}
      total={queue.total}
      tribunalFilter={tribunal}
      tribunals={queue.tribunals}
      tribunalsLoading={catalogsLoading}
    />
  )
}
