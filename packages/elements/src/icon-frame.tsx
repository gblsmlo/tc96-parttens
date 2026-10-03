'use client'

import { mergeProps } from '@base-ui/react/merge-props'
import { useRender } from '@base-ui/react/use-render'
import { cn } from '@tc96/utils'
import { cva, type VariantProps } from 'class-variance-authority'
import type * as React from 'react'

export const iconFrameVariants = cva(
  'inline-flex shrink-0 items-center justify-center [&_svg]:shrink-0',
  {
    defaultVariants: {
      shape: 'circle',
      size: 'default',
      variant: 'color',
    },
    variants: {
      shape: {
        circle: 'rounded-full',
        rounded: 'rounded-lg',
      },
      size: {
        default: 'size-9 [&_svg:not([class*=size-])]:size-4.5',
        lg: 'size-11 [&_svg:not([class*=size-])]:size-5',
        xl: 'size-14 [&_svg:not([class*=size-])]:size-6',
      },
      variant: {
        color: 'bg-muted text-foreground',
        plain: 'bg-transparent text-foreground',
      },
    },
  },
)

export const iconFrameShapes = ['circle', 'rounded'] as const
export type IconFrameShape = (typeof iconFrameShapes)[number]
export const iconFrameSizes = ['default', 'lg', 'xl'] as const
export type IconFrameSize = (typeof iconFrameSizes)[number]
export const iconFrameVariantNames = ['color', 'plain'] as const
export type IconFrameVariant = (typeof iconFrameVariantNames)[number]

type IconFrameVariantProps = VariantProps<typeof iconFrameVariants>

export interface IconFrameProps extends useRender.ComponentProps<'span'> {
  color?: string
  shape?: IconFrameShape
  size?: IconFrameSize
  variant?: IconFrameVariant
}

export function iconFrameStyle(
  color: string | undefined,
  variant: IconFrameVariantProps['variant'],
): React.CSSProperties | undefined {
  if (!color) return undefined
  return variant === 'plain'
    ? { color }
    : {
        backgroundColor: `color-mix(in srgb, ${color} 6%, transparent)`,
        color,
      }
}

export function IconFrame({
  className,
  color,
  render,
  shape = 'circle',
  size = 'default',
  style,
  variant = 'color',
  ...props
}: IconFrameProps): React.ReactElement {
  const defaultProps = {
    'aria-hidden': true,
    className: cn(iconFrameVariants({ shape, size, variant }), className),
    'data-shape': shape,
    'data-size': size,
    'data-slot': 'icon-frame',
    'data-variant': variant,
    style: { ...iconFrameStyle(color, variant), ...style },
  }

  return useRender({
    defaultTagName: 'span',
    props: mergeProps<'span'>(defaultProps, props),
    render,
  })
}
