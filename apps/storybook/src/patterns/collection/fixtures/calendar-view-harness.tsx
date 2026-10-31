import {
  CalendarEventChip,
  CalendarEventChipTitle,
  CalendarView,
  type CalendarViewMode,
  type CalendarViewProps,
} from '@tc96/parttens'
import type { ReactNode } from 'react'
import { useSyncExternalStore } from 'react'

export interface CalendarTestRecord {
  end: string | null
  id: string
  isAllDay?: boolean
  start: string
  title: string
}

export const TIME_ZONE = 'America/Fortaleza'
export const ANCHOR = '2026-08-12T12:00:00.000Z'
export const NOW = new Date('2026-08-12T15:00:00.000Z')

export const collectionOf = (records: CalendarTestRecord[]) => ({
  getKey: (record: CalendarTestRecord) => record.id,
  getLabel: (record: CalendarTestRecord) => record.title,
  groupings: [],
  records,
})

export const scheduleOf = (record: CalendarTestRecord) => ({
  end: record.end ? new Date(record.end) : null,
  isAllDay: record.isAllDay ?? false,
  start: new Date(record.start),
})

export const renderChip = (record: CalendarTestRecord): ReactNode => (
  <CalendarEventChip>
    <CalendarEventChipTitle>{record.title}</CalendarEventChipTitle>
  </CalendarEventChip>
)

export interface CalendarViewHarnessProps {
  anchor: string
  loading?: boolean
  loadingRecordCount?: number
  loadingRecordLabel?: string
  maxVisibleMonthRecords?: number
  mode: CalendarViewMode
  onRecordReschedule?: CalendarViewProps<CalendarTestRecord>['onRecordReschedule']
  onSelectDay?: CalendarViewProps<CalendarTestRecord>['onSelectDay']
  onSelectSlot?: CalendarViewProps<CalendarTestRecord>['onSelectSlot']
  records: CalendarTestRecord[]
  renderRecord: CalendarViewProps<CalendarTestRecord>['renderRecord']
  snapMinutes?: number
}

export function CalendarViewHarness({
  anchor,
  records,
  ...props
}: CalendarViewHarnessProps) {
  return (
    <div className="h-dvh min-w-0 p-4">
      <CalendarView<CalendarTestRecord>
        {...props}
        anchor={new Date(anchor)}
        collection={collectionOf(records)}
        getRecordSchedule={scheduleOf}
        now={NOW}
        timeZone={TIME_ZONE}
      />
    </div>
  )
}

export type CalendarViewOverrides = Partial<
  Pick<CalendarViewHarnessProps, 'anchor' | 'records'>
>

export function createCalendarScenario() {
  let overrides: CalendarViewOverrides = {}
  const listeners = new Set<() => void>()
  const emit = () => {
    for (const listener of listeners) listener()
  }

  return {
    get: () => overrides,
    reset: () => {
      overrides = {}
      emit()
    },
    subscribe: (listener: () => void) => {
      listeners.add(listener)
      return () => {
        listeners.delete(listener)
      }
    },
    update: (next: CalendarViewOverrides) => {
      overrides = { ...overrides, ...next }
      emit()
    },
  }
}

export type CalendarScenario = ReturnType<typeof createCalendarScenario>

function LiveCalendarView({
  scenario,
  ...props
}: CalendarViewHarnessProps & { scenario: CalendarScenario }) {
  const overrides = useSyncExternalStore(scenario.subscribe, scenario.get)
  return <CalendarViewHarness {...props} {...overrides} />
}

export function CalendarViewScenario({
  scenario,
  ...props
}: CalendarViewHarnessProps & { scenario?: CalendarScenario }) {
  return scenario ? (
    <LiveCalendarView {...props} scenario={scenario} />
  ) : (
    <CalendarViewHarness {...props} />
  )
}
