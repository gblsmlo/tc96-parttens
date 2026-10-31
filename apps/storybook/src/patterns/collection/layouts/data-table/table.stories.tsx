import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  DataTable,
  type DataTableColumnDef,
  type DataTableProps,
  useDataTable,
} from '@tc96/parttens'
import type { ReactElement } from 'react'
import { expect, fn, screen, userEvent, waitFor, within } from 'storybook/test'

interface Campaign {
  budget: number
  id: string
  title: string
}

const campaigns: Campaign[] = [
  { budget: 100, id: 'a', title: 'Retomada de inativos' },
  { budget: 250, id: 'b', title: 'Aniversariantes' },
  { budget: 50, id: 'c', title: 'Indicação premiada' },
]

interface CampaignTableProps extends Omit<DataTableProps<Campaign>, 'table'> {
  data?: Campaign[]
  enableColumnResizing?: boolean
  enablePagination?: boolean
  withAggregation?: boolean
  withFooter?: boolean
}

function CampaignTable({
  data = campaigns,
  enableColumnResizing = false,
  enablePagination = false,
  withAggregation = false,
  withFooter = false,
  ...props
}: Readonly<CampaignTableProps>): ReactElement {
  const { table } = useDataTable<Campaign>({
    columns: [
      {
        cell: ({ row }) => (
          <input
            aria-label={`Selecionar ${row.original.title}`}
            checked={row.getIsSelected()}
            onChange={row.getToggleSelectedHandler()}
            type="checkbox"
          />
        ),
        enableResizing: false,
        header: 'Seleção',
        id: 'select',
        size: 40,
      },
      {
        accessorKey: 'title',
        header: 'Campanha',
        minSize: 120,
        size: 200,
        ...(withFooter ? { footer: 'Total' } : {}),
      },
      {
        accessorKey: 'budget',
        header: 'Verba',
        ...(withAggregation
          ? {
              meta: {
                aggregations: ['count', 'sum'],
                align: 'end',
                formatAggregation: (value: number, aggregation: string) =>
                  aggregation === 'sum' ? `R$ ${value}` : String(value),
              },
            }
          : {}),
        ...(withFooter
          ? {
              footer: ({ table: instance }) =>
                instance
                  .getCoreRowModel()
                  .rows.reduce((sum, row) => sum + row.original.budget, 0),
            }
          : {}),
      },
    ] as DataTableColumnDef<Campaign>[],
    data,
    enableColumnResizing,
    enablePagination,
    enableRowSelection: true,
    getRowId: (campaign) => campaign.id,
    pageSize: 2,
  })

  return <DataTable aria-label="Campanhas" table={table} {...props} />
}

function footerOf(canvasElement: HTMLElement): HTMLElement | null {
  return canvasElement.querySelector<HTMLElement>('tfoot')
}

const meta = {
  parameters: {
    layout: 'padded',
  },
  tags: ['!autodocs'],
  title: 'Patterns/Collection/Layouts/Data Table/Table',
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

export const SemanticTableWithHeadersAndRows: Story = {
  render: () => <CampaignTable />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    await expect(
      canvas.getByRole('table', { name: 'Campanhas' }),
    ).toBeInTheDocument()
    await expect(canvas.getAllByRole('columnheader')).toHaveLength(3)
    await expect(canvas.getByText('Aniversariantes')).toBeInTheDocument()
  },
}

export const SelectedRowIsMarked: Story = {
  render: () => <CampaignTable />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    await userEvent.click(
      canvas.getByRole('checkbox', { name: 'Selecionar Aniversariantes' }),
    )

    await expect(
      canvas.getByRole('checkbox', { name: 'Selecionar Aniversariantes' }),
    ).toBeChecked()
    await expect(
      canvasElement.querySelectorAll('tr[data-state="selected"]'),
    ).toHaveLength(1)
  },
}

export const NoFooterWithoutDeclaredColumn: Story = {
  render: () => <CampaignTable />,
  play: async ({ canvasElement }) => {
    await expect(footerOf(canvasElement)).toBeNull()
  },
}

export const DeclaredColumnFooterShowsTotal: Story = {
  render: () => <CampaignTable withFooter />,
  play: async ({ canvasElement }) => {
    await expect(
      within(requireFooter(canvasElement)).getByText('400'),
    ).toBeInTheDocument()
  },
}

function requireFooter(canvasElement: HTMLElement): HTMLElement {
  const footer = footerOf(canvasElement)
  if (!footer) throw new Error('tfoot not found')
  return footer
}

export const AggregationFooterOffersTrigger: Story = {
  render: () => <CampaignTable withAggregation />,
  play: async ({ canvasElement }) => {
    await expect(
      within(requireFooter(canvasElement)).getByRole('button', {
        name: 'Calcular',
      }),
    ).toBeInTheDocument()
  },
}

export const AggregatesEveryRowNotOnlyPage: Story = {
  render: () => (
    <CampaignTable
      defaultAggregations={{ budget: 'sum' }}
      enablePagination
      withAggregation
    />
  ),
  play: async ({ canvasElement }) => {
    await expect(canvasElement.querySelectorAll('tbody tr')).toHaveLength(2)
    await expect(requireFooter(canvasElement).textContent).toContain(
      'Soma R$ 400',
    )
  },
}

export const NoAggregationFooterWithoutRows: Story = {
  render: () => (
    <CampaignTable
      data={[]}
      defaultAggregations={{ budget: 'sum' }}
      withAggregation
    />
  ),
  play: async ({ canvasElement }) => {
    await expect(footerOf(canvasElement)).toBeNull()
  },
}

export const NoAggregationFooterWhileLoading: Story = {
  render: () => (
    <CampaignTable
      defaultAggregations={{ budget: 'sum' }}
      isLoading
      withAggregation
    />
  ),
  play: async ({ canvasElement }) => {
    await expect(footerOf(canvasElement)).toBeNull()
  },
}

export const DeclaredFooterShownWithoutRows: Story = {
  render: () => <CampaignTable data={[]} withAggregation withFooter />,
  play: async ({ canvasElement }) => {
    await expect(requireFooter(canvasElement).textContent).toBe('Total')
  },
}

const onAggregationsChange = fn()

export const AggregationSwitchedFromFooterMenu: Story = {
  render: () => (
    <CampaignTable
      defaultAggregations={{ budget: 'sum' }}
      onAggregationsChange={onAggregationsChange}
      withAggregation
    />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    onAggregationsChange.mockClear()
    await userEvent.click(canvas.getByRole('button', { name: /Soma/ }))
    await userEvent.click(
      await screen.findByRole('menuitemradio', { name: 'Contagem' }),
    )

    await expect(onAggregationsChange).toHaveBeenCalledWith({ budget: 'count' })
    await waitFor(() =>
      expect(requireFooter(canvasElement).textContent).toContain('Contagem 3'),
    )
  },
}

export const ControlledAggregationIsFollowed: Story = {
  render: () => (
    <CampaignTable aggregations={{ budget: 'count' }} withAggregation />
  ),
  play: async ({ canvasElement }) => {
    await expect(requireFooter(canvasElement).textContent).toContain(
      'Contagem 3',
    )
  },
}

export const ColumnWithoutAggregationOptionShowsNoValue: Story = {
  render: () => (
    <CampaignTable aggregations={{ title: 'sum' }} withAggregation />
  ),
  play: async ({ canvasElement }) => {
    await expect(
      within(requireFooter(canvasElement)).getByRole('button', {
        name: 'Calcular',
      }),
    ).toBeInTheDocument()
  },
}

export const EmptyMessageSpansAllColumns: Story = {
  render: () => <CampaignTable data={[]} emptyMessage="Nada aqui." />,
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByText('Nada aqui.').getAttribute('colspan'),
    ).toBe('3')
  },
}

export const LoadingReplacesRowsWithSkeletons: Story = {
  render: () => <CampaignTable isLoading loadingRowCount={4} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    await expect(canvas.getByRole('table').getAttribute('aria-busy')).toBe(
      'true',
    )
    await expect(canvasElement.querySelectorAll('tbody tr')).toHaveLength(4)
    await expect(canvas.queryByText('Aniversariantes')).toBeNull()
  },
}

export const ClientPagination: Story = {
  render: () => <CampaignTable enablePagination />,
  play: async ({ canvasElement }) => {
    await expect(canvasElement.querySelectorAll('tbody tr')).toHaveLength(2)
  },
}

export const NoResizingNoSeparators: Story = {
  render: () => <CampaignTable />,
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).queryByRole('separator')).toBeNull()
  },
}

export const ResizeHandleOnlyOnResizableColumns: Story = {
  render: () => <CampaignTable enableColumnResizing />,
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement)
        .getAllByRole('separator')
        .map((handle) => handle.getAttribute('aria-label')),
    ).toEqual(['Redimensionar coluna Campanha'])
  },
}

export const ResizeWithArrowKeysWithinBounds: Story = {
  render: () => <CampaignTable enableColumnResizing />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const handle = canvas.getByRole('separator', {
      name: 'Redimensionar coluna Campanha',
    })

    handle.focus()
    await userEvent.keyboard('{ArrowRight}')
    await expect(handle.getAttribute('aria-valuenow')).toBe('208')

    for (let step = 0; step < 20; step += 1) {
      await userEvent.keyboard('{ArrowLeft}')
    }
    await expect(handle.getAttribute('aria-valuenow')).toBe('120')

    await userEvent.dblClick(handle)
    await expect(handle.getAttribute('aria-valuenow')).toBe('200')
  },
}
