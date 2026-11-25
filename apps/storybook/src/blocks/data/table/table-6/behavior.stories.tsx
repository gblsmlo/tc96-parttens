import type { Meta, StoryObj } from '@storybook/react-vite'
import { Table6 } from '@tc96/ui/blocks/data/table/table-6'
import { expect, fn, screen, userEvent, waitFor, within } from 'storybook/test'
import { accounts, regions } from '../fixtures/table-6.ts'
import { type Table6Controls, table6ControlArgs } from './table-6-controls.ts'
import { ComposedTable6 } from './table-6-layouts.tsx'

const retry = fn()

const meta = {
  args: {
    ...table6ControlArgs,
    onCollapsedRegionIdsChange: fn(),
    onDensityChange: fn(),
    onExport: fn(),
    onRowAction: fn(),
  },
  parameters: { layout: 'padded' },
  render: (args) => <ComposedTable6 {...args} />,
  tags: ['!autodocs'],
  title: 'Blocks/Data/Table/Table6/Behavior',
} satisfies Meta<
  Table6Controls & {
    onCollapsedRegionIdsChange: () => void
    onDensityChange: () => void
    onExport: () => void
    onRowAction: () => void
  }
>

export default meta

type Story = StoryObj<typeof meta>

const rowsOf = (canvasElement: HTMLElement) =>
  Array.from(
    canvasElement.querySelectorAll<HTMLElement>(
      'tbody [data-slot="table-row"]',
    ),
  )

const groupRowsOf = (canvasElement: HTMLElement) =>
  Array.from(
    canvasElement.querySelectorAll<HTMLElement>(
      '[data-slot="data-table-group-row"]',
    ),
  )

const groupCell = (groupRow: HTMLElement, columnId: string) =>
  groupRow.querySelector(
    `[data-slot="data-table-group-cell"][data-column-id="${columnId}"]`,
  )

const openDisplay = async (canvasElement: HTMLElement) => {
  await userEvent.click(
    within(canvasElement).getByRole('button', { name: /^Exibição/ }),
  )
  return screen.findByRole('menu')
}

const toolbarOf = (canvasElement: HTMLElement) =>
  within(canvasElement).getByRole('toolbar', { name: 'Controles das contas' })

export const TheHeadingAppearsOnce: Story = {
  play: async ({ canvasElement }) => {
    const headings = within(canvasElement).getAllByRole('heading')
    await expect(headings).toHaveLength(1)
    await expect(headings[0]).toHaveTextContent('Receita por região')
    await expect(headings[0]?.tagName).toBe('H2')
  },
}

export const TheToolbarCarriesTheHeadingAndTheControls: Story = {
  play: async ({ canvasElement }) => {
    const toolbar = toolbarOf(canvasElement)
    await expect(toolbar).toHaveAttribute('data-mode', 'plain')
    const inToolbar = within(toolbar)
    await expect(
      inToolbar.getByRole('heading', { name: 'Receita por região' }),
    ).toBeVisible()
    await expect(
      inToolbar.getByText('Retenção líquida e renovações de toda a carteira.'),
    ).toBeVisible()
    await expect(inToolbar.getByRole('searchbox')).toBeVisible()
    await expect(
      inToolbar.getByRole('button', { name: /^Exibição/ }),
    ).toBeVisible()
    await expect(
      inToolbar.getByRole('button', { name: 'Recolher tudo' }),
    ).toBeVisible()
    await expect(
      inToolbar.getByRole('button', { name: 'Exportar' }),
    ).toBeVisible()
  },
}

export const TheIndicatorsSitBelowTheToolbar: Story = {
  play: async ({ canvasElement }) => {
    const toolbar = toolbarOf(canvasElement)
    const kpis = canvasElement.querySelector(
      '[data-slot="table-6-kpis"]',
    ) as HTMLElement
    await expect(toolbar.contains(kpis)).toBe(false)
    await expect(
      toolbar.compareDocumentPosition(kpis) & Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy()
    await expect(
      kpis.compareDocumentPosition(within(canvasElement).getByRole('table')) &
        Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy()
  },
}

export const HeaderShowsTitleIndicatorsAndExport: Story = {
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(
      canvas.getByRole('heading', { name: 'Receita por região' }),
    ).toBeVisible()
    await expect(
      canvas.getByText('Retenção líquida e renovações de toda a carteira.'),
    ).toBeVisible()
    const kpis = canvasElement.querySelector('[data-slot="table-6-kpis"]')
    await expect(kpis).toHaveAccessibleName('Indicadores da carteira')
    await expect(kpis).toHaveTextContent('ARR total')
    await expect(kpis).toHaveTextContent('NRR da carteira')
    await expect(kpis).toHaveTextContent('110%')
    await expect(kpis).toHaveTextContent('ARR em risco')
    await userEvent.click(canvas.getByRole('button', { name: 'Exportar' }))
    await expect(args.onExport).toHaveBeenCalledOnce()
  },
}

export const GroupRowsCarrySubtotalsUnderTheirColumns: Story = {
  play: async ({ canvasElement }) => {
    const [northAmerica] = groupRowsOf(canvasElement) as [HTMLElement]
    await expect(northAmerica).toHaveTextContent('América do Norte')
    await expect(groupCell(northAmerica, 'owner')).toHaveTextContent(
      'Contas estratégicas dos EUA e do Canadá',
    )
    await expect(groupCell(northAmerica, 'arr')).toHaveTextContent(
      'R$ 2.905.000',
    )
    await expect(groupCell(northAmerica, 'nrr')).toHaveTextContent('115%')
    await expect(groupCell(northAmerica, 'renewal')).toHaveTextContent(
      /Próxima 30 de jun\.? de 2026/,
    )
    await expect(groupCell(northAmerica, 'health')).toBeEmptyDOMElement()
  },
}

export const OnlyTheExpandedRegionShowsItsAccounts: Story = {
  play: async ({ canvasElement }) => {
    await expect(groupRowsOf(canvasElement)).toHaveLength(4)
    await expect(rowsOf(canvasElement)).toHaveLength(7)
    const collapsed = groupRowsOf(canvasElement).filter(
      (row) => row.dataset.collapsed === 'true',
    )
    await expect(collapsed).toHaveLength(3)
  },
}

export const ToggleAllCollapsesAndExpandsEveryRegion: Story = {
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getByRole('button', { name: 'Recolher tudo' }))
    await expect(args.onCollapsedRegionIdsChange).toHaveBeenLastCalledWith([
      'na',
      'emea',
      'apac',
      'latam',
    ])
    await waitFor(() => expect(rowsOf(canvasElement)).toHaveLength(0))
    await userEvent.click(canvas.getByRole('button', { name: 'Expandir tudo' }))
    await expect(args.onCollapsedRegionIdsChange).toHaveBeenLastCalledWith([])
    await waitFor(() => expect(rowsOf(canvasElement)).toHaveLength(20))
  },
}

export const AGroupChevronReportsRegionIds: Story = {
  play: async ({ args, canvasElement }) => {
    const [, emea] = groupRowsOf(canvasElement) as [HTMLElement, HTMLElement]
    await userEvent.click(
      within(emea).getByRole('button', { name: 'Expandir EMEA' }),
    )
    await expect(args.onCollapsedRegionIdsChange).toHaveBeenLastCalledWith([
      'apac',
      'latam',
    ])
    await expect(
      await within(canvasElement).findByText('Hanse Logística'),
    ).toBeVisible()
  },
}

export const NrrBelowOneHundredIsMarked: Story = {
  play: async ({ canvasElement }) => {
    const brightline = rowsOf(canvasElement).find((row) =>
      row.textContent?.includes('Brightline Mídia'),
    ) as HTMLElement
    const nrr = brightline.querySelector('[data-slot="table-6-nrr"]')
    await expect(nrr).toHaveAttribute('data-below', 'true')
    await expect(nrr).toHaveClass('text-destructive-foreground')
    await expect(nrr).toHaveTextContent('Em retração92%')
    const northwind = rowsOf(canvasElement)[0] as HTMLElement
    await expect(
      northwind.querySelector('[data-slot="table-6-nrr"]'),
    ).toHaveTextContent('Em expansão124%')
  },
}

export const HealthFilterNarrowsRowsAndSubtotals: Story = {
  args: { toggleAll: false },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const menu = await openDisplay(canvasElement)
    await userEvent.click(within(menu).getByRole('menuitem', { name: 'Saúde' }))
    await userEvent.click(
      await screen.findByRole('menuitemradio', { name: 'Em risco' }),
    )
    await userEvent.keyboard('{Escape}')
    await waitFor(() => expect(rowsOf(canvasElement)).toHaveLength(3))
    const [northAmerica] = groupRowsOf(canvasElement) as [HTMLElement]
    await expect(groupCell(northAmerica, 'arr')).toHaveTextContent('R$ 285.000')
    await expect(
      canvas.getByRole('button', { name: 'Exibição (1)' }),
    ).toBeVisible()
  },
}

export const SearchFindsAccounts: Story = {
  args: { toggleAll: false },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.type(
      canvas.getByRole('searchbox', { name: 'Buscar contas' }),
      'Lumen',
    )
    await waitFor(() => expect(rowsOf(canvasElement)).toHaveLength(1))
    await expect(groupRowsOf(canvasElement)).toHaveLength(1)
    await expect(groupRowsOf(canvasElement)[0]).toHaveTextContent('EMEA')
  },
}

export const DensityIsReported: Story = {
  play: async ({ args, canvasElement }) => {
    const menu = await openDisplay(canvasElement)
    await userEvent.click(
      within(menu).getByRole('menuitem', { name: 'Altura das linhas' }),
    )
    await userEvent.click(
      await screen.findByRole('menuitemradio', { name: 'Alta' }),
    )
    await expect(args.onDensityChange).toHaveBeenCalledWith('tall')
  },
}

export const ColumnsSubmenuHidesAColumn: Story = {
  play: async ({ canvasElement }) => {
    const menu = await openDisplay(canvasElement)
    await userEvent.click(
      within(menu).getByRole('menuitem', { name: 'Colunas' }),
    )
    await userEvent.click(
      await screen.findByRole('menuitemcheckbox', { name: 'Saúde' }),
    )
    await userEvent.keyboard('{Escape}')
    await waitFor(() =>
      expect(
        within(canvasElement).queryByRole('columnheader', { name: /Saúde/ }),
      ).toBeNull(),
    )
  },
}

export const TheRowMenuReportsTheAction: Story = {
  play: async ({ args, canvasElement }) => {
    await userEvent.click(
      within(canvasElement).getByRole('button', {
        name: 'Ações de Northwind Comércio',
      }),
    )
    await userEvent.click(
      await screen.findByRole('menuitem', { name: 'Planejar renovação' }),
    )
    await expect(args.onRowAction).toHaveBeenCalledWith('plan', 'northwind')
  },
}

export const LocaleAndCurrencyFormatTheAmounts: Story = {
  args: { currency: 'USD', locale: 'en-US' },
  play: async ({ canvasElement }) => {
    const [northAmerica] = groupRowsOf(canvasElement) as [HTMLElement]
    await expect(groupCell(northAmerica, 'arr')).toHaveTextContent('$2,905,000')
    await expect(rowsOf(canvasElement)[0]).toHaveTextContent('$920,000')
  },
}

export const ControlsNeedTheirCallbacks: Story = {
  args: {
    exportAction: false,
    kpis: false,
    rowActions: false,
    toggleAll: false,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.queryByRole('button', { name: 'Exportar' })).toBeNull()
    await expect(
      canvasElement.querySelector('[data-slot="table-6-kpis"]'),
    ).toBeNull()
    await expect(canvas.queryByRole('button', { name: /tudo$/ })).toBeNull()
    await expect(canvas.queryByRole('button', { name: /^Ações de/ })).toBeNull()
    await expect(rowsOf(canvasElement)).toHaveLength(20)
  },
}

export const LabelsOverrideTexts: Story = {
  render: () => (
    <Table6
      accounts={accounts}
      labels={{
        columns: { account: 'Cliente' },
        nextRenewal: (date) => `Renova em ${date}`,
        title: 'Carteira por região',
      }}
      regions={regions}
    />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(
      canvas.getByRole('heading', { name: 'Carteira por região' }),
    ).toBeVisible()
    await expect(
      canvas.getByRole('columnheader', { name: /Cliente/ }),
    ).toBeVisible()
    await expect(groupRowsOf(canvasElement)[0]).toHaveTextContent(/Renova em/)
  },
}

export const PendingShowsSkeleton: Story = {
  render: () => <Table6 accounts={accounts} pending regions={regions} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByLabelText('Carregando contas')).toHaveAttribute(
      'aria-busy',
      'true',
    )
    await expect(
      canvas.getByRole('heading', { name: 'Receita por região' }),
    ).toBeVisible()
    await expect(canvas.getAllByRole('heading')).toHaveLength(1)
    await expect(canvas.queryByRole('searchbox')).toBeNull()
    await expect(canvas.queryByRole('button', { name: /^Exibição/ })).toBeNull()
    await expect(
      canvasElement.querySelector('[data-slot="table-6-kpis"]'),
    ).toBeNull()
    await expect(canvas.queryByRole('table')).toBeNull()
    await expect(canvas.queryByRole('alert')).toBeNull()
  },
}

export const ErrorRetryCallsOnRetry: Story = {
  render: () => (
    <Table6 accounts={accounts} error onRetry={retry} regions={regions} />
  ),
  play: async ({ canvasElement }) => {
    retry.mockClear()
    const canvas = within(canvasElement)
    await expect(
      canvas.getByText('Não foi possível carregar as contas'),
    ).toBeVisible()
    await expect(
      canvas.getByRole('heading', { name: 'Receita por região' }),
    ).toBeVisible()
    await expect(canvas.queryByRole('searchbox')).toBeNull()
    await expect(canvas.queryByRole('table')).toBeNull()
    await userEvent.click(
      canvas.getByRole('button', { name: 'Tentar novamente' }),
    )
    await expect(retry).toHaveBeenCalledOnce()
  },
}

export const ErrorWithoutOnRetryHasNoButton: Story = {
  render: () => <Table6 accounts={accounts} error regions={regions} />,
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).queryByRole('button', { name: 'Tentar novamente' }),
    ).toBeNull()
  },
}

export const PendingWinsOverError: Story = {
  render: () => <Table6 accounts={accounts} error pending regions={regions} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByLabelText('Carregando contas')).toBeVisible()
    await expect(
      canvas.queryByText('Não foi possível carregar as contas'),
    ).toBeNull()
  },
}

export const ErrorWinsOverEmpty: Story = {
  render: () => <Table6 accounts={[]} error regions={regions} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(
      canvas.getByText('Não foi possível carregar as contas'),
    ).toBeVisible()
    await expect(canvas.queryByText('Nenhuma conta para exibir.')).toBeNull()
  },
}
