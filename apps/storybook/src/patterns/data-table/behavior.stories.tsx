import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  DataTable,
  type DataTableColumnDef,
  useDataTable,
} from '@tc96/ui/patterns'
import { useEffect, useState } from 'react'
import { expect, fn, screen, userEvent, waitFor, within } from 'storybook/test'
import { sleep } from '../../test-utils/sleep'
import { initialTasks, type Task } from '../collection/fixtures/tasks'
import { DataTableCanvas } from './data-table-canvas.tsx'
import { dataTableControlArgs } from './data-table-controls.ts'
import {
  ComposedDataTable,
  TASK_PAGE_SIZE,
  TasksTable,
} from './data-table-layouts.tsx'

interface DataTableBehaviorArgs {
  onOpen: (task: Task) => void
}

const meta = {
  decorators: [DataTableCanvas],
  tags: ['!autodocs'],
  title: 'Patterns/DataTable/Behavior',
} satisfies Meta<DataTableBehaviorArgs>

export default meta

type Story = StoryObj<DataTableBehaviorArgs>

const LOAD_DELAY = 2000

function LoadingTasksTable() {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let active = true
    sleep(LOAD_DELAY).then(() => {
      if (active) setIsLoading(false)
    })
    return () => {
      active = false
    }
  }, [])

  return <TasksTable isLoading={isLoading} />
}

const tableOf = (canvasElement: HTMLElement) =>
  within(canvasElement).getByRole('table', { name: 'Tarefas do lançamento' })

const bodyRowsOf = (table: HTMLElement) => [
  ...table.querySelectorAll<HTMLElement>('tbody tr'),
]

const pageOf = (page: number) =>
  initialTasks.slice((page - 1) * TASK_PAGE_SIZE, page * TASK_PAGE_SIZE)

const firstTwo = () => {
  const [first, second] = pageOf(1)
  if (!(first && second)) throw new Error('The fixture has fewer tasks.')
  return [first, second] as const
}

export const LoadingKeepsTheRowHeight: Story = {
  render: () => <LoadingTasksTable />,
  play: async ({ canvasElement }) => {
    const table = tableOf(canvasElement)
    const [first] = firstTwo()

    await expect(table).toHaveAttribute('aria-busy', 'true')
    await expect(bodyRowsOf(table)).toHaveLength(TASK_PAGE_SIZE)
    const skeletonRowHeight =
      bodyRowsOf(table)[0]?.getBoundingClientRect().height

    await within(canvasElement).findByRole(
      'checkbox',
      { name: `Selecionar ${first.title}` },
      { timeout: LOAD_DELAY * 2 },
    )
    await expect(table).not.toHaveAttribute('aria-busy')
    await expect(bodyRowsOf(table)[0]?.getBoundingClientRect().height).toBe(
      skeletonRowHeight,
    )
  },
}

export const RowOpensFromAPlainArea: Story = {
  args: { onOpen: fn() },
  render: ({ onOpen }) => <TasksTable onOpen={onOpen} />,
  play: async ({ args, canvasElement }) => {
    const table = tableOf(canvasElement)
    const [first] = firstTwo()
    const plainCell = bodyRowsOf(table)[0]?.querySelectorAll('td')[1]
    if (!plainCell) throw new Error('The first row has no second cell.')

    const box = plainCell.getBoundingClientRect()
    const trigger = canvasElement.ownerDocument.elementFromPoint(
      box.left + box.width / 2,
      box.top + box.height / 2,
    )
    await expect(trigger).toHaveAccessibleName(`Abrir ${first.title}`)
    await userEvent.click(trigger as Element)
    await expect(args.onOpen).toHaveBeenCalledOnce()
    await expect(args.onOpen).toHaveBeenLastCalledWith(
      expect.objectContaining({ id: first.id }),
    )
  },
}

export const RowThatDoesNotOpen: Story = {
  args: { onOpen: fn() },
  render: ({ onOpen }) => {
    const [, second] = firstTwo()
    return (
      <TasksTable canOpen={(task) => task.id !== second.id} onOpen={onOpen} />
    )
  },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    const [first, second] = firstTwo()
    const closedRow = bodyRowsOf(tableOf(canvasElement))[1]
    if (!closedRow) throw new Error('The table has no second row.')

    await expect(
      canvas.getByRole('button', { name: `Abrir ${first.title}` }),
    ).toBeVisible()
    await expect(
      canvas.queryByRole('button', { name: `Abrir ${second.title}` }),
    ).toBeNull()
    await expect(closedRow).not.toHaveAttribute('data-interactive')
    await expect(
      closedRow.querySelector('[data-slot="data-table-row-trigger"]'),
    ).toBeNull()

    await userEvent.click(closedRow.querySelectorAll('td')[1] as Element)
    await expect(args.onOpen).not.toHaveBeenCalled()

    const checkbox = canvas.getByRole('checkbox', {
      name: `Selecionar ${second.title}`,
    })
    await userEvent.click(checkbox)
    await expect(checkbox).toHaveAttribute('aria-checked', 'true')
    await expect(closedRow).toHaveAttribute('data-state', 'selected')
  },
}

export const CellControlsKeepTheirClick: Story = {
  args: { onOpen: fn() },
  render: ({ onOpen }) => <TasksTable onOpen={onOpen} />,
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    const [, second] = firstTwo()

    const checkbox = canvas.getByRole('checkbox', {
      name: `Selecionar ${second.title}`,
    })
    await userEvent.click(checkbox)
    await expect(checkbox).toHaveAttribute('aria-checked', 'true')
    await expect(checkbox.closest('tr')).toHaveAttribute(
      'data-state',
      'selected',
    )

    await userEvent.click(
      canvas.getAllByRole('combobox', { name: /^Status/ })[0] as Element,
    )
    await userEvent.click(
      await screen.findByRole('option', { name: 'Em revisão' }),
    )
    await waitFor(() =>
      expect(
        canvas.getAllByRole('combobox', { name: /^Status/ })[0],
      ).toHaveAccessibleName(/Em revisão/),
    )
    await waitFor(() => expect(screen.queryByRole('listbox')).toBeNull())
    await expect(args.onOpen).not.toHaveBeenCalled()
  },
}

export const FooterAggregatesEveryPage: Story = {
  render: () => <TasksTable />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    await expect(bodyRowsOf(tableOf(canvasElement))).toHaveLength(
      TASK_PAGE_SIZE,
    )
    await expect(
      canvas.getByRole('button', { name: /^Contagem / }),
    ).toHaveTextContent(String(initialTasks.length))

    await userEvent.click(canvas.getByRole('button', { name: /^Soma / }))
    await userEvent.click(
      await screen.findByRole('menuitemradio', { name: 'Contagem' }),
    )
    await waitFor(() =>
      expect(
        canvas.getAllByRole('button', { name: /^Contagem / }),
      ).toHaveLength(2),
    )
    for (const button of canvas.getAllByRole('button', {
      name: /^Contagem /,
    })) {
      await expect(button).toHaveTextContent(String(initialTasks.length))
    }

    await userEvent.keyboard('{Escape}')
    await waitFor(() => expect(screen.queryByRole('menu')).toBeNull())
  },
}

export const HidesAColumnFromTheMenu: Story = {
  render: () => <TasksTable />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(
      canvas.getByRole('columnheader', { name: 'Prioridade' }),
    ).toBeInTheDocument()

    await userEvent.click(canvas.getByRole('button', { name: 'Exibição' }))
    await userEvent.click(
      await screen.findByRole('menuitem', { name: 'Colunas' }),
    )
    await userEvent.click(
      await screen.findByRole('menuitemcheckbox', {
        name: /Prioridade|priority/,
      }),
    )
    await expect(
      canvas.queryByRole('columnheader', { name: 'Prioridade' }),
    ).toBeNull()

    await userEvent.keyboard('{Escape}')
    await userEvent.keyboard('{Escape}')
    await waitFor(() => expect(screen.queryByRole('menu')).toBeNull())
  },
}

export const PagesKeepTheHeight: Story = {
  render: () => <TasksTable />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const table = tableOf(canvasElement)
    const titles = () =>
      bodyRowsOf(table).map((row) =>
        row
          .querySelector('[data-slot="data-table-row-trigger"]')
          ?.getAttribute('aria-label')
          ?.replace('Abrir ', ''),
      )
    const tableHeight = table.getBoundingClientRect().height

    const goTo = async (name: string, page: number) => {
      await userEvent.click(canvas.getByRole('button', { name }))
      await waitFor(() =>
        expect(titles()).toEqual(pageOf(page).map((task) => task.title)),
      )
      await expect(table.getBoundingClientRect().height).toBe(tableHeight)
    }
    await goTo('Próxima página', 2)
    await goTo('Página anterior', 1)
  },
}

export const EmptyShowsTheMessageRow: Story = {
  render: () => <ComposedDataTable {...dataTableControlArgs} empty />,
  play: async ({ canvasElement }) => {
    const table = within(canvasElement).getByRole('table', {
      name: 'Projetos do trimestre',
    })
    const headers = within(table).getAllByRole('columnheader')
    const bodyRows = bodyRowsOf(table)

    await expect(bodyRows).toHaveLength(1)
    const [cell, ...others] = bodyRows[0]?.querySelectorAll('td') ?? []
    await expect(others).toHaveLength(0)
    await expect(cell).toHaveTextContent(dataTableControlArgs.emptyMessage)
    await expect(cell).toHaveAttribute('colspan', String(headers.length))
    await expect(
      table.querySelector('[data-slot="data-table-row-trigger"]'),
    ).toBeNull()
    await expect(table.querySelector('[data-slot="table-footer"]')).toBeNull()
  },
}

export const UnusedOptionsKeepTheMarkup: Story = {
  render: () => <ComposedDataTable {...dataTableControlArgs} />,
  play: async ({ canvasElement }) => {
    const table = within(canvasElement).getByRole('table', {
      name: 'Projetos do trimestre',
    })

    await expect(table).not.toHaveAttribute('data-density')
    await expect(table).not.toHaveAttribute('aria-busy')
    await expect(table.querySelectorAll('tbody')).toHaveLength(1)
    await expect(
      table.querySelector(
        '[data-slot="data-table-group-row"], [data-loading-more], [data-slot="data-table-input-cell"], [data-slot="data-table-row-drag-handle"]',
      ),
    ).toBeNull()
    for (const row of table.querySelectorAll('tbody tr')) {
      await expect(row.className).not.toContain('data-dnd-dragging')
    }
    await expect(
      canvasElement.querySelector('[data-slot="data-table-selection-actions"]'),
    ).toBeNull()
  },
}

interface Invoice {
  amount: number
  id: string
  customer: string
}

const invoices: Invoice[] = [
  { amount: 1200, customer: 'Acme', id: 'i1' },
  { amount: 80, customer: 'Globex', id: 'i2' },
]

const invoiceColumns: DataTableColumnDef<Invoice>[] = [
  { accessorKey: 'customer', header: 'Cliente', meta: { label: 'Cliente' } },
  {
    accessorKey: 'amount',
    cell: ({ row }) => (
      <div className="flex gap-1">
        <span>R$</span>
        <span data-testid="amount">{row.original.amount}</span>
      </div>
    ),
    header: 'Valor',
    meta: { align: 'end', label: 'Valor' },
  },
]

function InvoicesTable() {
  const { table } = useDataTable<Invoice>({
    columns: invoiceColumns,
    data: invoices,
    getRowId: (invoice) => invoice.id,
  })

  return <DataTable aria-label="Faturas" table={table} />
}

const contentEndOf = (cell: HTMLElement) => {
  const range = document.createRange()
  range.selectNodeContents(cell)
  return range.getBoundingClientRect().right
}

const innerEndOf = (cell: HTMLElement) =>
  cell.getBoundingClientRect().right -
  Number.parseFloat(getComputedStyle(cell).paddingInlineEnd)

export const EndColumnAlignsHeaderAndBody: Story = {
  render: () => <InvoicesTable />,
  play: async ({ canvasElement }) => {
    const table = within(canvasElement).getByRole('table', { name: 'Faturas' })
    const header = within(table).getByRole('columnheader', { name: 'Valor' })
    const [amount] = within(table).getAllByTestId('amount')
    const cell = amount?.closest('td')
    if (!(amount && cell)) throw new Error('The amount cell is missing.')

    await expect(getComputedStyle(header).textAlign).toBe('end')
    await expect(getComputedStyle(cell).textAlign).toBe('end')
    await expect(contentEndOf(header)).toBeCloseTo(innerEndOf(header), 0)
    await expect(amount.getBoundingClientRect().right).toBeCloseTo(
      innerEndOf(cell),
      0,
    )
    await expect(
      within(table).getByRole('columnheader', { name: 'Cliente' }).className,
    ).not.toMatch(/text-(start|center|end)/)
    for (const startCell of table.querySelectorAll('tbody td:first-child')) {
      await expect(startCell.className).not.toMatch(/text-(start|center|end)/)
    }
  },
}
