import {
  formatPhoneNumber,
  isValidPhoneNumber,
  parsePhoneNumber,
} from 'react-phone-number-input/input-max'
import { z } from 'zod'
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

export function nationalPhoneLabel(value: string): string {
  return formatPhoneNumber(value) || value
}

export interface PhoneNumberSchemaOptions {
  invalidMessage?: string
  requiredMessage?: string
}

export function phoneNumberSchema({
  invalidMessage = 'Informe um telefone válido.',
  requiredMessage = 'Informe um telefone.',
}: PhoneNumberSchemaOptions = {}): z.ZodType<string, string> {
  return z
    .string({ error: requiredMessage })
    .trim()
    .min(1, requiredMessage)
    .refine((value) => isValidPhoneNumber(value), invalidMessage)
}
