'use client'

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@tc96/ui/breadcrumb'
import { Separator } from '@tc96/ui/separator'
import { SidebarTrigger } from '@tc96/ui/sidebar'
import { Fragment, type ReactElement, type ReactNode } from 'react'
import type { ShellBreadcrumbItem, ShellLabels, ShellRenderLink } from './types'

export interface ShellBreadcrumbProps {
  items: ShellBreadcrumbItem[]
  labels: ShellLabels
  renderLink: ShellRenderLink
}

export function ShellBreadcrumb({
  items,
  labels,
  renderLink,
}: Readonly<ShellBreadcrumbProps>): ReactElement {
  return (
    <Breadcrumb aria-label={labels.breadcrumb}>
      <BreadcrumbList>
        {items.map((item, index) => {
          const current = index === items.length - 1
          return (
            <Fragment key={`${index}-${item.label}`}>
              <BreadcrumbItem
                className={current ? undefined : 'hidden md:inline-flex'}
              >
                {current ? <BreadcrumbPage>{item.label}</BreadcrumbPage> : null}
                {!current && item.href ? (
                  <BreadcrumbLink render={renderLink(item.href)}>
                    {item.label}
                  </BreadcrumbLink>
                ) : null}
                {!current && !item.href ? item.label : null}
              </BreadcrumbItem>
              {current ? null : (
                <BreadcrumbSeparator className="hidden md:inline-flex" />
              )}
            </Fragment>
          )
        })}
      </BreadcrumbList>
    </Breadcrumb>
  )
}

export interface ShellHeaderProps {
  actions?: ReactNode
  breadcrumbs?: ShellBreadcrumbItem[]
  children?: ReactNode
  labels: ShellLabels
  renderLink: ShellRenderLink
}

export function ShellHeader({
  actions,
  breadcrumbs,
  children,
  labels,
  renderLink,
}: Readonly<ShellHeaderProps>): ReactElement {
  return (
    <header className="flex h-14 shrink-0 items-center gap-2 border-b px-4">
      <SidebarTrigger aria-label={labels.toggleSidebar} className="-ms-1" />
      {breadcrumbs?.length ? (
        <>
          <Separator className="me-2 h-4" orientation="vertical" />
          <ShellBreadcrumb
            items={breadcrumbs}
            labels={labels}
            renderLink={renderLink}
          />
        </>
      ) : null}
      {children}
      {actions ? (
        <div className="ms-auto flex items-center gap-2">{actions}</div>
      ) : null}
    </header>
  )
}
