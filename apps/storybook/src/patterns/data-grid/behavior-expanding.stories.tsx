import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  DataGrid,
  type DataGridColumnDef,
  DataGridExpandToggle,
  useDataGrid,
} from '@tc96/ui/patterns'
import { useState } from 'react'
import { expect, fn, userEvent, waitFor, within } from 'storybook/test'
import { DataGridCanvas } from './data-grid-canvas.tsx'

const meta = {
  decorators: [DataGridCanvas],
  tags: ['!autodocs'],
  title: 'Patterns/DataGrid/Behavior',
} satisfies Meta

export default meta

type Story = StoryObj<typeof meta>

const onExpandedChange = fn()

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

const columns: DataGridColumnDef<QueueTask>[] = [
  {
    accessorKey: 'title',
    cell: ({ row }) => (
      <DataGridExpandToggle
        getLabel={(current, expanded) =>
          `${expanded ? 'Recolher' : 'Expandir'} subtarefas de ${current.original.title}`
        }
        row={row}
      >
        <span className="truncate">{row.original.title}</span>
      </DataGridExpandToggle>
    ),
    header: 'Tarefa',
    meta: { label: 'Tarefa' },
    size: 360,
  },
  {
    accessorKey: 'status',
    header: 'Status',
    meta: { label: 'Status' },
    size: 160,
  },
]

function QueueGrid({
  enableExpanding = true,
  expanded,
  onExpandedChange,
  pageSize,
}: Readonly<{
  enableExpanding?: boolean
  expanded?: Record<string, boolean>
  onExpandedChange?: (expanded: unknown) => void
  pageSize?: number
}>) {
  const { table } = useDataGrid<QueueTask>({
    columns,
    data: queue,
    enableExpanding,
    enablePagination: pageSize !== undefined,
    getRowId: (task) => task.id,
    getSubRows: (task) => task.subtasks,
    pageSize,
    ...(expanded ? { expanded } : {}),
    ...(onExpandedChange ? { onExpandedChange } : {}),
  })

  return <DataGrid aria-label="Fila de tarefas" table={table} />
}

function ControlledQueueGrid({
  onExpandedChange,
}: Readonly<{ onExpandedChange: (expanded: unknown) => void }>) {
  const [expanded, setExpanded] = useState<Record<string, boolean>>({
    'T-3': true,
  })
  return (
    <QueueGrid
      expanded={expanded}
      onExpandedChange={(next) => {
        onExpandedChange(next)
        setExpanded(next as Record<string, boolean>)
      }}
    />
  )
}

const gridOf = (canvasElement: HTMLElement) =>
  within(canvasElement).getByRole('treegrid', { name: 'Fila de tarefas' })

const bodyRowsOf = (grid: HTMLElement) => [
  ...grid.querySelectorAll<HTMLElement>('[data-slot="data-grid-row"]'),
]

export const ExpandingTurnsTheGridIntoATreegrid: Story = {
  render: () => <QueueGrid />,
  play: async ({ canvasElement }) => {
    const grid = gridOf(canvasElement)
    await expect(grid).toHaveAttribute('role', 'treegrid')
    for (const row of bodyRowsOf(grid)) {
      await expect(row).toHaveAttribute('aria-level', '1')
    }
  },
}

export const WithoutExpandingTheGridKeepsTheGridRole: Story = {
  render: () => <QueueGrid enableExpanding={false} />,
  play: async ({ canvasElement }) => {
    const grid = within(canvasElement).getByRole('grid', {
      name: 'Fila de tarefas',
    })
    await expect(grid).toHaveAttribute('role', 'grid')
    for (const row of bodyRowsOf(grid)) {
      await expect(row).not.toHaveAttribute('aria-level')
      await expect(row).not.toHaveAttribute('aria-expanded')
    }
  },
}

export const OnlyRowsWithSubTasksExposeAriaExpanded: Story = {
  render: () => <QueueGrid />,
  play: async ({ canvasElement }) => {
    const rows = bodyRowsOf(gridOf(canvasElement))
    await expect(rows).toHaveLength(4)
    await expect(rows[0]).toHaveAttribute('aria-expanded', 'false')
    await expect(rows[1]).not.toHaveAttribute('aria-expanded')
    await expect(rows[2]).toHaveAttribute('aria-expanded', 'false')
    await expect(rows[3]).not.toHaveAttribute('aria-expanded')
  },
}

export const ToggleShowsSubTasksIndentedBelowTheirParent: Story = {
  render: () => <QueueGrid />,
  play: async ({ canvasElement }) => {
    const grid = gridOf(canvasElement)
    await userEvent.click(
      within(grid).getByRole('button', {
        name: 'Expandir subtarefas de Fechar o contrato de Atlas',
      }),
    )

    await waitFor(() => expect(bodyRowsOf(grid)).toHaveLength(6))
    const rows = bodyRowsOf(grid)
    await expect(rows[0]).toHaveAttribute('aria-expanded', 'true')
    await expect(rows[1]).toHaveTextContent('Revisar o contrato')
    await expect(rows[1]).toHaveAttribute('aria-level', '2')
    await expect(rows[2]).toHaveTextContent('Coletar as assinaturas')

    const indent = (row: HTMLElement | undefined) =>
      Number.parseFloat(
        row?.querySelector<HTMLElement>('[data-slot="data-grid-expand"]')?.style
          .paddingInlineStart ?? '0',
      )
    await expect(indent(rows[1])).toBeGreaterThan(indent(rows[0]))
    await expect(
      rows[1]?.querySelector('[data-slot="data-grid-expand"]'),
    ).toHaveAttribute('data-depth', '1')
  },
}

export const ToggleNameComesFromTheConsumerAndFollowsTheState: Story = {
  render: () => <QueueGrid />,
  play: async ({ canvasElement }) => {
    const grid = gridOf(canvasElement)
    const toggle = within(grid).getByRole('button', {
      name: 'Expandir subtarefas de Planejar o trimestre',
    })
    await expect(toggle).toHaveAttribute('aria-expanded', 'false')

    await userEvent.click(toggle)
    await expect(
      await within(grid).findByRole('button', {
        name: 'Recolher subtarefas de Planejar o trimestre',
      }),
    ).toHaveAttribute('aria-expanded', 'true')
  },
}

export const ToggleWorksFromTheKeyboard: Story = {
  render: () => <QueueGrid />,
  play: async ({ canvasElement }) => {
    const grid = gridOf(canvasElement)
    const toggle = within(grid).getByRole('button', {
      name: 'Expandir subtarefas de Planejar o trimestre',
    })
    toggle.focus()
    await userEvent.keyboard('{Enter}')
    await waitFor(() => expect(bodyRowsOf(grid)).toHaveLength(5))
    await expect(grid).toHaveTextContent('Mapear os riscos')

    await userEvent.keyboard(' ')
    await waitFor(() => expect(bodyRowsOf(grid)).toHaveLength(4))
  },
}

export const PagesCountTopLevelRowsOnly: Story = {
  render: () => <QueueGrid pageSize={2} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const grid = gridOf(canvasElement)
    await expect(bodyRowsOf(grid)).toHaveLength(2)
    await expect(canvas.getByText(/de 4$/)).toBeVisible()

    await userEvent.click(
      canvas.getByRole('button', {
        name: 'Expandir subtarefas de Fechar o contrato de Atlas',
      }),
    )
    await waitFor(() => expect(bodyRowsOf(grid)).toHaveLength(4))
    await expect(canvas.getByText(/de 4$/)).toBeVisible()
    await expect(grid).not.toHaveTextContent('Planejar o trimestre')

    await userEvent.click(
      canvas.getByRole('button', { name: 'Próxima página' }),
    )
    await waitFor(() => expect(grid).toHaveTextContent('Planejar o trimestre'))
    await expect(bodyRowsOf(grid)).toHaveLength(2)
  },
}

export const ExpandedStateCanBeControlled: Story = {
  render: () => <ControlledQueueGrid onExpandedChange={onExpandedChange} />,
  play: async ({ canvasElement }) => {
    onExpandedChange.mockClear()
    const grid = gridOf(canvasElement)
    await expect(grid).toHaveTextContent('Mapear os riscos')

    await userEvent.click(
      within(grid).getByRole('button', {
        name: 'Expandir subtarefas de Fechar o contrato de Atlas',
      }),
    )
    await waitFor(() =>
      expect(onExpandedChange).toHaveBeenCalledWith({
        'T-1': true,
        'T-3': true,
      }),
    )
    await waitFor(() => expect(bodyRowsOf(grid)).toHaveLength(7))
  },
}
