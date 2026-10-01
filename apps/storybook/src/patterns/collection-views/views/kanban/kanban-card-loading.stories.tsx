import type { Meta, StoryObj } from '@storybook/react-vite'
import { KanbanCardSkeleton } from '@tc96/parttens'

const meta = {
  component: KanbanCardSkeleton,
  tags: ['!autodocs'],
  title: 'Patterns/CollectionViews/Views/Kanban/Loading/Card',
} satisfies Meta<typeof KanbanCardSkeleton>

export default meta
type Story = StoryObj<typeof meta>

export const Skeleton: Story = {
  args: { label: 'Carregando card' },
  render: (args) => (
    <div className="w-full max-w-sm p-4">
      <KanbanCardSkeleton {...args} />
    </div>
  ),
}
