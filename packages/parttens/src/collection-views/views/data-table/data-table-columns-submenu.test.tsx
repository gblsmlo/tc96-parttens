import { afterEach, describe, expect, test } from 'bun:test'
import type { ReactElement } from 'react'

await import('../../test/dom')

const { act, cleanup, fireEvent, render, screen } = await import(
  '@testing-library/react'
)
const { DataTable } = await import('./data-table')
const { DataTableColumnsSubmenu } = await import('./data-table-columns-submenu')
const { useDataTable } = await import('./use-data-table')
const { ViewSettingsMenu, ViewSettingsSection } = await import(
  '../../shared/components/collection-view-settings'
)
const { CollectionToolbar } = await import(
  '../../../shared/components/collection-toolbar'
)

type DataTableColumnDef =
  import('./use-data-table').DataTableColumnDef<Campaign>

interface Campaign {
  budget: number
  id: string
  title: string
}

const campaigns: Campaign[] = [
  { budget: 100, id: 'a', title: 'Retomada de inativos' },
  { budget: 250, id: 'b', title: 'Aniversariantes' },
]

const columns: DataTableColumnDef[] = [
  { enableHiding: false, header: 'Seleção', id: 'select' },
  {
    accessorKey: 'title',
    enableHiding: false,
    header: 'Campanha',
    meta: { label: 'Campanha' },
  },
  {
    accessorKey: 'budget',
    header: 'Verba',
    meta: { label: 'Verba total' },
  },
  { accessorFn: (campaign) => campaign.id, header: 'Código', id: 'code' },
]

function CampaignTable({
  columnDefs = columns,
}: Readonly<{ columnDefs?: DataTableColumnDef[] }>): ReactElement {
  const { table } = useDataTable<Campaign>({
    columns: columnDefs,
    data: campaigns,
    getRowId: (campaign) => campaign.id,
  })

  return (
    <>
      <CollectionToolbar
        endSlot={
          <ViewSettingsMenu onClearFilters={() => undefined}>
            <ViewSettingsSection label="Exibição">
              <DataTableColumnsSubmenu table={table} />
            </ViewSettingsSection>
          </ViewSettingsMenu>
        }
      />
      <DataTable table={table} />
    </>
  )
}

const openColumnsSubmenu = async () => {
  await act(async () =>
    fireEvent.click(screen.getByRole('button', { name: 'Exibição' })),
  )
  await act(async () => {
    fireEvent.click(screen.getByRole('menuitem', { name: 'Colunas' }))
    await new Promise((resolve) => setTimeout(resolve, 0))
  })
}

afterEach(cleanup)

describe('DataTableColumnsSubmenu', () => {
  test('lista só as colunas que podem ser ocultadas, pelo rótulo do meta', async () => {
    render(<CampaignTable />)

    await openColumnsSubmenu()

    const options = screen.getAllByRole('menuitemcheckbox')
    expect(options.map((option) => option.textContent)).toEqual([
      'Verba total',
      'code',
    ])
    expect(
      options.map((option) => option.getAttribute('aria-checked')),
    ).toEqual(['true', 'true'])
  })

  test('alterna a visibilidade da coluna na tabela', async () => {
    render(<CampaignTable />)
    expect(screen.getByRole('columnheader', { name: 'Verba' })).toBeTruthy()

    await openColumnsSubmenu()
    await act(async () =>
      fireEvent.click(
        screen.getByRole('menuitemcheckbox', { name: 'Verba total' }),
      ),
    )

    expect(screen.queryByRole('columnheader', { name: 'Verba' })).toBeNull()
    expect(
      screen
        .getByRole('menuitemcheckbox', { name: 'Verba total' })
        .getAttribute('aria-checked'),
    ).toBe('false')

    await act(async () =>
      fireEvent.click(
        screen.getByRole('menuitemcheckbox', { name: 'Verba total' }),
      ),
    )

    expect(screen.getByRole('columnheader', { name: 'Verba' })).toBeTruthy()
  })

  test('não renderiza o item quando nenhuma coluna pode ser ocultada', async () => {
    render(
      <CampaignTable
        columnDefs={columns.map((column) => ({
          ...column,
          enableHiding: false,
        }))}
      />,
    )

    await act(async () =>
      fireEvent.click(screen.getByRole('button', { name: 'Exibição' })),
    )

    expect(screen.queryByRole('menuitem', { name: 'Colunas' })).toBeNull()
  })
})
