import type { Meta, StoryObj } from '@storybook/react-vite'
import { Table2 } from '@tc96/ui/blocks/data/table/table-2'
import { expect, fn, screen, userEvent, waitFor, within } from 'storybook/test'
import { members } from '../fixtures/table-2.ts'
import { type Table2Controls, table2ControlArgs } from './table-2-controls.ts'
import { ComposedTable2 } from './table-2-layouts.tsx'

const retry = fn()

const meta = {
  args: {
    ...table2ControlArgs,
    onColumnVisibilityChange: fn(),
    onDensityChange: fn(),
    onSave: fn(),
    onShowPausedChange: fn(),
    onSortChange: fn(),
  },
  parameters: { layout: 'padded' },
  render: (args) => <ComposedTable2 {...args} />,
  tags: ['!autodocs'],
  title: 'Blocks/Data/Table/Table2/Behavior',
} satisfies Meta<
  Table2Controls & {
    onColumnVisibilityChange: () => void
    onDensityChange: () => void
    onSave: () => void
    onShowPausedChange: () => void
    onSortChange: () => void
  }
>

export default meta

type Story = StoryObj<typeof meta>

const rowsOf = (canvasElement: HTMLElement) =>
  Array.from(
    canvasElement.querySelectorAll('[data-slot="data-table"] tbody tr'),
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

export const EachRowShowsTheMemberDetails: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(rowsOf(canvasElement)).toHaveLength(8)
    await expect(canvas.getByText('Ana Souza')).toBeVisible()
    await expect(canvas.getByText('(Você)')).toBeVisible()
    await expect(canvas.getByText('ana.souza@exemplo.com.br')).toBeVisible()
    await expect(canvas.getByText('Proprietário')).toBeVisible()
    await expect(canvas.getByText('Avaliação 4,9 de 5')).toBeInTheDocument()
    await expect(canvas.getByText('Atividade de 92%')).toBeInTheDocument()
  },
}

export const PresenceIsNamedForAssistiveTechnology: Story = {
  play: async ({ canvasElement }) => {
    const first = rowsOf(canvasElement)[0] as HTMLElement
    await expect(
      first.querySelector('[data-presence="online"]'),
    ).toHaveTextContent('Online')
    await expect(first).toHaveTextContent('Online')
  },
}

const toolbarOf = (canvasElement: HTMLElement) =>
  within(canvasElement).getByRole('toolbar', { name: 'Controles dos membros' })

export const TheHeadingAppearsOnce: Story = {
  play: async ({ canvasElement }) => {
    const headings = within(canvasElement).getAllByRole('heading')
    await expect(headings).toHaveLength(1)
    await expect(headings[0]).toHaveTextContent('Membros')
    await expect(headings[0]?.tagName).toBe('H2')
  },
}

export const TheToolbarCarriesTheHeadingAndTheControls: Story = {
  play: async ({ canvasElement }) => {
    const toolbar = toolbarOf(canvasElement)
    await expect(toolbar).toHaveAttribute('data-mode', 'plain')
    const inToolbar = within(toolbar)
    await expect(
      inToolbar.getByRole('heading', { name: 'Membros' }),
    ).toBeVisible()
    await expect(
      inToolbar.getByRole('button', { name: 'Configurações' }),
    ).toBeVisible()
  },
}

export const TheDescriptionCountsTheMembers: Story = {
  play: async ({ canvasElement }) => {
    await expect(toolbarOf(canvasElement)).toHaveTextContent('12 membros')
  },
}

export const FooterPaginatesTheMembers: Story = {
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

export const PriorityAndLocationStartHidden: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(
      canvas.getByRole('columnheader', { name: /Papel/ }),
    ).toBeVisible()
    await expect(
      canvas.queryByRole('columnheader', { name: /Prioridade/ }),
    ).toBeNull()
    await expect(
      canvas.queryByRole('columnheader', { name: /Local/ }),
    ).toBeNull()
  },
}

export const SettingsGroupsDisplayAndFilters: Story = {
  play: async ({ canvasElement }) => {
    const menu = within(await openSettings(canvasElement))
    await expect(menu.getByText('Exibição')).toBeVisible()
    await expect(menu.getByText('Filtros')).toBeVisible()
    for (const name of [
      'Ordenação',
      'Propriedades exibidas',
      'Altura das linhas',
      'Papel',
      'Time',
    ]) {
      await expect(menu.getByRole('menuitem', { name })).toBeVisible()
    }
  },
}

export const TheSortSubmenuSortsAndReports: Story = {
  play: async ({ args, canvasElement }) => {
    await openSubmenu(canvasElement, 'Ordenação')
    await userEvent.click(
      await screen.findByRole('menuitem', { name: 'Avaliação: decrescente' }),
    )
    await waitFor(() =>
      expect(args.onSortChange).toHaveBeenLastCalledWith({
        direction: 'desc',
        key: 'rating',
      }),
    )
    await expect(rowsOf(canvasElement)[0]).toHaveTextContent('Henrique Melo')
  },
}

export const ThePropertiesSubmenuHidesAndShowsAColumn: Story = {
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    await openSubmenu(canvasElement, 'Propriedades exibidas')
    await userEvent.click(
      await screen.findByRole('menuitemcheckbox', { name: 'Atividade' }),
    )
    await expect(
      canvas.queryByRole('columnheader', { name: /Atividade/ }),
    ).toBeNull()
    await waitFor(() =>
      expect(args.onColumnVisibilityChange).toHaveBeenLastCalledWith(
        expect.objectContaining({ activity: false }),
      ),
    )
    await userEvent.click(
      await screen.findByRole('menuitemcheckbox', { name: 'Prioridade' }),
    )
    await expect(
      canvas.getByRole('columnheader', { name: /Prioridade/ }),
    ).toBeVisible()
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

export const TheRoleFilterNarrowsTheRowsAndClears: Story = {
  play: async ({ canvasElement }) => {
    await openSubmenu(canvasElement, 'Papel')
    await userEvent.click(
      await screen.findByRole('menuitemradio', { name: 'Administrador' }),
    )
    await waitFor(() => expect(rowsOf(canvasElement)).toHaveLength(3))
    await closeMenus()
    const menu = within(await openSettings(canvasElement, /^Configurações/))
    await userEvent.click(
      menu.getByRole('menuitem', { name: 'Limpar filtros' }),
    )
    await waitFor(() => expect(rowsOf(canvasElement)).toHaveLength(8))
  },
}

export const PausedMembersItemReports: Story = {
  play: async ({ args, canvasElement }) => {
    const menu = within(await openSettings(canvasElement))
    await userEvent.click(
      menu.getByRole('menuitemcheckbox', { name: 'Mostrar membros pausados' }),
    )
    await expect(args.onShowPausedChange).toHaveBeenCalledWith(true)
    await expect(rowsOf(canvasElement)).toHaveLength(8)
  },
}

export const SavePreferenceReportsTheCurrentSettings: Story = {
  play: async ({ args, canvasElement }) => {
    await openSubmenu(canvasElement, 'Propriedades exibidas')
    await userEvent.click(
      await screen.findByRole('menuitemcheckbox', { name: 'Atividade' }),
    )
    await closeMenus()
    const menu = within(await openSettings(canvasElement))
    await userEvent.click(
      menu.getByRole('menuitem', { name: 'Salvar preferência' }),
    )
    await expect(args.onSave).toHaveBeenCalledWith({
      columnVisibility: {
        activity: false,
        joined: true,
        lastSeen: true,
        location: false,
        priority: false,
        rating: true,
        role: true,
        team: true,
      },
      density: 'tall',
      showPaused: false,
      sort: { direction: 'asc', key: 'member' },
    })
  },
}

export const SettingsItemsNeedTheirCallbacks: Story = {
  args: { savePreference: false, showPausedSwitch: false },
  play: async ({ canvasElement }) => {
    const menu = within(await openSettings(canvasElement))
    await expect(
      menu.queryByRole('menuitem', { name: 'Salvar preferência' }),
    ).toBeNull()
    await expect(
      menu.queryByRole('menuitemcheckbox', {
        name: 'Mostrar membros pausados',
      }),
    ).toBeNull()
  },
}

export const PageSizeChangesTheRowsPerPage: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(
      canvas.getByRole('combobox', { name: 'Linhas por página' }),
    )
    await userEvent.click(await screen.findByRole('option', { name: '12' }))
    await waitFor(() => expect(rowsOf(canvasElement)).toHaveLength(12))
    await expect(canvas.getByText('1–12 de 12')).toBeVisible()
  },
}

export const TheConsumerControlsSortAndVisibility: Story = {
  render: () => (
    <Table2
      columnVisibility={{ location: true, priority: false, role: false }}
      members={members}
      sort={{ direction: 'desc', key: 'joined' }}
    />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(rowsOf(canvasElement)[0]).toHaveTextContent('Karina Nogueira')
    await expect(
      canvas.getByRole('columnheader', { name: /Local/ }),
    ).toBeVisible()
    await expect(
      canvas.queryByRole('columnheader', { name: /Papel/ }),
    ).toBeNull()
  },
}

export const LocaleFormatsTheRating: Story = {
  args: { locale: 'en-US' },
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByText('Avaliação 4.9 de 5'),
    ).toBeInTheDocument()
  },
}

export const LabelsOverrideTexts: Story = {
  render: () => (
    <Table2
      labels={{
        columns: { member: 'Pessoa' },
        settings: 'Ajustes',
        title: 'Equipe',
      }}
      members={members}
    />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByRole('heading', { name: 'Equipe' })).toBeVisible()
    await expect(
      canvas.getByRole('columnheader', { name: /Pessoa/ }),
    ).toBeVisible()
    await expect(canvas.getByRole('button', { name: 'Ajustes' })).toBeVisible()
    await expect(
      canvas.getByRole('columnheader', { name: /Papel/ }),
    ).toBeVisible()
  },
}

export const PendingShowsSkeleton: Story = {
  render: () => <Table2 members={members} pending />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByLabelText('Carregando membros')).toHaveAttribute(
      'aria-busy',
      'true',
    )
    await expect(canvas.getByRole('heading', { name: 'Membros' })).toBeVisible()
    await expect(canvas.getAllByRole('heading')).toHaveLength(1)
    await expect(
      canvas.queryByRole('button', { name: 'Configurações' }),
    ).toBeNull()
    await expect(canvas.queryByRole('table')).toBeNull()
    await expect(canvas.queryByRole('alert')).toBeNull()
  },
}

export const ErrorRetryCallsOnRetry: Story = {
  render: () => <Table2 error members={members} onRetry={retry} />,
  play: async ({ canvasElement }) => {
    retry.mockClear()
    const canvas = within(canvasElement)
    await expect(
      canvas.getByText('Não foi possível carregar os membros'),
    ).toBeVisible()
    await expect(canvas.queryByRole('table')).toBeNull()
    await expect(canvas.getByRole('heading', { name: 'Membros' })).toBeVisible()
    await expect(
      canvas.queryByRole('button', { name: 'Configurações' }),
    ).toBeNull()
    await userEvent.click(
      canvas.getByRole('button', { name: 'Tentar novamente' }),
    )
    await expect(retry).toHaveBeenCalledOnce()
  },
}

export const ErrorWithoutOnRetryHasNoButton: Story = {
  render: () => <Table2 error members={members} />,
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).queryByRole('button', { name: 'Tentar novamente' }),
    ).toBeNull()
  },
}

export const PendingWinsOverError: Story = {
  render: () => <Table2 error members={members} pending />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByLabelText('Carregando membros')).toBeVisible()
    await expect(
      canvas.queryByText('Não foi possível carregar os membros'),
    ).toBeNull()
  },
}

export const ErrorWinsOverEmpty: Story = {
  render: () => <Table2 error members={[]} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(
      canvas.getByText('Não foi possível carregar os membros'),
    ).toBeVisible()
    await expect(canvas.queryByText('Nenhum membro para exibir.')).toBeNull()
  },
}
