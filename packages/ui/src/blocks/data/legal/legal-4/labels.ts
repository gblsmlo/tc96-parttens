import {
  defaultDataCollectionLoadLabels,
  defaultDataCollectionModeLabels,
  defaultDataCollectionToolbarLabels,
} from '../../shared/collection/labels'
import type { Legal4Labels, Legal4LabelsOverride } from './types'

export const defaultLegal4Labels: Legal4Labels = {
  ...defaultDataCollectionLoadLabels,
  ...defaultDataCollectionToolbarLabels,
  activeCases: (count) =>
    count === 1 ? '1 processo ativo' : `${count} processos ativos`,
  columns: {
    cases: 'Processos ativos',
    client: 'Cliente',
    contact: 'Contato principal',
    contracts: 'Contratos',
    owner: 'Responsável',
    queue: 'Fila',
    since: 'Cliente desde',
    status: 'Status',
  },
  contractCount: (count) => (count === 1 ? '1 contrato' : `${count} contratos`),
  create: 'Novo cliente',
  empty: 'Nenhum cliente para exibir.',
  errorTitle: 'Não foi possível carregar os clientes',
  kinds: {
    company: 'Pessoa jurídica',
    person: 'Pessoa física',
  },
  loading: 'Carregando clientes',
  modes: defaultDataCollectionModeLabels,
  noContact: 'Sem contato',
  noDate: 'Sem data',
  openClient: (name) => `Abrir ${name}`,
  queues: {
    billing: 'Cobrança',
    onboarding: 'Cadastro',
    relationship: 'Relacionamento',
    service: 'Atendimento',
  },
  statuses: {
    active: 'Ativo',
    defaulting: 'Inadimplente',
    inactive: 'Inativo',
    prospect: 'Prospecto',
  },
  summary: (visible, active) =>
    `${visible} ${visible === 1 ? 'cliente' : 'clientes'} · ${active} ${active === 1 ? 'ativo' : 'ativos'}`,
  title: 'Clientes',
  toolbar: 'Controles dos clientes',
  unassigned: 'Sem responsável',
}

export function resolveLegal4Labels(
  labels: Legal4LabelsOverride | undefined,
): Legal4Labels {
  return {
    ...defaultLegal4Labels,
    ...labels,
    columns: { ...defaultLegal4Labels.columns, ...labels?.columns },
    kinds: { ...defaultLegal4Labels.kinds, ...labels?.kinds },
    modes: { ...defaultLegal4Labels.modes, ...labels?.modes },
    queues: { ...defaultLegal4Labels.queues, ...labels?.queues },
    statuses: { ...defaultLegal4Labels.statuses, ...labels?.statuses },
  }
}
