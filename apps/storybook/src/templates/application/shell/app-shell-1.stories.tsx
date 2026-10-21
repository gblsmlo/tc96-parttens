import type { Meta, StoryObj } from '@storybook/react-vite'
import { AppShell1 } from '@tc96/templates/application/shell/app-shell-1'
import { expect, fn, userEvent, waitFor, within } from 'storybook/test'
import type { UsageDocsParameters } from '../../../../.storybook/docs-page.tsx'
import {
  ShellHeaderActions,
  ShellPagePlaceholder,
  shellBreadcrumbs,
  shellNavigation,
  shellUser,
  shellUserActions,
  shellWorkspaces,
} from './fixtures/shell-data'

const usage = `
// npx @tc96/parttens add app-shell-1
import { AppShell1 } from '@acme/templates/application/shell/app-shell-1'
import { Link } from '@tanstack/react-router'

<AppShell1
  breadcrumbs={[{ href: '/', label: 'Risine CRM' }, { label: 'Painel' }]}
  defaultOpen={sidebarCookie !== 'false'}
  navigation={navigation}
  onSignOut={signOut}
  onThemeChange={setTheme}
  onWorkspaceChange={switchWorkspace}
  renderLink={(href) => <Link to={href} />}
  theme={theme}
  user={user}
  workspaceId={workspaceId}
  workspaces={workspaces}
>
  <Outlet />
</AppShell1>
`

const docs = {
  api: [
    {
      description:
        'Root component. The COSS `SidebarProvider` with a `Sidebar` that collapses to icons (`collapsible="icon"`) and a `SidebarRail`, beside a `SidebarInset` that holds the header and `children`. Open state is uncontrolled through `defaultOpen` or controlled through `open` and `onOpenChange`. COSS writes the `sidebar_state` cookie on every toggle; reading it to set `defaultOpen` on the next request is up to the app.',
      name: 'AppShell1',
    },
    {
      description:
        '`ShellNavGroup[]`. Each group renders a `SidebarGroup` with its label, inside one `nav` named by `labels.navigation`. An item with `items` opens a `Collapsible` sub-list and starts open when it or a child is `active`; a leaf links to `href`, shows `badge` and, when it has `actions`, a menu named by `labels.itemActions(title)` instead of the badge. `active` sets `aria-current="page"`.',
      name: 'navigation',
    },
    {
      description:
        '`workspaces`, `workspaceId` and `onWorkspaceChange` drive the switcher in the sidebar header: a COSS `Menu` with one radio item per workspace. `logo` is a node; without it the frame shows the first letter of `name`.',
      name: 'workspaces',
    },
    {
      description:
        '`user` (`name`, `email`, optional `avatarUrl`) fills the account menu in the footer. `userActions` adds menu items, `theme` with `onThemeChange` adds a Light, Dark and System radio group, and `onSignOut` adds Sair. The template never applies a theme itself.',
      name: 'user',
    },
    {
      description:
        '`breadcrumbs` renders the COSS `Breadcrumb` after the sidebar trigger; the last item is the current page and the others collapse below `md`. `actions` sits at the end of the header.',
      name: 'breadcrumbs',
    },
    {
      description:
        '`(href) => ReactElement`. Every link (navigation, sub items, breadcrumb) renders through it, so the router of the app owns navigation; the default is a plain `a`. The element receives the class names, `aria-current` and the text through the Base UI `render` prop.',
      name: 'renderLink',
    },
    {
      description:
        'Partial `ShellLabels`. Every visible or accessible text the template owns, with pt-BR defaults.',
      name: 'labels',
    },
  ],
  description: {
    component:
      'An application shell whose sidebar collapses to an icon rail: workspace switcher, grouped navigation with nested items, counters and pinned items with their own menu, an account menu, and a header with the sidebar trigger and the breadcrumb. Install it with `npx @tc96/parttens add app-shell-1`.',
  },
  story: { height: '42rem', inline: false },
  usage,
} satisfies UsageDocsParameters & Record<string, unknown>

const meta = {
  args: {
    actions: <ShellHeaderActions />,
    breadcrumbs: shellBreadcrumbs,
    children: <ShellPagePlaceholder />,
    navigation: shellNavigation,
    onSignOut: fn(),
    onThemeChange: fn(),
    onWorkspaceChange: fn(),
    theme: 'system',
    user: shellUser,
    userActions: shellUserActions,
    workspaceId: 'risine',
    workspaces: shellWorkspaces,
  },
  component: AppShell1,
  parameters: { docs, layout: 'fullscreen' },
  title: 'Templates/Application/Shell/AppShell1',
} satisfies Meta<typeof AppShell1>

export default meta

type Story = StoryObj<typeof meta>

const interaction = ['!autodocs']

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const navigation = canvas.getByRole('navigation', {
      name: 'Navegação principal',
    })
    await expect(
      within(navigation).getByRole('link', { name: 'Painel' }),
    ).toHaveAttribute('aria-current', 'page')
    await expect(
      within(navigation).getByRole('list', { name: 'Fixados' }),
    ).toBeVisible()
    const breadcrumb = canvas.getByRole('navigation', {
      name: 'Trilha de navegação',
    })
    await expect(within(breadcrumb).getByText('Painel')).toHaveAttribute(
      'aria-current',
      'page',
    )
  },
}

export const Collapsed: Story = {
  args: { defaultOpen: false },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const sidebar = canvasElement.querySelector('[data-slot="sidebar"]')
    await expect(sidebar).toHaveAttribute('data-state', 'collapsed')
    await expect(canvas.getByRole('link', { name: 'Painel' })).toBeVisible()
    await userEvent.click(
      canvas.getByRole('button', { name: 'Alternar barra lateral' }),
    )
    await expect(sidebar).toHaveAttribute('data-state', 'expanded')
  },
}

export const Minimal: Story = {
  args: {
    actions: undefined,
    breadcrumbs: undefined,
    onThemeChange: undefined,
    theme: undefined,
    userActions: undefined,
  },
  parameters: {
    docs: {
      description: {
        story:
          'Only the required props: no breadcrumb, header actions, theme choice or extra account items.',
      },
    },
  },
}

export const Mobile: Story = {
  globals: { viewport: { isRotated: false, value: 'mobile2' } },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(
      canvas.queryByRole('navigation', { name: 'Navegação principal' }),
    ).toBeNull()
    await userEvent.click(
      canvas.getByRole('button', { name: 'Alternar barra lateral' }),
    )
    const sheet = await within(document.body).findByRole('dialog')
    await waitFor(() =>
      expect(
        within(sheet).getByRole('navigation', { name: 'Navegação principal' }),
      ).toBeVisible(),
    )
  },
}

export const SwitchWorkspace: Story = {
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getByRole('button', { name: /Risine CRM/ }))
    const menu = await within(document.body).findByRole('menu')
    await userEvent.click(
      within(menu).getByRole('menuitemradio', { name: 'Acme Vendas' }),
    )
    await expect(args.onWorkspaceChange).toHaveBeenCalledWith('acme')
    await waitFor(() =>
      expect(within(document.body).queryByRole('menu')).toBeNull(),
    )
  },
  tags: interaction,
}

export const AccountMenu: Story = {
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    const trigger = canvas.getByRole('button', { name: /Marina Costa/ })
    await userEvent.click(trigger)
    const menu = await within(document.body).findByRole('menu')
    await userEvent.click(
      within(menu).getByRole('menuitemradio', { name: 'Escuro' }),
    )
    await expect(args.onThemeChange).toHaveBeenCalledWith('dark')
    await userEvent.click(within(menu).getByRole('menuitem', { name: 'Sair' }))
    await expect(args.onSignOut).toHaveBeenCalledOnce()
  },
  tags: interaction,
}

export const PinnedItemActions: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(
      canvas.getByRole('button', { name: 'Ações de Leads quentes' }),
    )
    const menu = await within(document.body).findByRole('menu')
    await expect(
      within(menu).getByRole('menuitem', { name: 'Remover dos fixados' }),
    ).toBeVisible()
  },
  tags: interaction,
}
