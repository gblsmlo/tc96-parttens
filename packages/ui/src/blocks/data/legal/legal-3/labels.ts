import {
  defaultLegalLoadLabels,
  defaultLegalModeLabels,
  defaultLegalToolbarLabels,
} from '../shared/labels'
import type { Legal3Labels, Legal3LabelsOverride } from './types'

export const defaultLegal3Labels: Legal3Labels = {
  ...defaultLegalLoadLabels,
  ...defaultLegalToolbarLabels,
  columns: {
    case: 'Processo vinculado',
    deadline: 'Prazo',
    due: 'Data fatal',
    kind: 'Tipo',
    owner: 'Responsável',
    queue: 'Fila',
    status: 'Status',
  },
  create: 'Novo prazo',
  empty: 'Nenhum prazo para exibir.',
  errorTitle: 'Não foi possível carregar os prazos',
  kinds: {
    answer: 'Contestação',
    appeal: 'Recurso',
    filing: 'Manifestação',
    hearing: 'Audiência',
  },
  loading: 'Carregando prazos',
  modes: defaultLegalModeLabels,
  noDate: 'Sem data',
  openDeadline: (title) => `Abrir ${title}`,
  queues: {
    drafting: 'Elaboração',
    filing: 'Protocolo',
    intake: 'Triagem',
    review: 'Revisão',
  },
  statuses: {
    done: 'Cumprido',
    missed: 'Perdido',
    pending: 'Pendente',
  },
  summary: (visible, pending) =>
    `${visible} ${visible === 1 ? 'prazo' : 'prazos'} · ${pending} ${pending === 1 ? 'pendente' : 'pendentes'}`,
  title: 'Prazos',
  toolbar: 'Controles dos prazos',
  unassigned: 'Sem responsável',
}

export function resolveLegal3Labels(
  labels: Legal3LabelsOverride | undefined,
): Legal3Labels {
  return {
    ...defaultLegal3Labels,
    ...labels,
    columns: { ...defaultLegal3Labels.columns, ...labels?.columns },
    kinds: { ...defaultLegal3Labels.kinds, ...labels?.kinds },
    modes: { ...defaultLegal3Labels.modes, ...labels?.modes },
    queues: { ...defaultLegal3Labels.queues, ...labels?.queues },
    statuses: { ...defaultLegal3Labels.statuses, ...labels?.statuses },
  }
}
