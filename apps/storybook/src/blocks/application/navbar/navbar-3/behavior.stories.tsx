import type { Meta, StoryObj } from '@storybook/react-vite'
import { Navbar3 } from '@tc96/ui/blocks/application/navbar/navbar-3'
import { expect, fn, screen, userEvent, waitFor, within } from 'storybook/test'
import {
  notifications,
  routes,
  user,
  userActions,
} from '../fixtures/navbar-3.ts'
import {
  type Navbar3Controls,
  navbar3ControlArgs,
} from './navbar-3-controls.ts'
import { ComposedNavbar3 } from './navbar-3-layouts.tsx'

const meta = {
  args: navbar3ControlArgs,
  parameters: { layout: 'fullscreen' },
  render: (args) => <ComposedNavbar3 {...args} />,
  tags: ['!autodocs'],
  title: 'Blocks/Application/Navbar/Navbar3/Behavior',
} satisfies Meta<Navbar3Controls>

export default meta

type Story = StoryObj<typeof meta>

const closeOverlay = async (role: 'dialog' | 'menu') => {
  await userEvent.keyboard('{Escape}')
  await waitFor(() => expect(screen.queryByRole(role)).toBeNull())
}

export const SearchTriggerOpensTheCommandDialog: Story = {
  play: async ({ canvasElement }) => {
    await userEvent.click(
      within(canvasElement).getByRole('button', { name: 'Buscar' }),
    )
    await waitFor(() => expect(screen.getByRole('dialog')).toBeVisible())
    await expect(
      screen.getByRole('option', { name: 'Pedidos' }),
    ).toBeInTheDocument()
    await closeOverlay('dialog')
  },
}

export const CommandKOpensTheCommandDialog: Story = {
  play: async () => {
    await userEvent.keyboard('{Control>}k{/Control}')
    await waitFor(() => expect(screen.getByRole('dialog')).toBeVisible())
    await closeOverlay('dialog')
  },
}

const onNavigate = fn()

export const PickingARouteCallsOnNavigateAndCloses: Story = {
  render: () => (
    <Navbar3
      notifications={notifications}
      onNavigate={onNavigate}
      routes={routes}
      user={user}
    />
  ),
  play: async ({ canvasElement }) => {
    onNavigate.mockClear()
    await userEvent.click(
      within(canvasElement).getByRole('button', { name: 'Buscar' }),
    )
    await userEvent.click(await screen.findByRole('option', { name: 'Equipe' }))
    await expect(onNavigate).toHaveBeenCalledWith('/configuracoes/equipe')
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull())
  },
}

export const TypingFiltersTheRoutesAndShowsTheEmptyState: Story = {
  play: async ({ canvasElement }) => {
    await userEvent.click(
      within(canvasElement).getByRole('button', { name: 'Buscar' }),
    )
    await userEvent.type(await screen.findByRole('combobox'), 'zzzz')
    await expect(
      await screen.findByText('Nenhum resultado encontrado.'),
    ).toBeVisible()
    await closeOverlay('dialog')
  },
}

export const BadgeCountsTheUnreadNotifications: Story = {
  play: async ({ canvasElement }) => {
    const trigger = within(canvasElement).getByRole('button', {
      name: 'Notificações, 2 não lidas',
    })
    await expect(trigger).toBeVisible()
    await expect(within(trigger).getByText('2')).toBeInTheDocument()
  },
}

const onNotificationsOpenChange = fn()
const onNotificationSelect = fn()

export const NotificationsPopoverListsTheItems: Story = {
  render: () => (
    <Navbar3
      notifications={notifications}
      onNotificationSelect={onNotificationSelect}
      onNotificationsOpenChange={onNotificationsOpenChange}
      routes={routes}
      user={user}
    />
  ),
  play: async ({ canvasElement }) => {
    onNotificationsOpenChange.mockClear()
    onNotificationSelect.mockClear()
    await userEvent.click(
      within(canvasElement).getByRole('button', { name: /Notificações/ }),
    )
    await waitFor(() =>
      expect(screen.getByText('Pedido enviado')).toBeVisible(),
    )
    await expect(onNotificationsOpenChange).toHaveBeenCalledWith(
      true,
      expect.anything(),
    )
    await userEvent.click(screen.getByRole('button', { name: /Nova menção/ }))
    await expect(onNotificationSelect).toHaveBeenCalledWith('n2')
    await userEvent.keyboard('{Escape}')
    await waitFor(() => expect(screen.queryByText('Pedido enviado')).toBeNull())
  },
}

export const NoNotificationsShowsTheEmptyText: Story = {
  args: { notificationCount: 0 },
  play: async ({ canvasElement }) => {
    await userEvent.click(
      within(canvasElement).getByRole('button', { name: 'Notificações' }),
    )
    await waitFor(() =>
      expect(
        screen.getByText('Nenhuma notificação por enquanto.'),
      ).toBeVisible(),
    )
    await userEvent.keyboard('{Escape}')
    await waitFor(() =>
      expect(
        screen.queryByText('Nenhuma notificação por enquanto.'),
      ).toBeNull(),
    )
  },
}

const onUserAction = fn()

export const UserMenuCallsOnUserActionWithTheId: Story = {
  render: () => (
    <Navbar3
      notifications={[]}
      onUserAction={onUserAction}
      routes={routes}
      user={user}
      userActions={userActions}
    />
  ),
  play: async ({ canvasElement }) => {
    onUserAction.mockClear()
    await userEvent.click(
      within(canvasElement).getByRole('button', { name: 'Conta' }),
    )
    await waitFor(() => expect(screen.getByText('Gabriel Melo')).toBeVisible())
    await userEvent.click(await screen.findByRole('menuitem', { name: 'Sair' }))
    await expect(onUserAction).toHaveBeenCalledWith('sign-out')
    await waitFor(() => expect(screen.queryByRole('menu')).toBeNull())
  },
}

export const WithoutUserActionsTheMenuListsOnlyTheUser: Story = {
  args: { hasUserActions: false },
  play: async ({ canvasElement }) => {
    await userEvent.click(
      within(canvasElement).getByRole('button', { name: 'Conta' }),
    )
    await waitFor(() =>
      expect(screen.getByText('gabriel@acme.com.br')).toBeVisible(),
    )
    await expect(screen.queryAllByRole('menuitem')).toHaveLength(0)
    await closeOverlay('menu')
  },
}

export const LabelsOverrideTexts: Story = {
  render: () => (
    <Navbar3
      labels={{ account: 'Minha conta', search: 'Procurar' }}
      notifications={[]}
      routes={routes}
      user={user}
    />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByRole('button', { name: 'Procurar' })).toBeVisible()
    await expect(
      canvas.getByRole('button', { name: 'Minha conta' }),
    ).toBeVisible()
  },
}
