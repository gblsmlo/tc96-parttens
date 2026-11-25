import type { RenderLink } from '@tc96/ui/render-anchor'
import { cn } from '@tc96/utils'
import {
  cloneElement,
  type MouseEvent,
  type ReactElement,
  type ReactNode,
} from 'react'

interface Navbar12LinkProps {
  children: ReactNode
  className?: string
  href: string
  onSelect?: () => void
  renderLink: RenderLink
}

type LinkElementProps = {
  className?: string
  onClick?: (event: MouseEvent<HTMLElement>) => void
}

export function Navbar12Link({
  children,
  className,
  href,
  onSelect,
  renderLink,
}: Readonly<Navbar12LinkProps>) {
  const element = renderLink(href) as ReactElement<LinkElementProps>

  return cloneElement(
    element,
    {
      className: cn(element.props.className, className),
      onClick: (event) => {
        element.props.onClick?.(event)
        onSelect?.()
      },
    },
    children,
  )
}
