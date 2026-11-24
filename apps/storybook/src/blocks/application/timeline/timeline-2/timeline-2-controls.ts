import type { ArgTypes } from '@storybook/react-vite'

export interface Timeline2Controls {
  empty: boolean
  error: boolean
  locale: 'en-US' | 'pt-BR'
  pending: boolean
  title: string
}

export const timeline2ControlArgs: Timeline2Controls = {
  empty: false,
  error: false,
  locale: 'pt-BR',
  pending: false,
  title: 'Histórico de versões',
}

export const timeline2ControlArgTypes: Partial<ArgTypes<Timeline2Controls>> = {
  empty: {
    control: 'boolean',
    description: 'Passes `releases` empty, which renders the empty state.',
  },
  error: {
    control: 'boolean',
    description: 'The `error` prop: renders the error surface.',
  },
  locale: {
    control: 'inline-radio',
    description: 'The `locale` prop that formats the date rail.',
    options: ['pt-BR', 'en-US'],
  },
  pending: {
    control: 'boolean',
    description: 'The `pending` prop: renders the skeleton.',
  },
  title: {
    control: 'text',
    description: 'Text of `labels.title`, the heading of the changelog.',
  },
}
