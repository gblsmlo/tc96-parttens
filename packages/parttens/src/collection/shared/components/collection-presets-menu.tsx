'use client'

import { CaretDownIcon } from '@phosphor-icons/react'
import { Badge } from '@tc96/ui/badge'
import { Menu, MenuPopup } from '@tc96/ui/menu'
import type { ReactElement, ReactNode } from 'react'
import { CollectionToolbarMenuTrigger } from './collection-toolbar-menu-trigger'

export interface PresetsMenuProps {
  children: ReactNode
  className?: string
  count: number
  countLabel?: string
  label: string
}

export function PresetsMenu({
  children,
  className,
  count,
  countLabel,
  label,
}: Readonly<PresetsMenuProps>): ReactElement {
  const normalizedCount = Math.max(0, count)

  return (
    <Menu>
      <CollectionToolbarMenuTrigger className={className}>
        <span className="min-w-0 truncate font-medium">{label}</span>
        <Badge
          aria-label={countLabel ?? `${normalizedCount} itens`}
          variant="secondary"
        >
          {normalizedCount}
        </Badge>
        <CaretDownIcon aria-hidden="true" />
      </CollectionToolbarMenuTrigger>
      <MenuPopup align="start" className="w-56">
        {children}
      </MenuPopup>
    </Menu>
  )
}
