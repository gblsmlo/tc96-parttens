import type {
  DataCollectionFormatProps,
  DataCollectionLoadLabels,
  DataCollectionLoadProps,
  DataCollectionPerson,
  DataCollectionSavedView,
  DataCollectionSavedViewLabels,
} from '../../shared/collection/types'

export type Documents4Mode = 'gallery' | 'list' | 'table'

export type Documents4Kind = 'file' | 'link' | 'note'

export type Documents4Type =
  | 'audio'
  | 'document'
  | 'image'
  | 'link'
  | 'note'
  | 'video'

export type Documents4Sort = 'name' | 'owner' | 'type' | 'updated'

export type Documents4GroupBy = 'owner' | 'type'

export type Documents4FilterId = 'owner' | 'type'

export type Documents4Person = DataCollectionPerson

export type Documents4SavedView = DataCollectionSavedView

export type Documents4TypeColors = Partial<Record<Documents4Type, string>>

export interface Documents4Record {
  canDelete?: boolean
  id: string
  kind: Documents4Kind
  name: string
  ownerId: string | null
  pinned: boolean
  previewUrl?: string | null
  size?: string | null
  type: Documents4Type
  updatedAt: string
}

export type Documents4ColumnId =
  | 'actions'
  | 'name'
  | 'owner'
  | 'size'
  | 'type'
  | 'updated'

export interface Documents4Labels extends DataCollectionLoadLabels {
  actionsFor: (name: string) => string
  activeFilters: (count: number) => string
  clearFilters: string
  clearSelection: string
  columns: Record<Documents4ColumnId, string>
  create: string
  createLink: string
  createNote: string
  delete: string
  download: string
  empty: string
  filter: string
  filterBy: Record<Documents4FilterId, string>
  filterProperties: string
  group: string
  groupBy: string
  groupings: Record<Documents4GroupBy | 'none', string>
  groupToggle: (group: string, collapsed: boolean) => string
  layout: string
  layoutBy: string
  modes: Record<Documents4Mode, string>
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
  sort: string
  sortBy: string
  sorts: Record<Documents4Sort, string>
  title: string
  toolbar: string
  types: Record<Documents4Type, string>
  unpin: string
  unpinRecord: (name: string) => string
  upload: string
  viewList: string
}

type Documents4LabelGroup =
  | 'columns'
  | 'filterBy'
  | 'groupings'
  | 'modes'
  | 'savedViews'
  | 'sorts'
  | 'types'

export type Documents4LabelsOverride = Partial<
  Omit<Documents4Labels, Documents4LabelGroup>
> & {
  [TGroup in Documents4LabelGroup]?: Partial<Documents4Labels[TGroup]>
}

export interface Documents4Props
  extends DataCollectionLoadProps,
    DataCollectionFormatProps {
  className?: string
  collapsedGroupIds?: string[]
  filtered?: boolean
  groupBy?: Documents4GroupBy | null
  labels?: Documents4LabelsOverride
  mode?: Documents4Mode
  onBulkDelete?: (recordIds: string[]) => void
  onBulkDownload?: (recordIds: string[]) => void
  onBulkPinnedChange?: (recordIds: string[], pinned: boolean) => void
  onCollapsedGroupIdsChange?: (groupIds: string[]) => void
  onCreateLink?: () => void
  onCreateNote?: () => void
  onDelete?: (recordId: string) => void
  onDownload?: (recordId: string) => void
  onGroupByChange?: (groupBy: Documents4GroupBy | null) => void
  onModeChange?: (mode: Documents4Mode) => void
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
  onSortChange?: (sort: Documents4Sort) => void
  onTypeFilterChange?: (type: Documents4Type | null) => void
  onUpload?: (files: File[]) => void
  ownerFilter?: string | null
  people?: Documents4Person[]
  records: Documents4Record[]
  savedViewId?: string | null
  savedViewModified?: boolean
  savedViews?: Documents4SavedView[]
  savedViewsLoading?: boolean
  savedViewsPending?: boolean
  selectedIds?: string[]
  sort?: Documents4Sort
  typeColors?: Documents4TypeColors
  typeFilter?: Documents4Type | null
  uploadAccept?: string
}
