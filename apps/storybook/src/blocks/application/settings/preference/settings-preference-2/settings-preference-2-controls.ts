import type { ArgTypes } from '@storybook/react-vite'

export interface SettingsPreference2Controls {
  emailNotifications: boolean
  emailNotificationsLabel: string
  fontSize: string
  fontSizeLabel: string
  language: string
  languageLabel: string
  title: string
  withValueChange: boolean
}

export const settingsPreference2ControlArgs: SettingsPreference2Controls = {
  emailNotifications: true,
  emailNotificationsLabel: 'Notificações por e-mail',
  fontSize: 'medium',
  fontSizeLabel: 'Tamanho da fonte',
  language: 'pt-BR',
  languageLabel: 'Idioma',
  title: 'Interface e tema',
  withValueChange: true,
}

export const settingsPreference2ControlArgTypes: Partial<
  ArgTypes<SettingsPreference2Controls>
> = {
  emailNotifications: {
    control: 'boolean',
    description: 'Passes `values.emailNotifications`, the state of the switch.',
  },
  emailNotificationsLabel: {
    control: 'text',
    description: 'Text of `labels.emailNotifications`, the switch row title.',
  },
  fontSize: {
    control: 'select',
    description:
      'Passes `values.fontSize`, the option shown in the font size select.',
    options: ['small', 'medium', 'large'],
  },
  fontSizeLabel: {
    control: 'text',
    description: 'Text of `labels.fontSize`, the font size row title.',
  },
  language: {
    control: 'select',
    description:
      'Passes `values.language`, the option shown in the language select.',
    options: ['pt-BR', 'en-US', 'es-ES'],
  },
  languageLabel: {
    control: 'text',
    description: 'Text of `labels.language`, the language row title.',
  },
  title: {
    control: 'text',
    description: 'Text of `labels.title`, the heading of the section.',
  },
  withValueChange: {
    control: 'boolean',
    description:
      'Passes `onValueChange`; off removes it and the rows keep showing their values.',
  },
}
