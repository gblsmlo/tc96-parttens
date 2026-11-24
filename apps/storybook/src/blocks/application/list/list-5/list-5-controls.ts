import type { ArgTypes } from '@storybook/react-vite'

export interface List5Controls {
  addable: boolean
  browsable: boolean
  title: string
}

export const list5ControlArgs: List5Controls = {
  addable: true,
  browsable: true,
  title: 'Módulos disponíveis',
}

export const list5ControlArgTypes: Partial<ArgTypes<List5Controls>> = {
  addable: {
    control: 'boolean',
    description: 'Whether `onAdd` is passed; without it no add button renders.',
  },
  browsable: {
    control: 'boolean',
    description:
      'Whether `onBrowseMore` is passed; without it the footer button does not render.',
  },
  title: {
    control: 'text',
    description: 'Text of `labels.title`, the accessible name of the list.',
  },
}
