import type { ArgTypes } from '@storybook/react-vite'

export interface SettingsPreference1Controls {
  interfaceTitle: string
  themeDescription: string
  themeValue: string
  underlineLinks: boolean
}

export const settingsPreference1ControlArgs: SettingsPreference1Controls = {
  interfaceTitle: 'Interface e tema',
  themeDescription: 'Escolha o esquema de cores da interface',
  themeValue: 'light',
  underlineLinks: false,
}

export const settingsPreference1ControlArgTypes: Partial<
  ArgTypes<SettingsPreference1Controls>
> = {
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
