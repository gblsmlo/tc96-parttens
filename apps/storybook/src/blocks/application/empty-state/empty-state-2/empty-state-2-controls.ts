import type { ArgTypes } from '@storybook/react-vite'

export interface EmptyState2Controls {
  clear: boolean
  description: string
  query: string
  suggestions: boolean
}

export const emptyState2ControlArgs: EmptyState2Controls = {
  clear: true,
  description: 'Confira a ortografia ou tente termos mais curtos e gerais.',
  query: 'fatura atrasada',
  suggestions: true,
}

export const emptyState2ControlArgTypes: Partial<
  ArgTypes<EmptyState2Controls>
> = {
  clear: {
    control: 'boolean',
    description: 'Passes `onClear`; without it Limpar busca is gone.',
  },
  description: {
    control: 'text',
    description: 'Text of `labels.description`.',
  },
  query: {
    control: 'text',
    description: 'The `query` prop, read by `labels.title`.',
  },
  suggestions: {
    control: 'boolean',
    description: 'Passes `suggestions` and `onSuggestion`.',
  },
}
