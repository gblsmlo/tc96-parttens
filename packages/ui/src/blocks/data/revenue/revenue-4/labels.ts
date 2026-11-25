import { defaultTableLoadLabels } from '../../shared/table/labels'
import type { Revenue4Labels, Revenue4LabelsOverride } from './types'

export const defaultRevenue4Labels: Revenue4Labels = {
  ...defaultTableLoadLabels,
  allOptions: 'Todas',
  atRiskArr: 'ARR em risco',
  clearFilters: 'Limpar filtros',
  collapseAll: 'Recolher tudo',
  columns: {
    account: 'Conta',
    actions: 'Ações',
    arr: 'ARR',
    health: 'Saúde',
    nrr: 'NRR',
    owner: 'Responsável',
    renewal: 'Renovação',
  },
  columnsMenu: 'Colunas',
  densities: {
    'extra-tall': 'Extra alta',
    medium: 'Média',
    short: 'Compacta',
    tall: 'Alta',
  },
  density: 'Altura das linhas',
  description: 'Retenção líquida e renovações de toda a carteira.',
  display: 'Exibição',
  empty: 'Nenhuma conta para exibir.',
  errorTitle: 'Não foi possível carregar as contas',
  expandAll: 'Expandir tudo',
  export: 'Exportar',
  filters: 'Filtros',
  filtersTrigger: (label, activeFilters) => `${label} (${activeFilters})`,
  groupToggle: (region, collapsed) =>
    `${collapsed ? 'Expandir' : 'Recolher'} ${region}`,
  health: {
    atRisk: 'Em risco',
    healthy: 'Saudável',
    watch: 'Atenção',
  },
  kpis: 'Indicadores da carteira',
  loading: 'Carregando contas',
  nextRenewal: (date) => `Próxima ${date}`,
  nrrTrend: (direction) => (direction === 'up' ? 'Em expansão' : 'Em retração'),
  portfolioNrr: 'NRR da carteira',
  rowActionsFor: (account) => `Ações de ${account}`,
  search: 'Buscar contas',
  title: 'Receita por região',
  toolbar: 'Controles das contas',
  totalArr: 'ARR total',
}

export function resolveRevenue4Labels(
  labels: Revenue4LabelsOverride | undefined,
): Revenue4Labels {
  return {
    ...defaultRevenue4Labels,
    ...labels,
    columns: { ...defaultRevenue4Labels.columns, ...labels?.columns },
    densities: { ...defaultRevenue4Labels.densities, ...labels?.densities },
    health: { ...defaultRevenue4Labels.health, ...labels?.health },
  }
}
