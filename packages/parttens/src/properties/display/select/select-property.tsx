'use client'

import { SelectGroup, SelectGroupLabel, SelectItem } from '@tc96/ui/select'
import { cn } from '@tc96/utils'
import { CircleDashedIcon } from 'lucide-react'
import { useState } from 'react'
import { emitChange, isEditable } from '../../shared/lib/property-change'
import {
  type PropertyIcon,
  type PropertyTone,
  propertyToneClassName,
} from '../../shared/property-catalog'
import {
  type PropertySelectDropdownPlacement,
  PropertySelectShell,
  propertySelectItemClassName,
} from '../../shared/property-select-shell'
import type { PropertyVariant } from '../../shared/property-surface'

export interface SelectPropertyOption {
  label: string
  value: string
  icon?: PropertyIcon
  tone?: PropertyTone
}

export interface SelectPropertyGroup {
  label: string
  options: readonly SelectPropertyOption[]
}

export type SelectPropertyDropdownPlacement = PropertySelectDropdownPlacement

export interface SelectPropertyActionContext {
  previousValue: string | null
}

interface SelectPropertyBaseProps {
  ariaLabel: string
  value: string | null
  action?: (value: string | null, context: SelectPropertyActionContext) => void
  className?: string
  disabled?: boolean
  dropdownPlacement?: SelectPropertyDropdownPlacement
  placeholder?: string
  fallback?: string
  emptyOptionLabel?: string
  readOnly?: boolean
  variant?: PropertyVariant
  onValueChange?: (value: string | null) => void
}

export type SelectPropertyItems =
  | { groups?: undefined; options: readonly SelectPropertyOption[] }
  | { groups: readonly SelectPropertyGroup[]; options?: undefined }

export type SelectPropertyProps = SelectPropertyBaseProps & SelectPropertyItems

export function SelectProperty({
  action,
  ariaLabel,
  className,
  disabled = false,
  dropdownPlacement,
  emptyOptionLabel,
  fallback = '—',
  groups,
  onValueChange,
  options,
  placeholder,
  readOnly = false,
  value,
  variant = 'badge',
}: Readonly<SelectPropertyProps>) {
  const catalog = groups ? groups.flatMap((group) => group.options) : options
  const selectedOption =
    value === null ? undefined : catalog.find((o) => o.value === value)
  const emptyOption: SelectPropertyOption | null = emptyOptionLabel
    ? {
        icon: CircleDashedIcon,
        label: emptyOptionLabel,
        tone: 'neutral',
        value: '',
      }
    : null
  const [chosenEmpty, setChosenEmpty] = useState(false)
  const [seenValue, setSeenValue] = useState(value)
  if (seenValue !== value) {
    setSeenValue(value)
    if (value !== null) setChosenEmpty(false)
  }
  const explicitEmpty = emptyOption !== null && value === null && chosenEmpty
  const absent = value === null && !explicitEmpty

  const currentLabel =
    selectedOption?.label ??
    (explicitEmpty
      ? emptyOption.label
      : value === null
        ? (placeholder ?? fallback)
        : fallback)

  const accessibleLabel = absent ? ariaLabel : `${ariaLabel}: ${currentLabel}`
  const items = emptyOption ? [emptyOption, ...catalog] : catalog

  return (
    <PropertySelectShell
      ariaLabel={accessibleLabel}
      className={className}
      disabled={disabled}
      dropdownPlacement={dropdownPlacement}
      items={items}
      itemToStringLabel={(option) => option.label}
      itemToStringValue={(option) => option.value}
      muted={absent}
      onValueChange={(option) => {
        if (!option) return
        const next = option.value === '' ? null : option.value
        setChosenEmpty(next === null)
        if (next === value) return
        emitChange({ action, onValueChange }, next, { previousValue: value })
      }}
      readOnly={!isEditable({ action, onValueChange, readOnly })}
      variant={variant}
      renderValue={() => (
        <SelectPropertyContent
          label={currentLabel}
          option={selectedOption ?? (explicitEmpty ? emptyOption : undefined)}
        />
      )}
      value={selectedOption ?? (explicitEmpty ? emptyOption : null)}
    >
      {emptyOption ? (
        <SelectItem className={propertySelectItemClassName} value={emptyOption}>
          <SelectPropertyContent
            label={emptyOption.label}
            option={emptyOption}
          />
        </SelectItem>
      ) : null}
      {groups
        ? groups.map((group) => (
            <SelectGroup key={group.label}>
              <SelectGroupLabel>{group.label}</SelectGroupLabel>
              {group.options.map((option) => (
                <SelectItem
                  key={option.value}
                  className={propertySelectItemClassName}
                  value={option}
                >
                  <SelectPropertyContent label={option.label} option={option} />
                </SelectItem>
              ))}
            </SelectGroup>
          ))
        : catalog.map((option) => (
            <SelectItem
              key={option.value}
              className={propertySelectItemClassName}
              value={option}
            >
              <SelectPropertyContent label={option.label} option={option} />
            </SelectItem>
          ))}
    </PropertySelectShell>
  )
}

function SelectPropertyContent({
  label,
  option,
}: Readonly<{ label: string; option?: SelectPropertyOption }>) {
  const Icon = option?.icon

  return (
    <span className="flex min-w-0 items-center gap-1.5">
      {Icon ? (
        <Icon
          aria-hidden
          className={cn(
            'size-3',
            option?.tone ? propertyToneClassName[option.tone] : undefined,
          )}
        />
      ) : null}
      <span className="truncate">{label}</span>
    </span>
  )
}
