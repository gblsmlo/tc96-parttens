import type { ArgTypes } from '@storybook/react-vite'
import { type AlertVariantName, alertVariantNames } from './alert-variants.ts'

export interface AlertControls {
  action: boolean
  description: string
  icon: boolean
  title: string
  variant: AlertVariantName
}

export const alertControlArgs: AlertControls = {
  action: false,
  description: 'Describe what can be done about it here.',
  icon: true,
  title: 'Heads up!',
  variant: 'default',
}

export const alertControlArgTypes: Partial<ArgTypes<AlertControls>> = {
  action: {
    control: 'boolean',
    description: 'Adds an `AlertAction` with two buttons.',
  },
  description: {
    control: 'text',
    description: 'Text of `AlertDescription`; empty removes the part.',
  },
  icon: {
    control: 'boolean',
    description: 'Adds the status icon of the variant as the first child.',
  },
  title: {
    control: 'text',
    description: 'Text of `AlertTitle`; empty removes the part.',
  },
  variant: {
    control: 'select',
    description: 'The `variant` of `Alert`.',
    options: alertVariantNames,
  },
}
