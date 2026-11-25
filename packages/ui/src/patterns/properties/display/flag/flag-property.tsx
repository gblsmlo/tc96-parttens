'use client'

import type { PropertyIcon } from '../../shared/property-catalog'
import type { PropertyVariant } from '../../shared/property-surface'
import { IconLabelProperty } from '../icon-label/icon-label-property'

export interface FlagPropertyProps {
  active: boolean
  label: string
  activeIcon?: PropertyIcon
  ariaLabel?: string
  className?: string
  iconClassName?: string
  inactiveLabel?: string
  inactiveIcon?: PropertyIcon
  showInactive?: boolean
  variant?: PropertyVariant
}

export function FlagProperty({
  active,
  activeIcon,
  ariaLabel,
  className,
  iconClassName,
  inactiveIcon,
  inactiveLabel,
  label,
  showInactive = false,
  variant = 'badge',
}: Readonly<FlagPropertyProps>) {
  if (!active && !showInactive) return null

  return (
    <IconLabelProperty
      ariaLabel={ariaLabel}
      className={className}
      icon={active ? activeIcon : inactiveIcon}
      iconClassName={iconClassName}
      label={active ? label : (inactiveLabel ?? label)}
      variant={variant}
    />
  )
}
