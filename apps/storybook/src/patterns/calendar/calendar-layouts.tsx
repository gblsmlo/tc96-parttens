import { CheckIcon } from '@phosphor-icons/react'
import {
  CalendarEventChip,
  CalendarEventChipOpenTrigger,
  CalendarEventChipTime,
  CalendarEventChipTitle,
  type CalendarRecordRenderContext,
  type CalendarRecordReschedule,
  CalendarView,
  type CalendarViewProps,
} from '@tc96/ui/patterns'
import { type ReactNode, useCallback, useMemo, useState } from 'react'
import {
  ANCHOR,
  NOW,
  TIME_ZONE,
} from '../collection/fixtures/calendar-view-harness'
import type { CalendarControls, CalendarToneName } from './calendar-controls.ts'
import { type CalendarSample, calendarSamplesWith } from './calendar-data.ts'

type ConsumerHandledProps =
  | 'anchor'
  | 'collection'
  | 'getRecordSchedule'
  | 'now'
  | 'onRecordReschedule'
  | 'renderRecord'
  | 'timeZone'

export interface CalendarItemOptions {
  action?: boolean
  onAction?: (record: CalendarSample) => void
  onOpen?: (record: CalendarSample) => void
  openTrigger?: boolean
  time?: boolean
  tone?: CalendarToneName
}

export interface StatefulCalendarProps
  extends Omit<CalendarViewProps<CalendarSample>, ConsumerHandledProps>,
    CalendarItemOptions {
  initialRecords: readonly CalendarSample[]
  onRecordReschedule?: (
    change: CalendarRecordReschedule<CalendarSample>,
  ) => void
}

const scheduleOf = (record: CalendarSample) => ({
  end: record.end ? new Date(record.end) : null,
  isAllDay: record.isAllDay,
  start: new Date(record.start),
})

const startFormatter = new Intl.DateTimeFormat('pt-BR', {
  hour: '2-digit',
  minute: '2-digit',
  timeZone: TIME_ZONE,
})

const minutesLabel = (minutes: number) =>
  `${String(Math.floor(minutes / 60)).padStart(2, '0')}:${String(minutes % 60).padStart(2, '0')}`

const timeLabelOf = (
  record: CalendarSample,
  context: CalendarRecordRenderContext,
) =>
  context.startMinutes === null
    ? startFormatter.format(new Date(record.start))
    : minutesLabel(context.startMinutes)

export const StatefulCalendar = ({
  action = false,
  onAction,
  initialRecords,
  onOpen,
  onRecordReschedule,
  openTrigger = true,
  time = true,
  tone,
  ...props
}: Readonly<StatefulCalendarProps>) => {
  const [records, setRecords] = useState(initialRecords)
  const collection = useMemo(
    () => ({
      getKey: (record: CalendarSample) => record.id,
      getLabel: (record: CalendarSample) => record.title,
      groupings: [],
      records,
    }),
    [records],
  )

  const toggleCompleted = useCallback(
    (id: string) =>
      setRecords((current) =>
        current.map((record) =>
          record.id === id
            ? { ...record, completed: !record.completed }
            : record,
        ),
      ),
    [],
  )

  const reschedule = useCallback(
    (change: CalendarRecordReschedule<CalendarSample>) => {
      onRecordReschedule?.(change)
      setRecords((current) =>
        current.map((record) =>
          record.id === change.recordKey
            ? {
                ...record,
                end: change.end?.toISOString() ?? null,
                isAllDay: change.isAllDay,
                start: change.start.toISOString(),
              }
            : record,
        ),
      )
      return true
    },
    [onRecordReschedule],
  )

  const renderRecord = useCallback(
    (record: CalendarSample, context: CalendarRecordRenderContext) => (
      <CalendarEventChip
        completed={record.completed}
        display={context.placement === 'time-grid' ? 'block' : 'chip'}
        {...(tone ? { tone } : {})}
      >
        {time && !record.isAllDay ? (
          <CalendarEventChipTime>
            {timeLabelOf(record, context)}
          </CalendarEventChipTime>
        ) : null}
        <CalendarEventChipTitle>{record.title}</CalendarEventChipTitle>
        {action ? (
          <button
            aria-label={`Concluir ${record.title}`}
            aria-pressed={record.completed}
            className="flex size-4 shrink-0 items-center justify-center rounded-sm outline-none hover:bg-foreground/10 focus-visible:ring-2 focus-visible:ring-ring"
            data-calendar-item-action=""
            onClick={() => {
              onAction?.(record)
              toggleCompleted(record.id)
            }}
            type="button"
          >
            <CheckIcon aria-hidden="true" className="size-3" />
          </button>
        ) : null}
        {openTrigger ? (
          <CalendarEventChipOpenTrigger
            aria-label={`Abrir ${record.title}`}
            onClick={() => onOpen?.(record)}
          />
        ) : null}
      </CalendarEventChip>
    ),
    [action, onAction, onOpen, openTrigger, time, toggleCompleted, tone],
  )

  return (
    <CalendarView<CalendarSample>
      {...props}
      anchor={new Date(ANCHOR)}
      collection={collection}
      getRecordSchedule={scheduleOf}
      now={NOW}
      onRecordReschedule={reschedule}
      renderRecord={renderRecord}
      timeZone={TIME_ZONE}
    />
  )
}

export const CalendarFrame = ({
  children,
}: Readonly<{ children: ReactNode }>) => (
  <div className="flex min-h-0 flex-1 flex-col p-4">{children}</div>
)

export const ComposedCalendar = ({
  action,
  completed,
  empty,
  loading,
  locale,
  maxVisibleMonthRecords,
  mode,
  onAction,
  onOpen,
  openTrigger,
  time,
  tone,
  weekStartsOn,
}: Readonly<
  CalendarControls & Pick<CalendarItemOptions, 'onAction' | 'onOpen'>
>) => (
  <CalendarFrame>
    <StatefulCalendar
      action={action}
      initialRecords={calendarSamplesWith({ completed, empty })}
      key={[completed, empty].join()}
      loading={loading}
      locale={locale}
      maxVisibleMonthRecords={maxVisibleMonthRecords}
      mode={mode}
      openTrigger={openTrigger}
      time={time}
      tone={tone}
      weekStartsOn={weekStartsOn}
      {...(onAction ? { onAction } : {})}
      {...(onOpen ? { onOpen } : {})}
    />
  </CalendarFrame>
)
