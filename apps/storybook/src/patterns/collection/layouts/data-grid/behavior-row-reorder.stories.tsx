import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  createRowDragColumn,
  DataGrid,
  type DataGridColumnDef,
  type DataGridRowDragAnnouncements,
  type DataGridRowMove,
  useDataGrid,
} from '@tc96/ui/patterns'
import { useState } from 'react'
import { expect, fn, userEvent, waitFor, within } from 'storybook/test'
import { sleep } from '../../../../test-utils/sleep'
import { DataGridCanvas } from './data-grid-canvas.tsx'

const meta = {
  decorators: [DataGridCanvas],
  tags: ['!autodocs'],
  title: 'Patterns/Collection/Layouts/Data Grid/Behavior',
} satisfies Meta

export default meta

type Story = StoryObj<typeof meta>

interface RoutingRule {
  id: string
  name: string
  team: string
}

const initialRules: RoutingRule[] = [
  { id: 'r1', name: 'Clientes enterprise', team: 'Contas' },
  { id: 'r2', name: 'Pedidos de reembolso', team: 'Financeiro' },
  { id: 'r3', name: 'Falhas de integração', team: 'Suporte' },
  { id: 'r4', name: 'Demais solicitações', team: 'Suporte' },
]

const columns: DataGridColumnDef<RoutingRule>[] = [
  createRowDragColumn<RoutingRule>({
    getHandleLabel: (rule) => `Arrastar para reordenar a regra ${rule.name}`,
    headerLabel: 'Reordenar',
  }),
  {
    cell: ({ row }) => <span data-testid="rank">{String(row.index + 1)}</span>,
    header: 'Prioridade',
    id: 'rank',
    meta: { align: 'end', label: 'Prioridade' },
    size: 110,
  },
  {
    accessorKey: 'name',
    header: 'Regra',
    meta: { label: 'Regra' },
    size: 260,
  },
  {
    accessorKey: 'team',
    header: 'Equipe',
    meta: { label: 'Equipe' },
    size: 160,
  },
]

const announcements: DataGridRowDragAnnouncements = {
  end: ({ canceled, rowId, toIndex }) =>
    canceled
      ? `Movimento da linha ${rowId} cancelado`
      : `Linha ${rowId} solta na posição ${toIndex + 1}`,
  instructions:
    'Pressione espaço para pegar a linha, use as setas para mover e espaço para soltar.',
  over: ({ overIndex, rowId }) =>
    `Linha ${rowId} sobre a posição ${overIndex + 1}`,
  start: ({ index, rowCount, rowId }) =>
    `Linha ${rowId} pega na posição ${index + 1} de ${rowCount}`,
}

const arrayMove = <T,>(items: T[], from: number, to: number) => {
  const next = [...items]
  const [moved] = next.splice(from, 1)
  if (moved !== undefined) next.splice(to, 0, moved)
  return next
}

function RulesGrid({
  grouped = false,
  onMove,
  reorder = true,
  sorted = false,
  virtualize = false,
}: Readonly<{
  grouped?: boolean
  onMove?: (move: DataGridRowMove) => void
  reorder?: boolean
  sorted?: boolean
  virtualize?: boolean
}>) {
  const [rules, setRules] = useState(initialRules)
  const { table } = useDataGrid<RoutingRule>({
    columns,
    data: rules,
    getRowId: (rule) => rule.id,
    ...(sorted
      ? {
          tableOptions: {
            initialState: { sorting: [{ desc: false, id: 'name' }] },
          },
        }
      : {}),
  })

  return (
    <DataGrid<RoutingRule>
      aria-label="Regras de roteamento"
      rowDragAnnouncements={announcements}
      table={table}
      virtualize={virtualize}
      {...(grouped ? { getRowGroup: (rule: RoutingRule) => rule.team } : {})}
      {...(reorder
        ? {
            onRowMove: (move: DataGridRowMove) => {
              onMove?.(move)
              setRules((current) =>
                arrayMove(current, move.fromIndex, move.toIndex),
              )
            },
          }
        : {})}
    />
  )
}

const onRowMove = fn()

const gridOf = (canvasElement: HTMLElement) =>
  within(canvasElement).getByRole('grid', { name: 'Regras de roteamento' })

const handles = (canvasElement: HTMLElement) =>
  within(gridOf(canvasElement)).getAllByRole('button', {
    name: /^Arrastar para reordenar/,
  })

const focusFirstHandle = async (canvasElement: HTMLElement) => {
  const [first] = handles(canvasElement)
  if (!first) throw new Error('The grid has no handle.')
  await waitFor(() => expect(first).toHaveAttribute('aria-pressed', 'false'))
  first.focus()
}

const ruleNames = (canvasElement: HTMLElement) =>
  [
    ...gridOf(canvasElement).querySelectorAll<HTMLElement>(
      '[data-slot="data-grid-row"] [data-column-id="name"]',
    ),
  ].map((cell) => cell.textContent)

const liveRegionText = () =>
  [...document.querySelectorAll('[id^="dnd-kit-announcement"]')].at(-1)
    ?.textContent ?? ''

export const EachRowHasAHandleNamedByTheConsumer: Story = {
  render: () => <RulesGrid />,
  play: async ({ canvasElement }) => {
    const grid = within(gridOf(canvasElement))
    await expect(
      grid.getByRole('button', {
        name: 'Arrastar para reordenar a regra Clientes enterprise',
      }),
    ).toBeEnabled()
    await expect(handles(canvasElement)).toHaveLength(4)
    await expect(
      grid.getByRole('columnheader', { name: 'Reordenar' }),
    ).toBeVisible()
  },
}

export const KeyboardMovesARowAndReportsTheMove: Story = {
  render: () => <RulesGrid onMove={onRowMove} />,
  play: async ({ canvasElement }) => {
    onRowMove.mockClear()
    await focusFirstHandle(canvasElement)
    await userEvent.keyboard(' ')
    await userEvent.keyboard('{ArrowDown}')
    await userEvent.keyboard(' ')

    await waitFor(() => expect(onRowMove).toHaveBeenCalledTimes(1))
    await expect(onRowMove).toHaveBeenCalledWith({
      fromIndex: 0,
      overRowId: 'r2',
      rowId: 'r1',
      toIndex: 1,
    })
    await waitFor(() =>
      expect(ruleNames(canvasElement)).toEqual([
        'Pedidos de reembolso',
        'Clientes enterprise',
        'Falhas de integração',
        'Demais solicitações',
      ]),
    )
  },
}

export const RankFollowsTheNewOrder: Story = {
  render: () => <RulesGrid />,
  play: async ({ canvasElement }) => {
    await focusFirstHandle(canvasElement)
    await userEvent.keyboard(' ')
    await userEvent.keyboard('{ArrowDown}{ArrowDown}')
    await userEvent.keyboard(' ')

    await waitFor(() =>
      expect(ruleNames(canvasElement)[2]).toBe('Clientes enterprise'),
    )
    const grid = within(gridOf(canvasElement))
    await waitFor(() =>
      expect(
        grid.getAllByTestId('rank').map((rank) => rank.textContent),
      ).toEqual(['1', '2', '3', '4']),
    )
    const row = grid
      .getByText('Clientes enterprise')
      .closest<HTMLElement>('[data-slot="data-grid-row"]')
    await expect(
      within(row as HTMLElement).getByTestId('rank'),
    ).toHaveTextContent('3')
  },
}

export const EscapeCancelsTheMove: Story = {
  render: () => <RulesGrid onMove={onRowMove} />,
  play: async ({ canvasElement }) => {
    onRowMove.mockClear()
    await focusFirstHandle(canvasElement)
    await userEvent.keyboard(' ')
    await userEvent.keyboard('{ArrowDown}')
    await userEvent.keyboard('{Escape}')

    await waitFor(() => expect(liveRegionText()).toContain('cancelado'))
    await expect(onRowMove).not.toHaveBeenCalled()
    await expect(ruleNames(canvasElement)[0]).toBe('Clientes enterprise')
  },
}

export const AnnouncementsComeFromTheConsumer: Story = {
  render: () => <RulesGrid />,
  play: async ({ canvasElement }) => {
    await focusFirstHandle(canvasElement)
    await userEvent.keyboard(' ')
    await waitFor(() =>
      expect(liveRegionText()).toBe('Linha r1 pega na posição 1 de 4'),
    )

    await userEvent.keyboard('{ArrowDown}')
    await userEvent.keyboard(' ')
    await waitFor(() =>
      expect(liveRegionText()).toBe('Linha r1 solta na posição 2'),
    )
    await expect(
      [...document.querySelectorAll('[id^="dnd-kit-description"]')].at(-1),
    ).toHaveTextContent('Pressione espaço para pegar a linha')
  },
}

export const HandlesAreInertWithoutAMoveHandler: Story = {
  render: () => <RulesGrid reorder={false} />,
  play: async ({ canvasElement }) => {
    for (const handle of handles(canvasElement)) {
      await expect(handle).toBeDisabled()
    }
  },
}

export const HandlesAreInertWhileSorted: Story = {
  render: () => <RulesGrid sorted />,
  play: async ({ canvasElement }) => {
    for (const handle of handles(canvasElement)) {
      await expect(handle).toBeDisabled()
    }
  },
}

export const HandlesAreInertWhileGrouped: Story = {
  render: () => <RulesGrid grouped />,
  play: async ({ canvasElement }) => {
    for (const handle of handles(canvasElement)) {
      await expect(handle).toBeDisabled()
    }
  },
}

export const HandlesAreInertWhileVirtualized: Story = {
  render: () => <RulesGrid virtualize />,
  play: async ({ canvasElement }) => {
    await waitFor(() =>
      expect(handles(canvasElement).length).toBeGreaterThan(0),
    )
    for (const handle of handles(canvasElement)) {
      await expect(handle).toBeDisabled()
    }
  },
}

export const PointerDragMovesARow: Story = {
  render: () => <RulesGrid onMove={onRowMove} />,
  play: async ({ canvasElement }) => {
    onRowMove.mockClear()
    const [first] = handles(canvasElement)
    const target = within(gridOf(canvasElement)).getByText(
      'Falhas de integração',
    )
    if (!first) throw new Error('The grid has no handle.')
    const from = first.getBoundingClientRect()
    const to = target.getBoundingClientRect()

    const center = { x: from.x + from.width / 2, y: from.y + from.height / 2 }
    const over = { x: center.x, y: to.y + to.height / 2 }
    const user = userEvent.setup({ pointerEventsCheck: 0 })
    await user.pointer({ coords: center, keys: '[MouseLeft>]', target: first })
    await user.pointer({ coords: { x: center.x, y: center.y + 12 } })
    await sleep(100)
    await user.pointer({ coords: over })
    await sleep(200)
    await user.pointer({ coords: { x: over.x, y: over.y + 2 } })
    await sleep(200)
    await user.pointer({ keys: '[/MouseLeft]' })

    await waitFor(() => expect(onRowMove).toHaveBeenCalledTimes(1))
    await expect(onRowMove.mock.calls[0]?.[0]).toMatchObject({
      fromIndex: 0,
      rowId: 'r1',
    })
  },
}
