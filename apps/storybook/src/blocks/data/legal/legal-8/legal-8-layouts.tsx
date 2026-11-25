import {
  Legal8,
  type Legal8FailureOrigin,
  type Legal8Props,
  type Legal8Sort,
  type Legal8View,
} from '@tc96/ui/blocks/data/legal/legal-8'
import { useEffect, useMemo, useState } from 'react'
import {
  failures,
  nextSweepAt,
  runs,
  savedViews,
  stoppedSince,
} from '../fixtures/legal-8.ts'
import {
  type LegalSavedViewCallbacks,
  useLocalSavedViews,
} from '../legal-saved-views.ts'
import type { Legal8Controls } from './legal-8-controls.ts'

export interface ComposedLegal8Props
  extends Legal8Controls,
    LegalSavedViewCallbacks {
  onOpenFailure?: Legal8Props['onOpenFailure']
  onOriginFilterChange?: Legal8Props['onOriginFilterChange']
  onRun?: Legal8Props['onRun']
  onSortChange?: Legal8Props['onSortChange']
  onViewChange?: Legal8Props['onViewChange']
}

const noop = () => undefined

const counts = { failures: failures.length, runs: runs.length }

export const ComposedLegal8 = ({
  counted,
  empty,
  onOpenFailure,
  onOriginFilterChange,
  onRun,
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
  runError,
  runnable,
  running,
  savedViews: withSavedViews,
  scheduled,
  stopped,
  title,
  view: viewControl,
}: Readonly<ComposedLegal8Props>) => {
  const [view, setView] = useState<Legal8View>(viewControl)
  const [sort, setSort] = useState<Legal8Sort>('newest')
  const [originFilter, setOriginFilter] = useState<Legal8FailureOrigin | null>(
    null,
  )
  const labels = useMemo(() => ({ title }), [title])
  const views = useLocalSavedViews(
    savedViews,
    {
      apply: (config) => {
        setView(config.view)
        setSort(config.sort)
        setOriginFilter(config.originFilter)
      },
      config: { originFilter, sort, view },
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
  }, [viewControl])

  return (
    <Legal8
      {...(withSavedViews ? views.props : {})}
      counts={counted ? counts : undefined}
      failures={empty ? [] : failures}
      labels={labels}
      nextSweepAt={scheduled ? nextSweepAt : null}
      onOpenFailure={openable ? (onOpenFailure ?? noop) : undefined}
      onOriginFilterChange={(next) => {
        setOriginFilter(next)
        onOriginFilterChange?.(next)
      }}
      onRun={runnable ? (onRun ?? noop) : undefined}
      onSortChange={(next) => {
        setSort(next)
        onSortChange?.(next)
      }}
      onViewChange={(next) => {
        setView(next)
        views.clear()
        onViewChange?.(next)
      }}
      originFilter={originFilter}
      runError={runError}
      running={running}
      runs={empty ? [] : runs}
      sort={sort}
      stoppedSince={stopped ? stoppedSince : null}
      view={view}
    />
  )
}
