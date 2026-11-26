import type { ViewSettingsBlockLabels, ViewSettingsFilterValues } from './types'

export const defaultViewSettingsLabels: ViewSettingsBlockLabels = {
  clear: 'Limpar filtros',
  comfortable: 'Confortável',
  compact: 'Compacta',
  density: 'Densidade',
  display: 'Exibição',
  filters: 'Filtros',
  reset: 'Redefinir',
  save: 'Salvar preferência',
  sort: 'Ordenar por',
  trigger: 'Exibição',
}

export const resolveViewSettingsLabels = (
  labels?: Partial<ViewSettingsBlockLabels>,
): ViewSettingsBlockLabels => ({ ...defaultViewSettingsLabels, ...labels })

export const countActiveFilters = (values: ViewSettingsFilterValues) =>
  Object.values(values).reduce((count, selected) => count + selected.length, 0)
