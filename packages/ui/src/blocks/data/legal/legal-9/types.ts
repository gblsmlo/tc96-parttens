import type { CollectionPaginationButtonLabels } from '@tc96/ui/patterns/collection-pagination/components/collection-pagination'
import type {
  DataCollectionLoadLabels,
  DataCollectionLoadProps,
  DataCollectionModeLabels,
  DataCollectionPerson,
  DataCollectionSavedView,
  DataCollectionSavedViewLabels,
  DataCollectionSettingsToolbarLabels,
} from '../../shared/collection/types'

export type Legal9Mode = 'list' | 'table'

export type Legal9Status = 'active' | 'closed'

export type Legal9BillingModel =
  | 'contingency'
  | 'fixed'
  | 'hourly'
  | 'other'
  | 'subscription'

export type Legal9Sort = 'amount' | 'title' | 'updated'

export type Legal9GroupBy = 'billingModel' | 'owner' | 'status'

export type Legal9Person = DataCollectionPerson

export type Legal9SavedView = DataCollectionSavedView

export interface Legal9Record {
  amountCents: number | null
  billingModel: Legal9BillingModel | null
  editable: boolean
  holder: string | null
  id: string
  ownerId: string | null
  status: Legal9Status
  title: string
}

export type Legal9ColumnId =
  | 'amount'
  | 'billingModel'
  | 'holder'
  | 'owner'
  | 'status'
  | 'title'

export interface Legal9Labels
  extends DataCollectionLoadLabels,
    DataCollectionSettingsToolbarLabels {
  allBillingModels: string
  allOwners: string
  allStatuses: string
  billingModels: Record<Legal9BillingModel, string>
  clearSelection: string
  columns: Record<Legal9ColumnId, string>
  create: string
  defaultView: string
  empty: string
  emptyGroup: string
  filters: string
  group: string
  groupBy: string
  groupings: Record<Legal9GroupBy, string>
  groupToggle: (group: string, collapsed: boolean) => string
  modes: DataCollectionModeLabels
  noAmount: string
  noBillingModel: string
  noGrouping: string
  noHolder: string
  noResult: string
  openRecord: (title: string) => string
  pageRange: (first: number, last: number, total: number) => string
  pagination: string
  paginationButtons: CollectionPaginationButtonLabels
  savedViews: DataCollectionSavedViewLabels
  savePreference: string
  search: string
  selectAll: string
  selectRecord: (title: string) => string
  selectedCount: (count: number) => string
  selectionActions: string
  sort: string
  sortBy: string
  sorts: Record<Legal9Sort, string>
  statuses: Record<Legal9Status, string>
  unassigned: string
  viewCountName: (label: string, count: number) => string
  viewList: string
}

type Legal9LabelGroup =
  | 'billingModels'
  | 'columns'
  | 'groupings'
  | 'modes'
  | 'paginationButtons'
  | 'savedViews'
  | 'sorts'
  | 'statuses'

export type Legal9LabelsOverride = Partial<
  Omit<Legal9Labels, Legal9LabelGroup>
> & {
  [TGroup in Legal9LabelGroup]?: Partial<Legal9Labels[TGroup]>
}

export interface Legal9Props extends DataCollectionLoadProps {
  billingModelFilter?: Legal9BillingModel | null
  className?: string
  collapsedGroupIds?: string[]
  currency?: string
  filtered?: boolean
  groupBy?: Legal9GroupBy | null
  labels?: Legal9LabelsOverride
  locale?: string
  mode?: Legal9Mode
  onBillingModelChange?: (
    recordId: string,
    billingModel: Legal9BillingModel | null,
  ) => void
  onBillingModelFilterChange?: (billingModel: Legal9BillingModel | null) => void
  onBulkBillingModelChange?: (
    recordIds: string[],
    billingModel: Legal9BillingModel,
  ) => void
  onBulkOwnerChange?: (recordIds: string[], ownerId: string) => void
  onCollapsedGroupIdsChange?: (groupIds: string[]) => void
  onCreate?: () => void
  onDefaultViewSelect?: () => void
  onGroupByChange?: (groupBy: Legal9GroupBy | null) => void
  onModeChange?: (mode: Legal9Mode) => void
  onOpen?: (recordId: string) => void
  onOwnerChange?: (recordId: string, ownerId: string) => void
  onOwnerFilterChange?: (ownerId: string | null) => void
  onPageChange?: (page: number) => void
  onSavedViewCreate?: () => void
  onSavedViewDelete?: (savedViewId: string) => void
  onSavedViewDuplicate?: (savedViewId: string) => void
  onSavedViewRename?: (savedViewId: string) => void
  onSavedViewSelect?: (savedViewId: string) => void
  onSavedViewUpdate?: () => void
  onSavePreference?: () => void
  onSearchChange?: (search: string) => void
  onSelectedIdsChange?: (recordIds: string[]) => void
  onSortChange?: (sort: Legal9Sort) => void
  onStatusFilterChange?: (status: Legal9Status | null) => void
  ownerFilter?: string | null
  owners?: Legal9Person[]
  ownersLoading?: boolean
  page?: number
  pageCount?: number
  pageSize?: number
  records: Legal9Record[]
  savedViewId?: string | null
  savedViewModified?: boolean
  savedViews?: Legal9SavedView[]
  savedViewsLoading?: boolean
  savedViewsPending?: boolean
  search?: string
  selectedIds?: string[]
  sort?: Legal9Sort
  statusFilter?: Legal9Status | null
  total?: number
  viewCount?: number
}
