import type { Meta, StoryObj } from '@storybook/react-vite'
import { Navbar9 } from '@tc96/ui/blocks/application/navbar/navbar-9'
import { expect, screen, userEvent, waitFor, within } from 'storybook/test'
import { branches, path } from '../fixtures/navbar-9.ts'
import {
  type Navbar9Controls,
  navbar9ControlArgs,
} from './navbar-9-controls.ts'
import { ComposedNavbar9, navbar9Handlers } from './navbar-9-layouts.tsx'

const meta = {
  args: navbar9ControlArgs,
  beforeEach: () => {
    for (const handler of Object.values(navbar9Handlers)) handler.mockClear()
  },
  parameters: { layout: 'fullscreen' },
  render: (args) => <ComposedNavbar9 {...args} />,
  tags: ['!autodocs'],
  title: 'Blocks/Application/Navbar/Navbar9/Behavior',
} satisfies Meta<Navbar9Controls>

export default meta

type Story = StoryObj<typeof meta>

const triggerName = 'Trocar de branch, atual: main'

export const HeaderIsABannerWithABorder: Story = {
  play: async ({ canvasElement }) => {
    const header = within(canvasElement).getByRole('banner')
    await expect(header).toHaveClass('border-b', 'w-full')
    await expect(within(header).getByText('Código Vivo')).toBeVisible()
  },
}

export const PathEndsOnTheRepository: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(
      canvas.getByRole('navigation', { name: 'Caminho do repositório' }),
    ).toBeVisible()
    await expect(
      canvas.getByRole('link', { name: 'oficina-aberta' }),
    ).toHaveAttribute('href', '/organizacoes/oficina-aberta')
    await expect(canvas.getByText('painel-de-entregas')).toHaveAttribute(
      'aria-current',
      'page',
    )
    await expect(
      canvas.queryByRole('link', { name: 'painel-de-entregas' }),
    ).toBeNull()
  },
}

export const ShareCallsOnShare: Story = {
  play: async ({ canvasElement }) => {
    await userEvent.click(
      within(canvasElement).getByRole('button', { name: 'Compartilhar' }),
    )
    await expect(navbar9Handlers.onShare).toHaveBeenCalledTimes(1)
  },
}

export const RunCallsOnRun: Story = {
  play: async ({ canvasElement }) => {
    await userEvent.click(
      within(canvasElement).getByRole('button', { name: 'Executar' }),
    )
    await expect(navbar9Handlers.onRun).toHaveBeenCalledTimes(1)
  },
}

export const RunningDisablesRunAndShowsPendingLabel: Story = {
  args: { running: true },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(
      canvas.getByRole('button', { name: 'Executando…' }),
    ).toBeDisabled()
    await expect(canvas.queryByRole('button', { name: 'Executar' })).toBeNull()
  },
}

export const TriggerShowsTheActiveBranch: Story = {
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByRole('button', { name: triggerName }),
    ).toHaveTextContent('main')
  },
}

export const MenuGroupsRefsByKindAndMarksTheDefault: Story = {
  play: async ({ canvasElement }) => {
    await userEvent.click(
      within(canvasElement).getByRole('button', { name: triggerName }),
    )
    await expect(await screen.findByText('Branches')).toBeVisible()
    await expect(screen.getByText('Tags')).toBeVisible()
    await expect(screen.getByText('Deploys')).toBeVisible()
    await expect(await screen.findAllByRole('menuitemradio')).toHaveLength(
      branches.length,
    )
    await expect(screen.getByText('Padrão')).toBeVisible()
    await expect(
      screen.getByRole('menuitemradio', { name: /main/ }),
    ).toHaveAttribute('aria-checked', 'true')
    await userEvent.keyboard('{Escape}')
    await waitFor(() => expect(screen.queryByRole('menu')).toBeNull())
  },
}

export const PickingARefCallsOnBranchChangeWithItsId: Story = {
  play: async ({ canvasElement }) => {
    await userEvent.click(
      within(canvasElement).getByRole('button', { name: triggerName }),
    )
    await userEvent.click(
      await screen.findByRole('menuitemradio', {
        name: /feat\/filtros-salvos/,
      }),
    )
    await expect(navbar9Handlers.onBranchChange).toHaveBeenCalledWith(
      'feat-filtros',
    )
    await waitFor(() => expect(screen.queryByRole('menu')).toBeNull())
  },
}

export const MenuIsOperableWithTheKeyboard: Story = {
  play: async ({ canvasElement }) => {
    const trigger = within(canvasElement).getByRole('button', {
      name: triggerName,
    })
    trigger.focus()
    await userEvent.keyboard('{Enter}')
    await screen.findByRole('menu')
    await waitFor(() =>
      expect(document.activeElement?.getAttribute('role')).toMatch(/^menuitem/),
    )
    await userEvent.keyboard('{ArrowDown}{Enter}')
    await waitFor(() =>
      expect(navbar9Handlers.onBranchChange).toHaveBeenCalledTimes(1),
    )
    await waitFor(() => expect(screen.queryByRole('menu')).toBeNull())
    await waitFor(() => expect(trigger).toHaveFocus())
  },
}

export const WithoutBranchesNoPickerRenders: Story = {
  args: { showBranches: false },
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).queryByRole('button', { name: /Trocar de branch/ }),
    ).toBeNull()
  },
}

export const WithoutCallbacksNoActionRenders: Story = {
  args: { showBranches: false, showRun: false, showShare: false },
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).queryAllByRole('button')).toHaveLength(0)
  },
}

export const LogoRendersBesideTheName: Story = {
  render: () => (
    <Navbar9
      logo={<span data-testid="mark">◆</span>}
      name="Código Vivo"
      path={path}
    />
  ),
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByTestId('mark')).toBeVisible()
  },
}

export const LabelsOverrideTexts: Story = {
  render: () => (
    <Navbar9
      branch="main"
      branches={branches}
      labels={{
        branchTrigger: (branch) => `Ref ativa: ${branch}`,
        defaultBadge: 'Principal',
        kinds: { branch: 'Ramos', deploy: 'Ambientes', tag: 'Versões' },
        path: 'Localização',
        run: 'Rodar',
        share: 'Convidar',
      }}
      name="Código Vivo"
      onBranchChange={() => undefined}
      onRun={() => undefined}
      onShare={() => undefined}
      path={path}
    />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByRole('button', { name: 'Rodar' })).toBeVisible()
    await expect(canvas.getByRole('button', { name: 'Convidar' })).toBeVisible()
    await expect(
      canvas.getByRole('navigation', { name: 'Localização' }),
    ).toBeVisible()
    await userEvent.click(
      canvas.getByRole('button', { name: 'Ref ativa: main' }),
    )
    await expect(await screen.findByText('Ramos')).toBeVisible()
    await expect(screen.getByText('Principal')).toBeVisible()
    await userEvent.keyboard('{Escape}')
    await waitFor(() => expect(screen.queryByRole('menu')).toBeNull())
  },
}
