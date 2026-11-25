'use client'

import type { CollectionCalendarViewProps } from '@tc96/ui/patterns/collection/composition/collection-layout-outlet'
import { useDataTable } from '@tc96/ui/patterns/collection/layouts/data-table/use-data-table'
import { useMemo, useState } from 'react'
import {
  DataCollection,
  type DataCollectionDefinition,
} from '../../shared/collection/data-collection'
import { DataCollectionFrame } from '../../shared/collection/data-collection-frame'
import { dataCollectionLoadState } from '../../shared/collection/data-collection-load-state'
import { DataCollectionToolbar } from '../../shared/collection/data-collection-toolbar'
import {
  defaultDataCollectionLocale,
  defaultDataCollectionTimeZone,
} from '../../shared/collection/labels'
import {
  useControllable,
  useStableHandler,
} from '../../shared/collection/use-controllable'
import { resolveLegal3Labels } from './labels'
import { createLegal3Columns } from './legal-3-columns'
import { createLegal3Options, type Legal3FieldContext } from './legal-3-fields'
import { legal3Statuses } from './legal-3-options'
import {
  renderLegal3CalendarChip,
  renderLegal3ListRow,
} from './legal-3-records'
import { Legal3Skeleton } from './legal-3-skeleton'
import type {
  Legal3Deadline,
  Legal3Mode,
  Legal3Props,
  Legal3Status,
} from './types'

export const legal3Modes: readonly Legal3Mode[] = ['table', 'list', 'calendar']

const noOwners: NonNullable<Legal3Props['owners']> = []

export function Legal3({
  anchor,
  className,
  deadlines,
  error,
  labels: labelsProp,
  locale = defaultDataCollectionLocale,
  mode: modeProp,
  now,
  onCreate,
  onExport,
  onModeChange,
  onOpen,
  onOwnerChange,
  onQueueChange,
  onRetry,
  onStatusChange,
  onStatusFilterChange,
  owners = noOwners,
  pending,
  statusFilter: statusFilterProp,
  timeZone = defaultDataCollectionTimeZone,
}: Readonly<Legal3Props>) {
  const labels = useMemo(() => resolveLegal3Labels(labelsProp), [labelsProp])
  const [mode, setMode] = useControllable<Legal3Mode>(
    modeProp,
    'table',
    onModeChange,
  )
  const [statusFilter, setStatusFilter] = useControllable<Legal3Status | null>(
    statusFilterProp,
    null,
    onStatusFilterChange,
  )
  const [mountedAt] = useState(() => new Date())
  const openDeadline = useStableHandler(onOpen)
  const changeOwner = useStableHandler(onOwnerChange)
  const changeQueue = useStableHandler(onQueueChange)
  const changeStatus = useStableHandler(onStatusChange)

  const context = useMemo<Legal3FieldContext>(() => {
    const time = new Intl.DateTimeFormat(locale, {
      hour: '2-digit',
      minute: '2-digit',
      timeZone,
    })
    return {
      ...createLegal3Options(labels),
      formatTime: (value) => time.format(new Date(value)),
      labels,
      locale,
      onOpen: openDeadline,
      onOwnerChange: changeOwner,
      onQueueChange: changeQueue,
      onStatusChange: changeStatus,
      owners,
      timeZone,
    }
  }, [
    changeOwner,
    changeQueue,
    changeStatus,
    labels,
    locale,
    openDeadline,
    owners,
    timeZone,
  ])

  const visibleDeadlines = useMemo(
    () =>
      statusFilter
        ? deadlines.filter((item) => item.status === statusFilter)
        : deadlines,
    [deadlines, statusFilter],
  )

  const collection = useMemo<DataCollectionDefinition<Legal3Deadline>>(
    () => ({
      getKey: (item) => item.id,
      getLabel: (item) => item.title,
      groupings: [],
      records: visibleDeadlines,
    }),
    [visibleDeadlines],
  )

  const columns = useMemo(() => createLegal3Columns(context), [context])
  const { table } = useDataTable<Legal3Deadline>({
    columns,
    data: visibleDeadlines,
    getRowId: (item) => item.id,
  })

  const calendar = useMemo<CollectionCalendarViewProps<Legal3Deadline>>(
    () => ({
      anchor: anchor ? new Date(anchor) : mountedAt,
      getRecordSchedule: (item) => ({
        end: null,
        isAllDay: item.allDay,
        start: new Date(item.dueAt),
      }),
      locale,
      mode: 'month',
      now: now ? new Date(now) : undefined,
      renderRecord: renderLegal3CalendarChip(context),
      timeZone,
      weekStartsOn: 0,
    }),
    [anchor, context, locale, mountedAt, now, timeZone],
  )

  const loadState = dataCollectionLoadState({
    error,
    labels,
    onRetry,
    pending,
    skeleton: <Legal3Skeleton label={labels.loading} />,
  })

  return (
    <DataCollectionFrame
      className={className}
      data-block="legal-3"
      title={labels.title}
      toolbar={
        <DataCollectionToolbar<Legal3Mode, Legal3Status>
          description={labels.summary(
            visibleDeadlines.length,
            visibleDeadlines.filter((item) => item.status === 'pending').length,
          )}
          labels={labels}
          loading={Boolean(loadState)}
          mode={mode}
          modeLabels={labels.modes}
          modes={legal3Modes}
          onCreate={onCreate}
          onExport={onExport}
          onModeChange={setMode}
          onStatusFilterChange={setStatusFilter}
          statusFilter={statusFilter}
          statusLabels={labels.statuses}
          statuses={legal3Statuses}
        />
      }
    >
      {loadState ?? (
        <DataCollection<Legal3Deadline>
          calendar={calendar}
          collection={collection}
          emptyMessage={labels.empty}
          getRowOpenLabel={(item) => labels.openDeadline(item.title)}
          label={labels.title}
          mode={mode}
          onOpen={openDeadline ? (item) => openDeadline(item.id) : undefined}
          renderListRecord={renderLegal3ListRow(context)}
          table={table}
        />
      )}
    </DataCollectionFrame>
  )
}
