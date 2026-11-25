'use client'

import { DateProperty } from '@tc96/ui/patterns/properties/display/date/date-property'
import { PersonProperty } from '@tc96/ui/patterns/properties/display/person/person-property'
import {
  SelectProperty,
  type SelectPropertyOption,
} from '@tc96/ui/patterns/properties/display/select/select-property'
import { defaultLegalLocale, defaultLegalTimeZone } from './labels'
import type {
  LegalOptionAppearance,
  LegalPerson,
  LegalPropertyVariant as PropertyVariant,
} from './types'

export function legalSelectOptions<TValue extends string>(
  values: readonly TValue[],
  labels: Record<TValue, string>,
  appearance: Record<TValue, LegalOptionAppearance>,
): SelectPropertyOption[] {
  return values.map((value) => ({
    icon: appearance[value].icon,
    label: labels[value],
    tone: appearance[value].tone,
    value,
  }))
}

export interface LegalSelectProps<TValue extends string> {
  ariaLabel: string
  onChange?: (value: TValue) => void
  options: readonly SelectPropertyOption[]
  value: TValue
  variant?: PropertyVariant
}

export function LegalSelect<TValue extends string>({
  ariaLabel,
  onChange,
  options,
  value,
  variant,
}: Readonly<LegalSelectProps<TValue>>) {
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

export interface LegalOwnerProps {
  ariaLabel: string
  avatarOnly?: boolean
  onChange?: (ownerId: string) => void
  owners: readonly LegalPerson[]
  placeholder: string
  value: string | null
  variant?: PropertyVariant
}

export function LegalOwner({
  ariaLabel,
  avatarOnly = false,
  onChange,
  owners,
  placeholder,
  value,
  variant,
}: Readonly<LegalOwnerProps>) {
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

export interface LegalDateProps {
  ariaLabel: string
  fallback: string
  locale?: string
  overdue?: boolean
  timeZone?: string
  value: string | null
  variant?: PropertyVariant
}

export function LegalDate({
  ariaLabel,
  fallback,
  locale = defaultLegalLocale,
  overdue = false,
  timeZone = defaultLegalTimeZone,
  value,
  variant,
}: Readonly<LegalDateProps>) {
  return (
    <DateProperty
      ariaLabel={ariaLabel}
      fallback={fallback}
      isOverdue={overdue}
      locale={locale}
      timeZone={timeZone}
      value={value}
      variant={variant}
    />
  )
}
