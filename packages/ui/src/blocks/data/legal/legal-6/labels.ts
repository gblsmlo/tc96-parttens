import {
  defaultDataCollectionLoadLabels,
  defaultDataCollectionSavedViewLabels,
  defaultDataCollectionToolbarLabels,
} from '../../shared/collection/labels'
import type { Legal6Labels, Legal6LabelsOverride } from './types'

export const defaultLegal6Labels: Legal6Labels = {
  ...defaultDataCollectionLoadLabels,
  allKinds: 'Todos os tipos',
  allOwners: 'Todos os responsáveis',
  clearFilters: defaultDataCollectionToolbarLabels.clearFilters,
  clientList: (clients) => clients.join(', '),
  columns: {
    client: 'Cliente',
    daysLeft: 'Faltam',
    deadline: 'Prazo',
    decision: 'Decisão',
    fatalDate: 'Data fatal',
    internalDate: 'Data interna',
    lawsuit: 'Processo',
    owner: 'Responsável',
  },
  confirm: 'Confirmar',
  create: 'Novo prazo',
  decisionOf: (label) => `Decidir proposta ${label}`,
  display: defaultDataCollectionToolbarLabels.display,
  emptyFiltered: 'Nenhum prazo nesta fila com estes filtros.',
  emptyViews: {
    all: 'Nenhum prazo em andamento.',
    'awaiting-closure': 'Nenhum prazo protocolado aguarda baixa.',
    mine: 'Nenhum prazo na sua fila.',
    overdue: 'Nenhum prazo atrasado.',
    proposed: 'Nenhum prazo proposto aguarda confirmação.',
    today: 'Nenhum prazo vence hoje ou amanhã.',
    unassigned: 'Todo prazo em andamento tem um responsável ativo.',
    week: 'Nenhum prazo vence nos próximos 5 dias úteis.',
  },
  errorTitle: 'Não foi possível carregar os prazos',
  filterCount: defaultDataCollectionToolbarLabels.filterCount,
  filters: defaultDataCollectionToolbarLabels.filters,
  kind: 'Tipo',
  loading: 'Carregando prazos',
  loadMore: 'Carregar mais',
  loadMoreError: 'Não foi possível carregar mais prazos. Tente de novo.',
  noDate: 'Sem data',
  openDeadline: (label, lawsuitTitle) =>
    `Abrir prazo ${label} de ${lawsuitTitle}`,
  owner: 'Responsável',
  reject: 'Rejeitar',
  savedViews: {
    ...defaultDataCollectionSavedViewLabels,
    create: 'Salvar visão atual…',
    savedViews: 'Minhas visões',
  },
  savePreference: 'Salvar preferência',
  seeView: (view) => `Ver ${view}`,
  sort: 'Ordenar',
  sortBy: 'Ordenar por',
  sorts: {
    fatal: 'Data fatal',
    internal: 'Data interna',
  },
  tableLabel: (title, view) => `${title}: ${view}`,
  title: 'Prazos',
  toolbar: 'Controles de prazos',
  unassigned: 'Sem responsável',
  viewCountName: (label, count) =>
    `${label}, ${count} ${count === 1 ? 'prazo' : 'prazos'}`,
  viewList: 'Filas',
  views: {
    all: 'Todos',
    'awaiting-closure': 'Aguardando baixa',
    mine: 'Minha fila',
    overdue: 'Atrasados',
    proposed: 'Propostos',
    today: 'Hoje e amanhã',
    unassigned: 'Sem responsável',
    week: 'Até 5 dias úteis',
  },
}

export function resolveLegal6Labels(
  labels: Legal6LabelsOverride | undefined,
): Legal6Labels {
  return {
    ...defaultLegal6Labels,
    ...labels,
    columns: { ...defaultLegal6Labels.columns, ...labels?.columns },
    emptyViews: { ...defaultLegal6Labels.emptyViews, ...labels?.emptyViews },
    savedViews: { ...defaultLegal6Labels.savedViews, ...labels?.savedViews },
    sorts: { ...defaultLegal6Labels.sorts, ...labels?.sorts },
    views: { ...defaultLegal6Labels.views, ...labels?.views },
  }
}
