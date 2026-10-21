'use client'

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarInset,
  SidebarProvider,
} from '@tc96/ui/sidebar'
import type { ReactElement } from 'react'
import { resolveShellLabels } from '../shared/labels'
import { renderAnchor } from '../shared/render-link'
import { ShellHeader } from '../shared/shell-header'
import { ShellNav } from '../shared/shell-nav'
import { ShellNotifications } from '../shared/shell-notifications'
import type { AppShellBaseProps, ShellNotification } from '../shared/types'
import { UserMenu } from '../shared/user-menu'
import { WorkspaceSwitcher } from '../shared/workspace-switcher'
import { ProjectNav, type ShellProject } from './project-nav'
import { type ShellUsage, UsageCard } from './usage-card'

export interface AppShell3Props extends AppShellBaseProps {
  notifications?: ShellNotification[]
  onMarkAllRead?: () => void
  onNotificationSelect?: (notificationId: string) => void
  projects?: ShellProject[]
  usage?: ShellUsage
}

export function AppShell3({
  actions,
  breadcrumbs,
  children,
  defaultOpen,
  labels: labelsProp,
  navigation,
  notifications,
  onMarkAllRead,
  onNotificationSelect,
  onOpenChange,
  onSignOut,
  onThemeChange,
  onWorkspaceChange,
  open,
  projects,
  renderLink = renderAnchor,
  theme,
  usage,
  user,
  userActions,
  workspaceId,
  workspaces,
}: Readonly<AppShell3Props>): ReactElement {
  const labels = resolveShellLabels(labelsProp)

  return (
    <SidebarProvider
      defaultOpen={defaultOpen}
      onOpenChange={onOpenChange}
      open={open}
    >
      <Sidebar collapsible="icon" variant="inset">
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
          {projects?.length ? (
            <ProjectNav
              label={labels.projects}
              projects={projects}
              renderLink={renderLink}
            />
          ) : null}
        </SidebarContent>
        <SidebarFooter>
          {usage ? <UsageCard usage={usage} /> : null}
          <UserMenu
            labels={labels}
            onSignOut={onSignOut}
            onThemeChange={onThemeChange}
            theme={theme}
            user={user}
            userActions={userActions}
          />
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <ShellHeader
          actions={
            notifications || actions ? (
              <>
                {notifications ? (
                  <ShellNotifications
                    labels={labels}
                    notifications={notifications}
                    onMarkAllRead={onMarkAllRead}
                    onNotificationSelect={onNotificationSelect}
                  />
                ) : null}
                {actions}
              </>
            ) : undefined
          }
          breadcrumbs={breadcrumbs}
          labels={labels}
          renderLink={renderLink}
        />
        <div className="flex flex-1 flex-col gap-4 p-4">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  )
}
