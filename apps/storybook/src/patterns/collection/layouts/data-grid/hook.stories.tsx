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
import type { ReactElement } from 'react'
import { expect, userEvent, within } from 'storybook/test'

interface Campaign {
  id: string
  reach: number
  title: string
}

const campaigns: Campaign[] = [
  { id: 'a', reach: 30, title: 'Retomada de inativos' },
  { id: 'b', reach: 10, title: 'Aniversariantes' },
  { id: 'c', reach: 20, title: 'Indicação premiada' },
]

const columns: DataGridColumnDef<Campaign>[] = [
  { accessorKey: 'title', header: 'Campanha', meta: { label: 'Campanha' } },
  { accessorKey: 'reach', header: 'Alcance', meta: { label: 'Alcance' } },
]

interface HookGridProps {
  enablePagination?: boolean
  enableRowSelection?: boolean
  enableSorting?: boolean
}

function HookGrid({
  enablePagination = false,
  enableRowSelection = false,
  enableSorting = true,
}: Readonly<HookGridProps>): ReactElement {
  const { table } = useDataGrid<Campaign>({
    columns: enableRowSelection
      ? [createSelectColumn<Campaign>(), ...columns]
      : columns,
    data: campaigns,
    enablePagination,
    enableRowSelection,
    enableSorting,
    getRowId: (campaign) => campaign.id,
    pageSize: 2,
  })

  return (
    <>
      <CollectionToolbar>
        <DataGridSelectionSummary table={table} />
        <DataGridSearch placeholder="Buscar…" table={table} />
      </CollectionToolbar>
      <button
        onClick={() => table.getColumn('reach')?.toggleSorting(false)}
        type="button"
      >
        Ordenar por alcance
      </button>
      <DataGrid aria-label="Campanhas" table={table} />
    </>
  )
}

function bodyRows(canvasElement: HTMLElement): HTMLElement[] {
  return within(canvasElement)
    .getAllByRole('row')
    .filter((row) => row.getAttribute('data-slot') !== 'data-grid-footer')
    .slice(1)
}

function titlesOf(canvasElement: HTMLElement): (string | null | undefined)[] {
  return bodyRows(canvasElement).map(
    (row) => within(row).getAllByRole('gridcell')[0]?.textContent,
  )
}

function visibleRowCount(canvasElement: HTMLElement): number {
  return bodyRows(canvasElement).length
}

const meta = {
  parameters: {
    layout: 'padded',
  },
  tags: ['!autodocs'],
  title: 'Patterns/Collection/Layouts/Data Grid/Hook',
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

export const SourceOrderUntilSorted: Story = {
  render: () => <HookGrid />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    await expect(titlesOf(canvasElement)).toEqual([
      'Retomada de inativos',
      'Aniversariantes',
      'Indicação premiada',
    ])

    await userEvent.click(
      canvas.getByRole('button', { name: 'Ordenar por alcance' }),
    )

    await expect(titlesOf(canvasElement)).toEqual([
      'Aniversariantes',
      'Indicação premiada',
      'Retomada de inativos',
    ])
  },
}

export const SortingDisabledKeepsOrder: Story = {
  render: () => <HookGrid enableSorting={false} />,
  play: async ({ canvasElement }) => {
    await userEvent.click(
      within(canvasElement).getByRole('button', {
        name: 'Ordenar por alcance',
      }),
    )

    await expect(titlesOf(canvasElement)).toEqual([
      'Retomada de inativos',
      'Aniversariantes',
      'Indicação premiada',
    ])
  },
}

export const SelectionKeyedByRowId: Story = {
  render: () => <HookGrid enableRowSelection />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    await userEvent.click(
      canvas.getAllByRole('checkbox', {
        name: 'Selecionar registro',
      })[1] as HTMLElement,
    )

    await expect(
      canvas
        .getAllByRole('checkbox', { name: 'Selecionar registro' })[1]
        ?.getAttribute('aria-checked'),
    ).toBe('true')
    await expect(canvas.getByText('1 selecionado')).toBeInTheDocument()
  },
}

export const UnpaginatedShowsEveryRow: Story = {
  render: () => <HookGrid />,
  play: async ({ canvasElement }) => {
    await expect(visibleRowCount(canvasElement)).toBe(3)
  },
}

export const PaginatedShowsOnePageAtATime: Story = {
  render: () => <HookGrid enablePagination />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    await expect(visibleRowCount(canvasElement)).toBe(2)

    await userEvent.click(
      canvas.getByRole('button', { name: 'Próxima página' }),
    )

    await expect(visibleRowCount(canvasElement)).toBe(1)
    await expect(canvas.getByText('Indicação premiada')).toBeInTheDocument()
  },
}

export const GlobalFilterNarrowsRows: Story = {
  render: () => <HookGrid />,
  play: async ({ canvasElement }) => {
    await userEvent.type(
      within(canvasElement).getByRole('searchbox', { name: 'Buscar…' }),
      'premiada',
    )

    await expect(titlesOf(canvasElement)).toEqual(['Indicação premiada'])
  },
}
