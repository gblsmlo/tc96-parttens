'use client'

import { ArrowLeftIcon } from '@phosphor-icons/react'
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@tc96/ui/sidebar'
import type { ReactElement } from 'react'
import type { ShellLabels, ShellRenderLink, ShellSettings } from './types'

export interface ShellBackButtonProps {
  labels: ShellLabels
  renderLink: ShellRenderLink
  settings: ShellSettings
}

export function ShellBackButton({
  labels,
  renderLink,
  settings,
}: Readonly<ShellBackButtonProps>): ReactElement {
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton
          onClick={settings.onBack}
          render={settings.backHref ? renderLink(settings.backHref) : undefined}
          tooltip={labels.backToApp}
          type={settings.backHref ? undefined : 'button'}
        >
          <ArrowLeftIcon aria-hidden="true" />
          <span>{labels.backToApp}</span>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
