import type {
  DataCollectionLoadLabels,
  DataCollectionLoadProps,
  DataCollectionPerson,
  DataCollectionSavedView,
  DataCollectionSavedViewLabels,
} from '../../shared/collection/types'

export type Finance4Mode = 'kanban' | 'list' | 'table'

export type Finance4View = 'all' | 'payable' | 'receivable'

export type Finance4EntryKind =
  | 'client_money_in'
  | 'client_money_out'
  | 'expense'
  | 'expense_reimbursement'
  | 'fee'

export type Finance4Direction = 'in' | 'out'

export type Finance4FeeType = 'contractual' | 'success' | 'sucumbencia'

export type Finance4Situation =
  | 'canceled'
  | 'open'
  | 'overdue'
  | 'renegotiated'
  | 'settled'

export type Finance4Sort = 'amount' | 'client' | 'due' | 'updated'

export type Finance4SortDirection = 'asc' | 'desc'

export type Finance4SortColumn = Extract<Finance4Sort, Finance4ColumnId>

export type Finance4GroupBy = 'case' | 'client' | 'kind' | 'situation'

export type Finance4KanbanGroupBy = Extract<Finance4GroupBy, 'situation'>

export type Finance4FilterId = 'kind' | 'lawyer' | 'situation'

export type Finance4Person = DataCollectionPerson

export type Finance4SavedView = DataCollectionSavedView

export interface Finance4Option {
  id: string
  label: string
}

export interface Finance4Case extends Finance4Option {
  number: string | null
}

export interface Finance4Entry {
  amount: number
  canSettle?: boolean
  caseId: string | null
  clientId: string | null
  description: string
  dueOn: string
  feeType: Finance4FeeType | null
  id: string
  kind: Finance4EntryKind
  responsibleId: string | null
  situation: Finance4Situation
  updatedAt: string
}

export type Finance4ColumnId =
  | 'amount'
  | 'case'
  | 'client'
  | 'description'
  | 'due'
  | 'kind'
  | 'responsible'
  | 'situation'

export interface Finance4Labels extends DataCollectionLoadLabels {
  activeFilters: (count: number) => string
  amountDirections: Record<Finance4Direction, string>
  assignTo: string
  changeResponsible: string
  clearFilters: string
  clearSelection: string
  columns: Record<Finance4ColumnId, string>
  create: string
  delete: string
  empty: string
  emptyColumn: string
  feeTypes: Record<Finance4FeeType, string>
  filter: string
  filterBy: Record<Finance4FilterId, string>
  filterProperties: string
  group: string
  groupBy: string
  groupings: Record<Finance4GroupBy | 'none', string>
  groupToggle: (group: string, collapsed: boolean) => string
  kinds: Record<Finance4EntryKind, string>
  layout: string
  layoutBy: string
  modes: Record<Finance4Mode, string>
  noCase: string
  noClient: string
  noResult: string
  noValue: string
  openEntry: (description: string) => string
  savedViews: DataCollectionSavedViewLabels
  selectAll: string
  selectedCount: (count: number) => string
  selectEntry: (description: string) => string
  selectionActions: string
  settle: string
  situations: Record<Finance4Situation, string>
  sort: string
  sortBy: string
  sortColumn: (
    column: Finance4SortColumn,
    direction: Finance4SortDirection | null,
  ) => string
  sorts: Record<Finance4Sort, string>
  title: string
  toolbar: string
  unassigned: string
  viewCountName: (label: string, count: number) => string
  viewList: string
  views: Record<Finance4View, string>
}

type Finance4LabelGroup =
  | 'amountDirections'
  | 'columns'
  | 'feeTypes'
  | 'filterBy'
  | 'groupings'
  | 'kinds'
  | 'modes'
  | 'savedViews'
  | 'situations'
  | 'sorts'
  | 'views'

export type Finance4LabelsOverride = Partial<
  Omit<Finance4Labels, Finance4LabelGroup>
> & {
  [TGroup in Finance4LabelGroup]?: Partial<Finance4Labels[TGroup]>
}

export interface Finance4Props extends DataCollectionLoadProps {
  cases?: Finance4Case[]
  className?: string
  clients?: Finance4Option[]
  collapsedGroupIds?: string[]
  counts?: Partial<Record<Finance4View, number>>
  currency?: string
  entries: Finance4Entry[]
  filtered?: boolean
  groupBy?: Finance4GroupBy | null
  kindFilter?: Finance4EntryKind | null
  labels?: Finance4LabelsOverride
  lawyerFilter?: string | null
  lawyers?: Finance4Person[]
  locale?: string
  mode?: Finance4Mode
  onBulkDelete?: (entryIds: string[]) => void
  onBulkResponsibleChange?: (entryIds: string[], lawyerId: string) => void
  onBulkSettle?: (entryIds: string[]) => void
  onCollapsedGroupIdsChange?: (groupIds: string[]) => void
  onCreate?: () => void
  onGroupByChange?: (groupBy: Finance4GroupBy | null) => void
  onKindFilterChange?: (kind: Finance4EntryKind | null) => void
  onLawyerFilterChange?: (lawyerId: string | null) => void
  onModeChange?: (mode: Finance4Mode) => void
  onOpen?: (entryId: string) => void
  onSavedViewCreate?: () => void
  onSavedViewDelete?: (savedViewId: string) => void
  onSavedViewDuplicate?: (savedViewId: string) => void
  onSavedViewRename?: (savedViewId: string) => void
  onSavedViewSelect?: (savedViewId: string | null) => void
  onSavedViewUpdate?: () => void
  onSelectedIdsChange?: (entryIds: string[]) => void
  onSituationFilterChange?: (situation: Finance4Situation | null) => void
  onSortChange?: (sort: Finance4Sort, direction: Finance4SortDirection) => void
  onViewChange?: (view: Finance4View) => void
  savedViewId?: string | null
  savedViewModified?: boolean
  savedViews?: Finance4SavedView[]
  savedViewsLoading?: boolean
  savedViewsPending?: boolean
  selectedIds?: string[]
  situationFilter?: Finance4Situation | null
  sort?: Finance4Sort
  sortDirection?: Finance4SortDirection
  view?: Finance4View
}
