import {
  Action,
  addCalendarDays,
  type CalendarDate,
  CalendarEventChip,
  CalendarEventChipOpenTrigger,
  CalendarEventChipTime,
  CalendarEventChipTitle,
  type CalendarItemRenderContext,
  type CalendarItemReschedule,
  CalendarView,
  type CalendarViewMode,
  CollectionToolbar,
  calendarRange,
  fromZonedDateTime,
  MenuCheckboxOption,
  toZonedDateTime,
  ViewSettingsMenu,
  ViewSettingsSection,
} from '@tc96/parttens'
import { Button } from '@tc96/ui/button'
import {
  MenuGroup,
  MenuGroupLabel,
  MenuSub,
  MenuSubPopup,
  MenuSubTrigger,
} from '@tc96/ui/menu'
import { ToggleGroup, ToggleGroupItem } from '@tc96/ui/toggle-group'
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  TagIcon,
  UsersIcon,
} from 'lucide-react'
import { useCallback, useMemo, useState } from 'react'
import {
  createEventCollection,
  type EventKind,
  KIND_TONE,
  kindOptions,
  type ScheduleEvent,
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

const LOCALE = 'pt-BR'
const WEEK_STARTS_ON = 1

export const rangeModes: readonly { label: string; value: CalendarViewMode }[] =
  [
    { label: 'Dia', value: 'day' },
    { label: 'Semana', value: 'week' },
    { label: 'Mês', value: 'month' },
  ]

const isRangeMode = (value: string): value is CalendarViewMode =>
  rangeModes.some((mode) => mode.value === value)

const toAnchor = (date: CalendarDate) =>
  fromZonedDateTime({ date, minutes: 12 * 60 }, TIME_ZONE)

const shiftDate = (
  date: CalendarDate,
  mode: CalendarViewMode,
  step: -1 | 1,
): CalendarDate => {
  if (mode === 'day') return addCalendarDays(date, step)
  if (mode === 'week') return addCalendarDays(date, step * 7)
  return addCalendarDays({ ...date, day: 1, month: date.month + step }, 0)
}

const asUtcDate = (date: CalendarDate) =>
  new Date(Date.UTC(date.year, date.month - 1, date.day))

const dayFormatter = new Intl.DateTimeFormat(LOCALE, {
  dateStyle: 'full',
  timeZone: 'UTC',
})
const weekFormatter = new Intl.DateTimeFormat(LOCALE, {
  day: 'numeric',
  month: 'short',
  timeZone: 'UTC',
  year: 'numeric',
})
const monthFormatter = new Intl.DateTimeFormat(LOCALE, {
  month: 'long',
  timeZone: 'UTC',
  year: 'numeric',
})

const formatPeriod = (date: CalendarDate, mode: CalendarViewMode) => {
  if (mode === 'day') return dayFormatter.format(asUtcDate(date))
  if (mode === 'month') return monthFormatter.format(asUtcDate(date))
  const range = calendarRange(date, 'week', WEEK_STARTS_ON)
  const first = range[0] ?? date
  const last = range[range.length - 1] ?? date
  return weekFormatter.formatRange(asUtcDate(first), asUtcDate(last))
}

const getEventSchedule = (event: ScheduleEvent) => ({
  end: event.end ? new Date(event.end) : null,
  isAllDay: event.isAllDay,
  start: new Date(event.start),
})

const renderEvent = (
  event: ScheduleEvent,
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

const toggle = <TValue,>(values: readonly TValue[], value: TValue) =>
  values.includes(value)
    ? values.filter((current) => current !== value)
    : [...values, value]

export interface ScheduleUsageProps {
  defaultMode?: CalendarViewMode
  initialEvents?: readonly ScheduleEvent[]
  loading?: boolean
}

export function ScheduleUsage({
  defaultMode = 'week',
  initialEvents = seedEvents,
  loading = false,
}: Readonly<ScheduleUsageProps>) {
  const [events, setEvents] = useState<ScheduleEvent[]>(() => [
    ...initialEvents,
  ])
  const [mode, setMode] = useState<CalendarViewMode>(defaultMode)
  const [anchor, setAnchor] = useState(ANCHOR)
  const [ownerFilter, setOwnerFilter] = useState<readonly string[]>([])
  const [kindFilter, setKindFilter] = useState<readonly EventKind[]>([])

  const anchorDate = toZonedDateTime(anchor, TIME_ZONE).date

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
    ({ end, isAllDay, item, start }: CalendarItemReschedule<ScheduleEvent>) => {
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

  const activeFilterCount = ownerFilter.length + kindFilter.length
  const clearFilters = () => {
    setOwnerFilter([])
    setKindFilter([])
  }

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-7xl flex-col gap-4 p-6">
      <header>
        <h1 className="font-semibold text-2xl">Agenda da equipe</h1>
        <p className="text-muted-foreground text-sm">
          Arraste um compromisso para outro dia ou horário.
        </p>
      </header>

      <div className="flex min-h-0 flex-1 flex-col gap-3">
        <CollectionToolbar
          aria-label="Controles da agenda"
          centerSlot={
            <ToggleGroup
              aria-label="Período"
              onValueChange={(next) => {
                const [value] = next as string[]
                if (value && isRangeMode(value)) setMode(value)
              }}
              value={[mode]}
            >
              {rangeModes.map((option) => (
                <ToggleGroupItem key={option.value} value={option.value}>
                  {option.label}
                </ToggleGroupItem>
              ))}
            </ToggleGroup>
          }
          endSlot={
            <>
              <ViewSettingsMenu
                activeFilterCount={activeFilterCount}
                onClearFilters={clearFilters}
              >
                <ViewSettingsSection label="Filtros">
                  <MenuSub>
                    <MenuSubTrigger>
                      <UsersIcon aria-hidden="true" />
                      Responsável
                    </MenuSubTrigger>
                    <MenuSubPopup>
                      <MenuGroup>
                        <MenuGroupLabel>Responsável</MenuGroupLabel>
                        {people.map((person) => (
                          <MenuCheckboxOption
                            checked={ownerFilter.includes(person.id)}
                            closeOnClick={false}
                            key={person.id}
                            onCheckedChange={() =>
                              setOwnerFilter((current) =>
                                toggle(current, person.id),
                              )
                            }
                          >
                            {person.name}
                          </MenuCheckboxOption>
                        ))}
                      </MenuGroup>
                    </MenuSubPopup>
                  </MenuSub>
                  <MenuSub>
                    <MenuSubTrigger>
                      <TagIcon aria-hidden="true" />
                      Tipo
                    </MenuSubTrigger>
                    <MenuSubPopup>
                      <MenuGroup>
                        <MenuGroupLabel>Tipo</MenuGroupLabel>
                        {kindOptions.map((kind) => (
                          <MenuCheckboxOption
                            checked={kindFilter.includes(kind.value)}
                            closeOnClick={false}
                            key={kind.value}
                            onCheckedChange={() =>
                              setKindFilter((current) =>
                                toggle(current, kind.value),
                              )
                            }
                          >
                            {kind.label}
                          </MenuCheckboxOption>
                        ))}
                      </MenuGroup>
                    </MenuSubPopup>
                  </MenuSub>
                </ViewSettingsSection>
              </ViewSettingsMenu>
              <Action label="Novo compromisso" onClick={() => undefined} />
            </>
          }
          startSlot={
            <div className="flex min-w-0 items-center gap-2">
              <Button
                onClick={() => setAnchor(ANCHOR)}
                size="sm"
                variant="outline"
              >
                Hoje
              </Button>
              <Button
                aria-label="Período anterior"
                onClick={() =>
                  setAnchor(toAnchor(shiftDate(anchorDate, mode, -1)))
                }
                size="icon-sm"
                variant="ghost"
              >
                <ChevronLeftIcon aria-hidden="true" />
              </Button>
              <Button
                aria-label="Próximo período"
                onClick={() =>
                  setAnchor(toAnchor(shiftDate(anchorDate, mode, 1)))
                }
                size="icon-sm"
                variant="ghost"
              >
                <ChevronRightIcon aria-hidden="true" />
              </Button>
              <p
                aria-live="polite"
                className="truncate font-medium text-sm first-letter:uppercase"
                data-slot="schedule-period"
              >
                {formatPeriod(anchorDate, mode)}
              </p>
            </div>
          }
          variant="plain"
        />

        {!loading && visibleEvents.length === 0 ? (
          <p className="text-muted-foreground text-sm">
            Nenhum compromisso com esses filtros.
          </p>
        ) : null}

        <section
          aria-label="Visualização da agenda"
          className="flex h-160 min-h-0 flex-col"
        >
          <CalendarView
            anchor={anchor}
            collection={collection}
            getItemSchedule={getEventSchedule}
            loading={loading}
            loadingItemLabel="Carregando compromisso"
            locale={LOCALE}
            mode={mode}
            now={NOW}
            onItemReschedule={rescheduleEvent}
            onSelectDay={openDay}
            renderItem={renderEvent}
            timeZone={TIME_ZONE}
            weekStartsOn={WEEK_STARTS_ON}
          />
        </section>
      </div>
    </main>
  )
}
