import { defaultGridLoadLabels } from '../shared/labels'
import type { DataGrid4Labels, DataGrid4LabelsOverride } from './types'

export const defaultDataGrid4Labels: DataGrid4Labels = {
  ...defaultGridLoadLabels,
  addProduct: 'Adicionar produto',
  allSaved: 'Todas as alterações salvas',
  allStatuses: 'Todos',
  cellLabel: (column, value) => `${column}: ${value}`,
  changed: 'Alterado',
  clearFilters: 'Limpar filtros',
  columns: {
    actions: 'Ações',
    category: 'Categoria',
    price: 'Preço',
    product: 'Produto',
    status: 'Status',
    stock: 'Estoque',
    visible: 'Visível',
  },
  description: 'Edite preços e estoque direto na tabela.',
  discard: 'Descartar',
  empty: 'Nenhum produto para exibir.',
  emptyValue: 'Sem valor',
  errorTitle: 'Não foi possível carregar os produtos',
  filters: 'Filtros',
  loading: 'Carregando produtos',
  lowStock: 'Estoque baixo',
  priceInvalid: 'Informe um preço válido.',
  priceNegative: 'O preço não pode ser negativo.',
  rowActionsFor: (product) => `Ações de ${product}`,
  save: 'Salvar alterações',
  search: 'Buscar produtos',
  statusFilter: 'Status',
  statuses: {
    active: 'Ativo',
    archived: 'Arquivado',
    draft: 'Rascunho',
  },
  stockNegative: 'O estoque não pode ser negativo.',
  stockNotInteger: 'Use um número inteiro.',
  title: 'Inventário de produtos',
  toolbar: 'Controles do inventário',
  unsavedChanges: (count) =>
    count === 1 ? '1 alteração não salva' : `${count} alterações não salvas`,
  view: 'Exibição',
  viewWithFilters: (view, count) => `${view} (${count})`,
  visibleFor: (product) => `Mostrar ${product} na loja`,
}

export function resolveDataGrid4Labels(
  labels: DataGrid4LabelsOverride | undefined,
): DataGrid4Labels {
  return {
    ...defaultDataGrid4Labels,
    ...labels,
    columns: { ...defaultDataGrid4Labels.columns, ...labels?.columns },
    statuses: { ...defaultDataGrid4Labels.statuses, ...labels?.statuses },
  }
}
