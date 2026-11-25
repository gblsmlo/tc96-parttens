import type { Meta, StoryObj } from '@storybook/react-vite'
import { Table3 } from '@tc96/ui/blocks/data/table/table-3'
import { expect, fn, screen, userEvent, waitFor, within } from 'storybook/test'
import { renewals, views } from '../fixtures/table-3.ts'
import { type Table3Controls, table3ControlArgs } from './table-3-controls.ts'
import { ComposedTable3 } from './table-3-layouts.tsx'

const retry = fn()

const meta = {
  args: {
    ...table3ControlArgs,
    onAssignOwner: fn(),
    onColumnVisibilityChange: fn(),
    onConditionsChange: fn(),
    onCreate: fn(),
    onRowAction: fn(),
    onSaveView: fn(),
    onSelectedIdsChange: fn(),
    onSortChange: fn(),
    onStageUpdate: fn(),
    onViewChange: fn(),
    onViewCreate: fn(),
  },
  parameters: { layout: 'padded' },
  render: (args) => <ComposedTable3 {...args} />,
  tags: ['!autodocs'],
  title: 'Blocks/Data/Table/Table3/Behavior',
} satisfies Meta<
  Table3Controls & {
    onAssignOwner: () => void
    onColumnVisibilityChange: () => void
    onConditionsChange: () => void
    onCreate: () => void
    onRowAction: () => void
    onSaveView: () => void
    onSelectedIdsChange: () => void
    onSortChange: () => void
    onStageUpdate: () => void
    onViewChange: () => void
    onViewCreate: () => void
  }
>

export default meta

type Story = StoryObj<typeof meta>

const rowsOf = (canvasElement: HTMLElement) =>
  Array.from(
    canvasElement.querySelectorAll('[data-slot="data-table"] tbody tr'),
  )

const headerOf = (canvasElement: HTMLElement) =>
  within(canvasElement).getByRole('toolbar', {
    name: 'Controles das renovações',
  })

const actionBarOf = (canvasElement: HTMLElement) =>
  canvasElement.querySelector<HTMLElement>('[data-slot="action-bar"]')

const chooseInActionBar = async (
  canvasElement: HTMLElement,
  action: string,
) => {
  const bar = within(actionBarOf(canvasElement) as HTMLElement)
  await userEvent.click(bar.getByRole('button', { name: action }))
  return screen.findByRole('menu')
}

const openSettings = async (canvasElement: HTMLElement) => {
  await userEvent.click(
    within(canvasElement).getByRole('button', { name: /^Configurações/ }),
  )
  return screen.findByRole('menu')
}

const select = (canvasElement: HTMLElement, account: string) =>
  userEvent.click(
    within(canvasElement).getByRole('checkbox', {
      name: `Selecionar ${account}`,
    }),
  )

export const TheViewSwitcherReplacesTheHeading: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.queryAllByRole('heading')).toHaveLength(0)
    await expect(
      canvas.getByRole('button', { name: 'Todas as renovações' }),
    ).toBeVisible()
    await expect(
      canvas.getByRole('region', { name: 'Revisão de renovações' }),
    ).toBeVisible()
  },
}

export const WithoutViewsTheHeadingReturns: Story = {
  args: { savedViews: false },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(
      canvas.queryByRole('button', { name: 'Todas as renovações' }),
    ).toBeNull()
    const headings = canvas.getAllByRole('heading')
    await expect(headings).toHaveLength(1)
    await expect(headings[0]).toHaveTextContent('Revisão de renovações')
    await expect(headings[0]?.tagName).toBe('H2')
  },
}

export const TheToolbarCarriesTheViewSwitcherAndTheControls: Story = {
  play: async ({ canvasElement }) => {
    const toolbar = headerOf(canvasElement)
    await expect(toolbar).toHaveAttribute('data-mode', 'plain')
    const inToolbar = within(toolbar)
    await expect(
      inToolbar.getByRole('button', { name: 'Todas as renovações' }),
    ).toBeVisible()
    await expect(inToolbar.queryByRole('heading')).toBeNull()
    await expect(
      inToolbar.getByRole('button', { name: /^Configurações/ }),
    ).toBeVisible()
    await expect(
      inToolbar.getByRole('button', { name: 'Nova transação' }),
    ).toBeVisible()
    await expect(
      inToolbar.queryByRole('group', { name: 'Filtro de Conta' }),
    ).toBeNull()
  },
}

export const EachRowShowsTheRenewalDetails: Story = {
  play: async ({ canvasElement }) => {
    const first = rowsOf(canvasElement)[0] as HTMLElement
    await expect(rowsOf(canvasElement)).toHaveLength(8)
    await expect(first).toHaveTextContent('Atlas Pagamentos')
    await expect(first).toHaveTextContent('Maya Pereira')
    await expect(first).toHaveTextContent('Enterprise')
    await expect(first).toHaveTextContent('Vence em 7 d')
    await expect(first).toHaveTextContent(/R\$\s420\.000/)
    await expect(first).toHaveTextContent(/\+R\$\s95\.000 de potencial/)
    await expect(first).toHaveTextContent('Saúde 46%, Em risco')
    await expect(first).toHaveTextContent('Revisão jurídica')
    await expect(first).toHaveTextContent('Crítico')
  },
}

export const UrgencyAndHealthAreDataAttributes: Story = {
  play: async ({ canvasElement }) => {
    const first = rowsOf(canvasElement)[0] as HTMLElement
    await expect(first.querySelector('[data-urgency]')).toHaveAttribute(
      'data-urgency',
      'soon',
    )
    await expect(first.querySelector('[data-health]')).toHaveAttribute(
      'data-health',
      'at-risk',
    )
    await expect(first.querySelector('[data-risk]')).toHaveAttribute(
      'data-risk',
      'critical',
    )
  },
}

export const TheSummaryCountsTheFilteredRenewals: Story = {
  args: { savedViews: false },
  play: async ({ canvasElement }) => {
    await expect(headerOf(canvasElement)).toHaveTextContent(
      /6 vencem em 30 dias · 3 em risco · R\$\s1,1\smi de ARR em risco/,
    )
  },
}

export const ItStartsWithAnEmptyAccountCondition: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(
      canvas.getByRole('group', { name: 'Filtro de Conta' }),
    ).toBeVisible()
    await expect(rowsOf(canvasElement)).toHaveLength(8)
  },
}

export const AConditionValueFiltersTheRows: Story = {
  args: { savedViews: false },
  play: async ({ args, canvasElement }) => {
    const chip = within(
      within(canvasElement).getByRole('group', { name: 'Filtro de Conta' }),
    )
    await userEvent.click(chip.getByRole('button', { name: 'Buscar...' }))
    await userEvent.type(
      await screen.findByRole('textbox', { name: 'Valor de Conta' }),
      'Atlas',
    )
    await waitFor(() =>
      expect(args.onConditionsChange).toHaveBeenLastCalledWith([
        expect.objectContaining({
          columnId: 'account',
          operator: 'contains',
          value: ['Atlas'],
        }),
      ]),
    )
    await waitFor(() => expect(rowsOf(canvasElement)).toHaveLength(1))
    await expect(headerOf(canvasElement)).toHaveTextContent(
      '1 vencem em 30 dias',
    )
  },
}

export const TheFieldsMenuAddsACondition: Story = {
  play: async ({ args, canvasElement }) => {
    await userEvent.click(
      within(canvasElement).getByRole('button', { name: 'Filtros' }),
    )
    const dialog = await screen.findByRole('dialog', { name: 'Filtros' })
    await userEvent.type(
      within(dialog).getByRole('combobox', { name: 'Buscar campos' }),
      'Ris',
    )
    await userEvent.click(await within(dialog).findByText('Risco'))
    await waitFor(() =>
      expect(args.onConditionsChange).toHaveBeenLastCalledWith([
        expect.objectContaining({ columnId: 'account' }),
        expect.objectContaining({ columnId: 'risk', operator: 'is' }),
      ]),
    )
    await expect(
      within(canvasElement).getByRole('group', { name: 'Filtro de Risco' }),
    ).toBeVisible()
  },
}

export const AnOptionConditionFiltersTheRows: Story = {
  render: () => (
    <Table3
      conditions={[
        { columnId: 'risk', id: 'r', operator: 'is', value: ['critical'] },
      ]}
      renewals={renewals}
    />
  ),
  play: async ({ canvasElement }) => {
    await expect(rowsOf(canvasElement)).toHaveLength(2)
    await expect(
      within(canvasElement).queryByRole('button', { name: 'Filtros' }),
    ).toBeNull()
  },
}

export const ANumberConditionFiltersTheRows: Story = {
  render: () => (
    <Table3
      conditions={[
        { columnId: 'arr', id: 'a', operator: 'gt', value: ['300000'] },
      ]}
      renewals={renewals}
    />
  ),
  play: async ({ canvasElement }) => {
    await expect(rowsOf(canvasElement)).toHaveLength(4)
  },
}

export const ADateConditionFiltersTheRows: Story = {
  render: () => (
    <Table3
      conditions={[
        {
          columnId: 'renewal',
          id: 'd',
          operator: 'before',
          value: ['2026-12-20'],
        },
      ]}
      renewals={renewals}
    />
  ),
  play: async ({ canvasElement }) => {
    await expect(rowsOf(canvasElement)).toHaveLength(4)
  },
}

export const AHiddenFieldConditionFiltersTheRows: Story = {
  render: () => (
    <Table3
      conditions={[
        { columnId: 'owner', id: 'o', operator: 'is', value: ['priya'] },
      ]}
      renewals={renewals}
    />
  ),
  play: async ({ canvasElement }) => {
    await expect(rowsOf(canvasElement)).toHaveLength(3)
  },
}

export const ClearFiltersRemovesEveryCondition: Story = {
  play: async ({ args, canvasElement }) => {
    await userEvent.click(
      within(canvasElement).getByRole('button', { name: 'Limpar filtros' }),
    )
    await expect(args.onConditionsChange).toHaveBeenLastCalledWith([])
    await waitFor(() =>
      expect(
        within(canvasElement).queryByRole('group', { name: 'Filtro de Conta' }),
      ).toBeNull(),
    )
  },
}

export const TheChipMenuRemovesItsCondition: Story = {
  play: async ({ args, canvasElement }) => {
    await userEvent.click(
      within(canvasElement).getByRole('button', {
        name: 'Ações do filtro de Conta',
      }),
    )
    await userEvent.click(
      await screen.findByRole('menuitem', { name: 'Remover filtro' }),
    )
    await expect(args.onConditionsChange).toHaveBeenLastCalledWith([])
  },
}

export const SettingsSortsWithItsLabels: Story = {
  play: async ({ args, canvasElement }) => {
    const menu = await openSettings(canvasElement)
    await userEvent.click(
      within(menu).getByRole('menuitem', { name: 'Ordenar por' }),
    )
    await userEvent.click(
      await screen.findByRole('menuitem', { name: 'ARR: decrescente' }),
    )
    await waitFor(() =>
      expect(args.onSortChange).toHaveBeenLastCalledWith({
        direction: 'desc',
        key: 'arr',
      }),
    )
    await expect(rowsOf(canvasElement)[0]).toHaveTextContent('Granito Seguros')
  },
}

export const SettingsHidesAColumn: Story = {
  play: async ({ args, canvasElement }) => {
    const menu = await openSettings(canvasElement)
    await userEvent.click(
      within(menu).getByRole('menuitem', { name: 'Colunas' }),
    )
    await userEvent.click(
      await screen.findByRole('menuitemcheckbox', { name: 'Saúde' }),
    )
    await waitFor(() =>
      expect(args.onColumnVisibilityChange).toHaveBeenLastCalledWith({
        health: false,
      }),
    )
    await expect(
      within(canvasElement).queryByRole('columnheader', { name: /^Saúde/ }),
    ).toBeNull()
  },
}

export const SaveViewCallsOnSaveView: Story = {
  play: async ({ args, canvasElement }) => {
    const menu = await openSettings(canvasElement)
    await userEvent.click(
      within(menu).getByRole('menuitem', { name: 'Salvar view' }),
    )
    await expect(args.onSaveView).toHaveBeenCalledOnce()
  },
}

export const TheViewSwitcherReportsTheView: Story = {
  play: async ({ args, canvasElement }) => {
    await userEvent.click(
      within(canvasElement).getByRole('button', {
        name: 'Todas as renovações',
      }),
    )
    const dialog = await screen.findByRole('dialog', {
      name: 'Todas as renovações',
    })
    await userEvent.click(
      within(dialog).getByRole('button', { name: 'Em risco' }),
    )
    await expect(args.onViewChange).toHaveBeenLastCalledWith('risk')
  },
}

export const SelectingRowsOpensTheActionBar: Story = {
  play: async ({ args, canvasElement }) => {
    await expect(actionBarOf(canvasElement)).toBeNull()
    await select(canvasElement, 'Atlas Pagamentos')
    await select(canvasElement, 'Base Nuvem')
    await expect(args.onSelectedIdsChange).toHaveBeenLastCalledWith([
      'atlas',
      'base-nuvem',
    ])
    const bar = await within(canvasElement).findByRole('toolbar', {
      name: 'Ações das renovações selecionadas',
    })
    await expect(bar).toHaveTextContent('2 renovações selecionadas')
  },
}

export const AssignOwnerListsTheOwnersAndReportsTheIds: Story = {
  play: async ({ args, canvasElement }) => {
    await select(canvasElement, 'Atlas Pagamentos')
    const menu = await chooseInActionBar(canvasElement, 'Atribuir responsável')
    await expect(within(menu).getByText('Responsável')).toBeVisible()
    await userEvent.click(
      within(menu).getByRole('menuitem', { name: 'Omar Haddad' }),
    )
    await expect(args.onAssignOwner).toHaveBeenCalledWith(['atlas'], 'omar')
    await expect(rowsOf(canvasElement)[0]).toHaveTextContent('Maya Pereira')
  },
}

export const MoveStageListsTheStagesAndReportsTheIds: Story = {
  play: async ({ args, canvasElement }) => {
    await select(canvasElement, 'Cobalto Dados')
    const menu = await chooseInActionBar(canvasElement, 'Mover etapa')
    await expect(within(menu).getByText('Nova etapa')).toBeVisible()
    await expect(within(menu).getAllByRole('menuitem')).toHaveLength(4)
    await userEvent.click(
      within(menu).getByRole('menuitem', { name: 'Assinada' }),
    )
    await expect(args.onStageUpdate).toHaveBeenCalledWith(['cobalto'], 'signed')
  },
}

export const ClearSelectionClosesTheActionBar: Story = {
  play: async ({ args, canvasElement }) => {
    await select(canvasElement, 'Atlas Pagamentos')
    const bar = within(actionBarOf(canvasElement) as HTMLElement)
    await userEvent.click(bar.getByRole('button', { name: 'Limpar seleção' }))
    await expect(args.onSelectedIdsChange).toHaveBeenLastCalledWith([])
    await waitFor(() => expect(actionBarOf(canvasElement)).toBeNull())
  },
}

export const ActionBarItemsNeedTheirCallbacks: Story = {
  args: { bulkActions: false },
  play: async ({ canvasElement }) => {
    await select(canvasElement, 'Atlas Pagamentos')
    const bar = within(actionBarOf(canvasElement) as HTMLElement)
    await expect(
      bar.queryByRole('button', { name: 'Atribuir responsável' }),
    ).toBeNull()
    await expect(bar.queryByRole('button', { name: 'Mover etapa' })).toBeNull()
    await expect(
      bar.getByRole('button', { name: 'Limpar seleção' }),
    ).toBeVisible()
  },
}

export const TheRowMenuReportsTheAction: Story = {
  play: async ({ args, canvasElement }) => {
    await userEvent.click(
      within(canvasElement).getByRole('button', {
        name: 'Ações de Atlas Pagamentos',
      }),
    )
    await userEvent.click(
      await screen.findByRole('menuitem', { name: 'Criar plano de renovação' }),
    )
    await expect(args.onRowAction).toHaveBeenCalledWith('plan', 'atlas')
  },
}

export const CreateCallsOnCreate: Story = {
  play: async ({ args, canvasElement }) => {
    await userEvent.click(
      within(canvasElement).getByRole('button', { name: 'Nova transação' }),
    )
    await expect(args.onCreate).toHaveBeenCalledOnce()
  },
}

export const LocaleAndCurrencyFormatTheAmounts: Story = {
  args: { currency: 'USD', locale: 'en-US' },
  play: async ({ canvasElement }) => {
    await expect(rowsOf(canvasElement)[0]).toHaveTextContent('$420,000')
  },
}

export const LabelsOverrideTexts: Story = {
  render: () => (
    <Table3
      labels={{
        columns: { account: 'Cliente' },
        due: (_urgency, days) => `D-${days}`,
        title: 'Renovações',
      }}
      renewals={renewals}
    />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(
      canvas.getByRole('heading', { name: 'Renovações' }),
    ).toBeVisible()
    await expect(
      canvas.getByRole('columnheader', { name: /Cliente/ }),
    ).toBeVisible()
    await expect(rowsOf(canvasElement)[0]).toHaveTextContent('D-7')
  },
}

export const PendingShowsSkeleton: Story = {
  render: () => <Table3 pending renewals={renewals} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(
      canvas.getByLabelText('Carregando renovações'),
    ).toHaveAttribute('aria-busy', 'true')
    await expect(
      canvas.getByRole('heading', { name: 'Revisão de renovações' }),
    ).toBeVisible()
    await expect(canvas.getAllByRole('heading')).toHaveLength(1)
    await expect(
      canvas.queryByRole('button', { name: /^Configurações/ }),
    ).toBeNull()
    await expect(
      canvas.queryByRole('group', { name: 'Filtro de Conta' }),
    ).toBeNull()
    await expect(canvas.queryByRole('table')).toBeNull()
  },
}

export const PendingKeepsTheViewSwitcher: Story = {
  render: () => (
    <Table3 activeViewId="all" pending renewals={renewals} views={views} />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByLabelText('Carregando renovações')).toBeVisible()
    await expect(
      canvas.getByRole('button', { name: 'Todas as renovações' }),
    ).toBeVisible()
    await expect(canvas.queryAllByRole('heading')).toHaveLength(0)
    await expect(
      canvas.queryByRole('button', { name: /^Configurações/ }),
    ).toBeNull()
  },
}

export const ErrorRetryCallsOnRetry: Story = {
  render: () => <Table3 error onRetry={retry} renewals={renewals} />,
  play: async ({ canvasElement }) => {
    retry.mockClear()
    const canvas = within(canvasElement)
    await expect(
      canvas.getByText('Não foi possível carregar as renovações'),
    ).toBeVisible()
    await expect(
      canvas.getByRole('heading', { name: 'Revisão de renovações' }),
    ).toBeVisible()
    await userEvent.click(
      canvas.getByRole('button', { name: 'Tentar novamente' }),
    )
    await expect(retry).toHaveBeenCalledOnce()
  },
}

export const PendingWinsOverError: Story = {
  render: () => <Table3 error pending renewals={renewals} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByLabelText('Carregando renovações')).toBeVisible()
    await expect(
      canvas.queryByText('Não foi possível carregar as renovações'),
    ).toBeNull()
  },
}
