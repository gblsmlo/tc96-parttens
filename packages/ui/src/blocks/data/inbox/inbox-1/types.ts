import type {
  DataCollectionLoadLabels,
  DataCollectionLoadProps,
} from '../../shared/collection/types'

export type Inbox1Category = 'court' | 'deadlines' | 'monitoring' | 'tasks'

export type Inbox1Kind =
  | 'deadline-at-risk'
  | 'deadline-fatal'
  | 'deadline-internal'
  | 'deadline-stalled'
  | 'failure-opened'
  | 'movement'
  | 'publication'
  | 'task-assigned'
  | 'task-due'

export type Inbox1Origin =
  | 'deadline'
  | 'monitoring'
  | 'movement'
  | 'publication'
  | 'task'

export type Inbox1Sort = 'newest' | 'oldest' | 'unread'

export type Inbox1ReadFilter = 'read' | 'unread'

export type Inbox1ReceivedFilter = 'last30' | 'last7' | 'today'

export type Inbox1DueTone = 'attention' | 'error' | 'neutral'

export interface Inbox1Due {
  label: string
  tone: Inbox1DueTone
}

export interface Inbox1Entry {
  due: Inbox1Due | null
  id: string
  kind: Inbox1Kind
  openable?: boolean
  origin: Inbox1Origin
  read: boolean
  reason: string
  received: string
  receivedHint?: string
  title: string
}

export type Inbox1ColumnId =
  | 'due'
  | 'entry'
  | 'origin'
  | 'read'
  | 'reason'
  | 'received'

export type Inbox1ActionId = 'markRead' | 'open'

export type Inbox1OriginColors = Partial<Record<Inbox1Origin, string>>

export interface Inbox1Labels extends DataCollectionLoadLabels {
  actions: Record<Inbox1ActionId, string>
  allCategories: string
  allKinds: string
  allReadStates: string
  anyDate: string
  categories: Record<Inbox1Category, string>
  categoryList: string
  clearFilters: string
  clearSelection: string
  columns: Record<Inbox1ColumnId, string>
  display: string
  empty: string
  emptyFiltered: string
  filterCount: (label: string, count: number) => string
  filters: string
  kind: string
  kinds: Record<Inbox1Kind, string>
  loadMore: string
  loadMoreError: string
  markError: string
  markRead: (title: string) => string
  markUnread: (title: string) => string
  noDue: string
  noDueMark: string
  openEntry: (title: string) => string
  origins: Record<Inbox1Origin, string>
  readFilter: string
  readFilters: Record<Inbox1ReadFilter, string>
  readStates: Record<Inbox1ReadFilter, string>
  receivedFilter: string
  receivedFilters: Record<Inbox1ReceivedFilter, string>
  selectAll: string
  selectedCount: (count: number) => string
  selectEntry: (title: string) => string
  selectionActions: string
  sort: string
  sortBy: string
  sorts: Record<Inbox1Sort, string>
  title: string
  toolbar: string
  viewCountName: (label: string, count: number) => string
}

type Inbox1NestedLabels =
  | 'actions'
  | 'categories'
  | 'columns'
  | 'kinds'
  | 'origins'
  | 'readFilters'
  | 'readStates'
  | 'receivedFilters'
  | 'sorts'

export type Inbox1LabelsOverride = Partial<
  Omit<Inbox1Labels, Inbox1NestedLabels>
> & {
  [Key in Inbox1NestedLabels]?: Partial<Inbox1Labels[Key]>
}

export interface Inbox1Props extends DataCollectionLoadProps {
  categories?: readonly Inbox1Category[]
  category?: Inbox1Category | null
  className?: string
  counts?: Partial<Record<'all' | Inbox1Category, number>>
  entries: Inbox1Entry[]
  filtered?: boolean
  hasMore?: boolean
  kindFilter?: Inbox1Kind | null
  labels?: Inbox1LabelsOverride
  loadingMore?: boolean
  loadMoreError?: boolean
  markError?: boolean
  onCategoryChange?: (category: Inbox1Category | null) => void
  onKindFilterChange?: (kind: Inbox1Kind | null) => void
  onLoadMore?: () => void
  onMarkRead?: (entryIds: string[]) => void
  onOpen?: (entryId: string) => void
  onReadChange?: (entryId: string, read: boolean) => void
  onReadFilterChange?: (filter: Inbox1ReadFilter | null) => void
  onReceivedFilterChange?: (filter: Inbox1ReceivedFilter | null) => void
  onSelectedIdsChange?: (entryIds: string[]) => void
  onSortChange?: (sort: Inbox1Sort) => void
  originColors?: Inbox1OriginColors
  readFilter?: Inbox1ReadFilter | null
  receivedFilter?: Inbox1ReceivedFilter | null
  selectedIds?: string[]
  sort?: Inbox1Sort
}
