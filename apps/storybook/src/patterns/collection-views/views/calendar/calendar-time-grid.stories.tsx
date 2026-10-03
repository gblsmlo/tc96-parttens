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

// 14:00–16:00 em São Paulo (17:00Z–19:00Z): topo 58.33% e altura 8.33% do dia.
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
          'Building Block de calendário nos modos semana e dia: eixo de horas, faixa de dia inteiro, blocos posicionados por hora com altura proporcional à duração, sobreposição em lanes e linha do instante corrente.',
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

    // O wrapper posicionado é o pai imediato do draggable.
    const positioned = block.parentElement as HTMLElement
    const columnRect = column.getBoundingClientRect()
    const blockRect = positioned.getBoundingClientRect()
    const topPct = ((blockRect.top - columnRect.top) / columnRect.height) * 100
    const heightPct = (blockRect.height / columnRect.height) * 100

    // 14:00 → 58.33% do dia; 2h → 8.33% do dia.
    await expect(Math.abs(topPct - 58.33)).toBeLessThan(0.5)
    await expect(Math.abs(heightPct - 8.33)).toBeLessThan(0.5)

    // A linha "agora" existe só na coluna de hoje.
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

    // Sobrepostos dividem a coluna lado a lado, metade para cada lane.
    await expect(Math.abs(firstRect.width - columnWidth / 2)).toBeLessThan(2)
    await expect(Math.abs(secondRect.width - columnWidth / 2)).toBeLessThan(2)
    await expect(secondRect.left).toBeGreaterThan(firstRect.left)
  },
  render: () => <Example itemsOverride={overlapTasks} />,
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

    // O item de dia inteiro não vira bloco na coluna de horas.
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
