import type { Meta, StoryObj } from '@storybook/react-vite'
import { KanbanView } from '@tc96/parttens'
import { expect, fn, userEvent, within } from 'storybook/test'

interface TaskCard {
  id: string
}

const getKey = (card: TaskCard) => card.id
const renderCard = (card: TaskCard) => <span>{card.id}</span>

const onAddCard = fn()
const onMoveCard = fn(() => true)

const meta = {
  parameters: { layout: 'fullscreen' },
  tags: ['!autodocs'],
  title: 'Patterns/Collection/Layouts/Kanban/View',
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

export const LoadingColumnSkeletons: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(
      canvasElement.querySelector('[data-slot="kanban-view"]'),
    ).toHaveAttribute('aria-busy', 'true')
    await expect(
      canvas.getAllByRole('status', {
        hidden: true,
        name: 'Carregando item da coleção',
      }),
    ).toHaveLength(3)
    await expect(canvas.queryByText('Nenhum item nesta coluna.')).toBeNull()
  },
  render: () => (
    <div className="h-128 min-w-0 p-4">
      <KanbanView<TaskCard>
        columns={[
          { cards: [], count: 0, id: 'todo', title: 'Todo' },
          { cards: [], count: 0, id: 'done', title: 'Done' },
        ]}
        getKey={getKey}
        loading
        loadingCardLabel="Carregando item da coleção"
        renderCard={renderCard}
      />
    </div>
  ),
}

export const ColumnTitleAndCards: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(
      canvas.getAllByRole('heading', { hidden: true, name: 'todo' }),
    ).toHaveLength(2)
    await expect(canvas.getAllByText('task-1')).toHaveLength(2)
  },
  render: () => (
    <div className="h-128 min-w-0 p-4">
      <KanbanView<TaskCard>
        columns={[
          {
            cards: [{ id: 'task-1' }],
            count: 1,
            id: 'todo',
            title: 'todo',
          },
        ]}
        getKey={getKey}
        renderCard={renderCard}
        renderColumnTitle={(column) => <span>{column.id}</span>}
      />
    </div>
  ),
}

export const ColumnColorTintsSurface: Story = {
  play: async ({ canvasElement }) => {
    const board = canvasElement.querySelector<HTMLElement>(
      '[data-kanban-board-scroll-area]',
    )
    if (!board) throw new Error('A story não renderizou o board.')

    const sections = Array.from(
      board.querySelectorAll<HTMLElement>('section[data-slot="kanban-column"]'),
    )
    const lost = sections.find(
      (section) => section.querySelector('h2')?.textContent === 'Lost',
    )
    const open = sections.find(
      (section) => section.querySelector('h2')?.textContent === 'Open',
    )
    if (!(lost && open)) throw new Error('A story não renderizou as colunas.')

    await expect(getComputedStyle(lost).backgroundColor).not.toBe(
      getComputedStyle(open).backgroundColor,
    )
    await expect(getComputedStyle(lost).borderTopColor).not.toBe(
      getComputedStyle(open).borderTopColor,
    )
  },
  render: () => (
    <div className="h-128 min-w-0 p-4">
      <KanbanView<TaskCard>
        columns={[
          { cards: [], color: '#ef4444', count: 0, id: 'lost', title: 'Lost' },
          { cards: [], count: 0, id: 'open', title: 'Open' },
        ]}
        getKey={getKey}
        renderCard={renderCard}
      />
    </div>
  ),
}

export const CollapsedAndHiddenColumns: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.queryByText('task-1')).toBeNull()
    await expect(canvas.queryByText('task-2')).toBeNull()
    await expect(
      canvas.getAllByRole('heading', { hidden: true, name: 'Todo' }),
    ).toHaveLength(2)
    await expect(
      canvas.queryByRole('heading', { hidden: true, name: 'Done' }),
    ).toBeNull()
  },
  render: () => (
    <div className="h-128 min-w-0 p-4">
      <KanbanView<TaskCard>
        columns={[
          {
            cards: [{ id: 'task-1' }],
            collapsed: true,
            count: 1,
            id: 'todo',
            title: 'Todo',
          },
          {
            cards: [{ id: 'task-2' }],
            count: 1,
            hidden: true,
            id: 'done',
            title: 'Done',
          },
        ]}
        getKey={getKey}
        renderCard={renderCard}
      />
    </div>
  ),
}

export const HeaderActionsAndAddCard: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    onAddCard.mockClear()
    await expect(
      canvas.getAllByRole('button', { hidden: true, name: 'More Todo' }),
    ).toHaveLength(2)
    await userEvent.click(
      canvas.getByRole('button', { name: 'Adicionar item à seção Todo' }),
    )
    await expect(onAddCard).toHaveBeenCalledWith('todo')
    await expect(
      canvas.queryByRole('button', {
        hidden: true,
        name: 'Adicionar card em Todo',
      }),
    ).toBeNull()
  },
  render: () => (
    <div className="h-128 min-w-0 p-4">
      <KanbanView<TaskCard>
        columns={[{ cards: [], count: 0, id: 'todo', title: 'Todo' }]}
        getColumnActions={() => ({ onAddCard })}
        getKey={getKey}
        renderCard={renderCard}
        renderHeaderActions={(column) => (
          <button type="button">More {column.title}</button>
        )}
      />
    </div>
  ),
}

export const DragHandlesOnBoardOnly: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const board = canvasElement.querySelector<HTMLElement>(
      '[data-kanban-board-scroll-area]',
    )
    if (!board) throw new Error('A story não renderizou o board.')

    await expect(
      within(board).getAllByRole('button', { name: /^Mover card/ }),
    ).toHaveLength(2)
    await expect(
      canvas.getAllByRole('button', { hidden: true, name: /^Mover card/ }),
    ).toHaveLength(2)
  },
  render: () => (
    <div className="h-128 min-w-0 p-4">
      <KanbanView<TaskCard>
        columns={[
          {
            cards: [{ id: 'task-1' }, { id: 'task-2' }],
            count: 2,
            id: 'todo',
            title: 'Todo',
          },
        ]}
        getKey={getKey}
        onMoveCard={onMoveCard}
        renderCard={renderCard}
      />
    </div>
  ),
}

export const MobileColumnOptions: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(
      canvas.getAllByRole('button', { hidden: true, name: / · / }),
    ).toHaveLength(2)
    await expect(
      canvas.getByRole('button', { hidden: true, name: 'Todo · 1' }),
    ).toHaveAttribute('aria-pressed', 'true')
    await expect(
      canvas.getByRole('button', { hidden: true, name: 'Done · 0' }),
    ).toHaveAttribute('aria-pressed', 'false')
  },
  render: () => (
    <div className="h-128 min-w-0 p-4">
      <KanbanView<TaskCard>
        columns={[
          {
            cards: [{ id: 'task-1' }],
            count: 1,
            id: 'todo',
            title: 'Todo',
          },
          { cards: [], count: 0, id: 'done', title: 'Done' },
        ]}
        getKey={getKey}
        renderCard={renderCard}
      />
    </div>
  ),
}
