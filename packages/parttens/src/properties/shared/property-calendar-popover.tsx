'use client'

import { Button } from '@tc96/ui/button'
import type { Calendar } from '@tc96/ui/calendar'
import { Popover, PopoverPopup, PopoverTrigger } from '@tc96/ui/popover'
import { cn } from '@tc96/utils'
import type { ComponentProps, ReactNode } from 'react'
import type { PropertyIcon } from './property-catalog'
import { PropertySurface, type PropertyVariant } from './property-surface'

export type PropertyPopoverDropdownPlacement = Pick<
  ComponentProps<typeof PopoverPopup>,
  'align' | 'alignOffset' | 'side' | 'sideOffset'
>

export type PropertyCalendarProps = Omit<
  ComponentProps<typeof Calendar>,
  'defaultMonth' | 'mode' | 'onSelect' | 'selected'
>

export interface PropertyCalendarPopoverProps {
  ariaLabel: string
  children: ReactNode
  icon: PropertyIcon
  label: string
  onOpenChange: (open: boolean) => void
  open: boolean
  align?: PropertyPopoverDropdownPlacement['align']
  className?: string
  clear?: { label: string; onClear: () => void }
  disabled?: boolean
  dropdownPlacement?: PropertyPopoverDropdownPlacement
  muted?: boolean
  variant?: PropertyVariant
}

export function PropertyCalendarPopover({
  align = 'start',
  ariaLabel,
  children,
  className,
  clear,
  disabled,
  dropdownPlacement,
  icon: Icon,
  label,
  muted = false,
  onOpenChange,
  open,
  variant,
}: Readonly<PropertyCalendarPopoverProps>) {
  return (
    <Popover onOpenChange={onOpenChange} open={open}>
      <PopoverTrigger
        aria-label={`${ariaLabel}: ${label}`}
        disabled={disabled}
        render={
          <PropertySurface
            className={cn('max-w-full', className)}
            muted={muted}
            render={<button type="button" />}
            variant={variant}
          />
        }
      >
        <Icon aria-hidden className="size-3" />
        <span className="truncate">{label}</span>
      </PopoverTrigger>
      <PopoverPopup
        align={align}
        aria-label={ariaLabel}
        className="w-auto"
        side="bottom"
        {...dropdownPlacement}
      >
        {children}
        {clear ? (
          <div className="border-t p-2">
            <Button
              className="w-full justify-start"
              onClick={clear.onClear}
              size="sm"
              type="button"
              variant="ghost"
            >
              {clear.label}
            </Button>
          </div>
        ) : null}
      </PopoverPopup>
    </Popover>
  )
}
