import {
  defaultDataCollectionLoadLabels,
  defaultDataCollectionSavedViewLabels,
  defaultDataCollectionToolbarLabels,
} from '../../shared/collection/labels'
import type { Legal8Labels, Legal8LabelsOverride } from './types'

export const defaultLegal8Labels: Legal8Labels = {
  ...defaultDataCollectionLoadLabels,
  allOrigins: 'Todas as origens',
  clearFilters: defaultDataCollectionToolbarLabels.clearFilters,
  display: defaultDataCollectionToolbarLabels.display,
  errorTitle: 'Não foi possível carregar o monitoramento',
  failureColumns: {
    kind: 'Tipo',
    lastOccurredAt: 'Última ocorrência',
    occurrences: 'Ocorrências',
    origin: 'Origem',
    startedAt: 'Início',
    state: 'Situação',
  },
  failureKinds: {
    capture_stopped: 'Captura parada',
    oab_silent: 'OAB sem publicações',
    proposal_failed: 'Proposta de prazo não gerada',
  },
  failureOrigins: {
    external: 'Fonte externa',
    registration: 'Cadastro',
    system: 'Sistema',
  },
  failureStates: {
    open: 'Aberta',
    resolved: 'Resolvida',
  },
  failuresEmpty: 'Nenhuma falha aberta ou resolvida nos últimos 90 dias.',
  filterCount: defaultDataCollectionToolbarLabels.filterCount,
  filters: defaultDataCollectionToolbarLabels.filters,
  loading: 'Carregando monitoramento',
  nextSweep: (when) => `Próxima varredura: ${when}`,
  noValue: '—',
  openFailure: 'Ver falha',
  openFailureRow: (kind) => `Abrir falha ${kind}`,
  origin: 'Origem',
  retryNow: 'Tentar agora',
  runColumns: {
    error: 'Último erro',
    finishedAt: 'Fim',
    kind: 'Tipo',
    movements: 'Andamentos',
    publications: 'Publicações',
    startedAt: 'Início',
    state: 'Situação',
  },
  runFailed: 'Não foi possível rodar a captura agora. Tente de novo.',
  runKinds: {
    'court-sweep': 'Varredura do DJEN',
    'lawsuit-import': 'Importação',
    'oab-lookup': 'Busca por OAB',
  },
  runNow: 'Rodar agora',
  runStates: {
    dead: 'Falhou',
    done: 'Concluída',
    failed: 'Falhou, vai tentar de novo',
    queued: 'Na fila',
    running: 'Rodando',
  },
  runsEmpty: 'Nenhuma captura rodou ainda.',
  savedViews: {
    ...defaultDataCollectionSavedViewLabels,
    create: 'Salvar visão atual…',
    savedViews: 'Minhas visões',
  },
  savePreference: 'Salvar preferência',
  simulated: 'Simulado',
  sort: 'Ordenar',
  sortBy: 'Ordenar por',
  sorts: {
    newest: 'Mais recentes',
    oldest: 'Mais antigas',
  },
  stopped: (day) => `Captura parada desde ${day}`,
  title: 'Monitoramento',
  toolbar: 'Controles do monitoramento',
  upToDate: 'Captura em dia',
  viewCountName: (label, count) =>
    `${label}, ${count} ${count === 1 ? 'item' : 'itens'}`,
  viewList: 'Visão do monitoramento',
  views: {
    failures: 'Falhas',
    runs: 'Execuções',
  },
}

export function resolveLegal8Labels(
  labels: Legal8LabelsOverride | undefined,
): Legal8Labels {
  const base = defaultLegal8Labels
  return {
    ...base,
    ...labels,
    failureColumns: { ...base.failureColumns, ...labels?.failureColumns },
    failureKinds: { ...base.failureKinds, ...labels?.failureKinds },
    failureOrigins: { ...base.failureOrigins, ...labels?.failureOrigins },
    failureStates: { ...base.failureStates, ...labels?.failureStates },
    runColumns: { ...base.runColumns, ...labels?.runColumns },
    runKinds: { ...base.runKinds, ...labels?.runKinds },
    runStates: { ...base.runStates, ...labels?.runStates },
    savedViews: { ...base.savedViews, ...labels?.savedViews },
    sorts: { ...base.sorts, ...labels?.sorts },
    views: { ...base.views, ...labels?.views },
  }
}
