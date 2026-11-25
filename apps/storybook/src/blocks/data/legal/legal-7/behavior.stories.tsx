import type { Meta, StoryObj } from '@storybook/react-vite'
import { Legal7 } from '@tc96/ui/blocks/data/legal/legal-7'
import { expect, fn, screen, userEvent, waitFor, within } from 'storybook/test'
import { pageSize, publications, tribunals } from '../fixtures/legal-7.ts'
import { type Legal7Controls, legal7ControlArgs } from './legal-7-controls.ts'
import { ComposedLegal7 } from './legal-7-layouts.tsx'

const meta = {
  args: {
    ...legal7ControlArgs,
    onCreateDeadline: fn(),
    onCreateLawsuit: fn(),
    onCreateTask: fn(),
    onDiscard: fn(),
    onLawsuitFilterChange: fn(),
    onLinkDeadline: fn(),
    onLinkLawsuit: fn(),
    onModeChange: fn(),
    onNoDeadline: fn(),
    onOpen: fn(),
    onPageChange: fn(),
    onRetry: fn(),
    onSavedViewCreate: fn(),
    onSavedViewDelete: fn(),
    onSavedViewDuplicate: fn(),
    onSavedViewRename: fn(),
    onSavedViewSelect: fn(),
    onSavedViewUpdate: fn(),
    onSavePreference: fn(),
    onSelectedIdsChange: fn(),
    onSortChange: fn(),
    onTribunalFilterChange: fn(),
  },
  parameters: { layout: 'padded' },
  render: (args) => <ComposedLegal7 {...args} />,
  tags: ['!autodocs'],
  title: 'Blocks/Data/Legal/Legal7/Behavior',
} satisfies Meta<
  Legal7Controls & {
    onCreateDeadline: () => void
    onCreateLawsuit: () => void
    onCreateTask: () => void
    onDiscard: () => void
    onLawsuitFilterChange: () => void
    onLinkDeadline: () => void
    onLinkLawsuit: () => void
    onModeChange: () => void
    onNoDeadline: () => void
    onOpen: () => void
    onPageChange: () => void
    onRetry: () => void
    onSavedViewCreate: () => void
    onSavedViewDelete: () => void
    onSavedViewDuplicate: () => void
    onSavedViewRename: () => void
    onSavedViewSelect: () => void
    onSavedViewUpdate: () => void
    onSavePreference: () => void
    onSelectedIdsChange: () => void
    onSortChange: () => void
    onTribunalFilterChange: () => void
  }
>

export default meta

type Story = StoryObj<typeof meta>

const linked = '12/11/2026 · TJSP'
const unlinked = '13/11/2026 · TRT-2'
const otherUnlinked = '18/11/2026 · TRF-3'
const bulkHint =
  'Só publicações sem processo são vinculadas ou descartadas juntas.'

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

const bodyRowsOf = (canvasElement: HTMLElement) =>
  canvasElement.querySelectorAll('[data-slot="data-table"] tbody tr')

const select = (canvasElement: HTMLElement, description: string) =>
  userEvent.click(
    within(canvasElement).getByRole('checkbox', {
      name: `Selecionar publicação de ${description}`,
    }),
  )

const actionBarOf = (canvasElement: HTMLElement) =>
  within(canvasElement).findByRole('toolbar', {
    name: 'Ações das publicações selecionadas',
  })

const act = async (bar: HTMLElement, name: string) =>
  userEvent.click(within(bar).getByRole('button', { name }))

export const TheHeadingNamesTheSection: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(
      canvas.getByRole('heading', { level: 2, name: 'Publicações' }),
    ).toBeVisible()
    await expect(
      canvas.getByRole('region', { name: 'Publicações' }),
    ).toBeVisible()
    const toolbar = canvas.getByRole('toolbar', {
      name: 'Controles de publicações',
    })
    await expect(toolbar).toHaveAttribute('data-mode', 'plain')
    await expect(within(toolbar).queryByRole('searchbox')).toBeNull()
  },
}

export const FallbacksFillAMissingNumberAndLawsuit: Story = {
  play: async ({ canvasElement }) => {
    const row = within(canvasElement)
      .getByText('Pauta de julgamento')
      .closest('tr') as HTMLElement
    await expect(within(row).getByText('sem número CNJ')).toBeVisible()
    await expect(within(row).getByText('Sem processo')).toBeVisible()
    await expect(within(row).getByText('há 6 dias')).toBeVisible()
  },
}

export const ModeTabsSwitchToTheList: Story = {
  play: async ({ args, canvasElement }) => {
    await openDisplayMenu(canvasElement)
    await userEvent.click(
      await screen.findByRole('menuitemradio', { name: 'Lista' }),
    )
    await expect(args.onModeChange).toHaveBeenCalledWith('list')
    const canvas = within(canvasElement)
    await expect(canvas.queryByRole('table')).toBeNull()
    await expect(
      canvasElement.querySelectorAll('[data-slot="list-row"]'),
    ).toHaveLength(pageSize)
    await expect(canvas.getByText('Citação · TRT-2')).toBeVisible()
  },
}

export const TheListTitleOpensThePublication: Story = {
  args: { mode: 'list' },
  play: async ({ args, canvasElement }) => {
    const trigger = within(canvasElement).getByRole('button', {
      name: `Abrir publicação de ${unlinked}`,
    })
    await expect(trigger).toHaveTextContent('Citação · TRT-2')
    const row = trigger.closest('[data-slot="list-row"]') as HTMLElement
    await expect(
      row.querySelector('[data-slot="list-row-leading"] svg'),
    ).toHaveAttribute('aria-hidden', 'true')
    await userEvent.click(trigger)
    await expect(args.onOpen).toHaveBeenCalledWith('pub-702')
  },
}

export const TheRowOpensThePublication: Story = {
  play: async ({ args, canvasElement }) => {
    await userEvent.click(
      within(canvasElement).getByRole('button', {
        name: `Abrir publicação de ${unlinked}`,
      }),
    )
    await expect(args.onOpen).toHaveBeenCalledWith('pub-702')
    await expect(args.onSelectedIdsChange).not.toHaveBeenCalled()
  },
}

export const SortReportsTheNewOrder: Story = {
  play: async ({ args, canvasElement }) => {
    await chooseInSubmenu(canvasElement, 'Ordenar por', 'Mais novas')
    await expect(args.onSortChange).toHaveBeenCalledWith('newest')
    await waitFor(() =>
      expect(bodyRowsOf(canvasElement)[0]).toHaveTextContent('hoje'),
    )
  },
}

export const LawsuitFilterReportsTheChoice: Story = {
  play: async ({ args, canvasElement }) => {
    await chooseInSubmenu(canvasElement, 'Processo', 'Sem processo')
    await expect(args.onLawsuitFilterChange).toHaveBeenCalledWith('unlinked')
    await waitFor(() =>
      expect(within(canvasElement).getByText('1–5 de 5')).toBeVisible(),
    )
  },
}

export const TribunalFilterReportsTheChoice: Story = {
  play: async ({ args, canvasElement }) => {
    await chooseInSubmenu(canvasElement, 'Tribunal', 'TRT-15')
    await expect(args.onTribunalFilterChange).toHaveBeenCalledWith('TRT-15')
    await waitFor(() => expect(bodyRowsOf(canvasElement)).toHaveLength(2))
  },
}

export const ClearFiltersResetsBothFilters: Story = {
  render: (args) => <ComposedLegal7 {...args} initialTribunalFilter="TRT-15" />,
  play: async ({ args, canvasElement }) => {
    await expect(bodyRowsOf(canvasElement)).toHaveLength(2)
    await openDisplayMenu(canvasElement)
    await userEvent.click(
      await screen.findByRole('menuitem', { name: 'Limpar filtros' }),
    )
    await expect(args.onTribunalFilterChange).toHaveBeenLastCalledWith(null)
    await expect(args.onLawsuitFilterChange).toHaveBeenLastCalledWith(null)
    await waitFor(() =>
      expect(within(canvasElement).getByText('1–5 de 12')).toBeVisible(),
    )
  },
}

export const ASelectedTribunalStaysOffered: Story = {
  render: (args) => <ComposedLegal7 {...args} initialTribunalFilter="STJ" />,
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByText('Nenhuma publicação com estes filtros.'),
    ).toBeVisible()
    await expect(within(canvasElement).queryByRole('navigation')).toBeNull()
    await openDisplayMenu(canvasElement)
    await userEvent.click(
      await screen.findByRole('menuitem', { name: 'Tribunal' }),
    )
    await expect(
      await screen.findByRole('menuitemradio', { name: 'STJ' }),
    ).toHaveAttribute('aria-checked', 'true')
  },
}

export const PaginationReportsThePage: Story = {
  play: async ({ args, canvasElement }) => {
    const pagination = within(canvasElement).getByRole('navigation', {
      name: 'Paginação das publicações',
    })
    await expect(within(canvasElement).getByText('1–5 de 12')).toBeVisible()
    await userEvent.click(
      within(pagination).getByRole('button', { name: 'Próxima página' }),
    )
    await expect(args.onPageChange).toHaveBeenCalledWith(2)
    await waitFor(() =>
      expect(within(canvasElement).getByText('6–10 de 12')).toBeVisible(),
    )
  },
}

export const ALinkedPublicationOffersTheDeadlineDecisions: Story = {
  play: async ({ args, canvasElement }) => {
    await select(canvasElement, linked)
    await expect(args.onSelectedIdsChange).toHaveBeenLastCalledWith(['pub-701'])
    const bar = await actionBarOf(canvasElement)
    await expect(bar).toHaveTextContent('1 selecionada')
    await expect(
      within(bar).queryByRole('button', { name: 'Cadastrar processo' }),
    ).toBeNull()
    await act(bar, 'Criar prazo')
    await expect(args.onCreateDeadline).toHaveBeenCalledWith('pub-701')
    await act(bar, 'Vincular a prazo')
    await expect(args.onLinkDeadline).toHaveBeenCalledWith('pub-701')
    await act(bar, 'Sem prazo')
    await expect(args.onNoDeadline).toHaveBeenCalledWith('pub-701')
  },
}

export const AnUnlinkedPublicationOffersTheLawsuitDecisions: Story = {
  play: async ({ args, canvasElement }) => {
    await select(canvasElement, unlinked)
    const bar = await actionBarOf(canvasElement)
    await expect(
      within(bar).queryByRole('button', { name: 'Criar prazo' }),
    ).toBeNull()
    await act(bar, 'Cadastrar processo')
    await expect(args.onCreateLawsuit).toHaveBeenCalledWith('pub-702')
    await act(bar, 'Vincular a um processo')
    await expect(args.onLinkLawsuit).toHaveBeenCalledWith(['pub-702'])
  },
}

export const OnePublicationCanBecomeATaskOrBeDiscarded: Story = {
  play: async ({ args, canvasElement }) => {
    await select(canvasElement, linked)
    const bar = await actionBarOf(canvasElement)
    await act(bar, 'Criar tarefa')
    await expect(args.onCreateTask).toHaveBeenCalledWith('pub-701')
    await act(bar, 'Descartar')
    await expect(args.onDiscard).toHaveBeenCalledWith(['pub-701'])
  },
}

export const UnlinkedPublicationsAreDecidedTogether: Story = {
  play: async ({ args, canvasElement }) => {
    await select(canvasElement, unlinked)
    await select(canvasElement, otherUnlinked)
    const bar = await actionBarOf(canvasElement)
    await waitFor(() => expect(bar).toHaveTextContent('2 selecionadas'))
    await expect(
      canvasElement.querySelector('[data-slot="action-bar-notice"]'),
    ).toBeNull()
    await expect(
      within(bar).queryByRole('button', { name: 'Criar tarefa' }),
    ).toBeNull()
    await act(bar, 'Vincular a um processo')
    await expect(args.onLinkLawsuit).toHaveBeenCalledWith([
      'pub-702',
      'pub-705',
    ])
    await act(bar, 'Descartar')
    await expect(args.onDiscard).toHaveBeenCalledWith(['pub-702', 'pub-705'])
  },
}

export const AMixedSelectionDisablesTheBulkDecisions: Story = {
  play: async ({ canvasElement }) => {
    await select(canvasElement, linked)
    await select(canvasElement, unlinked)
    await waitFor(() =>
      expect(
        canvasElement.querySelector('[data-slot="action-bar-notice"]'),
      ).toHaveTextContent(bulkHint),
    )
    const bar = await actionBarOf(canvasElement)
    await expect(bar).toHaveTextContent('2 selecionadas')
    await expect(bar).not.toHaveTextContent(bulkHint)
    await expect(
      within(bar).getByRole('button', { name: 'Vincular a um processo' }),
    ).toBeDisabled()
    await expect(
      within(bar).getByRole('button', { name: 'Descartar' }),
    ).toBeDisabled()
  },
}

export const ClearSelectionEmptiesTheSelection: Story = {
  play: async ({ args, canvasElement }) => {
    await select(canvasElement, linked)
    const bar = await actionBarOf(canvasElement)
    await act(bar, 'Limpar seleção')
    await expect(args.onSelectedIdsChange).toHaveBeenLastCalledWith([])
    await waitFor(() =>
      expect(
        within(canvasElement).queryByRole('toolbar', {
          name: 'Ações das publicações selecionadas',
        }),
      ).toBeNull(),
    )
  },
}

export const AnActionNeedsItsCallback: Story = {
  render: (args) => (
    <Legal7
      onCreateTask={args.onCreateTask}
      publications={publications.slice(0, pageSize)}
      tribunals={tribunals}
    />
  ),
  play: async ({ canvasElement }) => {
    await select(canvasElement, linked)
    const bar = await actionBarOf(canvasElement)
    await expect(
      within(bar).getByRole('button', { name: 'Criar tarefa' }),
    ).toBeVisible()
    await expect(
      within(bar).queryByRole('button', { name: 'Criar prazo' }),
    ).toBeNull()
    await expect(
      within(bar).queryByRole('button', { name: 'Descartar' }),
    ).toBeNull()
    await expect(within(canvasElement).queryByRole('navigation')).toBeNull()
  },
}

export const EmptyShowsTheQueueMessage: Story = {
  args: { empty: true },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(
      canvas.getByText(
        'Nenhuma publicação para decidir. As novas chegam na próxima captura.',
      ),
    ).toBeVisible()
    await expect(canvas.queryByRole('navigation')).toBeNull()
  },
}

export const FilteredShowsTheNoResultMessage: Story = {
  render: () => <Legal7 filtered publications={[]} />,
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByText('Nenhuma publicação com estes filtros.'),
    ).toBeVisible()
  },
}

export const PendingShowsTheSkeleton: Story = {
  render: () => <Legal7 pending publications={publications} total={12} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(
      canvas.getByLabelText('Carregando publicações'),
    ).toHaveAttribute('aria-busy', 'true')
    await expect(
      canvas.getByRole('heading', { name: 'Publicações' }),
    ).toBeVisible()
    await expect(canvas.queryByRole('button', { name: /^Exibição/ })).toBeNull()
  },
}

export const ErrorShowsRetry: Story = {
  render: (args) => <Legal7 error onRetry={args.onRetry} publications={[]} />,
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(
      canvas.getByText('Não foi possível carregar as publicações'),
    ).toBeVisible()
    await userEvent.click(
      canvas.getByRole('button', { name: 'Tentar novamente' }),
    )
    await expect(args.onRetry).toHaveBeenCalledOnce()
  },
}

export const WithSavedViewsTheSwitcherReplacesTheHeading: Story = {
  args: { savedViews: true },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.queryByRole('heading', { level: 2 })).toBeNull()
    await userEvent.click(canvas.getByRole('button', { name: 'Todas' }))
    const mine = await screen.findByRole('group', {
      name: 'Minhas visualizações',
    })
    await waitFor(() => expect(mine).toBeVisible())
    await userEvent.click(
      within(mine).getByRole('button', { name: 'Sem processo' }),
    )
    await expect(args.onSavedViewSelect).toHaveBeenLastCalledWith(
      'view-sem-processo',
    )
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull())
    await waitFor(() => expect(canvas.getByText('1–5 de 5')).toBeVisible())
    await userEvent.click(canvas.getByRole('button', { name: 'Sem processo' }))
    await userEvent.click(await screen.findByRole('button', { name: 'Todas' }))
    await expect(args.onSavedViewSelect).toHaveBeenLastCalledWith(null)
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull())
    await expect(canvas.getByRole('button', { name: 'Todas' })).toBeVisible()
  },
}

export const SavePreferenceCallsItsCallback: Story = {
  args: { savedViews: true },
  play: async ({ args, canvasElement }) => {
    await openDisplayMenu(canvasElement)
    await userEvent.click(
      await screen.findByRole('menuitem', { name: 'Salvar preferência' }),
    )
    await expect(args.onSavePreference).toHaveBeenCalledOnce()
    await waitFor(() => expect(screen.queryByRole('menu')).toBeNull())
  },
}

export const TribunalsLoadingShowTheSkeletonInTheFilter: Story = {
  args: { catalogsLoading: true },
  play: async ({ canvasElement }) => {
    await openDisplayMenu(canvasElement)
    await userEvent.click(
      await screen.findByRole('menuitem', { name: 'Tribunal' }),
    )
    const clear = await screen.findByRole('menuitemradio', {
      name: 'Todos os tribunais',
    })
    await expect(clear.closest('[aria-busy="true"]')).not.toBeNull()
    await expect(
      screen.queryByRole('menuitemradio', { name: 'TJSP' }),
    ).toBeNull()
    await userEvent.keyboard('{Escape}{Escape}')
    await waitFor(() => expect(screen.queryByRole('menu')).toBeNull())
  },
}
