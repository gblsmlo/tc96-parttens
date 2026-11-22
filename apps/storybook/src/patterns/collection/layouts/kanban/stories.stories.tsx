import type { Meta, StoryObj } from '@storybook/react-vite'
import { KanbanCanvas } from './kanban-canvas.tsx'
import {
  type KanbanControls,
  kanbanControlArgs,
  kanbanControlArgTypes,
} from './kanban-controls.ts'
import { ComposedKanban } from './kanban-layouts.tsx'

const meta = {
  args: kanbanControlArgs,
  argTypes: kanbanControlArgTypes,
  decorators: [KanbanCanvas],
  parameters: {
    controls: {
      exclude: [
        'collapsed',
        'dimmed',
        'display',
        'hidden',
        'loading',
        'selected',
      ],
    },
  },
  render: (args) => <ComposedKanban {...args} />,
  tags: ['!autodocs'],
  title: 'Patterns/Collection/Layouts/Kanban/Stories',
} satisfies Meta<KanbanControls>

export default meta

type Story = StoryObj<KanbanControls>

export const Default: Story = {}

export const Loading: Story = {
  args: { loading: true },
}

export const CollapsedColumn: Story = {
  args: { collapsed: true },
}

export const HiddenColumn: Story = {
  args: { hidden: true },
}

export const CompactCards: Story = {
  args: { display: 'compact' },
}

export const SelectedCard: Story = {
  args: { selected: true },
}

export const DimmedCard: Story = {
  args: { dimmed: true },
}
