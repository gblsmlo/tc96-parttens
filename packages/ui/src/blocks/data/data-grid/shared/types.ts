export type GridTone =
  | 'error'
  | 'info'
  | 'outline'
  | 'secondary'
  | 'success'
  | 'warning'

export interface GridBadgeData {
  label: string
  tone?: GridTone
}

export interface GridPerson {
  id: string
  imageUrl?: string
  label: string
}

export interface GridFormatProps {
  currency?: string
  locale?: string
}

export interface GridLoadLabels {
  errorDescription: string
  errorTitle: string
  loading: string
  retry: string
}

export interface GridLoadProps {
  error?: boolean
  onRetry?: () => void
  pending?: boolean
}

export type GridSortDirection = 'asc' | 'desc'

export interface GridSort<TKey extends string> {
  direction: GridSortDirection
  key: TKey
}

export type GridColumnVisibility<TKey extends string> = Partial<
  Record<TKey, boolean>
>

export interface GridView {
  id: string
  label: string
}

export interface GridViewProps {
  activeViewId?: string
  onViewChange?: (viewId: string) => void
  onViewCreate?: () => void
  views?: GridView[]
}

export interface GridViewLabels {
  viewCreate: string
  viewSearch: string
  viewSearchPlaceholder: string
  viewSelect: string
  views: string
  viewsEmpty: string
}

export type GridDensity = 'extra-tall' | 'medium' | 'short' | 'tall'

export interface GridSettingsLabels {
  clearSort: string
  densities: Record<GridDensity, string>
  settingsWithFilters: (settings: string, activeFilters: number) => string
  sortOption: (column: string, direction: GridSortDirection) => string
}
