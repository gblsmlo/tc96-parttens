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
import { FlagIcon, TagIcon, UsersIcon } from 'lucide-react'
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
  ACTIVITY_TONE,
  type ActivityKind,
  activityKindOptions,
  createActivityCollection,
  type DealActivity,
  initialActivities,
} from './deal-activities'
import { type DealStage, initialDeals, stageOptions } from './deals'
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

const stageByDealId = new Map(
  initialDeals.map((deal) => [deal.id, deal.stage] as const),
)

const getActivitySchedule = (activity: DealActivity) => ({
  end: activity.end ? new Date(activity.end) : null,
  isAllDay: activity.isAllDay,
  start: new Date(activity.start),
})

const renderActivity = (
  activity: DealActivity,
  context: CalendarItemRenderContext,
) => {
  const inTimeGrid = context.placement === 'time-grid'
  return (
    <CalendarEventChip
      display={inTimeGrid ? 'block' : 'chip'}
      tone={ACTIVITY_TONE[activity.kind]}
    >
      {inTimeGrid ? (
        <CalendarEventChipTime>
          {formatMinutes(context.startMinutes)}
        </CalendarEventChipTime>
      ) : activity.isAllDay ? null : (
        <CalendarEventChipTime>
          {timeFormatter.format(new Date(activity.start))}
        </CalendarEventChipTime>
      )}
      <CalendarEventChipTitle>{activity.title}</CalendarEventChipTitle>
      <CalendarEventChipOpenTrigger aria-label={`Abrir ${activity.title}`} />
    </CalendarEventChip>
  )
}

export function CalendarUsage() {
  const [activities, setActivities] = useState(initialActivities)
  const [mode, setMode] = useState<CalendarViewMode>('week')
  const [anchor, setAnchor] = useState(ANCHOR)
  const [ownerFilter, setOwnerFilter] = useState<readonly string[]>([])
  const [kindFilter, setKindFilter] = useState<readonly ActivityKind[]>([])
  const [stageFilter, setStageFilter] = useState<readonly DealStage[]>([])

  const visibleActivities = useMemo(
    () =>
      activities.filter((activity) => {
        const stage = stageByDealId.get(activity.dealId)
        return (
          (ownerFilter.length === 0 ||
            ownerFilter.includes(activity.ownerId)) &&
          (kindFilter.length === 0 || kindFilter.includes(activity.kind)) &&
          (stageFilter.length === 0 ||
            (stage !== undefined && stageFilter.includes(stage)))
        )
      }),
    [activities, kindFilter, ownerFilter, stageFilter],
  )
  const collection = useMemo(
    () => createActivityCollection(visibleActivities),
    [visibleActivities],
  )

  const rescheduleActivity = useCallback(
    ({ end, isAllDay, item, start }: CalendarItemReschedule<DealActivity>) => {
      setActivities((current) =>
        current.map((activity) =>
          activity.id === item.id
            ? {
                ...activity,
                end: end?.toISOString() ?? null,
                isAllDay,
                start: start.toISOString(),
              }
            : activity,
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
    <main className="mx-auto flex min-h-screen w-full max-w-7xl flex-col gap-4 p-6">
      <header>
        <h1 className="font-semibold text-2xl">Agenda comercial</h1>
        <p className="text-muted-foreground text-sm">
          Ligações, reuniões e fechamentos previstos dos negócios do pipeline.
        </p>
      </header>

      <div className="flex min-h-0 flex-1 flex-col gap-3">
        <CalendarToolbar
          activeFilterCount={
            ownerFilter.length + kindFilter.length + stageFilter.length
          }
          anchorDate={toZonedDateTime(anchor, TIME_ZONE).date}
          aria-label="Controles da agenda comercial"
          createLabel="Nova atividade"
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
                options={activityKindOptions}
                selected={kindFilter}
              />
              <FilterCheckboxSubmenu
                icon={FlagIcon}
                label="Etapa do negócio"
                onToggle={(stage) =>
                  setStageFilter((current) => toggleValue(current, stage))
                }
                options={stageOptions}
                selected={stageFilter}
              />
            </>
          }
          mode={mode}
          onAnchorChange={setAnchor}
          onClearFilters={() => {
            setOwnerFilter([])
            setKindFilter([])
            setStageFilter([])
          }}
          onModeChange={setMode}
          today={ANCHOR}
        />

        <section
          aria-label="Visualização da agenda comercial"
          className="flex h-160 min-h-0 flex-col"
        >
          <CalendarView
            anchor={anchor}
            collection={collection}
            getItemSchedule={getActivitySchedule}
            loadingItemLabel="Carregando atividade"
            locale={CALENDAR_LOCALE}
            mode={mode}
            now={NOW}
            onItemReschedule={rescheduleActivity}
            onSelectDay={openDay}
            renderItem={renderActivity}
            timeZone={TIME_ZONE}
            weekStartsOn={CALENDAR_WEEK_STARTS_ON}
          />
        </section>
      </div>
    </main>
  )
}
