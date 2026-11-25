import type { Meta, StoryObj } from '@storybook/react-vite'
import { KanbanCardCanvas } from './kanban-card-canvas.tsx'
import {
  type KanbanCardControls,
  kanbanCardControlArgs,
  kanbanCardControlArgTypes,
} from './kanban-card-controls.ts'
import { ComposedKanbanCard } from './kanban-card-layouts.tsx'

const meta = {
  args: kanbanCardControlArgs,
  argTypes: kanbanCardControlArgTypes,
  decorators: [KanbanCardCanvas],
  parameters: {
    controls: { exclude: ['dimmed', 'display', 'loading', 'selected'] },
  },
  render: (args) => <ComposedKanbanCard {...args} />,
  tags: ['!autodocs'],
  title: 'Patterns/KanbanCard/Variants',
} satisfies Meta<KanbanCardControls>

export default meta

type Story = StoryObj<KanbanCardControls>

export const Default: Story = {}

export const Compact: Story = {
  args: { display: 'compact' },
}

export const Loading: Story = {
  args: { loading: true },
}

export const Selected: Story = {
  args: { selected: true },
}

export const Dimmed: Story = {
  args: { dimmed: true },
}
