import type { RenderLink } from '@tc96/ui/render-anchor'
import { cn } from '@tc96/utils'
import { cloneElement, type ReactElement, type ReactNode } from 'react'

export interface DashboardLinkProps {
  'aria-label'?: string
  children: ReactNode
  className?: string
  href: string
  renderLink: RenderLink
}

export function DashboardLink({
  'aria-label': ariaLabel,
  children,
  className,
  href,
  renderLink,
}: Readonly<DashboardLinkProps>) {
  const element = renderLink(href) as ReactElement<{
    'aria-label'?: string
    className?: string
  }>

  return cloneElement(
    element,
    {
      'aria-label': ariaLabel,
      className: cn(
        'rounded-sm outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 focus-visible:ring-offset-background',
        element.props.className,
        className,
      ),
    },
    children,
  )
}
