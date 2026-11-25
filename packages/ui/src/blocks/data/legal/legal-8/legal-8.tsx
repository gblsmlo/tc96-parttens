'use client'

import { useCallback, useMemo } from 'react'
import { DataCollectionFrame } from '../../shared/collection/data-collection-frame'
import { dataCollectionLoadState } from '../../shared/collection/data-collection-load-state'
import { DataCollectionSettingsToolbar } from '../../shared/collection/data-collection-settings-toolbar'
import { DataCollectionViewSwitcher } from '../../shared/collection/data-collection-view-switcher'
import {
  defaultDataCollectionLocale,
  defaultDataCollectionTimeZone,
} from '../../shared/collection/labels'
import {
  useControllable,
  useStableHandler,
} from '../../shared/collection/use-controllable'
import { resolveLegal8Labels } from './labels'
import type { Legal8ColumnContext } from './legal-8-columns'
import { Legal8FailureSettings } from './legal-8-failure-settings'
import { legal8Views } from './legal-8-options'
import { Legal8Skeleton } from './legal-8-skeleton'
import { Legal8StatusNotice } from './legal-8-status-notice'
import { Legal8FailuresTable, Legal8RunsTable } from './legal-8-tables'
import type {
  Legal8FailureOrigin,
  Legal8Props,
  Legal8Sort,
  Legal8View,
} from './types'

export { legal8Views } from './legal-8-options'

export function Legal8({
  className,
  counts,
  error,
  failures,
  labels: labelsProp,
  locale = defaultDataCollectionLocale,
  nextSweepAt,
  onOpenFailure,
  onOriginFilterChange,
  onRetry,
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
  originFilter: originFilterProp,
  pending,
  runError,
  running,
  runs,
  savedViewId,
  savedViewModified,
  savedViews,
  savedViewsLoading,
  savedViewsPending,
  sort: sortProp,
  stoppedSince,
  timeZone = defaultDataCollectionTimeZone,
  view: viewProp,
}: Readonly<Legal8Props>) {
  const labels = useMemo(() => resolveLegal8Labels(labelsProp), [labelsProp])
  const changeView = useStableHandler(onViewChange)
  const [view, setView] = useControllable<Legal8View>(
    viewProp,
    'runs',
    changeView,
  )
  const [sort, setSort] = useControllable<Legal8Sort>(
    sortProp,
    'newest',
    onSortChange,
  )
  const [originFilter, setOriginFilter] =
    useControllable<Legal8FailureOrigin | null>(
      originFilterProp,
      null,
      onOriginFilterChange,
    )
  const reportFailure = useStableHandler(onOpenFailure)
  const onFailuresView = view === 'failures'

  const openFailure = useCallback(
    (failureId: string) => {
      reportFailure?.(failureId)
      if (!onFailuresView) setView('failures')
    },
    [onFailuresView, reportFailure, setView],
  )

  const context = useMemo<Legal8ColumnContext>(
    () => ({
      labels,
      locale,
      onOpenFailure: reportFailure ? openFailure : undefined,
      timeZone,
    }),
    [labels, locale, openFailure, reportFailure, timeZone],
  )

  const loadState = dataCollectionLoadState({
    error,
    labels,
    onRetry,
    pending,
    skeleton: <Legal8Skeleton label={labels.loading} view={view} />,
  })

  return (
    <DataCollectionFrame
      className={className}
      data-block="legal-8"
      data-view={view}
      notice={
        <Legal8StatusNotice
          labels={labels}
          locale={locale}
          nextSweepAt={nextSweepAt}
          onRun={onRun}
          pending={pending}
          runError={runError}
          running={running}
          stoppedSince={stoppedSince}
          timeZone={timeZone}
        />
      }
      title={labels.title}
      toolbar={
        <DataCollectionSettingsToolbar
          activeFilterCount={onFailuresView && originFilter ? 1 : 0}
          labels={labels}
          left={
            <DataCollectionViewSwitcher<Legal8View>
              counts={counts}
              label={labels.viewList}
              modified={savedViewModified}
              onSavedViewCreate={onSavedViewCreate}
              onSavedViewDelete={onSavedViewDelete}
              onSavedViewDuplicate={onSavedViewDuplicate}
              onSavedViewRename={onSavedViewRename}
              onSavedViewSelect={onSavedViewSelect}
              onSavedViewUpdate={onSavedViewUpdate}
              onViewChange={setView}
              savedViewId={savedViewId}
              savedViewLabels={labels.savedViews}
              savedViews={savedViews}
              savedViewsLoading={savedViewsLoading}
              savedViewsPending={savedViewsPending}
              view={view}
              viewCountName={labels.viewCountName}
              viewLabels={labels.views}
              views={legal8Views}
            />
          }
          loading={Boolean(loadState)}
          onClearFilters={() => setOriginFilter(null)}
          onSavePreference={onSavePreference}
          savePreferenceLabel={labels.savePreference}
        >
          {onFailuresView ? (
            <Legal8FailureSettings
              labels={labels}
              onOriginFilterChange={setOriginFilter}
              onSortChange={setSort}
              originFilter={originFilter}
              sort={sort}
            />
          ) : null}
        </DataCollectionSettingsToolbar>
      }
    >
      {loadState ??
        (onFailuresView ? (
          <Legal8FailuresTable context={context} failures={failures} />
        ) : (
          <Legal8RunsTable context={context} runs={runs} />
        ))}
    </DataCollectionFrame>
  )
}
