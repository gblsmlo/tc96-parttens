import type { Meta, StoryObj } from '@storybook/react-vite'
import { Navbar7 } from '@tc96/ui/blocks/application/navbar/navbar-7'
import { expect, screen, userEvent, waitFor, within } from 'storybook/test'
import { breadcrumb, searchItems } from '../fixtures/navbar-7.ts'
import {
  type Navbar7Controls,
  navbar7ControlArgs,
} from './navbar-7-controls.ts'
import { ComposedNavbar7, navbar7Handlers } from './navbar-7-layouts.tsx'

const meta = {
  args: navbar7ControlArgs,
  beforeEach: () => {
    for (const handler of Object.values(navbar7Handlers)) handler.mockClear()
  },
  parameters: { layout: 'fullscreen' },
  render: (args) => <ComposedNavbar7 {...args} />,
  tags: ['!autodocs'],
  title: 'Blocks/Application/Navbar/Navbar7/Behavior',
} satisfies Meta<Navbar7Controls>

export default meta

type Story = StoryObj<typeof meta>

export const BreadcrumbEndsOnTheCurrentPage: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(
      canvas.getByRole('navigation', { name: 'Caminho da página' }),
    ).toBeVisible()
    await expect(
      canvas.getByRole('link', { name: 'Análises' }),
    ).toHaveAttribute('href', '/analises')
    await expect(canvas.getByText('Visão de crescimento')).toHaveAttribute(
      'aria-current',
      'page',
    )
    await expect(
      canvas.queryByRole('link', { name: 'Visão de crescimento' }),
    ).toBeNull()
  },
}

export const HeaderIsABannerWithABorder: Story = {
  play: async ({ canvasElement }) => {
    const header = within(canvasElement).getByRole('banner')
    await expect(header).toHaveClass('border-b', 'w-full')
  },
}

export const RefreshCallsOnRefresh: Story = {
  play: async ({ canvasElement }) => {
    await userEvent.click(
      within(canvasElement).getByRole('button', { name: 'Atualizar dados' }),
    )
    await expect(navbar7Handlers.onRefresh).toHaveBeenCalledTimes(1)
  },
}

export const IntervalSelectListsEveryOption: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(
      canvas.getByRole('combobox', { name: 'Atualização automática' }),
    ).toHaveTextContent('Desligado')
    await userEvent.click(
      canvas.getByRole('combobox', { name: 'Atualização automática' }),
    )
    await expect(await screen.findAllByRole('option')).toHaveLength(4)
    await userEvent.keyboard('{Escape}')
    await waitFor(() => expect(screen.queryByRole('listbox')).toBeNull())
  },
}

export const IntervalChoiceCallsTheHandlerWithItsId: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(
      canvas.getByRole('combobox', { name: 'Atualização automática' }),
    )
    await userEvent.click(await screen.findByRole('option', { name: '1 min' }))
    await waitFor(() =>
      expect(navbar7Handlers.onRefreshIntervalChange).toHaveBeenCalledWith(
        '1m',
      ),
    )
    await waitFor(() =>
      expect(
        canvas.getByRole('combobox', { name: 'Atualização automática' }),
      ).toHaveTextContent('1 min'),
    )
  },
}

export const ShareCallsOnShare: Story = {
  play: async ({ canvasElement }) => {
    await userEvent.click(
      within(canvasElement).getByRole('button', { name: 'Compartilhar' }),
    )
    await expect(navbar7Handlers.onShare).toHaveBeenCalledTimes(1)
  },
}

export const OverflowMenuShowsItsItemsAndClosesWithEscape: Story = {
  play: async ({ canvasElement }) => {
    await userEvent.click(
      within(canvasElement).getByRole('button', { name: 'Mais ações' }),
    )
    await expect(await screen.findAllByRole('menuitem')).toHaveLength(3)
    await userEvent.keyboard('{Escape}')
    await waitFor(() => expect(screen.queryByRole('menu')).toBeNull())
  },
}

export const RangeButtonShowsTheFormattedRange: Story = {
  play: async ({ canvasElement }) => {
    const button = within(canvasElement).getByRole('button', {
      name: /nov\.? de 2026/,
    })
    await expect(button).toHaveTextContent('1')
    await expect(button).toHaveTextContent('30')
  },
}

export const RangeButtonShowsThePlaceholderWithoutRange: Story = {
  args: { hasRange: false },
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByRole('button', { name: 'Selecionar período' }),
    ).toBeVisible()
  },
}

export const PickingTwoDaysCallsOnRangeChange: Story = {
  args: { hasRange: false },
  play: async ({ canvasElement }) => {
    await userEvent.click(
      within(canvasElement).getByRole('button', { name: 'Selecionar período' }),
    )
    const dialog = await screen.findByRole('dialog', {
      name: 'Período da análise',
    })
    await userEvent.click(
      within(dialog).getAllByRole('button', { name: /(^|\D)10 de / })[0],
    )
    await userEvent.click(
      within(dialog).getAllByRole('button', { name: /(^|\D)20 de / })[0],
    )
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull())
    const [range] = navbar7Handlers.onRangeChange.mock.lastCall ?? []
    await expect(range.from.getDate()).toBe(10)
    await expect(range.to.getDate()).toBe(20)
    await expect(
      within(canvasElement).queryByRole('button', {
        name: 'Selecionar período',
      }),
    ).toBeNull()
  },
}

export const CompareIsAToggleButton: Story = {
  play: async ({ canvasElement }) => {
    const toggle = within(canvasElement).getByRole('button', {
      name: 'Comparar',
    })
    await expect(toggle).toHaveAttribute('aria-pressed', 'false')
    await userEvent.click(toggle)
    await expect(navbar7Handlers.onCompareChange).toHaveBeenCalledWith(true)
    await expect(toggle).toHaveAttribute('aria-pressed', 'true')
  },
}

export const CompareStartsPressedWhenControlled: Story = {
  args: { compare: true },
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByRole('button', { name: 'Comparar' }),
    ).toHaveAttribute('aria-pressed', 'true')
  },
}

export const SearchButtonOpensTheCommandDialog: Story = {
  play: async ({ canvasElement }) => {
    await userEvent.click(
      within(canvasElement).getByRole('button', { name: /Buscar/ }),
    )
    await expect(await screen.findAllByRole('option')).toHaveLength(
      searchItems.length,
    )
    await expect(screen.getByText('Relatórios')).toBeInTheDocument()
    await expect(screen.getByText('Ações')).toBeInTheDocument()
  },
}

export const SearchFiltersAndReportsEmptyResults: Story = {
  play: async ({ canvasElement }) => {
    await userEvent.click(
      within(canvasElement).getByRole('button', { name: /Buscar/ }),
    )
    const input = await screen.findByRole('combobox', { name: 'Buscar' })
    await userEvent.type(input, 'reten')
    await waitFor(() => expect(screen.getAllByRole('option')).toHaveLength(1))
    await userEvent.clear(input)
    await userEvent.type(input, 'zzzz')
    await expect(
      await screen.findByText('Nenhum resultado encontrado.'),
    ).toBeInTheDocument()
  },
}

export const SearchChoiceCallsOnSearchSelectAndCloses: Story = {
  play: async ({ canvasElement }) => {
    await userEvent.click(
      within(canvasElement).getByRole('button', { name: /Buscar/ }),
    )
    await userEvent.click(
      await screen.findByRole('option', { name: 'Funil de conversão' }),
    )
    await expect(navbar7Handlers.onSearchSelect).toHaveBeenCalledWith('funnel')
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull())
  },
}

export const ControlKOpensAndEscapeClosesTheSearch: Story = {
  play: async () => {
    await userEvent.keyboard('{Control>}k{/Control}')
    await expect(await screen.findByRole('dialog')).toBeInTheDocument()
    await userEvent.keyboard('{Escape}')
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull())
  },
}

export const WithoutHandlersNothingRendersBesideTheBreadcrumb: Story = {
  render: () => <Navbar7 breadcrumb={breadcrumb} />,
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).queryAllByRole('button')).toHaveLength(0)
    await expect(within(canvasElement).queryAllByRole('combobox')).toHaveLength(
      0,
    )
  },
}

export const EachControlRendersOnlyWithItsData: Story = {
  args: {
    showCompare: false,
    showInterval: false,
    showMenu: false,
    showRange: false,
    showRefresh: false,
    showSearch: false,
    showShare: false,
  },
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).queryAllByRole('button')).toHaveLength(0)
    await expect(within(canvasElement).queryAllByRole('combobox')).toHaveLength(
      0,
    )
  },
}

export const LabelsOverrideTexts: Story = {
  render: () => (
    <Navbar7
      breadcrumb={breadcrumb}
      labels={{
        compare: 'Versus período anterior',
        dateRangePlaceholder: 'Escolher datas',
        refresh: 'Recarregar',
        search: 'Procurar',
        share: 'Enviar',
      }}
      onCompareChange={() => undefined}
      onRangeChange={() => undefined}
      onRefresh={() => undefined}
      onSearchSelect={() => undefined}
      onShare={() => undefined}
      searchItems={searchItems}
    />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(
      canvas.getByRole('button', { name: 'Recarregar' }),
    ).toBeVisible()
    await expect(canvas.getByRole('button', { name: 'Enviar' })).toBeVisible()
    await expect(
      canvas.getByRole('button', { name: 'Escolher datas' }),
    ).toBeVisible()
    await expect(
      canvas.getByRole('button', { name: 'Versus período anterior' }),
    ).toBeVisible()
    await expect(canvas.getByRole('button', { name: /Procurar/ })).toBeVisible()
  },
}
