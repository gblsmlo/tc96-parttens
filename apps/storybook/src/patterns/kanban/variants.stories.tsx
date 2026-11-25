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
      exclude: ['collapsed', 'hidden', 'loading'],
    },
  },
  render: (args) => <ComposedKanban {...args} />,
  tags: ['!autodocs'],
  title: 'Patterns/Kanban/Variants',
} satisfies Meta<KanbanControls>

export default meta

type Story = StoryObj<KanbanControls>

export const Default: Story = {}

export const Loading: Story = {
  args: { loading: true },
}

export const HiddenColumn: Story = {
  args: { hidden: true },
}
