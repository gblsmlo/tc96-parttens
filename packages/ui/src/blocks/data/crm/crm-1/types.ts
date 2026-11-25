import type { CollectionPaginationButtonLabels } from '@tc96/ui/patterns/collection-pagination/components/collection-pagination'
import type {
  DataCollectionLoadLabels,
  DataCollectionLoadProps,
  DataCollectionModeLabels,
  DataCollectionSavedView,
  DataCollectionSavedViewLabels,
  DataCollectionSettingsToolbarLabels,
} from '../../shared/collection/types'

export type Crm1Variant = 'companies' | 'people'

export type Crm1Mode = 'list' | 'table'

export type Crm1Sort = 'created_desc' | 'name_asc' | 'name_desc'

export type Crm1Archived = 'exclude' | 'include' | 'only'

export type Crm1LeadStatus = 'lost' | 'open' | 'won'

export type Crm1SavedView = DataCollectionSavedView

export interface Crm1Option {
  id: string
  label: string
}

export interface Crm1Contact {
  archived: boolean
  document: string | null
  id: string
  name: string
  phone: string | null
  tagIds: string[]
}

export interface Crm1Person extends Crm1Contact {
  email: string | null
}

export interface Crm1Company extends Crm1Contact {
  sectorId: string | null
}

export type Crm1Record = Crm1Company | Crm1Person

export type Crm1PeopleColumnId =
  | 'document'
  | 'email'
  | 'name'
  | 'phone'
  | 'tags'

export type Crm1CompaniesColumnId =
  | 'document'
  | 'name'
  | 'phone'
  | 'sector'
  | 'tags'

interface Crm1VariantLabelsBase {
  create: string
  empty: string
  errorTitle: string
  loading: string
  noDocument: string
  noResult: string
  pagination: string
  search: string
  selectAll: string
  selectionActions: string
  title: string
  toolbar: string
}

export interface Crm1PeopleLabels extends Crm1VariantLabelsBase {
  columns: Record<Crm1PeopleColumnId, string>
}

export interface Crm1CompaniesLabels extends Crm1VariantLabelsBase {
  columns: Record<Crm1CompaniesColumnId, string>
}

export interface Crm1Labels
  extends Omit<DataCollectionLoadLabels, 'errorTitle' | 'loading'>,
    Pick<
      DataCollectionSettingsToolbarLabels,
      'clearFilters' | 'display' | 'filterCount'
    > {
  archive: string
  archived: string
  archivedFilter: string
  archivedOptions: Record<Crm1Archived, string>
  clearSelection: string
  companies: Crm1CompaniesLabels
  copyEmail: string
  filters: string
  leadFilter: string
  leadStatuses: Record<Crm1LeadStatus, string>
  allLeads: string
  modes: DataCollectionModeLabels
  noEmail: string
  noPhone: string
  noSector: string
  openRecord: (name: string) => string
  pageRange: (first: number, last: number, total: number) => string
  paginationButtons: CollectionPaginationButtonLabels
  people: Crm1PeopleLabels
  savedViews: DataCollectionSavedViewLabels
  savePreference: string
  selectRecord: (name: string) => string
  selectedCount: (count: number) => string
  setSector: string
  sort: string
  sortBy: string
  sorts: Record<Crm1Sort, string>
  tags: string
  unarchive: string
  viewCountName: (label: string, count: number) => string
  viewList: string
}

type Crm1LabelGroup =
  | 'archivedOptions'
  | 'leadStatuses'
  | 'modes'
  | 'paginationButtons'
  | 'savedViews'
  | 'sorts'

type Crm1VariantLabelsOverride<TLabels extends { columns: object }> = Partial<
  Omit<TLabels, 'columns'>
> & { columns?: Partial<TLabels['columns']> }

export type Crm1LabelsOverride = Partial<
  Omit<Crm1Labels, Crm1LabelGroup | Crm1Variant>
> & {
  [TGroup in Crm1LabelGroup]?: Partial<Crm1Labels[TGroup]>
} & {
  companies?: Crm1VariantLabelsOverride<Crm1CompaniesLabels>
  people?: Crm1VariantLabelsOverride<Crm1PeopleLabels>
}

interface Crm1BaseProps extends DataCollectionLoadProps {
  archivedFilter?: Crm1Archived | null
  className?: string
  counts?: Partial<Record<Crm1Variant, number>>
  filtered?: boolean
  labels?: Crm1LabelsOverride
  leadFilter?: Crm1LeadStatus | null
  mode?: Crm1Mode
  onArchivedFilterChange?: (archived: Crm1Archived | null) => void
  onBulkArchive?: (recordIds: string[]) => void
  onBulkUnarchive?: (recordIds: string[]) => void
  onCreate?: () => void
  onLeadFilterChange?: (leadStatus: Crm1LeadStatus | null) => void
  onModeChange?: (mode: Crm1Mode) => void
  onOpen?: (recordId: string) => void
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
  onSortChange?: (sort: Crm1Sort) => void
  onTagFilterChange?: (tagIds: string[]) => void
  onVariantChange?: (variant: Crm1Variant) => void
  page?: number
  pageCount?: number
  pageSize?: number
  savedViewId?: string | null
  savedViewModified?: boolean
  savedViews?: Crm1SavedView[]
  savedViewsLoading?: boolean
  savedViewsPending?: boolean
  search?: string
  selectedIds?: string[]
  sort?: Crm1Sort
  tagFilter?: string[]
  tags?: Crm1Option[]
  tagsLoading?: boolean
  total?: number
}

export interface Crm1PeopleProps extends Crm1BaseProps {
  records: Crm1Person[]
  variant: 'people'
}

export interface Crm1CompaniesProps extends Crm1BaseProps {
  onBulkSectorChange?: (recordIds: string[], sectorId: string) => void
  records: Crm1Company[]
  sectors?: Crm1Option[]
  variant: 'companies'
}

export type Crm1Props = Crm1CompaniesProps | Crm1PeopleProps
