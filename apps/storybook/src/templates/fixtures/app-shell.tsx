import type { Decorator } from '@storybook/react-vite'
import {
  AppShell1,
  type ShellBreadcrumbItem,
  type ShellNavGroup,
} from '@tc96/templates/application/shell/app-shell-1'
import {
  shellNavigation,
  shellUser,
  shellUserActions,
  shellWorkspaces,
} from '../../application/shell/fixtures/shell-data'

const navigationFor = (href: string): ShellNavGroup[] =>
  shellNavigation.map((group) => ({
    ...group,
    items: group.items.map((item) => ({
      ...item,
      active: item.href === href,
      items: item.items?.map((sub) => ({ ...sub, active: sub.href === href })),
    })),
  }))

export interface AppShellPage {
  breadcrumbs: ShellBreadcrumbItem[]
  href: string
}

export const withAppShell =
  ({ breadcrumbs, href }: AppShellPage): Decorator =>
  (Story) => (
    <AppShell1
      breadcrumbs={[{ href: '/', label: 'Risine CRM' }, ...breadcrumbs]}
      navigation={navigationFor(href)}
      user={shellUser}
      userActions={shellUserActions}
      workspaceId="risine"
      workspaces={shellWorkspaces}
    >
      <Story />
    </AppShell1>
  )

export const appShellDocs = { height: '42rem', inline: false }
