import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  createSelectColumn,
  DataGrid,
  type DataGridColumnDef,
  useDataGrid,
} from '@tc96/parttens'
import type { ReactNode } from 'react'
import { expect, fireEvent, within } from 'storybook/test'

interface Campaign {
  id: string
  responsible: string
  title: string
}

const campaigns: Campaign[] = [
  { id: 'a', responsible: 'Ana', title: 'Retomada de inativos' },
  { id: 'c', responsible: 'Ana', title: 'Indicação premiada' },
  { id: 'b', responsible: 'Bruno', title: 'Aniversariantes' },
]

const columns: DataGridColumnDef<Campaign>[] = [
  { accessorKey: 'title', header: 'Campanha', meta: { label: 'Campanha' } },
  {
    accessorKey: 'responsible',
    header: 'Responsável',
    meta: { label: 'Responsável' },
  },
]

interface Task {
  id: string
  stage: string
}

const stageOptions = [
  { label: 'Aberto', value: 'aberto' },
  { label: 'Concluído', value: 'concluido' },
]

const editableColumns: DataGridColumnDef<Task>[] = [
  {
    accessorKey: 'stage',
    header: 'Etapa',
    meta: {
      editable: true,
      label: 'Etapa',
      options: stageOptions,
      variant: 'select',
    },
  },
]

function requireElement<T>(element: T | null | undefined, name: string): T {
  if (!element) throw new Error(`${name} not found`)
  return element
}

function CampaignGrid({
  data = campaigns,
  enablePagination = false,
  fillColumn,
  footer,
  isLoading,
  loadingRowCount,
  emptyMessage,
  pagination,
  selectable = false,
  getRowSelected,
}: Readonly<{
  data?: Campaign[]
  emptyMessage?: string
  enablePagination?: boolean
  fillColumn?: string | false
  footer?: ReactNode
  getRowSelected?: (campaign: Campaign) => boolean
  isLoading?: boolean
  loadingRowCount?: number
  pagination?: boolean
  selectable?: boolean
}>) {
  const { table } = useDataGrid<Campaign>({
    columns: selectable
      ? [createSelectColumn<Campaign>(), ...columns]
      : columns,
    data,
    enablePagination,
    enableRowSelection: selectable,
    getRowId: (campaign) => campaign.id,
    pageSize: 2,
  })

  return (
    <DataGrid
      aria-label="Campanhas"
      emptyMessage={emptyMessage}
      fillColumn={fillColumn}
      footer={footer}
      getRowSelected={getRowSelected}
      isLoading={isLoading}
      loadingRowCount={loadingRowCount}
      pagination={pagination}
      table={table}
    />
  )
}

function EditableGrid() {
  const { table } = useDataGrid<Task>({
    columns: editableColumns,
    data: [{ id: 'a', stage: 'aberto' }],
    getRowId: (task) => task.id,
    onCellValueChange: () => {},
  })

  return <DataGrid aria-label="Tarefas" table={table} />
}

function FillGrid({ fillColumn }: Readonly<{ fillColumn?: string | false }>) {
  const { table } = useDataGrid<Campaign>({
    columns,
    data: campaigns,
    getRowId: (campaign) => campaign.id,
  })

  return (
    <DataGrid aria-label="Campanhas" fillColumn={fillColumn} table={table} />
  )
}

function flexGrowOf(canvasElement: HTMLElement, name: string): string {
  const header = within(canvasElement)
    .getAllByRole('columnheader')
    .find((cell) => cell.textContent?.trim() === name)
  return getComputedStyle(requireElement(header, `header ${name}`)).flexGrow
}

const meta = {
  parameters: {
    layout: 'padded',
  },
  tags: ['!autodocs'],
  title: 'Patterns/Collection/Layouts/Data Grid/Layout',
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

export const ExposesAriaGridWithColumnHeaders: Story = {
  render: () => <CampaignGrid />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    await expect(
      canvas.getByRole('grid', { name: 'Campanhas' }),
    ).toBeInTheDocument()
    await expect(
      canvas
        .getAllByRole('columnheader')
        .map((header) => header.textContent?.trim()),
    ).toEqual(['Campanha', 'Responsável'])
  },
}

export const RowsNumberedAfterHeader: Story = {
  render: () => <CampaignGrid />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const rows = canvas.getAllByRole('row')

    await expect(rows).toHaveLength(4)
    await expect(rows[1]?.getAttribute('aria-rowindex')).toBe('2')
    await expect(canvas.getByText('Retomada de inativos')).toBeInTheDocument()
  },
}

export const GetRowSelectedMarksRow: Story = {
  render: () => (
    <CampaignGrid getRowSelected={(campaign) => campaign.id === 'b'} />
  ),
  play: async ({ canvasElement }) => {
    const selected = within(canvasElement)
      .getAllByRole('row')
      .filter((row) => row.getAttribute('aria-selected') === 'true')

    await expect(selected).toHaveLength(1)
    await expect(selected[0]?.textContent).toContain('Aniversariantes')
  },
}

export const SelectionColumnStaysOutOfHeaders: Story = {
  render: () => <CampaignGrid selectable />,
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getAllByRole('checkbox')).toHaveLength(4)
  },
}

export const EmptyMessageReplacesRows: Story = {
  render: () => (
    <CampaignGrid data={[]} emptyMessage="Nenhuma campanha para exibir." />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    await expect(
      canvas.getByText('Nenhuma campanha para exibir.'),
    ).toBeInTheDocument()
    await expect(canvas.queryByText('Retomada de inativos')).toBeNull()
  },
}

export const LoadingReplacesRowsWithSkeletons: Story = {
  render: () => <CampaignGrid isLoading loadingRowCount={2} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    await expect(canvas.queryByText('Retomada de inativos')).toBeNull()
    await expect(canvas.getAllByRole('row')).toHaveLength(3)
  },
}

export const PaginationShownWhenPaginating: Story = {
  render: () => <CampaignGrid enablePagination />,
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByRole('button', { name: 'Próxima página' }),
    ).toBeInTheDocument()
  },
}

export const NoPaginationWhenNotPaginating: Story = {
  render: () => <CampaignGrid />,
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).queryByRole('button', { name: 'Próxima página' }),
    ).toBeNull()
  },
}

export const ScrollOnlyDropsPagination: Story = {
  render: () => <CampaignGrid enablePagination pagination={false} />,
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).queryByRole('button', { name: 'Próxima página' }),
    ).toBeNull()
  },
}

export const ExplicitFooterTakesSlot: Story = {
  render: () => (
    <CampaignGrid enablePagination footer={<span>3 campanhas</span>} />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    await expect(
      canvas.queryByRole('button', { name: 'Próxima página' }),
    ).toBeNull()
    await expect(canvas.getByText('3 campanhas')).toBeInTheDocument()
  },
}

export const EditableSelectShowsAccessibleTrigger: Story = {
  render: () => <EditableGrid />,
  play: async ({ canvasElement }) => {
    const trigger = within(canvasElement).getByRole('combobox', {
      name: 'Etapa: Aberto',
    })

    await expect(trigger.getAttribute('aria-haspopup')).toBe('listbox')
  },
}

export const EditableControlKeepsFocus: Story = {
  render: () => <EditableGrid />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const trigger = canvas.getByRole('combobox', { name: 'Etapa: Aberto' })
    const cell = requireElement(
      trigger.closest<HTMLElement>('[role="gridcell"]'),
      'editable cell',
    )

    fireEvent.click(cell)
    trigger.focus()
    fireEvent.click(cell)

    await expect(document.activeElement).toBe(trigger)
  },
}

export const LastColumnAbsorbsLeftoverWidth: Story = {
  render: () => <FillGrid />,
  play: async ({ canvasElement }) => {
    await expect(flexGrowOf(canvasElement, 'Campanha')).toBe('0')
    await expect(flexGrowOf(canvasElement, 'Responsável')).toBe('1')
  },
}

export const FillDisabledKeepsDeclaredWidths: Story = {
  render: () => <FillGrid fillColumn={false} />,
  play: async ({ canvasElement }) => {
    await expect(flexGrowOf(canvasElement, 'Campanha')).toBe('0')
    await expect(flexGrowOf(canvasElement, 'Responsável')).toBe('0')
  },
}

export const NamedColumnAbsorbsLeftoverWidth: Story = {
  render: () => <FillGrid fillColumn="title" />,
  play: async ({ canvasElement }) => {
    await expect(flexGrowOf(canvasElement, 'Campanha')).toBe('1')
    await expect(flexGrowOf(canvasElement, 'Responsável')).toBe('0')
  },
}
