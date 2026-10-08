'use client'

import { cn } from '@tc96/utils'
import { TagIcon } from 'lucide-react'
import { useMemo } from 'react'
import { emitChange, isEditable } from '../../shared/lib/property-change'
import { resolveOptions } from '../../shared/lib/property-options'
import {
  type PropertyMultiSelectDropdownPlacement,
  PropertyMultiSelectShell,
} from '../../shared/property-multi-select-shell'
import { PropertyRow } from '../../shared/property-row'
import {
  PropertySurface,
  type PropertyVariant,
} from '../../shared/property-surface'

const addTagLabel = 'Adicionar tag'

const tagsCountLabel = (count: number) =>
  `${count} ${count > 1 ? 'Tags' : 'Tag'}`

export interface TagsPropertyOption<TValue extends string = string> {
  label: string
  value: TValue
}

export type TagsPropertyDropdownPlacement = PropertyMultiSelectDropdownPlacement

export interface TagsPropertyActionContext<TValue extends string = string> {
  added: TagsPropertyOption<TValue> | null
  previousValue: readonly TValue[]
  removed: TagsPropertyOption<TValue> | null
}

export interface TagsPropertyProps<TValue extends string = string> {
  value: readonly TValue[]
  options: readonly TagsPropertyOption<TValue>[]
  action?: (
    value: readonly TValue[],
    context: TagsPropertyActionContext<TValue>,
  ) => void
  ariaLabel?: string
  className?: string
  disabled?: boolean
  display?: 'chips' | 'count'
  dropdownPlacement?: TagsPropertyDropdownPlacement
  isLoading?: boolean
  placeholder?: string
  readOnly?: boolean
  variant?: PropertyVariant
  onValueChange?: (value: readonly TValue[]) => void
}

export function TagsProperty<TValue extends string = string>({
  action,
  ariaLabel = 'Tags',
  className,
  disabled = false,
  display = 'chips',
  dropdownPlacement,
  isLoading = false,
  onValueChange,
  options,
  placeholder = 'Adicionar uma tag',
  readOnly = false,
  value,
  variant = 'plain',
}: Readonly<TagsPropertyProps<TValue>>) {
  const selectedOptions = useMemo(
    () => resolveOptions(options, value),
    [options, value],
  )

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
            <TagIcon aria-hidden="true" />
            <span className="tabular-nums">
              {tagsCountLabel(selectedOptions.length)}
            </span>
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
        addLabel={addTagLabel}
        ariaLabel={ariaLabel}
        disabled={disabled}
        dropdownPlacement={dropdownPlacement}
        emptyLabel="Nenhuma tag encontrada."
        isLoading={isLoading}
        loadingLabel="Carregando tags…"
        onChange={(nextValue, change) =>
          emitChange({ action, onValueChange }, nextValue, change)
        }
        options={options}
        placeholder={addTagLabel}
        removeLabel={(option) => `Remover tag ${option.label}`}
        renderOption={(option) => option.label}
        renderTrigger={
          display === 'count'
            ? ({ anchorRef, open }) => (
                <PropertySurface
                  aria-label={ariaLabel}
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
                  <TagIcon aria-hidden="true" />
                  <span className="tabular-nums">
                    {tagsCountLabel(selectedOptions.length)}
                  </span>
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
