'use client'

import { Button } from '@tc96/ui/compat/collection-views/button'
import { MenuTrigger } from '@tc96/ui/menu'
import { ToolbarButton } from '@tc96/ui/toolbar'
import type { ReactElement, ReactNode } from 'react'

interface CollectionToolbarMenuTriggerProps {
  children: ReactNode
  className?: string
  disabled?: boolean
}

export function CollectionToolbarMenuTrigger({
  children,
  className,
  disabled = false,
}: Readonly<CollectionToolbarMenuTriggerProps>): ReactElement {
  return (
    <MenuTrigger
      render={
        <ToolbarButton
          render={
            <Button
              className={className}
              disabled={disabled}
              type="button"
              variant="ghost"
            />
          }
        />
      }
    >
      {children}
    </MenuTrigger>
  )
}
