'use client'

import { getInitials } from '@tc96/helpers/initials'
import { Avatar, AvatarFallback, AvatarImage } from '@tc96/ui/avatar'
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
import { PlusIcon, UserPlusIcon } from 'lucide-react'
import type React from 'react'
import { useMemo, useState } from 'react'
import {
  PropertySurface,
  type PropertyVariant,
} from '../../shared/property-surface'

export interface PeoplePropertyOption<TValue extends string = string> {
  value: TValue
  label: string
  fallback?: string
  imageUrl?: string
  supportingLabel?: string
}

export type PeoplePropertyDropdownPlacement = Pick<
  React.ComponentProps<typeof ComboboxPopup>,
  'align' | 'alignOffset' | 'side' | 'sideOffset'
>

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

/**
 * Chips aplicados mais gatilho de adicionar como último elemento, na anatomia
 * que `TagsProperty` já fixa — cada chip aqui carrega avatar e nome, como
 * `PersonProperty` já desenha para o valor único.
 */
export function PeopleProperty<TValue extends string = string>({
  action,
  ariaLabel = 'Pessoas',
  className,
  disabled = false,
  dropdownPlacement,
  isLoading = false,
  onValueChange,
  options,
  placeholder = 'Adicionar pessoa',
  readOnly = false,
  value,
  variant = 'plain',
}: Readonly<PeoplePropertyProps<TValue>>) {
  const [open, setOpen] = useState(false)
  const selectedOptions = useMemo(
    () =>
      value.map(
        (selectedValue) =>
          options.find((option) => option.value === selectedValue) ?? {
            label: selectedValue,
            value: selectedValue,
          },
      ),
    [options, value],
  )
  const canUpdate = Boolean(action ?? onValueChange)

  if (readOnly || !canUpdate) {
    return (
      <fieldset
        aria-label={ariaLabel}
        className={cn(
          'm-0 flex min-w-0 flex-wrap gap-1.5 border-0 p-0',
          className,
        )}
        data-slot="people-property"
        data-variant={variant}
      >
        {selectedOptions.length > 0 ? (
          selectedOptions.map((option) => (
            <PropertySurface key={option.value} variant={variant}>
              <PersonChipContent option={option} />
            </PropertySurface>
          ))
        ) : (
          <PropertySurface className="text-muted-foreground" variant={variant}>
            {placeholder}
          </PropertySurface>
        )}
      </fieldset>
    )
  }

  return (
    <fieldset
      aria-label={ariaLabel}
      className={cn('m-0 min-w-0 w-full border-0 p-0', className)}
      data-slot="people-property"
      data-variant={variant}
    >
      <Combobox<PeoplePropertyOption<TValue>, true>
        autoHighlight
        disabled={disabled}
        itemToStringLabel={(option) => option.label}
        itemToStringValue={(option) => option.value}
        items={options}
        multiple
        onOpenChange={setOpen}
        onValueChange={(nextOptions) => {
          const nextValue = nextOptions.map((option) => option.value)
          const previousValues = new Set(value)
          const nextValues = new Set(nextValue)
          const added =
            nextOptions.find((option) => !previousValues.has(option.value)) ??
            null
          const removed =
            selectedOptions.find((option) => !nextValues.has(option.value)) ??
            null

          if (action) {
            action(nextValue, { added, previousValue: value, removed })
            return
          }
          onValueChange?.(nextValue)
        }}
        open={open}
        value={selectedOptions}
      >
        <ComboboxChips
          className={cn(
            variant === 'plain' &&
              'min-h-7 border-transparent! bg-transparent! p-0 shadow-none! before:hidden sm:min-h-6',
          )}
        >
          {selectedOptions.map((option) => (
            <ComboboxChip
              key={option.value}
              removeProps={{ 'aria-label': `Remover ${option.label}` }}
            >
              <PersonChipContent option={option} />
            </ComboboxChip>
          ))}
          <Button
            aria-label={
              selectedOptions.length > 0 ? 'Adicionar pessoa' : undefined
            }
            className={cn(
              '[&_svg]:mx-0',
              selectedOptions.length > 0 ? 'size-6 px-0' : 'gap-1',
            )}
            disabled={disabled}
            onClick={() => setOpen(true)}
            size="xs"
            type="button"
            variant="secondary"
          >
            {selectedOptions.length > 0 ? (
              <PlusIcon aria-hidden="true" className="size-3.5" />
            ) : (
              <>
                <UserPlusIcon aria-hidden="true" className="size-3.5" />
                {placeholder}
              </>
            )}
          </Button>
        </ComboboxChips>
        <ComboboxPopup
          {...dropdownPlacement}
          align={dropdownPlacement?.align ?? 'end'}
          aria-label={ariaLabel}
          className="w-64 min-w-0! max-w-[calc(100vw-2rem)]"
        >
          {isLoading ? (
            <ComboboxStatus>Carregando pessoas…</ComboboxStatus>
          ) : null}
          <ComboboxEmpty>Nenhuma pessoa encontrada.</ComboboxEmpty>
          <ComboboxList aria-label={ariaLabel}>
            {(option) => (
              <ComboboxItem key={option.value} value={option}>
                <PersonChipContent option={option} />
              </ComboboxItem>
            )}
          </ComboboxList>
        </ComboboxPopup>
      </Combobox>
    </fieldset>
  )
}

function PersonChipContent<TValue extends string = string>({
  option,
}: Readonly<{ option: PeoplePropertyOption<TValue> }>) {
  return (
    <span className="flex min-w-0 items-center gap-1.5">
      <Avatar className="size-4 text-sm">
        {option.imageUrl ? <AvatarImage alt="" src={option.imageUrl} /> : null}
        <AvatarFallback className="bg-muted/40 text-[0.625rem]">
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
