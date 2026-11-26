import type {
  DataCollectionFormatProps,
  DataCollectionLoadLabels,
  DataCollectionLoadProps,
  DataCollectionPerson,
  DataCollectionSavedView,
  DataCollectionSavedViewLabels,
} from '../../shared/collection/types'

export type Documents2Mode = 'gallery' | 'list' | 'table'

export type Documents2Kind = 'file' | 'link' | 'note'

export type Documents2Type =
  | 'audio'
  | 'document'
  | 'image'
  | 'link'
  | 'note'
  | 'video'

export type Documents2Sort = 'name' | 'owner' | 'type' | 'updated'

export type Documents2GroupBy = 'owner' | 'type'

export type Documents2FilterId = 'owner' | 'type'

export type Documents2Person = DataCollectionPerson

export type Documents2SavedView = DataCollectionSavedView

export type Documents2TypeColors = Partial<Record<Documents2Type, string>>

export interface Documents2Record {
  canDelete?: boolean
  id: string
  kind: Documents2Kind
  name: string
  ownerId: string | null
  pinned: boolean
  previewUrl?: string | null
  size?: string | null
  type: Documents2Type
  updatedAt: string
}

export type Documents2ColumnId =
  | 'actions'
  | 'name'
  | 'owner'
  | 'size'
  | 'type'
  | 'updated'

export interface Documents2Labels extends DataCollectionLoadLabels {
  actionsFor: (name: string) => string
  activeFilters: (count: number) => string
  clearFilters: string
  clearSelection: string
  columns: Record<Documents2ColumnId, string>
  create: string
  createLink: string
  createNote: string
  delete: string
  download: string
  empty: string
  filter: string
  filterBy: Record<Documents2FilterId, string>
  filterProperties: string
  group: string
  groupBy: string
  groupings: Record<Documents2GroupBy | 'none', string>
  groupToggle: (group: string, collapsed: boolean) => string
  layout: string
  layoutBy: string
  modes: Record<Documents2Mode, string>
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
  sorts: Record<Documents2Sort, string>
  title: string
  toolbar: string
  types: Record<Documents2Type, string>
  unpin: string
  unpinRecord: (name: string) => string
  upload: string
  viewList: string
}

type Documents2LabelGroup =
  | 'columns'
  | 'filterBy'
  | 'groupings'
  | 'modes'
  | 'savedViews'
  | 'sorts'
  | 'types'

export type Documents2LabelsOverride = Partial<
  Omit<Documents2Labels, Documents2LabelGroup>
> & {
  [TGroup in Documents2LabelGroup]?: Partial<Documents2Labels[TGroup]>
}

export interface Documents2Props
  extends DataCollectionLoadProps,
    DataCollectionFormatProps {
  className?: string
  collapsedGroupIds?: string[]
  filtered?: boolean
  groupBy?: Documents2GroupBy | null
  labels?: Documents2LabelsOverride
  mode?: Documents2Mode
  onBulkDelete?: (recordIds: string[]) => void
  onBulkDownload?: (recordIds: string[]) => void
  onBulkPinnedChange?: (recordIds: string[], pinned: boolean) => void
  onCollapsedGroupIdsChange?: (groupIds: string[]) => void
  onCreateLink?: () => void
  onCreateNote?: () => void
  onDelete?: (recordId: string) => void
  onDownload?: (recordId: string) => void
  onGroupByChange?: (groupBy: Documents2GroupBy | null) => void
  onModeChange?: (mode: Documents2Mode) => void
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
  onSortChange?: (sort: Documents2Sort) => void
  onTypeFilterChange?: (type: Documents2Type | null) => void
  onUpload?: (files: File[]) => void
  ownerFilter?: string | null
  people?: Documents2Person[]
  pinnedRecords?: Documents2Record[]
  records: Documents2Record[]
  savedViewId?: string | null
  savedViewModified?: boolean
  savedViews?: Documents2SavedView[]
  savedViewsLoading?: boolean
  savedViewsPending?: boolean
  selectedIds?: string[]
  sort?: Documents2Sort
  typeColors?: Documents2TypeColors
  typeFilter?: Documents2Type | null
  uploadAccept?: string
}
