'use client'

import { Select, SelectPopup, SelectPrimitive } from '@tc96/ui/select'
import { cn } from '@tc96/utils'
import type { ComponentProps, ReactNode } from 'react'
import { PropertySurface, type PropertyVariant } from './property-surface'

export type PropertySelectDropdownPlacement = Pick<
  ComponentProps<typeof SelectPopup>,
  'align' | 'alignItemWithTrigger' | 'alignOffset' | 'side' | 'sideOffset'
>

export interface PropertySelectShellProps<
  TOption extends { label: ReactNode; value: string },
> {
  ariaLabel: string
  children: ReactNode
  className?: string
  disabled?: boolean
  dropdownPlacement?: PropertySelectDropdownPlacement
  items: readonly TOption[]
  itemToStringLabel: (option: TOption) => string
  itemToStringValue: (option: TOption) => string
  muted?: boolean
  onValueChange: (option: TOption | null) => void
  readOnly?: boolean
  renderValue: (option: TOption | null) => ReactNode
  value: TOption | null
  variant?: PropertyVariant
}

export function PropertySelectShell<
  TOption extends { label: ReactNode; value: string },
>({
  ariaLabel,
  children,
  className,
  disabled = false,
  dropdownPlacement,
  items,
  itemToStringLabel,
  itemToStringValue,
  muted = false,
  onValueChange,
  readOnly = false,
  renderValue,
  value,
  variant = 'badge',
}: Readonly<PropertySelectShellProps<TOption>>) {
  if (readOnly) {
    return (
      <PropertySurface
        aria-label={ariaLabel}
        className={cn('max-w-full', className)}
        muted={muted}
        role="img"
        variant={variant}
      >
        {renderValue(value)}
      </PropertySurface>
    )
  }

  return (
    <Select<TOption>
      itemToStringLabel={itemToStringLabel}
      itemToStringValue={itemToStringValue}
      items={[...items]}
      onValueChange={onValueChange}
      value={value}
    >
      <SelectPrimitive.Trigger
        aria-label={ariaLabel}
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
        {renderValue(value)}
      </SelectPrimitive.Trigger>
      <SelectPopup {...dropdownPlacement}>{children}</SelectPopup>
    </Select>
  )
}

export const propertySelectItemClassName =
  'grid-cols-[minmax(0,1fr)_.75rem] gap-4 pe-2.5 *:row-start-1 [&>*:last-child]:col-start-1 [&>span:first-child:not(:last-child)]:col-start-2 [&>span:first-child:not(:last-child)]:-me-0.5'
