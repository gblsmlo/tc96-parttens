'use client'

import { cn } from '@tc96/utils'
import { useMemo } from 'react'
import { emitChange, isEditable } from '../../shared/lib/property-change'
import { resolveOptions } from '../../shared/lib/property-options'
import type {
  PropertyListChangeContext,
  PropertyMultiSelectDropdownPlacement,
} from '../../shared/property-catalog'
import { propertyDisplayIcons } from '../../shared/property-display-meta'
import {
  defaultPropertyAriaLabels,
  defaultPropertyLabels,
  defaultPropertyPlaceholders,
  type PeoplePropertyLabels,
  resolvePropertyLabels,
} from '../../shared/property-labels'
import { PropertyMultiSelectShell } from '../../shared/property-multi-select-shell'
import { PropertyRow } from '../../shared/property-row'
import {
  PropertySurface,
  type PropertyVariant,
} from '../../shared/property-surface'
import {
  PersonOptionContent,
  type PersonPropertyOption,
} from '../person/person-option-content'

export interface PeoplePropertyProps<TValue extends string = string> {
  value: readonly TValue[]
  options: readonly PersonPropertyOption<TValue>[]
  action?: (
    value: readonly TValue[],
    context: PropertyListChangeContext<PersonPropertyOption<TValue>, TValue>,
  ) => void
  ariaLabel?: string
  className?: string
  disabled?: boolean
  dropdownPlacement?: PropertyMultiSelectDropdownPlacement
  isLoading?: boolean
  labels?: Partial<PeoplePropertyLabels>
  placeholder?: string
  readOnly?: boolean
  variant?: PropertyVariant
  onValueChange?: (value: readonly TValue[]) => void
}

export function PeopleProperty<TValue extends string = string>({
  action,
  ariaLabel = defaultPropertyAriaLabels.people,
  className,
  disabled = false,
  dropdownPlacement,
  isLoading = false,
  labels: labelOverrides,
  onValueChange,
  options,
  placeholder = defaultPropertyPlaceholders.people,
  readOnly = false,
  value,
  variant = 'plain',
}: Readonly<PeoplePropertyProps<TValue>>) {
  const labels = resolvePropertyLabels(
    defaultPropertyLabels.people,
    labelOverrides,
  )
  const selectedOptions = useMemo(
    () => resolveOptions(options, value),
    [options, value],
  )

  if (!isEditable({ action, onValueChange, readOnly })) {
    return (
      <PropertyRow
        ariaLabel={ariaLabel}
        className={cn('flex flex-wrap gap-1.5', className)}
        slot="people-property"
        variant={variant}
      >
        {selectedOptions.length > 0 ? (
          selectedOptions.map((option) => (
            <PropertySurface key={option.value} variant={variant}>
              <PersonOptionContent option={option} size="xs" />
            </PropertySurface>
          ))
        ) : (
          <PropertySurface className="text-muted-foreground" variant={variant}>
            {placeholder}
          </PropertySurface>
        )}
      </PropertyRow>
    )
  }

  return (
    <PropertyRow
      ariaLabel={ariaLabel}
      className={cn('w-full', className)}
      slot="people-property"
      variant={variant}
    >
      <PropertyMultiSelectShell
        addIcon={propertyDisplayIcons.personAdd}
        addLabel={labels.add}
        ariaLabel={ariaLabel}
        disabled={disabled}
        dropdownPlacement={dropdownPlacement}
        emptyLabel={labels.empty}
        isLoading={isLoading}
        loadingLabel={labels.loading}
        onChange={(nextValue, change) =>
          emitChange({ action, onValueChange }, nextValue, change)
        }
        options={options}
        placeholder={placeholder}
        removeLabel={(option) => `${labels.remove} ${option.label}`}
        renderChip={(option) => (
          <PersonOptionContent option={option} size="xs" />
        )}
        renderOption={(option) => <PersonOptionContent option={option} />}
        selectedOptions={selectedOptions}
        value={value}
        variant={variant}
      />
    </PropertyRow>
  )
}
