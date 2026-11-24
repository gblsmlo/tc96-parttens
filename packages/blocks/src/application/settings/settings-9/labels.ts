import type { Settings9Labels } from './types'

export const defaultSettings9Labels: Settings9Labels = {
  actions: (field, operator, value) => `Ações de ${field} ${operator} ${value}`,
  addRule: 'Adicionar regra',
  condition: 'Condição',
  delete: 'Excluir',
  description:
    'Use regras de automação para adicionar ou remover SLAs automaticamente com base em filtros.',
  edit: 'Editar',
  emptyDescription:
    'Adicione uma regra para aplicar ou remover SLAs automaticamente.',
  emptyTitle: 'Nenhuma regra ainda',
  thenLabel: 'Então',
  title: 'Regras de automação',
  whenLabel: 'Quando',
}
