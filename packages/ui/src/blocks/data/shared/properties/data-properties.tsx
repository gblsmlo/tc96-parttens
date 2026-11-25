'use client'

import { DateProperty } from '@tc96/ui/patterns/properties/display/date/date-property'
import { PersonProperty } from '@tc96/ui/patterns/properties/display/person/person-property'
import {
  SelectProperty,
  type SelectPropertyOption,
} from '@tc96/ui/patterns/properties/display/select/select-property'
import type {
  DataOptionAppearance,
  DataPerson,
  DataPropertyVariant as PropertyVariant,
} from './types'

const defaultDataLocale = 'pt-BR'
const defaultDataTimeZone = 'America/Sao_Paulo'

export function dataSelectOptions<TValue extends string>(
  values: readonly TValue[],
  labels: Record<TValue, string>,
  appearance: Record<TValue, DataOptionAppearance>,
): SelectPropertyOption[] {
  return values.map((value) => ({
    icon: appearance[value].icon,
    label: labels[value],
    tone: appearance[value].tone,
    value,
  }))
}

export interface DataSelectProps<TValue extends string> {
  ariaLabel: string
  onChange?: (value: TValue) => void
  options: readonly SelectPropertyOption[]
  value: TValue
  variant?: PropertyVariant
}

export function DataSelect<TValue extends string>({
  ariaLabel,
  onChange,
  options,
  value,
  variant,
}: Readonly<DataSelectProps<TValue>>) {
  return (
    <SelectProperty
      ariaLabel={ariaLabel}
      onValueChange={
        onChange
          ? (next) => {
              const option = options.find((item) => item.value === next)
              if (option) onChange(option.value as TValue)
            }
          : undefined
      }
      options={options}
      value={value}
      variant={variant}
    />
  )
}

export interface DataOwnerProps {
  ariaLabel: string
  avatarOnly?: boolean
  onChange?: (ownerId: string) => void
  owners: readonly DataPerson[]
  placeholder: string
  value: string | null
  variant?: PropertyVariant
}

export function DataOwner({
  ariaLabel,
  avatarOnly = false,
  onChange,
  owners,
  placeholder,
  value,
  variant,
}: Readonly<DataOwnerProps>) {
  return (
    <PersonProperty
      ariaLabel={ariaLabel}
      display={avatarOnly ? 'avatar' : 'full'}
      onValueChange={onChange}
      options={owners.map((owner) => ({
        imageUrl: owner.imageUrl,
        label: owner.label,
        value: owner.id,
      }))}
      placeholder={placeholder}
      value={value}
      variant={variant}
    />
  )
}

export interface DataDateProps {
  ariaLabel: string
  displayLabel?: string
  fallback: string
  locale?: string
  overdue?: boolean
  timeZone?: string
  value: string | null
  variant?: PropertyVariant
  withTime?: boolean
}

function formatDateWithTime(
  value: string | null,
  locale: string,
  timeZone: string,
): string | undefined {
  if (!value) return undefined
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return undefined
  return new Intl.DateTimeFormat(locale, {
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    month: 'short',
    timeZone,
  }).format(date)
}

export function DataDate({
  ariaLabel,
  displayLabel,
  fallback,
  locale = defaultDataLocale,
  overdue = false,
  timeZone = defaultDataTimeZone,
  value,
  variant,
  withTime = false,
}: Readonly<DataDateProps>) {
  return (
    <DateProperty
      ariaLabel={ariaLabel}
      displayLabel={
        displayLabel ??
        (withTime ? formatDateWithTime(value, locale, timeZone) : undefined)
      }
      fallback={fallback}
      isOverdue={overdue}
      locale={locale}
      timeZone={timeZone}
      value={value}
      variant={variant}
    />
  )
}
