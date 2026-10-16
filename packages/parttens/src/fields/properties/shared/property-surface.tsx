'use client'

import { mergeProps } from '@base-ui/react/merge-props'
import { useRender } from '@base-ui/react/use-render'
import { Badge } from '@tc96/ui/badge'
import { cn } from '@tc96/utils'
import type React from 'react'

export type PropertyVariant = 'badge' | 'plain'

export const propertyBadgeClassName =
  'h-6 min-w-6 px-[calc(--spacing(2.5)-1px)] text-sm sm:h-6 sm:min-w-6 sm:text-sm'

export interface PropertySurfaceProps extends useRender.ComponentProps<'span'> {
  variant?: PropertyVariant
  muted?: boolean
}

export function PropertySurface({
  className,
  muted = false,
  render,
  variant = 'badge',
  ...props
}: PropertySurfaceProps): React.ReactElement {
  const state = {
    'data-slot': 'property-surface',
    'data-variant': variant,
    ...(muted ? { 'data-empty': 'true' } : {}),
    ...(props['aria-label'] && !props.role && !render ? { role: 'img' } : {}),
  }
  const plain = useRender({
    defaultTagName: 'span',
    enabled: variant !== 'badge',
    props: mergeProps<'span'>(
      {
        className: cn(
          muted && 'text-muted-foreground',
          'inline-flex min-w-0 max-w-full items-center gap-1 whitespace-nowrap text-sm outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-64 [button&,a&]:cursor-pointer [button&,a&]:hover:text-foreground',
          className,
        ),
        ...state,
      },
      props,
    ),
    render,
  })

  if (plain) return plain

  return (
    <Badge
      className={cn(propertyBadgeClassName, className)}
      variant={muted ? 'outline' : 'secondary'}
      {...(render ? { render } : {})}
      {...state}
      {...props}
    />
  )
}
