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
  PersonAvatar,
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
  display?: 'chips' | 'stack'
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
  display = 'chips',
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

  const stack =
    display === 'stack' && selectedOptions.length > 1 ? (
      <>
        <span className="flex shrink-0 -space-x-1.5" data-slot="people-stack">
          {selectedOptions.slice(0, 3).map((option) => (
            <PersonAvatar key={option.value} option={option} size="xs" />
          ))}
        </span>
        <span className="truncate tabular-nums">
          {labels.count(selectedOptions.length)}
        </span>
      </>
    ) : display === 'stack' && selectedOptions[0] ? (
      <PersonOptionContent option={selectedOptions[0]} size="xs" />
    ) : null
  const stackText =
    selectedOptions.length > 1
      ? labels.count(selectedOptions.length)
      : (selectedOptions[0]?.label ?? placeholder)

  if (!isEditable({ action, onValueChange, readOnly })) {
    if (display === 'stack')
      return (
        <PropertyRow
          ariaLabel={ariaLabel}
          className={cn('flex min-w-0', className)}
          data-display={display}
          slot="people-property"
          variant={variant}
        >
          <PropertySurface
            muted={selectedOptions.length === 0}
            variant={variant}
          >
            {stack ?? placeholder}
          </PropertySurface>
        </PropertyRow>
      )
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
      className={cn(display === 'stack' ? 'min-w-0' : 'w-full', className)}
      data-display={display}
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
        renderTrigger={
          display === 'stack'
            ? ({ anchorRef, open }) => (
                <PropertySurface
                  aria-label={`${ariaLabel}: ${stackText}`}
                  muted={selectedOptions.length === 0}
                  render={
                    <button
                      disabled={disabled}
                      onClick={open}
                      ref={anchorRef}
                      type="button"
                    />
                  }
                  variant={variant}
                >
                  {stack ?? placeholder}
                </PropertySurface>
              )
            : undefined
        }
        selectedOptions={selectedOptions}
        value={value}
        variant={variant}
      />
    </PropertyRow>
  )
}
