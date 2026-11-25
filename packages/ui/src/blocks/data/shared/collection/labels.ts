import type {
  DataCollectionLoadLabels,
  DataCollectionModeLabels,
  DataCollectionSavedViewLabels,
  DataCollectionToolbarLabels,
} from './types'

export const defaultDataCollectionLoadLabels: Pick<
  DataCollectionLoadLabels,
  'errorDescription' | 'retry'
> = {
  errorDescription: 'Verifique sua conexão e tente novamente.',
  retry: 'Tentar novamente',
}

export const defaultDataCollectionModeLabels: DataCollectionModeLabels = {
  calendar: 'Agenda',
  kanban: 'Kanban',
  list: 'Lista',
  table: 'Tabela',
}

export const defaultDataCollectionToolbarLabels: Pick<
  DataCollectionToolbarLabels,
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

export const defaultDataCollectionLocale = 'pt-BR'
export const defaultDataCollectionTimeZone = 'America/Sao_Paulo'

export const defaultDataCollectionSavedViewLabels: DataCollectionSavedViewLabels =
  {
    create: 'Salvar visualização',
    delete: 'Excluir',
    duplicate: 'Duplicar',
    modified: (label) => `${label} (alterada)`,
    options: (label) => `Opções de ${label}`,
    rename: 'Renomear',
    savedViews: 'Minhas visualizações',
    search: 'Buscar visualizações',
    searchPlaceholder: 'Buscar visualizações...',
    update: (label) => `Atualizar “${label}”`,
  }
