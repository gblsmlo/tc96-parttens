import { defaultSettingsLoadLabels } from '../../shared/labels'
import type {
  SettingsCatalog8AccountType,
  SettingsCatalog8Labels,
} from './types'

const accountTypeLabels: Record<SettingsCatalog8AccountType, string> = {
  bank: 'Banco',
  cash: 'Dinheiro',
}

export const defaultSettingsCatalog8Labels: SettingsCatalog8Labels = {
  ...defaultSettingsLoadLabels,
  errorTitle: 'Não foi possível carregar as contas',
  loading: 'Carregando contas',
  accountType: (type) => accountTypeLabels[type],
  actions: (name) => `Ações de ${name}`,
  archive: 'Arquivar',
  archived: 'Arquivadas',
  default: 'Padrão',
  description:
    'Bancos e caixas onde os lançamentos são liquidados. Novos lançamentos começam na conta padrão.',
  edit: 'Editar',
  emptyDescription: 'Crie uma conta para começar a registrar lançamentos.',
  emptyTitle: 'Nenhuma conta ainda',
  makeDefault: 'Tornar padrão',
  newAccount: 'Nova conta',
  opening: (type, balance, date) => `${type} · Abre com ${balance} em ${date}`,
  restore: 'Restaurar',
  title: 'Contas',
}
