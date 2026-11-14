import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  CalendarEventChip,
  CalendarEventChipTitle,
  CalendarView,
  type CalendarViewMode,
} from '@tc96/parttens'
import { type ReactElement, useEffect, useState } from 'react'
import { expect, userEvent, waitFor, within } from 'storybook/test'
import type { UsageDocsParameters } from '../../../../.storybook/docs-page.tsx'
import { sleep } from '../../../test-utils/sleep'
import {
  ANCHOR,
  type CalendarTestRecord,
  collectionOf,
  NOW,
  scheduleOf,
  TIME_ZONE,
} from '../fixtures/calendar-view-harness'
import { CalendarWorkspace } from '../fixtures/calendar-workspace'

interface CalendarArgs {
  loading: boolean
  mode: CalendarViewMode
}

const hidden = { table: { disable: true } } as const
const LOAD_DELAY = 2000

const CalendarDoc = CalendarView as unknown as (
  props: CalendarArgs,
) => ReactElement

const anatomyRecords: CalendarTestRecord[] = [
  {
    end: '2026-08-10T13:00:00.000Z',
    id: 'timed',
    start: '2026-08-10T12:00:00.000Z',
    title: 'renderRecord',
  },
  {
    end: null,
    id: 'all-day',
    isAllDay: true,
    start: '2026-08-12T03:00:00.000Z',
    title: 'renderRecord',
  },
  {
    end: '2026-08-13T16:30:00.000Z',
    id: 'block',
    start: '2026-08-13T14:00:00.000Z',
    title: 'renderRecord',
  },
]

const usage = `
import {
  CalendarEventChip,
  CalendarEventChipOpenTrigger,
  CalendarEventChipTime,
  CalendarEventChipTitle,
  CalendarView,
} from '@acme/patterns'

<CalendarView
  anchor={anchor}
  collection={collection}
  getRecordSchedule={(event) => ({ start, end, isAllDay })}
  loading={isLoading}
  mode="week"
  onRecordReschedule={reschedule}
  onSelectDay={openDay}
  renderRecord={(event, context) => (
    <CalendarEventChip display={context.placement === 'time-grid' ? 'block' : 'chip'}>
      <CalendarEventChipTime>{time}</CalendarEventChipTime>
      <CalendarEventChipTitle>{event.title}</CalendarEventChipTitle>
      <CalendarEventChipOpenTrigger aria-label={\`Abrir \${event.title}\`} onClick={open} />
    </CalendarEventChip>
  )}
  timeZone="America/Sao_Paulo"
/>
`

const docs = {
  api: [
    {
      description:
        'Controlled calendar of a collection in `day`, `week` or `month` mode around `anchor`, in `timeZone`. `getRecordSchedule` places each record (timed blocks in the time grid, all-day and month chips); `renderRecord` returns the item and gets its placement. `onRecordReschedule` turns on drag and resize and receives the new window; `onSelectSlot` creates from an empty slot and `onSelectDay` opens a day. A full month cell collapses its overflow behind a "+N" popover (`maxVisibleMonthRecords`). While `loading`, each day renders `loadingRecordCount` skeletons.',
      name: 'CalendarView',
    },
    {
      description:
        'The item `renderRecord` returns. See `Patterns/Collection/Layouts/Calendar/Event Chip`.',
      name: 'CalendarEventChip',
    },
  ],
  description: {
    component:
      '`CalendarView` renders a collection on a calendar. `Anatomy` shows the grids and the record slot, driven by the controls. `Usage` is the Calendar workspace with its toolbar. `Behavior` is the usage under test: it loads after a simulated delay, switches between week and month and moves between periods forward and back.',
  },
  usage,
} satisfies UsageDocsParameters & Record<string, unknown>

const slotClassName =
  'flex h-4 min-w-12 items-center justify-center rounded-sm border border-dashed px-1 text-[0.625rem] text-muted-foreground'

function LoadingWorkspace() {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true
    sleep(LOAD_DELAY).then(() => {
      if (active) setLoading(false)
    })
    return () => {
      active = false
    }
  }, [])

  return <CalendarWorkspace loading={loading} />
}

const meta = {
  args: { loading: false, mode: 'week' },
  argTypes: {
    loading: { control: 'boolean' },
    mode: { control: 'inline-radio', options: ['day', 'week', 'month'] },
  },
  component: CalendarDoc,
  decorators: [
    (Story) => (
      <div className="flex h-[44rem] w-[calc(100vw-2rem)] max-w-[1280px] flex-col">
        <Story />
      </div>
    ),
  ],
  parameters: { docs },
  title: 'Patterns/Collection/Layouts/Calendar',
} satisfies Meta<CalendarArgs>

export default meta

type Story = StoryObj<typeof meta>

export const Anatomy: Story = {
  play: async ({ args, canvasElement }) => {
    await expect(
      canvasElement.querySelector('[data-calendar-mode]'),
    ).toHaveAttribute('data-calendar-mode', args.mode)
  },
  render: ({ loading, mode }) => (
    <div className="flex min-h-0 flex-1 flex-col p-4">
      <CalendarView<CalendarTestRecord>
        anchor={new Date(ANCHOR)}
        collection={collectionOf(anatomyRecords)}
        getRecordSchedule={scheduleOf}
        loading={loading}
        mode={mode}
        now={NOW}
        renderRecord={(record, context) => (
          <CalendarEventChip
            display={context.placement === 'time-grid' ? 'block' : 'chip'}
          >
            <CalendarEventChipTitle>
              <span className={slotClassName}>{record.title}</span>
            </CalendarEventChipTitle>
          </CalendarEventChip>
        )}
        timeZone={TIME_ZONE}
      />
    </div>
  ),
}

export const Usage: Story = {
  render: ({ loading, mode }) => (
    <CalendarWorkspace defaultMode={mode} key={mode} loading={loading} />
  ),
}

export const Behavior: Story = {
  argTypes: { loading: hidden, mode: hidden },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const calendar = () => {
      const node = canvasElement.querySelector<HTMLElement>(
        '[data-calendar-mode]',
      )
      if (!node) throw new Error('The story did not render the calendar.')
      return node
    }
    const firstDate = () =>
      calendar()
        .querySelector('[data-calendar-date]')
        ?.getAttribute('data-calendar-date')

    await expect(calendar()).toHaveAttribute('aria-busy', 'true')
    await expect(
      canvas.getAllByRole('status', { name: 'Carregando compromisso' }).length,
    ).toBeGreaterThan(0)

    await waitFor(() => expect(calendar()).not.toHaveAttribute('aria-busy'), {
      timeout: LOAD_DELAY * 2,
    })
    await expect(
      canvas.queryAllByRole('status', { name: 'Carregando compromisso' }),
    ).toHaveLength(0)
    await expect(
      (await canvas.findAllByRole('button', { name: /^Abrir / })).length,
    ).toBeGreaterThan(0)

    const weekStart = firstDate()
    const step = async (name: string, check: () => Promise<void>) => {
      await sleep(LOAD_DELAY)
      await userEvent.click(canvas.getByRole('button', { name }))
      await waitFor(check)
    }

    await step('Mês', async () =>
      expect(calendar()).toHaveAttribute('data-calendar-mode', 'month'),
    )
    await step('Semana', async () =>
      expect(calendar()).toHaveAttribute('data-calendar-mode', 'week'),
    )
    await expect(firstDate()).toBe(weekStart)

    await step('Próximo período', async () =>
      expect(firstDate()).not.toBe(weekStart),
    )
    await step('Período anterior', async () =>
      expect(firstDate()).toBe(weekStart),
    )
  },
  render: () => <LoadingWorkspace />,
}
