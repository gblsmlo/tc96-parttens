import type { CollectionPaginationButtonLabels } from '@tc96/ui/patterns/collection-pagination/components/collection-pagination'
import type { PropertyOption } from '@tc96/ui/patterns/properties/core'
import type {
  DataCollectionFormatProps,
  DataCollectionLoadLabels,
  DataCollectionLoadProps,
  DataCollectionModeLabels,
  DataCollectionPerson,
  DataCollectionSavedView,
  DataCollectionSavedViewLabels,
  DataCollectionSettingsToolbarLabels,
} from '../../shared/collection/types'

export type Crm2Mode = 'kanban' | 'table'

export type Crm2View = 'all'

export type Crm2GroupBy = 'origin' | 'owner' | 'stage'

export type Crm2Sort = 'created' | 'next-action' | 'updated' | 'value'

export type Crm2Origin =
  | 'event'
  | 'existing-client'
  | 'other'
  | 'paid-ads'
  | 'referral'
  | 'social-media'
  | 'website'

export type Crm2Archived = 'exclude' | 'include' | 'only'

export type Crm2Status = 'lost' | 'open' | 'won'

export type Crm2StageTone = NonNullable<PropertyOption['tone']>

export type Crm2SavedView = DataCollectionSavedView

export type Crm2Person = DataCollectionPerson

export interface Crm2Option {
  id: string
  label: string
}

export interface Crm2Stage extends Crm2Option {
  inactive?: boolean
  tone?: Crm2StageTone
}

export interface Crm2Lead {
  archived: boolean
  contact: string | null
  editable?: boolean
  id: string
  nextAction: string | null
  nextActionAt: string | null
  nextActionOverdue?: boolean
  origin: Crm2Origin
  ownerId: string | null
  stageId: string
  status: Crm2Status
  tagIds: string[]
  title: string
  valueCents: number | null
}

export type Crm2ColumnId =
  | 'contact'
  | 'nextAction'
  | 'nextActionAt'
  | 'origin'
  | 'owner'
  | 'stage'
  | 'tags'
  | 'title'
  | 'value'

export interface Crm2Labels
  extends DataCollectionLoadLabels,
    DataCollectionSettingsToolbarLabels {
  allOrigins: string
  allOwners: string
  allStages: string
  archive: string
  archivedFilter: string
  archivedOptions: Record<Crm2Archived, string>
  boardHasMore: string
  clearSelection: string
  columns: Record<Crm2ColumnId, string>
  create: string
  createInStage: (stage: string) => string
  empty: string
  emptyColumn: string
  filters: string
  groupBy: string
  grouping: string
  groupings: Record<Crm2GroupBy, string>
  modes: DataCollectionModeLabels
  moveToStage: string
  noContact: string
  noDeadline: string
  noNextAction: string
  noResult: string
  noValue: string
  openRecord: (title: string) => string
  origins: Record<Crm2Origin, string>
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
  sorts: Record<Crm2Sort, string>
  unassigned: string
  viewCountName: (label: string, count: number) => string
  viewList: string
  views: Record<Crm2View, string>
}

type Crm2LabelGroup =
  | 'archivedOptions'
  | 'columns'
  | 'groupings'
  | 'modes'
  | 'origins'
  | 'paginationButtons'
  | 'savedViews'
  | 'sorts'
  | 'views'

export type Crm2LabelsOverride = Partial<Omit<Crm2Labels, Crm2LabelGroup>> & {
  [TGroup in Crm2LabelGroup]?: Partial<Crm2Labels[TGroup]>
}

export interface Crm2Props
  extends DataCollectionLoadProps,
    DataCollectionFormatProps {
  archivedFilter?: Crm2Archived | null
  boardHasMore?: boolean
  className?: string
  counts?: Partial<Record<Crm2View, number>>
  currency?: string
  filtered?: boolean
  groupBy?: Crm2GroupBy
  labels?: Crm2LabelsOverride
  leads: Crm2Lead[]
  mode?: Crm2Mode
  onArchivedFilterChange?: (archived: Crm2Archived | null) => void
  onBulkArchive?: (leadIds: string[]) => void
  onBulkOwnerChange?: (leadIds: string[], ownerId: string) => void
  onBulkStageChange?: (leadIds: string[], stageId: string) => void
  onCreate?: () => void
  onCreateInStage?: (stageId: string) => void
  onGroupByChange?: (groupBy: Crm2GroupBy) => void
  onModeChange?: (mode: Crm2Mode) => void
  onOpen?: (leadId: string) => void
  onOriginChange?: (leadId: string, origin: Crm2Origin) => void
  onOriginFilterChange?: (origin: Crm2Origin | null) => void
  onOwnerChange?: (leadId: string, ownerId: string) => void
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
  onSelectedIdsChange?: (leadIds: string[]) => void
  onSortChange?: (sort: Crm2Sort) => void
  onStageChange?: (leadId: string, stageId: string) => void
  onStageFilterChange?: (stageId: string | null) => void
  onTagFilterChange?: (tagIds: string[]) => void
  onViewChange?: (view: Crm2View) => void
  originFilter?: Crm2Origin | null
  ownerFilter?: string | null
  owners?: Crm2Person[]
  ownersLoading?: boolean
  page?: number
  pageCount?: number
  pageSize?: number
  savedViewId?: string | null
  savedViewModified?: boolean
  savedViews?: Crm2SavedView[]
  savedViewsLoading?: boolean
  savedViewsPending?: boolean
  search?: string
  selectedIds?: string[]
  sort?: Crm2Sort
  stageFilter?: string | null
  stageValues?: Partial<Record<string, number>>
  stages?: Crm2Stage[]
  stagesLoading?: boolean
  tagFilter?: string[]
  tags?: Crm2Option[]
  tagsLoading?: boolean
  total?: number
  view?: Crm2View
}
