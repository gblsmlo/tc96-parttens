'use client'

import { ProgressRing } from '@tc96/parttens/widgets/shared/progress-ring'
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@tc96/ui/sidebar'
import type { ReactElement } from 'react'
import type { ShellRenderLink } from '../shared/types'

export interface ShellProject {
  active?: boolean
  href: string
  progress: number
  title: string
}

export interface ProjectNavProps {
  label: string
  projects: ShellProject[]
  renderLink: ShellRenderLink
}

export function ProjectNav({
  label,
  projects,
  renderLink,
}: Readonly<ProjectNavProps>): ReactElement {
  return (
    <nav aria-label={label}>
      <SidebarGroup>
        <SidebarGroupLabel>{label}</SidebarGroupLabel>
        <SidebarMenu>
          {projects.map((project) => (
            <SidebarMenuItem key={project.href}>
              <SidebarMenuButton
                aria-current={project.active ? 'page' : undefined}
                isActive={project.active}
                render={renderLink(project.href)}
                tooltip={project.title}
              >
                <ProgressRing
                  className="size-4"
                  ratio={project.progress}
                  strokeWidth={16}
                />
                <span>{project.title}</span>
              </SidebarMenuButton>
              <SidebarMenuBadge>
                {Math.round(Math.min(Math.max(project.progress, 0), 1) * 100)}%
              </SidebarMenuBadge>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroup>
    </nav>
  )
}
