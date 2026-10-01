import type { Meta, StoryObj } from '@storybook/react-vite'
import { type KanbanColumnData, KanbanView } from '@tc96/parttens'
import { expect, userEvent, waitFor, within } from 'storybook/test'
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

const nextFrame = () =>
  new Promise((resolve) => requestAnimationFrame(() => resolve(undefined)))

function center(element: Element) {
  const { height, left, top, width } = element.getBoundingClientRect()
  return { clientX: left + width / 2, clientY: top + height / 2 }
}

// O dnd-kit ouve o ponteiro no documento depois do pointerdown; os passos
// intermediarios deixam a colisao achar o card de destino.
async function dragWithPointer(from: Element, to: Element) {
  const pointer = {
    bubbles: true,
    button: 0,
    buttons: 1,
    cancelable: true,
    composed: true,
    isPrimary: true,
    pointerId: 1,
    pointerType: 'mouse',
  }
  const start = center(from)
  const end = center(to)
  const steps = 12

  from.dispatchEvent(new PointerEvent('pointerdown', { ...pointer, ...start }))
  for (let step = 1; step <= steps; step += 1) {
    document.dispatchEvent(
      new PointerEvent('pointermove', {
        ...pointer,
        clientX: start.clientX + ((end.clientX - start.clientX) * step) / steps,
        clientY: start.clientY + ((end.clientY - start.clientY) * step) / steps,
      }),
    )
    await nextFrame()
    await nextFrame()
  }
  document.dispatchEvent(
    new PointerEvent('pointerup', { ...pointer, buttons: 0, ...end }),
  )
}

// O DragOverlay fica montado; so tem conteudo durante o arraste.
const dragOverlay = () => document.querySelector('[data-dnd-overlay]')

function cardHandles(canvasElement: HTMLElement, column: string) {
  return within(
    within(canvasElement).getByRole('region', { name: column }),
  ).queryAllByRole('button', { name: /^Mover card / })
}

async function expectColumnCards(
  canvasElement: HTMLElement,
  column: string,
  cards: string[],
) {
  await waitFor(() =>
    expect(
      cardHandles(canvasElement, column).map((handle) =>
        handle.getAttribute('aria-label'),
      ),
    ).toEqual(cards.map((card) => `Mover card ${card}`)),
  )
}

export const MoveWithKeyboard: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Pela alça: Space pega o card, a seta leva à coluna vizinha e Space solta.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const handle = within(canvasElement).getByRole('button', {
      name: 'Mover card First item',
    })

    handle.focus()
    await userEvent.keyboard('[Space]')
    await waitFor(() => expect(dragOverlay()).not.toBeEmptyDOMElement())
    await userEvent.keyboard('[ArrowRight]')
    await expectColumnCards(canvasElement, 'In progress', [
      'First item',
      'In work',
    ])
    await userEvent.keyboard('[Space]')
    await waitFor(() => expect(dragOverlay()).toBeEmptyDOMElement())
    await expectColumnCards(canvasElement, 'To do', ['Second item'])
    await expectColumnCards(canvasElement, 'In progress', [
      'First item',
      'In work',
    ])
  },
  render: () => <Example />,
}

export const MoveWithPointer: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'O ponteiro pega o card inteiro e o solta sobre um card de outra coluna.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    // A coluna do layout mobile tambem renderiza os cards, escondida.
    await dragWithPointer(
      within(canvas.getByRole('region', { name: 'To do' })).getByText(
        'A card without an assigned priority.',
      ),
      within(canvas.getByRole('region', { name: 'In progress' })).getByText(
        'An item currently being worked on.',
      ),
    )
    await waitFor(() => expect(dragOverlay()).toBeEmptyDOMElement())
    await expectColumnCards(canvasElement, 'To do', ['Second item'])
    await expect(
      cardHandles(canvasElement, 'In progress').map((handle) =>
        handle.getAttribute('aria-label'),
      ),
    ).toContain('Mover card First item')
  },
  render: () => <Example />,
}
