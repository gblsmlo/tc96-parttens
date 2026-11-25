'use client'

import { ToolbarGroup, Toolbar as ToolbarPrimitive } from '@tc96/ui/toolbar'
import { cn } from '@tc96/utils'
import type { ComponentProps, ReactElement, ReactNode } from 'react'

export type CollectionToolbarMode = 'default' | 'plain'

export interface CollectionToolbarProps
  extends Omit<ComponentProps<typeof ToolbarPrimitive>, 'children'> {
  center?: ReactNode
  left?: ReactNode
  mode?: CollectionToolbarMode
  right?: ReactNode
}

export type CollectionToolbarGroupProps = ComponentProps<typeof ToolbarGroup>

export function CollectionToolbar({
  'aria-label': ariaLabel = 'Controles da coleção',
  center,
  className,
  left,
  mode = 'plain',
  right,
  ...props
}: Readonly<CollectionToolbarProps>): ReactElement {
  const centered = center != null
  const spacer = centered ? (
    <div aria-hidden="true" className="flex-1 basis-0" />
  ) : null

  return (
    <ToolbarPrimitive
      aria-label={ariaLabel}
      className={cn(
        'min-h-9 items-center justify-between md:min-h-10',
        mode === 'plain' && 'rounded-none border-0 bg-transparent p-0',
        className,
      )}
      data-mode={mode}
      {...props}
    >
      {left != null ? (
        <ToolbarGroup
          className={centered ? 'min-w-0 flex-1 basis-0' : 'min-w-0'}
        >
          {left}
        </ToolbarGroup>
      ) : (
        spacer
      )}
      {centered ? (
        <ToolbarGroup className="shrink-0">{center}</ToolbarGroup>
      ) : null}
      {right != null ? (
        <ToolbarGroup
          className={centered ? 'flex-1 basis-0 justify-end' : 'ms-auto'}
        >
          {right}
        </ToolbarGroup>
      ) : (
        spacer
      )}
    </ToolbarPrimitive>
  )
}

export function CollectionToolbarGroup(
  props: CollectionToolbarGroupProps,
): ReactElement {
  return <ToolbarGroup {...props} />
}
