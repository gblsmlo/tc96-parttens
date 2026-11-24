import type { ArgTypes } from '@storybook/react-vite'

export interface Settings19Controls {
  description: string
  empty: boolean
  failing: boolean
  newEndpoint: string
  title: string
  withActions: boolean
}

export const settings19ControlArgs: Settings19Controls = {
  description: 'Receba eventos do workspace em URLs que você controla.',
  empty: false,
  failing: true,
  newEndpoint: 'Novo endpoint',
  title: 'Webhooks',
  withActions: true,
}

export const settings19ControlArgTypes: Partial<ArgTypes<Settings19Controls>> =
  {
    description: {
      control: 'text',
      description: 'Text of `labels.description`, under the title.',
    },
    empty: {
      control: 'boolean',
      description:
        'Passes an empty `endpoints` list, which replaces the rows by the empty state.',
    },
    failing: {
      control: 'boolean',
      description:
        'Marks one endpoint as `failing`; off removes the health alert and the badge.',
    },
    newEndpoint: {
      control: 'text',
      description: 'Text of `labels.newEndpoint`, the button of `onCreate`.',
    },
    title: {
      control: 'text',
      description: 'Text of `labels.title`, the heading of the section.',
    },
    withActions: {
      control: 'boolean',
      description:
        'Passes `onCreate` and `onEndpointAction`; off removes the New endpoint button and the row menus.',
    },
  }
