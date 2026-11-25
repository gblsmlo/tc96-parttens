import type { ArgTypes } from '@storybook/react-vite'

export interface Navbar11Controls {
  section: string
  showMenu: boolean
  showSections: boolean
  showSources: boolean
  showUser: boolean
  showVersion: boolean
  source: string
}

export const navbar11ControlArgs: Navbar11Controls = {
  section: 'tokens',
  showMenu: true,
  showSections: true,
  showSources: true,
  showUser: true,
  showVersion: true,
  source: 'shadcn',
}

export const navbar11ControlArgTypes: Partial<ArgTypes<Navbar11Controls>> = {
  section: {
    control: 'inline-radio',
    description: 'The `section` prop; the tab that shows as selected.',
    options: ['patterns', 'tokens', 'icons', 'motion'],
  },
  showMenu: {
    control: 'boolean',
    description:
      'Passes `menu` with three items; without it the menu lists only the user.',
  },
  showSections: {
    control: 'boolean',
    description:
      'Passes `sections` and `onSectionChange`; without them no tabs.',
  },
  showSources: {
    control: 'boolean',
    description:
      'Passes `sources` and `onSourceChange`; without them no switcher.',
  },
  showUser: {
    control: 'boolean',
    description: 'Passes `user`; without it no avatar menu.',
  },
  showVersion: {
    control: 'boolean',
    description: 'Passes `version`; without it no badge.',
  },
  source: {
    control: 'inline-radio',
    description: 'The `source` prop; the radio item that is checked.',
    options: ['shadcn', 'figma', 'repository'],
  },
}
