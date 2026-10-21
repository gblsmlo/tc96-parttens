'use client'

import { Button } from '@tc96/ui/button'
import { Separator } from '@tc96/ui/separator'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarInset,
  SidebarProvider,
} from '@tc96/ui/sidebar'
import { SearchIcon } from 'lucide-react'
import type { CSSProperties, ReactElement } from 'react'
import { resolveShellLabels } from '../shared/labels'
import { renderAnchor } from '../shared/render-link'
import { ShellHeader } from '../shared/shell-header'
import { ShellNav } from '../shared/shell-nav'
import { ShellNotifications } from '../shared/shell-notifications'
import { ShellSearch, ShellSearchShortcut } from '../shared/shell-search'
import type { AppShellBaseProps, ShellNotification } from '../shared/types'
import { UserMenu } from '../shared/user-menu'
import { WorkspaceSwitcher } from '../shared/workspace-switcher'
import { SectionRail, type ShellSection } from './section-rail'

export interface AppShell4Props extends Omit<AppShellBaseProps, 'navigation'> {
  notifications?: ShellNotification[]
  onMarkAllRead?: () => void
  onNavigate?: (href: string) => void
  onNotificationSelect?: (notificationId: string) => void
  onSectionChange?: (sectionId: string) => void
  sectionId: string
  sections: ShellSection[]
}

const sidebarWidth = {
  '--sidebar-width': 'calc(var(--sidebar-width-icon) + 16rem)',
} as CSSProperties

export function AppShell4({
  actions,
  breadcrumbs,
  children,
  defaultOpen,
  labels: labelsProp,
  notifications,
  onMarkAllRead,
  onNavigate,
  onNotificationSelect,
  onOpenChange,
  onSectionChange,
  onSignOut,
  onThemeChange,
  onWorkspaceChange,
  open,
  renderLink = renderAnchor,
  sectionId,
  sections,
  theme,
  user,
  userActions,
  workspaceId,
  workspaces,
}: Readonly<AppShell4Props>): ReactElement {
  const labels = resolveShellLabels(labelsProp)
  const active =
    sections.find((section) => section.id === sectionId) ?? sections[0]
  const searchGroups = sections.map((section) => ({
    items: section.navigation.flatMap((group) => group.items),
    label: section.title,
  }))

  return (
    <SidebarProvider
      defaultOpen={defaultOpen}
      onOpenChange={onOpenChange}
      open={open}
      style={sidebarWidth}
    >
      <Sidebar
        className="overflow-hidden *:data-[sidebar=sidebar]:flex-row"
        collapsible="icon"
      >
        <Sidebar className="w-(--sidebar-width-icon)" collapsible="none">
          <SidebarHeader>
            <WorkspaceSwitcher
              compact
              labels={labels}
              onWorkspaceChange={onWorkspaceChange}
              workspaceId={workspaceId}
              workspaces={workspaces}
            />
          </SidebarHeader>
          <SidebarContent className="px-2">
            <SectionRail
              label={labels.sections}
              onSectionChange={onSectionChange}
              sectionId={active?.id ?? sectionId}
              sections={sections}
            />
          </SidebarContent>
          <SidebarFooter>
            <UserMenu
              compact
              labels={labels}
              onSignOut={onSignOut}
              onThemeChange={onThemeChange}
              theme={theme}
              user={user}
              userActions={userActions}
            />
          </SidebarFooter>
        </Sidebar>
        <Separator orientation="vertical" />
        <Sidebar className="min-w-0 flex-1" collapsible="none">
          {active ? (
            <>
              <SidebarHeader className="h-14 justify-center px-4">
                <h2 className="truncate font-medium text-base">
                  {active.title}
                </h2>
              </SidebarHeader>
              <SidebarContent>
                <ShellNav
                  groups={active.navigation}
                  label={active.title}
                  labels={labels}
                  renderLink={renderLink}
                />
              </SidebarContent>
            </>
          ) : null}
        </Sidebar>
      </Sidebar>
      <SidebarInset>
        <ShellHeader
          actions={
            <>
              <ShellSearch
                groups={searchGroups}
                labels={labels}
                onNavigate={onNavigate}
                trigger={<Button size="sm" variant="outline" />}
              >
                <SearchIcon />
                <span className="max-sm:sr-only">{labels.search}</span>
                <span className="max-sm:hidden">
                  <ShellSearchShortcut />
                </span>
              </ShellSearch>
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
