import type { Meta, StoryObj } from '@storybook/react-vite'
import { KanbanView } from '@tc96/parttens'
import { projectTaskColumns } from './kanban-tasks'

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
    columns: projectTaskColumns([]),
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
