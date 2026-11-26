import type { ViewSettings5Labels } from './types'

export const defaultViewSettings5Labels: ViewSettings5Labels = {
  activeFilters: (count) =>
    count === 1
      ? 'Filtrar, 1 filtro ativo'
      : `Filtrar, ${count} filtros ativos`,
  clearFilters: 'Limpar filtros',
  filter: 'Filtrar',
  filterSection: 'Filtrar por',
  group: 'Agrupar',
  groupSection: 'Agrupar por',
  layout: 'Layout',
  layoutSection: 'Exibir como',
  sort: 'Ordenar',
  sortSection: 'Ordenar por',
}
