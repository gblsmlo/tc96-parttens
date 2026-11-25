import {
  defaultDataCollectionLoadLabels,
  defaultDataCollectionModeLabels,
  defaultDataCollectionToolbarLabels,
} from '../../shared/collection/labels'
import type { Legal1Labels, Legal1LabelsOverride } from './types'

export const defaultLegal1Labels: Legal1Labels = {
  ...defaultDataCollectionLoadLabels,
  ...defaultDataCollectionToolbarLabels,
  areas: {
    civil: 'Cível',
    consumer: 'Consumidor',
    corporate: 'Empresarial',
    labor: 'Trabalhista',
    tax: 'Tributário',
  },
  columns: {
    area: 'Área',
    client: 'Cliente',
    court: 'Instância',
    deadline: 'Próximo prazo',
    number: 'Número do processo',
    owner: 'Responsável',
    phase: 'Fase',
    queue: 'Fila',
    status: 'Status',
    title: 'Título',
  },
  copyNumber: 'Copiar número do processo',
  create: 'Novo processo',
  empty: 'Nenhum processo para exibir.',
  emptyColumn: 'Nenhum processo nesta fase.',
  errorTitle: 'Não foi possível carregar os processos',
  loading: 'Carregando processos',
  modes: defaultDataCollectionModeLabels,
  noCourt: 'Extrajudicial',
  noDeadline: 'Sem prazo',
  noNumber: 'Sem número',
  openCase: (title) => `Abrir ${title}`,
  phases: {
    appeal: 'Recurso',
    enforcement: 'Cumprimento',
    evidence: 'Instrução',
    filing: 'Petição inicial',
    judgment: 'Sentença',
  },
  queues: {
    drafting: 'Peticionamento',
    hearings: 'Audiências',
    intake: 'Triagem',
    review: 'Revisão',
  },
  statuses: {
    active: 'Ativo',
    closed: 'Encerrado',
    settled: 'Acordo',
    suspended: 'Suspenso',
  },
  title: 'Processos',
  toolbar: 'Controles dos processos',
  unassigned: 'Sem responsável',
  viewList: 'Visões',
  views: {
    all: 'Todos',
    lawsuits: 'Processos',
    matters: 'Casos',
  },
}

export function resolveLegal1Labels(
  labels: Legal1LabelsOverride | undefined,
): Legal1Labels {
  return {
    ...defaultLegal1Labels,
    ...labels,
    areas: { ...defaultLegal1Labels.areas, ...labels?.areas },
    columns: { ...defaultLegal1Labels.columns, ...labels?.columns },
    modes: { ...defaultLegal1Labels.modes, ...labels?.modes },
    phases: { ...defaultLegal1Labels.phases, ...labels?.phases },
    queues: { ...defaultLegal1Labels.queues, ...labels?.queues },
    statuses: { ...defaultLegal1Labels.statuses, ...labels?.statuses },
    views: { ...defaultLegal1Labels.views, ...labels?.views },
  }
}
