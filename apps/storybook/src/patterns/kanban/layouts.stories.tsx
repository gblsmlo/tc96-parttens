import type { Meta, StoryObj } from '@storybook/react-vite'
import { KanbanCanvas } from './kanban-canvas.tsx'
import { kanbanControlArgs } from './kanban-controls.ts'
import { ComposedKanban } from './kanban-layouts.tsx'

const meta = {
  decorators: [KanbanCanvas],
  tags: ['!autodocs'],
  title: 'Patterns/Kanban/Layouts',
} satisfies Meta

export default meta

type Story = StoryObj<typeof meta>

export const WithColumnSettings: Story = {
  render: () => <ComposedKanban {...kanbanControlArgs} settingsAction />,
}

export const CollapsedColumn: Story = {
  render: () => <ComposedKanban {...kanbanControlArgs} collapsed />,
}
