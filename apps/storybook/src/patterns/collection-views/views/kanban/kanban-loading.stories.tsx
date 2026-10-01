import type { Meta, StoryObj } from '@storybook/react-vite'
import { KanbanView } from 'tc96/blocks'

const meta = {
  component: KanbanView,
  parameters: { layout: 'fullscreen' },
  tags: ['!autodocs'],
  title: 'Patterns/CollectionViews/Views/Kanban/Loading/Board',
} satisfies Meta<typeof KanbanView>

export default meta
type Story = StoryObj<typeof meta>

export const Board: Story = {
  args: {
    columns: [
      { cards: [], count: 0, id: 'todo', title: 'To do' },
      { cards: [], count: 0, id: 'in-progress', title: 'In progress' },
      { cards: [], count: 0, id: 'done', title: 'Done' },
    ],
    getKey: () => '',
    loading: true,
    loadingCardLabel: 'Carregando card',
    renderCard: () => null,
  },
  render: (args) => (
    <div className="h-144 min-w-0 p-4">
      <KanbanView {...args} />
    </div>
  ),
}
