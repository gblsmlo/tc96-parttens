import type { ArgTypes } from '@storybook/react-vite'

export interface SettingsSecurity1Controls {
  description: string
  empty: boolean
  title: string
  withActions: boolean
}

export const settingsSecurity1ControlArgs: SettingsSecurity1Controls = {
  description: 'Decida o que é coletado e compartilhado sobre sua conta.',
  empty: false,
  title: 'Privacidade',
  withActions: true,
}

export const settingsSecurity1ControlArgTypes: Partial<
  ArgTypes<SettingsSecurity1Controls>
> = {
  description: {
    control: 'text',
    description: 'Text of `labels.description`, under the title.',
  },
  empty: {
    control: 'boolean',
    description: 'Passes an empty `controls` list, which renders no rows.',
  },
  title: {
    control: 'text',
    description: 'Text of `labels.title`, the heading of the section.',
  },
  withActions: {
    control: 'boolean',
    description:
      'Passes `onAction`; off removes the button of the rows that carry an `actionLabel`.',
  },
}
