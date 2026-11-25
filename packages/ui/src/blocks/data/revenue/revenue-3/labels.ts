import { defaultGridLoadLabels } from '../../shared/grid/labels'
import type { Revenue3Labels, Revenue3LabelsOverride } from './types'

export const defaultRevenue3Labels: Revenue3Labels = {
  ...defaultGridLoadLabels,
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
    compact: 'Compacta',
    'extra-tall': 'Extra alta',
    medium: 'Média',
    short: 'Padrão',
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

export function resolveRevenue3Labels(
  labels: Revenue3LabelsOverride | undefined,
): Revenue3Labels {
  return {
    ...defaultRevenue3Labels,
    ...labels,
    columns: { ...defaultRevenue3Labels.columns, ...labels?.columns },
    densities: { ...defaultRevenue3Labels.densities, ...labels?.densities },
    health: { ...defaultRevenue3Labels.health, ...labels?.health },
  }
}
