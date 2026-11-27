import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn, screen, userEvent, within } from 'storybook/test'
import {
  expectCardMove,
  expectCardPriorityChange,
  expectColumnsSectionLabel,
  expectEveryTasksLayout,
  expectRowPriorityChange,
  type TasksStoryCallbacks,
} from '../tasks-story.ts'
import {
  type Tasks1Controls,
  tasks1ControlArgs,
  tasks1ControlArgTypes,
} from './tasks-1-controls.ts'
import { ComposedTasks1 } from './tasks-1-layouts.tsx'

const meta = {
  args: tasks1ControlArgs,
  argTypes: tasks1ControlArgTypes,
  decorators: [
    (Story) => (
      <div className="h-[calc(100dvh-2rem)]">
        <Story />
      </div>
    ),
  ],
  parameters: { layout: 'padded' },
  render: (args) => <ComposedTasks1 {...args} />,
  tags: ['!autodocs'],
  title: 'Blocks/Data/Tasks/Tasks1',
} satisfies Meta<Tasks1Controls>

export default meta

type Story = StoryObj<Tasks1Controls>

type CallbackStory = StoryObj<Tasks1Controls & TasksStoryCallbacks>

export const Tasks1: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const [trigger] = await canvas.findAllByRole('button', {
      name: /Alterar status/,
    })
    await userEvent.click(trigger)
    await userEvent.click(
      await screen.findByRole('menuitemradio', { name: 'Concluída' }),
    )
    await expect(
      (await canvas.findAllByRole('button', { name: /Alterar status/ }))[0],
    ).toHaveAccessibleName('Status: Concluída. Alterar status')
  },
}

export const OnlyChosenSorts: Story = {
  args: { sorts: ['due', 'title'] },
  tags: ['!dev'],
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(
      await canvas.findByRole('button', { name: 'Visualização' }),
    )
    await userEvent.click(
      await screen.findByRole('menuitem', { name: /Ordenar por/ }),
    )
    await expect(
      await screen.findByRole('menuitemradio', { name: 'Prazo' }),
    ).toBeVisible()
    await expect(
      screen.getByRole('menuitemradio', { name: 'Título' }),
    ).toBeVisible()
    for (const name of ['Prioridade', 'Projeto', 'Atualização'])
      await expect(
        screen.queryByRole('menuitemradio', { name }),
      ).not.toBeInTheDocument()
  },
}

export const EveryLayout: Story = {
  tags: ['!dev'],
  play: async ({ canvasElement }) => {
    await expectEveryTasksLayout(canvasElement)
  },
}

export const ColumnsSectionLabel: Story = {
  tags: ['!dev'],
  play: async ({ canvasElement }) => {
    await expectColumnsSectionLabel(canvasElement)
  },
}

export const PriorityInRow: CallbackStory = {
  args: { mode: 'list', onPriorityChange: fn() },
  tags: ['!dev'],
  play: async ({ args, canvasElement }) => {
    await expectRowPriorityChange(canvasElement, args.onPriorityChange)
  },
}

export const PriorityInCard: CallbackStory = {
  args: { mode: 'kanban', onPriorityChange: fn() },
  tags: ['!dev'],
  play: async ({ args, canvasElement }) => {
    await expectCardPriorityChange(canvasElement, args.onPriorityChange)
  },
}

export const MoveCardByStatus: CallbackStory = {
  args: { groupBy: 'status', mode: 'kanban', onStatusChange: fn() },
  tags: ['!dev'],
  play: async ({ args, canvasElement }) => {
    await expectCardMove(canvasElement, {
      from: 'A fazer',
      onChange: args.onStatusChange,
      to: 'Em andamento',
      value: 'in-progress',
    })
  },
}

export const MoveCardByPriority: CallbackStory = {
  args: { groupBy: 'priority', mode: 'kanban', onPriorityChange: fn() },
  tags: ['!dev'],
  play: async ({ args, canvasElement }) => {
    await expectCardMove(canvasElement, {
      from: 'Urgente',
      onChange: args.onPriorityChange,
      to: 'Alta',
      value: 'high',
    })
  },
}
