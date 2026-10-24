'use client'

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarInset,
  SidebarProvider,
  SidebarRail,
} from '@tc96/ui/sidebar'
import { cn } from '@tc96/utils'
import type { ReactElement } from 'react'
import { resolveShellLabels } from '../shared/labels'
import { renderAnchor } from '../shared/render-link'
import { ShellHeader } from '../shared/shell-header'
import { ShellNav } from '../shared/shell-nav'
import type { AppShellBaseProps } from '../shared/types'
import { UserMenu } from '../shared/user-menu'
import { WorkspaceSwitcher } from '../shared/workspace-switcher'

export type AppShell1Props = AppShellBaseProps

export function AppShell1({
  actions,
  breadcrumbs,
  children,
  defaultOpen,
  labels: labelsProp,
  navigation,
  onOpenChange,
  onSignOut,
  onThemeChange,
  onWorkspaceChange,
  open,
  padded = true,
  renderLink = renderAnchor,
  theme,
  user,
  userActions,
  workspaceId,
  workspaces,
}: Readonly<AppShell1Props>): ReactElement {
  const labels = resolveShellLabels(labelsProp)

  return (
    <SidebarProvider
      defaultOpen={defaultOpen}
      onOpenChange={onOpenChange}
      open={open}
    >
      <Sidebar collapsible="icon">
        <SidebarHeader>
          <WorkspaceSwitcher
            labels={labels}
            onWorkspaceChange={onWorkspaceChange}
            workspaceId={workspaceId}
            workspaces={workspaces}
          />
        </SidebarHeader>
        <SidebarContent>
          <ShellNav
            groups={navigation}
            label={labels.navigation}
            labels={labels}
            renderLink={renderLink}
          />
        </SidebarContent>
        <SidebarFooter>
          <UserMenu
            labels={labels}
            onSignOut={onSignOut}
            onThemeChange={onThemeChange}
            theme={theme}
            user={user}
            userActions={userActions}
          />
        </SidebarFooter>
        <SidebarRail />
      </Sidebar>
      <SidebarInset className="min-w-0">
        <ShellHeader
          actions={actions}
          breadcrumbs={breadcrumbs}
          labels={labels}
          renderLink={renderLink}
        />
        <div className={cn('flex flex-1 flex-col', padded && 'gap-4 p-4')}>
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
