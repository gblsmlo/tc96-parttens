import type {
  SettingsAccount1Field,
  SettingsAccount1Props,
} from '@tc96/ui/blocks/application/settings/account/settings-account-1'

export const settingsAccount1Fields: SettingsAccount1Field[] = [
  {
    description: 'Aparece nas menções e nas listas da equipe',
    id: 'display-name',
    label: 'Nome de exibição',
    value: 'Ana Ribeiro',
  },
  {
    id: 'job-title',
    label: 'Cargo',
    value: 'Gerente de vendas',
  },
]

export const settingsAccount1Account: Pick<
  SettingsAccount1Props,
  'avatarInitials' | 'email' | 'fields' | 'sessionCount'
> = {
  avatarInitials: 'AR',
  email: 'ana@acme.com',
  fields: settingsAccount1Fields,
  sessionCount: 2,
}
