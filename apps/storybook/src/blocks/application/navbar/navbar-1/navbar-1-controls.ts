import type { ArgTypes } from '@storybook/react-vite'

export interface Navbar1Controls {
  collaboratorCount: number
  share: string
  shareable: boolean
  tab: string
}

export const navbar1ControlArgs: Navbar1Controls = {
  collaboratorCount: 6,
  share: 'Compartilhar',
  shareable: true,
  tab: 'overview',
}

export const navbar1ControlArgTypes: Partial<ArgTypes<Navbar1Controls>> = {
  collaboratorCount: {
    control: { max: 6, min: 0, type: 'number' },
    description:
      'How many collaborators are passed; four are shown and the rest become a count.',
  },
  share: {
    control: 'text',
    description: 'Text of `labels.share`, the visible text of the button.',
  },
  shareable: {
    control: 'boolean',
    description:
      'Whether `onShare` is passed; without it no Compartilhar button renders.',
  },
  tab: {
    control: 'select',
    description: 'The `tab` that starts selected.',
    options: ['overview', 'tasks', 'files', 'activity'],
  },
}
