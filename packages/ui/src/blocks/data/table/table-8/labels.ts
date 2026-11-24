import { defaultTableLoadLabels } from '../shared/labels'
import type { Table8Labels, Table8LabelsOverride } from './types'

export const defaultTable8Labels: Table8Labels = {
  ...defaultTableLoadLabels,
  allOptions: 'Todos',
  channels: {
    api: 'API',
    mobile: 'Mobile',
    pos: 'Maquininha',
    web: 'Web',
  },
  clearFilters: 'Limpar filtros',
  clearSelection: 'Limpar seleção',
  columns: {
    amount: 'Valor',
    channel: 'Canal',
    customer: 'Cliente',
    date: 'Data',
    method: 'Método',
    risk: 'Risco',
    select: 'Seleção',
    status: 'Status',
    transaction: 'Transação',
  },
  columnsMenu: 'Colunas',
  createView: 'Criar visualização',
  density: 'Altura das linhas',
  display: 'Exibição',
  empty: 'Nenhuma transação para exibir.',
  errorTitle: 'Não foi possível carregar as transações',
  export: 'Exportar',
  exportSelected: 'Exportar',
  filters: 'Filtros',
  flag: 'Sinalizar',
  loaded: (loaded, total) => `${loaded} de ${total} carregadas`,
  loading: 'Carregando transações',
  methodEnding: (method, lastFour) => `${method} com final ${lastFour}`,
  methods: {
    'apple-pay': 'Apple Pay',
    card: 'Cartão',
    'google-pay': 'Google Pay',
    paypal: 'PayPal',
  },
  refresh: 'Atualizar',
  refund: 'Estornar',
  risk: (band, score) => `Risco ${band}, ${score}`,
  riskBands: {
    high: 'alto',
    low: 'baixo',
    medium: 'médio',
  },
  search: 'Buscar id, cliente ou cartão',
  searchViews: 'Buscar visualizações',
  selectAll: 'Selecionar todas as transações carregadas',
  selected: (count, amount) =>
    count === 1
      ? `1 selecionada · Total de ${amount}`
      : `${count} selecionadas · Total de ${amount}`,
  selectionActions: 'Ações das transações selecionadas',
  selectRow: (transactionId) => `Selecionar ${transactionId}`,
  sortBy: 'Ordenar por',
  statuses: {
    failed: 'Falhou',
    pending: 'Pendente',
    refunded: 'Estornada',
    settled: 'Liquidada',
  },
  title: 'Transações',
  toolbar: 'Controles das transações',
  viewSettings: 'Configurações de visualização',
  views: 'Visualizações',
}

export function resolveTable8Labels(
  labels: Table8LabelsOverride | undefined,
): Table8Labels {
  return {
    ...defaultTable8Labels,
    ...labels,
    channels: { ...defaultTable8Labels.channels, ...labels?.channels },
    columns: { ...defaultTable8Labels.columns, ...labels?.columns },
    methods: { ...defaultTable8Labels.methods, ...labels?.methods },
    riskBands: { ...defaultTable8Labels.riskBands, ...labels?.riskBands },
    statuses: { ...defaultTable8Labels.statuses, ...labels?.statuses },
  }
}
