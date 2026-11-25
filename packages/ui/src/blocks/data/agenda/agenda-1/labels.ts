import {
  defaultDataCollectionLoadLabels,
  defaultDataCollectionModeLabels,
} from '../../shared/collection/labels'
import type { Agenda1Labels, Agenda1LabelsOverride } from './types'

export const defaultAgenda1Labels: Agenda1Labels = {
  ...defaultDataCollectionLoadLabels,
  allDay: 'Dia inteiro',
  allKinds: 'Todos os tipos',
  allOwners: 'Todos os responsáveis',
  cancel: 'Cancelar',
  cancelEntry: (title) => `Cancelar ${title}`,
  clearFilters: 'Limpar filtros',
  columns: {
    actions: 'Ações',
    kind: 'Tipo',
    location: 'Local',
    modality: 'Modalidade',
    owner: 'Responsável',
    title: 'Título',
    when: 'Quando',
  },
  completed: 'Concluído',
  create: 'Novo compromisso',
  display: 'Exibição',
  empty: 'Nada na agenda neste período.',
  emptyGroup: 'Nada neste grupo.',
  entryName: (kind, title) => `${kind}: ${title}`,
  errorTitle: 'Não foi possível carregar a agenda',
  filterCount: (label, count) => `${label} (${count})`,
  filters: 'Filtros',
  group: 'Agrupar',
  groupBy: 'Agrupar por',
  groupings: {
    day: 'Dia',
    kind: 'Tipo',
  },
  groupToggle: (group, collapsed) =>
    collapsed ? `Expandir ${group}` : `Recolher ${group}`,
  kind: 'Tipo',
  kinds: {
    appointment: 'Compromisso',
    deadline: 'Prazo',
    due: 'Vencimento',
    task: 'Tarefa',
  },
  loading: 'Carregando compromissos',
  modalities: {
    'in-person': 'Presencial',
    phone: 'Telefone',
    video: 'Videochamada',
  },
  modes: { ...defaultDataCollectionModeLabels, calendar: 'Calendário' },
  next: 'Próximo período',
  noGrouping: 'Sem agrupamento',
  noResult: 'Nada na agenda com esses filtros.',
  openEntry: (title) => `Abrir detalhes: ${title}`,
  owner: 'Responsável',
  period: 'Período',
  periods: {
    day: 'Dia',
    month: 'Mês',
    week: 'Semana',
  },
  previous: 'Período anterior',
  savePreference: 'Salvar preferência',
  title: 'Agenda',
  today: 'Hoje',
  toolbar: 'Controles da agenda',
  unassigned: 'Sem responsável',
}

export function resolveAgenda1Labels(
  labels: Agenda1LabelsOverride | undefined,
): Agenda1Labels {
  const base = defaultAgenda1Labels
  return {
    ...base,
    ...labels,
    columns: { ...base.columns, ...labels?.columns },
    groupings: { ...base.groupings, ...labels?.groupings },
    kinds: { ...base.kinds, ...labels?.kinds },
    modalities: { ...base.modalities, ...labels?.modalities },
    modes: { ...base.modes, ...labels?.modes },
    periods: { ...base.periods, ...labels?.periods },
  }
}
