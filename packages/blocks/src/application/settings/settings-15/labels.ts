import { defaultSettingsLoadLabels } from '../shared/labels'
import type { Settings15Direction, Settings15Labels } from './types'

const directionLabels: Record<Settings15Direction, string> = {
  expense: 'Despesa',
  income: 'Receita',
}

export const defaultSettings15Labels: Settings15Labels = {
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
