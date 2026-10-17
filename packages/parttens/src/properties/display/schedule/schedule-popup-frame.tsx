'use client'

import { PopoverPrimitive } from '@tc96/ui/popover'
import type { ReactNode } from 'react'
import type { PropertyPopoverDropdownPlacement } from '../../shared/property-calendar-popover'

export type SchedulePropertyDropdownPlacement =
  PropertyPopoverDropdownPlacement &
    Pick<PopoverPrimitive.Positioner.Props, 'collisionAvoidance'>

export function SchedulePopupFrame({
  ariaLabel,
  children,
  placement: {
    align = 'start',
    alignOffset = 0,
    collisionAvoidance,
    side = 'bottom',
    sideOffset = 4,
  } = {},
}: Readonly<{
  ariaLabel: string
  children: ReactNode
  placement?: SchedulePropertyDropdownPlacement
}>) {
  return (
    <PopoverPrimitive.Portal>
      <PopoverPrimitive.Positioner
        align={align}
        alignOffset={alignOffset}
        className="z-50 max-w-(--available-width)"
        collisionAvoidance={collisionAvoidance}
        data-slot="popover-positioner"
        side={side}
        sideOffset={sideOffset}
      >
        <PopoverPrimitive.Popup
          aria-label={ariaLabel}
          className="relative flex max-h-(--available-height) origin-(--transform-origin) rounded-xl border bg-popover not-dark:bg-clip-padding text-popover-foreground shadow-lg/5 outline-none transition-[scale,opacity] before:pointer-events-none before:absolute before:inset-0 before:rounded-[calc(var(--radius-xl)-1px)] before:shadow-[0_1px_--theme(--color-black/4%)] data-starting-style:scale-98 data-starting-style:opacity-0 dark:before:shadow-[0_-1px_--theme(--color-white/6%)]"
          data-slot="popover-popup"
        >
          <div className="relative min-h-0 w-full overflow-y-auto p-2">
            {children}
          </div>
        </PopoverPrimitive.Popup>
      </PopoverPrimitive.Positioner>
    </PopoverPrimitive.Portal>
  )
}
