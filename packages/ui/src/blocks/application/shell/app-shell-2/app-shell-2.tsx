'use client'

import { MagnifyingGlassIcon } from '@phosphor-icons/react'
import { renderAnchor } from '@tc96/ui/render-anchor'
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
import type { ReactElement } from 'react'
import { resolveShellLabels } from '../shared/labels'
import { ShellBackButton } from '../shared/shell-back-button'
import { ShellContent } from '../shared/shell-content'
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
  padded = true,
  scrollArea = true,
  renderLink = renderAnchor,
  settings,
  theme,
  user,
  userActions,
  workspaceId,
  workspaces,
}: Readonly<AppShell2Props>): ReactElement {
  const labels = resolveShellLabels(labelsProp)

  return (
    <SidebarProvider
      className="h-svh"
      defaultOpen={defaultOpen}
      onOpenChange={onOpenChange}
      open={open}
    >
      <Sidebar collapsible="icon" variant="floating">
        <SidebarHeader>
          {settings ? (
            <ShellBackButton
              labels={labels}
              renderLink={renderLink}
              settings={settings}
            />
          ) : (
            <>
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
                    <MagnifyingGlassIcon aria-hidden="true" />
                    <span>{labels.search}</span>
                    <span className="ms-auto group-data-[collapsible=icon]:hidden">
                      <ShellSearchShortcut />
                    </span>
                  </ShellSearch>
                </SidebarMenuItem>
              </SidebarMenu>
            </>
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
