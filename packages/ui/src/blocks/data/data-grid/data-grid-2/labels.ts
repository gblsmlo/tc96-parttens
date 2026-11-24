import {
  defaultGridLoadLabels,
  defaultGridSettingsLabels,
  defaultGridViewLabels,
} from '../shared/labels'
import type { DataGrid2Labels, DataGrid2LabelsOverride } from './types'

export const defaultDataGrid2Labels: DataGrid2Labels = {
  ...defaultGridLoadLabels,
  ...defaultGridSettingsLabels,
  ...defaultGridViewLabels,
  activity: (percent) => `Atividade de ${percent}`,
  clearFilters: 'Limpar filtros',
  columns: {
    activity: 'Atividade',
    joined: 'Entrada',
    lastSeen: 'Visto por último',
    location: 'Local',
    member: 'Membro',
    priority: 'Prioridade',
    rating: 'Avaliação',
    role: 'Papel',
    team: 'Time',
  },
  density: 'Altura das linhas',
  display: 'Exibição',
  displayedProperties: 'Propriedades exibidas',
  empty: 'Nenhum membro para exibir.',
  errorTitle: 'Não foi possível carregar os membros',
  filterAll: 'Todos',
  filters: 'Filtros',
  loading: 'Carregando membros',
  pageSize: 'Linhas por página',
  pausedMembers: 'Mostrar membros pausados',
  presence: {
    away: 'Ausente',
    offline: 'Offline',
    online: 'Online',
  },
  rating: (rating) => `Avaliação ${rating} de 5`,
  save: 'Salvar preferência',
  settings: 'Configurações',
  sorting: 'Ordenação',
  summary: (count) => (count === 1 ? '1 membro' : `${count} membros`),
  teamMembers: (team) => `Pessoas do time ${team}`,
  title: 'Membros',
  toolbar: 'Controles dos membros',
  you: '(Você)',
}

export function resolveDataGrid2Labels(
  labels: DataGrid2LabelsOverride | undefined,
): DataGrid2Labels {
  return {
    ...defaultDataGrid2Labels,
    ...labels,
    columns: { ...defaultDataGrid2Labels.columns, ...labels?.columns },
    densities: { ...defaultDataGrid2Labels.densities, ...labels?.densities },
    presence: { ...defaultDataGrid2Labels.presence, ...labels?.presence },
  }
}
