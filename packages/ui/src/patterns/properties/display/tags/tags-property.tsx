'use client'

import { cn } from '@tc96/utils'
import { useMemo } from 'react'
import { emitChange, isEditable } from '../../shared/lib/property-change'
import { resolveOptions } from '../../shared/lib/property-options'
import type {
  PropertyListChangeContext,
  PropertyMultiSelectDropdownPlacement,
  PropertyOption,
} from '../../shared/property-catalog'
import { propertyDisplayIcons } from '../../shared/property-display-meta'
import {
  defaultPropertyAriaLabels,
  defaultPropertyLabels,
  defaultPropertyPlaceholders,
  resolvePropertyLabels,
  type TagsPropertyLabels,
} from '../../shared/property-labels'
import { PropertyMultiSelectShell } from '../../shared/property-multi-select-shell'
import { PropertyRow } from '../../shared/property-row'
import {
  PropertySurface,
  type PropertyVariant,
} from '../../shared/property-surface'

const TagIcon = propertyDisplayIcons.tags

export interface TagsPropertyProps<TValue extends string = string> {
  value: readonly TValue[]
  options: readonly PropertyOption<TValue>[]
  action?: (
    value: readonly TValue[],
    context: PropertyListChangeContext<PropertyOption<TValue>, TValue>,
  ) => void
  ariaLabel?: string
  className?: string
  disabled?: boolean
  display?: 'chips' | 'count'
  dropdownPlacement?: PropertyMultiSelectDropdownPlacement
  isLoading?: boolean
  labels?: Partial<TagsPropertyLabels>
  placeholder?: string
  readOnly?: boolean
  variant?: PropertyVariant
  onValueChange?: (value: readonly TValue[]) => void
}

export function TagsProperty<TValue extends string = string>({
  action,
  ariaLabel = defaultPropertyAriaLabels.tags,
  className,
  disabled = false,
  display = 'chips',
  dropdownPlacement,
  isLoading = false,
  labels: labelOverrides,
  onValueChange,
  options,
  placeholder = defaultPropertyPlaceholders.tags,
  readOnly = false,
  value,
  variant = 'plain',
}: Readonly<TagsPropertyProps<TValue>>) {
  const labels = resolvePropertyLabels(
    defaultPropertyLabels.tags,
    labelOverrides,
  )
  const selectedOptions = useMemo(
    () => resolveOptions(options, value),
    [options, value],
  )

  const countText = labels.count(selectedOptions.length)

  if (!isEditable({ action, onValueChange, readOnly })) {
    return (
      <PropertyRow
        ariaLabel={ariaLabel}
        className={cn('flex flex-wrap gap-1', className)}
        data-display={display}
        slot="tags-property"
        variant={variant}
      >
        {display === 'count' ? (
          <PropertySurface
            muted={selectedOptions.length === 0}
            variant={variant}
          >
            <TagIcon aria-hidden="true" className="size-4 shrink-0" />
            <span className="tabular-nums">{countText}</span>
          </PropertySurface>
        ) : selectedOptions.length > 0 ? (
          selectedOptions.map((option) => (
            <PropertySurface key={option.value} variant={variant}>
              {option.label}
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
    <div
      className={cn(
        display === 'count' ? 'min-w-0' : 'min-w-0 w-full',
        className,
      )}
      data-display={display}
      data-slot="tags-property"
      data-variant={variant}
    >
      <PropertyMultiSelectShell
        addIcon={TagIcon}
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
        placeholder={labels.add}
        removeLabel={(option) => `${labels.remove} ${option.label}`}
        renderOption={(option) => option.label}
        renderTrigger={
          display === 'count'
            ? ({ anchorRef, open }) => (
                <PropertySurface
                  aria-label={`${ariaLabel}: ${countText}`}
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
                  <TagIcon aria-hidden="true" className="size-4 shrink-0" />
                  <span className="tabular-nums">{countText}</span>
                </PropertySurface>
              )
            : undefined
        }
        selectedOptions={selectedOptions}
        value={value}
        variant={variant}
      />
    </div>
  )
}
