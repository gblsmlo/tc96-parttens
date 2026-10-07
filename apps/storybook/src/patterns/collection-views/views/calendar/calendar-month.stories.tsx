import type { Meta, StoryObj } from '@storybook/react-vite'
import { CalendarView, type CalendarViewProps } from '@tc96/parttens'
import type { ReactElement } from 'react'
import { expect, screen, userEvent, within } from 'storybook/test'
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
          'Month-mode calendar building block. Documents per-day bucketing in the view time zone, tone chips, the "+N" overflow, loading and dragging between days.',
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
          'Tone is a neutral visual vocabulary: the consumer maps task status and priority to `tone`, and a completed item is distinguished without disappearing.',
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
  parameters: {
    docs: {
      description: {
        story:
          'The 18th holds five tasks and the cell shows three. The "+2" opens a popover named after the day that lists the two hidden tasks, which keep their open trigger and drag handle.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const cell = canvasElement.querySelector<HTMLElement>(
      '[data-calendar-date="2026-10-18"]',
    )
    await expect(
      cell?.querySelectorAll('[data-calendar-item-id]'),
    ).toHaveLength(3)

    const overflow = within(cell as HTMLElement).getByRole('button', {
      name: /^Mostrar mais 2 itens de domingo/,
    })
    await expect(overflow).toHaveTextContent('+2')
    await userEvent.click(overflow)

    const popover = await screen.findByRole('dialog', { name: /^domingo/ })
    await expect(
      Array.from(popover.querySelectorAll('[data-calendar-item-id]')).map(
        (item) => item.getAttribute('data-calendar-item-id'),
      ),
    ).toEqual(['overflow-3', 'overflow-4'])
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
          'Without `onItemReschedule`, no chip is draggable and the cursor stays normal.',
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
