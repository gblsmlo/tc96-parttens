import type { ArgTypes } from '@storybook/react-vite'

export interface Card5Controls {
  empty: boolean
  title: string
  withLinks: boolean
}

export const card5ControlArgs: Card5Controls = {
  empty: false,
  title: 'Atalhos rápidos',
  withLinks: true,
}

export const card5ControlArgTypes: Partial<ArgTypes<Card5Controls>> = {
  empty: {
    control: 'boolean',
    description:
      'Passes an empty `shortcuts` list, which shows the empty state.',
  },
  title: {
    control: 'text',
    description: 'Text of `labels.title`, the accessible name of the list.',
  },
  withLinks: {
    control: 'boolean',
    description:
      'Keeps the `href` of the shortcuts that have one, which then render as links instead of buttons.',
  },
}
