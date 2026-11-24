import {
  defaultTableLoadLabels,
  defaultTableSettingsLabels,
  defaultTableViewLabels,
} from '../shared/labels'
import type { Table2Labels, Table2LabelsOverride } from './types'

export const defaultTable2Labels: Table2Labels = {
  ...defaultTableLoadLabels,
  ...defaultTableSettingsLabels,
  ...defaultTableViewLabels,
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

export function resolveTable2Labels(
  labels: Table2LabelsOverride | undefined,
): Table2Labels {
  return {
    ...defaultTable2Labels,
    ...labels,
    columns: { ...defaultTable2Labels.columns, ...labels?.columns },
    densities: { ...defaultTable2Labels.densities, ...labels?.densities },
    presence: { ...defaultTable2Labels.presence, ...labels?.presence },
  }
}
