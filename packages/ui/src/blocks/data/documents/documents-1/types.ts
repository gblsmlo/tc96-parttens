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

export type Documents1Mode = 'list' | 'table'

export type Documents1Kind = 'file' | 'link' | 'note' | 'page'

export type Documents1Type =
  | 'audio'
  | 'document'
  | 'image'
  | 'link'
  | 'note'
  | 'video'

export type Documents1View = 'all' | 'documents' | 'links' | 'media' | 'notes'

export type Documents1Access = 'private' | 'public' | 'shared'

export type Documents1Sort = 'name' | 'oldest'

export type Documents1GroupBy = 'pinned' | 'type'

export type Documents1PinnedGroup = 'pinned' | 'recent'

export type Documents1Person = DataCollectionPerson

export type Documents1SavedView = DataCollectionSavedView

export type Documents1TypeColors = Partial<Record<Documents1Type, string>>

export type Documents1Upload =
  | { progress: number; status: 'uploading' }
  | { error: string; status: 'failed' }

interface Documents1RecordBase {
  access: Documents1Access
  canDelete?: boolean
  canEdit?: boolean
  createdAt: string
  createdById: string | null
  id: string
  linkedTo: string | null
  name: string
  pinned: boolean
}

export interface Documents1FileRecord extends Documents1RecordBase {
  contentType: string
  kind: 'file'
  size: string | null
  upload?: Documents1Upload | null
}

export interface Documents1LinkRecord extends Documents1RecordBase {
  kind: 'link'
  site?: string | null
  url: string
}

export interface Documents1WrittenRecord extends Documents1RecordBase {
  excerpt?: string | null
  kind: 'note' | 'page'
}

export type Documents1Record =
  | Documents1FileRecord
  | Documents1LinkRecord
  | Documents1WrittenRecord

export type Documents1ColumnId =
  | 'access'
  | 'actions'
  | 'createdAt'
  | 'createdBy'
  | 'linkedTo'
  | 'name'
  | 'size'
  | 'type'

export interface Documents1Labels
  extends DataCollectionLoadLabels,
    DataCollectionSettingsToolbarLabels {
  access: Record<Documents1Access, string>
  actionsFor: (name: string) => string
  allTypes: string
  columns: Record<Documents1ColumnId, string>
  create: string
  createLink: string
  createNote: string
  createPage: string
  defaultSort: string
  delete: string
  download: string
  empty: Record<Documents1View, string>
  emptyGroup: string
  filters: string
  group: string
  groupBy: string
  groupings: Record<Documents1GroupBy, string>
  groupToggle: (group: string, collapsed: boolean) => string
  modes: DataCollectionModeLabels
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
  pinnedGroups: Record<Documents1PinnedGroup, string>
  rename: string
  savedViews: DataCollectionSavedViewLabels
  savePreference: string
  search: string
  share: string
  sort: string
  sortBy: string
  sorts: Record<Documents1Sort, string>
  types: Record<Documents1Type, string>
  unpin: string
  upload: string
  uploadFailed: string
  uploading: (progress: number) => string
  uploadProgress: (name: string) => string
  viewCountName: (label: string, count: number) => string
  viewList: string
  views: Record<Documents1View, string>
}

type Documents1LabelGroup =
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

export type Documents1LabelsOverride = Partial<
  Omit<Documents1Labels, Documents1LabelGroup>
> & {
  [TGroup in Documents1LabelGroup]?: Partial<Documents1Labels[TGroup]>
}

export interface Documents1Props extends DataCollectionLoadProps {
  className?: string
  collapsedGroupIds?: string[]
  counts?: Partial<Record<Documents1View, number>>
  filtered?: boolean
  groupBy?: Documents1GroupBy | null
  labels?: Documents1LabelsOverride
  locale?: string
  mode?: Documents1Mode
  onCollapsedGroupIdsChange?: (groupIds: string[]) => void
  onCreateLink?: () => void
  onCreateNote?: () => void
  onCreatePage?: () => void
  onDelete?: (recordId: string) => void
  onDownload?: (recordId: string) => void
  onGroupByChange?: (groupBy: Documents1GroupBy | null) => void
  onModeChange?: (mode: Documents1Mode) => void
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
  onSortChange?: (sort: Documents1Sort | null) => void
  onTypeFilterChange?: (types: Documents1Type[]) => void
  onUpload?: (files: File[]) => void
  onViewChange?: (view: Documents1View) => void
  page?: number
  pageCount?: number
  pageSize?: number
  people?: Documents1Person[]
  records: Documents1Record[]
  savedViewId?: string | null
  savedViewModified?: boolean
  savedViews?: Documents1SavedView[]
  savedViewsLoading?: boolean
  savedViewsPending?: boolean
  search?: string
  sort?: Documents1Sort | null
  timeZone?: string
  total?: number
  typeColors?: Documents1TypeColors
  typeFilter?: Documents1Type[]
  uploadAccept?: string
  view?: Documents1View
}
