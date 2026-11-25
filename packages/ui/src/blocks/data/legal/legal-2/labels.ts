import {
  defaultDataCollectionLoadLabels,
  defaultDataCollectionModeLabels,
  defaultDataCollectionToolbarLabels,
} from '../../shared/collection/labels'
import type { Legal2Labels, Legal2LabelsOverride } from './types'

export const defaultLegal2Labels: Legal2Labels = {
  ...defaultDataCollectionLoadLabels,
  ...defaultDataCollectionToolbarLabels,
  columns: {
    contract: 'Contrato',
    owner: 'Responsável',
    parties: 'Partes',
    queue: 'Fila',
    status: 'Status',
    term: 'Vigência até',
    type: 'Tipo',
    value: 'Valor',
  },
  create: 'Novo contrato',
  empty: 'Nenhum contrato para exibir.',
  errorTitle: 'Não foi possível carregar os contratos',
  loading: 'Carregando contratos',
  modes: defaultDataCollectionModeLabels,
  noEndDate: 'Prazo indeterminado',
  noValue: 'Sem valor',
  openContract: (title) => `Abrir ${title}`,
  queues: {
    drafting: 'Redação',
    negotiation: 'Negociação',
    renewal: 'Renovação',
    signature: 'Assinatura',
  },
  statuses: {
    draft: 'Rascunho',
    expired: 'Vencido',
    review: 'Em revisão',
    signed: 'Assinado',
  },
  summary: (visible, signed) =>
    `${visible} ${visible === 1 ? 'contrato' : 'contratos'} · ${signed} ${signed === 1 ? 'assinado' : 'assinados'}`,
  title: 'Contratos',
  toolbar: 'Controles dos contratos',
  types: {
    fees: 'Honorários',
    lease: 'Locação',
    nda: 'Confidencialidade',
    partnership: 'Parceria',
    services: 'Prestação de serviços',
  },
  unassigned: 'Sem responsável',
}

export function resolveLegal2Labels(
  labels: Legal2LabelsOverride | undefined,
): Legal2Labels {
  return {
    ...defaultLegal2Labels,
    ...labels,
    columns: { ...defaultLegal2Labels.columns, ...labels?.columns },
    modes: { ...defaultLegal2Labels.modes, ...labels?.modes },
    queues: { ...defaultLegal2Labels.queues, ...labels?.queues },
    statuses: { ...defaultLegal2Labels.statuses, ...labels?.statuses },
    types: { ...defaultLegal2Labels.types, ...labels?.types },
  }
}
