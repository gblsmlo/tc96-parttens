'use client'

import { mergeProps } from '@base-ui/react/merge-props'
import { useRender } from '@base-ui/react/use-render'
import { cn } from '@tc96/utils'
import type * as React from 'react'

export type CardSurfaceProps = useRender.ComponentProps<'div'>

export function CardSurface({
  className,
  render,
  ...props
}: CardSurfaceProps): React.ReactElement {
  const defaultProps = {
    className: cn(
      'relative flex flex-col [--card-surface-radius:var(--card-radius,var(--radius-lg))] rounded-(--card-surface-radius) border border-border/80 bg-card not-dark:bg-clip-padding text-card-foreground shadow-xs/5 before:pointer-events-none before:absolute before:inset-0 before:rounded-[calc(var(--card-surface-radius)-1px)] before:shadow-[0_1px_--theme(--color-black/4%)] dark:before:shadow-[0_-1px_--theme(--color-white/6%)]',
      className,
    ),
    'data-slot': 'card',
  }

  return useRender({
    defaultTagName: 'div',
    props: mergeProps<'div'>(defaultProps, props),
    render,
  })
}
