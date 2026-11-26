'use client'

import { renderAnchor } from '@tc96/ui/render-anchor'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarInset,
  SidebarProvider,
  SidebarRail,
} from '@tc96/ui/sidebar'
import type { ReactElement } from 'react'
import { resolveShellLabels } from '../shared/labels'
import { ShellBackButton } from '../shared/shell-back-button'
import { ShellContent } from '../shared/shell-content'
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
  scrollArea = true,
  renderLink = renderAnchor,
  settings,
  theme,
  user,
  userActions,
  workspaceId,
  workspaces,
}: Readonly<AppShell1Props>): ReactElement {
  const labels = resolveShellLabels(labelsProp)

  return (
    <SidebarProvider
      className="h-svh"
      defaultOpen={defaultOpen}
      onOpenChange={onOpenChange}
      open={open}
    >
      <Sidebar collapsible="icon">
        <SidebarHeader>
          {settings ? (
            <ShellBackButton
              labels={labels}
              renderLink={renderLink}
              settings={settings}
            />
          ) : (
            <WorkspaceSwitcher
              labels={labels}
              onWorkspaceChange={onWorkspaceChange}
              workspaceId={workspaceId}
              workspaces={workspaces}
            />
          )}
        </SidebarHeader>
        <SidebarContent>
          <ShellNav
            groups={settings ? settings.navigation : navigation}
            label={settings ? labels.settingsNavigation : labels.navigation}
            labels={labels}
            renderLink={renderLink}
          />
        </SidebarContent>
        {settings ? null : (
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
        )}
        <SidebarRail />
      </Sidebar>
      <SidebarInset className="min-h-0 min-w-0">
        <ShellHeader
          actions={actions}
          breadcrumbs={breadcrumbs}
          labels={labels}
          renderLink={renderLink}
        />
        <ShellContent padded={padded} scrollArea={scrollArea}>
          {children}
        </ShellContent>
      </SidebarInset>
    </SidebarProvider>
  )
}
