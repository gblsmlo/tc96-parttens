import type { Meta, StoryObj } from '@storybook/react-vite'
import { Navbar8 } from '@tc96/ui/blocks/application/navbar/navbar-8'
import { expect, screen, userEvent, waitFor, within } from 'storybook/test'
import { categories, notifications, user } from '../fixtures/navbar-8.ts'
import {
  type Navbar8Controls,
  navbar8ControlArgs,
} from './navbar-8-controls.ts'
import {
  BrandMark,
  ComposedNavbar8,
  navbar8Handlers,
  UserMenuItems,
} from './navbar-8-layouts.tsx'

const meta = {
  args: navbar8ControlArgs,
  beforeEach: () => {
    for (const handler of Object.values(navbar8Handlers)) handler.mockClear()
  },
  parameters: { layout: 'fullscreen' },
  render: (args) => <ComposedNavbar8 {...args} />,
  tags: ['!autodocs'],
  title: 'Blocks/Application/Navbar/Navbar8/Behavior',
} satisfies Meta<Navbar8Controls>

export default meta

type Story = StoryObj<typeof meta>

export const HeaderIsABannerWithABorder: Story = {
  play: async ({ canvasElement }) => {
    const header = within(canvasElement).getByRole('banner')
    await expect(header).toHaveClass('border-b', 'w-full')
    await expect(within(header).getByText('Orbit Agentes')).toBeVisible()
  },
}

export const CategoriesAreARadioGroupWithTheCheckedPill: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const group = canvas.getByRole('radiogroup', {
      name: 'Categorias de agentes',
    })
    await expect(within(group).getAllByRole('radio')).toHaveLength(
      categories.length,
    )
    await expect(canvas.getByRole('radio', { name: 'Todos' })).toBeChecked()
    await expect(
      canvas.getByRole('radio', { name: 'Código' }),
    ).not.toBeChecked()
  },
}

export const ClickingACategoryCallsOnCategoryChange: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getByRole('radio', { name: 'Pesquisa' }))
    await expect(navbar8Handlers.onCategoryChange).toHaveBeenCalledWith(
      'research',
    )
    await expect(canvas.getByRole('radio', { name: 'Pesquisa' })).toBeChecked()
  },
}

export const ArrowKeysMoveBetweenCategories: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.tab()
    await expect(canvas.getByRole('radio', { name: 'Todos' })).toHaveFocus()
    await userEvent.keyboard('{ArrowRight}')
    await expect(navbar8Handlers.onCategoryChange).toHaveBeenCalledWith('code')
    await expect(canvas.getByRole('radio', { name: 'Código' })).toBeChecked()
  },
}

export const WithoutCategoriesNoPillsRender: Story = {
  args: { showCategories: false },
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).queryByRole('radiogroup')).toBeNull()
  },
}

export const DeployCallsOnDeploy: Story = {
  play: async ({ canvasElement }) => {
    await userEvent.click(
      within(canvasElement).getByRole('button', { name: 'Implantar' }),
    )
    await expect(navbar8Handlers.onDeploy).toHaveBeenCalledTimes(1)
  },
}

export const PendingDisablesDeploy: Story = {
  args: { pending: true },
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByRole('button', { name: 'Implantar' }),
    ).toBeDisabled()
  },
}

export const WithoutOnDeployNoButtonRenders: Story = {
  args: { showDeploy: false },
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).queryByRole('button', { name: 'Implantar' }),
    ).toBeNull()
  },
}

export const BellNameCarriesTheUnreadCount: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(
      canvas.getByRole('button', { name: 'Notificações, 3 não lidas' }),
    ).toBeVisible()
    await expect(
      canvasElement.querySelector('[data-slot="navbar-unread-dot"]'),
    ).not.toBeNull()
  },
}

export const SingleUnreadUsesTheSingularName: Story = {
  args: { unreadCount: 1 },
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByRole('button', {
        name: 'Notificações, 1 não lida',
      }),
    ).toBeVisible()
  },
}

export const NoUnreadHidesTheDot: Story = {
  args: { unreadCount: 0 },
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByRole('button', { name: 'Notificações' }),
    ).toBeVisible()
    await expect(
      canvasElement.querySelector('[data-slot="navbar-unread-dot"]'),
    ).toBeNull()
  },
}

export const BellOpensAFeedWithTheKeyboard: Story = {
  play: async ({ canvasElement }) => {
    const bell = within(canvasElement).getByRole('button', {
      name: 'Notificações, 3 não lidas',
    })
    bell.focus()
    await userEvent.keyboard('{Enter}')
    await expect(await screen.findByRole('dialog')).toHaveTextContent(
      'Implantação concluída',
    )
    await userEvent.keyboard('{Escape}')
    await waitFor(() =>
      expect(screen.queryByText('Implantação concluída')).toBeNull(),
    )
  },
}

export const FeedListsEveryNotificationAndFlagsUnreadOnes: Story = {
  args: { unreadCount: 1 },
  play: async ({ canvasElement }) => {
    await userEvent.click(
      within(canvasElement).getByRole('button', {
        name: 'Notificações, 1 não lida',
      }),
    )
    const items = await screen.findAllByRole('listitem')
    await expect(items).toHaveLength(notifications.length)
    await expect(items[0]).toHaveTextContent('não lida')
    await expect(items[1]).not.toHaveTextContent('não lida')
  },
}

export const SelectingANotificationCallsItAndClosesTheFeed: Story = {
  play: async ({ canvasElement }) => {
    await userEvent.click(
      within(canvasElement).getByRole('button', {
        name: 'Notificações, 3 não lidas',
      }),
    )
    await userEvent.click(
      await screen.findByRole('button', { name: /Nova avaliação/ }),
    )
    await expect(navbar8Handlers.onNotificationSelect).toHaveBeenCalledWith(
      'n2',
    )
    await waitFor(() => expect(screen.queryByText('Nova avaliação')).toBeNull())
  },
}

export const EmptyFeedShowsTheEmptyText: Story = {
  render: () => (
    <Navbar8
      name="Orbit Agentes"
      notifications={[]}
      onNotificationSelect={() => undefined}
    />
  ),
  play: async ({ canvasElement }) => {
    await userEvent.click(
      within(canvasElement).getByRole('button', { name: 'Notificações' }),
    )
    await waitFor(async () =>
      expect(
        await screen.findByText('Nenhuma notificação por enquanto.'),
      ).toBeVisible(),
    )
  },
}

export const WithoutNotificationsNoBellRenders: Story = {
  args: { showNotifications: false },
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).queryByRole('button', { name: /Notificações/ }),
    ).toBeNull()
  },
}

export const UserMenuShowsTheUserAndItsItems: Story = {
  play: async ({ canvasElement }) => {
    await userEvent.click(
      within(canvasElement).getByRole('button', { name: 'Conta' }),
    )
    await expect(await screen.findByText('Gabriel Melo')).toBeVisible()
    await expect(screen.getByText('gabriel@orbit.com.br')).toBeVisible()
    await expect(await screen.findAllByRole('menuitem')).toHaveLength(3)
    await userEvent.keyboard('{Escape}')
    await waitFor(() => expect(screen.queryByRole('menu')).toBeNull())
  },
}

export const MenuItemRunsItsOwnHandler: Story = {
  play: async ({ canvasElement }) => {
    await userEvent.click(
      within(canvasElement).getByRole('button', { name: 'Conta' }),
    )
    await userEvent.click(
      await screen.findByRole('menuitem', { name: 'Configurações' }),
    )
    await expect(navbar8Handlers.onMenuItem).toHaveBeenCalledWith('settings')
    await waitFor(() => expect(screen.queryByRole('menu')).toBeNull())
  },
}

export const WithoutMenuTheUserMenuShowsOnlyTheUser: Story = {
  args: { showMenu: false },
  play: async ({ canvasElement }) => {
    await userEvent.click(
      within(canvasElement).getByRole('button', { name: 'Conta' }),
    )
    await expect(await screen.findByText('Gabriel Melo')).toBeVisible()
    await expect(screen.queryAllByRole('menuitem')).toHaveLength(0)
  },
}

export const WithoutUserNoAvatarMenuRenders: Story = {
  args: { showUser: false },
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).queryByRole('button', { name: 'Conta' }),
    ).toBeNull()
  },
}

export const HomeHrefTurnsTheBrandIntoALink: Story = {
  args: { showHomeLink: true },
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByRole('link', { name: 'Orbit Agentes' }),
    ).toHaveAttribute('href', '/agentes')
  },
}

export const WithoutHomeHrefTheBrandIsText: Story = {
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).queryByRole('link')).toBeNull()
  },
}

export const LabelsOverrideTexts: Story = {
  render: () => (
    <Navbar8
      categories={categories}
      category="all"
      labels={{
        account: 'Minha conta',
        categories: 'Tipos de agente',
        deploy: 'Publicar agente',
        notificationsTrigger: (unread) => `Avisos (${unread})`,
      }}
      logo={<BrandMark />}
      menu={<UserMenuItems />}
      name="Orbit Agentes"
      notifications={notifications}
      onCategoryChange={() => undefined}
      onDeploy={() => undefined}
      user={user}
    />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(
      canvas.getByRole('button', { name: 'Publicar agente' }),
    ).toBeVisible()
    await expect(
      canvas.getByRole('radiogroup', { name: 'Tipos de agente' }),
    ).toBeVisible()
    await expect(
      canvas.getByRole('button', { name: 'Avisos (4)' }),
    ).toBeVisible()
    await expect(
      canvas.getByRole('button', { name: 'Minha conta' }),
    ).toBeVisible()
  },
}
