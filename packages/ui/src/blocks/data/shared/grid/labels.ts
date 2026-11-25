import type {
  GridLoadLabels,
  GridSettingsLabels,
  GridViewLabels,
} from './types'

export const defaultGridLoadLabels: Pick<
  GridLoadLabels,
  'errorDescription' | 'retry'
> = {
  errorDescription: 'Verifique sua conexão e tente novamente.',
  retry: 'Tentar novamente',
}

export const defaultGridViewLabels: GridViewLabels = {
  viewCreate: 'Criar nova view',
  viewSearch: 'Buscar views',
  viewSearchPlaceholder: 'Buscar views...',
  viewSelect: 'Selecionar view',
  views: 'Views',
  viewsEmpty: 'Nenhuma view encontrada',
}

export const defaultGridSettingsLabels: GridSettingsLabels = {
  clearSort: 'Limpar ordenação',
  densities: {
    compact: 'Compacta',
    'extra-tall': 'Extra alta',
    medium: 'Média',
    short: 'Padrão',
    tall: 'Alta',
  },
  settingsWithFilters: (settings, activeFilters) =>
    `${settings} (${activeFilters})`,
  sortOption: (column, direction) =>
    `${column}: ${direction === 'asc' ? 'crescente' : 'decrescente'}`,
}
