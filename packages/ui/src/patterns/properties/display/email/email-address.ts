import { z } from 'zod'
import { defaultPropertyLabels } from '../../shared/property-labels'

export function emailAddressSchema(
  message: string = defaultPropertyLabels.email.invalid,
) {
  return z.email(message)
}
