import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  DataTable,
  type DataTableColumnDef,
  DataTableExpandToggle,
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

interface QueueTask {
  id: string
  status: string
  subtasks?: QueueTask[]
  title: string
}

const queue: QueueTask[] = [
  {
    id: 'T-1',
    status: 'Em andamento',
    subtasks: [
      { id: 'T-1a', status: 'Concluída', title: 'Revisar o contrato' },
      { id: 'T-1b', status: 'A fazer', title: 'Coletar as assinaturas' },
    ],
    title: 'Fechar o contrato de Atlas',
  },
  { id: 'T-2', status: 'A fazer', title: 'Atualizar o painel de renovações' },
  {
    id: 'T-3',
    status: 'A fazer',
    subtasks: [{ id: 'T-3a', status: 'A fazer', title: 'Mapear os riscos' }],
    title: 'Planejar o trimestre',
  },
  { id: 'T-4', status: 'Concluída', title: 'Enviar o resumo semanal' },
]

const columns: DataTableColumnDef<QueueTask>[] = [
  {
    accessorKey: 'title',
    cell: ({ row }) => (
      <DataTableExpandToggle
        getLabel={(current, expanded) =>
          `${expanded ? 'Recolher' : 'Expandir'} subtarefas de ${current.original.title}`
        }
        row={row}
      >
        <span className="truncate">{row.original.title}</span>
      </DataTableExpandToggle>
    ),
    header: 'Tarefa',
  },
  { accessorKey: 'status', header: 'Status' },
]

const onExpandedChange = fn()

function QueueTable({
  expanded,
  onExpandedChange,
  pageSize,
}: Readonly<{
  expanded?: Record<string, boolean>
  onExpandedChange?: (expanded: unknown) => void
  pageSize?: number
}>) {
  const { table } = useDataTable<QueueTask>({
    columns,
    data: queue,
    enableExpanding: true,
    enablePagination: pageSize !== undefined,
    getRowId: (task) => task.id,
    getSubRows: (task) => task.subtasks,
    pageSize,
    ...(expanded ? { expanded } : {}),
    ...(onExpandedChange ? { onExpandedChange } : {}),
  })

  return <DataTable aria-label="Fila de tarefas" table={table} />
}

function ControlledQueueTable({
  onExpandedChange,
}: Readonly<{ onExpandedChange: (expanded: unknown) => void }>) {
  const [expanded, setExpanded] = useState<Record<string, boolean>>({
    'T-3': true,
  })
  return (
    <QueueTable
      expanded={expanded}
      onExpandedChange={(next) => {
        onExpandedChange(next)
        setExpanded(next as Record<string, boolean>)
      }}
    />
  )
}

const tableOf = (canvasElement: HTMLElement) =>
  within(canvasElement).getByRole('table', { name: 'Fila de tarefas' })

const titles = (table: HTMLElement) =>
  [...table.querySelectorAll('tbody tr')].map(
    (row) => row.querySelector('td')?.textContent,
  )

export const ExpandingKeepsTheTableRole: Story = {
  render: () => <QueueTable />,
  play: async ({ canvasElement }) => {
    const table = tableOf(canvasElement)
    await expect(table.tagName).toBe('TABLE')
    for (const row of table.querySelectorAll('tbody tr')) {
      await expect(row).not.toHaveAttribute('aria-level')
      await expect(row).not.toHaveAttribute('aria-expanded')
    }
  },
}

export const ToggleShowsTheSubRowsIndented: Story = {
  render: () => <QueueTable />,
  play: async ({ canvasElement }) => {
    const table = tableOf(canvasElement)
    const canvas = within(table)
    await expect(titles(table)).toHaveLength(4)

    const toggle = canvas.getByRole('button', {
      name: 'Expandir subtarefas de Fechar o contrato de Atlas',
    })
    await expect(toggle).toHaveAttribute('aria-expanded', 'false')
    await userEvent.click(toggle)

    await waitFor(() =>
      expect(titles(table)).toEqual([
        'Fechar o contrato de Atlas',
        'Revisar o contrato',
        'Coletar as assinaturas',
        'Atualizar o painel de renovações',
        'Planejar o trimestre',
        'Enviar o resumo semanal',
      ]),
    )
    await expect(
      canvas.getByRole('button', {
        name: 'Recolher subtarefas de Fechar o contrato de Atlas',
      }),
    ).toHaveAttribute('aria-expanded', 'true')
    const child = canvas
      .getByText('Revisar o contrato')
      .closest<HTMLElement>('[data-slot="data-table-expand"]')
    await expect(child).toHaveAttribute('data-depth', '1')
    await expect(child?.style.paddingInlineStart).toBe('20px')
  },
}

export const ExpandedIsControlled: Story = {
  render: () => <ControlledQueueTable onExpandedChange={onExpandedChange} />,
  play: async ({ canvasElement }) => {
    onExpandedChange.mockClear()
    const table = tableOf(canvasElement)
    await expect(within(table).getByText('Mapear os riscos')).toBeVisible()

    await userEvent.click(
      within(table).getByRole('button', {
        name: 'Recolher subtarefas de Planejar o trimestre',
      }),
    )
    await expect(onExpandedChange).toHaveBeenCalledWith({})
    await waitFor(() =>
      expect(within(table).queryByText('Mapear os riscos')).toBeNull(),
    )
  },
}

export const PagesCountTopLevelRows: Story = {
  render: () => <QueueTable expanded={{ 'T-1': true }} pageSize={2} />,
  play: async ({ canvasElement }) => {
    const table = tableOf(canvasElement)
    await expect(titles(table)).toEqual([
      'Fechar o contrato de Atlas',
      'Revisar o contrato',
      'Coletar as assinaturas',
      'Atualizar o painel de renovações',
    ])
  },
}
