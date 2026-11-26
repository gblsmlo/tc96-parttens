import type { CollectionPaginationButtonLabels } from '@tc96/ui/patterns/collection-pagination/components/collection-pagination'
import type { PropertyOption } from '@tc96/ui/patterns/properties/core'
import type {
  DataCollectionFormatProps,
  DataCollectionLoadLabels,
  DataCollectionLoadProps,
  DataCollectionPerson,
  DataCollectionSavedView,
  DataCollectionSavedViewLabels,
} from '../../shared/collection/types'

export type Crm3Mode = 'kanban' | 'table'

export type Crm3View = 'all'

export type Crm3GroupBy = 'origin' | 'owner' | 'stage'

export type Crm3Sort = 'created' | 'next-action' | 'updated' | 'value'

export type Crm3Origin =
  | 'event'
  | 'existing-client'
  | 'other'
  | 'paid-ads'
  | 'referral'
  | 'social-media'
  | 'website'

export type Crm3Archived = 'exclude' | 'include' | 'only'

export type Crm3Status = 'lost' | 'open' | 'won'

export type Crm3FilterId = 'archived' | 'origin' | 'owner' | 'stage' | 'tags'

export type Crm3StageTone = NonNullable<PropertyOption['tone']>

export type Crm3SavedView = DataCollectionSavedView

export type Crm3Person = DataCollectionPerson

export interface Crm3Option {
  id: string
  label: string
}

export interface Crm3Stage extends Crm3Option {
  inactive?: boolean
  tone?: Crm3StageTone
}

export interface Crm3Lead {
  archived: boolean
  contact: string | null
  editable?: boolean
  id: string
  nextAction: string | null
  nextActionAt: string | null
  nextActionOverdue?: boolean
  origin: Crm3Origin
  ownerId: string | null
  stageId: string
  status: Crm3Status
  tagIds: string[]
  title: string
  valueCents: number | null
}

export type Crm3ColumnId =
  | 'contact'
  | 'nextAction'
  | 'nextActionAt'
  | 'origin'
  | 'owner'
  | 'stage'
  | 'tags'
  | 'title'
  | 'value'

export interface Crm3Labels extends DataCollectionLoadLabels {
  activeFilters: (count: number) => string
  allTags: string
  archive: string
  archivedOptions: Record<Crm3Archived, string>
  boardHasMore: string
  clearFilters: string
  clearSelection: string
  columns: Record<Crm3ColumnId, string>
  create: string
  createInStage: (stage: string) => string
  empty: string
  emptyColumn: string
  filter: string
  filterBy: Record<Crm3FilterId, string>
  filterProperties: string
  group: string
  groupBy: string
  groupings: Record<Crm3GroupBy, string>
  layout: string
  layoutBy: string
  modes: Record<Crm3Mode, string>
  moveToStage: string
  noContact: string
  noDeadline: string
  noNextAction: string
  noResult: string
  noValue: string
  openRecord: (title: string) => string
  origins: Record<Crm3Origin, string>
  pageRange: (first: number, last: number, total: number) => string
  pagination: string
  paginationButtons: CollectionPaginationButtonLabels
  savedViews: DataCollectionSavedViewLabels
  selectAll: string
  selectRecord: (title: string) => string
  selectedCount: (count: number) => string
  selectionActions: string
  sort: string
  sortBy: string
  sorts: Record<Crm3Sort, string>
  title: string
  toolbar: string
  unassigned: string
  viewCountName: (label: string, count: number) => string
  viewList: string
  views: Record<Crm3View, string>
}

type Crm3LabelGroup =
  | 'archivedOptions'
  | 'columns'
  | 'filterBy'
  | 'groupings'
  | 'modes'
  | 'origins'
  | 'paginationButtons'
  | 'savedViews'
  | 'sorts'
  | 'views'

export type Crm3LabelsOverride = Partial<Omit<Crm3Labels, Crm3LabelGroup>> & {
  [TGroup in Crm3LabelGroup]?: Partial<Crm3Labels[TGroup]>
}

export interface Crm3Props
  extends DataCollectionLoadProps,
    DataCollectionFormatProps {
  archivedFilter?: Crm3Archived | null
  boardHasMore?: boolean
  className?: string
  counts?: Partial<Record<Crm3View, number>>
  currency?: string
  filtered?: boolean
  groupBy?: Crm3GroupBy
  labels?: Crm3LabelsOverride
  leads: Crm3Lead[]
  mode?: Crm3Mode
  onArchivedFilterChange?: (archived: Crm3Archived | null) => void
  onBulkArchive?: (leadIds: string[]) => void
  onBulkOwnerChange?: (leadIds: string[], ownerId: string) => void
  onBulkStageChange?: (leadIds: string[], stageId: string) => void
  onCreate?: () => void
  onCreateInStage?: (stageId: string) => void
  onGroupByChange?: (groupBy: Crm3GroupBy) => void
  onModeChange?: (mode: Crm3Mode) => void
  onOpen?: (leadId: string) => void
  onOriginChange?: (leadId: string, origin: Crm3Origin) => void
  onOriginFilterChange?: (origin: Crm3Origin | null) => void
  onOwnerChange?: (leadId: string, ownerId: string) => void
  onOwnerFilterChange?: (ownerId: string | null) => void
  onPageChange?: (page: number) => void
  onSavedViewCreate?: () => void
  onSavedViewDelete?: (savedViewId: string) => void
  onSavedViewDuplicate?: (savedViewId: string) => void
  onSavedViewRename?: (savedViewId: string) => void
  onSavedViewSelect?: (savedViewId: string | null) => void
  onSavedViewUpdate?: () => void
  onSelectedIdsChange?: (leadIds: string[]) => void
  onSortChange?: (sort: Crm3Sort) => void
  onStageChange?: (leadId: string, stageId: string) => void
  onStageFilterChange?: (stageId: string | null) => void
  onTagFilterChange?: (tagIds: string[]) => void
  originFilter?: Crm3Origin | null
  ownerFilter?: string | null
  owners?: Crm3Person[]
  page?: number
  pageCount?: number
  pageSize?: number
  savedViewId?: string | null
  savedViewModified?: boolean
  savedViews?: Crm3SavedView[]
  savedViewsLoading?: boolean
  savedViewsPending?: boolean
  selectedIds?: string[]
  sort?: Crm3Sort
  stageFilter?: string | null
  stageValues?: Partial<Record<string, number>>
  stages?: Crm3Stage[]
  tagFilter?: string[]
  tags?: Crm3Option[]
  total?: number
}
