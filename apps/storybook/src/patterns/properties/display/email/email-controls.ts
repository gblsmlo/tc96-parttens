import type { ArgTypes } from '@storybook/react-vite'
import type { PropertyVariant } from '@tc96/parttens'

export const emailDisplays = ['chips', 'trigger'] as const

export type EmailDisplay = (typeof emailDisplays)[number]

export const emailVariants = ['badge', 'plain'] as const

export interface EmailControls {
  addLabel: string
  addTrigger: boolean
  ariaLabel: string
  disabled: boolean
  display: EmailDisplay
  errorMessage: string
  inputPlaceholder: string
  placeholder: string
  readOnly: boolean
  value: string[]
  variant: PropertyVariant
}

export const emailControlArgs: EmailControls = {
  addLabel: 'Adicionar e-mail',
  addTrigger: true,
  ariaLabel: 'E-mails',
  disabled: false,
  display: 'chips',
  errorMessage: '',
  inputPlaceholder: 'nome@exemplo.com',
  placeholder: 'Sem e-mail',
  readOnly: false,
  value: ['ana.souza@example.com', 'bruno.lima@example.com'],
  variant: 'plain',
}

export const emailControlArgTypes: Partial<ArgTypes<EmailControls>> = {
  addLabel: {
    control: 'text',
    description:
      'The `addLabel` of `EmailProperty`: names the add trigger and the popup.',
  },
  addTrigger: {
    control: 'boolean',
    description: 'Shows the add trigger; off passes `addDisabled`.',
  },
  ariaLabel: {
    control: 'text',
    description:
      'The `ariaLabel` of `EmailProperty`: names the row, or prefixes the summary of the `trigger` display.',
  },
  disabled: {
    control: 'boolean',
    description: 'The `disabled` of `EmailProperty`.',
  },
  display: {
    control: 'inline-radio',
    description: 'The `display` of `EmailProperty`.',
    options: emailDisplays,
  },
  errorMessage: {
    control: 'text',
    description:
      'The `errorMessage` of `EmailProperty`, shown in the open popup or under the inline field; empty passes `null`.',
  },
  inputPlaceholder: {
    control: 'text',
    description:
      'The `inputPlaceholder` of `EmailProperty`, shown in the empty fields of the popup.',
  },
  placeholder: {
    control: 'text',
    description:
      'The `placeholder` of `EmailProperty`, shown while there is no address.',
  },
  readOnly: {
    control: 'boolean',
    description: 'The `readOnly` of `EmailProperty`.',
  },
  value: {
    control: 'object',
    description:
      'The addresses of `value`; the story keeps the edits in its own state until this control changes.',
  },
  variant: {
    control: 'inline-radio',
    description:
      'The `variant` of `EmailProperty`; acts on the read-only row and the `trigger` display, not on the editable chips.',
    options: emailVariants,
  },
}
