import {
  defaultGridLoadLabels,
  defaultGridSettingsLabels,
} from '../../shared/grid/labels'
import { defaultDataPriorityLabels } from '../../shared/properties/data-priority'
import type { Team1Labels, Team1LabelsOverride } from './types'

export const defaultTeam1Labels: Team1Labels = {
  ...defaultGridLoadLabels,
  ...defaultGridSettingsLabels,
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

export function resolveTeam1Labels(
  labels: Team1LabelsOverride | undefined,
): Team1Labels {
  return {
    ...defaultTeam1Labels,
    ...labels,
    columns: { ...defaultTeam1Labels.columns, ...labels?.columns },
    densities: { ...defaultTeam1Labels.densities, ...labels?.densities },
    presence: { ...defaultTeam1Labels.presence, ...labels?.presence },
    priorities: { ...defaultTeam1Labels.priorities, ...labels?.priorities },
  }
}
