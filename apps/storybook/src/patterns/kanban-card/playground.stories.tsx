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
  render: (args) => <ComposedKanbanCard {...args} />,
  tags: ['!autodocs'],
  title: 'Patterns/KanbanCard/Playground',
} satisfies Meta<KanbanCardControls>

export default meta

type Story = StoryObj<KanbanCardControls>

export const Playground: Story = {}
