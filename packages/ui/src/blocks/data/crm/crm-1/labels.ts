import {
  defaultDataCollectionModeLabels,
  defaultDataCollectionSavedViewLabels,
} from '../../shared/collection/labels'
import type { Crm1Labels, Crm1LabelsOverride } from './types'

export const defaultCrm1Labels: Crm1Labels = {
  allLeads: 'Todos os leads',
  archive: 'Arquivar',
  archived: 'Arquivado',
  archivedFilter: 'Arquivados',
  archivedOptions: {
    exclude: 'Ocultar arquivados',
    include: 'Incluir arquivados',
    only: 'Somente arquivados',
  },
  clearFilters: 'Limpar filtros',
  clearSelection: 'Limpar seleção',
  companies: {
    columns: {
      document: 'CNPJ',
      name: 'Empresa',
      phone: 'Telefone',
      sector: 'Setor',
      tags: 'Tags',
    },
    create: 'Nova empresa',
    empty: 'Nenhuma empresa cadastrada.',
    errorTitle: 'Não foi possível listar as empresas',
    loading: 'Carregando empresas',
    noDocument: 'Sem CNPJ',
    noResult: 'Nenhuma empresa com esses filtros.',
    pagination: 'Paginação de empresas',
    search: 'Buscar empresas',
    selectAll: 'Selecionar todas as empresas',
    selectionActions: 'Ações das empresas selecionadas',
    title: 'Empresas',
    toolbar: 'Controles de empresas',
  },
  copyEmail: 'Copiar e-mail',
  display: 'Exibição',
  errorDescription: 'Confira a busca e os filtros.',
  filterCount: (label, count) => `${label} (${count})`,
  filters: 'Filtros',
  leadFilter: 'Leads',
  leadStatuses: {
    lost: 'Perdidos',
    open: 'Em aberto',
    won: 'Ganhos',
  },
  modes: defaultDataCollectionModeLabels,
  noEmail: 'Sem e-mail',
  noPhone: 'Sem telefone',
  noSector: 'Sem setor',
  openRecord: (name) => `Abrir ${name}`,
  pageRange: (first, last, total) =>
    total === 0 ? '0 de 0' : `${first}–${last} de ${total}`,
  paginationButtons: {
    first: 'Primeira página',
    last: 'Última página',
    next: 'Próxima página',
    previous: 'Página anterior',
  },
  people: {
    columns: {
      document: 'CPF',
      email: 'E-mail',
      name: 'Pessoa',
      phone: 'Telefone',
      tags: 'Tags',
    },
    create: 'Nova pessoa',
    empty: 'Nenhuma pessoa cadastrada.',
    errorTitle: 'Não foi possível listar as pessoas',
    loading: 'Carregando pessoas',
    noDocument: 'Sem CPF',
    noResult: 'Nenhuma pessoa com esses filtros.',
    pagination: 'Paginação de pessoas',
    search: 'Buscar pessoas',
    selectAll: 'Selecionar todas as pessoas',
    selectionActions: 'Ações das pessoas selecionadas',
    title: 'Pessoas',
    toolbar: 'Controles de pessoas',
  },
  retry: 'Tentar novamente',
  savedViews: {
    ...defaultDataCollectionSavedViewLabels,
    savedViews: 'Minhas visões',
  },
  savePreference: 'Salvar preferência',
  selectRecord: (name) => `Selecionar ${name}`,
  selectedCount: (count) =>
    `${count} ${count === 1 ? 'selecionada' : 'selecionadas'}`,
  setSector: 'Definir setor',
  sort: 'Ordenar',
  sortBy: 'Ordenar por',
  sorts: {
    created_desc: 'Mais recentes',
    name_asc: 'Nome (A–Z)',
    name_desc: 'Nome (Z–A)',
  },
  tags: 'Tags',
  unarchive: 'Desarquivar',
  viewCountName: (label, count) =>
    `${label}, ${count} ${count === 1 ? 'item' : 'itens'}`,
  viewList: 'Contatos',
}

export function resolveCrm1Labels(
  labels: Crm1LabelsOverride | undefined,
): Crm1Labels {
  const base = defaultCrm1Labels
  return {
    ...base,
    ...labels,
    archivedOptions: { ...base.archivedOptions, ...labels?.archivedOptions },
    companies: {
      ...base.companies,
      ...labels?.companies,
      columns: { ...base.companies.columns, ...labels?.companies?.columns },
    },
    leadStatuses: { ...base.leadStatuses, ...labels?.leadStatuses },
    modes: { ...base.modes, ...labels?.modes },
    paginationButtons: {
      ...base.paginationButtons,
      ...labels?.paginationButtons,
    },
    people: {
      ...base.people,
      ...labels?.people,
      columns: { ...base.people.columns, ...labels?.people?.columns },
    },
    savedViews: { ...base.savedViews, ...labels?.savedViews },
    sorts: { ...base.sorts, ...labels?.sorts },
  }
}
