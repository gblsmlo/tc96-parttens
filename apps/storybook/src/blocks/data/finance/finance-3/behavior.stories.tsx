import type { Meta, StoryObj } from '@storybook/react-vite'
import { Finance3 } from '@tc96/ui/blocks/data/finance/finance-3'
import { expect, fn, screen, userEvent, waitFor, within } from 'storybook/test'
import {
  accounts,
  members,
  periods,
  statementLines,
  statementSummary,
} from '../fixtures/finance-3.ts'
import {
  type Finance3Controls,
  finance3ControlArgs,
} from './finance-3-controls.ts'
import { ComposedFinance3 } from './finance-3-layouts.tsx'

const callbacks = {
  onAccountChange: fn(),
  onAccountFilterChange: fn(),
  onBulkResponsibleChange: fn(),
  onBulkSettle: fn(),
  onCategoryChange: fn(),
  onContact: fn(),
  onCreate: fn(),
  onExport: fn(),
  onFeeTypeFilterChange: fn(),
  onHiddenColumnsChange: fn(),
  onIssueCharge: fn(),
  onMarkCollected: fn(),
  onOpen: fn(),
  onOpenClient: fn(),
  onPageChange: fn(),
  onPeriodChange: fn(),
  onReissueCharge: fn(),
  onResponsibleChange: fn(),
  onRetry: fn(),
  onSavePreference: fn(),
  onSearchChange: fn(),
  onSelectedIdsChange: fn(),
  onSituationFilterChange: fn(),
  onSortChange: fn(),
  onStatementAccountChange: fn(),
  onTypeFilterChange: fn(),
  onViewChange: fn(),
}

const meta = {
  args: { ...finance3ControlArgs, ...callbacks },
  parameters: { layout: 'padded' },
  render: (args) => <ComposedFinance3 {...args} />,
  tags: ['!autodocs'],
  title: 'Blocks/Data/Finance/Finance3/Behavior',
} satisfies Meta<Finance3Controls & Record<keyof typeof callbacks, () => void>>

export default meta

type Story = StoryObj<typeof meta>

const overdueFee = 'Honorários contratuais · Moinho Santa Clara'
const openExpense = 'Custas de distribuição'
const settledFee = 'Honorários de êxito · TransVale'
const transfer = 'Transferência para o caixa'
const moinhoInstallment =
  'Moinho Santa Clara Ltda., Honorários contratuais · 3 de 12'
const clinicInstallment = 'Clínica Vida Plena, Honorários contratuais · 1 de 6'
const noPhoneInstallment = 'Otávio Meireles, Reembolso de cópias autenticadas'

const toolbarOf = (
  canvasElement: HTMLElement,
  name = 'Controles de lançamentos',
) => within(canvasElement).getByRole('toolbar', { name })

const actionBarOf = (canvasElement: HTMLElement) =>
  canvasElement.querySelector<HTMLElement>('[data-slot="action-bar"]')

const rowsOf = (canvasElement: HTMLElement) =>
  canvasElement.querySelectorAll('[data-slot="data-table"] tbody tr')

const rowOf = (canvasElement: HTMLElement, title: string) =>
  within(canvasElement).getByText(title).closest('tr') as HTMLElement

const header = (canvasElement: HTMLElement, name: string) =>
  within(canvasElement).queryByRole('columnheader', { name })

const isDisabled = (element: HTMLElement) =>
  element.hasAttribute('disabled') ||
  element.getAttribute('aria-disabled') === 'true'

const openDisplayMenu = async (
  canvasElement: HTMLElement,
  toolbar?: string,
) => {
  await userEvent.click(
    within(toolbarOf(canvasElement, toolbar)).getByRole('button', {
      name: /^Exibição/,
    }),
  )
  return screen.findByRole('menu')
}

const chooseInSubmenu = async (
  canvasElement: HTMLElement,
  submenu: string,
  option: string,
  toolbar?: string,
) => {
  await openDisplayMenu(canvasElement, toolbar)
  await userEvent.click(await screen.findByRole('menuitem', { name: submenu }))
  await userEvent.click(
    await screen.findByRole('menuitemradio', { name: option }),
  )
}

const closeMenus = async () => {
  await userEvent.keyboard('{Escape}{Escape}')
  await waitFor(() => expect(screen.queryByRole('menu')).toBeNull())
}

const chooseView = async (
  canvasElement: HTMLElement,
  current: string,
  next: string,
) => {
  await userEvent.click(
    within(canvasElement).getByRole('button', { name: current }),
  )
  await userEvent.click(await screen.findByRole('button', { name: next }))
}

const pick = async (trigger: HTMLElement, option: string) => {
  await userEvent.click(trigger)
  await userEvent.click(await screen.findByRole('option', { name: option }))
  await waitFor(() => expect(screen.queryByRole('listbox')).toBeNull())
}

const select = (canvasElement: HTMLElement, name: string) =>
  userEvent.click(
    within(canvasElement).getByRole('checkbox', { name: `Selecionar ${name}` }),
  )

const openRowActions = async (canvasElement: HTMLElement, name: string) => {
  await userEvent.click(
    within(canvasElement).getByRole('button', { name: `Ações de ${name}` }),
  )
  return screen.findByRole('menu')
}

export const TheViewSwitcherReplacesTheHeading: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.queryAllByRole('heading')).toHaveLength(0)
    await expect(
      within(toolbarOf(canvasElement)).getByRole('button', { name: 'Todos' }),
    ).toBeVisible()
    await expect(
      canvas.getByRole('region', { name: 'Lançamentos' }),
    ).toBeVisible()
  },
}

export const ViewsShowTheirCountsAndReportTheChoice: Story = {
  play: async ({ args, canvasElement }) => {
    await chooseView(canvasElement, 'Todos', 'A pagar, 2 itens')
    await expect(args.onViewChange).toHaveBeenCalledWith('payable')
    await expect(rowsOf(canvasElement)).toHaveLength(2)
  },
}

export const TheCollectionViewSwapsToTheQueue: Story = {
  play: async ({ args, canvasElement }) => {
    await chooseView(canvasElement, 'Todos', 'A cobrar, 12 itens')
    await expect(args.onViewChange).toHaveBeenCalledWith('collection')
    await expect(
      await within(canvasElement).findByRole('region', { name: 'A cobrar' }),
    ).toBeVisible()
    await expect(header(canvasElement, 'Parcela')).toBeVisible()
    await expect(header(canvasElement, 'Cobrança')).toBeVisible()
    await expect(header(canvasElement, 'Situação')).toBeNull()
  },
}

export const EntriesStartWithTheLemindColumns: Story = {
  play: async ({ canvasElement }) => {
    for (const name of [
      'Descrição',
      'Tipo',
      'Pagador',
      'Caso ou processo',
      'Vencimento',
      'Valor',
      'Situação',
    ])
      await expect(header(canvasElement, name)).toBeVisible()
    for (const name of [
      'Conta',
      'Categoria',
      'Responsável',
      'Tipo de honorário',
    ])
      await expect(header(canvasElement, name)).toBeNull()
  },
}

export const TheColumnsSubmenuShowsAHiddenColumn: Story = {
  play: async ({ args, canvasElement }) => {
    await openDisplayMenu(canvasElement)
    await userEvent.click(
      await screen.findByRole('menuitem', { name: 'Colunas' }),
    )
    await userEvent.click(
      await screen.findByRole('menuitemcheckbox', { name: 'Conta' }),
    )
    await expect(args.onHiddenColumnsChange).toHaveBeenLastCalledWith([
      'category',
      'feeType',
      'responsible',
    ])
    await closeMenus()
    await expect(header(canvasElement, 'Conta')).toBeVisible()
  },
}

export const SortReportsTheChoice: Story = {
  play: async ({ args, canvasElement }) => {
    await chooseInSubmenu(canvasElement, 'Ordenar por', 'Valor: decrescente')
    await expect(args.onSortChange).toHaveBeenCalledWith({
      column: 'amount',
      direction: 'desc',
    })
    await closeMenus()
  },
}

export const SituationFilterReportsTheSituation: Story = {
  play: async ({ args, canvasElement }) => {
    await chooseInSubmenu(canvasElement, 'Situação', 'Vencido')
    await expect(args.onSituationFilterChange).toHaveBeenCalledWith('overdue')
    await closeMenus()
    await expect(
      within(toolbarOf(canvasElement)).getByRole('button', {
        name: 'Exibição (1)',
      }),
    ).toBeVisible()
  },
}

export const TypeFilterReportsTheType: Story = {
  play: async ({ args, canvasElement }) => {
    await chooseInSubmenu(canvasElement, 'Tipo', 'Despesa')
    await expect(args.onTypeFilterChange).toHaveBeenCalledWith('expense')
    await closeMenus()
  },
}

export const FeeTypeFilterReportsTheFeeType: Story = {
  play: async ({ args, canvasElement }) => {
    await chooseInSubmenu(canvasElement, 'Tipo de honorário', 'Êxito')
    await expect(args.onFeeTypeFilterChange).toHaveBeenCalledWith('success')
    await closeMenus()
  },
}

export const AccountFilterReportsTheAccount: Story = {
  play: async ({ args, canvasElement }) => {
    await chooseInSubmenu(canvasElement, 'Conta', 'Itaú PJ')
    await expect(args.onAccountFilterChange).toHaveBeenCalledWith('itau')
    await closeMenus()
  },
}

export const ClearFiltersResetsEveryFilter: Story = {
  play: async ({ args, canvasElement }) => {
    await chooseInSubmenu(canvasElement, 'Situação', 'Vencido')
    await closeMenus()
    await openDisplayMenu(canvasElement)
    await userEvent.click(
      await screen.findByRole('menuitem', { name: 'Limpar filtros' }),
    )
    await expect(args.onSituationFilterChange).toHaveBeenLastCalledWith(null)
    await expect(args.onTypeFilterChange).toHaveBeenLastCalledWith(null)
    await expect(args.onFeeTypeFilterChange).toHaveBeenLastCalledWith(null)
    await expect(args.onAccountFilterChange).toHaveBeenLastCalledWith(null)
    await closeMenus()
  },
}

export const SaveViewPreferenceCallsItsCallback: Story = {
  play: async ({ args, canvasElement }) => {
    await openDisplayMenu(canvasElement)
    await userEvent.click(
      await screen.findByRole('menuitem', { name: 'Salvar preferência' }),
    )
    await expect(args.onSavePreference).toHaveBeenCalledOnce()
    await closeMenus()
  },
}

export const TheAmountFollowsTheKind: Story = {
  play: async ({ canvasElement }) => {
    const amountOf = (title: string) =>
      rowOf(canvasElement, title).querySelector(
        '[data-slot="finance-3-amount"]',
      ) as HTMLElement
    await expect(amountOf(overdueFee)).toHaveAttribute('data-direction', 'in')
    await expect(amountOf(overdueFee)).toHaveTextContent(/^\+R\$\s4\.500,00$/)
    await expect(amountOf(openExpense)).toHaveAttribute('data-direction', 'out')
    await expect(amountOf(openExpense)).toHaveTextContent(/1\.250,00$/)
    await expect(amountOf(transfer)).toHaveAttribute('data-direction', 'none')
  },
}

export const TheSituationKeepsItsLabel: Story = {
  play: async ({ canvasElement }) => {
    await expect(
      within(rowOf(canvasElement, overdueFee)).getByRole('img', {
        name: 'Situação: Vencido',
      }),
    ).toBeVisible()
    await expect(
      within(rowOf(canvasElement, settledFee)).getByRole('img', {
        name: 'Situação: Quitado',
      }),
    ).toBeVisible()
  },
}

export const ATransferShowsBothAccounts: Story = {
  args: { allColumns: true },
  play: async ({ canvasElement }) => {
    await expect(
      within(rowOf(canvasElement, transfer)).getByText(
        'Itaú PJ → Caixa do escritório',
      ),
    ).toBeVisible()
  },
}

export const ResponsibleSelectReportsTheMember: Story = {
  args: { allColumns: true },
  play: async ({ args, canvasElement }) => {
    await pick(
      within(rowOf(canvasElement, overdueFee)).getByRole('combobox', {
        name: 'Responsável: Beatriz Nogueira',
      }),
      'Thiago Freitas',
    )
    await expect(args.onResponsibleChange).toHaveBeenCalledWith(
      'lanc-101',
      'thiago',
    )
  },
}

export const AccountSelectReportsTheAccount: Story = {
  args: { allColumns: true },
  play: async ({ args, canvasElement }) => {
    await pick(
      within(rowOf(canvasElement, openExpense)).getByRole('combobox', {
        name: 'Conta: Banco do Brasil',
      }),
      'Itaú PJ',
    )
    await expect(args.onAccountChange).toHaveBeenCalledWith('lanc-102', 'itau')
  },
}

export const CategorySelectOffersTheCategoriesOfTheDirection: Story = {
  args: { allColumns: true },
  play: async ({ args, canvasElement }) => {
    await userEvent.click(
      within(rowOf(canvasElement, openExpense)).getByRole('combobox', {
        name: 'Categoria: Custas processuais',
      }),
    )
    await expect(
      await screen.findByRole('option', { name: 'Aluguel' }),
    ).toBeVisible()
    await expect(
      screen.queryByRole('option', { name: 'Honorários' }),
    ).toBeNull()
    await userEvent.click(screen.getByRole('option', { name: 'Software' }))
    await expect(args.onCategoryChange).toHaveBeenCalledWith(
      'lanc-102',
      'software',
    )
    await waitFor(() => expect(screen.queryByRole('listbox')).toBeNull())
  },
}

export const AnEntryWithoutCanEditIsReadOnly: Story = {
  args: { allColumns: true },
  play: async ({ canvasElement }) => {
    await expect(
      within(rowOf(canvasElement, settledFee)).queryByRole('combobox'),
    ).toBeNull()
  },
}

export const ARowOpensTheEntry: Story = {
  play: async ({ args, canvasElement }) => {
    await userEvent.click(
      within(canvasElement).getByRole('button', {
        name: `Abrir ${overdueFee}`,
      }),
    )
    await expect(args.onOpen).toHaveBeenCalledWith('lanc-101')
  },
}

export const SelectingRowsOpensTheActionBar: Story = {
  play: async ({ args, canvasElement }) => {
    await expect(actionBarOf(canvasElement)).toBeNull()
    await select(canvasElement, overdueFee)
    await expect(args.onSelectedIdsChange).toHaveBeenLastCalledWith([
      'lanc-101',
    ])
    const bar = await within(canvasElement).findByRole('toolbar', {
      name: 'Ações dos lançamentos selecionados',
    })
    await expect(bar).toHaveTextContent('1 selecionado')
  },
}

export const BulkSettleReportsOnlyTheOpenEntries: Story = {
  play: async ({ args, canvasElement }) => {
    await select(canvasElement, overdueFee)
    await select(canvasElement, settledFee)
    const bar = within(actionBarOf(canvasElement) as HTMLElement)
    await userEvent.click(bar.getByRole('button', { name: 'Quitar' }))
    await userEvent.click(
      await screen.findByRole('menuitem', { name: 'Itaú PJ' }),
    )
    await expect(args.onBulkSettle).toHaveBeenCalledWith(['lanc-101'], 'itau')
    await expect(args.onSelectedIdsChange).toHaveBeenLastCalledWith([])
    await waitFor(() => expect(actionBarOf(canvasElement)).toBeNull())
  },
}

export const BulkSettleNeedsAnOpenEntry: Story = {
  play: async ({ canvasElement }) => {
    await select(canvasElement, settledFee)
    const bar = within(actionBarOf(canvasElement) as HTMLElement)
    await expect(isDisabled(bar.getByRole('button', { name: 'Quitar' }))).toBe(
      true,
    )
  },
}

export const BulkResponsibleReportsTheEditableEntries: Story = {
  play: async ({ args, canvasElement }) => {
    await select(canvasElement, overdueFee)
    await select(canvasElement, openExpense)
    await select(canvasElement, settledFee)
    const bar = within(actionBarOf(canvasElement) as HTMLElement)
    await userEvent.click(bar.getByRole('button', { name: 'Responsável' }))
    await userEvent.click(
      await screen.findByRole('menuitem', { name: 'Camila Duarte' }),
    )
    await expect(args.onBulkResponsibleChange).toHaveBeenCalledWith(
      ['lanc-101', 'lanc-102'],
      'camila',
    )
    await waitFor(() => expect(actionBarOf(canvasElement)).toBeNull())
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
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByText('1–5 de 12')).toBeVisible()
    await userEvent.click(
      within(
        canvas.getByRole('navigation', { name: 'Paginação de lançamentos' }),
      ).getByRole('button', { name: 'Próxima página' }),
    )
    await expect(args.onPageChange).toHaveBeenCalledWith(2)
    await expect(canvas.getByText('6–10 de 12')).toBeVisible()
  },
}

export const SearchReportsTheTextOnSubmit: Story = {
  play: async ({ args, canvasElement }) => {
    const field = within(toolbarOf(canvasElement)).getByRole('searchbox', {
      name: 'Buscar lançamentos',
    })
    await userEvent.type(field, 'aluguel')
    await expect(args.onSearchChange).not.toHaveBeenCalled()
    await userEvent.keyboard('{Enter}')
    await expect(args.onSearchChange).toHaveBeenCalledWith('aluguel')
    await expect(rowsOf(canvasElement)).toHaveLength(1)
  },
}

export const CreateCallsItsCallback: Story = {
  play: async ({ args, canvasElement }) => {
    await userEvent.click(
      within(toolbarOf(canvasElement)).getByRole('button', {
        name: 'Novo lançamento',
      }),
    )
    await expect(args.onCreate).toHaveBeenCalledOnce()
  },
}

export const TheEmptyMessageOfEntries: Story = {
  args: { empty: true },
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByText('Nenhum lançamento ainda.'),
    ).toBeVisible()
  },
}

export const TheEmptyMessageNamesTheFilters: Story = {
  render: () => <Finance3 filtered records={[]} variant="entries" />,
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByText('Nenhum lançamento com esses filtros.'),
    ).toBeVisible()
  },
}

export const PendingShowsTheSkeleton: Story = {
  render: () => <Finance3 pending records={[]} variant="entries" />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(
      canvas.getByLabelText('Carregando lançamentos'),
    ).toHaveAttribute('aria-busy', 'true')
    await expect(canvas.getByRole('button', { name: 'Todos' })).toBeVisible()
    await expect(canvas.queryByRole('button', { name: /^Exibição/ })).toBeNull()
  },
}

export const ErrorShowsRetry: Story = {
  render: (args) => (
    <Finance3 error onRetry={args.onRetry} records={[]} variant="entries" />
  ),
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(
      canvas.getByText('Não foi possível listar os lançamentos'),
    ).toBeVisible()
    await userEvent.click(
      canvas.getByRole('button', { name: 'Tentar novamente' }),
    )
    await expect(args.onRetry).toHaveBeenCalledOnce()
  },
}

export const TheQueueShowsItsColumns: Story = {
  args: { variant: 'receivables' },
  play: async ({ canvasElement }) => {
    await expect(
      within(toolbarOf(canvasElement)).getByRole('button', {
        name: 'A cobrar',
      }),
    ).toBeVisible()
    for (const name of [
      'Pagador',
      'Parcela',
      'Valor',
      'Vencimento',
      'Último contato',
      'Cobrança',
      'Ações',
    ])
      await expect(header(canvasElement, name)).toBeInTheDocument()
  },
}

export const TheChargeShowsItsStatusOrFailure: Story = {
  args: { variant: 'receivables' },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(
      within(rowOf(canvasElement, 'Moinho Santa Clara Ltda.')).getByRole(
        'img',
        { name: 'Cobrança: Ativa' },
      ),
    ).toBeVisible()
    await expect(
      canvas.getByText('Falha ao gerar cobrança em 19/11/2026'),
    ).toBeVisible()
    await expect(
      within(rowOf(canvasElement, 'Clínica Vida Plena')).getByText(
        'Sem cobrança',
      ),
    ).toBeVisible()
  },
}

export const TheDueKeepsItsTone: Story = {
  args: { variant: 'receivables' },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByText('15 dias em atraso')).toHaveAttribute(
      'data-tone',
      'danger',
    )
    await expect(canvas.getByText('Vence em 2 dias')).toHaveAttribute(
      'data-tone',
      'warning',
    )
  },
}

export const RowActionsFollowTheChargeAction: Story = {
  args: { variant: 'receivables' },
  play: async ({ args, canvasElement }) => {
    const menu = within(await openRowActions(canvasElement, moinhoInstallment))
    await expect(
      menu.queryByRole('menuitem', { name: 'Emitir cobrança' }),
    ).toBeNull()
    await userEvent.click(
      menu.getByRole('menuitem', { name: 'Reemitir cobrança' }),
    )
    await expect(args.onReissueCharge).toHaveBeenCalledWith('lanc-101')
    await waitFor(() => expect(screen.queryByRole('menu')).toBeNull())
    const next = within(await openRowActions(canvasElement, clinicInstallment))
    await userEvent.click(
      next.getByRole('menuitem', { name: 'Emitir cobrança' }),
    )
    await expect(args.onIssueCharge).toHaveBeenCalledWith('lanc-106')
    await waitFor(() => expect(screen.queryByRole('menu')).toBeNull())
  },
}

export const ContactNeedsAPhone: Story = {
  args: { variant: 'receivables' },
  play: async ({ args, canvasElement }) => {
    const menu = within(await openRowActions(canvasElement, noPhoneInstallment))
    const contact = menu.getByRole('menuitem', { name: /^Cobrar/ })
    await expect(contact).toHaveTextContent('O cliente não tem telefone.')
    await expect(isDisabled(contact)).toBe(true)
    await closeMenus()
    const next = within(await openRowActions(canvasElement, moinhoInstallment))
    await userEvent.click(next.getByRole('menuitem', { name: 'Cobrar' }))
    await expect(args.onContact).toHaveBeenCalledWith('lanc-101')
    await waitFor(() => expect(screen.queryByRole('menu')).toBeNull())
  },
}

export const MarkCollectedFromTheRowReportsTheId: Story = {
  args: { variant: 'receivables' },
  play: async ({ args, canvasElement }) => {
    const menu = within(await openRowActions(canvasElement, moinhoInstallment))
    await userEvent.click(
      menu.getByRole('menuitem', { name: 'Marcar cobrado' }),
    )
    await expect(args.onMarkCollected).toHaveBeenCalledWith(['lanc-101'])
    await waitFor(() => expect(screen.queryByRole('menu')).toBeNull())
  },
}

export const BulkMarkCollectedReportsTheIds: Story = {
  args: { variant: 'receivables' },
  play: async ({ args, canvasElement }) => {
    await select(canvasElement, moinhoInstallment)
    await select(canvasElement, clinicInstallment)
    const bar = await within(canvasElement).findByRole('toolbar', {
      name: 'Ações das parcelas selecionadas',
    })
    await userEvent.click(
      within(bar).getByRole('button', { name: 'Marcar cobrado' }),
    )
    await expect(args.onMarkCollected).toHaveBeenCalledWith([
      'lanc-101',
      'lanc-106',
    ])
  },
}

export const TruncatedShowsTheNotice: Story = {
  args: { truncated: true, variant: 'receivables' },
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByText(
        'Mostrando as 500 parcelas mais atrasadas.',
      ),
    ).toBeVisible()
  },
}

export const TheQueueGoesBackToTheEntries: Story = {
  args: { variant: 'receivables' },
  play: async ({ canvasElement }) => {
    await chooseView(canvasElement, 'A cobrar', 'Todos, 12 itens')
    await expect(
      await within(canvasElement).findByRole('region', { name: 'Lançamentos' }),
    ).toBeVisible()
    await expect(header(canvasElement, 'Situação')).toBeVisible()
  },
}

export const TheStatementShowsItsHeadingAndSummary: Story = {
  args: { variant: 'statement' },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(
      canvas.getByRole('heading', { level: 2, name: 'Extrato' }),
    ).toBeVisible()
    await expect(
      canvas.getByText(
        /^Itaú PJ · 01\/11\/2026 a 25\/11\/2026 · Saldo anterior R\$\s18\.430,00$/,
      ),
    ).toBeVisible()
    for (const name of [
      'Data',
      'Descrição',
      'Tipo',
      'Outra conta',
      'Categoria',
      'Motivo',
      'Valor',
      'Saldo',
    ])
      await expect(header(canvasElement, name)).toBeVisible()
  },
}

export const TheFooterShowsTheClosingBalance: Story = {
  args: { variant: 'statement' },
  play: async ({ canvasElement }) => {
    const closing = canvasElement.querySelector(
      '[data-slot="finance-3-closing-balance"]',
    ) as HTMLElement
    await expect(closing.closest('tfoot')).not.toBeNull()
    await expect(closing).toHaveTextContent(/^Saldo finalR\$\s38\.990,00$/)
  },
}

export const ASettlementReadsAsInflowOrOutflow: Story = {
  args: { paginated: false, variant: 'statement' },
  play: async ({ canvasElement }) => {
    await expect(
      within(rowOf(canvasElement, settledFee)).getByText('Entrada'),
    ).toBeVisible()
    await expect(
      within(
        rowOf(canvasElement, 'Aluguel do escritório · novembro'),
      ).getByText('Saída'),
    ).toBeVisible()
    await expect(
      within(rowOf(canvasElement, transfer)).getByText('Transferência enviada'),
    ).toBeVisible()
  },
}

export const OnlyALineWithAnEntryOpens: Story = {
  args: { paginated: false, variant: 'statement' },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(
      canvas.queryByRole('button', { name: 'Abrir Tarifa bancária' }),
    ).toBeNull()
    await userEvent.click(
      canvas.getByRole('button', {
        name: 'Abrir Aluguel do escritório · novembro',
      }),
    )
    await expect(args.onOpen).toHaveBeenCalledWith('lanc-126')
  },
}

export const PeriodFilterReportsThePeriod: Story = {
  args: { variant: 'statement' },
  play: async ({ args, canvasElement }) => {
    await chooseInSubmenu(
      canvasElement,
      'Período',
      'Mês anterior',
      'Controles do extrato',
    )
    await expect(args.onPeriodChange).toHaveBeenCalledWith('previous')
    await closeMenus()
  },
}

export const StatementAccountFilterReportsTheAccount: Story = {
  args: { variant: 'statement' },
  play: async ({ args, canvasElement }) => {
    await chooseInSubmenu(
      canvasElement,
      'Conta',
      'Banco do Brasil',
      'Controles do extrato',
    )
    await expect(args.onStatementAccountChange).toHaveBeenCalledWith('bb')
    await closeMenus()
  },
}

export const ExportCallsItsCallback: Story = {
  args: { variant: 'statement' },
  play: async ({ args, canvasElement }) => {
    await userEvent.click(
      within(toolbarOf(canvasElement, 'Controles do extrato')).getByRole(
        'button',
        { name: 'Exportar mês' },
      ),
    )
    await expect(args.onExport).toHaveBeenCalledOnce()
  },
}

export const ExportingDisablesExport: Story = {
  render: (args) => (
    <Finance3
      exporting
      onExport={args.onExport}
      records={statementLines}
      summary={statementSummary}
      variant="statement"
    />
  ),
  play: async ({ canvasElement }) => {
    await expect(
      isDisabled(
        within(canvasElement).getByRole('button', { name: 'Exportar mês' }),
      ),
    ).toBe(true)
  },
}

export const ExportErrorOffersRetry: Story = {
  render: (args) => (
    <Finance3
      accounts={accounts}
      exportError
      onExport={args.onExport}
      periods={periods}
      records={statementLines}
      summary={statementSummary}
      variant="statement"
    />
  ),
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(
      canvas.getByText('Não foi possível exportar o mês'),
    ).toBeVisible()
    await userEvent.click(
      canvas.getByRole('button', { name: 'Tentar de novo' }),
    )
    await expect(args.onExport).toHaveBeenCalledOnce()
  },
}

export const StatementPendingKeepsTheHeading: Story = {
  render: () => (
    <Finance3
      pending
      records={[]}
      summary={statementSummary}
      variant="statement"
    />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(
      canvas.getByLabelText('Carregando movimentações'),
    ).toHaveAttribute('aria-busy', 'true')
    await expect(
      canvas.getByRole('heading', { level: 2, name: 'Extrato' }),
    ).toBeVisible()
    await expect(canvas.queryByText(/Saldo anterior/)).toBeNull()
  },
}

export const ClientMoneyListsTheBalancesAndOpensTheClient: Story = {
  args: { variant: 'clientMoney' },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(
      canvas.getByRole('heading', { level: 2, name: 'Dinheiro de clientes' }),
    ).toBeVisible()
    await expect(header(canvasElement, 'Cliente')).toBeVisible()
    await expect(header(canvasElement, 'Saldo')).toBeVisible()
    await expect(
      within(rowOf(canvasElement, 'Helena Prado')).getByText(/3\.000,00$/),
    ).toBeVisible()
    await userEvent.click(
      canvas.getByRole('button', { name: 'Abrir Helena Prado' }),
    )
    await expect(args.onOpenClient).toHaveBeenCalledWith('person:11')
  },
}

export const ClientMoneyErrorShowsItsTitle: Story = {
  render: (args) => (
    <Finance3 error onRetry={args.onRetry} records={[]} variant="clientMoney" />
  ),
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByText(
        'Não foi possível carregar o dinheiro de clientes',
      ),
    ).toBeVisible()
  },
}

export const MembersFeedTheBulkResponsible: Story = {
  render: (args) => (
    <Finance3
      members={members.slice(0, 1)}
      onBulkResponsibleChange={args.onBulkResponsibleChange}
      records={[
        {
          accountId: null,
          amount: 10000,
          canEdit: true,
          categoryId: null,
          description: 'Consulta avulsa',
          dueOn: '2026-12-01',
          feeType: null,
          id: 'lanc-900',
          kind: 'other_income',
          payer: null,
          responsibleId: null,
          situation: 'open',
          target: null,
        },
      ]}
      variant="entries"
    />
  ),
  play: async ({ canvasElement }) => {
    await select(canvasElement, 'Consulta avulsa')
    const bar = within(actionBarOf(canvasElement) as HTMLElement)
    await userEvent.click(bar.getByRole('button', { name: 'Responsável' }))
    await expect(
      await screen.findByRole('menuitem', { name: 'Beatriz Nogueira' }),
    ).toBeVisible()
    await expect(
      screen.queryByRole('menuitem', { name: 'Rafael Antunes' }),
    ).toBeNull()
    await closeMenus()
  },
}
