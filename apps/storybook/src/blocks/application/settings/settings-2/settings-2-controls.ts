import type { ArgTypes } from '@storybook/react-vite'

export interface Settings2Controls {
  interfaceTitle: string
  themeDescription: string
  themeValue: string
  underlineLinks: boolean
}

export const settings2ControlArgs: Settings2Controls = {
  interfaceTitle: 'Interface e tema',
  themeDescription: 'Escolha o esquema de cores da interface',
  themeValue: 'light',
  underlineLinks: false,
}

export const settings2ControlArgTypes: Partial<ArgTypes<Settings2Controls>> = {
  interfaceTitle: {
    control: 'text',
    description:
      'Text of `labels.interfaceTitle`, the heading of the second section.',
  },
  themeDescription: {
    control: 'text',
    description: 'Text of `labels.themeDescription`, under the theme row.',
  },
  themeValue: {
    control: 'select',
    description:
      'Selected value of the theme select; one of the `options.theme` values.',
    options: ['light', 'dark', 'system'],
  },
  underlineLinks: {
    control: 'boolean',
    description: 'Checked state of the underline switch.',
  },
}
