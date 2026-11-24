import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@tc96/ui/breadcrumb'
import { Fragment, type ReactElement } from 'react'
import type { NavbarBreadcrumbItem, NavbarRenderLink } from './types'

export interface NavbarBreadcrumbProps {
  items: NavbarBreadcrumbItem[]
  label: string
  renderLink: NavbarRenderLink
}

export function NavbarBreadcrumb({
  items,
  label,
  renderLink,
}: Readonly<NavbarBreadcrumbProps>): ReactElement {
  return (
    <Breadcrumb aria-label={label}>
      <BreadcrumbList>
        {items.map((item, index) => {
          const current = index === items.length - 1
          return (
            <Fragment key={`${index}-${item.label}`}>
              <BreadcrumbItem>
                {current ? <BreadcrumbPage>{item.label}</BreadcrumbPage> : null}
                {!current && item.href ? (
                  <BreadcrumbLink render={renderLink(item.href)}>
                    {item.label}
                  </BreadcrumbLink>
                ) : null}
                {!current && !item.href ? item.label : null}
              </BreadcrumbItem>
              {current ? null : <BreadcrumbSeparator />}
            </Fragment>
          )
        })}
      </BreadcrumbList>
    </Breadcrumb>
  )
}
