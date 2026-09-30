'use client'

import { ToolbarGroup, Toolbar as ToolbarPrimitive } from '@tc96/ui/toolbar'
import { cn } from '@tc96/utils'
import type { ComponentProps, ReactElement, ReactNode } from 'react'

export interface CollectionToolbarProps
  extends ComponentProps<typeof ToolbarPrimitive> {
  endSlot?: ReactNode
  startSlot?: ReactNode
  /** `default` é a moldura de toolbar do COSS; `plain` senta direto na página, sem borda nem fundo. */
  variant?: 'default' | 'plain'
}

export type CollectionToolbarGroupProps = ComponentProps<typeof ToolbarGroup>

export function CollectionToolbar({
  'aria-label': ariaLabel = 'Controles da coleção',
  children,
  className,
  endSlot,
  startSlot,
  variant = 'plain',
  ...props
}: Readonly<CollectionToolbarProps>): ReactElement {
  return (
    <ToolbarPrimitive
      aria-label={ariaLabel}
      className={cn(
        'h-9 justify-between md:h-10',
        variant === 'plain' &&
          'items-center rounded-none border-0 bg-transparent p-0 text-foreground',
        className,
      )}
      data-variant={variant}
      {...props}
    >
      {startSlot ? (
        <ToolbarGroup className="min-w-0">{startSlot}</ToolbarGroup>
      ) : null}
      {children}
      {endSlot ? (
        <ToolbarGroup className="ms-auto">{endSlot}</ToolbarGroup>
      ) : null}
    </ToolbarPrimitive>
  )
}

export function CollectionToolbarGroup(
  props: CollectionToolbarGroupProps,
): ReactElement {
  return <ToolbarGroup {...props} />
}
