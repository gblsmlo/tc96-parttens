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
  render: (args) => <ComposedKanban {...args} />,
  tags: ['!autodocs'],
  title: 'Patterns/Collection/Layouts/Kanban/Playground',
} satisfies Meta<KanbanControls>

export default meta

type Story = StoryObj<KanbanControls>

export const Playground: Story = {}
