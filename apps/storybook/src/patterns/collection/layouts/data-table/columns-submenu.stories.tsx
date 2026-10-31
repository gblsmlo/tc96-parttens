import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  CollectionToolbar,
  DataTable,
  type DataTableColumnDef,
  DataTableColumnsSubmenu,
  useDataTable,
  ViewSettingsMenu,
  ViewSettingsSection,
} from '@tc96/parttens'
import type { ReactElement } from 'react'
import { expect, screen, userEvent, within } from 'storybook/test'

interface Campaign {
  budget: number
  id: string
  title: string
}

const campaigns: Campaign[] = [
  { budget: 100, id: 'a', title: 'Retomada de inativos' },
  { budget: 250, id: 'b', title: 'Aniversariantes' },
]

const columns: DataTableColumnDef<Campaign>[] = [
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
}: Readonly<{ columnDefs?: DataTableColumnDef<Campaign>[] }>): ReactElement {
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

async function openColumnsSubmenu() {
  await userEvent.click(screen.getByRole('button', { name: 'Exibição' }))
  await userEvent.click(
    await screen.findByRole('menuitem', { name: 'Colunas' }),
  )
}

const meta = {
  parameters: {
    layout: 'padded',
  },
  tags: ['!autodocs'],
  title: 'Patterns/Collection/Layouts/Data Table/Columns Submenu',
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

export const ListsOnlyHideableColumnsByLabel: Story = {
  render: () => <CampaignTable />,
  play: async () => {
    await openColumnsSubmenu()

    const options = await screen.findAllByRole('menuitemcheckbox')
    await expect(options.map((option) => option.textContent)).toEqual([
      'Verba total',
      'code',
    ])
    await expect(
      options.map((option) => option.getAttribute('aria-checked')),
    ).toEqual(['true', 'true'])
  },
}

export const ToggleSwitchesColumnVisibility: Story = {
  render: () => <CampaignTable />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    await expect(
      canvas.getByRole('columnheader', { name: 'Verba' }),
    ).toBeInTheDocument()

    await openColumnsSubmenu()
    await userEvent.click(
      await screen.findByRole('menuitemcheckbox', { name: 'Verba total' }),
    )

    await expect(
      canvas.queryByRole('columnheader', { name: 'Verba' }),
    ).toBeNull()
    await expect(
      screen
        .getByRole('menuitemcheckbox', { name: 'Verba total' })
        .getAttribute('aria-checked'),
    ).toBe('false')

    await userEvent.click(
      screen.getByRole('menuitemcheckbox', { name: 'Verba total' }),
    )

    await expect(
      canvas.getByRole('columnheader', { name: 'Verba' }),
    ).toBeInTheDocument()
  },
}

export const ItemHiddenWhenNoColumnCanHide: Story = {
  render: () => (
    <CampaignTable
      columnDefs={columns.map((column) => ({ ...column, enableHiding: false }))}
    />
  ),
  play: async () => {
    await userEvent.click(screen.getByRole('button', { name: 'Exibição' }))

    await expect(screen.queryByRole('menuitem', { name: 'Colunas' })).toBeNull()
  },
}
