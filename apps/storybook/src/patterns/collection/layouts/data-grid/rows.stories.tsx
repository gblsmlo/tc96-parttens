import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  CollectionToolbar,
  createSelectColumn,
  DataGrid,
  type DataGridColumnDef,
  DataGridSearch,
  useDataGrid,
} from '@tc96/parttens'
import { type ReactNode, useState } from 'react'
import { expect, userEvent, waitFor, within } from 'storybook/test'

interface Item {
  done: boolean
  id: string
  title: string
}

type ItemTable = ReturnType<typeof useDataGrid<Item>>['table']

const records: Item[] = [
  { done: true, id: 'a', title: 'Alpha' },
  { done: false, id: 'b', title: 'Beta' },
]

const columns: DataGridColumnDef<Item>[] = [
  { accessorKey: 'title', header: 'Title', meta: { label: 'Title' } },
  {
    accessorKey: 'done',
    header: 'Done',
    meta: { label: 'Done', variant: 'checkbox' },
  },
]

function requireElement<T>(element: T | null | undefined, name: string): T {
  if (!element) throw new Error(`${name} not found`)
  return element
}

function rowWith(canvasElement: HTMLElement, text: string): HTMLElement {
  return requireElement(
    within(canvasElement).getByText(text).closest<HTMLElement>('[role="row"]'),
    `row with "${text}"`,
  )
}

function cellAt(row: HTMLElement, index: number): HTMLElement {
  return requireElement(
    within(row).getAllByRole('gridcell')[index],
    `cell ${index}`,
  )
}

function ItemsGrid({
  columns: gridColumns = columns,
  controls,
  data = records,
  tableOptions,
  enableRowSelection,
}: Readonly<{
  columns?: DataGridColumnDef<Item>[]
  controls?: (table: ItemTable) => ReactNode
  data?: Item[]
  enableRowSelection?: boolean
  tableOptions?: Parameters<typeof useDataGrid<Item>>[0]['tableOptions']
}>) {
  const { table } = useDataGrid<Item>({
    columns: gridColumns,
    data,
    enableRowSelection,
    getRowId: (item) => item.id,
    tableOptions,
  })

  return (
    <>
      {controls?.(table)}
      <DataGrid aria-label="Items" table={table} />
    </>
  )
}

const selectableColumns: DataGridColumnDef<Item>[] = [
  createSelectColumn<Item>(),
  ...columns,
]

const meta = {
  parameters: {
    layout: 'padded',
  },
  tags: ['!autodocs'],
  title: 'Patterns/Collection/Layouts/Data Grid/Rows',
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

export const RowDataChanges: Story = {
  render: () => {
    const [data, setData] = useState<Item[]>(records)

    return (
      <>
        <button
          onClick={() =>
            setData([
              { done: true, id: 'a', title: 'Alpha' },
              { done: false, id: 'b', title: 'Gamma' },
            ])
          }
          type="button"
        >
          Renomear Beta
        </button>
        <ItemsGrid data={data} />
      </>
    )
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    await expect(canvas.getByText('Beta')).toBeInTheDocument()
    await userEvent.click(canvas.getByRole('button', { name: 'Renomear Beta' }))

    await expect(canvas.queryByText('Beta')).toBeNull()
    await expect(canvas.getByText('Gamma')).toBeInTheDocument()
  },
}

export const HiddenColumnRemovesCells: Story = {
  render: () => (
    <ItemsGrid
      controls={(table) => (
        <button
          onClick={() => table.getColumn('done')?.toggleVisibility(false)}
          type="button"
        >
          Ocultar Done
        </button>
      )}
    />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    await expect(
      within(rowWith(canvasElement, 'Alpha')).getAllByRole('gridcell'),
    ).toHaveLength(2)
    await userEvent.click(canvas.getByRole('button', { name: 'Ocultar Done' }))

    await expect(
      within(rowWith(canvasElement, 'Alpha')).getAllByRole('gridcell'),
    ).toHaveLength(1)
  },
}

export const SelectedRowMarked: Story = {
  render: () => <ItemsGrid columns={selectableColumns} enableRowSelection />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    await userEvent.click(
      canvas.getAllByRole('checkbox', {
        name: 'Selecionar registro',
      })[1] as HTMLElement,
    )

    await expect(
      rowWith(canvasElement, 'Beta').getAttribute('aria-selected'),
    ).toBe('true')
    await expect(
      rowWith(canvasElement, 'Alpha').getAttribute('aria-selected'),
    ).not.toBe('true')
  },
}

export const CellFocusMoves: Story = {
  render: () => <ItemsGrid />,
  play: async ({ canvasElement }) => {
    const alphaCell = cellAt(rowWith(canvasElement, 'Alpha'), 0)
    const betaCell = cellAt(rowWith(canvasElement, 'Beta'), 0)

    await userEvent.click(alphaCell)
    await expect(document.activeElement).toBe(alphaCell)

    await userEvent.click(betaCell)
    await expect(document.activeElement).toBe(betaCell)
  },
}

export const MultiSelectableGrid: Story = {
  render: () => <ItemsGrid />,
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement)
        .getByRole('grid', { name: 'Items' })
        .getAttribute('aria-multiselectable'),
    ).toBe('true')
  },
}

export const RowsWithoutSelectionOmitAriaSelected: Story = {
  render: () => <ItemsGrid />,
  play: async ({ canvasElement }) => {
    const bodyRows = within(canvasElement).getAllByRole('row').slice(1)

    await expect(bodyRows).toHaveLength(2)
    for (const row of bodyRows) {
      await expect(row.hasAttribute('aria-selected')).toBe(false)
    }
  },
}

export const CheckboxVariantLabels: Story = {
  render: () => <ItemsGrid />,
  play: async ({ canvasElement }) => {
    await expect(
      within(rowWith(canvasElement, 'Alpha')).getByText('Marcado'),
    ).toBeInTheDocument()
    await expect(
      within(rowWith(canvasElement, 'Beta')).getByText('Desmarcado'),
    ).toBeInTheDocument()
  },
}

export const ResizeHandleBounds: Story = {
  render: () => <ItemsGrid />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const handle = () => canvas.getAllByRole('separator')[0] as HTMLElement

    await expect(handle().getAttribute('aria-valuemin')).toBe('80')
    await expect(handle().getAttribute('aria-valuemax')).not.toBeNull()

    handle().focus()
    for (let step = 0; step < 40; step += 1) {
      await userEvent.keyboard('{ArrowLeft}')
    }
    await expect(handle().getAttribute('aria-valuenow')).toBe('80')

    await userEvent.keyboard('{ArrowRight}')
    await expect(handle().getAttribute('aria-valuenow')).toBe('88')
  },
}

const metaColumns: DataGridColumnDef<Item>[] = [
  {
    accessorKey: 'title',
    cell: ({ table }) =>
      (table.options.meta as { tag?: string } | undefined)?.tag,
    header: 'Title',
  },
]

export const MetaChangeRerendersCells: Story = {
  render: () => {
    const [tag, setTag] = useState('one')

    return (
      <ItemsGrid
        columns={metaColumns}
        controls={() => (
          <button
            onClick={() =>
              setTag((current) => (current === 'one' ? 'two' : 'one'))
            }
            type="button"
          >
            Trocar meta
          </button>
        )}
        tableOptions={{ meta: { tag } as never }}
      />
    )
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    await expect(canvas.getAllByText('one')).toHaveLength(2)
    await userEvent.click(canvas.getByRole('button', { name: 'Trocar meta' }))
    await expect(canvas.getAllByText('two')).toHaveLength(2)
  },
}

export const EnableRowSelectionChangeDisablesCheckboxes: Story = {
  render: () => {
    const [enabled, setEnabled] = useState(true)

    return (
      <ItemsGrid
        columns={selectableColumns}
        controls={() => (
          <button onClick={() => setEnabled((value) => !value)} type="button">
            Trocar seleção
          </button>
        )}
        tableOptions={{ enableRowSelection: () => enabled }}
      />
    )
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const disabled = () =>
      canvas
        .getAllByRole('checkbox', { name: 'Selecionar registro' })
        .map((box) => box.hasAttribute('data-disabled'))

    await expect(disabled()).toEqual([false, false])
    await userEvent.click(
      canvas.getByRole('button', { name: 'Trocar seleção' }),
    )
    await expect(disabled()).toEqual([true, true])
  },
}

export const RowSelectionUpdatesCheckbox: Story = {
  render: () => <ItemsGrid columns={selectableColumns} enableRowSelection />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const boxes = () =>
      canvas.getAllByRole('checkbox', { name: 'Selecionar registro' })

    await userEvent.click(boxes()[0] as HTMLElement)

    await expect(boxes()[0]?.getAttribute('aria-checked')).toBe('true')
    await expect(boxes()[1]?.getAttribute('aria-checked')).toBe('false')
  },
}

export const SelectedRowHidesNumber: Story = {
  render: () => <ItemsGrid columns={selectableColumns} enableRowSelection />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    await userEvent.click(
      canvas.getAllByRole('checkbox', {
        name: 'Selecionar registro',
      })[0] as HTMLElement,
    )
    await userEvent.hover(document.body)

    const markers = canvasElement.querySelectorAll<HTMLElement>(
      '[data-slot="data-grid-row-marker"]',
    )
    await waitFor(() =>
      expect(
        getComputedStyle(requireElement(markers[0], 'marker')).opacity,
      ).toBe('0'),
    )
    await expect(
      getComputedStyle(requireElement(markers[1], 'marker')).opacity,
    ).not.toBe('0')
  },
}

const swappedColumns: DataGridColumnDef<Item>[] = [
  { accessorKey: 'title', cell: () => 'swapped', header: 'Title' },
]

export const ColumnDefinitionChangeRerendersCells: Story = {
  render: () => {
    const [swapped, setSwapped] = useState(false)

    return (
      <ItemsGrid
        columns={swapped ? swappedColumns : metaColumns}
        controls={() => (
          <button onClick={() => setSwapped(true)} type="button">
            Trocar colunas
          </button>
        )}
      />
    )
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    await userEvent.click(
      canvas.getByRole('button', { name: 'Trocar colunas' }),
    )

    await expect(canvas.getAllByText('swapped')).toHaveLength(2)
  },
}

export const HiddenColumnRestoresSelectedCell: Story = {
  render: () => (
    <ItemsGrid
      controls={(table) => (
        <>
          <button
            onClick={() => table.getColumn('done')?.toggleVisibility(false)}
            type="button"
          >
            Ocultar Done
          </button>
          <button
            onClick={() => table.getColumn('done')?.toggleVisibility(true)}
            type="button"
          >
            Mostrar Done
          </button>
        </>
      )}
    />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const doneCell = () => cellAt(rowWith(canvasElement, 'Alpha'), 1)

    await userEvent.click(doneCell())
    await userEvent.click(canvas.getByRole('button', { name: 'Ocultar Done' }))
    await userEvent.click(canvas.getByRole('button', { name: 'Mostrar Done' }))

    await expect(doneCell().getAttribute('data-selected')).toBe('true')
  },
}

export const FilterRemovalRestoresSelectedCell: Story = {
  render: () => (
    <ItemsGrid
      controls={(table) => (
        <CollectionToolbar>
          <DataGridSearch placeholder="Buscar…" table={table} />
        </CollectionToolbar>
      )}
    />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const search = canvas.getByRole('searchbox', { name: 'Buscar…' })

    await userEvent.click(cellAt(rowWith(canvasElement, 'Beta'), 0))
    await userEvent.type(search, 'Alpha')

    await expect(canvas.queryByText('Beta')).toBeNull()
    await userEvent.clear(search)

    await expect(
      cellAt(rowWith(canvasElement, 'Beta'), 0).getAttribute('data-selected'),
    ).toBe('true')
  },
}

export const DroppedRowClearsSelectedCell: Story = {
  render: () => {
    const [data, setData] = useState<Item[]>(records)

    return (
      <ItemsGrid
        controls={() => (
          <>
            <button
              onClick={() =>
                setData([
                  records[0] as Item,
                  { done: false, id: 'c', title: 'Gamma' },
                ])
              }
              type="button"
            >
              Remover Beta
            </button>
            <button onClick={() => setData(records)} type="button">
              Restaurar registros
            </button>
          </>
        )}
        data={data}
      />
    )
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    await userEvent.click(cellAt(rowWith(canvasElement, 'Beta'), 0))
    await userEvent.click(canvas.getByRole('button', { name: 'Remover Beta' }))
    await userEvent.click(
      canvas.getByRole('button', { name: 'Restaurar registros' }),
    )

    await expect(
      cellAt(rowWith(canvasElement, 'Beta'), 0).getAttribute('data-selected'),
    ).toBeNull()
  },
}

const stageOptions = [
  { label: 'Open', value: 'open' },
  { label: 'Done', value: 'done' },
]

interface Task {
  id: string
  stage: string
  title: string
}

const tasks: Task[] = [
  { id: 'a', stage: 'open', title: 'Alpha' },
  { id: 'b', stage: 'done', title: 'Beta' },
]

function selectColumns(options: { label: string; value: string }[]) {
  return [
    { accessorKey: 'title', header: 'Title', meta: { label: 'Title' } },
    {
      accessorKey: 'stage',
      header: 'Stage',
      meta: {
        editable: true,
        label: 'Stage',
        options,
        variant: 'select' as const,
      },
    },
  ] satisfies DataGridColumnDef<Task>[]
}

function TasksGrid({
  data = tasks,
  options = stageOptions,
  controls,
}: Readonly<{
  controls?: ReactNode
  data?: Task[]
  options?: { label: string; value: string }[]
}>) {
  const { table } = useDataGrid<Task>({
    columns: selectColumns(options),
    data,
    getRowId: (task) => task.id,
    onCellValueChange: () => {},
  })

  return (
    <>
      {controls}
      <DataGrid aria-label="Tasks" table={table} />
    </>
  )
}

export const SelectLabelsChange: Story = {
  render: () => {
    const [localized, setLocalized] = useState(false)

    return (
      <TasksGrid
        controls={
          <button onClick={() => setLocalized(true)} type="button">
            Trocar rótulos
          </button>
        }
        options={
          localized
            ? [
                { label: 'Aberto', value: 'open' },
                { label: 'Concluído', value: 'done' },
              ]
            : stageOptions
        }
      />
    )
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    await expect(
      canvas.getByRole('combobox', { name: 'Stage: Open' }).textContent,
    ).toBe('Open')

    await userEvent.click(
      canvas.getByRole('button', { name: 'Trocar rótulos' }),
    )

    await expect(
      canvas.getByRole('combobox', { name: 'Stage: Aberto' }).textContent,
    ).toBe('Aberto')
  },
}

export const SelectValueChange: Story = {
  render: () => {
    const [data, setData] = useState<Task[]>(tasks)

    return (
      <TasksGrid
        controls={
          <button
            onClick={() =>
              setData((current) =>
                current.map((task) =>
                  task.id === 'a' ? { ...task, stage: 'done' } : task,
                ),
              )
            }
            type="button"
          >
            Concluir Alpha
          </button>
        }
        data={data}
      />
    )
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    await userEvent.click(
      canvas.getByRole('button', { name: 'Concluir Alpha' }),
    )

    await expect(
      within(rowWith(canvasElement, 'Alpha')).getByRole('combobox', {
        name: 'Stage: Done',
      }).textContent,
    ).toBe('Done')
  },
}

export const SelectOpensOnSecondClick: Story = {
  render: () => <TasksGrid />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const trigger = canvas.getByRole('combobox', { name: 'Stage: Open' })
    const cell = requireElement(
      trigger.closest<HTMLElement>('[role="gridcell"]'),
      'select cell',
    )

    await userEvent.click(cell)
    await expect(trigger.getAttribute('aria-expanded')).toBe('false')

    await userEvent.click(cell)
    await expect(trigger.getAttribute('aria-expanded')).toBe('true')
  },
}

const dateColumns: DataGridColumnDef<{ id: string; updatedAt: string }>[] = [
  {
    accessorKey: 'updatedAt',
    header: 'Atualizado em',
    meta: { label: 'Atualizado em', variant: 'date' },
  },
]

export const DateValueOnItsDay: Story = {
  render: () => {
    const { table } = useDataGrid<{ id: string; updatedAt: string }>({
      columns: dateColumns,
      data: [{ id: 'a', updatedAt: '2026-08-04' }],
      getRowId: (record) => record.id,
    })

    return <DataGrid aria-label="Datas" table={table} />
  },
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByText(
        new Date(2026, 7, 4).toLocaleDateString(),
      ),
    ).toBeInTheDocument()
  },
}
