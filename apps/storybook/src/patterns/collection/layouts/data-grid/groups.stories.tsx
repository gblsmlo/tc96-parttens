import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  createSelectColumn,
  DataGrid,
  type DataGridColumnDef,
  useDataGrid,
} from '@tc96/parttens'
import { useEffect, useState } from 'react'
import { expect, fn, userEvent, within } from 'storybook/test'

interface Campaign {
  id: string
  responsible: string
  title: string
}

const columns: DataGridColumnDef<Campaign>[] = [
  { accessorKey: 'title', header: 'Campanha', meta: { label: 'Campanha' } },
  {
    accessorKey: 'responsible',
    header: 'Responsável',
    meta: { label: 'Responsável' },
  },
]

const campaigns: Campaign[] = [
  { id: 'a', responsible: 'Ana', title: 'Retomada de inativos' },
  { id: 'c', responsible: 'Ana', title: 'Indicação premiada' },
  { id: 'b', responsible: 'Bruno', title: 'Aniversariantes' },
]

const threeOwners: Campaign[] = [
  { id: 'a', responsible: 'Ana', title: 'Retomada de inativos' },
  { id: 'b', responsible: 'Bruno', title: 'Aniversariantes' },
  { id: 'd', responsible: 'Carla', title: 'Boas-vindas' },
]

const byResponsible = (campaign: Campaign) => campaign.responsible
const blankAsNoGroup = (campaign: Campaign) => campaign.responsible || null

function record(id: string, responsible: string): Campaign {
  return { id, responsible, title: `Campanha ${id}` }
}

function requireElement<T>(element: T | null | undefined, name: string): T {
  if (!element) throw new Error(`${name} not found`)
  return element
}

function cellWith(canvasElement: HTMLElement, text: string): HTMLElement {
  return requireElement(
    within(canvasElement)
      .getByText(text)
      .closest<HTMLElement>('[role="gridcell"]'),
    `cell with "${text}"`,
  )
}

function bodyRowIndexes(canvasElement: HTMLElement): number[] {
  return within(canvasElement)
    .getAllByRole('row')
    .filter((row) => row.getAttribute('data-slot') !== 'data-grid-footer')
    .slice(1)
    .map((row) => Number(row.getAttribute('aria-rowindex')))
}

function ServerPagedGrid() {
  const { table } = useDataGrid<Campaign>({
    columns,
    data: [record('c', 'Ana'), record('d', 'Bruno')],
    enablePagination: true,
    getRowId: (campaign) => campaign.id,
    pageSize: 2,
    tableOptions: { manualPagination: true, rowCount: 6 },
  })

  return (
    <>
      <button onClick={() => table.setPageIndex(1)} type="button">
        Segunda página
      </button>
      <DataGrid
        aria-label="Campanhas"
        getRowGroup={byResponsible}
        pagination={false}
        table={table}
      />
    </>
  )
}

function GroupedGrid({
  data = campaigns,
  enablePagination = false,
  getRowGroup = byResponsible,
  pageSize = 2,
  tableOptions,
  ...gridProps
}: Readonly<{
  collapsedGroupIds?: readonly string[]
  data?: Campaign[]
  defaultCollapsedGroupIds?: readonly string[]
  enablePagination?: boolean
  getRowGroup?: (campaign: Campaign) => string | null
  onCollapsedGroupIdsChange?: (ids: readonly string[]) => void
  pageSize?: number
  selectable?: boolean
  tableOptions?: Parameters<typeof useDataGrid<Campaign>>[0]['tableOptions']
}>) {
  const { table } = useDataGrid<Campaign>({
    columns: gridProps.selectable
      ? [createSelectColumn<Campaign>(), ...columns]
      : columns,
    data,
    enablePagination,
    enableRowSelection: gridProps.selectable,
    getRowId: (campaign) => campaign.id,
    pageSize,
    tableOptions,
  })

  return (
    <DataGrid
      aria-label="Campanhas"
      collapsedGroupIds={gridProps.collapsedGroupIds}
      defaultCollapsedGroupIds={gridProps.defaultCollapsedGroupIds}
      getRowGroup={getRowGroup}
      onCollapsedGroupIdsChange={gridProps.onCollapsedGroupIdsChange}
      selectionActions={
        gridProps.selectable
          ? ({ selectedCount }) => <span>{selectedCount} selecionados</span>
          : undefined
      }
      table={table}
    />
  )
}

const meta = {
  parameters: {
    layout: 'padded',
  },
  tags: ['!autodocs'],
  title: 'Patterns/Collection/Layouts/Data Grid/Groups',
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

export const RowGroupPerRun: Story = {
  render: () => <GroupedGrid />,
  play: async ({ canvasElement }) => {
    const names = within(canvasElement)
      .getAllByRole('button', { name: /^Collapse / })
      .map((button) => button.getAttribute('aria-label'))

    await expect(names).toEqual(['Collapse Ana', 'Collapse Bruno'])
  },
}

export const GroupReopensOnReturn: Story = {
  render: () => (
    <GroupedGrid
      data={[
        campaigns[0] as Campaign,
        campaigns[2] as Campaign,
        campaigns[1] as Campaign,
      ]}
    />
  ),
  play: async ({ canvasElement }) => {
    const names = within(canvasElement)
      .getAllByRole('button', { name: /^Collapse / })
      .map((button) => button.getAttribute('aria-label'))

    await expect(names).toEqual([
      'Collapse Ana',
      'Collapse Bruno',
      'Collapse Ana',
    ])
  },
}

export const CountsOneGroupRowPerRun: Story = {
  render: () => (
    <GroupedGrid
      data={[record('a', 'Ana'), record('b', 'Bruno'), record('c', 'Ana')]}
    />
  ),
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByRole('grid').getAttribute('aria-rowcount'),
    ).toBe('7')
    await expect(bodyRowIndexes(canvasElement)).toEqual([2, 3, 4, 5, 6, 7])
  },
}

export const NumbersRowsOfLaterPage: Story = {
  render: () => (
    <GroupedGrid
      data={[
        record('a', 'Ana'),
        record('b', 'Ana'),
        record('c', 'Bruno'),
        record('d', 'Bruno'),
      ]}
      enablePagination
      pageSize={2}
    />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    await expect(canvas.getByRole('grid').getAttribute('aria-rowcount')).toBe(
      '8',
    )
    await expect(bodyRowIndexes(canvasElement)).toEqual([2, 3, 4])

    await userEvent.click(
      canvas.getByRole('button', { name: 'Próxima página' }),
    )

    await expect(bodyRowIndexes(canvasElement)).toEqual([5, 6, 7])
  },
}

export const ContinuedGroupRowKeepsIndex: Story = {
  render: () => (
    <GroupedGrid
      data={[record('a', 'Ana'), record('b', 'Ana'), record('c', 'Ana')]}
      enablePagination
      pageSize={2}
    />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    await userEvent.click(
      canvas.getByRole('button', { name: 'Próxima página' }),
    )

    await expect(
      requireElement(
        canvas.getByText('Campanha c').closest('[role="row"]'),
        'row c',
      ).getAttribute('aria-rowindex'),
    ).toBe('5')
    await expect(canvas.getByRole('grid').getAttribute('aria-rowcount')).toBe(
      '6',
    )
  },
}

export const BlankGroupKeepsGroupOpen: Story = {
  render: () => (
    <GroupedGrid
      data={[record('a', 'Ana'), record('b', ''), record('c', 'Ana')]}
      getRowGroup={blankAsNoGroup}
    />
  ),
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByRole('grid').getAttribute('aria-rowcount'),
    ).toBe('5')
    await expect(bodyRowIndexes(canvasElement)).toEqual([2, 3, 4, 5])
  },
}

export const PageStartingWithoutGroupGetsUniqueIndexes: Story = {
  render: () => (
    <GroupedGrid
      data={[
        record('a', 'Ana'),
        record('b', 'Ana'),
        record('c', ''),
        record('d', 'Ana'),
      ]}
      enablePagination
      getRowGroup={blankAsNoGroup}
      pageSize={2}
    />
  ),
  play: async ({ canvasElement }) => {
    await userEvent.click(
      within(canvasElement).getByRole('button', { name: 'Próxima página' }),
    )

    const indexes = bodyRowIndexes(canvasElement)
    await expect(new Set(indexes).size).toBe(indexes.length)
  },
}

export const ServerPageRowsGetUniqueIndexes: Story = {
  render: () => <ServerPagedGrid />,
  play: async ({ canvasElement }) => {
    await userEvent.click(
      within(canvasElement).getByRole('button', { name: 'Segunda página' }),
    )

    const indexes = bodyRowIndexes(canvasElement)
    await expect(indexes).toHaveLength(4)
    await expect(new Set(indexes).size).toBe(indexes.length)
  },
}

export const ExpandedByDefault: Story = {
  render: () => <GroupedGrid getRowGroup={byResponsible} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    await expect(
      canvas
        .getByRole('button', { name: 'Collapse Ana' })
        .getAttribute('aria-expanded'),
    ).toBe('true')
    await expect(
      canvas
        .getByRole('button', { name: 'Collapse Bruno' })
        .getAttribute('aria-expanded'),
    ).toBe('true')
    await expect(canvas.getAllByRole('row')).toHaveLength(6)
  },
}

export const GroupCountInGroupRow: Story = {
  render: () => <GroupedGrid getRowGroup={byResponsible} />,
  play: async ({ canvasElement }) => {
    const counts = Array.from(
      canvasElement.querySelectorAll('[data-slot="data-grid-group-count"]'),
      (count) => count.textContent,
    )

    await expect(counts).toEqual(['2', '1'])
  },
}

export const CollapseHidesAndRestoresRows: Story = {
  render: () => <GroupedGrid getRowGroup={byResponsible} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    await userEvent.click(canvas.getByRole('button', { name: 'Collapse Ana' }))

    await expect(canvas.queryByText('Retomada de inativos')).toBeNull()
    await expect(canvas.queryByText('Indicação premiada')).toBeNull()
    await expect(canvas.getByText('Aniversariantes')).toBeInTheDocument()
    await expect(
      canvas
        .getByRole('button', { name: 'Expand Ana' })
        .getAttribute('aria-expanded'),
    ).toBe('false')

    await userEvent.click(canvas.getByRole('button', { name: 'Expand Ana' }))

    await expect(canvas.getByText('Retomada de inativos')).toBeInTheDocument()
    await expect(canvas.getByText('Indicação premiada')).toBeInTheDocument()
  },
}

const onCollapsedChange = fn()

export const ControlledCollapseOnlyReports: Story = {
  render: () => (
    <GroupedGrid
      collapsedGroupIds={[]}
      getRowGroup={byResponsible}
      onCollapsedGroupIdsChange={onCollapsedChange}
    />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    onCollapsedChange.mockClear()
    await userEvent.click(canvas.getByRole('button', { name: 'Collapse Ana' }))

    await expect(onCollapsedChange).toHaveBeenCalledTimes(1)
    await expect(onCollapsedChange).toHaveBeenCalledWith(['Ana'])
    await expect(canvas.getByText('Retomada de inativos')).toBeInTheDocument()
  },
}

export const DefaultCollapsedReportsFullList: Story = {
  render: () => (
    <GroupedGrid
      defaultCollapsedGroupIds={['Bruno']}
      getRowGroup={byResponsible}
      onCollapsedGroupIdsChange={onCollapsedChange}
    />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    onCollapsedChange.mockClear()
    await expect(canvas.queryByText('Aniversariantes')).toBeNull()

    await userEvent.click(canvas.getByRole('button', { name: 'Collapse Ana' }))

    await expect(onCollapsedChange).toHaveBeenCalledTimes(1)
    const reported = (onCollapsedChange.mock.calls[0]?.[0] ??
      []) as readonly string[]
    await expect([...reported].sort()).toEqual(['Ana', 'Bruno'])
  },
}

function PaginatedGroupedGrid() {
  const { table } = useDataGrid<Campaign>({
    columns,
    data: campaigns,
    enablePagination: true,
    getRowId: (campaign) => campaign.id,
    pageSize: 1,
  })

  return <DataGrid getRowGroup={byResponsible} table={table} />
}

export const CollapsedGroupSurvivesPageChange: Story = {
  render: () => <PaginatedGroupedGrid />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    await userEvent.click(canvas.getByRole('button', { name: 'Collapse Ana' }))
    await expect(canvas.queryByText('Retomada de inativos')).toBeNull()

    await userEvent.click(
      canvas.getByRole('button', { name: 'Próxima página' }),
    )

    await expect(canvas.queryByText('Indicação premiada')).toBeNull()
    await expect(
      canvas
        .getByRole('button', { name: 'Expand Ana' })
        .getAttribute('aria-expanded'),
    ).toBe('false')
    await expect(
      requireElement(
        canvas
          .getByRole('button', { name: 'Expand Ana' })
          .closest<HTMLElement>('[role="row"]'),
        'Ana group row',
      ).querySelector('[data-slot="data-grid-group-count"]')?.textContent,
    ).toBe('1')
  },
}

export const ArrowKeySkipsCollapsedRows: Story = {
  render: () => (
    <GroupedGrid
      data={threeOwners}
      defaultCollapsedGroupIds={['Bruno']}
      getRowGroup={byResponsible}
    />
  ),
  play: async ({ canvasElement }) => {
    await userEvent.click(cellWith(canvasElement, 'Retomada de inativos'))
    await userEvent.keyboard('{ArrowDown}')

    await expect(document.activeElement?.textContent).toBe('Boas-vindas')
  },
}

export const FocusStaysOnChevronThatCollapses: Story = {
  render: () => <GroupedGrid data={threeOwners} getRowGroup={byResponsible} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    await userEvent.click(cellWith(canvasElement, 'Boas-vindas'))
    await userEvent.click(canvas.getByRole('button', { name: 'Collapse Ana' }))

    await expect(document.activeElement?.getAttribute('aria-label')).toBe(
      'Expand Ana',
    )
  },
}

function CollapseOnKeyGrid({
  group,
  shortcut,
}: Readonly<{ group: string; shortcut: string }>) {
  const [collapsed, setCollapsed] = useState<readonly string[]>([])

  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      if (event.key === shortcut) setCollapsed((ids) => [...ids, group])
    }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [group, shortcut])

  return (
    <GroupedGrid
      collapsedGroupIds={collapsed}
      data={threeOwners}
      getRowGroup={byResponsible}
    />
  )
}

export const FocusMovesToVisibleRowWhenGroupCollapses: Story = {
  render: () => <CollapseOnKeyGrid group="Bruno" shortcut="c" />,
  play: async ({ canvasElement }) => {
    await userEvent.click(cellWith(canvasElement, 'Aniversariantes'))
    await userEvent.keyboard('c')

    await expect(document.activeElement?.textContent).toBe(
      'Retomada de inativos',
    )
  },
}

export const FocusReturnsToRovingCellOnRerender: Story = {
  render: () => <CollapseOnKeyGrid group="Carla" shortcut="k" />,
  play: async ({ canvasElement }) => {
    await userEvent.click(cellWith(canvasElement, 'Retomada de inativos'))
    requireElement(
      cellWith(canvasElement, 'Aniversariantes'),
      'Bruno cell',
    ).focus()
    await userEvent.keyboard('k')

    await expect(document.activeElement?.textContent).toBe(
      'Retomada de inativos',
    )
  },
}

export const SelectAllSelectsCollapsedRows: Story = {
  render: () => <GroupedGrid getRowGroup={byResponsible} selectable />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    await userEvent.click(canvas.getByRole('button', { name: 'Collapse Ana' }))
    await userEvent.click(canvas.getAllByRole('checkbox')[0] as HTMLElement)

    await expect(canvas.getByText('3 selecionados')).toBeInTheDocument()
  },
}
