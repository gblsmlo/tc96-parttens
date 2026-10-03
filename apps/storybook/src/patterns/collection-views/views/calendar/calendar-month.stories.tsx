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

const overflowTasks: Task[] = initialTasks.slice(0, 5).map((task, index) => ({
  ...task,
  end: null,
  id: `overflow-${index}`,
  isAllDay: false,
  start: `2026-10-18T1${index}:00:00.000Z`,
}))

const calendarArgs = {
  ...createTaskCalendarProps(() => undefined),
  collection: createCollection(initialTasks),
  mode: 'month' as const,
}

const TasksCalendarView = CalendarView as (
  props: CalendarViewProps<Task>,
) => ReactElement

function Example({
  itemsOverride,
  loading = false,
  maxVisibleMonthItems,
  withReschedule = true,
}: Readonly<{
  itemsOverride?: Task[]
  loading?: boolean
  maxVisibleMonthItems?: number
  withReschedule?: boolean
}>) {
  const { tasks, updateTask } = useTasks(itemsOverride)

  return (
    <div className="min-w-0 p-4">
      <CalendarView
        {...createTaskCalendarProps(updateTask)}
        collection={createCollection(tasks)}
        loading={loading}
        mode="month"
        onItemReschedule={
          withReschedule && !loading
            ? createTaskCalendarProps(updateTask).onItemReschedule
            : undefined
        }
        onSelectDay={() => undefined}
        {...(maxVisibleMonthItems === undefined
          ? {}
          : { maxVisibleMonthItems })}
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
          'Building Block de calendário no modo mês. Documenta bucketização por dia no fuso da view, chips por tom, overflow "+N", loading e arraste entre dias sem vocabulário de domínio.',
      },
    },
    layout: 'fullscreen',
  },
  title: 'Patterns/CollectionViews/Views/Calendar/Month',
} satisfies Meta<typeof TasksCalendarView>

export default meta

type Story = StoryObj<typeof meta>

export const Month: Story = {
  args: calendarArgs,
  play: async ({ canvasElement }) => {
    // 17:00Z é 14:00 em São Paulo: o chip pertence ao dia 14 no fuso da view.
    const cell = canvasElement.querySelector(
      '[data-calendar-date="2026-10-14"]',
    )
    await expect(
      cell?.querySelector('[data-calendar-item-id="TSK-101"]'),
    ).not.toBeNull()

    const today = canvasElement.querySelector(
      '[data-calendar-date="2026-10-14"]',
    )
    await expect(today?.hasAttribute('data-today')).toBe(true)
  },
  render: () => <Example />,
}

export const WithTones: Story = {
  args: calendarArgs,
  parameters: {
    docs: {
      description: {
        story:
          'O tom é vocabulário visual neutro: o consumer mapeia o status e a prioridade da tarefa para `tone`, e concluído ganha distinção sem sumir.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    await expect(
      canvasElement.querySelector('[data-tone="success"]'),
    ).not.toBeNull()
    const completed = canvasElement.querySelector<HTMLElement>(
      '[data-completed] [data-slot="calendar-event-chip-title"]',
    )
    await expect(completed).not.toBeNull()
    await expect(
      getComputedStyle(completed as HTMLElement).textDecorationLine,
    ).toBe('line-through')
  },
  render: () => <Example />,
}

export const Overflow: Story = {
  args: calendarArgs,
  play: async ({ canvasElement }) => {
    const cell = canvasElement.querySelector(
      '[data-calendar-date="2026-10-18"]',
    )
    await expect(
      cell?.querySelectorAll('[data-calendar-item-id]'),
    ).toHaveLength(3)

    const overflow = Array.from(cell?.querySelectorAll('button') ?? []).find(
      (button) => button.textContent === '+2',
    )
    await expect(overflow).toBeDefined()
  },
  render: () => (
    <Example itemsOverride={overflowTasks} maxVisibleMonthItems={3} />
  ),
}

export const Loading: Story = {
  args: calendarArgs,
  render: () => <Example loading />,
}

export const DndDisabled: Story = {
  args: calendarArgs,
  parameters: {
    docs: {
      description: {
        story:
          'Sem `onItemReschedule`, nenhum chip é arrastável e o cursor segue normal.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    await expect(
      canvasElement.querySelector('[data-calendar-item-draggable]'),
    ).toBeNull()
  },
  render: () => <Example withReschedule={false} />,
}
