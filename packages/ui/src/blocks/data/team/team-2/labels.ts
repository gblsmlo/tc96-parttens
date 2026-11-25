import { defaultDataPriorityLabels } from '../../shared/properties/data-priority'
import {
  defaultTableLoadLabels,
  defaultTableSettingsLabels,
} from '../../shared/table/labels'
import type { Team2Labels, Team2LabelsOverride } from './types'

export const defaultTeam2Labels: Team2Labels = {
  ...defaultTableLoadLabels,
  ...defaultTableSettingsLabels,
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
  priorities: defaultDataPriorityLabels,
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

export function resolveTeam2Labels(
  labels: Team2LabelsOverride | undefined,
): Team2Labels {
  return {
    ...defaultTeam2Labels,
    ...labels,
    columns: { ...defaultTeam2Labels.columns, ...labels?.columns },
    densities: { ...defaultTeam2Labels.densities, ...labels?.densities },
    presence: { ...defaultTeam2Labels.presence, ...labels?.presence },
    priorities: { ...defaultTeam2Labels.priorities, ...labels?.priorities },
  }
}
