import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  CollectionToolbar,
  createSelectColumn,
  DataGrid,
  type DataGridColumnDef,
  DataGridSearch,
  DataGridSelectionSummary,
  useDataGrid,
} from '@tc96/parttens'
import { expect, userEvent, within } from 'storybook/test'

interface Record {
  id: string
  owner: string
  title: string
}

const records: Record[] = [
  { id: 'a', owner: 'Ana', title: 'Retomada de inativos' },
  { id: 'b', owner: 'Bruno', title: 'Aniversariantes' },
]

const columns: DataGridColumnDef<Record>[] = [
  { accessorKey: 'title', header: 'Item', meta: { label: 'Item' } },
  {
    accessorKey: 'owner',
    header: 'Responsável',
    meta: { label: 'Responsável' },
  },
]

const searchRecords: Record[] = [
  { id: 'a', owner: 'Ana', title: 'Aniversariantes de março' },
  { id: 'b', owner: 'Bruno', title: 'Retomada de inativos' },
  { id: 'c', owner: 'Carla', title: 'Aniversariantes de abril' },
]

function SearchGrid() {
  const { table } = useDataGrid<Record>({
    columns,
    data: searchRecords,
    enablePagination: true,
    getRowId: (record) => record.id,
    pageSize: 1,
    tableOptions: { autoResetPageIndex: false },
  })

  return (
    <>
      <CollectionToolbar>
        <DataGridSearch placeholder="Buscar…" table={table} />
      </CollectionToolbar>
      <DataGrid aria-label="Itens" table={table} />
    </>
  )
}

function SummaryGrid() {
  const { table } = useDataGrid<Record>({
    columns: [createSelectColumn<Record>(), ...columns],
    data: records,
    enableRowSelection: true,
    getRowId: (record) => record.id,
  })

  return (
    <>
      <CollectionToolbar>
        <DataGridSelectionSummary table={table} />
      </CollectionToolbar>
      <DataGrid aria-label="Itens" table={table} />
    </>
  )
}

function SelectionActionsGrid() {
  const { table } = useDataGrid<Record>({
    columns: [createSelectColumn<Record>(), ...columns],
    data: records,
    enableRowSelection: true,
    getRowId: (record) => record.id,
  })

  return (
    <DataGrid
      aria-label="Itens"
      selectionActions={({ selectedCount }) => (
        <span>{selectedCount} selecionado</span>
      )}
      table={table}
    />
  )
}

const meta = {
  parameters: {
    layout: 'padded',
  },
  tags: ['!autodocs'],
  title: 'Patterns/Collection/Layouts/Data Grid/Toolbar',
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

export const SearchReturnsToFirstPage: Story = {
  render: () => <SearchGrid />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const search = canvas.getByRole('searchbox', { name: 'Buscar…' })

    await userEvent.click(
      canvas.getByRole('button', { name: 'Próxima página' }),
    )
    await expect(canvas.getByText('Retomada de inativos')).toBeInTheDocument()

    await userEvent.type(search, 'Aniversariantes')

    await expect(
      canvas.getByText('Aniversariantes de março'),
    ).toBeInTheDocument()
    await expect(canvas.queryByText('Aniversariantes de abril')).toBeNull()
  },
}

export const SelectionSummaryAgreesWithCount: Story = {
  render: () => <SummaryGrid />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const rowCheckbox = canvas.getAllByRole('checkbox', {
      name: 'Selecionar registro',
    })

    await expect(canvas.getByText('0 selecionados')).toBeInTheDocument()

    await userEvent.click(rowCheckbox[0] as HTMLElement)
    await expect(canvas.getByText('1 selecionado')).toBeInTheDocument()

    await userEvent.click(canvas.getAllByRole('checkbox')[0] as HTMLElement)
    await expect(canvas.getByText('2 selecionados')).toBeInTheDocument()
  },
}

export const SelectionActionsShowForSelectedRows: Story = {
  render: () => <SelectionActionsGrid />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    await expect(canvas.queryByText('1 selecionado')).toBeNull()

    await userEvent.click(
      canvas.getAllByRole('checkbox', {
        name: 'Selecionar registro',
      })[0] as HTMLElement,
    )

    await expect(canvas.getByText('1 selecionado')).toBeInTheDocument()
  },
}
