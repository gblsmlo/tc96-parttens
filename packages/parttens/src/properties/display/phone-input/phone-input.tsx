'use client'

import {
  Combobox,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
  ComboboxPopup,
  ComboboxSeparator,
  ComboboxTrigger,
  useComboboxFilter,
} from '@tc96/ui/combobox'
import { FieldPrimitive } from '@tc96/ui/field'
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from '@tc96/ui/input-group'
import { ChevronDownIcon, GlobeIcon, SearchIcon } from 'lucide-react'
import type React from 'react'
import { useCallback, useRef, useState } from 'react'
import PhoneNumberInput from 'react-phone-number-input/input-max'
import {
  findPhoneCountry,
  type PhoneCountry,
  type PhoneCountryCode,
  phoneCountries,
} from './countries'
import {
  defaultPhoneCountry,
  nationalDigits,
  phoneNumberCountry,
} from './phone-number'

export interface PhoneInputProps {
  value: string | null
  onValueChange: (value: string | null) => void
  ariaLabel?: string
  className?: string
  defaultCountry?: PhoneCountryCode
  disabled?: boolean
  invalid?: boolean
  name?: string
  placeholder?: string
  readOnly?: boolean
  required?: boolean
  onBlur?: React.FocusEventHandler<HTMLInputElement>
  onKeyDown?: React.KeyboardEventHandler<HTMLInputElement>
}

export function PhoneInput({
  ariaLabel,
  className,
  defaultCountry = defaultPhoneCountry,
  disabled = false,
  invalid = false,
  name,
  onBlur,
  onKeyDown,
  onValueChange,
  placeholder,
  readOnly = false,
  required = false,
  value,
}: Readonly<PhoneInputProps>) {
  const fieldRef = useRef<HTMLDivElement>(null)
  const [chosenCountry, setChosenCountry] =
    useState<PhoneCountryCode>(defaultCountry)

  const country = findPhoneCountry(phoneNumberCountry(value) ?? chosenCountry)

  const filter = useComboboxFilter({ sensitivity: 'base' })
  const matchesQuery = useCallback(
    (item: PhoneCountry, query: string) => {
      const digits = query.replace(/\D/g, '')
      return (
        filter.contains(item.name, query) ||
        (digits !== '' && item.callingCode.startsWith(digits))
      )
    },
    [filter],
  )

  const selectCountry = (next: PhoneCountry | null) => {
    if (!next || next.code === country.code) return
    setChosenCountry(next.code)
    const digits = nationalDigits(value)
    onValueChange(digits === '' ? null : `+${next.callingCode}${digits}`)
  }

  return (
    <InputGroup className={className} data-slot="phone-input" ref={fieldRef}>
      <FieldPrimitive.Root render={<span className="contents" />}>
        <InputGroupAddon align="inline-start">
          <Combobox
            filter={matchesQuery}
            items={phoneCountries}
            itemToStringLabel={(item: PhoneCountry) => item.name}
            onValueChange={selectCountry}
            value={country}
          >
            <ComboboxTrigger
              aria-label={`País: ${country.name}`}
              className="flex cursor-pointer items-center gap-1.5 rounded-md px-1 py-0.5 outline-none transition-colors hover:bg-accent focus-visible:ring-[3px] focus-visible:ring-ring/24 disabled:cursor-default disabled:hover:bg-transparent"
              disabled={disabled || readOnly}
            >
              <PhoneCountryFlag country={country} />
              <span className="text-base text-muted-foreground tabular-nums sm:text-sm">
                +{country.callingCode}
              </span>
              <ChevronDownIcon
                aria-hidden="true"
                className="size-3.5 opacity-80"
              />
            </ComboboxTrigger>
            <ComboboxPopup
              align="start"
              anchor={fieldRef}
              aria-label="Selecionar país"
              className="w-(--anchor-width) min-w-64"
            >
              <ComboboxInput
                aria-label="Buscar país"
                className="border-transparent! bg-transparent! shadow-none before:hidden has-focus-visible:ring-0"
                placeholder="Buscar país"
                showTrigger={false}
                startAddon={<SearchIcon />}
              />
              <ComboboxSeparator className="mx-0 my-0" />
              <ComboboxEmpty>Nenhum país encontrado.</ComboboxEmpty>
              <ComboboxList aria-label="Selecionar país">
                {(item: PhoneCountry) => (
                  <ComboboxItem key={item.code} value={item}>
                    <span className="flex w-full min-w-0 items-center gap-2">
                      <PhoneCountryFlag country={item} />
                      <span className="min-w-0 truncate">{item.name}</span>
                      <span className="ms-auto shrink-0 text-muted-foreground tabular-nums">
                        +{item.callingCode}
                      </span>
                    </span>
                  </ComboboxItem>
                )}
              </ComboboxList>
            </ComboboxPopup>
          </Combobox>
          <span aria-hidden="true" className="h-4 w-px bg-input" />
        </InputGroupAddon>
      </FieldPrimitive.Root>
      <PhoneNumberInput
        aria-invalid={invalid || undefined}
        aria-label={ariaLabel}
        autoComplete="tel"
        country={country.code}
        disabled={disabled}
        inputComponent={PhoneNumberField}
        name={name}
        onBlur={onBlur}
        onChange={(next) => onValueChange(next ?? null)}
        onKeyDown={onKeyDown}
        placeholder={placeholder}
        readOnly={readOnly}
        required={required}
        value={value ?? undefined}
      />
    </InputGroup>
  )
}

function PhoneNumberField({ ref, ...props }: React.ComponentProps<'input'>) {
  return <InputGroupInput ref={ref} {...props} />
}

function PhoneCountryFlag({ country }: Readonly<{ country: PhoneCountry }>) {
  const Flag = country.flag

  return (
    <span
      aria-hidden="true"
      className="block w-5 shrink-0 overflow-hidden rounded-xs [&>svg]:block [&>svg]:h-auto [&>svg]:w-full"
    >
      {Flag ? <Flag title={country.name} /> : <GlobeIcon />}
    </span>
  )
}
