import type { ArgTypes } from '@storybook/react-vite'
import type { PropertyVariant } from '@tc96/ui/patterns'
import { ptBRPropertyLabels } from '../../properties-labels.ts'

export const emailVariants = ['badge', 'plain'] as const

export interface EmailControls {
  addTrigger: boolean
  ariaLabel: string
  disabled: boolean
  errorMessage: string
  labelsAdd: string
  labelsInputPlaceholder: string
  placeholder: string
  readOnly: boolean
  value: string[]
  variant: PropertyVariant
}

export const emailControlArgs: EmailControls = {
  addTrigger: true,
  ariaLabel: 'E-mails',
  disabled: false,
  errorMessage: '',
  labelsAdd: ptBRPropertyLabels.email.add,
  labelsInputPlaceholder: ptBRPropertyLabels.email.inputPlaceholder,
  placeholder: 'Sem e-mail',
  readOnly: false,
  value: ['ana.souza@example.com', 'bruno.lima@example.com'],
  variant: 'plain',
}

export const emailControlArgTypes: Partial<ArgTypes<EmailControls>> = {
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
  errorMessage: {
    control: 'text',
    description:
      'The `errorMessage` of `EmailProperty`, shown in the open popup; empty passes `null`.',
  },
  labelsAdd: {
    control: 'text',
    description:
      '`labels.add` of `EmailProperty`: names the add trigger and the popup.',
  },
  labelsInputPlaceholder: {
    control: 'text',
    description:
      '`labels.inputPlaceholder` of `EmailProperty`, shown in the empty fields of the popup.',
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
      'The `variant` of `EmailProperty`; acts on the read-only row, not on the editable chips.',
    options: emailVariants,
  },
}
