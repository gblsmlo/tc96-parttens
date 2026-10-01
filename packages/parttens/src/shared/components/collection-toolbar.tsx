'use client'

import { Text } from '@tc96/elements/text'
import { ToolbarGroup, Toolbar as ToolbarPrimitive } from '@tc96/ui/toolbar'
import { cn } from '@tc96/utils'
import type { ComponentProps, ReactElement, ReactNode } from 'react'

interface CollectionToolbarBaseProps
  extends Omit<ComponentProps<typeof ToolbarPrimitive>, 'title'> {
  endSlot?: ReactNode
  startSlot?: ReactNode
}

export type CollectionToolbarProps = CollectionToolbarBaseProps &
  (
    | {
        /** Texto visível à esquerda dos controles, sobre a superfície plain. */
        variant: 'text'
        title: string
        description: string
      }
    | {
        /** `default` é a moldura do COSS; `plain` senta direto na página. */
        variant?: 'default' | 'plain'
        /** Tooltip HTML das variantes sem bloco de texto. */
        title?: string
        description?: never
      }
  )

export type CollectionToolbarGroupProps = ComponentProps<typeof ToolbarGroup>

export function CollectionToolbar({
  'aria-label': ariaLabel = 'Controles da coleção',
  children,
  className,
  description,
  endSlot,
  startSlot,
  title,
  variant = 'plain',
  ...props
}: Readonly<CollectionToolbarProps>): ReactElement {
  return (
    <ToolbarPrimitive
      aria-label={ariaLabel}
      className={cn(
        'justify-between',
        variant === 'text' ? 'min-h-14' : 'h-9 md:h-10',
        (variant === 'plain' || variant === 'text') &&
          'items-center rounded-none border-0 bg-transparent p-0 text-foreground',
        className,
      )}
      data-variant={variant}
      title={variant === 'text' ? undefined : title}
      {...props}
    >
      {variant === 'text' ? (
        <ToolbarGroup className="min-w-0 flex-1">
          <div className="min-w-0">
            <Text
              className="truncate leading-tight"
              family="heading"
              render={<h2>{title}</h2>}
              size="lg"
              weight="semibold"
            />
            <Text
              className="truncate leading-tight"
              foreground="muted"
              render={<p>{description}</p>}
              size="sm"
            />
          </div>
        </ToolbarGroup>
      ) : null}
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
