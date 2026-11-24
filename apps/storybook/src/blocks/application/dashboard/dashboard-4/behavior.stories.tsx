import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn, screen, userEvent, within } from 'storybook/test'
import {
  type Dashboard4Controls,
  dashboard4ControlArgs,
} from './dashboard-4-controls.ts'
import { ComposedDashboard4 } from './dashboard-4-layouts.tsx'

const meta = {
  args: {
    ...dashboard4ControlArgs,
    onAddModule: fn(),
    onFavoriteChange: fn(),
    onFilterChange: fn(),
    onInvite: fn(),
    onOpen: fn(),
    onPageChange: fn(),
    onRetry: fn(),
    onRowAction: fn(),
    onSearchChange: fn(),
    onSortChange: fn(),
  },
  parameters: { layout: 'padded' },
  render: (args) => <ComposedDashboard4 {...args} />,
  tags: ['!autodocs'],
  title: 'Blocks/Application/Dashboard/Dashboard4/Behavior',
} satisfies Meta<
  Dashboard4Controls & {
    onAddModule: () => void
    onFavoriteChange: (moduleId: string, favorite: boolean) => void
    onFilterChange: (filter: string) => void
    onInvite: () => void
    onOpen: (moduleId: string) => void
    onPageChange: (page: number) => void
    onRetry: () => void
    onRowAction: (actionId: string, moduleId: string) => void
    onSearchChange: (search: string) => void
    onSortChange: () => void
  }
>

export default meta

type Story = StoryObj<typeof meta>

const moduleNames = (canvasElement: HTMLElement) =>
  Array.from(canvasElement.querySelectorAll('[data-module]')).map(
    (row) => row.querySelectorAll('td')[1]?.querySelector('span')?.textContent,
  )

export const NavbarShowsTeamAndInvite: Story = {
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    const people = canvas.getByRole('list', { name: 'Equipe' })
    await expect(people).toHaveTextContent('+8')
    await userEvent.click(canvas.getByRole('button', { name: 'Convidar' }))
    await expect(args.onInvite).toHaveBeenCalledTimes(1)
  },
}

export const MetricCardsShowCaptionAndValue: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const metrics = within(canvas.getByRole('list', { name: 'Indicadores' }))
    await expect(
      metrics.getByRole('region', { name: 'Receita' }),
    ).toHaveTextContent(/loja\.tc96\.io, 28 dias.*R\$\s?\d+,\d\smil/)
    await expect(
      metrics.getByRole('region', { name: 'Cadastros' }),
    ).toHaveTextContent('Últimos 28 dias')
  },
}

export const RowsShowProgressOwnerWindowAndStatus: Story = {
  play: async ({ canvasElement }) => {
    const row = canvasElement.querySelector('[data-module="m2"]')
    await expect(row).toHaveTextContent('91% pronto')
    await expect(row).toHaveTextContent('29/32 tarefas')
    await expect(row).toHaveTextContent('Lena Wade')
    await expect(row).toHaveTextContent('api.tc96.io')
    await expect(row).toHaveTextContent('12 abr – 26 abr')
    await expect(row).toHaveTextContent('Janela de 14 dias')
    await expect(row?.querySelector('[data-slot="badge"]')).toHaveTextContent(
      'Em andamento',
    )
    await expect(
      row?.querySelector('[data-slot="progress-ring"]'),
    ).toHaveAttribute('aria-hidden', 'true')
  },
}

export const SortByModuleFlipsTheDirection: Story = {
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(moduleNames(canvasElement)[0]).toBe('Análise de uso')
    await userEvent.click(
      canvas.getByRole('button', { name: 'Ordenar por Módulo' }),
    )
    await expect(args.onSortChange).toHaveBeenCalledWith({
      direction: 'desc',
      key: 'name',
    })
    await expect(moduleNames(canvasElement)[0]).toBe('Webhooks')
    await expect(canvas.getAllByRole('columnheader')[1]).toHaveAttribute(
      'aria-sort',
      'descending',
    )
  },
}

export const FilterAndSearchNarrowTheRows: Story = {
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    const filter = canvas.getByRole('group', { name: 'Filtrar por status' })
    await expect(filter).toHaveTextContent('Backlog 4')
    await userEvent.click(
      within(filter).getByRole('button', { name: /Backlog/ }),
    )
    await expect(args.onFilterChange).toHaveBeenCalledWith('backlog')
    await expect(moduleNames(canvasElement)).toHaveLength(4)
    await userEvent.type(
      canvas.getByRole('searchbox', { name: 'Buscar módulo' }),
      'web',
    )
    await expect(args.onSearchChange).toHaveBeenLastCalledWith('web')
    await expect(moduleNames(canvasElement)).toEqual(['Webhooks'])
  },
}

export const PaginationShowsTheRangeAndPages: Story = {
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByText('1–10 de 17 módulos')).toBeVisible()
    await userEvent.click(
      canvas.getByRole('button', { name: 'Próxima página' }),
    )
    await expect(args.onPageChange).toHaveBeenCalledWith(2)
    await expect(canvas.getByText('11–17 de 17 módulos')).toBeVisible()
    await expect(moduleNames(canvasElement)).toHaveLength(7)
  },
}

export const RowActionsCallTheirCallbacksWithTheId: Story = {
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(
      canvas.getByRole('button', { name: 'Abrir Console de API' }),
    )
    await expect(args.onOpen).toHaveBeenCalledWith('m2')
    const star = canvas.getByRole('button', {
      name: 'Favoritar Console de API',
    })
    await expect(star).toHaveAttribute('aria-pressed', 'true')
    await userEvent.click(star)
    await expect(args.onFavoriteChange).toHaveBeenCalledWith('m2', false)
    await expect(star).toHaveAttribute('aria-pressed', 'false')
    await userEvent.click(
      canvas.getByRole('button', { name: 'Ações de Console de API' }),
    )
    await userEvent.click(
      await screen.findByRole('menuitem', { name: 'Arquivar' }),
    )
    await expect(args.onRowAction).toHaveBeenCalledWith('archive', 'm2')
  },
}

export const AddModuleCallsOnAddModule: Story = {
  play: async ({ args, canvasElement }) => {
    await userEvent.click(
      within(canvasElement).getByRole('button', { name: 'Adicionar módulo' }),
    )
    await expect(args.onAddModule).toHaveBeenCalledTimes(1)
  },
}

export const ToolsRenderOnlyWithTheirCallbacks: Story = {
  args: { rowActions: false, tableTools: false, team: false },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.queryByRole('searchbox')).toBeNull()
    await expect(canvas.queryByRole('button', { name: 'Convidar' })).toBeNull()
    await expect(
      canvas.queryByRole('button', { name: 'Adicionar módulo' }),
    ).toBeNull()
    await expect(
      canvas.queryByRole('columnheader', { name: 'Ações' }),
    ).toBeNull()
    await expect(
      canvas.queryByRole('navigation', { name: 'Paginação dos módulos' }),
    ).toBeNull()
    await expect(moduleNames(canvasElement)).toHaveLength(17)
  },
}
