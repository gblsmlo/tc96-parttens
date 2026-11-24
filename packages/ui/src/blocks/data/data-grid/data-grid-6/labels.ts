import { defaultGridLoadLabels } from '../shared/labels'
import type { DataGrid6Labels, DataGrid6LabelsOverride } from './types'

export const defaultDataGrid6Labels: DataGrid6Labels = {
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

export function resolveDataGrid6Labels(
  labels: DataGrid6LabelsOverride | undefined,
): DataGrid6Labels {
  return {
    ...defaultDataGrid6Labels,
    ...labels,
    columns: { ...defaultDataGrid6Labels.columns, ...labels?.columns },
    densities: { ...defaultDataGrid6Labels.densities, ...labels?.densities },
    health: { ...defaultDataGrid6Labels.health, ...labels?.health },
  }
}
