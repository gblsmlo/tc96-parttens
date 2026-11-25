import { defaultDataCollectionLoadLabels } from '../../shared/collection/labels'
import type { Inbox1Labels, Inbox1LabelsOverride } from './types'

export const defaultInbox1Labels: Inbox1Labels = {
  ...defaultDataCollectionLoadLabels,
  actions: {
    markRead: 'Marcar como lida',
    open: 'Abrir',
  },
  allCategories: 'Todos',
  allKinds: 'Todos os motivos',
  allReadStates: 'Todas',
  anyDate: 'Qualquer data',
  categories: {
    court: 'Tribunal',
    deadlines: 'Prazos',
    monitoring: 'Monitoramento',
    tasks: 'Tarefas',
  },
  categoryList: 'Categorias',
  clearFilters: 'Limpar filtros',
  clearSelection: 'Limpar seleção',
  columns: {
    due: 'Vencimento',
    entry: 'Entrada',
    origin: 'Origem',
    read: 'Leitura',
    reason: 'Motivo',
    received: 'Recebida',
  },
  display: 'Exibição',
  empty: 'Nenhuma entrada na sua Inbox.',
  emptyFiltered: 'Nenhuma entrada no filtro escolhido.',
  errorTitle: 'Não foi possível carregar a Inbox',
  filterCount: (label, count) => `${label} (${count})`,
  filters: 'Filtros',
  kind: 'Motivo',
  kinds: {
    'deadline-at-risk': 'Prazo em risco',
    'deadline-fatal': 'Data fatal do prazo',
    'deadline-internal': 'Data interna do prazo',
    'deadline-stalled': 'Prazo parado',
    'failure-opened': 'Aviso do monitoramento',
    movement: 'Nova movimentação',
    publication: 'Nova publicação',
    'task-assigned': 'Tarefa atribuída a você',
    'task-due': 'Tarefa vencendo',
  },
  loading: 'Carregando entradas',
  loadMore: 'Carregar mais',
  loadMoreError: 'Não foi possível carregar a Inbox.',
  markError: 'Não foi possível marcar a entrada. Tente de novo.',
  markRead: (title) => `Marcar ${title} como lida`,
  markUnread: (title) => `Marcar ${title} como não lida`,
  noDue: 'Sem vencimento',
  noDueMark: '—',
  openEntry: (title) => `Abrir ${title}`,
  origins: {
    deadline: 'Prazo',
    monitoring: 'Monitoramento',
    movement: 'Movimentação',
    publication: 'Publicação',
    task: 'Tarefa',
  },
  readFilter: 'Leitura',
  readFilters: {
    read: 'Lidas',
    unread: 'Não lidas',
  },
  readStates: {
    read: 'Lida',
    unread: 'Não lida',
  },
  receivedFilter: 'Recebida',
  receivedFilters: {
    last30: 'Últimos 30 dias',
    last7: 'Últimos 7 dias',
    today: 'Hoje',
  },
  selectAll: 'Selecionar todas as entradas',
  selectedCount: (count) =>
    count === 1 ? '1 selecionada' : `${count} selecionadas`,
  selectEntry: (title) => `Selecionar ${title}`,
  selectionActions: 'Ações das entradas selecionadas',
  sort: 'Ordenar',
  sortBy: 'Ordenar por',
  sorts: {
    newest: 'Mais recentes',
    oldest: 'Mais antigas',
    unread: 'Não lidas primeiro',
  },
  title: 'Inbox',
  toolbar: 'Controles da Inbox',
  viewCountName: (label, count) =>
    `${label}, ${count} ${count === 1 ? 'não lida' : 'não lidas'}`,
}

export function resolveInbox1Labels(
  labels: Inbox1LabelsOverride | undefined,
): Inbox1Labels {
  const base = defaultInbox1Labels
  return {
    ...base,
    ...labels,
    actions: { ...base.actions, ...labels?.actions },
    categories: { ...base.categories, ...labels?.categories },
    columns: { ...base.columns, ...labels?.columns },
    kinds: { ...base.kinds, ...labels?.kinds },
    origins: { ...base.origins, ...labels?.origins },
    readFilters: { ...base.readFilters, ...labels?.readFilters },
    readStates: { ...base.readStates, ...labels?.readStates },
    receivedFilters: { ...base.receivedFilters, ...labels?.receivedFilters },
    sorts: { ...base.sorts, ...labels?.sorts },
  }
}
