import type { Meta, StoryObj } from '@storybook/react-vite'
import type { SortingState } from '@tanstack/react-table'
import {
  ActionBar,
  CollectionToolbar,
  createDataGridConditionFilterFn,
  createDataTableSelectColumn,
  type DataGridCondition,
  DataGridConditionFilters,
  DataGridDensitySubmenu,
  DataGridSortSubmenu,
  DataTable,
  type DataTableCellValueChange,
  type DataTableColumnDef,
  type DataTableColumnMeta,
  DataTableColumnsSubmenu,
  type DataTableDensity,
  type DataTableFeatures,
  type DataTableTable,
  useDataTable,
  ViewSettingsMenu,
  ViewSettingsSection,
} from '@tc96/ui/patterns'
import { useCallback, useMemo, useState } from 'react'
import { expect, fn, screen, userEvent, waitFor, within } from 'storybook/test'
import {
  conditionLabels,
  operatorLabels,
} from '../data-grid/data-grid-table-blocks.tsx'
import { DataTableCanvas } from './data-table-canvas.tsx'

const meta = {
  decorators: [DataTableCanvas],
  tags: ['!autodocs'],
  title: 'Patterns/Collection/Layouts/Data Table/Behavior',
} satisfies Meta

export default meta

type Story = StoryObj<typeof meta>

interface Member {
  id: string
  name: string
  role: string
  seats: number
}

const members: Member[] = [
  { id: 'm1', name: 'Ana Lima', role: 'admin', seats: 3 },
  { id: 'm2', name: 'Bruno Melo', role: 'editor', seats: 1 },
  { id: 'm3', name: 'Carla Dias', role: 'admin', seats: 2 },
  { id: 'm4', name: 'Diego Rocha', role: 'leitor', seats: 1 },
]

const memberColumns: DataTableColumnDef<Member>[] = [
  createDataTableSelectColumn<Member>({
    getRowLabel: (member) => `Selecionar ${member.name}`,
    selectAllLabel: 'Selecionar todos os membros',
  }),
  { accessorKey: 'name', header: 'Nome', meta: { label: 'Nome' } },
  { accessorKey: 'role', header: 'Papel', meta: { label: 'Papel' } },
  {
    accessorKey: 'seats',
    header: 'Licenças',
    meta: { align: 'end', label: 'Licenças' },
  },
]

const onSortingChange = fn()
const onDensityChange = fn()
const onColumnVisibilityChange = fn()

function MembersToolbar({
  table,
}: Readonly<{ table: DataTableTable<Member> }>) {
  return (
    <CollectionToolbar
      right={
        <ViewSettingsMenu onClearFilters={() => undefined}>
          <ViewSettingsSection label="Exibição">
            <DataGridSortSubmenu table={table} />
            <DataGridDensitySubmenu table={table} />
            <DataTableColumnsSubmenu table={table} />
          </ViewSettingsSection>
        </ViewSettingsMenu>
      }
    />
  )
}

function MembersTable() {
  const [sorting, setSorting] = useState<SortingState>([])
  const [density, setDensity] = useState<DataTableDensity>('short')
  const { table } = useDataTable<Member>({
    columns: memberColumns,
    data: members,
    density,
    enableRowSelection: true,
    enableSorting: true,
    getRowId: (member) => member.id,
    onColumnVisibilityChange,
    onDensityChange: (next) => {
      onDensityChange(next)
      setDensity(next)
    },
    onSortingChange: (next) => {
      onSortingChange(next)
      setSorting(next)
    },
    sorting,
  })

  return (
    <div className="flex flex-col gap-2">
      <MembersToolbar table={table} />
      <DataTable<Member>
        aria-label="Membros"
        selectionActions={({ clearSelection, selectedCount, selectedRows }) => (
          <ActionBar
            actions={[{ items: [{ label: 'Arquivar' }] }]}
            clearSelectionLabel="Limpar seleção"
            onClearSelection={clearSelection}
            selectedCount={selectedCount}
            selectedRows={selectedRows}
          />
        )}
        table={table}
      />
    </div>
  )
}

const tableOf = (canvasElement: HTMLElement, name = 'Membros') =>
  within(canvasElement).getByRole('table', { name })

const firstCellTexts = (table: HTMLElement, column = 1) =>
  [...table.querySelectorAll('tbody tr')].map(
    (row) => row.querySelectorAll('td')[column]?.textContent,
  )

const openViewSettings = async (canvasElement: HTMLElement, item: string) => {
  await userEvent.click(
    within(canvasElement).getByRole('button', { name: 'Exibição' }),
  )
  await userEvent.click(await screen.findByRole('menuitem', { name: item }))
}

const closeMenus = async () => {
  await userEvent.keyboard('{Escape}')
  await userEvent.keyboard('{Escape}')
  await waitFor(() => expect(screen.queryByRole('menu')).toBeNull())
}

export const SelectColumnOpensTheSelectionActions: Story = {
  render: () => <MembersTable />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const actionsSlot = () =>
      canvasElement.querySelector('[data-slot="data-table-selection-actions"]')
    await expect(actionsSlot()).toBeNull()

    await userEvent.click(
      canvas.getByRole('checkbox', { name: 'Selecionar Bruno Melo' }),
    )
    await waitFor(() => expect(actionsSlot()).not.toBeNull())
    await expect(
      within(actionsSlot() as HTMLElement).getByText('1 selecionado'),
    ).toBeVisible()

    await userEvent.click(
      canvas.getByRole('checkbox', { name: 'Selecionar todos os membros' }),
    )
    await expect(
      within(actionsSlot() as HTMLElement).getByText('4 selecionados'),
    ).toBeVisible()

    await userEvent.click(
      canvas.getByRole('button', { name: 'Limpar seleção' }),
    )
    await waitFor(() => expect(actionsSlot()).toBeNull())
  },
}

export const SortSubmenuDrivesAControlledTable: Story = {
  render: () => <MembersTable />,
  play: async ({ canvasElement }) => {
    onSortingChange.mockClear()
    await openViewSettings(canvasElement, 'Ordenar por')
    await userEvent.click(
      await screen.findByRole('menuitem', { name: 'Nome: decrescente' }),
    )
    await expect(onSortingChange).toHaveBeenLastCalledWith([
      { desc: true, id: 'name' },
    ])
    await waitFor(() =>
      expect(firstCellTexts(tableOf(canvasElement))[0]).toBe('Diego Rocha'),
    )
    await closeMenus()
  },
}

export const DensitySubmenuChangesTheRowHeight: Story = {
  render: () => <MembersTable />,
  play: async ({ canvasElement }) => {
    onDensityChange.mockClear()
    const table = tableOf(canvasElement)
    const row = () => table.querySelector('tbody tr') as HTMLElement
    await expect(table).toHaveAttribute('data-density', 'short')
    const shortHeight = row().getBoundingClientRect().height

    await openViewSettings(canvasElement, 'Altura das linhas')
    await userEvent.click(
      await screen.findByRole('menuitemradio', { name: 'Alta' }),
    )
    await expect(onDensityChange).toHaveBeenLastCalledWith('tall')
    await waitFor(() => expect(table).toHaveAttribute('data-density', 'tall'))
    await expect(row().getBoundingClientRect().height).toBe(shortHeight + 20)
    await closeMenus()
  },
}

export const ColumnVisibilityReportsTheResolvedValue: Story = {
  render: () => <MembersTable />,
  play: async ({ canvasElement }) => {
    onColumnVisibilityChange.mockClear()
    await openViewSettings(canvasElement, 'Colunas')
    await userEvent.click(
      await screen.findByRole('menuitemcheckbox', { name: 'Papel' }),
    )
    await expect(onColumnVisibilityChange).toHaveBeenLastCalledWith({
      role: false,
    })
    await expect(
      within(tableOf(canvasElement)).queryByRole('columnheader', {
        name: 'Papel',
      }),
    ).toBeNull()
    await closeMenus()
  },
}

const memberFields = [
  {
    columnId: 'role',
    kind: 'option' as const,
    label: 'Papel',
    options: [
      { label: 'Administrador', value: 'admin' },
      { label: 'Editor', value: 'editor' },
      { label: 'Leitor', value: 'leitor' },
    ],
  },
]

function FilteredMembersTable() {
  const [conditions, setConditions] = useState<DataGridCondition[]>([
    { columnId: 'role', id: 'c1', operator: 'is', value: ['admin'] },
  ])
  const filterFn = useMemo(
    () =>
      createDataGridConditionFilterFn<Member, DataTableFeatures>(memberFields),
    [],
  )
  const { table } = useDataTable<Member>({
    columns: memberColumns,
    data: members,
    getRowId: (member) => member.id,
    tableOptions: {
      globalFilterFn: filterFn,
      initialState: { globalFilter: conditions },
    },
  })
  const onConditionsChange = useCallback(
    (next: DataGridCondition[]) => {
      setConditions(next)
      table.setGlobalFilter(next.length ? next : '')
    },
    [table],
  )

  return (
    <div className="flex flex-col gap-2">
      <DataGridConditionFilters
        conditions={conditions}
        fields={memberFields}
        labels={conditionLabels}
        onConditionsChange={onConditionsChange}
        operatorLabels={operatorLabels}
      />
      <DataTable<Member> aria-label="Membros" table={table} />
    </div>
  )
}

export const ConditionFiltersFilterATable: Story = {
  render: () => <FilteredMembersTable />,
  play: async ({ canvasElement }) => {
    const table = tableOf(canvasElement)
    await expect(firstCellTexts(table)).toEqual(['Ana Lima', 'Carla Dias'])

    await userEvent.click(
      within(canvasElement).getByRole('button', { name: 'Limpar filtros' }),
    )
    await waitFor(() => expect(firstCellTexts(table)).toHaveLength(4))
  },
}

interface Product {
  id: string
  name: string
  price: number
}

const PRICE_MESSAGE = 'O preço não pode ser negativo.'

const productColumns: DataTableColumnDef<Product>[] = [
  {
    accessorKey: 'name',
    header: 'Produto',
    meta: {
      editable: true,
      getCellLabel: (column, value) => `Editar ${column}, ${value}`,
      label: 'Produto',
    } satisfies DataTableColumnMeta<Product>,
  },
  {
    accessorKey: 'price',
    header: 'Preço',
    meta: {
      align: 'end',
      editable: true,
      formatValue: (value) => `R$ ${value}`,
      label: 'Preço',
      validate: (value) => (Number(value) < 0 ? PRICE_MESSAGE : undefined),
      variant: 'number',
    } satisfies DataTableColumnMeta<Product>,
  },
]

const onCellValueChange = fn()

function InventoryTable() {
  const [products, setProducts] = useState<Product[]>([
    { id: 'p1', name: 'Caderno', price: 10 },
    { id: 'p2', name: 'Caneta', price: 3 },
  ])
  const { table } = useDataTable<Product>({
    columns: productColumns,
    data: products,
    getRowId: (product) => product.id,
    onCellValueChange: (change: DataTableCellValueChange) => {
      onCellValueChange(change)
      setProducts((current) =>
        current.map((product) =>
          product.id === change.rowId
            ? {
                ...product,
                [change.columnId]:
                  change.columnId === 'price'
                    ? Number(change.value)
                    : change.value,
              }
            : product,
        ),
      )
    },
  })

  return <DataTable<Product> aria-label="Estoque" table={table} />
}

export const EditableCellValidatesAndCommits: Story = {
  render: () => <InventoryTable />,
  play: async ({ canvasElement }) => {
    onCellValueChange.mockClear()
    const table = within(tableOf(canvasElement, 'Estoque'))
    await userEvent.click(table.getByRole('button', { name: 'Preço: R$ 10' }))
    const input = table.getByRole('textbox', { name: 'Preço' })
    await userEvent.clear(input)
    await userEvent.type(input, '-1')
    await expect(input).toHaveAttribute('aria-invalid', 'true')
    await expect(input).toHaveAccessibleDescription(PRICE_MESSAGE)
    await expect(input.closest('td')).toHaveAttribute('data-invalid')
    await userEvent.keyboard('{Enter}')
    await expect(onCellValueChange).not.toHaveBeenCalled()

    await userEvent.clear(input)
    await userEvent.type(input, '25{Enter}')
    await expect(onCellValueChange).toHaveBeenCalledWith({
      columnId: 'price',
      rowId: 'p1',
      value: '25',
    })
    await expect(
      await table.findByRole('button', { name: 'Preço: R$ 25' }),
    ).toHaveFocus()
  },
}

export const EscapeRestoresTheStoredValue: Story = {
  render: () => <InventoryTable />,
  play: async ({ canvasElement }) => {
    onCellValueChange.mockClear()
    const table = within(tableOf(canvasElement, 'Estoque'))
    await userEvent.click(
      table.getByRole('button', { name: 'Editar Produto, Caneta' }),
    )
    const input = table.getByRole('textbox', { name: 'Produto' })
    await userEvent.type(input, ' azul')
    await userEvent.keyboard('{Escape}')
    await expect(onCellValueChange).not.toHaveBeenCalled()
    await expect(
      table.getByRole('button', { name: 'Editar Produto, Caneta' }),
    ).toBeVisible()
  },
}
