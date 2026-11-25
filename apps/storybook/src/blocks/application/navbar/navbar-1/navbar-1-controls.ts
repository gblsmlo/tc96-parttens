import type { ArgTypes } from '@storybook/react-vite'

export interface Navbar1Controls {
  collaboratorCount: number
  menu: boolean
  share: string
  shareable: boolean
}

export const navbar1ControlArgs: Navbar1Controls = {
  collaboratorCount: 6,
  menu: true,
  share: 'Compartilhar',
  shareable: true,
}

export const navbar1ControlArgTypes: Partial<ArgTypes<Navbar1Controls>> = {
  collaboratorCount: {
    control: { max: 6, min: 0, type: 'number' },
    description:
      'How many collaborators are passed; four are shown and the rest become a count.',
  },
  menu: {
    control: 'boolean',
    description:
      'Whether `menu` is passed; without it no "Mais ações" button renders.',
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
}
