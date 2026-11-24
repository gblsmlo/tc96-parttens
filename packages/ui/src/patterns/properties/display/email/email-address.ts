import { z } from 'zod'

export const emailAddressSchema = z.email('Informe um e-mail válido.')
