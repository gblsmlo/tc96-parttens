import type {
  Finance4Labels,
  Finance4LabelsOverride,
  Finance4SortColumn,
} from './types'

const sortColumnNames = {
  amount: 'amount',
  client: 'client',
  due: 'due date',
} as const satisfies Record<Finance4SortColumn, string>

export const defaultFinance4Labels: Finance4Labels = {
  activeFilters: (count) =>
    count === 1 ? 'Filter, 1 active' : `Filter, ${count} active`,
  amountDirections: {
    in: 'Incoming',
    out: 'Outgoing',
  },
  assignTo: 'Assign to',
  changeResponsible: 'Change responsible',
  clearFilters: 'Clear filters',
  clearSelection: 'Clear selection',
  columns: {
    amount: 'Amount',
    case: 'Case',
    client: 'Client',
    description: 'Entry',
    due: 'Due',
    kind: 'Kind',
    responsible: 'Responsible',
    situation: 'Situation',
  },
  create: 'New entry',
  delete: 'Delete',
  empty: 'No entries yet.',
  emptyColumn: 'No entries in this column.',
  errorDescription: 'Check your connection and try again.',
  errorTitle: 'Could not load the entries',
  feeTypes: {
    contractual: 'Contractual fee',
    success: 'Success fee',
    sucumbencia: 'Court-awarded fee',
  },
  filter: 'Filter',
  filterBy: {
    kind: 'Kind',
    lawyer: 'Responsible',
    situation: 'Situation',
  },
  filterProperties: 'Properties',
  group: 'Group',
  groupBy: 'Group by',
  groupings: {
    case: 'Case',
    client: 'Client',
    kind: 'Kind',
    none: 'None',
    situation: 'Situation',
  },
  groupToggle: (group, collapsed) =>
    collapsed ? `Expand ${group}` : `Collapse ${group}`,
  kinds: {
    client_money_in: 'Client money in',
    client_money_out: 'Client money out',
    expense: 'Expense',
    expense_reimbursement: 'Expense reimbursement',
    fee: 'Fee',
  },
  layout: 'Layout',
  layoutBy: 'Show as',
  loading: 'Loading entries',
  modes: {
    kanban: 'Board',
    list: 'List',
    table: 'Table',
  },
  noCase: 'No case',
  noClient: 'No client',
  noResult: 'No entries match these filters.',
  noValue: '—',
  openEntry: (description) => `Open entry: ${description}`,
  retry: 'Try again',
  savedViews: {
    create: 'Save view',
    delete: 'Delete',
    duplicate: 'Duplicate',
    modified: (label) => `${label} (edited)`,
    options: (label) => `${label} options`,
    rename: 'Rename',
    savedViews: 'My views',
    search: 'Search views',
    searchPlaceholder: 'Search views...',
    update: (label) => `Update “${label}”`,
  },
  selectAll: 'Select all entries',
  selectedCount: (count) =>
    count === 1 ? '1 entry selected' : `${count} entries selected`,
  selectEntry: (description) => `Select ${description}`,
  selectionActions: 'Selected entries actions',
  settle: 'Mark as settled',
  situations: {
    canceled: 'Canceled',
    open: 'Open',
    overdue: 'Overdue',
    renegotiated: 'Renegotiated',
    settled: 'Settled',
  },
  sort: 'Sort',
  sortBy: 'Sort by',
  sortColumn: (column, direction) =>
    direction === 'asc'
      ? `Sort by ${sortColumnNames[column]}, ascending`
      : direction === 'desc'
        ? `Sort by ${sortColumnNames[column]}, descending`
        : `Sort by ${sortColumnNames[column]}`,
  sorts: {
    amount: 'Amount',
    client: 'Client',
    due: 'Due date',
    updated: 'Last update',
  },
  title: 'Entries',
  toolbar: 'Entries controls',
  unassigned: 'Unassigned',
  viewCountName: (label, count) =>
    count === 1 ? `${label}, 1 entry` : `${label}, ${count} entries`,
  viewList: 'Views',
  views: {
    all: 'All entries',
    payable: 'Payable',
    receivable: 'Receivable',
  },
}

export function resolveFinance4Labels(
  labels: Finance4LabelsOverride | undefined,
): Finance4Labels {
  const base = defaultFinance4Labels
  return {
    ...base,
    ...labels,
    amountDirections: {
      ...base.amountDirections,
      ...labels?.amountDirections,
    },
    columns: { ...base.columns, ...labels?.columns },
    feeTypes: { ...base.feeTypes, ...labels?.feeTypes },
    filterBy: { ...base.filterBy, ...labels?.filterBy },
    groupings: { ...base.groupings, ...labels?.groupings },
    kinds: { ...base.kinds, ...labels?.kinds },
    modes: { ...base.modes, ...labels?.modes },
    savedViews: { ...base.savedViews, ...labels?.savedViews },
    situations: { ...base.situations, ...labels?.situations },
    sorts: { ...base.sorts, ...labels?.sorts },
    views: { ...base.views, ...labels?.views },
  }
}
