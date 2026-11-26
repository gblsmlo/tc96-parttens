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

export type Documents3Mode = 'gallery' | 'list' | 'table'

export type Documents3Kind = 'file' | 'link' | 'note' | 'page'

export type Documents3Type =
  | 'audio'
  | 'document'
  | 'image'
  | 'link'
  | 'note'
  | 'video'

export type Documents3View = 'all' | 'documents' | 'links' | 'media' | 'notes'

export type Documents3Access = 'private' | 'public' | 'shared'

export type Documents3Sort = 'name' | 'oldest'

export type Documents3GroupBy = 'pinned' | 'type'

export type Documents3PinnedGroup = 'pinned' | 'recent'

export type Documents3Person = DataCollectionPerson

export type Documents3SavedView = DataCollectionSavedView

export type Documents3TypeColors = Partial<Record<Documents3Type, string>>

export type Documents3Upload =
  | { progress: number; status: 'uploading' }
  | { error: string; status: 'failed' }

interface Documents3RecordBase {
  access: Documents3Access
  canDelete?: boolean
  canEdit?: boolean
  createdAt: string
  createdById: string | null
  id: string
  linkedTo: string | null
  name: string
  pinned: boolean
}

export interface Documents3FileRecord extends Documents3RecordBase {
  contentType: string
  kind: 'file'
  size: string | null
  upload?: Documents3Upload | null
}

export interface Documents3LinkRecord extends Documents3RecordBase {
  kind: 'link'
  site?: string | null
  url: string
}

export interface Documents3WrittenRecord extends Documents3RecordBase {
  excerpt?: string | null
  kind: 'note' | 'page'
}

export type Documents3Record =
  | Documents3FileRecord
  | Documents3LinkRecord
  | Documents3WrittenRecord

export type Documents3ColumnId =
  | 'access'
  | 'actions'
  | 'createdAt'
  | 'createdBy'
  | 'linkedTo'
  | 'name'
  | 'size'
  | 'type'

export interface Documents3Labels
  extends DataCollectionLoadLabels,
    DataCollectionSettingsToolbarLabels {
  access: Record<Documents3Access, string>
  actionsFor: (name: string) => string
  allTypes: string
  columns: Record<Documents3ColumnId, string>
  create: string
  createLink: string
  createNote: string
  createPage: string
  defaultSort: string
  delete: string
  download: string
  empty: Record<Documents3View, string>
  emptyGroup: string
  filters: string
  group: string
  groupBy: string
  groupings: Record<Documents3GroupBy, string>
  groupToggle: (group: string, collapsed: boolean) => string
  modes: Record<Documents3Mode, string>
  noCreator: string
  noDate: string
  noGrouping: string
  noLink: string
  noResult: string
  noSize: string
  open: string
  openRecord: (name: string) => string
  pageRange: (first: number, last: number, total: number) => string
  pagination: string
  paginationButtons: CollectionPaginationButtonLabels
  pin: string
  pinned: string
  pinnedGroups: Record<Documents3PinnedGroup, string>
  rename: string
  savedViews: DataCollectionSavedViewLabels
  savePreference: string
  search: string
  share: string
  sort: string
  sortBy: string
  sorts: Record<Documents3Sort, string>
  types: Record<Documents3Type, string>
  unpin: string
  upload: string
  uploadFailed: string
  uploading: (progress: number) => string
  uploadProgress: (name: string) => string
  viewCountName: (label: string, count: number) => string
  viewList: string
  views: Record<Documents3View, string>
}

type Documents3LabelGroup =
  | 'access'
  | 'columns'
  | 'empty'
  | 'groupings'
  | 'modes'
  | 'paginationButtons'
  | 'pinnedGroups'
  | 'savedViews'
  | 'sorts'
  | 'types'
  | 'views'

export type Documents3LabelsOverride = Partial<
  Omit<Documents3Labels, Documents3LabelGroup>
> & {
  [TGroup in Documents3LabelGroup]?: Partial<Documents3Labels[TGroup]>
}

export interface Documents3Props extends DataCollectionLoadProps {
  className?: string
  collapsedGroupIds?: string[]
  counts?: Partial<Record<Documents3View, number>>
  filtered?: boolean
  groupBy?: Documents3GroupBy | null
  labels?: Documents3LabelsOverride
  locale?: string
  mode?: Documents3Mode
  onCollapsedGroupIdsChange?: (groupIds: string[]) => void
  onCreateLink?: () => void
  onCreateNote?: () => void
  onCreatePage?: () => void
  onDelete?: (recordId: string) => void
  onDownload?: (recordId: string) => void
  onGroupByChange?: (groupBy: Documents3GroupBy | null) => void
  onModeChange?: (mode: Documents3Mode) => void
  onOpen?: (recordId: string) => void
  onPageChange?: (page: number) => void
  onPinnedChange?: (recordId: string, pinned: boolean) => void
  onRename?: (recordId: string) => void
  onSavedViewCreate?: () => void
  onSavedViewDelete?: (savedViewId: string) => void
  onSavedViewDuplicate?: (savedViewId: string) => void
  onSavedViewRename?: (savedViewId: string) => void
  onSavedViewSelect?: (savedViewId: string) => void
  onSavedViewUpdate?: () => void
  onSavePreference?: () => void
  onSearchChange?: (search: string) => void
  onShare?: (recordId: string) => void
  onSortChange?: (sort: Documents3Sort | null) => void
  onTypeFilterChange?: (types: Documents3Type[]) => void
  onUpload?: (files: File[]) => void
  onViewChange?: (view: Documents3View) => void
  page?: number
  pageCount?: number
  pageSize?: number
  people?: Documents3Person[]
  records: Documents3Record[]
  savedViewId?: string | null
  savedViewModified?: boolean
  savedViews?: Documents3SavedView[]
  savedViewsLoading?: boolean
  savedViewsPending?: boolean
  search?: string
  sort?: Documents3Sort | null
  timeZone?: string
  total?: number
  typeColors?: Documents3TypeColors
  typeFilter?: Documents3Type[]
  uploadAccept?: string
  view?: Documents3View
}
