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
import { PlusIcon, TagIcon } from 'lucide-react'
import type React from 'react'
import { useMemo, useState } from 'react'
import {
  PropertySurface,
  type PropertyVariant,
} from '../../shared/property-surface'

export interface TagsPropertyOption<TValue extends string = string> {
  label: string
  value: TValue
}

export type TagsPropertyDropdownPlacement = Pick<
  React.ComponentProps<typeof ComboboxPopup>,
  'align' | 'alignOffset' | 'side' | 'sideOffset'
>

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
  /**
   * `chips` mostra cada tag; `count` mostra só a quantidade num gatilho compacto,
   * para a linha de uma coleção, onde a largura pertence às outras propriedades.
   */
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
          'm-0 flex min-w-0 flex-wrap gap-1 border-0 p-0',
          className,
        )}
        data-display={display}
        data-slot="tags-property"
        data-variant={variant}
      >
        {display === 'count' ? (
          <PropertySurface variant={variant}>
            <TagIcon aria-hidden="true" />
            <span className="tabular-nums">{selectedOptions.length}</span>
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
      </fieldset>
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
      <Combobox<TagsPropertyOption<TValue>, true>
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
        {display === 'count' ? (
          <Button
            aria-label={ariaLabel}
            className="gap-1 px-1.5"
            disabled={disabled}
            onClick={() => setOpen(true)}
            size="sm"
            type="button"
            variant="ghost"
          >
            <TagIcon aria-hidden="true" />
            <span className="tabular-nums">{selectedOptions.length}</span>
          </Button>
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
                removeProps={{ 'aria-label': `Remover tag ${option.label}` }}
              >
                {option.label}
              </ComboboxChip>
            ))}
            {/* Sem tag nenhuma o gatilho precisa se explicar, e vira um chip
                rotulado. Com tags na fileira o contexto já está dado: sobra o
                sinal de adicionar, sem repetir a palavra ao lado de cada uma. */}
            <Button
              aria-label={
                selectedOptions.length > 0 ? 'Adicionar tag' : undefined
              }
              // `Button` traz `[&_svg]:-mx-0.5`; ao lado dos chips isso cola o
              // glifo no rótulo. O tamanho explícito no ícone desliga a escala
              // do Button, e a margem volta a zero.
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
                  <TagIcon aria-hidden="true" className="size-3.5" />
                  Adicionar tag
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
          {isLoading ? <ComboboxStatus>Carregando tags…</ComboboxStatus> : null}
          <ComboboxEmpty>Nenhuma tag encontrada.</ComboboxEmpty>
          <ComboboxList aria-label={ariaLabel}>
            {(option) => (
              <ComboboxItem key={option.value} value={option}>
                {option.label}
              </ComboboxItem>
            )}
          </ComboboxList>
        </ComboboxPopup>
      </Combobox>
    </div>
  )
}
