import { afterEach, describe, expect, test } from 'bun:test'
import type { ComponentType, ReactElement } from 'react'

await import('../../test/dom')

// O virtualizador do TanStack lê `ResizeObserver` já no import do módulo.
class MockResizeObserver {
  disconnect() {}
  observe() {}
  unobserve() {}
}

Object.assign(globalThis, { ResizeObserver: MockResizeObserver })

const { act, cleanup, fireEvent, render, screen } = await import(
  '@testing-library/react'
)
const { DataGrid } = await import('./data-grid')
const { useDataGrid } = await import('./use-data-grid')
const { createSelectColumn } = await import('./data-grid-columns')

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

const columns = [
  { accessorKey: 'title', header: 'Campanha', meta: { label: 'Campanha' } },
  {
    accessorKey: 'responsible',
    header: 'Responsável',
    meta: { label: 'Responsável' },
  },
]

type GridProps = Omit<Parameters<typeof DataGrid<Campaign>>[0], 'table'>

function Grid(props: Readonly<GridProps>): ReactElement {
  const { table } = useDataGrid<Campaign>({
    columns,
    data: campaigns,
    getRowId: (campaign) => campaign.id,
  })

  return <DataGrid aria-label="Campanhas" table={table} {...props} />
}

const TypedGrid = Grid as ComponentType<GridProps>

afterEach(cleanup)

describe('DataGrid', () => {
  test('renders selection actions when the table has selected rows', () => {
    const captured = {
      table: null as ReturnType<typeof useDataGrid<Campaign>>['table'] | null,
    }

    function SelectableGrid(): ReactElement {
      const { table } = useDataGrid<Campaign>({
        columns: [createSelectColumn<Campaign>(), ...columns],
        data: campaigns,
        enableRowSelection: true,
        getRowId: (campaign) => campaign.id,
      })
      captured.table = table

      return (
        <DataGrid
          selectionActions={({ selectedCount }) => (
            <span>{selectedCount} selecionado</span>
          )}
          table={table}
        />
      )
    }

    const { container } = render(<SelectableGrid />)
    expect(screen.queryByText('1 selecionado')).toBeNull()

    act(() => {
      captured.table?.getRow('a').toggleSelected(true)
    })

    expect(screen.getByText('1 selecionado')).toBeTruthy()
    expect(
      container
        .querySelector('[data-slot="data-grid-selection-actions"]')
        ?.classList.contains('bottom-3'),
    ).toBe(true)
    expect(
      container
        .querySelector('[data-slot="data-grid"]')
        ?.contains(
          container.querySelector('[data-slot="data-grid-selection-actions"]'),
        ),
    ).toBe(false)
  })

  test('exposes the collection as an ARIA grid with one column header per column', () => {
    render(<TypedGrid />)

    const grid = screen.getByRole('grid', { name: 'Campanhas' })
    expect(grid).toBeTruthy()

    const headers = screen.getAllByRole('columnheader')
    expect(headers.map((header) => header.textContent?.trim())).toEqual([
      'Campanha',
      'Responsável',
    ])
  })

  test('renders one row per item, numbering rows after the header row', () => {
    render(<TypedGrid />)

    const rows = screen.getAllByRole('row')
    // 1 cabeçalho + 3 dados
    expect(rows).toHaveLength(4)
    expect(rows[1]?.getAttribute('aria-rowindex')).toBe('2')
    expect(screen.getByText('Retomada de inativos')).toBeTruthy()
  })

  test('marks the row reported by getRowSelected as selected', () => {
    render(<TypedGrid getRowSelected={(campaign) => campaign.id === 'b'} />)

    const selected = screen
      .getAllByRole('row')
      .filter((row) => row.getAttribute('aria-selected') === 'true')

    expect(selected).toHaveLength(1)
    expect(selected[0]?.textContent).toContain('Aniversariantes')
  })

  test('shows the empty message instead of rows when there is nothing to list', () => {
    function EmptyGrid(): ReactElement {
      const { table } = useDataGrid<Campaign>({
        columns,
        data: [],
        getRowId: (c) => c.id,
      })

      return (
        <DataGrid emptyMessage="Nenhuma campanha para exibir." table={table} />
      )
    }

    render(<EmptyGrid />)

    expect(screen.getByText('Nenhuma campanha para exibir.')).toBeTruthy()
    expect(screen.queryByText('Retomada de inativos')).toBeNull()
  })

  test('replaces rows with the requested number of skeleton rows while loading', () => {
    render(<TypedGrid isLoading loadingRowCount={2} />)

    expect(screen.queryByText('Retomada de inativos')).toBeNull()
    // 1 cabeçalho + 2 esqueletos
    expect(screen.getAllByRole('row')).toHaveLength(3)
  })

  test('inserts one group row per run of rows sharing a getRowGroup value', () => {
    const { container } = render(
      <TypedGrid getRowGroup={(campaign) => campaign.responsible} />,
    )

    const groupRows = container.querySelectorAll(
      '[data-slot="data-grid-group-row"] [data-slot="data-grid-group-label"]',
    )
    expect(Array.from(groupRows, (row) => row.textContent)).toEqual([
      'Ana',
      'Bruno',
    ])
  })

  /** A coleção chega ordenada por grupo; sem isso o mesmo grupo reabre e as
   *  chaves de irmão colidiriam. */
  test('reopens a group when the same value returns after another group', () => {
    function UnsortedGrid(): ReactElement {
      const { table } = useDataGrid<Campaign>({
        columns,
        data: [
          campaigns[0] as Campaign,
          campaigns[2] as Campaign,
          campaigns[1] as Campaign,
        ],
        getRowId: (campaign) => campaign.id,
      })

      return (
        <DataGrid
          getRowGroup={(campaign) => campaign.responsible}
          table={table}
        />
      )
    }

    const { container } = render(<UnsortedGrid />)

    const groupRows = container.querySelectorAll(
      '[data-slot="data-grid-group-row"] [data-slot="data-grid-group-label"]',
    )
    expect(Array.from(groupRows, (row) => row.textContent)).toEqual([
      'Ana',
      'Bruno',
      'Ana',
    ])
  })

  test('keeps the selection column out of the visible column headers', () => {
    function SelectableGrid(): ReactElement {
      const { table } = useDataGrid<Campaign>({
        columns: [createSelectColumn<Campaign>(), ...columns],
        data: campaigns,
        enableRowSelection: true,
        getRowId: (campaign) => campaign.id,
      })

      return <DataGrid aria-label="Campanhas" table={table} />
    }

    render(<SelectableGrid />)

    const checkboxes = screen.getAllByRole('checkbox')
    // 1 no cabeçalho + 1 por linha
    expect(checkboxes).toHaveLength(4)
  })
})

describe('DataGrid group row numbering', () => {
  const byResponsible = (campaign: Campaign) => campaign.responsible

  function record(id: string, responsible: string): Campaign {
    return { id, responsible, title: `Campanha ${id}` }
  }

  const captured = {
    table: null as ReturnType<typeof useDataGrid<Campaign>>['table'] | null,
  }

  function GroupedGrid({
    data,
    getRowGroup = byResponsible,
    pageSize,
    tableOptions,
  }: Readonly<{
    data: Campaign[]
    getRowGroup?: (campaign: Campaign) => string | null
    pageSize?: number
    tableOptions?: Parameters<typeof useDataGrid<Campaign>>[0]['tableOptions']
  }>): ReactElement {
    const { table } = useDataGrid<Campaign>({
      columns,
      data,
      enablePagination: pageSize !== undefined,
      getRowId: (campaign) => campaign.id,
      ...(pageSize === undefined ? {} : { pageSize }),
      ...(tableOptions ? { tableOptions } : {}),
    })
    captured.table = table

    return (
      <DataGrid
        aria-label="Campanhas"
        getRowGroup={getRowGroup}
        table={table}
      />
    )
  }

  function bodyRowIndexes(container: HTMLElement) {
    return Array.from(
      container.querySelectorAll(
        '[data-slot="data-grid-group-row"], [data-slot="data-grid-row"]',
      ),
      (row) => Number(row.getAttribute('aria-rowindex')),
    )
  }

  function rowCountOf(container: HTMLElement) {
    return Number(
      container.querySelector('[role="grid"]')?.getAttribute('aria-rowcount'),
    )
  }

  test('counts one group row per run, so a group that returns is counted twice', () => {
    const { container } = render(
      <GroupedGrid
        data={[record('a', 'Ana'), record('b', 'Bruno'), record('c', 'Ana')]}
      />,
    )

    // 1 cabeçalho + 3 linhas + 3 grupos (Ana, Bruno, Ana)
    expect(rowCountOf(container)).toBe(7)
    expect(bodyRowIndexes(container)).toEqual([2, 3, 4, 5, 6, 7])
  })

  test('numbers the rows of a later page after the groups of the earlier pages', () => {
    const { container } = render(
      <GroupedGrid
        data={[
          record('a', 'Ana'),
          record('b', 'Ana'),
          record('c', 'Bruno'),
          record('d', 'Bruno'),
        ]}
        pageSize={2}
      />,
    )

    // 1 cabeçalho + 4 linhas + 2 grupos + 1 rodapé
    expect(rowCountOf(container)).toBe(8)
    expect(bodyRowIndexes(container)).toEqual([2, 3, 4])

    act(() => {
      captured.table?.nextPage()
    })

    expect(bodyRowIndexes(container)).toEqual([5, 6, 7])
  })

  test('numbers a row that continues a group across the page break after its first rows', () => {
    const { container } = render(
      <GroupedGrid
        data={[record('a', 'Ana'), record('b', 'Ana'), record('c', 'Ana')]}
        pageSize={2}
      />,
    )

    act(() => {
      captured.table?.nextPage()
    })

    // O dado é a linha 5 do grid inteiro (cabeçalho, grupo, 3 linhas).
    const dataRow = container.querySelector('[data-slot="data-grid-row"]')
    expect(dataRow?.getAttribute('aria-rowindex')).toBe('5')
    // 1 cabeçalho + 3 linhas + 1 grupo + 1 rodapé
    expect(rowCountOf(container)).toBe(6)
  })
})

describe('DataGrid group row numbering edge cases', () => {
  function record(id: string, responsible: string): Campaign {
    return { id, responsible, title: `Campanha ${id}` }
  }

  const captured = {
    table: null as ReturnType<typeof useDataGrid<Campaign>>['table'] | null,
  }
  const blankAsNoGroup = (campaign: Campaign) => campaign.responsible || null

  function Grid({
    data,
    pageSize,
    tableOptions,
  }: Readonly<{
    data: Campaign[]
    pageSize?: number
    tableOptions?: Parameters<typeof useDataGrid<Campaign>>[0]['tableOptions']
  }>): ReactElement {
    const { table } = useDataGrid<Campaign>({
      columns,
      data,
      enablePagination: pageSize !== undefined,
      getRowId: (campaign) => campaign.id,
      ...(pageSize === undefined ? {} : { pageSize }),
      ...(tableOptions ? { tableOptions } : {}),
    })
    captured.table = table

    return (
      <DataGrid
        aria-label="Campanhas"
        getRowGroup={blankAsNoGroup}
        pagination={false}
        table={table}
      />
    )
  }

  function bodyRowIndexes(container: HTMLElement) {
    return Array.from(
      container.querySelectorAll(
        '[data-slot="data-grid-group-row"], [data-slot="data-grid-row"]',
      ),
      (row) => Number(row.getAttribute('aria-rowindex')),
    )
  }

  test('keeps a group open across a row without a group', () => {
    const { container } = render(
      <Grid data={[record('a', 'Ana'), record('b', ''), record('c', 'Ana')]} />,
    )

    // 1 cabeçalho + 3 linhas + 1 grupo: a linha sem grupo não fecha o de Ana
    expect(
      container.querySelector('[role="grid"]')?.getAttribute('aria-rowcount'),
    ).toBe('5')
    expect(bodyRowIndexes(container)).toEqual([2, 3, 4, 5])
  })

  test('gives every row of a page its own index when the page starts without a group', () => {
    const { container } = render(
      <Grid
        data={[
          record('a', 'Ana'),
          record('b', 'Ana'),
          record('c', ''),
          record('d', 'Ana'),
        ]}
        pageSize={2}
      />,
    )

    act(() => {
      captured.table?.nextPage()
    })

    const indexes = bodyRowIndexes(container)
    expect(new Set(indexes).size).toBe(indexes.length)
  })

  test('gives every row of a page its own index when the table paginates on the server', () => {
    const { container } = render(
      <Grid
        data={[record('c', 'Ana'), record('d', 'Bruno')]}
        pageSize={2}
        tableOptions={{ manualPagination: true, rowCount: 6 }}
      />,
    )

    act(() => {
      captured.table?.setPageIndex(1)
    })

    const indexes = bodyRowIndexes(container)
    expect(indexes).toHaveLength(4)
    expect(new Set(indexes).size).toBe(indexes.length)
  })
})

describe('DataGrid collapsible groups', () => {
  const byResponsible = (campaign: Campaign) => campaign.responsible

  function groupRow(container: HTMLElement, label: string) {
    return Array.from(
      container.querySelectorAll<HTMLElement>(
        '[data-slot="data-grid-group-row"]',
      ),
    ).find(
      (row) =>
        row.querySelector('[data-slot="data-grid-group-label"]')
          ?.textContent === label,
    )
  }

  function toggleOf(label: string) {
    return screen.getByRole('button', {
      name: new RegExp(`^(Expand|Collapse) ${label}$`),
    })
  }

  test('renders every group expanded when no collapse prop is passed', () => {
    render(<TypedGrid getRowGroup={byResponsible} />)

    expect(toggleOf('Ana').getAttribute('aria-expanded')).toBe('true')
    expect(toggleOf('Bruno').getAttribute('aria-expanded')).toBe('true')
    expect(screen.getAllByRole('row')).toHaveLength(1 + 2 + 3)
  })

  test('shows the name and the page count of each group in its row', () => {
    const { container } = render(<TypedGrid getRowGroup={byResponsible} />)

    const counts = Array.from(
      container.querySelectorAll('[data-slot="data-grid-group-count"]'),
      (count) => count.textContent,
    )
    expect(counts).toEqual(['2', '1'])
  })

  test('hides and restores the rows of a group, keeping the group row', () => {
    const { container } = render(<TypedGrid getRowGroup={byResponsible} />)

    fireEvent.click(toggleOf('Ana'))

    expect(screen.queryByText('Retomada de inativos')).toBeNull()
    expect(screen.queryByText('Indicação premiada')).toBeNull()
    expect(screen.getByText('Aniversariantes')).toBeTruthy()
    expect(groupRow(container, 'Ana')).toBeTruthy()
    expect(toggleOf('Ana').getAttribute('aria-expanded')).toBe('false')
    expect(toggleOf('Ana').getAttribute('aria-label')).toBe('Expand Ana')

    fireEvent.click(toggleOf('Ana'))

    expect(screen.getByText('Retomada de inativos')).toBeTruthy()
    expect(screen.getByText('Indicação premiada')).toBeTruthy()
  })

  test('lets collapsedGroupIds own the state and only reports the change', () => {
    const changes: (readonly string[])[] = []
    render(
      <TypedGrid
        collapsedGroupIds={[]}
        getRowGroup={byResponsible}
        onCollapsedGroupIdsChange={(ids) => changes.push(ids)}
      />,
    )

    fireEvent.click(toggleOf('Ana'))

    expect(changes).toEqual([['Ana']])
    expect(screen.getByText('Retomada de inativos')).toBeTruthy()
  })

  test('starts from defaultCollapsedGroupIds and reports the full list', () => {
    const changes: (readonly string[])[] = []
    render(
      <TypedGrid
        defaultCollapsedGroupIds={['Bruno']}
        getRowGroup={byResponsible}
        onCollapsedGroupIdsChange={(ids) => changes.push(ids)}
      />,
    )

    expect(screen.queryByText('Aniversariantes')).toBeNull()

    fireEvent.click(toggleOf('Ana'))

    expect(changes.map((ids) => [...ids].sort())).toEqual([['Ana', 'Bruno']])
  })

  test('keeps a group collapsed on the next page without changing the pagination', () => {
    const captured = {
      table: null as ReturnType<typeof useDataGrid<Campaign>>['table'] | null,
    }

    function PaginatedGroupedGrid(): ReactElement {
      const { table } = useDataGrid<Campaign>({
        columns,
        data: campaigns,
        enablePagination: true,
        getRowId: (campaign) => campaign.id,
        pageSize: 1,
      })
      captured.table = table

      return <DataGrid getRowGroup={byResponsible} table={table} />
    }

    const { container } = render(<PaginatedGroupedGrid />)

    fireEvent.click(toggleOf('Ana'))
    expect(screen.queryByText('Retomada de inativos')).toBeNull()

    act(() => {
      captured.table?.nextPage()
    })

    expect(captured.table?.getPageCount()).toBe(3)
    expect(captured.table?.getState().pagination.pageIndex).toBe(1)
    expect(screen.queryByText('Indicação premiada')).toBeNull()
    expect(toggleOf('Ana').getAttribute('aria-expanded')).toBe('false')
    expect(
      groupRow(container, 'Ana')?.querySelector(
        '[data-slot="data-grid-group-count"]',
      )?.textContent,
    ).toBe('1')
  })

  const threeOwners: Campaign[] = [
    { id: 'a', responsible: 'Ana', title: 'Retomada de inativos' },
    { id: 'b', responsible: 'Bruno', title: 'Aniversariantes' },
    { id: 'd', responsible: 'Carla', title: 'Boas-vindas' },
  ]

  function ThreeOwnersGrid(props: Readonly<GridProps>): ReactElement {
    const { table } = useDataGrid<Campaign>({
      columns,
      data: threeOwners,
      getRowId: (campaign) => campaign.id,
    })

    return (
      <DataGrid
        aria-label="Campanhas"
        getRowGroup={byResponsible}
        table={table}
        {...props}
      />
    )
  }

  const TypedThreeOwnersGrid = ThreeOwnersGrid as ComponentType<GridProps>

  test('skips the rows of a collapsed group when moving with the arrows', async () => {
    render(<TypedThreeOwnersGrid defaultCollapsedGroupIds={['Bruno']} />)

    const firstCell = screen
      .getByText('Retomada de inativos')
      .closest<HTMLElement>('[role="gridcell"]')
    if (!firstCell) throw new Error('cell not found')
    fireEvent.click(firstCell)
    fireEvent.keyDown(firstCell, { key: 'ArrowDown' })
    await act(async () => {
      await Promise.resolve()
    })

    expect(document.activeElement?.textContent).toBe('Boas-vindas')
  })

  test('keeps the focus on the chevron that collapsed the group', async () => {
    render(<TypedThreeOwnersGrid />)

    const carlaCell = screen
      .getByText('Boas-vindas')
      .closest<HTMLElement>('[role="gridcell"]')
    if (!carlaCell) throw new Error('cell not found')
    fireEvent.click(carlaCell)
    const toggle = toggleOf('Ana')
    toggle.focus()
    fireEvent.click(toggle)
    await act(async () => {
      await Promise.resolve()
    })

    expect(document.activeElement?.getAttribute('aria-label')).toBe(
      'Expand Ana',
    )
  })

  test('moves the focus to the first visible row when its group collapses', async () => {
    const { rerender } = render(<TypedThreeOwnersGrid collapsedGroupIds={[]} />)

    const brunoCell = screen
      .getByText('Aniversariantes')
      .closest<HTMLElement>('[role="gridcell"]')
    if (!brunoCell) throw new Error('cell not found')
    fireEvent.click(brunoCell)
    await act(async () => {
      await Promise.resolve()
    })
    expect(document.activeElement?.textContent).toBe('Aniversariantes')
    rerender(<TypedThreeOwnersGrid collapsedGroupIds={['Bruno']} />)
    await act(async () => {
      await Promise.resolve()
    })

    expect(document.activeElement?.textContent).toBe('Retomada de inativos')
  })

  test('brings the focus back to the roving cell from another cell on re-render', async () => {
    const { rerender } = render(<TypedThreeOwnersGrid collapsedGroupIds={[]} />)

    const anaCell = screen
      .getByText('Retomada de inativos')
      .closest<HTMLElement>('[role="gridcell"]')
    const brunoCell = screen
      .getByText('Aniversariantes')
      .closest<HTMLElement>('[role="gridcell"]')
    if (!(anaCell && brunoCell)) throw new Error('cell not found')
    fireEvent.click(anaCell)
    await act(async () => {
      await Promise.resolve()
    })
    brunoCell.focus()
    rerender(<TypedThreeOwnersGrid collapsedGroupIds={['Carla']} />)
    await act(async () => {
      await Promise.resolve()
    })

    expect(document.activeElement?.textContent).toBe('Retomada de inativos')
  })

  test('selects the rows of collapsed groups when selecting all', () => {
    function SelectableGroupedGrid(): ReactElement {
      const { table } = useDataGrid<Campaign>({
        columns: [createSelectColumn<Campaign>(), ...columns],
        data: campaigns,
        enableRowSelection: true,
        getRowId: (campaign) => campaign.id,
      })

      return (
        <DataGrid
          getRowGroup={byResponsible}
          selectionActions={({ selectedCount }) => (
            <span>{selectedCount} selecionados</span>
          )}
          table={table}
        />
      )
    }

    render(<SelectableGroupedGrid />)
    fireEvent.click(toggleOf('Ana'))
    const [selectAll] = screen.getAllByRole('checkbox')
    if (!selectAll) throw new Error('select-all not found')
    fireEvent.click(selectAll)

    expect(screen.getByText('3 selecionados')).toBeTruthy()
  })
})

describe('DataGridCell', () => {
  test('renders a date-only value on its own calendar day, not shifted by the time zone', () => {
    function DateGrid(): ReactElement {
      const { table } = useDataGrid<{ id: string; updatedAt: string }>({
        columns: [
          {
            accessorKey: 'updatedAt',
            header: 'Atualizado em',
            meta: { label: 'Atualizado em', variant: 'date' },
          },
        ],
        data: [{ id: 'a', updatedAt: '2026-08-04' }],
        getRowId: (record) => record.id,
      })

      return <DataGrid table={table} />
    }

    render(<DateGrid />)

    // Comparar com a data local evita fixar formato de locale; o que o teste
    // protege é o dia do calendário, não a máscara.
    const localDay = new Date('2026-08-04T00:00:00')
    expect(screen.getByText(localDay.toLocaleDateString())).toBeTruthy()
    expect(localDay.getDate()).toBe(4)
  })
})

describe('DataGrid pagination', () => {
  const paginationOf = (container: HTMLElement) =>
    container.querySelector('[data-slot="data-grid-pagination"]')

  function PaginatedGrid(
    props: Readonly<{ pagination?: boolean }>,
  ): ReactElement {
    const { table } = useDataGrid<Campaign>({
      columns,
      data: campaigns,
      enablePagination: true,
      getRowId: (campaign) => campaign.id,
      pageSize: 2,
    })

    return <DataGrid table={table} {...props} />
  }

  test('shows the pagination whenever the table paginates, without wiring the footer', () => {
    const { container } = render(<PaginatedGrid />)

    expect(paginationOf(container)).toBeTruthy()
  })

  test('leaves the footer empty when the table does not paginate', () => {
    const { container } = render(<TypedGrid />)

    expect(paginationOf(container)).toBeNull()
  })

  /** Coleção inteira numa área de rolagem, mesmo com o modelo de paginação ligado. */
  test('drops the pagination when the consumer asks for scroll only', () => {
    const { container } = render(<PaginatedGrid pagination={false} />)

    expect(paginationOf(container)).toBeNull()
  })

  test('lets an explicit footer take the slot instead of the pagination', () => {
    function CustomFooterGrid(): ReactElement {
      const { table } = useDataGrid<Campaign>({
        columns,
        data: campaigns,
        enablePagination: true,
        getRowId: (campaign) => campaign.id,
      })

      return <DataGrid footer={<span>3 campanhas</span>} table={table} />
    }

    const { container } = render(<CustomFooterGrid />)

    expect(paginationOf(container)).toBeNull()
    expect(screen.getByText('3 campanhas')).toBeTruthy()
  })
})

describe('DataGrid editable cells', () => {
  interface Task {
    id: string
    stage: string
  }

  const stageOptions = [
    { label: 'Aberto', value: 'aberto' },
    { label: 'Concluído', value: 'concluido' },
  ]

  function EditableGrid(
    props: Readonly<{ onChange?: (value: string) => void }>,
  ): ReactElement {
    const { table } = useDataGrid<Task>({
      columns: [
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
      ],
      data: [{ id: 'a', stage: 'aberto' }],
      getRowId: (task) => task.id,
      onCellValueChange: ({ value }) => props.onChange?.(value),
    })

    return <DataGrid table={table} />
  }

  test('renders the closed value as an accessible trigger, not as plain text', () => {
    const { container } = render(<EditableGrid />)

    const trigger = container.querySelector('[data-grid-select-trigger]')
    expect(trigger?.getAttribute('aria-label')).toBe('Etapa: Aberto')
    expect(trigger?.getAttribute('aria-haspopup')).toBe('listbox')
  })

  /**
   * A célula rouba o foco para si quando vira a célula corrente, e isso fechava
   * o popup que o próprio clique tinha acabado de abrir: um controle interno já
   * é o foco certo.
   */
  test('does not steal focus from a control inside the focused cell', async () => {
    const { container } = render(<EditableGrid />)

    const trigger = container.querySelector<HTMLElement>(
      '[data-grid-select-trigger]',
    )
    const cell = trigger?.closest<HTMLElement>('[data-slot="data-grid-cell"]')
    if (!(trigger && cell)) throw new Error('editable cell not rendered')

    fireEvent.click(cell)
    trigger.focus()
    fireEvent.click(cell)

    // O roubo de foco acontecia numa microtask do `ref`; assertar antes dela
    // esvaziar faria o teste passar mesmo com o defeito de volta.
    await Promise.resolve()
    await Promise.resolve()

    expect(document.activeElement).toBe(trigger)
  })
})

describe('DataGrid fill column', () => {
  const growOf = (container: HTMLElement, columnId: string) => {
    const cell = container.querySelector<HTMLElement>(
      `[data-slot="data-grid-header-cell"][data-column-id="${columnId}"]`,
    )
    return cell?.style.flexGrow
  }

  function FillGrid(
    props: Readonly<{ fillColumn?: string | false }>,
  ): ReactElement {
    const { table } = useDataGrid<Campaign>({
      columns,
      data: campaigns,
      getRowId: (campaign) => campaign.id,
    })

    return <DataGrid table={table} {...props} />
  }

  test('lets the last column absorb the leftover width by default', () => {
    const { container } = render(<FillGrid />)

    expect(growOf(container, 'title')).toBe('0')
    expect(growOf(container, 'responsible')).toBe('1')
  })

  test('keeps every column at its declared width when the fill is turned off', () => {
    const { container } = render(<FillGrid fillColumn={false} />)

    expect(growOf(container, 'title')).toBe('0')
    expect(growOf(container, 'responsible')).toBe('0')
  })

  /** Sem coluna que cresce, esticar deixaria uma faixa sem borda lendo como coluna fantasma. */
  test('shrinks the frame to the columns when no column fills, and stretches when one does', () => {
    const withoutFill = render(<FillGrid fillColumn={false} />)
    const shrunk =
      withoutFill.container.querySelector('[data-slot="data-grid"]')
        ?.className ?? ''

    expect(shrunk).toContain('w-fit')
    expect(shrunk).toContain('max-w-full')
    expect(shrunk).not.toContain('w-full ')

    cleanup()

    const withFill = render(<FillGrid />)
    const stretched =
      withFill.container.querySelector('[data-slot="data-grid"]')?.className ??
      ''

    expect(stretched).toContain('w-full')
    expect(stretched).not.toContain('w-fit')
  })

  test('moves the leftover width to the named column', () => {
    const { container } = render(<FillGrid fillColumn="title" />)

    expect(growOf(container, 'title')).toBe('1')
    expect(growOf(container, 'responsible')).toBe('0')
  })
})
