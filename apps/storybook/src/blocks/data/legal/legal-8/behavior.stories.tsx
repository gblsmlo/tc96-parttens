import type { Meta, StoryObj } from '@storybook/react-vite'
import { Legal8 } from '@tc96/ui/blocks/data/legal/legal-8'
import { expect, fn, screen, userEvent, waitFor, within } from 'storybook/test'
import { failures, runs } from '../fixtures/legal-8.ts'
import { type Legal8Controls, legal8ControlArgs } from './legal-8-controls.ts'
import { ComposedLegal8 } from './legal-8-layouts.tsx'

const meta = {
  args: {
    ...legal8ControlArgs,
    onOpenFailure: fn(),
    onOriginFilterChange: fn(),
    onRetry: fn(),
    onRun: fn(),
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
  render: (args) => <ComposedLegal8 {...args} />,
  tags: ['!autodocs'],
  title: 'Blocks/Data/Legal/Legal8/Behavior',
} satisfies Meta<
  Legal8Controls & {
    onOpenFailure: () => void
    onOriginFilterChange: () => void
    onRetry: () => void
    onRun: () => void
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

const openDisplayMenu = async (
  canvasElement: HTMLElement,
  name = 'Exibição',
) => {
  await userEvent.click(within(canvasElement).getByRole('button', { name }))
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

const bodyRows = (canvasElement: HTMLElement) =>
  canvasElement.querySelectorAll('[data-slot="data-table"] tbody tr')

export const TheNoticeReportsCaptureUpToDate: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const notice = canvas.getByRole('status')
    await expect(within(notice).getByText('Captura em dia')).toBeVisible()
    await expect(
      within(notice).getByText(/^Próxima varredura: 24\/11\/2026/),
    ).toBeVisible()
    await expect(
      canvas.getByRole('region', { name: 'Monitoramento' }),
    ).toBeVisible()
  },
}

export const TheNoticeSitsAboveTheToolbar: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const notice = canvas.getByRole('status')
    const toolbar = canvas.getByRole('toolbar', {
      name: 'Controles do monitoramento',
    })
    await expect(toolbar.contains(notice)).toBe(false)
    await expect(
      notice.compareDocumentPosition(toolbar) &
        Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy()
  },
}

export const RunNowCallsOnRun: Story = {
  play: async ({ args, canvasElement }) => {
    await userEvent.click(
      within(canvasElement).getByRole('button', { name: 'Rodar agora' }),
    )
    await expect(args.onRun).toHaveBeenCalledOnce()
  },
}

export const AStoppedCaptureIsAnAlert: Story = {
  args: { stopped: true },
  play: async ({ args, canvasElement }) => {
    const notice = within(canvasElement).getByRole('alert')
    await expect(
      within(notice).getByText('Captura parada desde 20/11/2026'),
    ).toBeVisible()
    await userEvent.click(
      within(notice).getByRole('button', { name: 'Tentar agora' }),
    )
    await expect(args.onRun).toHaveBeenCalledOnce()
  },
}

export const RunningDisablesTheAction: Story = {
  args: { running: true },
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByRole('button', { name: 'Rodar agora' }),
    ).toBeDisabled()
  },
}

export const AFailedRunIsAnnounced: Story = {
  args: { runError: true },
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByRole('alert')).toHaveTextContent(
      'Não foi possível rodar a captura agora. Tente de novo.',
    )
  },
}

export const TheViewSwitcherShowsTheFailures: Story = {
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByRole('table', { name: 'Execuções' })).toBeVisible()
    await userEvent.click(canvas.getByRole('button', { name: 'Execuções' }))
    const failuresItem = await screen.findByRole('button', {
      name: 'Falhas, 8 itens',
    })
    await expect(
      failuresItem.querySelector('[data-slot="view-switcher-item-count"]'),
    ).toHaveTextContent('8')
    await userEvent.click(failuresItem)
    await expect(args.onViewChange).toHaveBeenCalledWith('failures')
    await expect(canvas.getByRole('table', { name: 'Falhas' })).toBeVisible()
    await expect(bodyRows(canvasElement)).toHaveLength(failures.length)
  },
}

export const SeeFailureOpensItUnderFailures: Story = {
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    const [seeFailure] = canvas.getAllByRole('button', { name: 'Ver falha' })
    await userEvent.click(seeFailure as HTMLElement)
    await expect(args.onOpenFailure).toHaveBeenCalledWith('fail-31')
    await expect(args.onViewChange).toHaveBeenCalledWith('failures')
    await expect(canvas.getByRole('table', { name: 'Falhas' })).toBeVisible()
  },
}

export const RunsShowTheStartAndEndTime: Story = {
  play: async ({ canvasElement }) => {
    const row = within(
      within(canvasElement)
        .getByText('O DJEN não respondeu. Nova tentativa às 18:00.')
        .closest('tr') as HTMLElement,
    )
    await expect(row.getByText(/06:00/)).toBeVisible()
    await expect(row.getByText(/06:04/)).toBeVisible()
  },
}

export const RunRowsDoNotOpen: Story = {
  play: async ({ canvasElement }) => {
    await expect(bodyRows(canvasElement)).toHaveLength(runs.length)
    await expect(
      within(canvasElement).queryByRole('button', { name: /^Abrir/ }),
    ).toBeNull()
  },
}

export const AFailureRowOpens: Story = {
  args: { view: 'failures' },
  play: async ({ args, canvasElement }) => {
    const [openRow] = within(canvasElement).getAllByRole('button', {
      name: 'Abrir falha OAB sem publicações',
    })
    await userEvent.click(openRow as HTMLElement)
    await expect(args.onOpenFailure).toHaveBeenCalledWith('fail-29')
    await expect(args.onViewChange).not.toHaveBeenCalled()
  },
}

export const SortReportsTheNewOrder: Story = {
  args: { view: 'failures' },
  play: async ({ args, canvasElement }) => {
    await chooseInSubmenu(canvasElement, 'Ordenar por', 'Mais antigas')
    await expect(args.onSortChange).toHaveBeenCalledWith('oldest')
    await expect(bodyRows(canvasElement)).toHaveLength(failures.length)
  },
}

export const OriginFilterReportsAndClears: Story = {
  args: { view: 'failures' },
  play: async ({ args, canvasElement }) => {
    await chooseInSubmenu(canvasElement, 'Origem', 'Cadastro')
    await expect(args.onOriginFilterChange).toHaveBeenCalledWith('registration')
    await expect(bodyRows(canvasElement)).toHaveLength(failures.length)
    await userEvent.keyboard('{Escape}{Escape}')
    await openDisplayMenu(canvasElement, 'Exibição (1)')
    await userEvent.click(
      await screen.findByRole('menuitem', { name: 'Limpar filtros' }),
    )
    await expect(args.onOriginFilterChange).toHaveBeenLastCalledWith(null)
  },
}

export const TheRunsMenuHasNothingToSet: Story = {
  play: async ({ canvasElement }) => {
    const menu = await openDisplayMenu(canvasElement)
    await expect(
      within(menu).queryByRole('menuitem', { name: 'Ordenar por' }),
    ).toBeNull()
    await expect(
      within(menu).getByRole('menuitem', { name: 'Limpar filtros' }),
    ).toHaveAttribute('aria-disabled', 'true')
  },
}

export const EmptyRunsShowTheMessage: Story = {
  args: { empty: true },
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByText('Nenhuma captura rodou ainda.'),
    ).toBeVisible()
  },
}

export const EmptyFailuresShowTheMessage: Story = {
  args: { empty: true, view: 'failures' },
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByText(
        'Nenhuma falha aberta ou resolvida nos últimos 90 dias.',
      ),
    ).toBeVisible()
  },
}

export const PendingShowsTheSkeleton: Story = {
  render: (args) => (
    <Legal8 failures={failures} onRun={args.onRun} pending runs={runs} />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(
      canvas.getByLabelText('Carregando monitoramento'),
    ).toHaveAttribute('aria-busy', 'true')
    await expect(canvas.queryByText('Captura em dia')).toBeNull()
    await expect(
      canvas.getByRole('button', { name: 'Rodar agora' }),
    ).toBeDisabled()
    await expect(
      canvas.getByRole('button', { name: 'Execuções' }),
    ).toBeVisible()
    await expect(canvas.queryByRole('button', { name: 'Exibição' })).toBeNull()
  },
}

export const ErrorShowsRetry: Story = {
  render: (args) => (
    <Legal8 error failures={[]} onRetry={args.onRetry} runs={[]} />
  ),
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(
      canvas.getByText('Não foi possível carregar o monitoramento'),
    ).toBeVisible()
    await expect(canvas.getByText('Captura em dia')).toBeVisible()
    await userEvent.click(
      canvas.getByRole('button', { name: 'Tentar novamente' }),
    )
    await expect(args.onRetry).toHaveBeenCalledOnce()
  },
}

const longError =
  'O DJEN respondeu em um formato inesperado. A captura tenta de novo na próxima varredura e a falha fica registrada no monitoramento.'

export const SavedViewsFollowTheViewsAndApplyTheChoice: Story = {
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getByRole('button', { name: 'Execuções' }))
    const mine = await screen.findByRole('group', { name: 'Minhas visões' })
    await waitFor(() => expect(mine).toBeVisible())
    await userEvent.click(
      within(mine).getByRole('button', { name: 'Falhas externas' }),
    )
    await expect(args.onSavedViewSelect).toHaveBeenCalledWith(
      'view-falhas-externas',
    )
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull())
    await expect(canvas.getByRole('table', { name: 'Falhas' })).toBeVisible()
    await expect(
      canvas.getByRole('button', { name: 'Falhas externas' }),
    ).toBeVisible()
    await expect(
      canvas.getByRole('button', { name: 'Exibição (1)' }),
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

export const TheLastErrorKeepsOneLineWithItsFullText: Story = {
  play: async ({ canvasElement }) => {
    const error = within(canvasElement).getByRole('img', {
      name: `Último erro: ${longError}`,
    })
    const cell = error.closest('[data-slot="legal-8-error"]') as HTMLElement
    await expect(cell).toHaveAttribute('title', longError)
    await expect(
      getComputedStyle(error.querySelector('.truncate') as HTMLElement)
        .whiteSpace,
    ).toBe('nowrap')
  },
}

export const SimulatedRunsAndFailuresAreMarked: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const simulatedRun = canvas
      .getByText('O DJEN não respondeu. Nova tentativa às 18:00.')
      .closest('tr') as HTMLElement
    await expect(within(simulatedRun).getByText('Simulado')).toBeVisible()
    const realRun = canvas
      .getByRole('img', { name: `Último erro: ${longError}` })
      .closest('tr') as HTMLElement
    await expect(within(realRun).queryByText('Simulado')).toBeNull()
    await userEvent.click(canvas.getByRole('button', { name: 'Execuções' }))
    await userEvent.click(
      await screen.findByRole('button', { name: 'Falhas, 8 itens' }),
    )
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull())
    const [externalFailure] = bodyRows(canvasElement)
    await expect(
      within(externalFailure as HTMLElement).getByText('Simulado'),
    ).toBeVisible()
    await expect(
      canvasElement.querySelectorAll('[data-slot="legal-8-simulated"]'),
    ).toHaveLength(1)
  },
}

export const FailuresKeepTheGivenOrder: Story = {
  render: () => (
    <Legal8 failures={[...failures].reverse()} runs={runs} view="failures" />
  ),
  play: async ({ canvasElement }) => {
    const states = [...bodyRows(canvasElement)].map((row) =>
      within(row as HTMLElement)
        .getByRole('img', { name: /^Situação:/ })
        .getAttribute('aria-label'),
    )
    await expect(states).toEqual(
      [...failures]
        .reverse()
        .map(
          (failure) =>
            `Situação: ${failure.state === 'open' ? 'Aberta' : 'Resolvida'}`,
        ),
    )
    await expect(states[0]).toBe('Situação: Resolvida')
  },
}
