import {
  type CalendarDate,
  CalendarEventChip,
  CalendarEventChipOpenTrigger,
  CalendarEventChipTime,
  CalendarEventChipTitle,
  type CalendarItemRenderContext,
  type CalendarItemReschedule,
  CalendarView,
  type CalendarViewMode,
  toZonedDateTime,
} from '@tc96/parttens'
import { TagIcon, UsersIcon } from 'lucide-react'
import { useCallback, useMemo, useState } from 'react'
import {
  CALENDAR_LOCALE,
  CALENDAR_WEEK_STARTS_ON,
  CalendarToolbar,
  FilterCheckboxSubmenu,
  toAnchor,
  toggleValue,
} from './calendar-toolbar'
import {
  type CalendarEvent,
  createEventCollection,
  type EventKind,
  KIND_TONE,
  kindOptions,
  initialEvents as seedEvents,
} from './events'
import {
  ANCHOR,
  formatMinutes,
  NOW,
  people,
  TIME_ZONE,
  timeFormatter,
} from './tasks'

const personOptions = people.map((person) => ({
  label: person.name,
  value: person.id,
}))

const getEventSchedule = (event: CalendarEvent) => ({
  end: event.end ? new Date(event.end) : null,
  isAllDay: event.isAllDay,
  start: new Date(event.start),
})

const renderEvent = (
  event: CalendarEvent,
  context: CalendarItemRenderContext,
) => {
  const inTimeGrid = context.placement === 'time-grid'
  return (
    <CalendarEventChip
      display={inTimeGrid ? 'block' : 'chip'}
      tone={KIND_TONE[event.kind]}
    >
      {inTimeGrid ? (
        <CalendarEventChipTime>
          {formatMinutes(context.startMinutes)}
        </CalendarEventChipTime>
      ) : event.isAllDay ? null : (
        <CalendarEventChipTime>
          {timeFormatter.format(new Date(event.start))}
        </CalendarEventChipTime>
      )}
      <CalendarEventChipTitle>{event.title}</CalendarEventChipTitle>
      <CalendarEventChipOpenTrigger aria-label={`Abrir ${event.title}`} />
    </CalendarEventChip>
  )
}

export interface CalendarWorkspaceProps {
  defaultMode?: CalendarViewMode
  initialEvents?: readonly CalendarEvent[]
  loading?: boolean
}

export function CalendarWorkspace({
  defaultMode = 'week',
  initialEvents = seedEvents,
  loading = false,
}: Readonly<CalendarWorkspaceProps>) {
  const [events, setEvents] = useState<CalendarEvent[]>(() => [
    ...initialEvents,
  ])
  const [mode, setMode] = useState<CalendarViewMode>(defaultMode)
  const [anchor, setAnchor] = useState(ANCHOR)
  const [ownerFilter, setOwnerFilter] = useState<readonly string[]>([])
  const [kindFilter, setKindFilter] = useState<readonly EventKind[]>([])

  const visibleEvents = useMemo(
    () =>
      events.filter(
        (event) =>
          (ownerFilter.length === 0 || ownerFilter.includes(event.ownerId)) &&
          (kindFilter.length === 0 || kindFilter.includes(event.kind)),
      ),
    [events, kindFilter, ownerFilter],
  )
  const collection = useMemo(
    () => createEventCollection(visibleEvents),
    [visibleEvents],
  )

  const rescheduleEvent = useCallback(
    ({ end, isAllDay, item, start }: CalendarItemReschedule<CalendarEvent>) => {
      setEvents((current) =>
        current.map((event) =>
          event.id === item.id
            ? {
                ...event,
                end: end?.toISOString() ?? null,
                isAllDay,
                start: start.toISOString(),
              }
            : event,
        ),
      )
      return true
    },
    [],
  )

  const openDay = useCallback((date: CalendarDate) => {
    setAnchor(toAnchor(date))
    setMode('day')
  }, [])

  return (
    <div className="flex min-w-0 flex-col gap-3 p-4">
      <CalendarToolbar
        activeFilterCount={ownerFilter.length + kindFilter.length}
        anchorDate={toZonedDateTime(anchor, TIME_ZONE).date}
        aria-label="Controles do calendário"
        createLabel="Novo compromisso"
        filters={
          <>
            <FilterCheckboxSubmenu
              icon={UsersIcon}
              label="Responsável"
              onToggle={(id) =>
                setOwnerFilter((current) => toggleValue(current, id))
              }
              options={personOptions}
              selected={ownerFilter}
            />
            <FilterCheckboxSubmenu
              icon={TagIcon}
              label="Tipo"
              onToggle={(kind) =>
                setKindFilter((current) => toggleValue(current, kind))
              }
              options={kindOptions}
              selected={kindFilter}
            />
          </>
        }
        mode={mode}
        onAnchorChange={setAnchor}
        onClearFilters={() => {
          setOwnerFilter([])
          setKindFilter([])
        }}
        onModeChange={setMode}
        today={ANCHOR}
      />

      {!loading && visibleEvents.length === 0 ? (
        <p className="text-muted-foreground text-sm">
          Nenhum compromisso com esses filtros.
        </p>
      ) : null}

      <div className="flex h-160 min-h-0 flex-col">
        <CalendarView
          anchor={anchor}
          collection={collection}
          getItemSchedule={getEventSchedule}
          loading={loading}
          loadingItemLabel="Carregando compromisso"
          locale={CALENDAR_LOCALE}
          mode={mode}
          now={NOW}
          onItemReschedule={rescheduleEvent}
          onSelectDay={openDay}
          renderItem={renderEvent}
          timeZone={TIME_ZONE}
          weekStartsOn={CALENDAR_WEEK_STARTS_ON}
        />
      </div>
    </div>
  )
}
