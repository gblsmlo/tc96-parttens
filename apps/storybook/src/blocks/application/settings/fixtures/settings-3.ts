import type {
  Settings3Options,
  Settings3Values,
} from '@tc96/blocks/application/settings/settings-3'

export interface Settings3Data {
  options: Settings3Options
  values: Settings3Values
}

export const settings3Data: Settings3Data = {
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
