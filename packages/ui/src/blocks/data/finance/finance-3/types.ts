import type { CollectionPaginationButtonLabels } from '@tc96/ui/patterns/collection-pagination/components/collection-pagination'
import type {
  DataCollectionLoadLabels,
  DataCollectionLoadProps,
  DataCollectionPerson,
  DataCollectionSavedView,
  DataCollectionSavedViewLabels,
  DataCollectionSettingsToolbarLabels,
} from '../../shared/collection/types'

export type Finance3Variant =
  | 'clientMoney'
  | 'entries'
  | 'receivables'
  | 'statement'

export type Finance3View =
  | 'all'
  | 'collection'
  | 'payable'
  | 'receivable'
  | 'settled'

export type Finance3EntryKind =
  | 'client_money_in'
  | 'client_money_out'
  | 'expense'
  | 'expense_reimbursement'
  | 'fee'
  | 'other_income'
  | 'transfer'

export type Finance3EntryType = 'expense' | 'income' | 'transfer'

export type Finance3FeeType = 'contractual' | 'success' | 'sucumbencia'

export type Finance3Situation =
  | 'canceled'
  | 'open'
  | 'overdue'
  | 'renegotiated'
  | 'settled'

export type Finance3ChargeStatus =
  | 'active'
  | 'amount_mismatch'
  | 'canceled'
  | 'paid'
  | 'paid_after_cancel'

export type Finance3ChargeAction = 'issue' | 'reissue'

export type Finance3StatementLineKind =
  | 'opening'
  | 'reversal'
  | 'settlement'
  | 'transfer_in'
  | 'transfer_out'

export type Finance3Direction = 'in' | 'none' | 'out'

export type Finance3DueTone = 'danger' | 'neutral' | 'warning'

export type Finance3CategoryDirection = 'expense' | 'income'

export type Finance3SortDirection = 'asc' | 'desc'

export type Finance3Person = DataCollectionPerson

export type Finance3SavedView = DataCollectionSavedView

export interface Finance3Option {
  id: string
  label: string
}

export interface Finance3Category extends Finance3Option {
  direction?: Finance3CategoryDirection
}

export interface Finance3Entry {
  accountId: string | null
  amount: number
  canEdit?: boolean
  canSettle?: boolean
  categoryId: string | null
  counterpartAccountId?: string | null
  description: string
  dueOn: string
  feeType: Finance3FeeType | null
  id: string
  kind: Finance3EntryKind
  payer: string | null
  responsibleId: string | null
  situation: Finance3Situation
  target: string | null
}

export interface Finance3Due {
  label: string
  tone: Finance3DueTone
}

export interface Finance3Receivable {
  amount: number
  canContact: boolean
  charge: Finance3ChargeStatus | null
  chargeAction: Finance3ChargeAction | null
  chargeFailedOn: string | null
  due: Finance3Due
  id: string
  installment: string
  lastContact: string
  payer: string
}

export interface Finance3StatementLine {
  amount: number
  balance: number
  category: string | null
  counterpartAccount: string | null
  day: string
  description: string
  entryId: string | null
  id: string
  kind: Finance3StatementLineKind
  reason: string | null
}

export interface Finance3StatementSummary {
  account: string
  closingBalance: number
  from: string
  previousBalance: number
  to: string
}

export interface Finance3ClientBalance {
  amount: number
  id: string
  name: string
}

export type Finance3EntryColumnId =
  | 'account'
  | 'amount'
  | 'category'
  | 'description'
  | 'due'
  | 'feeType'
  | 'kind'
  | 'payer'
  | 'responsible'
  | 'situation'
  | 'target'

export type Finance3EntrySortColumn = Exclude<
  Finance3EntryColumnId,
  'situation'
>

export interface Finance3EntrySort {
  column: Finance3EntrySortColumn
  direction: Finance3SortDirection
}

export type Finance3ReceivableColumnId =
  | 'actions'
  | 'amount'
  | 'charge'
  | 'due'
  | 'installment'
  | 'lastContact'
  | 'payer'

export type Finance3StatementColumnId =
  | 'amount'
  | 'balance'
  | 'category'
  | 'counterpartAccount'
  | 'day'
  | 'description'
  | 'kind'
  | 'reason'

export type Finance3ClientMoneyColumnId = 'amount' | 'name'

export interface Finance3VariantLabels {
  empty: string
  errorTitle: string
  loading: string
  openRecord: (title: string) => string
  pagination: string
  title: string
  toolbar: string
}

export interface Finance3EntriesLabels extends Finance3VariantLabels {
  allAccounts: string
  allFeeTypes: string
  allSituations: string
  allTypes: string
  assignTo: string
  columns: Record<Finance3EntryColumnId, string>
  columnsMenu: string
  defaultSort: string
  feeTypes: Record<Finance3FeeType, string>
  kinds: Record<Finance3EntryKind, string>
  noAccount: string
  noCategory: string
  noResult: string
  search: string
  selectAll: string
  selectionActions: string
  selectRecord: (description: string) => string
  settle: string
  settleIn: string
  situations: Record<Finance3Situation, string>
  sort: string
  sortBy: string
  sortOption: (column: string, direction: Finance3SortDirection) => string
  transferAccounts: (from: string, to: string) => string
  type: string
  types: Record<Finance3EntryType, string>
  unassigned: string
}

export interface Finance3ReceivablesLabels extends Finance3VariantLabels {
  chargeFailed: (day: string) => string
  chargeStatuses: Record<Finance3ChargeStatus, string>
  columns: Record<Finance3ReceivableColumnId, string>
  contact: string
  issueCharge: string
  markCollected: string
  noCharge: string
  noPhone: string
  reissueCharge: string
  rowActions: (payer: string, installment: string) => string
  selectAll: string
  selectionActions: string
  selectRecord: (payer: string, installment: string) => string
  truncated: string
}

export interface Finance3StatementLabels extends Finance3VariantLabels {
  account: string
  closingBalance: string
  columns: Record<Finance3StatementColumnId, string>
  customPeriod: string
  defaultAccount: string
  export: string
  exportError: string
  exportRetry: string
  inflow: string
  kinds: Record<Finance3StatementLineKind, string>
  outflow: string
  period: string
  periodRange: (from: string, to: string) => string
  summary: (account: string, period: string, previousBalance: string) => string
}

export interface Finance3ClientMoneyLabels extends Finance3VariantLabels {
  columns: Record<Finance3ClientMoneyColumnId, string>
}

export interface Finance3Labels
  extends Pick<DataCollectionLoadLabels, 'errorDescription' | 'retry'>,
    Pick<
      DataCollectionSettingsToolbarLabels,
      'clearFilters' | 'display' | 'filterCount'
    > {
  clearSelection: string
  clientMoney: Finance3ClientMoneyLabels
  create: string
  entries: Finance3EntriesLabels
  filters: string
  noValue: string
  pageRange: (first: number, last: number, total: number) => string
  paginationButtons: CollectionPaginationButtonLabels
  receivables: Finance3ReceivablesLabels
  savedViews: DataCollectionSavedViewLabels
  savePreference: string
  selectedCount: (count: number) => string
  statement: Finance3StatementLabels
  viewCountName: (label: string, count: number) => string
  viewList: string
  views: Record<Finance3View, string>
}

type Finance3LabelGroup =
  | 'clientMoney'
  | 'entries'
  | 'paginationButtons'
  | 'receivables'
  | 'savedViews'
  | 'statement'
  | 'views'

type Finance3VariantOverride<TLabels, TGroup extends keyof TLabels> = Partial<
  Omit<TLabels, TGroup>
> & {
  [TKey in TGroup]?: Partial<TLabels[TKey]>
}

export type Finance3EntriesLabelsOverride = Finance3VariantOverride<
  Finance3EntriesLabels,
  'columns' | 'feeTypes' | 'kinds' | 'situations' | 'types'
>

export type Finance3ReceivablesLabelsOverride = Finance3VariantOverride<
  Finance3ReceivablesLabels,
  'chargeStatuses' | 'columns'
>

export type Finance3StatementLabelsOverride = Finance3VariantOverride<
  Finance3StatementLabels,
  'columns' | 'kinds'
>

export type Finance3ClientMoneyLabelsOverride = Finance3VariantOverride<
  Finance3ClientMoneyLabels,
  'columns'
>

export type Finance3LabelsOverride = Partial<
  Omit<Finance3Labels, Finance3LabelGroup>
> & {
  clientMoney?: Finance3ClientMoneyLabelsOverride
  entries?: Finance3EntriesLabelsOverride
  paginationButtons?: Partial<CollectionPaginationButtonLabels>
  receivables?: Finance3ReceivablesLabelsOverride
  savedViews?: Partial<DataCollectionSavedViewLabels>
  statement?: Finance3StatementLabelsOverride
  views?: Partial<Record<Finance3View, string>>
}

export interface Finance3FormatProps {
  currency?: string
  locale?: string
}

export interface Finance3PagingProps {
  onPageChange?: (page: number) => void
  page?: number
  pageCount?: number
  pageSize?: number
  total?: number
}

export interface Finance3SelectionProps {
  onSelectedIdsChange?: (recordIds: string[]) => void
  selectedIds?: string[]
}

export interface Finance3ViewProps {
  counts?: Partial<Record<Finance3View, number>>
  onCreate?: () => void
  onSavedViewCreate?: () => void
  onSavedViewDelete?: (savedViewId: string) => void
  onSavedViewDuplicate?: (savedViewId: string) => void
  onSavedViewRename?: (savedViewId: string) => void
  onSavedViewSelect?: (savedViewId: string) => void
  onSavedViewUpdate?: () => void
  onViewChange?: (view: Finance3View) => void
  savedViewId?: string | null
  savedViewModified?: boolean
  savedViews?: Finance3SavedView[]
  savedViewsLoading?: boolean
  savedViewsPending?: boolean
  view?: Finance3View
  views?: readonly Finance3View[]
}

interface Finance3BaseProps
  extends DataCollectionLoadProps,
    Finance3FormatProps,
    Finance3PagingProps {
  className?: string
  labels?: Finance3LabelsOverride
}

export interface Finance3EntriesProps
  extends Finance3BaseProps,
    Finance3SelectionProps,
    Finance3ViewProps {
  accountFilter?: string | null
  accounts?: Finance3Option[]
  accountsLoading?: boolean
  categories?: Finance3Category[]
  feeTypeFilter?: Finance3FeeType | null
  filtered?: boolean
  hiddenColumns?: Finance3EntryColumnId[]
  members?: Finance3Person[]
  onAccountChange?: (entryId: string, accountId: string | null) => void
  onAccountFilterChange?: (accountId: string | null) => void
  onBulkResponsibleChange?: (entryIds: string[], memberId: string) => void
  onBulkSettle?: (entryIds: string[], accountId: string) => void
  onCategoryChange?: (entryId: string, categoryId: string | null) => void
  onFeeTypeFilterChange?: (feeType: Finance3FeeType | null) => void
  onHiddenColumnsChange?: (columnIds: Finance3EntryColumnId[]) => void
  onOpen?: (entryId: string) => void
  onResponsibleChange?: (entryId: string, memberId: string) => void
  onSavePreference?: () => void
  onSearchChange?: (search: string) => void
  onSituationFilterChange?: (situation: Finance3Situation | null) => void
  onSortChange?: (sort: Finance3EntrySort | null) => void
  onTypeFilterChange?: (type: Finance3EntryType | null) => void
  records: Finance3Entry[]
  search?: string
  situationFilter?: Finance3Situation | null
  sort?: Finance3EntrySort | null
  typeFilter?: Finance3EntryType | null
  variant: 'entries'
}

export interface Finance3ReceivablesProps
  extends Finance3BaseProps,
    Finance3SelectionProps,
    Finance3ViewProps {
  onContact?: (receivableId: string) => void
  onIssueCharge?: (receivableId: string) => void
  onMarkCollected?: (receivableIds: string[]) => void
  onReissueCharge?: (receivableId: string) => void
  records: Finance3Receivable[]
  truncated?: boolean
  variant: 'receivables'
}

export interface Finance3StatementProps extends Finance3BaseProps {
  accountFilter?: string | null
  accounts?: Finance3Option[]
  accountsLoading?: boolean
  exportError?: boolean
  exporting?: boolean
  onAccountFilterChange?: (accountId: string | null) => void
  onExport?: () => void
  onOpen?: (entryId: string) => void
  onPeriodChange?: (periodId: string | null) => void
  period?: string | null
  periods?: Finance3Option[]
  records: Finance3StatementLine[]
  summary?: Finance3StatementSummary
  variant: 'statement'
}

export interface Finance3ClientMoneyProps extends Finance3BaseProps {
  onOpen?: (clientId: string) => void
  records: Finance3ClientBalance[]
  variant: 'clientMoney'
}

export type Finance3Props =
  | Finance3ClientMoneyProps
  | Finance3EntriesProps
  | Finance3ReceivablesProps
  | Finance3StatementProps
