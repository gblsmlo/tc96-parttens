'use client'

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarRail,
} from '@tc96/ui/sidebar'
import { cn } from '@tc96/utils'
import { ArrowLeftIcon } from 'lucide-react'
import type { ReactElement, ReactNode } from 'react'
import { resolveShellLabels } from '../shared/labels'
import { renderAnchor } from '../shared/render-link'
import { ShellHeader } from '../shared/shell-header'
import { ShellNav } from '../shared/shell-nav'
import type {
  ShellBreadcrumbItem,
  ShellLabels,
  ShellNavGroup,
  ShellRenderLink,
} from '../shared/types'

interface SettingsShellBaseProps {
  actions?: ReactNode
  breadcrumbs?: ShellBreadcrumbItem[]
  children?: ReactNode
  defaultOpen?: boolean
  labels?: Partial<ShellLabels>
  navigation: ShellNavGroup[]
  onOpenChange?: (open: boolean) => void
  open?: boolean
  padded?: boolean
  renderLink?: ShellRenderLink
}

export type SettingsShellProps = SettingsShellBaseProps &
  (
    | { backHref: string; onBack?: never }
    | { backHref?: never; onBack: () => void }
  )

export function SettingsShell({
  actions,
  backHref,
  breadcrumbs,
  children,
  defaultOpen,
  labels: labelsProp,
  navigation,
  onBack,
  onOpenChange,
  open,
  padded = true,
  renderLink = renderAnchor,
}: Readonly<SettingsShellProps>): ReactElement {
  const labels = resolveShellLabels(labelsProp)

  return (
    <SidebarProvider
      defaultOpen={defaultOpen}
      onOpenChange={onOpenChange}
      open={open}
    >
      <Sidebar collapsible="offcanvas">
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                onClick={onBack}
                render={backHref ? renderLink(backHref) : undefined}
                type={backHref ? undefined : 'button'}
              >
                <ArrowLeftIcon />
                <span>{labels.backToApp}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>
        <SidebarContent>
          <ShellNav
            groups={navigation}
            label={labels.settingsNavigation}
            labels={labels}
            renderLink={renderLink}
          />
        </SidebarContent>
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
