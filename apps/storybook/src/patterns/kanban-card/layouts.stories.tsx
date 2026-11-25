import type { Meta, StoryObj } from '@storybook/react-vite'
import { KanbanCardCanvas } from './kanban-card-canvas.tsx'
import { kanbanCardControlArgs } from './kanban-card-controls.ts'
import { ComposedKanbanCard } from './kanban-card-layouts.tsx'

const meta = {
  decorators: [KanbanCardCanvas],
  tags: ['!autodocs'],
  title: 'Patterns/KanbanCard/Layouts',
} satisfies Meta

export default meta

type Story = StoryObj<typeof meta>

export const TitleOnly: Story = {
  render: () => (
    <ComposedKanbanCard
      {...kanbanCardControlArgs}
      description={false}
      fields={false}
      footer={false}
      menu={false}
    />
  ),
}

export const WithoutBody: Story = {
  render: () => (
    <ComposedKanbanCard {...kanbanCardControlArgs} fields={false} />
  ),
}

export const WithoutFooter: Story = {
  render: () => (
    <ComposedKanbanCard {...kanbanCardControlArgs} footer={false} />
  ),
}

export const WithoutOpenTrigger: Story = {
  render: () => (
    <ComposedKanbanCard {...kanbanCardControlArgs} openTrigger={false} />
  ),
}
