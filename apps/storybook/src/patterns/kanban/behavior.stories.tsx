import type { Meta, StoryObj } from '@storybook/react-vite'
import type { KanbanCardMove } from '@tc96/ui/patterns'
import { expect, fn, screen, userEvent, waitFor, within } from 'storybook/test'
import { initialTasks } from '../collection/fixtures/tasks'
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
  onRecordAdd: (columnId: string) => void
  onCollapsedGroupIdsChange: (groupIds: readonly string[]) => void
  onColorChange: (columnId: string, color: string) => void
  onRecordMove: (move: KanbanCardMove<SampleCard>) => boolean
  onOpen: () => void
}

const meta = {
  args: {
    onRecordAdd: fn(),
    onCollapsedGroupIdsChange: fn(),
    onColorChange: fn(),
    onRecordMove: fn(() => true),
    onOpen: fn(),
  },
  decorators: [KanbanCanvas],
  render: ({ onOpen }) => <DealColumn onOpen={onOpen} />,
  tags: ['!autodocs'],
  title: 'Patterns/Kanban/Behavior',
} satisfies Meta<KanbanBehaviorArgs>

export default meta

type Story = StoryObj<KanbanBehaviorArgs>

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
      canvas.queryByText(kanbanControlArgs.emptyGroupLabel),
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
  render: ({ onRecordAdd }) => <TaskBoard onRecordAdd={onRecordAdd} />,
  play: async ({ args, canvasElement }) => {
    await userEvent.click(
      column(canvasElement, 'Backlog').getByRole('button', {
        name: 'Adicionar item à seção Backlog',
      }),
    )

    await expect(args.onRecordAdd).toHaveBeenCalledOnce()
    await expect(args.onRecordAdd).toHaveBeenLastCalledWith('backlog')
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
      done.getByText(kanbanControlArgs.emptyGroupLabel),
    ).toBeVisible()
    await expect(done.queryAllByRole('article')).toHaveLength(0)
    await expect(
      column(canvasElement, 'A fazer').queryByText(
        kanbanControlArgs.emptyGroupLabel,
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
  render: ({ onRecordMove }) => (
    <ComposedKanban {...kanbanControlArgs} onRecordMove={onRecordMove} />
  ),
  play: async ({ args, canvasElement }) => {
    await tabToTheFirstHandle(canvasElement)
    await userEvent.keyboard('[Space]')
    await waitFor(() => expect(dragOverlay()).not.toBeEmptyDOMElement())
    await userEvent.keyboard('[ArrowRight]')
    await userEvent.keyboard('[Space]')
    await waitFor(() => expect(dragOverlay()).toBeEmptyDOMElement())

    await expect(args.onRecordMove).toHaveBeenCalledOnce()
    await expect(args.onRecordMove).toHaveBeenLastCalledWith(
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
  args: { onRecordMove: fn(() => false) },
  render: ({ onRecordMove }) => (
    <ComposedKanban {...kanbanControlArgs} onRecordMove={onRecordMove} />
  ),
  play: async ({ args, canvasElement }) => {
    await tabToTheFirstHandle(canvasElement)
    await userEvent.keyboard('[Space]')
    await waitFor(() => expect(dragOverlay()).not.toBeEmptyDOMElement())
    await userEvent.keyboard('[ArrowRight]')
    await userEvent.keyboard('[Space]')
    await waitFor(() => expect(dragOverlay()).toBeEmptyDOMElement())

    await expect(args.onRecordMove).toHaveBeenCalledOnce()
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

const openColumnSettings = async (canvasElement: HTMLElement) => {
  await userEvent.click(
    column(canvasElement, 'A fazer').getByRole('button', {
      name: 'Configurar seção A fazer',
    }),
  )
  return within(
    await screen.findByRole('dialog', { name: 'Configurar seção A fazer' }),
  )
}

const closeColumnSettings = async () => {
  await userEvent.keyboard('{Escape}')
  await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull())
}

export const SettingsSwatchChangesTheColumnColor: Story = {
  render: ({ onColorChange }) => (
    <ComposedKanban
      {...kanbanControlArgs}
      onColorChange={onColorChange}
      settingsAction
    />
  ),
  play: async ({ args, canvasElement }) => {
    const settings = await openColumnSettings(canvasElement)

    await expect(settings.getByRole('radio', { name: 'Cinza' })).toBeChecked()
    await userEvent.click(settings.getByRole('radio', { name: 'Vermelho' }))
    await expect(args.onColorChange).toHaveBeenCalledOnce()
    await expect(args.onColorChange).toHaveBeenLastCalledWith(
      'todo',
      'var(--color-red-500)',
    )
    await expect(
      settings.getByRole('radio', { name: 'Vermelho' }),
    ).toBeChecked()

    await closeColumnSettings()
  },
}

export const SettingsSwitchCollapsesTheColumn: Story = {
  render: ({ onCollapsedGroupIdsChange }) => (
    <ComposedKanban
      {...kanbanControlArgs}
      onCollapsedGroupIdsChange={onCollapsedGroupIdsChange}
      settingsAction
    />
  ),
  play: async ({ args, canvasElement }) => {
    const settings = await openColumnSettings(canvasElement)

    await userEvent.click(
      settings.getByRole('switch', { name: 'Recolher coluna' }),
    )
    await expect(args.onCollapsedGroupIdsChange).toHaveBeenCalledOnce()
    await expect(args.onCollapsedGroupIdsChange).toHaveBeenLastCalledWith([
      'todo',
    ])
    await waitFor(() =>
      expect(
        within(canvasElement)
          .getByRole('region', { name: 'A fazer' })
          .closest('[data-collapsed="true"]'),
      ).not.toBeNull(),
    )

    await closeColumnSettings()
  },
}
