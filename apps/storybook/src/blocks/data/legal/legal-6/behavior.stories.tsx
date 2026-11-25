import type { Meta, StoryObj } from '@storybook/react-vite'
import { Legal6 } from '@tc96/ui/blocks/data/legal/legal-6'
import { expect, fn, screen, userEvent, waitFor, within } from 'storybook/test'
import { deadlines, kinds, memberViews, owners } from '../fixtures/legal-6.ts'
import { type Legal6Controls, legal6ControlArgs } from './legal-6-controls.ts'
import { ComposedLegal6 } from './legal-6-layouts.tsx'

const meta = {
  args: {
    ...legal6ControlArgs,
    onConfirm: fn(),
    onCreate: fn(),
    onKindFilterChange: fn(),
    onLoadMore: fn(),
    onOpen: fn(),
    onOwnerFilterChange: fn(),
    onReject: fn(),
    onRetry: fn(),
    onSavedViewCreate: fn(),
    onSavedViewDelete: fn(),
    onSavedViewDuplicate: fn(),
    onSavedViewRename: fn(),
    onSavedViewSelect: fn(),
    onSavedViewUpdate: fn(),
    onSavePreference: fn(),
    onSortChange: fn(),
    onViewChange: fn(),
  },
  parameters: { layout: 'padded' },
  render: (args) => <ComposedLegal6 {...args} />,
  tags: ['!autodocs'],
  title: 'Blocks/Data/Legal/Legal6/Behavior',
} satisfies Meta<
  Legal6Controls & {
    onConfirm: () => void
    onCreate: () => void
    onKindFilterChange: () => void
    onLoadMore: () => void
    onOpen: () => void
    onOwnerFilterChange: () => void
    onReject: () => void
    onRetry: () => void
    onSavedViewCreate: () => void
    onSavedViewDelete: () => void
    onSavedViewDuplicate: () => void
    onSavedViewRename: () => void
    onSavedViewSelect: () => void
    onSavedViewUpdate: () => void
    onSavePreference: () => void
    onSortChange: () => void
    onViewChange: () => void
  }
>

export default meta

type Story = StoryObj<typeof meta>

const toolbarOf = (canvasElement: HTMLElement) =>
  within(canvasElement).getByRole('toolbar', { name: 'Controles de prazos' })

const rowsOf = (canvasElement: HTMLElement) =>
  canvasElement.querySelectorAll('[data-slot="data-table"] tbody tr')

const rowOf = (canvasElement: HTMLElement, text: string) =>
  within(canvasElement).getByText(text).closest('tr') as HTMLElement

const openQueues = async (canvasElement: HTMLElement, current: string) => {
  await userEvent.click(
    within(toolbarOf(canvasElement)).getByRole('button', { name: current }),
  )
  return screen.findByRole('group', { name: 'Filas' })
}

const openDisplayMenu = async (canvasElement: HTMLElement) => {
  await userEvent.click(
    within(canvasElement).getByRole('button', { name: /^Exibição/ }),
  )
  return screen.findByRole('menu')
}

const chooseInSubmenu = async (
  canvasElement: HTMLElement,
  submenu: string,
  option: string,
) => {
  await openDisplayMenu(canvasElement)
  await userEvent.click(await screen.findByRole('menuitem', { name: submenu }))
  await userEvent.click(
    await screen.findByRole('menuitemradio', { name: option }),
  )
}

export const TheViewSwitcherReplacesTheHeading: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByRole('region', { name: 'Prazos' })).toBeVisible()
    await expect(canvas.queryByRole('heading', { level: 2 })).toBeNull()
    const toolbar = toolbarOf(canvasElement)
    await expect(toolbar).toHaveAttribute('data-mode', 'plain')
    await expect(
      within(toolbar).getByRole('button', { name: 'Minha fila' }),
    ).toBeVisible()
    await expect(within(toolbar).queryByRole('searchbox')).toBeNull()
    await expect(
      canvas.getByRole('table', { name: 'Prazos: Minha fila' }),
    ).toBeVisible()
    await expect(rowsOf(canvasElement)).toHaveLength(3)
  },
}

export const TheQueuesKeepTheirOrderAndCounts: Story = {
  play: async ({ canvasElement }) => {
    const queues = await openQueues(canvasElement, 'Minha fila')
    const items = within(queues).getAllByRole('button')
    await expect(
      items.map((button) => button.getAttribute('aria-label')),
    ).toEqual([
      'Minha fila, 3 prazos',
      'Atrasados, 1 prazo',
      'Hoje e amanhã, 2 prazos',
      'Até 5 dias úteis, 5 prazos',
      'Sem responsável, 2 prazos',
      'Todos, 8 prazos',
      'Propostos, 2 prazos',
      'Aguardando baixa, 2 prazos',
    ])
    await expect(
      items.map(
        (button) =>
          button.querySelector('[data-slot="view-switcher-item-count"]')
            ?.textContent,
      ),
    ).toEqual(['3', '1', '2', '5', '2', '8', '2', '2'])
  },
}

export const ChoosingAQueueReportsIt: Story = {
  play: async ({ args, canvasElement }) => {
    const queues = await openQueues(canvasElement, 'Minha fila')
    await userEvent.click(
      within(queues).getByRole('button', { name: 'Atrasados, 1 prazo' }),
    )
    await expect(args.onViewChange).toHaveBeenCalledWith('overdue')
    await expect(
      await within(canvasElement).findByRole('table', {
        name: 'Prazos: Atrasados',
      }),
    ).toBeVisible()
    await expect(rowsOf(canvasElement)).toHaveLength(1)
  },
}

export const ViewsLimitTheQueuesOfAMember: Story = {
  args: { counts: false, manager: false },
  play: async ({ canvasElement }) => {
    const queues = await openQueues(canvasElement, 'Minha fila')
    await expect(
      within(queues)
        .getAllByRole('button')
        .map((button) => button.textContent),
    ).toEqual(['Minha fila', 'Atrasados', 'Hoje e amanhã', 'Até 5 dias úteis'])
    await expect(memberViews).toHaveLength(4)
  },
}

export const TheKindShowsOnlyWhenItDiffersFromTheLabel: Story = {
  args: { view: 'all' },
  play: async ({ canvasElement }) => {
    const replica = within(rowOf(canvasElement, 'Réplica à contestação'))
    await expect(replica.getByText('Réplica')).toBeVisible()
    const answer = within(
      rowOf(canvasElement, 'Reclamação trabalhista de ex-motorista'),
    )
    await expect(answer.getAllByText('Contestação')).toHaveLength(1)
  },
}

export const DaysLeftCarriesItsTone: Story = {
  args: { view: 'week' },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByText('Vence hoje')).toHaveAttribute(
      'data-tone',
      'danger',
    )
    await expect(canvas.getByText('3 dias úteis')).toHaveAttribute(
      'data-tone',
      'warning',
    )
    await expect(canvas.getByText('Vence hoje')).toHaveClass(
      'text-destructive-foreground',
    )
  },
}

export const CalendarDaysKeepTheirDay: Story = {
  play: async ({ canvasElement }) => {
    const row = rowOf(canvasElement, 'Réplica à contestação')
    await expect(row).toHaveTextContent('24/11/2026')
    await expect(row).toHaveTextContent('20/11/2026')
  },
}

export const TheShortDateFormatIsAnOption: Story = {
  args: { dateFormat: 'short' },
  play: async ({ canvasElement }) => {
    const row = rowOf(canvasElement, 'Réplica à contestação')
    await expect(row).toHaveTextContent(/24 de nov/)
    await expect(row).not.toHaveTextContent('24/11/2026')
  },
}

export const SortReportsTheNewValue: Story = {
  play: async ({ args, canvasElement }) => {
    await chooseInSubmenu(canvasElement, 'Ordenar por', 'Data interna')
    await expect(args.onSortChange).toHaveBeenCalledWith('internal')
  },
}

export const OwnerFilterReportsTheNewValue: Story = {
  args: { view: 'all' },
  play: async ({ args, canvasElement }) => {
    await chooseInSubmenu(canvasElement, 'Responsável', 'Rafael Antunes')
    await expect(args.onOwnerFilterChange).toHaveBeenCalledWith('rafael')
    await expect(rowsOf(canvasElement)).toHaveLength(1)
  },
}

export const KindFilterReportsTheNewValue: Story = {
  args: { view: 'all' },
  play: async ({ args, canvasElement }) => {
    await chooseInSubmenu(canvasElement, 'Tipo', 'Recurso')
    await expect(args.onKindFilterChange).toHaveBeenCalledWith('recurso')
    await expect(rowsOf(canvasElement)).toHaveLength(2)
  },
}

export const ClearFiltersResetsOwnerAndKind: Story = {
  args: { view: 'all' },
  play: async ({ args, canvasElement }) => {
    await chooseInSubmenu(canvasElement, 'Tipo', 'Recurso')
    await userEvent.keyboard('{Escape}{Escape}')
    await expect(
      await within(canvasElement).findByRole('button', {
        name: 'Exibição (1)',
      }),
    ).toBeVisible()
    await openDisplayMenu(canvasElement)
    await userEvent.click(
      await screen.findByRole('menuitem', { name: 'Limpar filtros' }),
    )
    await expect(args.onKindFilterChange).toHaveBeenLastCalledWith(null)
    await expect(args.onOwnerFilterChange).toHaveBeenLastCalledWith(null)
  },
}

export const ARowOpensTheDeadline: Story = {
  play: async ({ args, canvasElement }) => {
    await userEvent.click(
      within(canvasElement).getByRole('button', {
        name: 'Abrir prazo Réplica à contestação de Ação de cobrança contra fornecedor de farinha',
      }),
    )
    await expect(args.onOpen).toHaveBeenCalledWith('prz-602')
  },
}

export const NewDeadlineCallsOnCreate: Story = {
  play: async ({ args, canvasElement }) => {
    await userEvent.click(
      within(toolbarOf(canvasElement)).getByRole('button', {
        name: 'Novo prazo',
      }),
    )
    await expect(args.onCreate).toHaveBeenCalledOnce()
  },
}

export const DecisionShowsOnlyOnProposed: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(
      canvas.queryByRole('columnheader', { name: 'Decisão' }),
    ).toBeNull()
    const queues = await openQueues(canvasElement, 'Minha fila')
    await userEvent.click(
      within(queues).getByRole('button', { name: 'Propostos, 2 prazos' }),
    )
    await expect(
      await canvas.findByRole('columnheader', { name: 'Decisão' }),
    ).toBeVisible()
  },
}

export const ConfirmReportsTheDeadlineWithoutOpeningTheRow: Story = {
  args: { view: 'proposed' },
  play: async ({ args, canvasElement }) => {
    const decision = within(canvasElement).getByRole('group', {
      name: 'Decidir proposta Impugnação ao cumprimento de sentença',
    })
    await userEvent.click(
      within(decision).getByRole('button', { name: 'Confirmar' }),
    )
    await expect(args.onConfirm).toHaveBeenCalledWith('prz-610')
    await expect(args.onOpen).not.toHaveBeenCalled()
  },
}

export const RejectReportsTheDeadlineWithoutOpeningTheRow: Story = {
  args: { view: 'proposed' },
  play: async ({ args, canvasElement }) => {
    const decision = within(canvasElement).getByRole('group', {
      name: 'Decidir proposta Impugnação ao cumprimento de sentença',
    })
    await userEvent.click(
      within(decision).getByRole('button', { name: 'Rejeitar' }),
    )
    await expect(args.onReject).toHaveBeenCalledWith('prz-610')
    await expect(args.onOpen).not.toHaveBeenCalled()
  },
}

export const WithoutDecisionCallbacksProposedHasNoDecision: Story = {
  args: { decides: false, view: 'proposed' },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(rowsOf(canvasElement)).toHaveLength(2)
    await expect(
      canvas.queryByRole('columnheader', { name: 'Decisão' }),
    ).toBeNull()
  },
}

export const LoadMoreAsksForTheNextPage: Story = {
  args: { view: 'all' },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(rowsOf(canvasElement)).toHaveLength(5)
    await userEvent.click(canvas.getByRole('button', { name: 'Carregar mais' }))
    await expect(args.onLoadMore).toHaveBeenCalledOnce()
    await expect(rowsOf(canvasElement)).toHaveLength(8)
    await expect(
      canvas.queryByRole('button', { name: 'Carregar mais' }),
    ).toBeNull()
  },
}

export const LoadMoreErrorIsAnnounced: Story = {
  args: { loadMoreError: true, view: 'all' },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByRole('alert')).toHaveTextContent(
      'Não foi possível carregar mais prazos. Tente de novo.',
    )
    await expect(
      canvas.getByRole('button', { name: 'Carregar mais' }),
    ).toBeEnabled()
  },
}

export const LoadingMoreDisablesTheButton: Story = {
  render: (args) => (
    <Legal6
      deadlines={deadlines.slice(0, 5)}
      hasMore
      kinds={kinds}
      loadingMore
      onLoadMore={args.onLoadMore}
      owners={owners}
      view="all"
    />
  ),
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByRole('button', { name: 'Carregar mais' }),
    ).toBeDisabled()
  },
}

export const EmptyShowsTheQueueMessageAndTheNextQueue: Story = {
  args: { empty: true },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByText('Nenhum prazo na sua fila.')).toBeVisible()
    await userEvent.click(canvas.getByRole('button', { name: 'Ver Atrasados' }))
    await expect(args.onViewChange).toHaveBeenCalledWith('overdue')
  },
}

export const EmptyWithFiltersShowsTheFilteredMessage: Story = {
  render: () => (
    <Legal6
      counts={{ mine: 0, overdue: 0, today: 0 }}
      deadlines={[]}
      filtered
      kinds={kinds}
      owners={owners}
      view="mine"
    />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(
      canvas.getByText('Nenhum prazo nesta fila com estes filtros.'),
    ).toBeVisible()
    await expect(canvas.queryByRole('button', { name: /^Ver / })).toBeNull()
  },
}

export const PendingShowsTheSkeleton: Story = {
  render: () => <Legal6 deadlines={[]} owners={owners} pending />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByLabelText('Carregando prazos')).toHaveAttribute(
      'aria-busy',
      'true',
    )
    await expect(
      canvas.getByRole('button', { name: 'Minha fila' }),
    ).toBeVisible()
    await expect(canvas.queryByRole('button', { name: 'Exibição' })).toBeNull()
  },
}

export const ErrorShowsRetry: Story = {
  render: (args) => <Legal6 deadlines={[]} error onRetry={args.onRetry} />,
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(
      canvas.getByText('Não foi possível carregar os prazos'),
    ).toBeVisible()
    await userEvent.click(
      canvas.getByRole('button', { name: 'Tentar novamente' }),
    )
    await expect(args.onRetry).toHaveBeenCalledOnce()
  },
}

export const SavedViewsFollowTheQueuesAndApplyTheChoice: Story = {
  args: { view: 'all' },
  play: async ({ args, canvasElement }) => {
    await userEvent.click(
      within(toolbarOf(canvasElement)).getByRole('button', { name: 'Todos' }),
    )
    const mine = await screen.findByRole('group', { name: 'Minhas visões' })
    await waitFor(() => expect(mine).toBeVisible())
    await userEvent.click(
      within(mine).getByRole('button', { name: 'Contestações' }),
    )
    await expect(args.onSavedViewSelect).toHaveBeenCalledWith(
      'view-contestacoes',
    )
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull())
    await expect(
      within(toolbarOf(canvasElement)).getByRole('button', {
        name: 'Contestações',
      }),
    ).toBeVisible()
    await expect(
      within(toolbarOf(canvasElement)).getByRole('button', {
        name: 'Exibição (1)',
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

export const CatalogsLoadingShowTheSkeletonInTheFilter: Story = {
  args: { catalogsLoading: true },
  play: async ({ canvasElement }) => {
    await openDisplayMenu(canvasElement)
    await userEvent.click(await screen.findByRole('menuitem', { name: 'Tipo' }))
    const clear = await screen.findByRole('menuitemradio', {
      name: 'Todos os tipos',
    })
    await expect(clear.closest('[aria-busy="true"]')).not.toBeNull()
    await expect(
      screen.queryByRole('menuitemradio', { name: 'Contestação' }),
    ).toBeNull()
    await userEvent.keyboard('{Escape}{Escape}')
    await waitFor(() => expect(screen.queryByRole('menu')).toBeNull())
  },
}
