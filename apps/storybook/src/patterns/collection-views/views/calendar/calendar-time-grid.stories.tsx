import type { Meta, StoryObj } from '@storybook/react-vite'
import { CalendarView, type CalendarViewProps } from '@tc96/parttens'
import type { ReactElement } from 'react'
import { expect } from 'storybook/test'
import { booleanArgType } from '../../../../test-utils/story-arg-types'
import {
  createTaskCalendarProps,
  useTasks,
} from '../../fixtures/task-renderers'
import { createCollection, initialTasks, type Task } from '../../fixtures/tasks'

const onboarding = initialTasks[0] as Task
const codeFreeze = initialTasks[7] as Task

const positionedTasks: Task[] = [
  onboarding,
  {
    ...codeFreeze,
    end: '2026-10-15T03:00:00.000Z',
    start: '2026-10-14T03:00:00.000Z',
  },
]

const overlapTasks: Task[] = [
  { ...onboarding, id: 'overlap-a' },
  {
    ...onboarding,
    end: '2026-10-14T20:00:00.000Z',
    id: 'overlap-b',
    start: '2026-10-14T18:00:00.000Z',
  },
]

const shortTask = (
  id: string,
  title: string,
  start: string,
  minutes: number,
): Task => ({
  ...onboarding,
  end: new Date(new Date(start).getTime() + minutes * 60_000).toISOString(),
  id,
  priority: 'medium',
  start,
  title,
})

const shortTasks: Task[] = [
  shortTask('short-15', 'Daily', '2026-10-13T12:00:00.000Z', 15),
  shortTask('short-30', 'Café', '2026-10-13T13:00:00.000Z', 30),
  shortTask(
    'long-30',
    'Revisão do contrato de fornecimento',
    '2026-10-13T14:00:00.000Z',
    30,
  ),
  shortTask(
    'long-45',
    'Alinhamento com o time de dados',
    '2026-10-13T15:00:00.000Z',
    45,
  ),
  shortTask(
    'long-60',
    'Planejamento da sprint de pagamentos',
    '2026-10-13T17:00:00.000Z',
    60,
  ),
  shortTask('lane-a', 'Ligação com cliente', '2026-10-14T13:00:00.000Z', 30),
  shortTask('lane-b', 'Revisão de PR', '2026-10-14T13:00:00.000Z', 30),
  shortTask('lane-c', 'Entrevista', '2026-10-14T13:00:00.000Z', 30),
]

const calendarArgs = {
  ...createTaskCalendarProps(() => undefined),
  collection: createCollection(initialTasks),
  mode: 'week' as const,
}

const TasksCalendarView = CalendarView as (
  props: CalendarViewProps<Task>,
) => ReactElement

function Example({
  itemsOverride,
  loading = false,
  mode = 'week',
}: Readonly<{
  itemsOverride?: Task[]
  loading?: boolean
  mode?: 'day' | 'week'
}>) {
  const { tasks, updateTask } = useTasks(itemsOverride)

  return (
    <div className="h-160 min-w-0 p-4">
      <CalendarView
        {...createTaskCalendarProps(updateTask)}
        collection={createCollection(tasks)}
        loading={loading}
        mode={mode}
        onItemReschedule={
          loading
            ? undefined
            : createTaskCalendarProps(updateTask).onItemReschedule
        }
      />
    </div>
  )
}

const meta = {
  args: calendarArgs,
  argTypes: {
    loading: booleanArgType,
    mode: { control: 'inline-radio', options: ['day', 'week', 'month'] },
    weekStartsOn: { control: 'inline-radio', options: [0, 1] },
  },
  component: TasksCalendarView,
  parameters: {
    docs: {
      description: {
        component:
          'Week and day calendar building block: hour axis, all-day strip, blocks positioned by hour with height proportional to duration, overlap lanes and the current-time line.',
      },
    },
    layout: 'fullscreen',
  },
  title: 'Patterns/CollectionViews/Views/Calendar/Time Grid',
} satisfies Meta<typeof TasksCalendarView>

export default meta

type Story = StoryObj<typeof meta>

export const Week: Story = {
  args: calendarArgs,
  play: async ({ canvasElement }) => {
    const column = canvasElement.querySelector<HTMLElement>(
      '[data-calendar-date="2026-10-14"]',
    )
    const block = column?.querySelector<HTMLElement>(
      '[data-calendar-item-id="TSK-101"]',
    )
    if (!column || !block)
      throw new Error('A story não posicionou o bloco na coluna do dia 14.')

    const positioned = block.parentElement as HTMLElement
    const columnRect = column.getBoundingClientRect()
    const blockRect = positioned.getBoundingClientRect()
    const topPct = ((blockRect.top - columnRect.top) / columnRect.height) * 100
    const heightPct = (blockRect.height / columnRect.height) * 100

    await expect(Math.abs(topPct - 58.33)).toBeLessThan(0.5)
    await expect(Math.abs(heightPct - 8.33)).toBeLessThan(0.5)

    await expect(
      canvasElement.querySelectorAll('[data-slot="calendar-now-line"]'),
    ).toHaveLength(1)
  },
  render: () => <Example itemsOverride={positionedTasks} />,
}

export const WeekOverlap: Story = {
  args: calendarArgs,
  play: async ({ canvasElement }) => {
    const column = canvasElement.querySelector<HTMLElement>(
      '[data-calendar-date="2026-10-14"]',
    )
    const first = column?.querySelector<HTMLElement>(
      '[data-calendar-item-id="overlap-a"]',
    )
    const second = column?.querySelector<HTMLElement>(
      '[data-calendar-item-id="overlap-b"]',
    )
    if (!column || !first || !second)
      throw new Error('A story não montou os blocos sobrepostos.')

    const columnWidth = column.getBoundingClientRect().width
    const firstRect = (
      first.parentElement as HTMLElement
    ).getBoundingClientRect()
    const secondRect = (
      second.parentElement as HTMLElement
    ).getBoundingClientRect()

    await expect(Math.abs(firstRect.width - columnWidth / 2)).toBeLessThan(2)
    await expect(Math.abs(secondRect.width - columnWidth / 2)).toBeLessThan(2)
    await expect(secondRect.left).toBeGreaterThan(firstRect.left)
  },
  render: () => <Example itemsOverride={overlapTasks} />,
}

export const ShortItems: Story = {
  args: calendarArgs,
  parameters: {
    docs: {
      description: {
        story:
          'Items of 15, 30, 45 and 60 minutes, and three 30-minute items sharing a slot. A block shows the title before the time; one shorter than two lines lays them on a single row and keeps the time only when it fits beside the title.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const rectsOf = (id: string) => {
      const item = canvasElement.querySelector(
        `[data-calendar-item-id="${id}"]`,
      )
      const chip = item?.querySelector('[data-slot="calendar-event-chip"]')
      const title = item?.querySelector(
        '[data-slot="calendar-event-chip-title"]',
      )
      const time = item?.querySelector('[data-slot="calendar-event-chip-time"]')
      if (!chip || !title || !time)
        throw new Error(`A story não montou o bloco ${id}.`)

      return {
        chip: chip.getBoundingClientRect(),
        time: time.getBoundingClientRect(),
        title: title.getBoundingClientRect(),
      }
    }

    for (const id of [
      'short-30',
      'long-30',
      'long-45',
      'long-60',
      'lane-a',
      'lane-b',
      'lane-c',
    ]) {
      const { chip, title } = rectsOf(id)
      await expect(title.top).toBeGreaterThanOrEqual(chip.top)
      await expect(title.bottom).toBeLessThanOrEqual(chip.bottom)
      await expect(title.width).toBeGreaterThan(0)
    }

    const inline = rectsOf('short-30')
    await expect(inline.time.top).toBe(inline.title.top)
    await expect(inline.time.left).toBeGreaterThan(inline.title.left)

    for (const id of ['long-30', 'long-45']) {
      const wrapped = rectsOf(id)
      await expect(wrapped.time.top).toBeGreaterThanOrEqual(wrapped.chip.bottom)
    }

    const stacked = rectsOf('long-60')
    await expect(stacked.time.top).toBeGreaterThanOrEqual(stacked.title.bottom)
    await expect(stacked.time.bottom).toBeLessThanOrEqual(stacked.chip.bottom)
  },
  render: () => <Example itemsOverride={shortTasks} />,
}

export const AllDay: Story = {
  args: calendarArgs,
  play: async ({ canvasElement }) => {
    const strip = canvasElement.querySelector(
      '[data-calendar-all-day-date="2026-10-14"]',
    )
    await expect(
      strip?.querySelector('[data-calendar-item-id="TSK-108"]'),
    ).not.toBeNull()

    const column = canvasElement.querySelector(
      '[data-calendar-date="2026-10-14"]',
    )
    await expect(
      column?.querySelector('[data-calendar-item-id="TSK-108"]'),
    ).toBeNull()
  },
  render: () => <Example itemsOverride={positionedTasks} />,
}

export const Day: Story = {
  args: calendarArgs,
  render: () => <Example itemsOverride={positionedTasks} mode="day" />,
}

export const Loading: Story = {
  args: calendarArgs,
  render: () => <Example loading />,
}
