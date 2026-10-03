'use client'

import { MenuPrimitive } from '@tc96/ui/menu'
import { cn } from '@tc96/utils'
import type React from 'react'

const selectionItemClassName =
  "grid min-h-8 in-data-[side=none]:min-w-[calc(var(--anchor-width)+1.25rem)] cursor-default grid-cols-[1fr_.75rem] items-center gap-4 rounded-sm py-1 ps-2 pe-2.5 text-base text-foreground outline-none data-disabled:pointer-events-none data-highlighted:bg-accent data-highlighted:text-accent-foreground data-disabled:opacity-64 sm:min-h-7 sm:text-sm [&_svg:not([class*='size-'])]:size-4.5 sm:[&_svg:not([class*='size-'])]:size-4 [&_svg]:pointer-events-none [&_svg]:shrink-0"

function CheckIcon(): React.ReactElement {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      height="24"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      viewBox="0 0 24 24"
      width="24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M5.252 12.7 10.2 18.63 18.748 5.37" />
    </svg>
  )
}

export type MenuRadioOptionProps = MenuPrimitive.RadioItem.Props

export function MenuRadioOption({
  className,
  children,
  ...props
}: MenuRadioOptionProps): React.ReactElement {
  return (
    <MenuPrimitive.RadioItem
      className={cn(selectionItemClassName, className)}
      data-slot="menu-radio-option"
      {...props}
    >
      <span className="col-start-1 flex min-w-0 items-center gap-2">
        {children}
      </span>
      <MenuPrimitive.RadioItemIndicator className="col-start-2 -me-0.5">
        <CheckIcon />
      </MenuPrimitive.RadioItemIndicator>
    </MenuPrimitive.RadioItem>
  )
}

export type MenuCheckboxOptionProps = MenuPrimitive.CheckboxItem.Props

export function MenuCheckboxOption({
  className,
  children,
  ...props
}: MenuCheckboxOptionProps): React.ReactElement {
  return (
    <MenuPrimitive.CheckboxItem
      className={cn(selectionItemClassName, className)}
      data-slot="menu-checkbox-option"
      {...props}
    >
      <span className="col-start-1 flex min-w-0 items-center gap-2">
        {children}
      </span>
      <MenuPrimitive.CheckboxItemIndicator className="col-start-2 -me-0.5">
        <CheckIcon />
      </MenuPrimitive.CheckboxItemIndicator>
    </MenuPrimitive.CheckboxItem>
  )
}
