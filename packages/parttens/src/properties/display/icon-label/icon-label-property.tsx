'use client'

import { cn } from '@tc96/utils'
import type React from 'react'
import type { ReactNode } from 'react'
import {
  PropertySurface,
  type PropertySurfaceProps,
  type PropertyVariant,
} from '../../shared/property-surface'

export type IconLabelPropertyIcon = React.ComponentType<
  React.SVGProps<SVGSVGElement>
>

export type IconLabelPropertyTrailingVisibility = 'always' | 'hover'

export interface IconLabelPropertyProps {
  label: ReactNode
  ariaLabel?: string
  className?: string
  icon?: IconLabelPropertyIcon
  iconClassName?: string
  leading?: ReactNode
  muted?: boolean
  render?: PropertySurfaceProps['render']
  trailing?: ReactNode
  trailingVisibility?: IconLabelPropertyTrailingVisibility
  variant?: PropertyVariant
}

export function IconLabelProperty({
  ariaLabel,
  className,
  icon: Icon,
  iconClassName,
  label,
  leading,
  muted = false,
  render,
  trailing,
  trailingVisibility = 'always',
  variant = 'badge',
}: Readonly<IconLabelPropertyProps>) {
  const hidesTrailing = Boolean(trailing) && trailingVisibility === 'hover'

  return (
    <PropertySurface
      aria-label={
        ariaLabel
          ? `${ariaLabel}: ${typeof label === 'string' ? label : ''}`.trim()
          : undefined
      }
      className={cn('max-w-full', hidesTrailing && 'group/property', className)}
      muted={muted}
      render={render}
      role={trailing && ariaLabel ? 'group' : undefined}
      variant={variant}
    >
      {leading}
      {Icon ? (
        <Icon aria-hidden className={cn('size-3', iconClassName)} />
      ) : null}
      <span className="truncate">{label}</span>
      {hidesTrailing ? (
        <span
          className="pointer-coarse:opacity-100 flex shrink-0 self-stretch items-center opacity-0 transition-opacity group-focus-within/property:opacity-100 group-hover/property:opacity-100"
          data-slot="property-trailing"
        >
          {trailing}
        </span>
      ) : (
        trailing
      )}
    </PropertySurface>
  )
}
