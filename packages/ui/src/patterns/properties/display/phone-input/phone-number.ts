import {
  formatPhoneNumberIntl,
  isValidPhoneNumber,
  parsePhoneNumber,
} from 'react-phone-number-input/input-max'
import { z } from 'zod'
import { defaultPropertyLabels } from '../../shared/property-labels'
import type { PhoneCountryCode } from './countries'

export const defaultPhoneCountry: PhoneCountryCode = 'BR'

export function phoneNumberCountry(
  value: string | null,
): PhoneCountryCode | undefined {
  if (!value) return undefined
  return parsePhoneNumber(value)?.country
}

export function nationalDigits(value: string | null): string {
  if (!value) return ''
  const callingCode = parsePhoneNumber(value)?.countryCallingCode
  if (!callingCode) return ''
  return value.slice(callingCode.length + 1)
}

export function internationalPhoneLabel(value: string): string {
  return formatPhoneNumberIntl(value) || value
}

export interface PhoneNumberSchemaOptions {
  invalidMessage?: string
  requiredMessage?: string
}

export function phoneNumberSchema({
  invalidMessage = defaultPropertyLabels.phone.invalid,
  requiredMessage = defaultPropertyLabels.phone.required,
}: PhoneNumberSchemaOptions = {}): z.ZodType<string, string> {
  return z
    .string({ error: requiredMessage })
    .trim()
    .min(1, requiredMessage)
    .refine((value) => isValidPhoneNumber(value), invalidMessage)
}
