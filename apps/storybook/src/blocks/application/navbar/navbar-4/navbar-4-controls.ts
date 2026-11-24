import type { ArgTypes } from '@storybook/react-vite'

export interface Navbar4Controls {
  active: boolean
  pending: boolean
  savedText: string
  showActive: boolean
  showClose: boolean
  showHistory: boolean
  showSubmit: boolean
  showTest: boolean
  submit: string
  title: string
}

export const navbar4ControlArgs: Navbar4Controls = {
  active: true,
  pending: false,
  savedText: 'Salvo há 2 minutos',
  showActive: true,
  showClose: true,
  showHistory: true,
  showSubmit: true,
  showTest: true,
  submit: 'Salvar',
  title: 'Fluxo de boas-vindas',
}

export const navbar4ControlArgTypes: Partial<ArgTypes<Navbar4Controls>> = {
  active: {
    control: 'boolean',
    description: 'The `active` prop, the checked state of the switch.',
  },
  pending: {
    control: 'boolean',
    description: 'Disables the Testar and submit buttons while a save runs.',
  },
  savedText: {
    control: 'text',
    description: 'The `savedText` prop; empty hides the line.',
  },
  showActive: {
    control: 'boolean',
    description: 'Passes `onActiveChange`; without it no switch renders.',
  },
  showClose: {
    control: 'boolean',
    description: 'Passes `onClose`; without it no close button renders.',
  },
  showHistory: {
    control: 'boolean',
    description: 'Passes `onHistory`; without it no history button renders.',
  },
  showSubmit: {
    control: 'boolean',
    description: 'Passes `onSubmit`; without it no submit button renders.',
  },
  showTest: {
    control: 'boolean',
    description: 'Passes `onTest`; without it no Testar button renders.',
  },
  submit: {
    control: 'text',
    description: 'Text of `labels.submit`, the primary button.',
  },
  title: {
    control: 'text',
    description: 'The `title` prop, the document name.',
  },
}
