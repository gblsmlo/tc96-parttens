import type { Settings14AccountType, Settings14Labels } from './types'

const accountTypeLabels: Record<Settings14AccountType, string> = {
  bank: 'Banco',
  cash: 'Dinheiro',
}

export const defaultSettings14Labels: Settings14Labels = {
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
