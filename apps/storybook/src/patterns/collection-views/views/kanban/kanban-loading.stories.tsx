import type { Meta, StoryObj } from '@storybook/react-vite'
import { KanbanView } from '@tc96/parttens'

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
      { cards: [], color: '#6b7280', count: 0, id: 'todo', title: 'To do' },
      {
        cards: [],
        color: '#3b82f6',
        count: 0,
        id: 'in-progress',
        title: 'In progress',
      },
      { cards: [], color: '#22c55e', count: 0, id: 'done', title: 'Done' },
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
