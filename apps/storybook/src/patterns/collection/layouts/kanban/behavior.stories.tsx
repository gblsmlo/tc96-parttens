import type { Meta, StoryObj } from '@storybook/react-vite'
import type { KanbanCardMove } from '@tc96/parttens'
import { expect, fn, userEvent, waitFor, within } from 'storybook/test'
import { type Deal, initialDeals } from '../../fixtures/deals'
import { initialTasks } from '../../fixtures/tasks'
import { KanbanCanvas } from './kanban-canvas.tsx'
import { kanbanControlArgs } from './kanban-controls.ts'
import { LOAD_DELAY, type SampleCard } from './kanban-data.ts'
import {
  ComposedKanban,
  DealColumn,
  LoadingSampleBoard,
  TaskBoard,
} from './kanban-layouts.tsx'

interface KanbanBehaviorArgs {
  onAddCard: (columnId: string) => void
  onMoveCard: (move: KanbanCardMove<SampleCard>) => boolean
  onOpen: () => void
}

const meta = {
  args: {
    onAddCard: fn(),
    onMoveCard: fn(() => true),
    onOpen: fn(),
  },
  decorators: [KanbanCanvas],
  render: ({ onOpen }) => <DealColumn onOpen={onOpen} />,
  tags: ['!autodocs'],
  title: 'Patterns/Collection/Layouts/Kanban/Behavior',
} satisfies Meta<KanbanBehaviorArgs>

export default meta

type Story = StoryObj<KanbanBehaviorArgs>

const deal = initialDeals[0] as Deal

const boardIn = (canvasElement: HTMLElement) => {
  const board = canvasElement.querySelector<HTMLElement>(
    '[data-slot="kanban-view"]',
  )
  if (!board) throw new Error('The story did not render the board.')
  return board
}

const firstVisible = (root: ParentNode, selector: string) =>
  [...root.querySelectorAll<HTMLElement>(selector)].find(
    (element) => element.getBoundingClientRect().width > 0,
  )

const column = (canvasElement: HTMLElement, name: string) =>
  within(within(canvasElement).getByRole('region', { name }))

const dragOverlay = () => document.querySelector('[data-dnd-overlay]')

const tabToTheFirstHandle = async (canvasElement: HTMLElement) => {
  const todo = column(canvasElement, 'A fazer')
  todo.getByRole('button', { name: 'Adicionar item à seção A fazer' }).focus()
  await userEvent.tab()
  await expect(
    todo.getByRole('button', { name: 'Mover card Primeiro card' }),
  ).toHaveFocus()
}

export const LoadingKeepsCardHeight: Story = {
  render: () => <LoadingSampleBoard loadingFor={LOAD_DELAY} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const board = boardIn(canvasElement)

    await expect(board).toHaveAttribute('aria-busy', 'true')
    await expect(
      canvas.queryByText(kanbanControlArgs.emptyColumnLabel),
    ).toBeNull()
    await expect(
      canvas.queryByRole('button', { name: /^Adicionar item/ }),
    ).toBeNull()
    const skeletonHeight = firstVisible(
      board,
      '[data-pattern="kanban-card"]',
    )?.getBoundingClientRect().height

    await column(canvasElement, 'A fazer').findByText(
      'Primeiro card',
      undefined,
      { timeout: LOAD_DELAY * 2 },
    )
    await expect(board).not.toHaveAttribute('aria-busy')
    await expect(skeletonHeight).toBeGreaterThan(0)
    await expect(
      firstVisible(
        board,
        '[data-pattern="kanban-card"]',
      )?.getBoundingClientRect().height,
    ).toBe(skeletonHeight)
  },
}

export const SkeletonFollowsAnatomy: Story = {
  render: ({ onOpen }) => (
    <DealColumn loadingFor={LOAD_DELAY} onOpen={onOpen} />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const skeleton = canvas.getByRole('status', { name: 'Carregando negócio' })

    await expect(skeleton).toHaveAttribute('aria-busy', 'true')
    await expect(skeleton).toHaveAttribute('data-fields', '3')
    await expect(skeleton).toHaveAttribute('data-counts', '3')
    await expect(skeleton).toHaveAttribute('data-description-lines', '1')
    const skeletonHeight = firstVisible(
      canvasElement,
      '[data-pattern="kanban-card"]',
    )?.getBoundingClientRect().height

    const card = await canvas.findByRole('article', undefined, {
      timeout: LOAD_DELAY * 2,
    })
    await expect(card.getBoundingClientRect().height).toBe(skeletonHeight)
  },
}

export const ColumnIsNamedByItsTitle: Story = {
  render: () => <TaskBoard />,
  play: async ({ canvasElement }) => {
    const backlog = within(canvasElement).getByRole('region', {
      name: 'Backlog',
    })

    await expect(
      within(backlog).getByRole('heading', { level: 2, name: 'Backlog' }),
    ).toBeVisible()
    await expect(within(backlog).getAllByRole('article')).toHaveLength(
      initialTasks.filter((task) => task.status === 'backlog').length,
    )
  },
}

export const AddActionReportsTheColumn: Story = {
  render: ({ onAddCard }) => <TaskBoard onAddCard={onAddCard} />,
  play: async ({ args, canvasElement }) => {
    await userEvent.click(
      column(canvasElement, 'Backlog').getByRole('button', {
        name: 'Adicionar item à seção Backlog',
      }),
    )

    await expect(args.onAddCard).toHaveBeenCalledOnce()
    await expect(args.onAddCard).toHaveBeenLastCalledWith('backlog')
  },
}

export const CardIsAnArticle: Story = {
  play: async ({ canvasElement }) => {
    const card = within(canvasElement).getByRole('article')

    await expect(card).toHaveAttribute('data-slot', 'card')
    await expect(card).toHaveAttribute('data-variant', 'interactive')
    await expect(canvasElement.querySelector('button button')).toBeNull()
  },
}

export const OpenTriggerOpensTheCard: Story = {
  play: async ({ args, canvasElement }) => {
    const trigger = within(canvasElement).getByRole('button', {
      name: `Abrir negócio ${deal.company}`,
    })

    await userEvent.click(trigger)
    await expect(args.onOpen).toHaveBeenCalledOnce()

    trigger.focus()
    await userEvent.keyboard('{Enter}')
    await expect(args.onOpen).toHaveBeenCalledTimes(2)
  },
}

export const InteractiveFieldKeepsItsClick: Story = {
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    const body = within(canvasElement.ownerDocument.body)

    await userEvent.click(canvas.getByRole('combobox', { name: /^Etapa/ }))
    await userEvent.click(await body.findByRole('option', { name: 'Ganho' }))

    await expect(
      canvas.getByRole('combobox', { name: /^Etapa/ }),
    ).toHaveTextContent('Ganho')
    await waitFor(() => expect(body.queryByRole('listbox')).toBeNull())
    await expect(args.onOpen).not.toHaveBeenCalled()
  },
}

export const ControlsKeepTheirClick: Story = {
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    const body = within(canvasElement.ownerDocument.body)

    await userEvent.click(
      canvas.getByRole('button', { name: 'Mais ações do negócio' }),
    )
    await expect(
      await body.findByRole('menuitem', { name: 'Editar negócio' }),
    ).toBeVisible()
    await userEvent.keyboard('{Escape}')
    await waitFor(() => expect(body.queryByRole('menu')).toBeNull())

    await userEvent.click(canvas.getByRole('button', { name: 'Notas: 1' }))
    await expect(
      await body.findByRole('menuitem', { name: 'Criar nota' }),
    ).toBeVisible()
    await userEvent.keyboard('{Escape}')
    await waitFor(() => expect(body.queryByRole('menu')).toBeNull())

    await expect(args.onOpen).not.toHaveBeenCalled()
  },
}

export const CompactHidesDescriptionBodyAndFooter: Story = {
  render: () => <ComposedKanban {...kanbanControlArgs} display="compact" />,
  play: async ({ canvasElement }) => {
    const [card] = column(canvasElement, 'A fazer').getAllByRole('article')
    if (!card) throw new Error('The first column did not render a card.')

    await expect(card).toHaveAttribute('data-display', 'compact')
    await expect(within(card).getByText('Primeiro card')).toBeVisible()
    await expect(
      within(card).getByText('Descrição curta do card.'),
    ).not.toBeVisible()
    await expect(within(card).getByText('Valor')).not.toBeVisible()
    await expect(
      within(card).queryByRole('button', { name: /^Notas de/ }),
    ).toBeNull()
  },
}

export const CollapsedColumnHidesItsCards: Story = {
  render: () => <ComposedKanban {...kanbanControlArgs} collapsed />,
  play: async ({ canvasElement }) => {
    const todo = within(canvasElement).getByRole('region', { name: 'A fazer' })

    await expect(todo).toHaveAttribute('data-collapsed', 'true')
    await expect(within(todo).queryAllByRole('article')).toHaveLength(0)
    await expect(
      within(todo).queryByRole('button', { name: /^Adicionar item/ }),
    ).toBeNull()
    await expect(
      column(canvasElement, 'Em andamento').getAllByRole('article'),
    ).toHaveLength(1)
  },
}

export const EmptyColumnShowsItsLabel: Story = {
  render: () => <ComposedKanban {...kanbanControlArgs} />,
  play: async ({ canvasElement }) => {
    const done = column(canvasElement, 'Concluído')

    await expect(
      done.getByText(kanbanControlArgs.emptyColumnLabel),
    ).toBeVisible()
    await expect(done.queryAllByRole('article')).toHaveLength(0)
    await expect(
      column(canvasElement, 'A fazer').queryByText(
        kanbanControlArgs.emptyColumnLabel,
      ),
    ).toBeNull()
  },
}

export const TabReachesTheHandleAndTheOpenTrigger: Story = {
  render: () => <ComposedKanban {...kanbanControlArgs} />,
  play: async ({ canvasElement }) => {
    const todo = column(canvasElement, 'A fazer')

    await tabToTheFirstHandle(canvasElement)
    await userEvent.tab()
    await expect(
      todo.getByRole('button', { name: 'Abrir Primeiro card' }),
    ).toHaveFocus()
  },
}

export const HiddenColumnIsLeftOut: Story = {
  render: () => <ComposedKanban {...kanbanControlArgs} hidden />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    await expect(canvas.getAllByRole('region')).toHaveLength(2)
    await expect(canvas.queryByRole('region', { name: 'Concluído' })).toBeNull()
  },
}

export const KeyboardMoveReportsTheColumns: Story = {
  render: ({ onMoveCard }) => (
    <ComposedKanban {...kanbanControlArgs} onMoveCard={onMoveCard} />
  ),
  play: async ({ args, canvasElement }) => {
    await tabToTheFirstHandle(canvasElement)
    await userEvent.keyboard('[Space]')
    await waitFor(() => expect(dragOverlay()).not.toBeEmptyDOMElement())
    await userEvent.keyboard('[ArrowRight]')
    await userEvent.keyboard('[Space]')
    await waitFor(() => expect(dragOverlay()).toBeEmptyDOMElement())

    await expect(args.onMoveCard).toHaveBeenCalledOnce()
    await expect(args.onMoveCard).toHaveBeenLastCalledWith(
      expect.objectContaining({
        card: { id: 'card-1', title: 'Primeiro card' },
        sourceColumnId: 'todo',
        targetColumnId: 'doing',
      }),
    )
    await waitFor(() =>
      expect(
        column(canvasElement, 'Em andamento').getByText('Primeiro card'),
      ).toBeVisible(),
    )
  },
}

export const RejectedMoveRollsBack: Story = {
  args: { onMoveCard: fn(() => false) },
  render: ({ onMoveCard }) => (
    <ComposedKanban {...kanbanControlArgs} onMoveCard={onMoveCard} />
  ),
  play: async ({ args, canvasElement }) => {
    await tabToTheFirstHandle(canvasElement)
    await userEvent.keyboard('[Space]')
    await waitFor(() => expect(dragOverlay()).not.toBeEmptyDOMElement())
    await userEvent.keyboard('[ArrowRight]')
    await userEvent.keyboard('[Space]')
    await waitFor(() => expect(dragOverlay()).toBeEmptyDOMElement())

    await expect(args.onMoveCard).toHaveBeenCalledOnce()
    await waitFor(() =>
      expect(
        column(canvasElement, 'A fazer').getByText('Primeiro card'),
      ).toBeVisible(),
    )
    await expect(
      column(canvasElement, 'Em andamento').queryByText('Primeiro card'),
    ).toBeNull()
  },
}

export const MobileShowsOneColumn: Story = {
  globals: { viewport: { isRotated: false, value: 'mobile2' } },
  render: () => <ComposedKanban {...kanbanControlArgs} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    await expect(canvas.getAllByRole('region')).toHaveLength(1)
    await expect(canvas.getByRole('region', { name: 'A fazer' })).toBeVisible()
    await expect(
      canvas.getByRole('button', { name: 'A fazer · 2' }),
    ).toHaveAttribute('aria-pressed', 'true')
    await expect(
      canvas.queryByRole('button', { name: /^Mover card/ }),
    ).toBeNull()

    await userEvent.click(
      canvas.getByRole('button', { name: 'Em andamento · 1' }),
    )

    await expect(
      await canvas.findByRole('region', { name: 'Em andamento' }),
    ).toBeVisible()
    await expect(canvas.getAllByRole('region')).toHaveLength(1)
  },
}
