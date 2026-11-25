import type { Meta, StoryObj } from '@storybook/react-vite'
import { AppShell1 } from '@tc96/ui/blocks/application/shell/app-shell-1'
import { fn } from 'storybook/test'
import type { UsageDocsParameters } from '../../../../.storybook/docs-page.tsx'
import {
  ProfileSettingsPage,
  ShellHeaderActions,
  ShellPagePlaceholder,
  settingsBreadcrumbs,
  shellBreadcrumbs,
  shellNavigation,
  shellNavigationWithSubItemBadges,
  shellSettings,
  shellUser,
  shellUserActions,
  shellWorkspaces,
} from './fixtures/shell-data'

const usage = `
// npx @tc96/cli add app-shell-1
import { AppShell1 } from '@acme/blocks/application/shell/app-shell-1'
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
        '`ShellNavGroup[]`. Each group renders a `SidebarGroup` with its label, inside one `nav` named by `labels.navigation`. An item with `items` opens a `Collapsible` sub-list and starts open when it or a child is `active`; a leaf links to `href`, shows `badge` and, when it has `actions`, a menu named by `labels.itemActions(title)` instead of the badge. A sub item shows its `badge` at the end of its row. `active` sets `aria-current="page"`.',
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
        '`ShellSettings`: `navigation` plus exactly one of `backHref` (a link through `renderLink`) or `onBack` (a button). When set, the sidebar becomes the settings level: Voltar ao app at the top and the settings menu in a `nav` named by `labels.settingsNavigation`, in place of the workspace switcher, the navigation and the account menu. The header keeps the breadcrumb and `actions`.',
      name: 'settings',
    },
    {
      description:
        'Partial `ShellLabels`. Every visible or accessible text the template owns, with pt-BR defaults.',
      name: 'labels',
    },
  ],
  description: {
    component:
      'An application shell whose sidebar collapses to an icon rail: workspace switcher, grouped navigation with nested items, counters and pinned items with their own menu, an account menu, and a header with the sidebar trigger and the breadcrumb. Install it with `npx @tc96/cli add app-shell-1`.',
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
  title: 'Blocks/Application/Shell/AppShell1',
} satisfies Meta<typeof AppShell1>

export default meta

type Story = StoryObj<typeof meta>

const interaction = ['!autodocs']

export const Default: Story = {}

export const Collapsed: Story = {
  args: { defaultOpen: false },
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
}

export const SubItemBadge: Story = {
  args: { navigation: shellNavigationWithSubItemBadges },
  parameters: {
    docs: {
      description: {
        story:
          'A sub item takes `badge` too, at the end of its row; the active one keeps the badge on the accent background.',
      },
    },
  },
}

export const SwitchWorkspace: Story = {
  tags: interaction,
}

export const AccountMenu: Story = {
  tags: interaction,
}

export const PinnedItemActions: Story = {
  tags: interaction,
}

export const Settings: Story = {
  args: {
    breadcrumbs: settingsBreadcrumbs,
    children: <ProfileSettingsPage />,
    settings: shellSettings,
  },
  parameters: {
    docs: {
      description: {
        story:
          'With `settings`, the sidebar becomes the settings level: Voltar ao app at the top and the settings menu below it.',
      },
    },
  },
}

export const SettingsBackButton: Story = {
  args: {
    breadcrumbs: settingsBreadcrumbs,
    children: <ProfileSettingsPage />,
    settings: { navigation: shellSettings.navigation, onBack: fn() },
  },
  tags: interaction,
}
