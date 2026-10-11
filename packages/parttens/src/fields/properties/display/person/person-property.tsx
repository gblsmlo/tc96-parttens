'use client'

import { SelectItem } from '@tc96/ui/select'
import { cn } from '@tc96/utils'
import { UserPlusIcon } from 'lucide-react'
import { emitChange, isEditable } from '../../shared/lib/property-change'
import { resolveOption } from '../../shared/lib/property-options'
import {
  type PropertySelectDropdownPlacement,
  PropertySelectShell,
  propertySelectItemClassName,
} from '../../shared/property-select-shell'
import {
  PropertySurface,
  type PropertyVariant,
} from '../../shared/property-surface'
import {
  PersonAvatar,
  PersonOptionContent,
  type PersonPropertyOption,
} from './person-option-content'

export type { PersonPropertyOption }

export type PersonPropertyDropdownPlacement = PropertySelectDropdownPlacement

export interface PersonPropertyActionContext<TValue extends string = string> {
  option: PersonPropertyOption<TValue>
  previousValue: TValue | null
}

export interface PersonPropertyProps<TValue extends string = string> {
  value: TValue | null
  options: readonly PersonPropertyOption<TValue>[]
  action?: (value: TValue, context: PersonPropertyActionContext<TValue>) => void
  ariaLabel?: string
  className?: string
  disabled?: boolean
  display?: 'avatar' | 'full'
  dropdownPlacement?: PersonPropertyDropdownPlacement
  placeholder?: string
  readOnly?: boolean
  variant?: PropertyVariant
  onValueChange?: (value: TValue) => void
}

export function PersonProperty<TValue extends string = string>({
  action,
  ariaLabel,
  className,
  disabled = false,
  display = 'full',
  dropdownPlacement,
  onValueChange,
  options,
  placeholder = 'Sem responsável',
  readOnly = false,
  value,
  variant = 'badge',
}: Readonly<PersonPropertyProps<TValue>>) {
  const selectedOption = value ? resolveOption(options, value) : null
  const accessibleLabel = ariaLabel ?? 'Person'

  return (
    <PropertySelectShell
      ariaLabel={`${accessibleLabel}: ${selectedOption?.label ?? placeholder}`}
      className={className}
      disabled={disabled}
      dropdownPlacement={dropdownPlacement}
      items={options}
      itemToStringLabel={(option) => option.label}
      itemToStringValue={(option) => option.value}
      onValueChange={(option) => {
        if (option && option.value !== value) {
          emitChange({ action, onValueChange }, option.value, {
            option,
            previousValue: value,
          })
        }
      }}
      muted={!selectedOption}
      readOnly={!isEditable({ action, onValueChange, readOnly })}
      renderValue={(option) => (
        <PersonPropertyContent
          display={display}
          option={option}
          placeholder={placeholder}
          variant={variant}
        />
      )}
      variant={variant}
      value={selectedOption}
    >
      {options.map((option) => (
        <SelectItem
          aria-label={option.label}
          key={option.value}
          className={propertySelectItemClassName}
          value={option}
        >
          <PersonPropertyContent
            option={option}
            placeholder={placeholder}
            variant={variant}
          />
        </SelectItem>
      ))}
    </PropertySelectShell>
  )
}

export function PersonPropertyBadge<TValue extends string = string>({
  ariaLabel,
  className,
  display = 'full',
  option,
  placeholder = 'Sem responsável',
  variant = 'badge',
}: Readonly<{
  ariaLabel?: string
  className?: string
  display?: 'avatar' | 'full'
  option: PersonPropertyOption<TValue> | null
  placeholder?: string
  variant?: PropertyVariant
}>) {
  return (
    <PropertySurface
      aria-label={ariaLabel}
      className={cn('max-w-full', className)}
      muted={!option}
      variant={variant}
    >
      <PersonPropertyContent
        display={display}
        option={option}
        placeholder={placeholder}
        variant={variant}
      />
    </PropertySurface>
  )
}

function PersonPropertyContent<TValue extends string = string>({
  display,
  option,
  placeholder,
  variant,
}: Readonly<{
  display?: 'avatar' | 'full'
  option: PersonPropertyOption<TValue> | null
  placeholder: string
  variant: PropertyVariant
}>) {
  if (display === 'avatar') return <PersonAvatar option={option} />

  if (!option) {
    return (
      <span className="flex min-w-0 items-center gap-1.5 text-muted-foreground">
        <UserPlusIcon aria-hidden className="size-3" />
        <span className="truncate">{placeholder}</span>
      </span>
    )
  }

  return (
    <PersonOptionContent
      avatarClassName={variant === 'badge' ? 'size-4' : 'size-7'}
      option={option}
    />
  )
}
