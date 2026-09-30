import {
  isValidPhoneNumber,
  parsePhoneNumber,
} from 'react-phone-number-input/input-max'
import { z } from 'zod'
import type { PhoneCountryCode } from './countries'

export const defaultPhoneCountry: PhoneCountryCode = 'BR'

/**
 * País a que o número já pertence. Vale para número incompleto: `+551198` já
 * identifica o Brasil, e é isso que mantém a bandeira coerente com o que está
 * escrito enquanto a pessoa digita.
 */
export function phoneNumberCountry(
  value: string | null,
): PhoneCountryCode | undefined {
  if (!value) return undefined
  return parsePhoneNumber(value)?.country
}

/** Parte nacional de um valor E.164, sem o `+` e sem o código de discagem. */
export function nationalDigits(value: string | null): string {
  if (!value) return ''
  const callingCode = parsePhoneNumber(value)?.countryCallingCode
  if (!callingCode) return ''
  return value.slice(callingCode.length + 1)
}

export interface PhoneNumberSchemaOptions {
  invalidMessage?: string
  requiredMessage?: string
}

/**
 * Validação do telefone pela mesma biblioteca que formata o campo, para o
 * formulário não aceitar um número que o input já sabe estar incompleto.
 * Campo opcional compõe: `phoneNumberSchema().nullable()`.
 */
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
