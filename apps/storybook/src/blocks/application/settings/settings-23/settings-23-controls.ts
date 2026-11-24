import type { ArgTypes } from '@storybook/react-vite'

export interface Settings23Controls {
  changePlan: string
  emptyInvoices: boolean
  title: string
  withActions: boolean
}

export const settings23ControlArgs: Settings23Controls = {
  changePlan: 'Alterar plano',
  emptyInvoices: false,
  title: 'Cobrança',
  withActions: true,
}

export const settings23ControlArgTypes: Partial<ArgTypes<Settings23Controls>> =
  {
    changePlan: {
      control: 'text',
      description: 'Text of `labels.changePlan`, the button of `onChangePlan`.',
    },
    emptyInvoices: {
      control: 'boolean',
      description:
        'Passes an empty `invoices` list, which replaces the table by the empty state.',
    },
    title: {
      control: 'text',
      description: 'Text of `labels.title`, the heading of the plan summary.',
    },
    withActions: {
      control: 'boolean',
      description:
        'Passes `onChangePlan` and `onDownload`; off removes the Change plan button and the download buttons.',
    },
  }
