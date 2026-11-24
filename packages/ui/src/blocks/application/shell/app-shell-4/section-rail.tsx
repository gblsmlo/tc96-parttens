'use client'

import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@tc96/ui/sidebar'
import type { ReactElement, ReactNode } from 'react'
import type { ShellNavGroup } from '../shared/types'

export interface ShellSection {
  icon: ReactNode
  id: string
  navigation: ShellNavGroup[]
  title: string
}

export interface SectionRailProps {
  label: string
  onSectionChange?: (sectionId: string) => void
  sectionId: string
  sections: ShellSection[]
}

export function SectionRail({
  label,
  onSectionChange,
  sectionId,
  sections,
}: Readonly<SectionRailProps>): ReactElement {
  const { setOpen } = useSidebar()

  return (
    <nav aria-label={label}>
      <SidebarMenu>
        {sections.map((section) => (
          <SidebarMenuItem key={section.id}>
            <SidebarMenuButton
              aria-pressed={section.id === sectionId}
              className="px-2"
              isActive={section.id === sectionId}
              onClick={() => {
                onSectionChange?.(section.id)
                setOpen(true)
              }}
              tooltip={{ children: section.title, hidden: false }}
            >
              {section.icon}
              <span>{section.title}</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </nav>
  )
}
