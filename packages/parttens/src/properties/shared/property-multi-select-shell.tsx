'use client'

import { Button } from '@tc96/ui/button'
import {
  Combobox,
  ComboboxChip,
  ComboboxChips,
  ComboboxEmpty,
  ComboboxItem,
  ComboboxList,
  ComboboxPopup,
  ComboboxStatus,
} from '@tc96/ui/combobox'
import { cn } from '@tc96/utils'
import { PlusIcon } from 'lucide-react'
import type { ComponentProps, ReactNode } from 'react'
import { useState } from 'react'
import {
  diffOptions,
  type OptionLike,
  type ResolvedOption,
} from './lib/property-options'
import type { PropertyIcon } from './property-catalog'
import type { PropertyVariant } from './property-surface'

export type PropertyMultiSelectDropdownPlacement = Pick<
  ComponentProps<typeof ComboboxPopup>,
  'align' | 'alignOffset' | 'side' | 'sideOffset'
>

export interface PropertyMultiSelectChange<TOption extends OptionLike> {
  added: ResolvedOption<TOption> | null
  previousValue: readonly TOption['value'][]
  removed: ResolvedOption<TOption> | null
}

export interface PropertyMultiSelectShellProps<TOption extends OptionLike> {
  addIcon: PropertyIcon
  addLabel: string
  ariaLabel: string
  emptyLabel: string
  loadingLabel: string
  onChange: (
    value: readonly TOption['value'][],
    change: PropertyMultiSelectChange<TOption>,
  ) => void
  options: readonly TOption[]
  placeholder: string
  removeLabel: (option: ResolvedOption<TOption>) => string
  renderOption: (option: ResolvedOption<TOption>) => ReactNode
  selectedOptions: ResolvedOption<TOption>[]
  value: readonly TOption['value'][]
  disabled?: boolean
  dropdownPlacement?: PropertyMultiSelectDropdownPlacement
  isLoading?: boolean
  renderTrigger?: (controls: { open: () => void }) => ReactNode
  variant?: PropertyVariant
}

export function PropertyMultiSelectShell<TOption extends OptionLike>({
  addIcon: AddIcon,
  addLabel,
  ariaLabel,
  disabled = false,
  dropdownPlacement,
  emptyLabel,
  isLoading = false,
  loadingLabel,
  onChange,
  options,
  placeholder,
  removeLabel,
  renderOption,
  renderTrigger,
  selectedOptions,
  value,
  variant = 'plain',
}: Readonly<PropertyMultiSelectShellProps<TOption>>) {
  const [open, setOpen] = useState(false)
  const hasValue = selectedOptions.length > 0
  const openList = () => setOpen(true)

  return (
    <Combobox<ResolvedOption<TOption>, true>
      autoHighlight
      disabled={disabled}
      itemToStringLabel={(option) => option.label}
      itemToStringValue={(option) => option.value}
      items={options}
      multiple
      onOpenChange={setOpen}
      onValueChange={(nextOptions) => {
        const nextValue = nextOptions.map((option) => option.value)

        onChange(nextValue, {
          ...diffOptions(options, value, nextValue),
          previousValue: value,
        })
      }}
      open={open}
      value={selectedOptions}
    >
      {renderTrigger ? (
        renderTrigger({ open: openList })
      ) : (
        <ComboboxChips
          className={cn(
            variant === 'plain' &&
              'min-h-7 border-transparent! bg-transparent! p-0 shadow-none! before:hidden sm:min-h-6',
          )}
        >
          {selectedOptions.map((option) => (
            <ComboboxChip
              key={option.value}
              removeProps={{ 'aria-label': removeLabel(option) }}
            >
              {renderOption(option)}
            </ComboboxChip>
          ))}
          <Button
            aria-label={hasValue ? addLabel : undefined}
            className={cn('[&_svg]:mx-0', hasValue ? 'size-6 px-0' : 'gap-1')}
            disabled={disabled}
            onClick={openList}
            size="xs"
            type="button"
            variant="secondary"
          >
            {hasValue ? (
              <PlusIcon aria-hidden="true" className="size-3.5" />
            ) : (
              <>
                <AddIcon aria-hidden="true" className="size-3.5" />
                {placeholder}
              </>
            )}
          </Button>
        </ComboboxChips>
      )}
      <ComboboxPopup
        {...dropdownPlacement}
        align={dropdownPlacement?.align ?? 'end'}
        aria-label={ariaLabel}
        className="w-64 min-w-0! max-w-[calc(100vw-2rem)]"
      >
        {isLoading ? <ComboboxStatus>{loadingLabel}</ComboboxStatus> : null}
        <ComboboxEmpty>{emptyLabel}</ComboboxEmpty>
        <ComboboxList aria-label={ariaLabel}>
          {(option: ResolvedOption<TOption>) => (
            <ComboboxItem key={option.value} value={option}>
              {renderOption(option)}
            </ComboboxItem>
          )}
        </ComboboxList>
      </ComboboxPopup>
    </Combobox>
  )
}
