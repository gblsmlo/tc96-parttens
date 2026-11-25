import type { Dashboard7Labels } from './types'

const joinAmounts = (items: { label: string; value: string }[]) =>
  items.map((item) => `${item.label}: ${item.value}`).join('; ')

export const defaultDashboard7Labels: Dashboard7Labels = {
  account: 'Conta',
  accountsEmpty: 'Nenhuma conta ativa.',
  accountsTitle: 'Saldo realizado por conta',
  balancesTitle: 'Saldos',
  breadcrumb: 'Navegação estrutural',
  cashFlowEmpty: 'Nenhuma entrada ou saída neste período.',
  cashFlowLabel: 'Entradas e saídas por mês, com os meses previstos tracejados',
  cashFlowSummary: (items) =>
    items
      .map(
        (item) =>
          `${item.month}${item.forecast ? ' (previsto)' : ''}: entradas ${item.inflow}, saídas ${item.outflow}`,
      )
      .join('; '),
  cashFlowTitle: 'Entradas × saídas por mês',
  cashFlowTooltip: (month, series, value, forecast) =>
    `${month}${forecast ? ' (previsto)' : ''} · ${series}: ${value}`,
  cashMarginHelp:
    'Entradas menos saídas pagas, divididas pelas entradas, dos últimos 3 meses fechados até hoje.',
  cashMarginLabel: 'Margem de caixa',
  categoriesEmpty: {
    expense: 'Nenhuma despesa neste período.',
    income: 'Nenhuma receita neste período.',
  },
  categoriesLabel: {
    expense: 'Despesa por categoria',
    income: 'Receita por categoria',
  },
  categoriesSummary: joinAmounts,
  categoriesTitle: 'Por categoria',
  categoryKind: 'Tipo de categoria',
  categoryKinds: { expense: 'Despesas', income: 'Receitas' },
  categoryTooltip: (name, value, share) => `${name}: ${value} (${share})`,
  cellEntries: (row, month, value) =>
    `Lançamentos de ${row} em ${month}: ${value}`,
  clientMoneyEmpty: 'Nenhum valor de clientes em custódia.',
  clientMoneyTitle: 'Dinheiro de clientes',
  collectionDaysHelp:
    'Receitas em aberto mais as recebidas depois do período, vezes os dias do período, divididas pelas receitas vencidas no período.',
  collectionDaysLabel: 'Prazo de recebimento',
  columnBalance: 'Saldo',
  columnClient: 'Cliente',
  columnLine: 'Linha',
  days: (count, formatted) =>
    count === 1 ? `${formatted} dia` : `${formatted} dias`,
  delinquencyHelp:
    'Receitas vencidas nos últimos 3 meses fechados ainda em aberto, divididas por todas as receitas vencidas nesses meses.',
  delinquencyLabel: 'Inadimplência',
  description: 'Saldos, indicadores e o fluxo de caixa do período.',
  dueSoonEmpty: 'Nada vence nos próximos 7 dias.',
  dueSoonTitle: 'Vence nos próximos 7 dias',
  emptyDescription: 'Os números aparecem aqui assim que houver lançamentos.',
  emptyTitle: 'Nenhum lançamento no período',
  entryMeta: (kind, date) => `${kind} · ${date}`,
  errorDescription: 'Confira a conta e o período (no máximo 24 meses).',
  errorTitle: 'Não foi possível carregar o analítico',
  export: 'Exportar',
  forecastSeries: 'Previsto',
  gridEmpty: 'Nenhum mês neste período.',
  gridScroll: 'Meses do fluxo de caixa',
  gridTitle: 'Fluxo de caixa',
  indicatorsTitle: 'Indicadores',
  inflowSeries: 'Entradas',
  loading: 'Carregando o analítico financeiro',
  monthColumns: {
    current: 'Mês atual',
    forecast: 'Previsto',
    realized: 'Realizado',
  },
  nextPage: 'Próxima página',
  noData: 'Sem dados',
  outflowSeries: 'Saídas',
  pageOf: (page, pageCount) => `Página ${page} de ${pageCount}`,
  pagination: 'Paginação de valores de clientes',
  period: 'Período',
  previousPage: 'Página anterior',
  projectedBalance: (date) => `Saldo previsto em ${date}`,
  projectedHelp:
    'Saldo atual mais as entradas menos as saídas em aberto que vencem até a data.',
  realizedBalance: 'Saldo realizado hoje',
  realizedHelp:
    'Saldo de abertura das contas mais tudo o que foi pago e recebido até hoje.',
  receivablesLabel: 'Valores a receber, vencidos e recebidos no período',
  receivablesStates: {
    open: 'A receber',
    overdue: 'Vencido',
    received: 'Recebido',
  },
  receivablesSummary: joinAmounts,
  receivablesTitle: 'A receber, vencido e recebido',
  receivablesTotal: 'Total no período',
  receivablesTooltip: (label, value) => `${label}: ${value}`,
  resultLabel: 'Resultado',
  retry: 'Tentar de novo',
  runwayHelp:
    'Saldo atual dividido pela média mensal das saídas pagas nos últimos 3 meses fechados.',
  runwayLabel: 'Fôlego de caixa',
  seriesLegend: 'Legenda do gráfico',
  title: 'Analítico financeiro',
}
