import type {
  DataCollectionFormatProps,
  DataCollectionLoadLabels,
  DataCollectionLoadProps,
  DataCollectionPerson,
  DataCollectionSavedView,
  DataCollectionSavedViewLabels,
  DataCollectionToolbarLabels,
} from '../../shared/collection/types'

export type Legal6View =
  | 'all'
  | 'awaiting-closure'
  | 'mine'
  | 'overdue'
  | 'proposed'
  | 'today'
  | 'unassigned'
  | 'week'

export type Legal6Sort = 'fatal' | 'internal'

export type Legal6Tone = 'danger' | 'neutral' | 'warning'

export type Legal6DateFormat = 'numeric' | 'short'

export type Legal6SavedView = DataCollectionSavedView

export type Legal6Person = DataCollectionPerson

export interface Legal6Kind {
  id: string
  label: string
}

export interface Legal6DaysLeft {
  label: string
  tone: Legal6Tone
}

export interface Legal6Deadline {
  clients: string[]
  daysLeft: Legal6DaysLeft
  fatalDate: string
  id: string
  internalDate: string
  kind: string | null
  label: string
  lawsuitTitle: string
  ownerId: string | null
}

export type Legal6ColumnId =
  | 'client'
  | 'daysLeft'
  | 'deadline'
  | 'decision'
  | 'fatalDate'
  | 'internalDate'
  | 'lawsuit'
  | 'owner'

export type Legal6Counts = Partial<Record<Legal6View, number>>

export interface Legal6Labels
  extends DataCollectionLoadLabels,
    Pick<
      DataCollectionToolbarLabels,
      | 'clearFilters'
      | 'create'
      | 'display'
      | 'filterCount'
      | 'filters'
      | 'title'
      | 'toolbar'
    > {
  allKinds: string
  allOwners: string
  clientList: (clients: readonly string[]) => string
  columns: Record<Legal6ColumnId, string>
  confirm: string
  decisionOf: (label: string) => string
  emptyFiltered: string
  emptyViews: Record<Legal6View, string>
  kind: string
  loadMore: string
  loadMoreError: string
  noDate: string
  openDeadline: (label: string, lawsuitTitle: string) => string
  owner: string
  reject: string
  savedViews: DataCollectionSavedViewLabels
  savePreference: string
  seeView: (view: string) => string
  sort: string
  sortBy: string
  sorts: Record<Legal6Sort, string>
  tableLabel: (title: string, view: string) => string
  unassigned: string
  viewCountName: (label: string, count: number) => string
  viewList: string
  views: Record<Legal6View, string>
}

export type Legal6LabelsOverride = Partial<
  Omit<
    Legal6Labels,
    'columns' | 'emptyViews' | 'savedViews' | 'sorts' | 'views'
  >
> & {
  columns?: Partial<Legal6Labels['columns']>
  emptyViews?: Partial<Legal6Labels['emptyViews']>
  savedViews?: Partial<Legal6Labels['savedViews']>
  sorts?: Partial<Legal6Labels['sorts']>
  views?: Partial<Legal6Labels['views']>
}

export interface Legal6Props
  extends DataCollectionFormatProps,
    DataCollectionLoadProps {
  className?: string
  counts?: Legal6Counts
  dateFormat?: Legal6DateFormat
  deadlines: Legal6Deadline[]
  filtered?: boolean
  hasMore?: boolean
  kindFilter?: string | null
  kinds?: Legal6Kind[]
  kindsLoading?: boolean
  labels?: Legal6LabelsOverride
  loadingMore?: boolean
  loadMoreError?: boolean
  onConfirm?: (deadlineId: string) => void
  onCreate?: () => void
  onKindFilterChange?: (kindId: string | null) => void
  onLoadMore?: () => void
  onOpen?: (deadlineId: string) => void
  onOwnerFilterChange?: (ownerId: string | null) => void
  onReject?: (deadlineId: string) => void
  onSavedViewCreate?: () => void
  onSavedViewDelete?: (savedViewId: string) => void
  onSavedViewDuplicate?: (savedViewId: string) => void
  onSavedViewRename?: (savedViewId: string) => void
  onSavedViewSelect?: (savedViewId: string) => void
  onSavedViewUpdate?: () => void
  onSavePreference?: () => void
  onSortChange?: (sort: Legal6Sort) => void
  onViewChange?: (view: Legal6View) => void
  ownerFilter?: string | null
  owners?: Legal6Person[]
  ownersLoading?: boolean
  savedViewId?: string | null
  savedViewModified?: boolean
  savedViews?: Legal6SavedView[]
  savedViewsLoading?: boolean
  savedViewsPending?: boolean
  sort?: Legal6Sort
  view?: Legal6View
  views?: readonly Legal6View[]
}
