import { defaultSettingsLoadLabels } from '../../shared/labels'
import type { SettingsCatalog9Direction, SettingsCatalog9Labels } from './types'

const directionLabels: Record<SettingsCatalog9Direction, string> = {
  expense: 'Despesa',
  income: 'Receita',
}

export const defaultSettingsCatalog9Labels: SettingsCatalog9Labels = {
  ...defaultSettingsLoadLabels,
  errorTitle: 'Não foi possível carregar as categorias',
  loading: 'Carregando categorias',
  actions: (name) => `Ações de ${name}`,
  addSubcategory: 'Adicionar subcategoria',
  archive: 'Arquivar',
  archived: 'Arquivadas',
  description:
    'Como os lançamentos são classificados: honorários, custas, despesas.',
  direction: (direction) => directionLabels[direction],
  edit: 'Editar',
  emptyDescription: 'Crie uma categoria para classificar receitas e despesas.',
  emptyTitle: 'Nenhuma categoria ainda',
  entries: (count) => `${count} ${count === 1 ? 'lançamento' : 'lançamentos'}`,
  newCategory: 'Nova categoria',
  restore: 'Restaurar',
  subcategoryOf: (parent) => `Subcategoria de ${parent}`,
  title: 'Categorias',
}
