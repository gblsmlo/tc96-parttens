export type TableTone =
  | 'error'
  | 'info'
  | 'outline'
  | 'secondary'
  | 'success'
  | 'warning'

export interface TableBadgeData {
  label: string
  tone?: TableTone
}

export interface TablePerson {
  id: string
  imageUrl?: string
  label: string
}

export interface TableFormatProps {
  currency?: string
  locale?: string
}

export interface TableLoadLabels {
  errorDescription: string
  errorTitle: string
  loading: string
  retry: string
}

export interface TableLoadProps {
  error?: boolean
  onRetry?: () => void
  pending?: boolean
}

export type TableSortDirection = 'asc' | 'desc'

export interface TableSort<TKey extends string> {
  direction: TableSortDirection
  key: TKey
}

export type TableColumnVisibility<TKey extends string> = Partial<
  Record<TKey, boolean>
>

export interface TableView {
  id: string
  label: string
}

export interface TableViewProps {
  activeViewId?: string
  onViewChange?: (viewId: string) => void
  onViewCreate?: () => void
  views?: TableView[]
}

export interface TableViewLabels {
  viewCreate: string
  viewSearch: string
  viewSearchPlaceholder: string
  viewSelect: string
  views: string
  viewsEmpty: string
}

export type TableDensity = 'extra-tall' | 'medium' | 'short' | 'tall'

export interface TableSettingsLabels {
  clearSort: string
  densities: Record<TableDensity, string>
  settingsWithFilters: (settings: string, activeFilters: number) => string
  sortOption: (column: string, direction: TableSortDirection) => string
}
