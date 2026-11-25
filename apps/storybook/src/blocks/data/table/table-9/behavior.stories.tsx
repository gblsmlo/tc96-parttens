import type { Meta, StoryObj } from '@storybook/react-vite'
import { Table9 } from '@tc96/ui/blocks/data/table/table-9'
import { expect, fn, screen, userEvent, waitFor, within } from 'storybook/test'
import { campaigns, initialSort, period, summary } from '../fixtures/table-9.ts'
import { type Table9Controls, table9ControlArgs } from './table-9-controls.ts'
import { ComposedTable9 } from './table-9-layouts.tsx'

const retry = fn()

const meta = {
  args: {
    ...table9ControlArgs,
    onColumnVisibilityChange: fn(),
    onCreate: fn(),
    onDensityChange: fn(),
    onExport: fn(),
    onRowAction: fn(),
    onSortChange: fn(),
  },
  parameters: { layout: 'padded' },
  render: (args) => <ComposedTable9 {...args} />,
  tags: ['!autodocs'],
  title: 'Blocks/Data/Table/Table9/Behavior',
} satisfies Meta<
  Table9Controls & {
    onColumnVisibilityChange: () => void
    onCreate: () => void
    onDensityChange: () => void
    onExport: () => void
    onRowAction: () => void
    onSortChange: () => void
  }
>

export default meta

type Story = StoryObj<typeof meta>

const rowsOf = (canvasElement: HTMLElement) =>
  Array.from(
    canvasElement.querySelectorAll(
      '[data-slot="data-table"] tbody [data-slot="table-row"]',
    ),
  )

const openSettings = async (
  canvasElement: HTMLElement,
  name: RegExp | string = 'Configurações',
) => {
  await userEvent.click(within(canvasElement).getByRole('button', { name }))
  return screen.findByRole('menu')
}

const closeMenus = async () => {
  await userEvent.keyboard('{Escape}')
  if (screen.queryAllByRole('menu').length) await userEvent.keyboard('{Escape}')
  await waitFor(() => expect(screen.queryAllByRole('menu')).toHaveLength(0))
}

const openSubmenu = async (canvasElement: HTMLElement, name: string) => {
  const menu = within(await openSettings(canvasElement))
  await userEvent.click(menu.getByRole('menuitem', { name }))
}

const required = {
  campaigns,
  period,
  summary,
}

const toolbarOf = (canvasElement: HTMLElement) =>
  within(canvasElement).getByRole('toolbar', {
    name: 'Controles das campanhas',
  })

export const TheHeadingAppearsOnce: Story = {
  play: async ({ canvasElement }) => {
    const headings = within(canvasElement).getAllByRole('heading')
    await expect(headings).toHaveLength(1)
    await expect(headings[0]).toHaveTextContent('Desempenho de campanhas')
    await expect(headings[0]?.tagName).toBe('H2')
  },
}

export const TheToolbarCarriesTheHeadingAndTheControls: Story = {
  play: async ({ canvasElement }) => {
    const toolbar = toolbarOf(canvasElement)
    await expect(toolbar).toHaveAttribute('data-mode', 'plain')
    const inToolbar = within(toolbar)
    await expect(
      inToolbar.getByRole('heading', { name: 'Desempenho de campanhas' }),
    ).toBeVisible()
    await expect(inToolbar.getByRole('searchbox')).toBeVisible()
    await expect(
      inToolbar.getByRole('button', { name: 'Nova campanha' }),
    ).toBeVisible()
    const band = within(canvasElement).getByRole('list', {
      name: 'Indicadores da campanha',
    })
    await expect(
      toolbar.compareDocumentPosition(band) & Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy()
  },
}

export const HeaderShowsTitleSubtitleAndActions: Story = {
  play: async ({ args, canvasElement }) => {
    const toolbar = within(toolbarOf(canvasElement))
    await expect(
      toolbar.getByText('12 campanhas · 8 ativas na visão · 6 set a 5 out'),
    ).toBeVisible()
    await userEvent.click(toolbar.getByRole('button', { name: 'Exportar' }))
    await userEvent.click(
      toolbar.getByRole('button', { name: 'Nova campanha' }),
    )
    await expect(args.onExport).toHaveBeenCalledOnce()
    await expect(args.onCreate).toHaveBeenCalledOnce()
  },
}

export const HeaderButtonsNeedTheirCallbacks: Story = {
  args: { headerActions: false },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.queryByRole('button', { name: 'Exportar' })).toBeNull()
    await expect(
      canvas.queryByRole('button', { name: 'Nova campanha' }),
    ).toBeNull()
  },
}

export const TheKpiBandShowsSixIndicators: Story = {
  play: async ({ canvasElement }) => {
    const band = within(canvasElement).getByRole('list', {
      name: 'Indicadores da campanha',
    })
    const kpi = (id: string) =>
      band.querySelector(`[data-kpi="${id}"]`) as HTMLElement
    await expect(band.querySelectorAll('[data-kpi]')).toHaveLength(6)
    await expect(kpi('spend')).toHaveTextContent(/R\$\s293,4\smil/)
    await expect(kpi('spend')).toHaveTextContent('80% do orçamento')
    await expect(kpi('impressions')).toHaveTextContent('CTR 3,12%')
    await expect(kpi('conversions')).toHaveTextContent('4,7%')
    await expect(kpi('cpa')).toHaveTextContent(/R\$\s41,62/)
    await expect(kpi('roas')).toHaveTextContent('4,6x')
    await expect(kpi('roas')).toHaveTextContent('meta 4,5x')
    await expect(kpi('below-target')).toHaveTextContent('de 12 campanhas')
  },
}

export const EachRowShowsTheCampaignMetrics: Story = {
  play: async ({ canvasElement }) => {
    await expect(rowsOf(canvasElement)).toHaveLength(8)
    const first = rowsOf(canvasElement)[0] as HTMLElement
    await expect(first).toHaveTextContent('Lançamento Linha Verão')
    await expect(first).toHaveTextContent('BR')
    await expect(first).toHaveTextContent('Alcance')
    await expect(first).toHaveTextContent('Ativa')
    await expect(first).toHaveTextContent(/R\$\s63\.500/)
    await expect(first).toHaveTextContent('91% do orçamento')
    await expect(first).toHaveTextContent(/R\$\s69,78/)
  },
}

export const ChannelIsNamedForAssistiveTechnology: Story = {
  play: async ({ canvasElement }) => {
    await expect(rowsOf(canvasElement)[0]).toHaveTextContent('Social')
  },
}

export const DeltaToneFollowsTheFavorableDirection: Story = {
  play: async ({ canvasElement }) => {
    const tones = (index: number) =>
      Array.from(
        (rowsOf(canvasElement)[index] as HTMLElement).querySelectorAll(
          '[data-delta]',
        ),
      ).map(
        (delta) =>
          `${delta.getAttribute('data-delta')}:${delta.getAttribute('data-tone')}`,
      )
    await expect(tones(0)).toEqual(['down:bad', 'up:bad'])
    await expect(tones(1)).toEqual(['up:good', 'down:good'])
    await expect(rowsOf(canvasElement)[0]).toHaveTextContent(
      'Queda desfavorável de 5,7%',
    )
    await expect(rowsOf(canvasElement)[0]).toHaveTextContent(
      'Alta desfavorável de 9,3%',
    )
  },
}

export const TheSparklineIsDecorativeWithAHiddenSummary: Story = {
  play: async ({ canvasElement }) => {
    const first = rowsOf(canvasElement)[0] as HTMLElement
    const sparkline = first.querySelector('[data-slot="sparkline"]')
    await expect(sparkline).toHaveAttribute('aria-hidden', 'true')
    await expect(sparkline?.querySelector('path')?.getAttribute('d')).toMatch(
      /^M[\d. ]+(L[\d. ]+)+$/,
    )
    await expect(first).toHaveTextContent(
      /Tendência de \d+ para \d+ no período/,
    )
  },
}

export const BarsAreDecorativeWithTheValueAsText: Story = {
  play: async ({ canvasElement }) => {
    const first = rowsOf(canvasElement)[0] as HTMLElement
    await expect(
      first.querySelector('[data-slot="bullet-bar"]'),
    ).toHaveAttribute('aria-hidden', 'true')
    await expect(
      first.querySelector('[data-slot="share-bar"]'),
    ).toHaveAttribute('aria-hidden', 'true')
    await expect(first).toHaveTextContent('ROAS 3,1x, meta 4,0x')
    await expect(first).toHaveTextContent('71% de novos compradores')
  },
}

export const FooterPaginatesTheCampaigns: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByText('1–8 de 12')).toBeVisible()
    await userEvent.click(
      canvas.getByRole('button', { name: 'Próxima página' }),
    )
    await expect(canvas.getByText('9–12 de 12')).toBeVisible()
    await expect(rowsOf(canvasElement)).toHaveLength(4)
  },
}

export const SearchNarrowsTheRowsAndTheActiveCount: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.type(
      canvas.getByRole('searchbox', { name: 'Buscar campanhas' }),
      'Newsletter',
    )
    await expect(rowsOf(canvasElement)).toHaveLength(1)
    await expect(
      canvas.getByText('12 campanhas · 1 ativas na visão · 6 set a 5 out'),
    ).toBeVisible()
  },
}

export const HeadersArePlainColumnHeaders: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(
      canvas.getByRole('columnheader', { name: 'Conversões' }),
    ).toBeVisible()
    await expect(
      canvas.queryByRole('button', { name: /Opções da coluna/ }),
    ).toBeNull()
  },
}

export const TheSortSubmenuSortsAndReports: Story = {
  play: async ({ args, canvasElement }) => {
    await openSubmenu(canvasElement, 'Ordenar por')
    await userEvent.click(
      await screen.findByRole('menuitem', { name: 'CPA: crescente' }),
    )
    await waitFor(() =>
      expect(args.onSortChange).toHaveBeenLastCalledWith({
        direction: 'asc',
        key: 'cpa',
      }),
    )
    await expect(rowsOf(canvasElement)[0]).toHaveTextContent(
      'Newsletter Black Friday',
    )
  },
}

export const TheColumnsSubmenuHidesAColumnAndReports: Story = {
  play: async ({ args, canvasElement }) => {
    await openSubmenu(canvasElement, 'Colunas')
    await userEvent.click(
      await screen.findByRole('menuitemcheckbox', { name: 'Tendência' }),
    )
    await expect(
      within(canvasElement).queryByRole('columnheader', { name: /Tendência/ }),
    ).toBeNull()
    await waitFor(() =>
      expect(args.onColumnVisibilityChange).toHaveBeenLastCalledWith(
        expect.objectContaining({ trend: false }),
      ),
    )
  },
}

export const TheDensitySubmenuChangesTheRowHeight: Story = {
  play: async ({ args, canvasElement }) => {
    await openSubmenu(canvasElement, 'Altura das linhas')
    await userEvent.click(
      await screen.findByRole('menuitemradio', { name: 'Compacta' }),
    )
    await waitFor(() =>
      expect(args.onDensityChange).toHaveBeenLastCalledWith('short'),
    )
    await expect(
      canvasElement.querySelector('[data-density="short"]'),
    ).not.toBeNull()
  },
}

export const TheStatusFilterNarrowsTheRowsAndClears: Story = {
  play: async ({ canvasElement }) => {
    await openSubmenu(canvasElement, 'Status')
    await userEvent.click(
      await screen.findByRole('menuitemradio', { name: 'Em aprendizado' }),
    )
    await waitFor(() => expect(rowsOf(canvasElement)).toHaveLength(2))
    await closeMenus()
    const menu = within(await openSettings(canvasElement, /^Configurações/))
    await userEvent.click(
      menu.getByRole('menuitem', { name: 'Limpar filtros' }),
    )
    await waitFor(() => expect(rowsOf(canvasElement)).toHaveLength(8))
  },
}

export const PageSizeChangesTheRowsPerPage: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(
      canvas.getByRole('combobox', { name: 'Linhas por página' }),
    )
    await userEvent.click(await screen.findByRole('option', { name: '4' }))
    await waitFor(() => expect(rowsOf(canvasElement)).toHaveLength(4))
    await expect(canvas.getByText('1–4 de 12')).toBeVisible()
  },
}

export const RowMenuCallsOnRowAction: Story = {
  play: async ({ args, canvasElement }) => {
    await userEvent.click(
      within(canvasElement).getByRole('button', {
        name: 'Ações de Lançamento Linha Verão',
      }),
    )
    await userEvent.click(
      await screen.findByRole('menuitem', { name: 'Pausar' }),
    )
    await expect(args.onRowAction).toHaveBeenCalledWith('pause', 'c03')
  },
}

export const RowMenuNeedsRowActionsAndItsCallback: Story = {
  args: { rowActions: false },
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).queryByRole('button', { name: /^Ações de/ }),
    ).toBeNull()
  },
}

export const TheConsumerControlsSortAndVisibility: Story = {
  render: () => (
    <Table9
      {...required}
      columnVisibility={{ roas: false, trend: false }}
      sort={{ direction: 'asc', key: 'campaign' }}
    />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(rowsOf(canvasElement)[0]).toHaveTextContent(
      'Influenciadores Micro',
    )
    await expect(
      canvas.queryByRole('columnheader', { name: /Tendência/ }),
    ).toBeNull()
    await expect(
      canvas.queryByRole('columnheader', { name: /ROAS/ }),
    ).toBeNull()
    await expect(
      canvas.getByRole('columnheader', { name: /CPA/ }),
    ).toBeVisible()
  },
}

export const CurrencyAndLocaleFormatTheValues: Story = {
  args: { currency: 'USD', locale: 'en-US' },
  play: async ({ canvasElement }) => {
    const first = rowsOf(canvasElement)[0] as HTMLElement
    await expect(first).toHaveTextContent('$63,500')
    await expect(first).toHaveTextContent('$69.78')
    await expect(first).toHaveTextContent('3.1x')
  },
}

export const LabelsOverrideTexts: Story = {
  render: () => (
    <Table9
      {...required}
      labels={{
        columns: { campaign: 'Nome' },
        create: 'Criar',
        statuses: { active: 'No ar' },
        title: 'Campanhas',
      }}
      onCreate={() => undefined}
    />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(
      canvas.getByRole('heading', { name: 'Campanhas' }),
    ).toBeVisible()
    await expect(canvas.getByRole('button', { name: 'Criar' })).toBeVisible()
    await expect(
      canvas.getByRole('columnheader', { name: /Nome/ }),
    ).toBeVisible()
    await expect(
      canvas.getByRole('columnheader', { name: /CPA/ }),
    ).toBeVisible()
    await expect(canvas.getAllByText('No ar').length).toBeGreaterThan(0)
  },
}

export const PendingShowsSkeleton: Story = {
  render: () => <Table9 {...required} pending />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByLabelText('Carregando campanhas')).toHaveAttribute(
      'aria-busy',
      'true',
    )
    await expect(
      canvas.getByRole('heading', { name: 'Desempenho de campanhas' }),
    ).toBeVisible()
    await expect(canvas.getAllByRole('heading')).toHaveLength(1)
    await expect(canvas.queryByRole('searchbox')).toBeNull()
    await expect(canvas.queryByRole('button', { name: 'Exportar' })).toBeNull()
    await expect(canvas.queryByRole('table')).toBeNull()
    await expect(canvas.queryByRole('alert')).toBeNull()
  },
}

export const ErrorRetryCallsOnRetry: Story = {
  render: () => <Table9 {...required} error onRetry={retry} />,
  play: async ({ canvasElement }) => {
    retry.mockClear()
    const canvas = within(canvasElement)
    await expect(
      canvas.getByText('Não foi possível carregar as campanhas'),
    ).toBeVisible()
    await expect(
      canvas.getByRole('heading', { name: 'Desempenho de campanhas' }),
    ).toBeVisible()
    await expect(canvas.queryByRole('table')).toBeNull()
    await userEvent.click(
      canvas.getByRole('button', { name: 'Tentar novamente' }),
    )
    await expect(retry).toHaveBeenCalledOnce()
  },
}

export const ErrorWithoutOnRetryHasNoButton: Story = {
  render: () => <Table9 {...required} error />,
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).queryByRole('button', { name: 'Tentar novamente' }),
    ).toBeNull()
  },
}

export const PendingWinsOverError: Story = {
  render: () => <Table9 {...required} error pending />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByLabelText('Carregando campanhas')).toBeVisible()
    await expect(
      canvas.queryByText('Não foi possível carregar as campanhas'),
    ).toBeNull()
  },
}

export const ErrorWinsOverEmpty: Story = {
  render: () => <Table9 {...required} campaigns={[]} error />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(
      canvas.getByText('Não foi possível carregar as campanhas'),
    ).toBeVisible()
    await expect(canvas.queryByText('Nenhuma campanha para exibir.')).toBeNull()
  },
}

export const InitialSortComesFromTheSortProp: Story = {
  render: () => <Table9 {...required} sort={initialSort} />,
  play: async ({ canvasElement }) => {
    await expect(rowsOf(canvasElement)[0]).toHaveTextContent(
      'Lançamento Linha Verão',
    )
  },
}
