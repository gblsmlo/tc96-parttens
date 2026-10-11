import { cn } from '@tc96/utils'
import type { ComponentProps } from 'react'
import type { PropertyVariant } from './property-surface'

export interface PropertyRowProps
  extends Omit<ComponentProps<'fieldset'>, 'aria-label'> {
  slot: string
  ariaLabel?: string
  variant?: PropertyVariant
}

export function PropertyRow({
  ariaLabel,
  className,
  slot,
  variant,
  ...props
}: Readonly<PropertyRowProps>) {
  return (
    <fieldset
      aria-label={ariaLabel}
      className={cn('m-0 min-w-0 border-0 p-0', className)}
      data-slot={slot}
      data-variant={variant}
      {...props}
    />
  )
}
