import type { Meta, StoryObj } from '@storybook/react-vite'
import { Crm1 } from '@tc96/ui/blocks/data/crm/crm-1'
import { expect, fn, screen, userEvent, waitFor, within } from 'storybook/test'
import { companies, people, tags } from '../fixtures/crm-1.ts'
import { type Crm1Controls, crm1ControlArgs } from './crm-1-controls.ts'
import { ComposedCrm1 } from './crm-1-layouts.tsx'

const callbacks = {
  onArchivedFilterChange: fn(),
  onBulkArchive: fn(),
  onBulkSectorChange: fn(),
  onBulkUnarchive: fn(),
  onCreate: fn(),
  onLeadFilterChange: fn(),
  onModeChange: fn(),
  onOpen: fn(),
  onPageChange: fn(),
  onRetry: fn(),
  onSavedViewCreate: fn(),
  onSavedViewSelect: fn(),
  onSavePreference: fn(),
  onSearchChange: fn(),
  onSelectedIdsChange: fn(),
  onSortChange: fn(),
  onTagFilterChange: fn(),
  onVariantChange: fn(),
}

const meta = {
  args: { ...crm1ControlArgs, ...callbacks, paginated: false },
  parameters: { layout: 'padded' },
  render: (args) => <ComposedCrm1 {...args} />,
  tags: ['!autodocs'],
  title: 'Blocks/Data/CRM/Crm1/Behavior',
} satisfies Meta<Crm1Controls & Record<keyof typeof callbacks, () => void>>

export default meta

type Story = StoryObj<typeof meta>

const helena = 'Helena Prado'
const lucia = 'Lúcia Meireles'
const joaquim = 'Joaquim Albuquerque'
const bakery = 'Padaria Pão de Ouro'
const accountant = 'Escritório Contábil Martins'

const toolbarOf = (canvasElement: HTMLElement, name = 'Controles de pessoas') =>
  within(canvasElement).getByRole('toolbar', { name })

const actionBarOf = (canvasElement: HTMLElement) =>
  canvasElement.querySelector<HTMLElement>('[data-slot="action-bar"]')

const rowsOf = (canvasElement: HTMLElement) =>
  canvasElement.querySelectorAll('[data-slot="data-table"] tbody tr')

const rowOf = (canvasElement: HTMLElement, name: string) =>
  within(canvasElement).getByText(name).closest('tr') as HTMLElement

const headersOf = (canvasElement: HTMLElement) =>
  within(canvasElement)
    .getAllByRole('columnheader')
    .map((header) => header.textContent?.trim())
    .filter(Boolean)

const openDisplayMenu = async (
  canvasElement: HTMLElement,
  toolbar = 'Controles de pessoas',
) => {
  await userEvent.click(
    within(toolbarOf(canvasElement, toolbar)).getByRole('button', {
      name: /^Exibição/,
    }),
  )
  return screen.findByRole('menu')
}

const closeMenus = async () => {
  await userEvent.keyboard('{Escape}{Escape}')
  await waitFor(() => expect(screen.queryByRole('menu')).toBeNull())
}

const chooseInSubmenu = async (
  canvasElement: HTMLElement,
  submenu: string,
  role: 'menuitemcheckbox' | 'menuitemradio',
  option: string,
) => {
  await openDisplayMenu(canvasElement)
  await userEvent.click(await screen.findByRole('menuitem', { name: submenu }))
  await userEvent.click(await screen.findByRole(role, { name: option }))
}

const openSwitcher = async (canvasElement: HTMLElement, current: string) => {
  await userEvent.click(
    within(canvasElement).getByRole('button', { name: current }),
  )
}

const switcherClosed = () =>
  waitFor(() =>
    expect(
      screen.queryByRole('button', { name: 'Salvar visualização' }),
    ).toBeNull(),
  )

const chooseVariant = async (canvasElement: HTMLElement, next: string) => {
  await openSwitcher(canvasElement, 'Pessoas')
  const item = await screen.findByRole('button', { name: next })
  await waitFor(() => expect(item).toBeVisible())
  await userEvent.click(item)
  await switcherClosed()
}

const selectRecord = (canvasElement: HTMLElement, name: string) =>
  userEvent.click(
    within(canvasElement).getByRole('checkbox', { name: `Selecionar ${name}` }),
  )

export const TheViewSwitcherReplacesTheHeading: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.queryAllByRole('heading')).toHaveLength(0)
    await expect(
      within(toolbarOf(canvasElement)).getByRole('button', { name: 'Pessoas' }),
    ).toBeVisible()
    await expect(canvas.getByRole('region', { name: 'Pessoas' })).toBeVisible()
  },
}

export const WithoutOnVariantChangeTheHeadingNamesTheVariant: Story = {
  render: () => <Crm1 records={companies} sectors={[]} variant="companies" />,
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByRole('heading', {
        level: 2,
        name: 'Empresas',
      }),
    ).toBeVisible()
  },
}

export const PeopleShowTheirColumns: Story = {
  play: async ({ canvasElement }) => {
    await expect(headersOf(canvasElement)).toEqual([
      'Pessoa',
      'E-mail',
      'Telefone',
      'CPF',
      'Tags',
    ])
  },
}

export const CompaniesShowTheirColumns: Story = {
  args: { variant: 'companies' },
  play: async ({ canvasElement }) => {
    await expect(headersOf(canvasElement)).toEqual([
      'Empresa',
      'Telefone',
      'CNPJ',
      'Setor',
      'Tags',
    ])
    const row = within(rowOf(canvasElement, bakery))
    await expect(row.getByText('Comércio')).toBeVisible()
    await expect(row.getByText('(31) 3344-2211')).toBeVisible()
    await expect(row.getByText('Sem CNPJ')).toBeVisible()
    await expect(
      within(rowOf(canvasElement, accountant)).getByText('Sem setor'),
    ).toBeVisible()
  },
}

export const TheEmailIsCopyable: Story = {
  play: async ({ canvasElement }) => {
    const row = within(rowOf(canvasElement, helena))
    await expect(row.getByText('helena.prado@gmail.com')).toBeVisible()
    await expect(row.getByText('•••.•••.•••-37')).toBeVisible()
    await expect(
      row.getByRole('button', { name: 'Copiar e-mail' }),
    ).toBeVisible()
    const withoutEmail = within(rowOf(canvasElement, joaquim))
    await expect(withoutEmail.getByText('Sem e-mail')).toBeVisible()
    await expect(
      withoutEmail.queryByRole('button', { name: 'Copiar e-mail' }),
    ).toBeNull()
  },
}

export const ViewsShowTheirCountsAndSwitchTheVariant: Story = {
  play: async ({ args, canvasElement }) => {
    await openSwitcher(canvasElement, 'Pessoas')
    const companiesItem = await screen.findByRole('button', {
      name: 'Empresas, 12 itens',
    })
    await waitFor(() => expect(companiesItem).toBeVisible())
    await expect(
      companiesItem.querySelector('[data-slot="view-switcher-item-count"]'),
    ).toHaveTextContent('12')
    await userEvent.click(companiesItem)
    await switcherClosed()
    await expect(args.onVariantChange).toHaveBeenCalledWith('companies')
    await expect(
      within(toolbarOf(canvasElement, 'Controles de empresas')).getByRole(
        'button',
        { name: 'Empresas' },
      ),
    ).toBeVisible()
    await expect(headersOf(canvasElement)).toContain('Setor')
  },
}

export const ChangingTheVariantClearsTheSelection: Story = {
  play: async ({ args, canvasElement }) => {
    await selectRecord(canvasElement, helena)
    await expect(args.onSelectedIdsChange).toHaveBeenLastCalledWith([
      'person-101',
    ])
    await chooseVariant(canvasElement, 'Empresas, 12 itens')
    await expect(args.onSelectedIdsChange).toHaveBeenLastCalledWith([])
    await waitFor(() => expect(actionBarOf(canvasElement)).toBeNull())
  },
}

export const SavedViewsAreListedAndReported: Story = {
  play: async ({ args, canvasElement }) => {
    await openSwitcher(canvasElement, 'Pessoas')
    const item = await screen.findByRole('button', { name: 'Clientes VIP' })
    await waitFor(() => expect(item).toBeVisible())
    await expect(
      screen.getByRole('button', { name: 'Salvar visualização' }),
    ).toBeVisible()
    await userEvent.click(item)
    await switcherClosed()
    await expect(args.onSavedViewSelect).toHaveBeenCalledWith('view-1')
    await expect(
      within(toolbarOf(canvasElement)).getByRole('button', {
        name: 'Clientes VIP',
      }),
    ).toBeVisible()
  },
}

export const SavePreferenceCallsItsCallback: Story = {
  play: async ({ args, canvasElement }) => {
    await openDisplayMenu(canvasElement)
    await userEvent.click(
      await screen.findByRole('menuitem', { name: 'Salvar preferência' }),
    )
    await expect(args.onSavePreference).toHaveBeenCalledOnce()
    await waitFor(() => expect(screen.queryByRole('menu')).toBeNull())
  },
}

export const ModeTabsSwitchToTheList: Story = {
  play: async ({ args, canvasElement }) => {
    await openDisplayMenu(canvasElement)
    await userEvent.click(
      await screen.findByRole('menuitemradio', { name: 'Lista' }),
    )
    await expect(args.onModeChange).toHaveBeenCalledWith('list')
    await closeMenus()
    await expect(within(canvasElement).queryByRole('table')).toBeNull()
    await expect(
      canvasElement.querySelectorAll('[data-slot="list-row"]'),
    ).toHaveLength(10)
  },
}

export const TheListRowCaptionsTheContact: Story = {
  args: { archivedFilter: 'include', mode: 'list' },
  play: async ({ canvasElement }) => {
    const rowOfTitle = (name: string) =>
      within(canvasElement)
        .getByRole('button', { name: `Abrir ${name}` })
        .closest('[data-slot="list-row"]') as HTMLElement
    const person = within(rowOfTitle(helena))
    await expect(person.getByText('helena.prado@gmail.com')).toBeVisible()
    await expect(person.getByText('•••.•••.•••-37')).toBeVisible()
    await expect(person.getByText('(11) 98765-4321')).toBeVisible()
    const archived = rowOfTitle(lucia)
    await expect(
      within(
        archived.querySelector('[data-slot="list-row-header"]') as HTMLElement,
      ).getByText('Arquivado'),
    ).toBeVisible()
  },
}

export const TheCompanyListRowCaptionsTheSector: Story = {
  args: { mode: 'list', variant: 'companies' },
  play: async ({ canvasElement }) => {
    const row = within(
      within(canvasElement)
        .getByRole('button', { name: `Abrir ${bakery}` })
        .closest('[data-slot="list-row"]') as HTMLElement,
    )
    await expect(row.getByText('Comércio')).toBeVisible()
  },
}

export const SearchReportsTheTextOnSubmit: Story = {
  play: async ({ args, canvasElement }) => {
    const field = within(toolbarOf(canvasElement)).getByRole('searchbox', {
      name: 'Buscar pessoas',
    })
    await userEvent.type(field, 'helena')
    await expect(args.onSearchChange).not.toHaveBeenCalled()
    await userEvent.keyboard('{Enter}')
    await expect(args.onSearchChange).toHaveBeenCalledWith('helena')
    await expect(rowsOf(canvasElement)).toHaveLength(1)
  },
}

export const SortReportsTheChoice: Story = {
  play: async ({ args, canvasElement }) => {
    await chooseInSubmenu(
      canvasElement,
      'Ordenar por',
      'menuitemradio',
      'Nome (Z–A)',
    )
    await expect(args.onSortChange).toHaveBeenCalledWith('name_desc')
    await closeMenus()
  },
}

export const ArchivedFilterReportsTheChoice: Story = {
  play: async ({ args, canvasElement }) => {
    await expect(within(canvasElement).queryByText(lucia)).toBeNull()
    await chooseInSubmenu(
      canvasElement,
      'Arquivados',
      'menuitemradio',
      'Incluir arquivados',
    )
    await expect(args.onArchivedFilterChange).toHaveBeenCalledWith('include')
    await closeMenus()
    await expect(
      within(rowOf(canvasElement, lucia)).getByText('Arquivado'),
    ).toBeVisible()
  },
}

export const TagFilterReportsTheCheckedTags: Story = {
  play: async ({ args, canvasElement }) => {
    await chooseInSubmenu(canvasElement, 'Tags', 'menuitemcheckbox', 'VIP')
    await expect(args.onTagFilterChange).toHaveBeenLastCalledWith(['vip'])
    await closeMenus()
  },
}

export const LeadFilterReportsTheStatus: Story = {
  play: async ({ args, canvasElement }) => {
    await chooseInSubmenu(canvasElement, 'Leads', 'menuitemradio', 'Ganhos')
    await expect(args.onLeadFilterChange).toHaveBeenCalledWith('won')
    await closeMenus()
    await expect(
      within(toolbarOf(canvasElement)).getByRole('button', {
        name: 'Exibição (1)',
      }),
    ).toBeVisible()
  },
}

export const ClearFiltersResetsEveryFilter: Story = {
  play: async ({ args, canvasElement }) => {
    await chooseInSubmenu(canvasElement, 'Leads', 'menuitemradio', 'Em aberto')
    await closeMenus()
    await openDisplayMenu(canvasElement)
    await userEvent.click(
      await screen.findByRole('menuitem', { name: 'Limpar filtros' }),
    )
    await expect(args.onLeadFilterChange).toHaveBeenLastCalledWith(null)
    await expect(args.onArchivedFilterChange).toHaveBeenLastCalledWith(null)
    await expect(args.onTagFilterChange).toHaveBeenLastCalledWith([])
    await waitFor(() => expect(screen.queryByRole('menu')).toBeNull())
  },
}

export const ARowOpensTheRecord: Story = {
  play: async ({ args, canvasElement }) => {
    await userEvent.click(
      within(canvasElement).getByRole('button', { name: `Abrir ${helena}` }),
    )
    await expect(args.onOpen).toHaveBeenCalledWith('person-101')
  },
}

export const SelectingRowsOpensTheActionBar: Story = {
  play: async ({ args, canvasElement }) => {
    await expect(actionBarOf(canvasElement)).toBeNull()
    await selectRecord(canvasElement, helena)
    await expect(args.onSelectedIdsChange).toHaveBeenLastCalledWith([
      'person-101',
    ])
    const bar = await within(canvasElement).findByRole('toolbar', {
      name: 'Ações das pessoas selecionadas',
    })
    await expect(bar).toHaveTextContent('1 selecionada')
    await expect(
      within(bar).queryByRole('button', { name: 'Definir setor' }),
    ).toBeNull()
  },
}

export const BulkArchiveReportsOnlyActiveContacts: Story = {
  args: { archivedFilter: 'include' },
  play: async ({ args, canvasElement }) => {
    await selectRecord(canvasElement, helena)
    await selectRecord(canvasElement, lucia)
    const bar = within(actionBarOf(canvasElement) as HTMLElement)
    await userEvent.click(bar.getByRole('button', { name: 'Arquivar' }))
    await expect(args.onBulkArchive).toHaveBeenCalledWith(['person-101'])
    await expect(args.onSelectedIdsChange).toHaveBeenLastCalledWith([])
    await waitFor(() => expect(actionBarOf(canvasElement)).toBeNull())
  },
}

export const BulkUnarchiveReportsOnlyArchivedContacts: Story = {
  args: { archivedFilter: 'include' },
  play: async ({ args, canvasElement }) => {
    await selectRecord(canvasElement, helena)
    await selectRecord(canvasElement, lucia)
    const bar = within(actionBarOf(canvasElement) as HTMLElement)
    await userEvent.click(bar.getByRole('button', { name: 'Desarquivar' }))
    await expect(args.onBulkUnarchive).toHaveBeenCalledWith(['person-105'])
  },
}

export const ArchiveNeedsAnActiveContact: Story = {
  args: { archivedFilter: 'only' },
  play: async ({ canvasElement }) => {
    await selectRecord(canvasElement, lucia)
    const bar = within(actionBarOf(canvasElement) as HTMLElement)
    await expect(bar.getByRole('button', { name: 'Arquivar' })).toBeDisabled()
    await expect(bar.getByRole('button', { name: 'Desarquivar' })).toBeEnabled()
  },
}

export const BulkSectorReportsTheIds: Story = {
  args: { variant: 'companies' },
  play: async ({ args, canvasElement }) => {
    await selectRecord(canvasElement, bakery)
    await selectRecord(canvasElement, accountant)
    const bar = within(
      await within(canvasElement).findByRole('toolbar', {
        name: 'Ações das empresas selecionadas',
      }),
    )
    await userEvent.click(bar.getByRole('button', { name: 'Definir setor' }))
    await userEvent.click(
      await screen.findByRole('menuitem', { name: 'Serviços' }),
    )
    await expect(args.onBulkSectorChange).toHaveBeenCalledWith(
      ['company-210', 'company-204'],
      'services',
    )
    await waitFor(() => expect(screen.queryByRole('menu')).toBeNull())
    await expect(
      within(rowOf(canvasElement, accountant)).getByText('Serviços'),
    ).toBeVisible()
  },
}

export const WithoutBulkCallbacksThereIsNoSelection: Story = {
  args: { bulkActions: false },
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).queryAllByRole('checkbox')).toHaveLength(
      0,
    )
  },
}

export const PaginationReportsTheNextPage: Story = {
  args: { paginated: true },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByText('1–5 de 10')).toBeVisible()
    await userEvent.click(
      within(
        canvas.getByRole('navigation', { name: 'Paginação de pessoas' }),
      ).getByRole('button', { name: 'Próxima página' }),
    )
    await expect(args.onPageChange).toHaveBeenCalledWith(2)
    await expect(canvas.getByText('6–10 de 10')).toBeVisible()
  },
}

export const WithoutPageCountThereIsNoFooter: Story = {
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).queryByRole('navigation', {
        name: 'Paginação de pessoas',
      }),
    ).toBeNull()
    await expect(rowsOf(canvasElement)).toHaveLength(10)
  },
}

export const TheEmptyMessageFollowsTheVariant: Story = {
  args: { empty: true },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByText('Nenhuma pessoa cadastrada.')).toBeVisible()
    await chooseVariant(canvasElement, 'Empresas, 12 itens')
    await expect(
      await canvas.findByText('Nenhuma empresa cadastrada.'),
    ).toBeVisible()
  },
}

export const TheEmptyMessageNamesTheFilters: Story = {
  render: () => (
    <Crm1 filtered records={[]} sectors={[]} tags={tags} variant="companies" />
  ),
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByText('Nenhuma empresa com esses filtros.'),
    ).toBeVisible()
  },
}

export const CreateCallsItsCallback: Story = {
  play: async ({ args, canvasElement }) => {
    await userEvent.click(
      within(toolbarOf(canvasElement)).getByRole('button', {
        name: 'Nova pessoa',
      }),
    )
    await expect(args.onCreate).toHaveBeenCalledOnce()
  },
}

export const PendingShowsTheSkeleton: Story = {
  render: (args) => (
    <Crm1
      onVariantChange={args.onVariantChange}
      pending
      records={companies}
      variant="companies"
    />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByLabelText('Carregando empresas')).toHaveAttribute(
      'aria-busy',
      'true',
    )
    await expect(canvas.getByRole('button', { name: 'Empresas' })).toBeVisible()
    await expect(canvas.queryByRole('button', { name: /^Exibição/ })).toBeNull()
  },
}

export const ErrorShowsRetry: Story = {
  render: (args) => (
    <Crm1 error onRetry={args.onRetry} records={people} variant="people" />
  ),
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(
      canvas.getByText('Não foi possível listar as pessoas'),
    ).toBeVisible()
    await userEvent.click(
      canvas.getByRole('button', { name: 'Tentar novamente' }),
    )
    await expect(args.onRetry).toHaveBeenCalledOnce()
  },
}
