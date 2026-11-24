import type {
  Settings1Field,
  Settings1Props,
} from '@tc96/ui/blocks/application/settings/settings-1'

export const settings1Fields: Settings1Field[] = [
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

export const settings1Account: Pick<
  Settings1Props,
  'avatarInitials' | 'email' | 'fields' | 'sessionCount'
> = {
  avatarInitials: 'AR',
  email: 'ana@acme.com',
  fields: settings1Fields,
  sessionCount: 2,
}
