import type {
  DataCollectionFormatProps,
  DataCollectionLoadLabels,
  DataCollectionLoadProps,
  DataCollectionModeLabels,
  DataCollectionSavedView,
  DataCollectionSavedViewLabels,
  DataCollectionSettingsToolbarLabels,
} from '../../shared/collection/types'

export type Legal7Mode = 'list' | 'table'

export type Legal7Sort = 'newest' | 'oldest'

export type Legal7LawsuitFilter = 'linked' | 'unlinked'

export type Legal7SavedView = DataCollectionSavedView

export interface Legal7Publication {
  availableOn: string
  excerpt: string
  id: string
  kind: string
  lawsuitTitle: string | null
  lawyers: string[]
  number: string | null
  tribunal: string
  wait: string
}

export type Legal7ColumnId =
  | 'availableOn'
  | 'excerpt'
  | 'kind'
  | 'lawsuit'
  | 'lawyers'
  | 'number'
  | 'tribunal'

export type Legal7ActionId =
  | 'createDeadline'
  | 'createLawsuit'
  | 'createTask'
  | 'discard'
  | 'linkDeadline'
  | 'linkLawsuit'
  | 'noDeadline'

export interface Legal7Labels
  extends DataCollectionLoadLabels,
    DataCollectionSettingsToolbarLabels {
  actions: Record<Legal7ActionId, string>
  allLawsuits: string
  allPublications: string
  allTribunals: string
  bulkHint: string
  clearSelection: string
  columns: Record<Legal7ColumnId, string>
  empty: string
  filters: string
  kindAndTribunal: (kind: string, tribunal: string) => string
  lawsuit: string
  lawsuitFilters: Record<Legal7LawsuitFilter, string>
  lawyers: (lawyers: readonly string[]) => string
  modes: DataCollectionModeLabels
  noLawsuit: string
  noNumber: string
  noResult: string
  openPublication: (date: string, tribunal: string) => string
  pagination: string
  savedViews: DataCollectionSavedViewLabels
  savePreference: string
  selectAll: string
  selectedCount: (count: number) => string
  selectionActions: string
  selectPublication: (date: string, tribunal: string) => string
  sort: string
  sortBy: string
  sorts: Record<Legal7Sort, string>
  tribunal: string
  viewList: string
}

export type Legal7LabelsOverride = Partial<
  Omit<
    Legal7Labels,
    'actions' | 'columns' | 'lawsuitFilters' | 'modes' | 'savedViews' | 'sorts'
  >
> & {
  actions?: Partial<Legal7Labels['actions']>
  columns?: Partial<Legal7Labels['columns']>
  lawsuitFilters?: Partial<Legal7Labels['lawsuitFilters']>
  modes?: Partial<Legal7Labels['modes']>
  savedViews?: Partial<Legal7Labels['savedViews']>
  sorts?: Partial<Legal7Labels['sorts']>
}

export interface Legal7Props
  extends DataCollectionFormatProps,
    DataCollectionLoadProps {
  className?: string
  filtered?: boolean
  labels?: Legal7LabelsOverride
  lawsuitFilter?: Legal7LawsuitFilter | null
  mode?: Legal7Mode
  onCreateDeadline?: (publicationId: string) => void
  onCreateLawsuit?: (publicationId: string) => void
  onCreateTask?: (publicationId: string) => void
  onDiscard?: (publicationIds: string[]) => void
  onLawsuitFilterChange?: (filter: Legal7LawsuitFilter | null) => void
  onLinkDeadline?: (publicationId: string) => void
  onLinkLawsuit?: (publicationIds: string[]) => void
  onModeChange?: (mode: Legal7Mode) => void
  onNoDeadline?: (publicationId: string) => void
  onOpen?: (publicationId: string) => void
  onPageChange?: (page: number) => void
  onSavedViewCreate?: () => void
  onSavedViewDelete?: (savedViewId: string) => void
  onSavedViewDuplicate?: (savedViewId: string) => void
  onSavedViewRename?: (savedViewId: string) => void
  onSavedViewSelect?: (savedViewId: string | null) => void
  onSavedViewUpdate?: () => void
  onSavePreference?: () => void
  onSelectedIdsChange?: (publicationIds: string[]) => void
  onSortChange?: (sort: Legal7Sort) => void
  onTribunalFilterChange?: (tribunal: string | null) => void
  page?: number
  pageCount?: number
  pageSize?: number
  publications: Legal7Publication[]
  savedViewId?: string | null
  savedViewModified?: boolean
  savedViews?: Legal7SavedView[]
  savedViewsLoading?: boolean
  savedViewsPending?: boolean
  selectedIds?: string[]
  sort?: Legal7Sort
  total?: number
  tribunalFilter?: string | null
  tribunals?: string[]
  tribunalsLoading?: boolean
}
