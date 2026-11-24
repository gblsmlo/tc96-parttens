'use client'

import { BuildingsIcon, CubeIcon, PackageIcon } from '@phosphor-icons/react'
import type { PropertyVariant } from '../../shared/property-surface'
import { IconLabelProperty } from '../icon-label/icon-label-property'

export type ReferencePropertyKind = 'account' | 'product' | 'record'

export interface ReferencePropertyProps {
  label: string
  ariaLabel?: string
  className?: string
  kind?: ReferencePropertyKind
  variant?: PropertyVariant
}

const referenceIcon = {
  account: BuildingsIcon,
  product: PackageIcon,
  record: CubeIcon,
} satisfies Record<ReferencePropertyKind, typeof CubeIcon>

export function ReferenceProperty({
  ariaLabel,
  className,
  kind = 'record',
  label,
  variant = 'badge',
}: Readonly<ReferencePropertyProps>) {
  return (
    <IconLabelProperty
      ariaLabel={ariaLabel}
      className={className}
      icon={referenceIcon[kind]}
      label={label}
      variant={variant}
    />
  )
}
