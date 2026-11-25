import type { RenderLink } from '@tc96/ui/render-anchor'
import type { ReactNode } from 'react'
import { DashboardLink } from './dashboard-link'

export interface DashboardLinkListItem {
  description?: string
  href?: string
  id: string
  title: string
  trailing?: ReactNode
}

export interface DashboardLinkListProps {
  empty: string
  items: readonly DashboardLinkListItem[]
  label: string
  renderLink?: RenderLink
}

export function DashboardLinkList({
  empty,
  items,
  label,
  renderLink,
}: Readonly<DashboardLinkListProps>) {
  if (items.length === 0) {
    return <p className="text-muted-foreground text-sm">{empty}</p>
  }

  return (
    <ul aria-label={label} className="m-0 grid list-none gap-3 p-0">
      {items.map((item) => (
        <li
          className="flex items-start justify-between gap-3"
          data-item={item.id}
          key={item.id}
        >
          <div className="grid min-w-0 gap-0.5">
            {item.href && renderLink ? (
              <DashboardLink
                className="truncate font-medium text-sm hover:underline"
                href={item.href}
                renderLink={renderLink}
              >
                {item.title}
              </DashboardLink>
            ) : (
              <span className="truncate font-medium text-sm">{item.title}</span>
            )}
            {item.description ? (
              <span className="truncate text-muted-foreground text-xs">
                {item.description}
              </span>
            ) : null}
          </div>
          {item.trailing ? (
            <div className="flex shrink-0 items-center gap-2">
              {item.trailing}
            </div>
          ) : null}
        </li>
      ))}
    </ul>
  )
}
