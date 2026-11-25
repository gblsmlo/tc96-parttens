'use client'

import {
  type ReferencePropertyKind,
  referenceKindIcons,
} from '../../shared/property-display-meta'
import type { PropertyVariant } from '../../shared/property-surface'
import { IconLabelProperty } from '../icon-label/icon-label-property'

export type { ReferencePropertyKind }

export interface ReferencePropertyProps {
  label: string
  ariaLabel?: string
  className?: string
  kind?: ReferencePropertyKind
  variant?: PropertyVariant
}

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
      icon={referenceKindIcons[kind]}
      label={label}
      variant={variant}
    />
  )
}
