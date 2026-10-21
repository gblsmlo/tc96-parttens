'use client'

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
} from '@tc96/ui/sidebar'
import { SearchIcon } from 'lucide-react'
import type { ReactElement } from 'react'
import { resolveShellLabels } from '../shared/labels'
import { renderAnchor } from '../shared/render-link'
import { ShellHeader } from '../shared/shell-header'
import { ShellNav } from '../shared/shell-nav'
import { ShellSearch, ShellSearchShortcut } from '../shared/shell-search'
import type { AppShellBaseProps } from '../shared/types'
import { UserMenu } from '../shared/user-menu'
import { WorkspaceSwitcher } from '../shared/workspace-switcher'

export interface AppShell2Props extends AppShellBaseProps {
  onNavigate?: (href: string) => void
}

export function AppShell2({
  actions,
  breadcrumbs,
  children,
  defaultOpen,
  labels: labelsProp,
  navigation,
  onNavigate,
  onOpenChange,
  onSignOut,
  onThemeChange,
  onWorkspaceChange,
  open,
  renderLink = renderAnchor,
  theme,
  user,
  userActions,
  workspaceId,
  workspaces,
}: Readonly<AppShell2Props>): ReactElement {
  const labels = resolveShellLabels(labelsProp)

  return (
    <SidebarProvider
      defaultOpen={defaultOpen}
      onOpenChange={onOpenChange}
      open={open}
    >
      <Sidebar collapsible="icon" variant="floating">
        <SidebarHeader>
          <WorkspaceSwitcher
            labels={labels}
            onWorkspaceChange={onWorkspaceChange}
            workspaceId={workspaceId}
            workspaces={workspaces}
          />
          <SidebarMenu>
            <SidebarMenuItem>
              <ShellSearch
                groups={navigation}
                labels={labels}
                onNavigate={onNavigate}
                trigger={
                  <SidebarMenuButton
                    tooltip={labels.search}
                    variant="outline"
                  />
                }
              >
                <SearchIcon />
                <span>{labels.search}</span>
                <span className="ms-auto group-data-[collapsible=icon]:hidden">
                  <ShellSearchShortcut />
                </span>
              </ShellSearch>
            </SidebarMenuItem>
          </SidebarMenu>
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
      </Sidebar>
      <SidebarInset>
        <ShellHeader
          actions={actions}
          breadcrumbs={breadcrumbs}
          labels={labels}
          renderLink={renderLink}
        />
        <div className="flex flex-1 flex-col gap-4 p-4">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  )
}
