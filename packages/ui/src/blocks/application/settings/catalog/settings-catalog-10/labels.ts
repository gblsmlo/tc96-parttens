import { defaultSettingsLoadLabels } from '../../shared/labels'
import type { SettingsCatalog10Labels } from './types'

export const defaultSettingsCatalog10Labels: SettingsCatalog10Labels = {
  ...defaultSettingsLoadLabels,
  errorTitle: 'Não foi possível carregar os centros de custo',
  loading: 'Carregando centros de custo',
  actions: (name) => `Ações de ${name}`,
  archive: 'Arquivar',
  archived: 'Arquivados',
  description:
    'Onde um custo é lançado: uma área de atuação, um escritório, um projeto.',
  edit: 'Editar',
  emptyDescription: 'Crie um centro de custo para ver onde o dinheiro é gasto.',
  emptyTitle: 'Nenhum centro de custo ainda',
  entries: (count) => `${count} ${count === 1 ? 'lançamento' : 'lançamentos'}`,
  newCostCenter: 'Novo centro de custo',
  restore: 'Restaurar',
  title: 'Centros de custo',
}
