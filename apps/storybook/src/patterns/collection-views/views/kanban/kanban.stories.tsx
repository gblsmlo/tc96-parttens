import type { Meta, StoryObj } from '@storybook/react-vite'
import { type KanbanColumnData, KanbanView } from 'tc96/blocks'
import { TodoKanbanCard } from './kanban-card-example'

interface MechanicsCard {
  description: string
  id: string
  priority: string | null
  taskCount: number
  title: string
}

const columns: KanbanColumnData<MechanicsCard>[] = [
  {
    cards: [
      {
        description: 'A card without an assigned priority.',
        id: 'card-1',
        priority: null,
        taskCount: 3,
        title: 'First item',
      },
      {
        description: 'A second item in the same column.',
        id: 'card-2',
        priority: 'low',
        taskCount: 5,
        title: 'Second item',
      },
    ],
    count: 2,
    id: 'todo',
    title: 'To do',
  },
  {
    cards: [
      {
        description: 'An item currently being worked on.',
        id: 'card-3',
        priority: 'high',
        taskCount: 2,
        title: 'In work',
      },
    ],
    count: 1,
    id: 'in-progress',
    title: 'In progress',
  },
  { cards: [], count: 0, id: 'done', title: 'Done' },
]

const kanbanArgs = {
  columns,
  getCardLabel: (card: MechanicsCard) => card.title,
  getKey: (card: MechanicsCard) => card.id,
  renderCard: (card: MechanicsCard) => (
    <TodoKanbanCard
      description={card.description}
      initialPriority={card.priority}
      taskCount={card.taskCount}
      title={card.title}
      variant="interactive"
    />
  ),
}

function Example() {
  return (
    <div className="h-144 min-w-0 p-4">
      <KanbanView
        {...kanbanArgs}
        emptyColumnLabel="No items in this column."
        onMoveCard={() => true}
      />
    </div>
  )
}

const meta = {
  args: {
    description: columns[0].cards[0].description,
    initialPriority: columns[0].cards[0].priority,
    taskCount: columns[0].cards[0].taskCount,
    title: columns[0].cards[0].title,
  },
  component: TodoKanbanCard,
  parameters: {
    docs: {
      description: {
        component:
          'O mesmo card Todo compõe o exemplo isolado e os itens do board.',
      },
    },
    layout: 'fullscreen',
  },
  tags: ['!autodocs'],
  title: 'Patterns/CollectionViews/Views/Kanban/Usages/Todo',
} satisfies Meta<typeof TodoKanbanCard>

export default meta

type Story = StoryObj<typeof meta>

export const Card: Story = {
  parameters: { layout: 'centered' },
  render: (args) => (
    <div className="w-full max-w-sm p-4">
      <TodoKanbanCard {...args} />
    </div>
  ),
}

export const Board: Story = { render: () => <Example /> }
