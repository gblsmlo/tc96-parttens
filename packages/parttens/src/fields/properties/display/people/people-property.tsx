'use client'

import { cn } from '@tc96/utils'
import { UserPlusIcon } from 'lucide-react'
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
import {
  PersonOptionContent,
  type PersonPropertyOption,
} from '../person/person-option-content'

const addPersonLabel = 'Adicionar pessoa'

export type PeoplePropertyOption<TValue extends string = string> =
  PersonPropertyOption<TValue>

export type PeoplePropertyDropdownPlacement =
  PropertyMultiSelectDropdownPlacement

export interface PeoplePropertyActionContext<TValue extends string = string> {
  added: PeoplePropertyOption<TValue> | null
  previousValue: readonly TValue[]
  removed: PeoplePropertyOption<TValue> | null
}

export interface PeoplePropertyProps<TValue extends string = string> {
  value: readonly TValue[]
  options: readonly PeoplePropertyOption<TValue>[]
  action?: (
    value: readonly TValue[],
    context: PeoplePropertyActionContext<TValue>,
  ) => void
  ariaLabel?: string
  className?: string
  disabled?: boolean
  dropdownPlacement?: PeoplePropertyDropdownPlacement
  isLoading?: boolean
  placeholder?: string
  readOnly?: boolean
  variant?: PropertyVariant
  onValueChange?: (value: readonly TValue[]) => void
}

export function PeopleProperty<TValue extends string = string>({
  action,
  ariaLabel = 'Pessoas',
  className,
  disabled = false,
  dropdownPlacement,
  isLoading = false,
  onValueChange,
  options,
  placeholder = addPersonLabel,
  readOnly = false,
  value,
  variant = 'plain',
}: Readonly<PeoplePropertyProps<TValue>>) {
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
              <PersonOptionContent option={option} />
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
        addIcon={UserPlusIcon}
        addLabel={addPersonLabel}
        ariaLabel={ariaLabel}
        disabled={disabled}
        dropdownPlacement={dropdownPlacement}
        emptyLabel="Nenhuma pessoa encontrada."
        isLoading={isLoading}
        loadingLabel="Carregando pessoas…"
        onChange={(nextValue, change) =>
          emitChange({ action, onValueChange }, nextValue, change)
        }
        options={options}
        placeholder={placeholder}
        removeLabel={(option) => `Remover ${option.label}`}
        renderOption={(option) => <PersonOptionContent option={option} />}
        selectedOptions={selectedOptions}
        value={value}
        variant={variant}
      />
    </PropertyRow>
  )
}
