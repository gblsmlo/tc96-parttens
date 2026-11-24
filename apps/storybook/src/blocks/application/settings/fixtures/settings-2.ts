import type {
  Settings2Options,
  Settings2Values,
} from '@tc96/blocks/application/settings/settings-2'

export const settings2Options: Settings2Options = {
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

export const settings2Values: Settings2Values = {
  displayNames: 'full',
  fontSize: 'medium',
  theme: 'light',
  underlineLinks: false,
}

export const settings2Preferences = {
  options: settings2Options,
  values: settings2Values,
}
