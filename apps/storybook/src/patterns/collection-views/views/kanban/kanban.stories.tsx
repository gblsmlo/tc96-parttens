import type { Meta, StoryObj } from '@storybook/react-vite'
import type { ReactElement } from 'react'
import {
  KanbanCard,
  type KanbanColumnData,
  KanbanView,
  type KanbanViewProps,
} from 'tc96/blocks'
import { booleanArgType } from '../../../../test-utils/story-arg-types'
import { KanbanCardExampleContent } from './kanban-card-example'

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
    <KanbanCard variant="interactive">
      <KanbanCardExampleContent
        description={card.description}
        initialPriority={card.priority}
        taskCount={card.taskCount}
        title={card.title}
      />
    </KanbanCard>
  ),
}

const MechanicsKanbanView = KanbanView as (
  props: KanbanViewProps<MechanicsCard>,
) => ReactElement

function Example({ loading = false }: Readonly<{ loading?: boolean }>) {
  return (
    <div className="h-144 min-w-0 p-4">
      <KanbanView
        {...kanbanArgs}
        emptyColumnLabel="No items in this column."
        loading={loading}
        loadingCardLabel="Loading collection item"
        onMoveCard={loading ? undefined : () => true}
      />
    </div>
  )
}

const meta = {
  args: kanbanArgs,
  argTypes: { loading: booleanArgType },
  component: MechanicsKanbanView,
  parameters: {
    docs: {
      description: {
        component:
          'Building Block de Kanban. Documenta projeção de colunas, movimentação, loading e renderização de cards sem fixtures ou regras de Tasks e Pipeline.',
      },
    },
    layout: 'fullscreen',
  },
  tags: ['autodocs', 'storybook-test'],
  title: 'Patterns/CollectionViews/Views/Kanban',
} satisfies Meta<typeof MechanicsKanbanView>

export default meta

type Story = StoryObj<typeof meta>

export const Mechanics: Story = { args: kanbanArgs, render: () => <Example /> }
export const Loading: Story = {
  args: kanbanArgs,
  render: () => <Example loading />,
}
