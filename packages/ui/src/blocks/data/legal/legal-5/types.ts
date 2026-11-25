import type { CollectionPaginationButtonLabels } from '@tc96/ui/patterns/collection-pagination/components/collection-pagination'
import type { TagsPropertyLabels } from '@tc96/ui/patterns/properties/core'
import type {
  DataCollectionLoadLabels,
  DataCollectionLoadProps,
  DataCollectionModeLabels,
  DataCollectionPerson,
  DataCollectionSavedView,
  DataCollectionSavedViewLabels,
  DataCollectionSettingsToolbarLabels,
} from '../../shared/collection/types'

export type Legal5Mode = 'list' | 'table'

export type Legal5Kind = 'lawsuit' | 'matter'

export type Legal5View = 'all' | 'lawsuit' | 'matter'

export type Legal5Sort = 'owner' | 'phase' | 'title'

export type Legal5Pole = 'defendant' | 'plaintiff' | 'third_party'

export type Legal5Situation = 'active' | 'all' | 'closed'

export type Legal5Archived = 'exclude' | 'include' | 'only'

export type Legal5DeadlineTone = 'danger' | 'neutral' | 'warning'

export type Legal5GroupBy = 'owner' | 'phase'

export type Legal5SavedView = DataCollectionSavedView

export type Legal5Person = DataCollectionPerson

export interface Legal5Option {
  id: string
  label: string
}

export interface Legal5Phase extends Legal5Option {
  group?: string
  kind?: Legal5Kind
}

export interface Legal5NextDeadline {
  label: string
  tone: Legal5DeadlineTone
}

export interface Legal5Record {
  archived: boolean
  clients: string[]
  id: string
  kind: Legal5Kind
  nextDeadline: Legal5NextDeadline | null
  number: string | null
  ownerId: string | null
  phaseId: string
  tagIds: string[]
  title: string
}

export type Legal5ColumnId =
  | 'clients'
  | 'deadline'
  | 'number'
  | 'owner'
  | 'phase'
  | 'tags'
  | 'title'

export interface Legal5Labels
  extends DataCollectionLoadLabels,
    DataCollectionSettingsToolbarLabels {
  allClients: string
  allOwners: string
  allPhases: string
  allPoles: string
  archive: string
  archived: string
  archivedFilter: string
  archivedOptions: Record<Legal5Archived, string>
  caseTag: string
  clearSelection: string
  client: string
  columns: Record<Legal5ColumnId, string>
  copyNumber: string
  create: string
  defaultSort: string
  empty: Record<Legal5View, string>
  emptyGroup: string
  filters: string
  group: string
  groupBy: string
  groupings: Record<Legal5GroupBy, string>
  groupToggle: (group: string, collapsed: boolean) => string
  modes: DataCollectionModeLabels
  noGrouping: string
  noNumber: string
  noResult: Record<Legal5View, string>
  noTags: string
  openRecord: (title: string) => string
  pageRange: (first: number, last: number, total: number) => string
  pagination: string
  paginationButtons: CollectionPaginationButtonLabels
  pole: string
  poles: Record<Legal5Pole, string>
  savedViews: DataCollectionSavedViewLabels
  savePreference: string
  search: string
  selectAll: string
  selectRecord: (title: string) => string
  selectedCount: (count: number) => string
  selectionActions: string
  situation: string
  situations: Record<Legal5Situation, string>
  sort: string
  sortBy: string
  sorts: Record<Legal5Sort, string>
  unarchive: string
  unarchiveRecord: (title: string) => string
  unassigned: string
  viewCountName: (label: string, count: number) => string
  viewList: string
  views: Record<Legal5View, string>
  tagPicker: TagsPropertyLabels
}

type Legal5LabelGroup =
  | 'archivedOptions'
  | 'columns'
  | 'empty'
  | 'groupings'
  | 'modes'
  | 'noResult'
  | 'paginationButtons'
  | 'poles'
  | 'savedViews'
  | 'situations'
  | 'sorts'
  | 'tagPicker'
  | 'views'

export type Legal5LabelsOverride = Partial<
  Omit<Legal5Labels, Legal5LabelGroup>
> & {
  [TGroup in Legal5LabelGroup]?: Partial<Legal5Labels[TGroup]>
}

export interface Legal5Props extends DataCollectionLoadProps {
  archivedFilter?: Legal5Archived | null
  className?: string
  clientFilter?: string | null
  clients?: Legal5Option[]
  clientsLoading?: boolean
  collapsedGroupIds?: string[]
  counts?: Partial<Record<Legal5View, number>>
  filtered?: boolean
  groupBy?: Legal5GroupBy | null
  labels?: Legal5LabelsOverride
  mode?: Legal5Mode
  onArchivedFilterChange?: (archived: Legal5Archived | null) => void
  onBulkArchive?: (recordIds: string[]) => void
  onBulkOwnerChange?: (recordIds: string[], ownerId: string) => void
  onBulkPhaseChange?: (recordIds: string[], phaseId: string) => void
  onBulkTagAdd?: (recordIds: string[], tagId: string) => void
  onClientFilterChange?: (clientId: string | null) => void
  onCollapsedGroupIdsChange?: (groupIds: string[]) => void
  onCreate?: () => void
  onGroupByChange?: (groupBy: Legal5GroupBy | null) => void
  onModeChange?: (mode: Legal5Mode) => void
  onOpen?: (recordId: string) => void
  onOwnerChange?: (recordId: string, ownerId: string) => void
  onOwnerFilterChange?: (ownerId: string | null) => void
  onPageChange?: (page: number) => void
  onPhaseChange?: (recordId: string, phaseId: string) => void
  onPhaseFilterChange?: (phaseIds: string[]) => void
  onPoleFilterChange?: (pole: Legal5Pole | null) => void
  onSavedViewCreate?: () => void
  onSavedViewDelete?: (savedViewId: string) => void
  onSavedViewDuplicate?: (savedViewId: string) => void
  onSavedViewRename?: (savedViewId: string) => void
  onSavedViewSelect?: (savedViewId: string) => void
  onSavedViewUpdate?: () => void
  onSavePreference?: () => void
  onSearchChange?: (search: string) => void
  onSelectedIdsChange?: (recordIds: string[]) => void
  onSituationFilterChange?: (situation: Legal5Situation | null) => void
  onSortChange?: (sort: Legal5Sort | null) => void
  onTagFilterChange?: (tagIds: string[]) => void
  onTagsChange?: (recordId: string, tagIds: string[]) => void
  onUnarchive?: (recordId: string) => void
  onViewChange?: (view: Legal5View) => void
  ownerFilter?: string | null
  owners?: Legal5Person[]
  ownersLoading?: boolean
  page?: number
  pageCount?: number
  pageSize?: number
  phaseFilter?: string[]
  phases?: Legal5Phase[]
  phasesLoading?: boolean
  poleFilter?: Legal5Pole | null
  records: Legal5Record[]
  savedViewId?: string | null
  savedViewModified?: boolean
  savedViews?: Legal5SavedView[]
  savedViewsLoading?: boolean
  savedViewsPending?: boolean
  search?: string
  selectedIds?: string[]
  situationFilter?: Legal5Situation | null
  sort?: Legal5Sort | null
  tagFilter?: string[]
  tags?: Legal5Option[]
  tagsLoading?: boolean
  total?: number
  view?: Legal5View
}
