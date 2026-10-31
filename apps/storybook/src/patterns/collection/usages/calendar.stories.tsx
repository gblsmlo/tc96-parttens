import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  type CalendarDate,
  CalendarEventChip,
  CalendarEventChipOpenTrigger,
  CalendarEventChipTime,
  CalendarEventChipTitle,
  type CalendarRecordRenderContext,
  type CalendarRecordReschedule,
  type CalendarSlot,
  CalendarView,
  type CalendarViewMode,
  CollectionFrame,
  CollectionFrameBody,
  CollectionFrameHeader,
  toZonedDateTime,
} from '@tc96/parttens'
import { FlagIcon, TagIcon, UsersIcon } from 'lucide-react'
import { useCallback, useMemo, useState } from 'react'
import { expect, screen, userEvent, waitFor, within } from 'storybook/test'
import { CreateEventDialog } from '../../records/dialog/create-event-dialog'
import {
  defaultSlot,
  type EventSlot,
  type EventValues,
  slotFromCalendar,
} from '../../records/dialog/event-record'
import {
  CALENDAR_LOCALE,
  CALENDAR_WEEK_STARTS_ON,
  CalendarToolbar,
  FilterCheckboxSubmenu,
  toAnchor,
  toggleValue,
} from '../fixtures/calendar-toolbar'
import {
  ACTIVITY_TONE,
  type ActivityKind,
  activityKindOptions,
  createActivityCollection,
  type DealActivity,
  initialActivities,
} from '../fixtures/deal-activities'
import {
  type Deal,
  type DealStage,
  initialDeals,
  stageOptions,
} from '../fixtures/deals'
import {
  ANCHOR,
  formatMinutes,
  NOW,
  people,
  TIME_ZONE,
  timeFormatter,
} from '../fixtures/tasks'

const personOptions = people.map((person) => ({
  label: person.name,
  value: person.id,
}))

const stageByDealId = new Map(
  initialDeals.map((deal) => [deal.id, deal.stage] as const),
)

const toolbarSlot = (day: CalendarDate): EventSlot =>
  slotFromCalendar({ day, endMinutes: 10 * 60, startMinutes: 9 * 60 })

const activityFromEvent = (values: EventValues): DealActivity => {
  const deal = initialDeals[0] as Deal
  return {
    dealId: deal.id,
    end: values.end,
    id: `ACT-NEW-${crypto.randomUUID()}`,
    isAllDay: values.allDay,
    kind: 'meeting',
    ownerId: values.guests[0] ?? deal.ownerId,
    start: values.start,
    title: values.title,
  }
}

const getActivitySchedule = (activity: DealActivity) => ({
  end: activity.end ? new Date(activity.end) : null,
  isAllDay: activity.isAllDay,
  start: new Date(activity.start),
})

const renderActivity = (
  activity: DealActivity,
  context: CalendarRecordRenderContext,
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

const meta = {
  parameters: {
    docs: {
      description: {
        component: [
          'The sales calendar of the Pipeline usage as a `CalendarView` alone: calls, meetings, demos and proposals tied to each deal, plus the expected close date of every open deal as an all-day item.',
          'The toolbar moves the period and switches Dia/Semana/Mês, and the `ViewSettingsMenu` filters by owner, activity type and deal stage. Dragging an activity or its top and bottom edges writes the new window through `onRecordReschedule`. Nova atividade and a click on an empty slot of the time grid (`onSelectSlot`) open `CreateEventDialog`, documented in `Patterns/Records/Dialog/Usages/Calendar`, and the saved event is added to the calendar. Interaction coverage lives in `Views/Calendar/Interactions`.',
        ].join('\n\n'),
      },
    },
    layout: 'fullscreen',
  },
  render: function Calendar() {
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
      ({
        end,
        isAllDay,
        record,
        start,
      }: CalendarRecordReschedule<DealActivity>) => {
        setActivities((current) =>
          current.map((activity) =>
            activity.id === record.id
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

    const [createRequest, setCreateRequest] = useState<{
      id: number
      open: boolean
      slot: EventSlot
    }>({ id: 0, open: false, slot: defaultSlot })

    const requestCreate = useCallback((slot: EventSlot) => {
      setCreateRequest((current) => ({ id: current.id + 1, open: true, slot }))
    }, [])

    const selectSlot = useCallback(
      (slot: CalendarSlot) => requestCreate(slotFromCalendar(slot)),
      [requestCreate],
    )

    const openDay = useCallback((date: CalendarDate) => {
      setAnchor(toAnchor(date))
      setMode('day')
    }, [])

    return (
      <main className="mx-auto flex h-dvh w-full max-w-7xl flex-col gap-4 p-6">
        <header>
          <h1 className="font-semibold text-2xl">Agenda comercial</h1>
          <p className="text-muted-foreground text-sm">
            Ligações, reuniões e fechamentos previstos dos negócios do pipeline.
          </p>
        </header>

        <CollectionFrame>
          <CollectionFrameHeader>
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
              onCreate={() =>
                requestCreate(
                  toolbarSlot(toZonedDateTime(anchor, TIME_ZONE).date),
                )
              }
              onModeChange={setMode}
              today={ANCHOR}
            />
          </CollectionFrameHeader>

          <CollectionFrameBody aria-label="Visualização da agenda comercial">
            <CalendarView
              anchor={anchor}
              collection={collection}
              getRecordSchedule={getActivitySchedule}
              loadingRecordLabel="Carregando atividade"
              locale={CALENDAR_LOCALE}
              mode={mode}
              now={NOW}
              onRecordReschedule={rescheduleActivity}
              onSelectDay={openDay}
              onSelectSlot={selectSlot}
              renderRecord={renderActivity}
              timeZone={TIME_ZONE}
              weekStartsOn={CALENDAR_WEEK_STARTS_ON}
            />
          </CollectionFrameBody>
        </CollectionFrame>

        <CreateEventDialog
          key={createRequest.id}
          onCreate={(values) =>
            setActivities((current) => [...current, activityFromEvent(values)])
          }
          onOpenChange={(open) =>
            setCreateRequest((current) => ({ ...current, open }))
          }
          open={createRequest.open}
          slot={createRequest.slot}
        />
      </main>
    )
  },
  title: 'Patterns/Collection/Usages/Calendar',
} satisfies Meta

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const CreateActivity: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Nova atividade opens the create dialog on the anchor day at 09:00-10:00; saving adds the activity to the calendar.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    await userEvent.click(
      canvas.getByRole('button', { name: 'Nova atividade' }),
    )
    const dialog = within(
      await screen.findByRole('dialog', { name: 'New event' }),
    )
    expect(dialog.getByRole('button', { name: /^Date:/ })).toHaveTextContent(
      'Oct 14 · 09:00 – 10:00',
    )
    await userEvent.type(
      dialog.getByRole('textbox', { name: 'Event title' }),
      'Revisão de contrato',
    )
    await userEvent.click(dialog.getByRole('button', { name: 'Save' }))

    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull())
    const chip = canvasElement.querySelector(
      '[data-calendar-date="2026-10-14"] [data-calendar-item-id]',
    )
    expect(chip).not.toBeNull()
    expect(
      await canvas.findByRole('button', { name: 'Abrir Revisão de contrato' }),
    ).toBeInTheDocument()
  },
}

export const CreateActivityFromSlot: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'A click on an empty slot of the time grid opens the create dialog with that day and the 15-minute slot under the pointer; saving places the activity there.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const column = canvasElement.querySelector<HTMLElement>(
      '[data-slot="calendar-time-grid"] [data-calendar-date="2026-10-15"]',
    )
    if (!column) throw new Error('time grid column did not mount')

    const rect = column.getBoundingClientRect()
    const coords = {
      clientX: rect.left + rect.width / 2,
      clientY: rect.top + (rect.height * (10.5 * 60 + 7)) / 1440,
    }
    await userEvent.pointer([
      { coords, keys: '[MouseLeft>]', target: column },
      { coords, keys: '[/MouseLeft]', target: column },
    ])

    const dialog = within(
      await screen.findByRole('dialog', { name: 'New event' }),
    )
    expect(dialog.getByRole('button', { name: /^Date:/ })).toHaveTextContent(
      'Oct 15 · 10:30 – 10:45',
    )
    await userEvent.type(
      dialog.getByRole('textbox', { name: 'Event title' }),
      'Alinhamento rápido',
    )
    await userEvent.click(dialog.getByRole('button', { name: 'Save' }))

    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull())
    const open = await canvas.findByRole('button', {
      name: 'Abrir Alinhamento rápido',
    })
    expect(column.contains(open)).toBe(true)
  },
}
