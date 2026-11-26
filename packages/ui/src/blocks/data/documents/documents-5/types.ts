import type {
  DataCollectionFormatProps,
  DataCollectionLoadLabels,
  DataCollectionLoadProps,
  DataCollectionPerson,
  DataCollectionSavedView,
  DataCollectionSavedViewLabels,
} from '../../shared/collection/types'

export type Documents5Mode = 'gallery' | 'list' | 'table'

export type Documents5Kind = 'file' | 'link' | 'note'

export type Documents5Type =
  | 'audio'
  | 'document'
  | 'image'
  | 'link'
  | 'note'
  | 'video'

export type Documents5Sort = 'name' | 'owner' | 'type' | 'updated'

export type Documents5GroupBy = 'owner' | 'type'

export type Documents5FilterId = 'owner' | 'type'

export type Documents5Person = DataCollectionPerson

export type Documents5SavedView = DataCollectionSavedView

export type Documents5TypeColors = Partial<Record<Documents5Type, string>>

export interface Documents5Record {
  canDelete?: boolean
  id: string
  kind: Documents5Kind
  name: string
  ownerId: string | null
  pinned: boolean
  previewUrl?: string | null
  size?: string | null
  type: Documents5Type
  updatedAt: string
}

export type Documents5ColumnId =
  | 'actions'
  | 'name'
  | 'owner'
  | 'size'
  | 'type'
  | 'updated'

export interface Documents5Labels extends DataCollectionLoadLabels {
  actionsFor: (name: string) => string
  clearFilters: string
  clearSelection: string
  columns: Record<Documents5ColumnId, string>
  create: string
  createLink: string
  createNote: string
  delete: string
  download: string
  empty: string
  display: string
  filterBy: Record<Documents5FilterId, string>
  filterCount: (label: string, count: number) => string
  filters: string
  groupBy: string
  groupings: Record<Documents5GroupBy | 'none', string>
  groupToggle: (group: string, collapsed: boolean) => string
  modes: Record<Documents5Mode, string>
  noOwner: string
  noResult: string
  noSize: string
  open: string
  openRecord: (name: string) => string
  pin: string
  pinned: string
  pinnedMark: string
  savedViews: DataCollectionSavedViewLabels
  selectAll: string
  selectedCount: (count: number) => string
  selectionActions: string
  selectRecord: (name: string) => string
  sortBy: string
  sorts: Record<Documents5Sort, string>
  title: string
  toolbar: string
  types: Record<Documents5Type, string>
  unpin: string
  unpinRecord: (name: string) => string
  upload: string
  viewList: string
}

type Documents5LabelGroup =
  | 'columns'
  | 'filterBy'
  | 'groupings'
  | 'modes'
  | 'savedViews'
  | 'sorts'
  | 'types'

export type Documents5LabelsOverride = Partial<
  Omit<Documents5Labels, Documents5LabelGroup>
> & {
  [TGroup in Documents5LabelGroup]?: Partial<Documents5Labels[TGroup]>
}

export interface Documents5Props
  extends DataCollectionLoadProps,
    DataCollectionFormatProps {
  className?: string
  collapsedGroupIds?: string[]
  filtered?: boolean
  groupBy?: Documents5GroupBy | null
  labels?: Documents5LabelsOverride
  mode?: Documents5Mode
  onBulkDelete?: (recordIds: string[]) => void
  onBulkDownload?: (recordIds: string[]) => void
  onBulkPinnedChange?: (recordIds: string[], pinned: boolean) => void
  onCollapsedGroupIdsChange?: (groupIds: string[]) => void
  onCreateLink?: () => void
  onCreateNote?: () => void
  onDelete?: (recordId: string) => void
  onDownload?: (recordId: string) => void
  onGroupByChange?: (groupBy: Documents5GroupBy | null) => void
  onModeChange?: (mode: Documents5Mode) => void
  onOpen?: (recordId: string) => void
  onOwnerFilterChange?: (ownerId: string | null) => void
  onPinnedChange?: (recordId: string, pinned: boolean) => void
  onSavedViewCreate?: () => void
  onSavedViewDelete?: (savedViewId: string) => void
  onSavedViewDuplicate?: (savedViewId: string) => void
  onSavedViewRename?: (savedViewId: string) => void
  onSavedViewSelect?: (savedViewId: string | null) => void
  onSavedViewUpdate?: () => void
  onSelectedIdsChange?: (recordIds: string[]) => void
  onSortChange?: (sort: Documents5Sort) => void
  onTypeFilterChange?: (type: Documents5Type | null) => void
  onUpload?: (files: File[]) => void
  ownerFilter?: string | null
  people?: Documents5Person[]
  pinnedRecords?: Documents5Record[]
  records: Documents5Record[]
  savedViewId?: string | null
  savedViewModified?: boolean
  savedViews?: Documents5SavedView[]
  savedViewsLoading?: boolean
  savedViewsPending?: boolean
  selectedIds?: string[]
  sort?: Documents5Sort
  typeColors?: Documents5TypeColors
  typeFilter?: Documents5Type | null
  uploadAccept?: string
}
