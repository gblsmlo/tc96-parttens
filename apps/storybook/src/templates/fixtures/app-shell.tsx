import type { Decorator } from '@storybook/react-vite'
import {
  AppShell1,
  type ShellBreadcrumbItem,
  type ShellNavGroup,
} from '@tc96/templates/application/shell/app-shell-1'
import { type ReactNode, useState } from 'react'
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
  actionsArg?: string
  breadcrumbs: ShellBreadcrumbItem[]
  href: string
  padded?: boolean
  root?: boolean
}

interface AppShellFrameProps extends Omit<AppShellPage, 'actionsArg'> {
  children: (actionsContainer: HTMLDivElement | null) => ReactNode
  slot: boolean
}

function AppShellFrame({
  breadcrumbs,
  children,
  href,
  padded,
  root = true,
  slot,
}: Readonly<AppShellFrameProps>) {
  const [actionsContainer, setActionsContainer] =
    useState<HTMLDivElement | null>(null)
  return (
    <AppShell1
      actions={
        slot ? (
          <div className="flex items-center gap-2" ref={setActionsContainer} />
        ) : undefined
      }
      breadcrumbs={
        root
          ? [{ href: '/', label: 'Risine CRM' }, ...breadcrumbs]
          : breadcrumbs
      }
      navigation={navigationFor(href)}
      padded={padded}
      user={shellUser}
      userActions={shellUserActions}
      workspaceId="risine"
      workspaces={shellWorkspaces}
    >
      {children(actionsContainer)}
    </AppShell1>
  )
}

export const withAppShell =
  ({ actionsArg, ...page }: AppShellPage): Decorator =>
  (Story, context) => (
    <AppShellFrame {...page} slot={actionsArg !== undefined}>
      {(actionsContainer) =>
        actionsArg ? (
          <Story args={{ ...context.args, [actionsArg]: actionsContainer }} />
        ) : (
          <Story />
        )
      }
    </AppShellFrame>
  )

export const appShellDocs = { height: '42rem', inline: false }
