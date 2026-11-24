import type { ArgTypes } from '@storybook/react-vite'
import type { List3Period } from '@tc96/ui/blocks/application/list/list-3'

export interface List3Controls {
  currency: 'BRL' | 'USD'
  empty: boolean
  period: List3Period
  title: string
}

export const list3ControlArgs: List3Controls = {
  currency: 'BRL',
  empty: false,
  period: 'month',
  title: 'Transações',
}

export const list3ControlArgTypes: Partial<ArgTypes<List3Controls>> = {
  currency: {
    control: 'inline-radio',
    description: 'The `currency` prop of the amounts.',
    options: ['BRL', 'USD'],
  },
  empty: {
    control: 'boolean',
    description: 'Passes `transactions` empty, which renders the empty state.',
  },
  period: {
    control: 'inline-radio',
    description:
      'Initial `period`; the story keeps it in state, as a consumer does.',
    options: ['week', 'month', 'year'],
  },
  title: {
    control: 'text',
    description: 'Text of `labels.title`, the heading of the feed.',
  },
}
