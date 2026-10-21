'use client'

import { IconFrame } from '@tc96/elements/icon-frame'
import { getInitials } from '@tc96/helpers/initials'
import {
  Menu,
  MenuGroup,
  MenuGroupLabel,
  MenuPopup,
  MenuRadioGroup,
  MenuRadioItem,
  MenuTrigger,
} from '@tc96/ui/menu'
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@tc96/ui/sidebar'
import { ChevronsUpDownIcon } from 'lucide-react'
import type { ReactElement } from 'react'
import type { ShellLabels, ShellWorkspace } from './types'

export interface WorkspaceLogoProps {
  workspace: ShellWorkspace
}

export function WorkspaceLogo({
  workspace,
}: Readonly<WorkspaceLogoProps>): ReactElement {
  return (
    <IconFrame
      aria-hidden
      className="size-8 bg-sidebar-primary text-sidebar-primary-foreground text-sm"
      shape="rounded"
    >
      {workspace.logo ?? getInitials(workspace.name, 1)}
    </IconFrame>
  )
}

export interface WorkspaceSwitcherProps {
  compact?: boolean
  labels: ShellLabels
  onWorkspaceChange?: (workspaceId: string) => void
  workspaceId: string
  workspaces: ShellWorkspace[]
}

export function WorkspaceSwitcher({
  compact = false,
  labels,
  onWorkspaceChange,
  workspaceId,
  workspaces,
}: Readonly<WorkspaceSwitcherProps>): ReactElement | null {
  const { isMobile } = useSidebar()
  const active =
    workspaces.find((workspace) => workspace.id === workspaceId) ??
    workspaces[0]
  if (!active) return null

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <Menu>
          <MenuTrigger
            render={
              <SidebarMenuButton
                className={compact ? 'h-8 p-0' : undefined}
                size="lg"
                tooltip={
                  compact
                    ? { children: active.name, hidden: false }
                    : labels.switchWorkspace
                }
              />
            }
          >
            <WorkspaceLogo workspace={active} />
            <span className="grid flex-1 text-start text-sm leading-tight">
              <span className="truncate font-medium">{active.name}</span>
              {active.description ? (
                <span className="truncate text-xs">{active.description}</span>
              ) : null}
            </span>
            <ChevronsUpDownIcon className="ms-auto" />
          </MenuTrigger>
          <MenuPopup
            align="start"
            className="min-w-56"
            side={isMobile ? 'bottom' : 'right'}
          >
            <MenuGroup>
              <MenuGroupLabel>{labels.workspaces}</MenuGroupLabel>
              <MenuRadioGroup
                onValueChange={(value) => onWorkspaceChange?.(String(value))}
                value={active.id}
              >
                {workspaces.map((workspace) => (
                  <MenuRadioItem
                    closeOnClick
                    key={workspace.id}
                    value={workspace.id}
                  >
                    {workspace.name}
                  </MenuRadioItem>
                ))}
              </MenuRadioGroup>
            </MenuGroup>
          </MenuPopup>
        </Menu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
