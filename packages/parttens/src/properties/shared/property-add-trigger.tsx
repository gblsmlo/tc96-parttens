'use client'

import { cn } from '@tc96/utils'
import { PlusIcon } from 'lucide-react'
import type { PropertyIcon } from './property-catalog'
import { PropertySurface, type PropertySurfaceProps } from './property-surface'

export interface PropertyAddTriggerProps
  extends Omit<PropertySurfaceProps, 'children' | 'render'> {
  addLabel: string
  hasValue: boolean
  placeholder: string
  disabled?: boolean
  icon?: PropertyIcon
}

export function PropertyAddTrigger({
  addLabel,
  className,
  disabled,
  hasValue,
  icon: Icon,
  muted = !hasValue,
  placeholder,
  ...props
}: Readonly<PropertyAddTriggerProps>) {
  const Glyph = hasValue ? PlusIcon : Icon

  return (
    <PropertySurface
      {...props}
      aria-label={addLabel}
      className={cn(hasValue && 'w-6 px-0', className)}
      muted={muted}
      render={<button disabled={disabled} type="button" />}
    >
      {Glyph ? <Glyph aria-hidden="true" className="size-3.5" /> : null}
      {hasValue ? null : <span className="truncate">{placeholder}</span>}
    </PropertySurface>
  )
}
