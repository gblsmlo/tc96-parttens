import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  createDataTableRowDragColumn,
  DataTable,
  type DataTableColumnDef,
  type DataTableRowDragAnnouncements,
  type DataTableRowMove,
  useDataTable,
} from '@tc96/ui/patterns'
import { useState } from 'react'
import { expect, fn, userEvent, waitFor, within } from 'storybook/test'
import { DataTableCanvas } from './data-table-canvas.tsx'

const meta = {
  decorators: [DataTableCanvas],
  tags: ['!autodocs'],
  title: 'Patterns/Collection/Layouts/Data Table/Behavior',
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

const columns: DataTableColumnDef<RoutingRule>[] = [
  createDataTableRowDragColumn<RoutingRule>({
    getHandleLabel: (rule) => `Arrastar para reordenar a regra ${rule.name}`,
    headerLabel: 'Reordenar',
  }),
  { accessorKey: 'name', header: 'Regra' },
  { accessorKey: 'team', header: 'Equipe' },
]

const announcements: DataTableRowDragAnnouncements = {
  end: ({ canceled, rowId, toIndex }) =>
    canceled
      ? `Movimento da linha ${rowId} cancelado`
      : `Linha ${rowId} solta na posição ${toIndex + 1}`,
  instructions:
    'Pressione espaço para pegar a linha, use as setas para mover e espaço para soltar.',
  start: ({ index, rowCount, rowId }) =>
    `Linha ${rowId} pega na posição ${index + 1} de ${rowCount}`,
}

const arrayMove = <T,>(items: T[], from: number, to: number) => {
  const next = [...items]
  const [moved] = next.splice(from, 1)
  if (moved !== undefined) next.splice(to, 0, moved)
  return next
}

function RulesTable({
  grouped = false,
  onMove,
  sorted = false,
}: Readonly<{
  grouped?: boolean
  onMove?: (move: DataTableRowMove) => void
  sorted?: boolean
}>) {
  const [rules, setRules] = useState(initialRules)
  const { table } = useDataTable<RoutingRule>({
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
    <DataTable<RoutingRule>
      aria-label="Regras de roteamento"
      onRowMove={(move) => {
        onMove?.(move)
        setRules((current) => arrayMove(current, move.fromIndex, move.toIndex))
      }}
      rowDragAnnouncements={announcements}
      table={table}
      {...(grouped ? { getRowGroup: (rule: RoutingRule) => rule.team } : {})}
    />
  )
}

const onRowMove = fn()

const tableOf = (canvasElement: HTMLElement) =>
  within(canvasElement).getByRole('table', { name: 'Regras de roteamento' })

const handles = (canvasElement: HTMLElement) =>
  within(tableOf(canvasElement)).getAllByRole('button', {
    name: /^Arrastar para reordenar/,
  })

const focusFirstHandle = async (canvasElement: HTMLElement) => {
  const [first] = handles(canvasElement)
  if (!first) throw new Error('The table has no handle.')
  await waitFor(() => expect(first).toHaveAttribute('aria-pressed', 'false'))
  first.focus()
}

const ruleNames = (canvasElement: HTMLElement) =>
  [
    ...tableOf(canvasElement).querySelectorAll<HTMLElement>(
      'tbody tr[data-slot="table-row"]',
    ),
  ].map((row) => row.querySelectorAll('td')[1]?.textContent)

const liveRegionText = () =>
  [...document.querySelectorAll('[id^="dnd-kit-announcement"]')].at(-1)
    ?.textContent ?? ''

export const KeyboardMovesATableRow: Story = {
  render: () => <RulesTable onMove={onRowMove} />,
  play: async ({ canvasElement }) => {
    onRowMove.mockClear()
    await expect(
      within(tableOf(canvasElement)).getByRole('columnheader', {
        name: 'Reordenar',
      }),
    ).toBeInTheDocument()
    await focusFirstHandle(canvasElement)
    await userEvent.keyboard(' ')
    await waitFor(() =>
      expect(liveRegionText()).toBe('Linha r1 pega na posição 1 de 4'),
    )
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
    await expect(liveRegionText()).toBe('Linha r1 solta na posição 2')
  },
}

export const EscapeCancelsTheTableMove: Story = {
  render: () => <RulesTable onMove={onRowMove} />,
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

export const SortedTableDisablesTheHandles: Story = {
  render: () => <RulesTable sorted />,
  play: async ({ canvasElement }) => {
    for (const handle of handles(canvasElement)) {
      await expect(handle).toBeDisabled()
    }
  },
}

export const GroupedTableDisablesTheHandles: Story = {
  render: () => <RulesTable grouped />,
  play: async ({ canvasElement }) => {
    for (const handle of handles(canvasElement)) {
      await expect(handle).toBeDisabled()
    }
  },
}
