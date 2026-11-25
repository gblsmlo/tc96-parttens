import type {
  SettingsPreference2Options,
  SettingsPreference2Values,
} from '@tc96/ui/blocks/application/settings/preference/settings-preference-2'

export interface SettingsPreference2Data {
  options: SettingsPreference2Options
  values: SettingsPreference2Values
}

export const settingsPreference2Data: SettingsPreference2Data = {
  options: {
    fontSize: [
      { label: 'Pequena', value: 'small' },
      { label: 'Média', value: 'medium' },
      { label: 'Grande', value: 'large' },
    ],
    language: [
      { label: 'Português (Brasil)', value: 'pt-BR' },
      { label: 'Inglês', value: 'en-US' },
      { label: 'Espanhol', value: 'es-ES' },
    ],
  },
  values: {
    emailNotifications: true,
    fontSize: 'medium',
    language: 'pt-BR',
  },
}
