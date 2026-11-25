import type {
  LegalLoadLabels,
  LegalModeLabels,
  LegalToolbarLabels,
} from './types'

export const defaultLegalLoadLabels: Pick<
  LegalLoadLabels,
  'errorDescription' | 'retry'
> = {
  errorDescription: 'Verifique sua conexão e tente novamente.',
  retry: 'Tentar novamente',
}

export const defaultLegalModeLabels: LegalModeLabels = {
  calendar: 'Agenda',
  kanban: 'Kanban',
  list: 'Lista',
  table: 'Tabela',
}

export const defaultLegalToolbarLabels: Pick<
  LegalToolbarLabels,
  | 'allStatuses'
  | 'clearFilters'
  | 'display'
  | 'export'
  | 'filterCount'
  | 'filters'
  | 'status'
> = {
  allStatuses: 'Todos os status',
  clearFilters: 'Limpar filtros',
  display: 'Exibição',
  export: 'Exportar CSV',
  filterCount: (label, count) => `${label} (${count})`,
  filters: 'Filtros',
  status: 'Status',
}

export const defaultLegalLocale = 'pt-BR'
export const defaultLegalTimeZone = 'America/Sao_Paulo'
