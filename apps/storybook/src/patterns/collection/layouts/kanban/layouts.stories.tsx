import type { Meta, StoryObj } from '@storybook/react-vite'
import { KanbanCanvas } from './kanban-canvas.tsx'
import { kanbanControlArgs } from './kanban-controls.ts'
import { ComposedKanban } from './kanban-layouts.tsx'

const meta = {
  decorators: [KanbanCanvas],
  tags: ['!autodocs'],
  title: 'Patterns/Collection/Layouts/Kanban/Layouts',
} satisfies Meta

export default meta

type Story = StoryObj<typeof meta>

export const TitleOnlyCards: Story = {
  render: () => (
    <ComposedKanban
      {...kanbanControlArgs}
      description={false}
      fields={false}
      footer={false}
      menu={false}
    />
  ),
}

export const WithoutCardBody: Story = {
  render: () => <ComposedKanban {...kanbanControlArgs} fields={false} />,
}

export const WithoutCardFooter: Story = {
  render: () => <ComposedKanban {...kanbanControlArgs} footer={false} />,
}

export const WithoutOpenTrigger: Story = {
  render: () => <ComposedKanban {...kanbanControlArgs} openTrigger={false} />,
}

export const WithoutColumnColors: Story = {
  render: () => <ComposedKanban {...kanbanControlArgs} colors={false} />,
}

export const WithColumnSettings: Story = {
  render: () => <ComposedKanban {...kanbanControlArgs} settingsAction />,
}
