import type { Meta, StoryObj } from '@storybook/react-vite'
import { AppShell3 } from '@tc96/templates/application/shell/app-shell-3'
import { expect, fn, userEvent, within } from 'storybook/test'
import type { UsageDocsParameters } from '../../../.storybook/docs-page.tsx'
import {
  ShellHeaderActions,
  ShellPagePlaceholder,
  shellBreadcrumbs,
  shellNavigation,
  shellNotifications,
  shellProjects,
  shellUsage,
  shellUser,
  shellUserActions,
  shellWorkspaces,
} from './fixtures/shell-data'

const usage = `
// npx @tc96/parttens add app-shell-3
import { AppShell3 } from '@acme/templates/application/shell/app-shell-3'

<AppShell3
  navigation={navigation}
  notifications={notifications}
  onMarkAllRead={markAllRead}
  onNotificationSelect={openNotification}
  projects={[{ href: '/projects/onboarding', progress: 0.72, title: 'Onboarding Acme' }]}
  usage={{
    label: 'Limite de gastos',
    max: 5000,
    value: 3200,
    valueLabel: 'R$ 3.200 de R$ 5.000',
  }}
  user={user}
  workspaceId={workspaceId}
  workspaces={workspaces}
>
  <Outlet />
</AppShell3>
`

const docs = {
  api: [
    {
      description:
        'Root component. Same props as `AppShell1`, on an inset COSS `Sidebar` (`variant="inset"`, `collapsible="icon"`): the page sits in a raised panel beside the sidebar.',
      name: 'AppShell3',
    },
    {
      description:
        '`ShellProject[]` (`title`, `href`, `progress` from 0 to 1, `active`). A second `nav` named by `labels.projects`, each project with the `ProgressRing` of the `widgets` pattern and its percentage. Installing the template brings `progress-ring.tsx` from `widgets` with it.',
      name: 'projects',
    },
    {
      description:
        '`ShellUsage` (`label`, `value`, `max`, `valueLabel`, optional `description` and `action`). A panel above the account menu with a COSS `Meter` named by `label`; `valueLabel` is the formatted amount and also the value text read by screen readers. Hidden while the sidebar is collapsed.',
      name: 'usage',
    },
    {
      description:
        '`ShellNotification[]` (`id`, `title`, `description`, `time`, `unread`). A bell button in the header, named by `labels.notificationsTrigger(unread)`, opens a COSS `Popover` with the list; `onNotificationSelect` receives the id and `onMarkAllRead` adds the button that clears the unread ones. The template keeps no read state.',
      name: 'notifications',
    },
  ],
  description: {
    component:
      'An application shell with an inset sidebar: grouped navigation, projects with progress rings, a usage panel and the account menu, and a header with the breadcrumb and a notifications popover. Install it with `npx @tc96/parttens add app-shell-3`.',
  },
  story: { height: '42rem', inline: false },
  usage,
} satisfies UsageDocsParameters & Record<string, unknown>

const meta = {
  args: {
    actions: <ShellHeaderActions />,
    breadcrumbs: shellBreadcrumbs,
    children: <ShellPagePlaceholder />,
    navigation: shellNavigation.slice(0, 1),
    notifications: shellNotifications,
    onMarkAllRead: fn(),
    onNotificationSelect: fn(),
    onSignOut: fn(),
    onWorkspaceChange: fn(),
    projects: shellProjects,
    usage: shellUsage,
    user: shellUser,
    userActions: shellUserActions,
    workspaceId: 'risine',
    workspaces: shellWorkspaces,
  },
  component: AppShell3,
  parameters: { docs, layout: 'fullscreen' },
  title: 'Application/Shell/AppShell3',
} satisfies Meta<typeof AppShell3>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(
      canvasElement.querySelector('[data-slot="sidebar"]'),
    ).toHaveAttribute('data-variant', 'inset')
    const projects = canvas.getByRole('navigation', { name: 'Projetos' })
    await expect(
      within(projects).getByRole('link', { name: 'Onboarding Acme' }),
    ).toBeVisible()
    await expect(
      canvas.getByRole('meter', { name: 'Limite de gastos' }),
    ).toHaveAttribute('aria-valuetext', 'R$ 3.200 de R$ 5.000')
  },
}

export const Collapsed: Story = {
  args: { defaultOpen: false },
}

export const WithoutExtras: Story = {
  args: { notifications: undefined, projects: undefined, usage: undefined },
  parameters: {
    docs: {
      description: {
        story:
          'Without projects, usage panel or notifications the shell is the inset variant of `AppShell1`.',
      },
    },
  },
}

export const Notifications: Story = {
  play: async ({ args, canvasElement }) => {
    await userEvent.click(
      within(canvasElement).getByRole('button', {
        name: 'Notificações, 2 não lidas',
      }),
    )
    const popover = await within(document.body).findByRole('dialog', {
      name: 'Notificações',
    })
    await userEvent.click(
      within(popover).getByRole('button', { name: /Nova menção/ }),
    )
    await expect(args.onNotificationSelect).toHaveBeenCalledWith('mention')
    await userEvent.click(
      within(popover).getByRole('button', { name: 'Marcar todas como lidas' }),
    )
    await expect(args.onMarkAllRead).toHaveBeenCalledOnce()
  },
  tags: ['!autodocs'],
}
