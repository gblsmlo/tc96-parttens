'use client'

import { SelectItem } from '@tc96/ui/select'
import { cn } from '@tc96/utils'
import { emitChange, isEditable } from '../../shared/lib/property-change'
import { resolveOption } from '../../shared/lib/property-options'
import type {
  PropertyChangeContext,
  PropertySelectDropdownPlacement,
} from '../../shared/property-catalog'
import { propertyDisplayIcons } from '../../shared/property-display-meta'
import {
  defaultPropertyAriaLabels,
  defaultPropertyPlaceholders,
} from '../../shared/property-labels'
import {
  PropertySelectShell,
  propertySelectItemClassName,
} from '../../shared/property-select-shell'
import {
  PropertySurface,
  type PropertyVariant,
} from '../../shared/property-surface'
import {
  PersonAvatar,
  type PersonAvatarSize,
  PersonOptionContent,
  type PersonPropertyOption,
} from './person-option-content'

export type { PersonPropertyOption }

export interface PersonPropertyActionContext<TValue extends string = string>
  extends PropertyChangeContext<TValue | null> {
  option: PersonPropertyOption<TValue>
}

export interface PersonPropertyProps<TValue extends string = string> {
  value: TValue | null
  options: readonly PersonPropertyOption<TValue>[]
  action?: (value: TValue, context: PersonPropertyActionContext<TValue>) => void
  ariaLabel?: string
  avatarSize?: PersonAvatarSize
  className?: string
  disabled?: boolean
  display?: 'avatar' | 'full'
  dropdownPlacement?: PropertySelectDropdownPlacement
  placeholder?: string
  readOnly?: boolean
  variant?: PropertyVariant
  onValueChange?: (value: TValue) => void
}

export function PersonProperty<TValue extends string = string>({
  action,
  ariaLabel,
  avatarSize = 'xs',
  className,
  disabled = false,
  display = 'full',
  dropdownPlacement,
  onValueChange,
  options,
  placeholder = defaultPropertyPlaceholders.person,
  readOnly = false,
  value,
  variant = 'badge',
}: Readonly<PersonPropertyProps<TValue>>) {
  const selectedOption = value ? resolveOption(options, value) : null
  const accessibleLabel = ariaLabel ?? defaultPropertyAriaLabels.person

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
          avatarSize={avatarSize}
          display={display}
          option={option}
          placeholder={placeholder}
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
          <PersonPropertyContent option={option} placeholder={placeholder} />
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
  placeholder = defaultPropertyPlaceholders.person,
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
        avatarSize="xs"
        display={display}
        option={option}
        placeholder={placeholder}
      />
    </PropertySurface>
  )
}

function PersonPropertyContent<TValue extends string = string>({
  avatarSize,
  display,
  option,
  placeholder,
}: Readonly<{
  avatarSize?: PersonAvatarSize
  display?: 'avatar' | 'full'
  option: PersonPropertyOption<TValue> | null
  placeholder: string
}>) {
  if (display === 'avatar') {
    return <PersonAvatar option={option} size={avatarSize} />
  }

  if (!option) {
    const AddIcon = propertyDisplayIcons.personAdd

    return (
      <span className="flex min-w-0 items-center gap-1.5 text-muted-foreground">
        <AddIcon aria-hidden className="size-4" />
        <span className="truncate">{placeholder}</span>
      </span>
    )
  }

  return <PersonOptionContent option={option} size={avatarSize} />
}
