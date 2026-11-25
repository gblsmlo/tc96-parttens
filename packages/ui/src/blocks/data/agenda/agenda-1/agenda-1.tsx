'use client'

import {
  type CalendarDate,
  calendarDateKey,
  parseCalendarDateKey,
} from '@tc96/ui/helpers/calendar-date'
import {
  fromZonedDateTime,
  toZonedDateTime,
} from '@tc96/ui/helpers/zoned-date-time'
import type { CollectionCalendarViewProps } from '@tc96/ui/patterns/collection/composition/collection-layout-outlet'
import { useDataTable } from '@tc96/ui/patterns/collection/layouts/data-table/use-data-table'
import { useMemo, useState } from 'react'
import {
  DataCollection,
  type DataCollectionDefinition,
} from '../../shared/collection/data-collection'
import { DataCollectionFrame } from '../../shared/collection/data-collection-frame'
import { dataCollectionLoadState } from '../../shared/collection/data-collection-load-state'
import {
  defaultDataCollectionLocale,
  defaultDataCollectionTimeZone,
} from '../../shared/collection/labels'
import {
  useControllable,
  useStableHandler,
} from '../../shared/collection/use-controllable'
import {
  agenda1Range,
  createAgenda1Formatters,
  shiftAgenda1Anchor,
} from './agenda-1-calendar'
import { createAgenda1Columns } from './agenda-1-columns'
import {
  type Agenda1FieldContext,
  createAgenda1Options,
} from './agenda-1-fields'
import { agenda1Kinds, agenda1ReschedulableKinds } from './agenda-1-options'
import {
  renderAgenda1CalendarChip,
  renderAgenda1ListRow,
} from './agenda-1-records'
import { Agenda1Skeleton } from './agenda-1-skeleton'
import { Agenda1Toolbar } from './agenda-1-toolbar'
import { resolveAgenda1Labels } from './labels'
import type {
  Agenda1Entry,
  Agenda1GroupBy,
  Agenda1Kind,
  Agenda1Mode,
  Agenda1Period,
  Agenda1Props,
} from './types'

export {
  agenda1Kinds,
  agenda1Modalities,
  agenda1Modes,
  agenda1Periods,
} from './agenda-1-options'

const noOwners: NonNullable<Agenda1Props['owners']> = []
const noKinds: Agenda1Kind[] = []
const noEntries: Agenda1Entry[] = []

export function Agenda1({
  anchor: anchorProp,
  className,
  collapsedGroupIds,
  entries,
  error,
  filtered = false,
  groupBy: groupByProp,
  kindFilter: kindFilterProp,
  labels: labelsProp,
  locale = defaultDataCollectionLocale,
  mode: modeProp,
  now,
  onAnchorChange,
  onCancel,
  onCollapsedGroupIdsChange,
  onCreate,
  onGroupByChange,
  onKindFilterChange,
  onModeChange,
  onOpen,
  onOwnerFilterChange,
  onPeriodChange,
  onReschedule,
  onRetry,
  onSavePreference,
  ownerFilter: ownerFilterProp,
  owners = noOwners,
  ownersLoading = false,
  pending,
  period: periodProp,
  timeZone = defaultDataCollectionTimeZone,
  weekStartsOn = 1,
}: Readonly<Agenda1Props>) {
  const labels = useMemo(() => resolveAgenda1Labels(labelsProp), [labelsProp])
  const [mountedAt] = useState(() => new Date())
  const today = useMemo(
    () => toZonedDateTime(now ? new Date(now) : mountedAt, timeZone).date,
    [mountedAt, now, timeZone],
  )
  const todayKey = calendarDateKey(today)
  const [mode, setMode] = useControllable<Agenda1Mode>(
    modeProp,
    'calendar',
    onModeChange,
  )
  const [period, setPeriod] = useControllable<Agenda1Period>(
    periodProp,
    'week',
    onPeriodChange,
  )
  const [anchor, setAnchor] = useControllable(
    anchorProp,
    todayKey,
    onAnchorChange,
  )
  const [groupBy, setGroupBy] = useControllable<Agenda1GroupBy | null>(
    groupByProp,
    'day',
    onGroupByChange,
  )
  const [kindFilter, setKindFilter] = useControllable<Agenda1Kind[]>(
    kindFilterProp,
    noKinds,
    onKindFilterChange,
  )
  const [ownerFilter, setOwnerFilter] = useControllable<string | null>(
    ownerFilterProp,
    null,
    onOwnerFilterChange,
  )
  const openEntry = useStableHandler(onOpen)
  const cancelEntry = useStableHandler(onCancel)
  const create = useStableHandler(onCreate)

  const anchorDate = useMemo<CalendarDate>(
    () => parseCalendarDateKey(anchor) ?? today,
    [anchor, today],
  )
  const formatters = useMemo(
    () => createAgenda1Formatters(locale, timeZone, weekStartsOn),
    [locale, timeZone, weekStartsOn],
  )
  const firstDayKey = useMemo(
    () =>
      calendarDateKey(
        agenda1Range(anchorDate, period, weekStartsOn)[0] ?? anchorDate,
      ),
    [anchorDate, period, weekStartsOn],
  )
  const goTo = (date: CalendarDate) => setAnchor(calendarDateKey(date))

  const context = useMemo<Agenda1FieldContext>(
    () => ({
      ...createAgenda1Options(labels),
      formatters,
      labels,
      onCancel: cancelEntry,
      onOpen: openEntry,
      owners,
    }),
    [cancelEntry, formatters, labels, openEntry, owners],
  )

  const records = pending ? noEntries : entries

  const collection = useMemo<DataCollectionDefinition<Agenda1Entry>>(() => {
    const dayOf = (entry: Agenda1Entry) => {
      const key = formatters.dayKeyOf(entry.start)
      return key < firstDayKey ? firstDayKey : key
    }
    const dayKeys = [...new Set(records.map(dayOf))].sort()
    const kinds = agenda1Kinds.filter((kind) =>
      records.some((entry) => entry.kind === kind),
    )
    return {
      getKey: (entry) => entry.id,
      getLabel: (entry) => entry.title,
      groupings: [
        {
          getGroupId: dayOf,
          id: 'day',
          label: labels.groupings.day,
          options: dayKeys.map((key) => {
            const date = parseCalendarDateKey(key) ?? anchorDate
            return { id: key, label: formatters.dayLabel(date) }
          }),
        },
        {
          getGroupId: (entry) => entry.kind,
          id: 'kind',
          label: labels.groupings.kind,
          options: kinds.map((kind) => ({
            id: kind,
            label: labels.kinds[kind],
          })),
        },
      ],
      records,
    }
  }, [anchorDate, firstDayKey, formatters, labels, records])

  const tableRecords = useMemo(() => {
    const dimension =
      mode === 'table'
        ? collection.groupings.find(({ id }) => id === groupBy)
        : undefined
    if (!dimension) return records
    const rank = new Map(
      dimension.options.map((option, index) => [option.id, index]),
    )
    const rankOf = (entry: Agenda1Entry) =>
      rank.get(dimension.getGroupId(entry) ?? '') ?? rank.size
    return [...records].sort((a, b) => rankOf(a) - rankOf(b))
  }, [collection, groupBy, mode, records])

  const columns = useMemo(() => createAgenda1Columns(context), [context])
  const { table } = useDataTable<Agenda1Entry>({
    columns,
    data: tableRecords,
    getRowId: (entry) => entry.id,
  })

  const calendar = useMemo<CollectionCalendarViewProps<Agenda1Entry>>(
    () => ({
      anchor: fromZonedDateTime({ date: anchorDate, minutes: 720 }, timeZone),
      getRecordSchedule: (entry) => ({
        end: entry.end ? new Date(entry.end) : null,
        isAllDay: entry.allDay,
        start: new Date(entry.start),
      }),
      loading: Boolean(pending),
      loadingRecordLabel: labels.loading,
      locale,
      mode: period,
      now: now ? new Date(now) : undefined,
      onRecordReschedule: onReschedule
        ? (change) => {
            if (!agenda1ReschedulableKinds.includes(change.record.kind))
              return false
            return onReschedule({
              allDay: change.isAllDay,
              end: change.end ? change.end.toISOString() : null,
              entry: change.record,
              start: change.start.toISOString(),
            })
          }
        : undefined,
      onSelectDay: (date) => {
        setPeriod('day')
        setAnchor(calendarDateKey(date))
      },
      onSelectSlot: create
        ? (slot) =>
            create({
              end: fromZonedDateTime(
                { date: slot.day, minutes: slot.endMinutes },
                timeZone,
              ).toISOString(),
              start: fromZonedDateTime(
                { date: slot.day, minutes: slot.startMinutes },
                timeZone,
              ).toISOString(),
            })
        : undefined,
      renderRecord: renderAgenda1CalendarChip(context),
      timeZone,
      weekStartsOn,
    }),
    [
      anchorDate,
      context,
      create,
      labels.loading,
      locale,
      now,
      onReschedule,
      pending,
      period,
      setAnchor,
      setPeriod,
      timeZone,
      weekStartsOn,
    ],
  )

  const loadState = dataCollectionLoadState({
    error: error && !pending,
    labels,
    onRetry,
    pending: pending && mode !== 'calendar',
    skeleton: <Agenda1Skeleton label={labels.loading} />,
  })

  return (
    <DataCollectionFrame
      className={className}
      data-block="agenda-1"
      title={labels.title}
      toolbar={
        <Agenda1Toolbar
          groupBy={groupBy}
          kindFilter={kindFilter}
          labels={labels}
          mode={mode}
          onCreate={create ? () => create() : undefined}
          onGroupByChange={setGroupBy}
          onKindFilterChange={onKindFilterChange ? setKindFilter : undefined}
          onModeChange={setMode}
          onNext={() => goTo(shiftAgenda1Anchor(anchorDate, period, 1))}
          onOwnerFilterChange={setOwnerFilter}
          onPeriodChange={setPeriod}
          onPrevious={() => goTo(shiftAgenda1Anchor(anchorDate, period, -1))}
          onSavePreference={onSavePreference}
          onToday={() => setAnchor(todayKey)}
          ownerFilter={ownerFilter}
          owners={owners}
          ownersLoading={ownersLoading}
          period={period}
          periodTitle={formatters.periodTitle(anchorDate, period)}
        />
      }
    >
      {loadState ?? (
        <DataCollection<Agenda1Entry>
          calendar={calendar}
          collapsedGroupIds={collapsedGroupIds}
          collection={collection}
          emptyGroupMessage={labels.emptyGroup}
          emptyMessage={filtered ? labels.noResult : labels.empty}
          getGroupToggleLabel={labels.groupToggle}
          getRowOpenLabel={(entry) => labels.openEntry(entry.title)}
          groupBy={records.length > 0 ? groupBy : null}
          label={labels.title}
          mode={mode}
          onCollapsedGroupIdsChange={
            onCollapsedGroupIdsChange
              ? (groupIds) => onCollapsedGroupIdsChange([...groupIds])
              : undefined
          }
          onOpen={openEntry}
          renderListRecord={renderAgenda1ListRow(context)}
          table={table}
        />
      )}
    </DataCollectionFrame>
  )
}
