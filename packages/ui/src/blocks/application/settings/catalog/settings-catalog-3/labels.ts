import { defaultSettingsLoadLabels } from '../../shared/labels'
import type { SettingsCatalog3Labels } from './types'

export const defaultSettingsCatalog3Labels: SettingsCatalog3Labels = {
  ...defaultSettingsLoadLabels,
  errorTitle: 'Não foi possível carregar as regras',
  loading: 'Carregando regras',
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
