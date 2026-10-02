'use client'

import { Avatar, AvatarFallback, AvatarImage } from '@tc96/ui/avatar'
import { SelectItem } from '@tc96/ui/select'
import { cn } from '@tc96/utils'
import { UserIcon, UserPlusIcon } from 'lucide-react'
import {
  type PropertySelectDropdownPlacement,
  PropertySelectShell,
  propertySelectItemClassName,
} from '../../shared/property-select-shell'
import {
  PropertySurface,
  type PropertyVariant,
} from '../../shared/property-surface'

export interface PersonPropertyOption<TValue extends string = string> {
  value: TValue
  label: string
  fallback?: string
  imageUrl?: string
  supportingLabel?: string
}

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
  const selectedOption = value ? findPersonOption(options, value) : null
  const accessibleLabel = ariaLabel ?? 'Person'
  const canUpdate = Boolean(action ?? onValueChange)

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
          if (action) {
            action(option.value, {
              option,
              previousValue: value,
            })
            return
          }
          onValueChange?.(option.value)
        }
      }}
      muted={!selectedOption}
      readOnly={readOnly || !canUpdate}
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
  if (display === 'avatar') {
    return (
      <Avatar className="size-4 text-sm">
        {option?.imageUrl ? <AvatarImage alt="" src={option.imageUrl} /> : null}
        <AvatarFallback>
          {option ? (
            (option.fallback ?? getInitials(option.label))
          ) : (
            <UserIcon aria-hidden className="size-3" />
          )}
        </AvatarFallback>
      </Avatar>
    )
  }

  if (!option) {
    return (
      <span className="flex min-w-0 items-center gap-1.5 text-muted-foreground">
        <UserPlusIcon aria-hidden className="size-3" />
        <span className="truncate">{placeholder}</span>
      </span>
    )
  }

  return (
    <span className="flex min-w-0 items-center gap-1.5">
      <Avatar
        className={cn(
          variant === 'badge' ? 'size-4' : 'size-7',
          'text-[0.625rem]',
        )}
      >
        {option.imageUrl ? <AvatarImage alt="" src={option.imageUrl} /> : null}
        <AvatarFallback>
          {option.fallback ?? getInitials(option.label)}
        </AvatarFallback>
      </Avatar>
      <span className="min-w-0 truncate">{option.label}</span>
      {option.supportingLabel ? (
        <span className="hidden text-muted-foreground text-xs sm:inline">
          {option.supportingLabel}
        </span>
      ) : null}
    </span>
  )
}

function findPersonOption<TValue extends string>(
  options: readonly PersonPropertyOption<TValue>[],
  value: TValue,
): PersonPropertyOption<TValue> {
  const selectedOption = options.find((option) => option.value === value)
  if (selectedOption) return selectedOption
  return {
    label: value,
    value,
  }
}

function getInitials(label: string, size = 2): string {
  return label
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, size)
    .map((part) => part[0])
    .join('')
    .toUpperCase()
}
