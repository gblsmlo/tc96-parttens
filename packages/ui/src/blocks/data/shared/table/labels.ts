import type {
  TableLoadLabels,
  TableSettingsLabels,
  TableViewLabels,
} from './types'

export const defaultTableLoadLabels: Pick<
  TableLoadLabels,
  'errorDescription' | 'retry'
> = {
  errorDescription: 'Verifique sua conexão e tente novamente.',
  retry: 'Tentar novamente',
}

export const defaultTableViewLabels: TableViewLabels = {
  viewCreate: 'Criar nova view',
  viewSearch: 'Buscar views',
  viewSearchPlaceholder: 'Buscar views...',
  viewSelect: 'Selecionar view',
  views: 'Views',
  viewsEmpty: 'Nenhuma view encontrada',
}

export const defaultTableSettingsLabels: TableSettingsLabels = {
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
