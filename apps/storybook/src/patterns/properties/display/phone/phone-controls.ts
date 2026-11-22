import type { ArgTypes } from '@storybook/react-vite'
import type { PropertyVariant } from '@tc96/parttens'

export const phoneDisplays = ['chips', 'trigger'] as const

export type PhoneDisplay = (typeof phoneDisplays)[number]

export const phoneCountries = ['BR', 'PT', 'US'] as const

export const phoneVariants = [
  'badge',
  'plain',
] as const satisfies readonly PropertyVariant[]

export interface PhoneControls {
  addLabel: string
  addTrigger: boolean
  ariaLabel: string
  defaultCountry: (typeof phoneCountries)[number]
  disabled: boolean
  display: PhoneDisplay
  errorMessage: string
  inputPlaceholder: string
  placeholder: string
  readOnly: boolean
  value: string[]
  variant: PropertyVariant
}

export const phoneControlArgs: PhoneControls = {
  addLabel: 'Adicionar telefone',
  addTrigger: true,
  ariaLabel: 'Telefones',
  defaultCountry: 'BR',
  disabled: false,
  display: 'chips',
  errorMessage: '',
  inputPlaceholder: '',
  placeholder: 'Sem telefone',
  readOnly: false,
  value: ['+5511987654321', '+351912345678'],
  variant: 'plain',
}

export const phoneControlArgTypes: Partial<ArgTypes<PhoneControls>> = {
  addLabel: {
    control: 'text',
    description:
      'The `addLabel` of `PhoneProperty`: names the add trigger and the popup.',
  },
  addTrigger: {
    control: 'boolean',
    description: 'Shows the add trigger; off passes `addDisabled`.',
  },
  ariaLabel: {
    control: 'text',
    description:
      'The `ariaLabel` of `PhoneProperty`: names the row, or prefixes the summary of the `trigger` display.',
  },
  defaultCountry: {
    control: 'inline-radio',
    description:
      'The `defaultCountry` of `PhoneProperty`: the country of a number typed in the national format.',
    options: phoneCountries,
  },
  disabled: {
    control: 'boolean',
    description: 'The `disabled` of `PhoneProperty`.',
  },
  display: {
    control: 'inline-radio',
    description: 'The `display` of `PhoneProperty`.',
    options: phoneDisplays,
  },
  errorMessage: {
    control: 'text',
    description:
      'The `errorMessage` of `PhoneProperty`, shown in the open popup; empty passes `null`.',
  },
  inputPlaceholder: {
    control: 'text',
    description:
      'The `inputPlaceholder` of `PhoneProperty`, shown in the empty fields of the popup; empty passes nothing.',
  },
  placeholder: {
    control: 'text',
    description:
      'The `placeholder` of `PhoneProperty`, shown while there is no number.',
  },
  readOnly: {
    control: 'boolean',
    description: 'The `readOnly` of `PhoneProperty`.',
  },
  value: {
    control: 'object',
    description:
      'The numbers of `value`, in E.164; the story keeps the edits in its own state until this control changes.',
  },
  variant: {
    control: 'inline-radio',
    description:
      'The `variant` of `PhoneProperty`; acts on the read-only row and the `trigger` display, not on the editable chips.',
    options: phoneVariants,
  },
}
