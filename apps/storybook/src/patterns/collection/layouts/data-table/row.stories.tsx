import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  DataTable,
  type DataTableColumnDef,
  type DataTableProps,
  useDataTable,
} from '@tc96/parttens'
import { type ReactElement, useState } from 'react'
import { expect, fn, userEvent, within } from 'storybook/test'

interface Campaign {
  budget: number
  id: string
  title: string
}

interface CampaignMeta {
  currency: string
}

const campaigns: Campaign[] = [
  { budget: 100, id: 'a', title: 'Retomada de inativos' },
  { budget: 250, id: 'b', title: 'Aniversariantes' },
  { budget: 50, id: 'c', title: 'Indicação premiada' },
]

function selectColumn(): DataTableColumnDef<Campaign> {
  return {
    cell: ({ row }) => (
      <input
        aria-label={`Selecionar ${row.original.title}`}
        checked={row.getIsSelected()}
        disabled={!row.getCanSelect()}
        onChange={row.getToggleSelectedHandler()}
        type="checkbox"
      />
    ),
    header: 'Seleção',
    id: 'select',
  }
}

function budgetColumn(prefix = ''): DataTableColumnDef<Campaign> {
  return {
    accessorKey: 'budget',
    cell: ({ row }) => `${prefix}${row.original.budget}`,
    header: 'Verba',
  }
}

const titleColumn: DataTableColumnDef<Campaign> = {
  accessorKey: 'title',
  header: 'Campanha',
}

interface HarnessProps {
  columns?: DataTableColumnDef<Campaign>[]
  controls?: ReactElement
  data?: Campaign[]
  enableRowSelection?: boolean
  getRowOpenLabel?: DataTableProps<Campaign>['getRowOpenLabel']
  meta?: CampaignMeta
  onRowClick?: DataTableProps<Campaign>['onRowClick']
}

function Harness({
  columns = [selectColumn(), titleColumn, budgetColumn()],
  controls,
  data = campaigns,
  enableRowSelection = true,
  getRowOpenLabel,
  meta,
  onRowClick,
}: Readonly<HarnessProps>): ReactElement {
  const { table } = useDataTable<Campaign>({
    columns,
    data,
    enableRowSelection,
    getRowId: (campaign) => campaign.id,
    tableOptions: { meta },
  })

  return (
    <>
      {controls}
      <DataTable
        aria-label="Campanhas"
        getRowOpenLabel={getRowOpenLabel}
        onRowClick={onRowClick}
        table={table}
      />
    </>
  )
}

const meta = {
  parameters: {
    layout: 'padded',
  },
  tags: ['!autodocs'],
  title: 'Patterns/Collection/Layouts/Data Table/Rows',
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

const onRowClick = fn()

export const SelectingUpdatesCheckboxAndRow: Story = {
  render: () => <Harness />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    await userEvent.click(canvas.getByLabelText('Selecionar Aniversariantes'))

    await expect(
      canvas.getByLabelText('Selecionar Aniversariantes'),
    ).toBeChecked()
    await expect(
      canvasElement.querySelectorAll('tr[data-state="selected"]'),
    ).toHaveLength(1)
  },
}

export const HiddenColumnRemovesCellsAndRestores: Story = {
  render: () => <HiddenColumnHarness />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const firstRowCells = () =>
      canvasElement.querySelectorAll('tbody tr:first-child td')

    await expect(firstRowCells()).toHaveLength(3)

    await userEvent.click(canvas.getByRole('button', { name: 'Ocultar Verba' }))
    await expect(firstRowCells()).toHaveLength(2)
    await expect(canvas.queryByText('250')).toBeNull()

    await userEvent.click(canvas.getByRole('button', { name: 'Mostrar Verba' }))
    await expect(firstRowCells()).toHaveLength(3)
    await expect(canvas.getByText('250')).toBeInTheDocument()
  },
}

function HiddenColumnHarness(): ReactElement {
  const { table } = useDataTable<Campaign>({
    columns: [selectColumn(), titleColumn, budgetColumn()],
    data: campaigns,
    enableRowSelection: true,
    getRowId: (campaign) => campaign.id,
  })

  return (
    <>
      <button
        onClick={() => table.getColumn('budget')?.toggleVisibility(false)}
        type="button"
      >
        Ocultar Verba
      </button>
      <button
        onClick={() => table.getColumn('budget')?.toggleVisibility(true)}
        type="button"
      >
        Mostrar Verba
      </button>
      <DataTable aria-label="Campanhas" table={table} />
    </>
  )
}

export const NewCellRendererRerendersRows: Story = {
  render: () => {
    const [prefix, setPrefix] = useState('')

    return (
      <Harness
        columns={[selectColumn(), titleColumn, budgetColumn(prefix)]}
        controls={
          <button onClick={() => setPrefix(prefix ? '' : 'R$ ')} type="button">
            Trocar formato
          </button>
        }
      />
    )
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    await expect(canvas.getByText('250')).toBeInTheDocument()
    await userEvent.click(
      canvas.getByRole('button', { name: 'Trocar formato' }),
    )

    await expect(canvas.getByText('R$ 250')).toBeInTheDocument()
  },
}

export const MetaChangeRerendersRows: Story = {
  render: () => {
    const [currency, setCurrency] = useState('R$ ')
    const metaColumn: DataTableColumnDef<Campaign> = {
      accessorKey: 'budget',
      cell: ({ row, table }) =>
        `${(table.options.meta as CampaignMeta | undefined)?.currency}${row.original.budget}`,
      header: 'Verba',
    }

    return (
      <Harness
        columns={[selectColumn(), titleColumn, metaColumn]}
        controls={
          <button
            onClick={() =>
              setCurrency((value) => (value === 'R$ ' ? 'US$ ' : 'R$ '))
            }
            type="button"
          >
            Trocar moeda
          </button>
        }
        meta={{ currency }}
      />
    )
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    await expect(canvas.getByText('R$ 250')).toBeInTheDocument()
    await userEvent.click(canvas.getByRole('button', { name: 'Trocar moeda' }))

    await expect(canvas.getByText('US$ 250')).toBeInTheDocument()
  },
}

export const EnableRowSelectionChangeDisablesCheckbox: Story = {
  render: () => {
    const [enabled, setEnabled] = useState(true)

    return (
      <Harness
        controls={
          <button onClick={() => setEnabled((value) => !value)} type="button">
            Trocar seleção
          </button>
        }
        enableRowSelection={enabled}
      />
    )
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const checkbox = () =>
      canvas.getByLabelText('Selecionar Aniversariantes') as HTMLInputElement

    await expect(checkbox().disabled).toBe(false)
    await userEvent.click(
      canvas.getByRole('button', { name: 'Trocar seleção' }),
    )

    await expect(checkbox().disabled).toBe(true)
  },
}

export const NewRowDataRerendersChangedRow: Story = {
  render: () => {
    const [data, setData] = useState(campaigns)

    return (
      <Harness
        controls={
          <button
            onClick={() =>
              setData(
                campaigns.map((campaign) =>
                  campaign.id === 'b' ? { ...campaign, budget: 999 } : campaign,
                ),
              )
            }
            type="button"
          >
            Ajustar orçamento
          </button>
        }
        data={data}
      />
    )
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    await expect(canvas.getByText('250')).toBeInTheDocument()
    await userEvent.click(
      canvas.getByRole('button', { name: 'Ajustar orçamento' }),
    )

    await expect(canvas.getByText('999')).toBeInTheDocument()
    await expect(canvas.queryByText('250')).toBeNull()
  },
}

export const WithoutRowClickNoTriggers: Story = {
  render: () => <Harness />,
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).queryByRole('button', { name: 'Abrir registro' }),
    ).toBeNull()
  },
}

export const EachBodyRowGetsTriggerInFirstCell: Story = {
  render: () => <Harness onRowClick={() => undefined} />,
  play: async ({ canvasElement }) => {
    const triggers = within(canvasElement).getAllByRole('button', {
      name: 'Abrir registro',
    })

    await expect(triggers).toHaveLength(campaigns.length)
    for (const trigger of triggers) {
      await expect(trigger.tagName).toBe('BUTTON')
      await expect(trigger.closest('td')?.previousElementSibling).toBeNull()
    }
  },
}

export const OpenLabelNamesEachTrigger: Story = {
  render: () => (
    <Harness
      getRowOpenLabel={(row) => `Abrir ${row.original.title}`}
      onRowClick={() => undefined}
    />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    await expect(
      canvas.getByRole('button', { name: 'Abrir Aniversariantes' }),
    ).toBeInTheDocument()
    await expect(
      canvas.getByRole('button', { name: 'Abrir Indicação premiada' }),
    ).toBeInTheDocument()
  },
}

export const TriggerCallsOnRowClickWithItsRow: Story = {
  render: () => (
    <Harness
      getRowOpenLabel={(row) => `Abrir ${row.original.title}`}
      onRowClick={onRowClick}
    />
  ),
  play: async ({ canvasElement }) => {
    onRowClick.mockClear()
    await userEvent.click(
      within(canvasElement).getByRole('button', {
        name: 'Abrir Aniversariantes',
      }),
    )

    await expect(onRowClick).toHaveBeenCalledTimes(1)
    const row = onRowClick.mock.calls[0]?.[0] as {
      id: string
      original: Campaign
    }
    await expect(row.id).toBe('b')
    await expect(row.original).toEqual(campaigns[1])
  },
}

export const CheckboxSelectsWithoutOpeningRow: Story = {
  render: () => <Harness onRowClick={onRowClick} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    onRowClick.mockClear()
    await userEvent.click(canvas.getByLabelText('Selecionar Aniversariantes'))

    await expect(onRowClick).not.toHaveBeenCalled()
    await expect(
      canvas.getByLabelText('Selecionar Aniversariantes'),
    ).toBeChecked()
  },
}

export const LabelChangeRerendersOnlyTrigger: Story = {
  render: () => {
    const [verb, setVerb] = useState('Abrir')

    return (
      <Harness
        controls={
          <button
            onClick={() =>
              setVerb((value) => (value === 'Abrir' ? 'Ver' : 'Abrir'))
            }
            type="button"
          >
            Trocar verbo
          </button>
        }
        getRowOpenLabel={(row) => `${verb} ${row.original.title}`}
        onRowClick={() => undefined}
      />
    )
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    await userEvent.click(canvas.getByRole('button', { name: 'Trocar verbo' }))

    await expect(
      canvas.getByRole('button', { name: 'Ver Aniversariantes' }),
    ).toBeInTheDocument()
    await expect(
      canvas.queryByRole('button', { name: 'Abrir Aniversariantes' }),
    ).toBeNull()
  },
}
