import type {
  SettingsPreference1Options,
  SettingsPreference1Values,
} from '@tc96/ui/blocks/application/settings/preference/settings-preference-1'

export const settingsPreference1Options: SettingsPreference1Options = {
  displayNames: [
    { label: 'Nome completo', value: 'full' },
    { label: 'Primeiro nome', value: 'first' },
    { label: 'Apelido', value: 'nickname' },
  ],
  fontSize: [
    { label: 'Pequena', value: 'small' },
    { label: 'Média', value: 'medium' },
    { label: 'Grande', value: 'large' },
  ],
  theme: [
    { label: 'Claro', value: 'light' },
    { label: 'Escuro', value: 'dark' },
    { label: 'Automático', value: 'system' },
  ],
}

export const settingsPreference1Values: SettingsPreference1Values = {
  displayNames: 'full',
  fontSize: 'medium',
  theme: 'light',
  underlineLinks: false,
}

export const settingsPreference1Preferences = {
  options: settingsPreference1Options,
  values: settingsPreference1Values,
}
