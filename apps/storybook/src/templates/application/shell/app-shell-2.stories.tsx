import type { Meta, StoryObj } from '@storybook/react-vite'
import { AppShell2 } from '@tc96/templates/application/shell/app-shell-2'
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
// npx @tc96/parttens add app-shell-2
import { AppShell2 } from '@acme/templates/application/shell/app-shell-2'
import { Link, useNavigate } from '@tanstack/react-router'

const navigate = useNavigate()

<AppShell2
  breadcrumbs={breadcrumbs}
  navigation={navigation}
  onNavigate={(href) => navigate({ to: href })}
  onWorkspaceChange={switchWorkspace}
  renderLink={(href) => <Link to={href} />}
  user={user}
  workspaceId={workspaceId}
  workspaces={workspaces}
>
  <Outlet />
</AppShell2>
`

const docs = {
  api: [
    {
      description:
        'Root component. Same props as `AppShell1`, on a floating COSS `Sidebar` (`variant="floating"`, `collapsible="icon"`), plus a search entry under the workspace switcher.',
      name: 'AppShell2',
    },
    {
      description:
        'The search entry opens the COSS `CommandDialog` from its button or with ⌘K / Ctrl+K anywhere on the page. It lists every `href` of `navigation`, grouped by group label, sub items as `Parent / Child`, and filters as the user types.',
      name: 'Search',
    },
    {
      description:
        '`(href: string) => void`. Called when a route is picked in the search, after the dialog closes. The links of the sidebar still go through `renderLink`; the search needs a callback because it navigates from code.',
      name: 'onNavigate',
    },
    {
      description:
        '`navigation`, `workspaces`, `user`, `breadcrumbs`, `actions`, `renderLink` and `labels` work as in `AppShell1`. The search texts are `labels.search`, `searchPlaceholder`, `searchEmpty`, `searchNavigate`, `searchOpen` and `searchClose`.',
      name: 'Shared props',
    },
  ],
  description: {
    component:
      'An application shell with a floating sidebar and a ⌘K page search: workspace switcher and search at the top, grouped navigation, account menu at the foot, and a header with the breadcrumb. Install it with `npx @tc96/parttens add app-shell-2`.',
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
    onNavigate: fn(),
    onSignOut: fn(),
    onWorkspaceChange: fn(),
    user: shellUser,
    userActions: shellUserActions,
    workspaceId: 'risine',
    workspaces: shellWorkspaces,
  },
  component: AppShell2,
  parameters: { docs, layout: 'fullscreen' },
  title: 'Templates/Application/Shell/AppShell2',
} satisfies Meta<typeof AppShell2>

export default meta

type Story = StoryObj<typeof meta>

const screen = () => within(document.body)

export const Default: Story = {
  play: async ({ canvasElement }) => {
    await expect(
      canvasElement.querySelector('[data-slot="sidebar"]'),
    ).toHaveAttribute('data-variant', 'floating')
    await expect(
      within(canvasElement).getByRole('button', { name: /Buscar/ }),
    ).toBeVisible()
  },
}

export const Collapsed: Story = {
  args: { defaultOpen: false },
}

export const SearchPages: Story = {
  play: async ({ args, canvasElement }) => {
    await userEvent.click(
      within(canvasElement).getByRole('button', { name: /Buscar/ }),
    )
    const dialog = await screen().findByRole('dialog', { name: 'Buscar' })
    await userEvent.type(
      within(dialog).getByRole('combobox', { name: 'Buscar' }),
      'Prev',
    )
    await userEvent.click(
      await within(dialog).findByRole('option', {
        name: 'Pipeline / Previsão',
      }),
    )
    await expect(args.onNavigate).toHaveBeenCalledWith('/forecast')
    await waitFor(() => expect(screen().queryByRole('dialog')).toBeNull())
  },
  tags: ['!autodocs'],
}

export const SearchShortcut: Story = {
  play: async () => {
    await userEvent.keyboard('{Control>}k{/Control}')
    const dialog = await screen().findByRole('dialog', { name: 'Buscar' })
    await waitFor(() =>
      expect(
        within(dialog).getByRole('option', { name: 'Painel' }),
      ).toBeVisible(),
    )
    await userEvent.keyboard('{Escape}')
    await waitFor(() => expect(screen().queryByRole('dialog')).toBeNull())
  },
  tags: ['!autodocs'],
}
