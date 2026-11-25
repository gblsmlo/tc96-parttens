import type { ReactNode } from 'react'

export type DataCollectionMode = 'calendar' | 'kanban' | 'list' | 'table'

export interface DataCollectionPerson {
  id: string
  imageUrl?: string
  label: string
}

export interface DataCollectionFormatProps {
  locale?: string
  timeZone?: string
}

export interface DataCollectionLoadLabels {
  errorDescription: string
  errorTitle: string
  loading: string
  retry: string
}

export interface DataCollectionLoadProps {
  error?: boolean
  onRetry?: () => void
  pending?: boolean
}

export interface DataCollectionToolbarLabels {
  allStatuses: string
  clearFilters: string
  create: string
  display: string
  export: string
  filterCount: (label: string, count: number) => string
  filters: string
  status: string
  title: string
  toolbar: string
}

export type DataCollectionSettingsToolbarLabels = Pick<
  DataCollectionToolbarLabels,
  'clearFilters' | 'display' | 'filterCount' | 'title' | 'toolbar'
>

export type DataCollectionModeLabels = Record<DataCollectionMode, string>

export interface DataCollectionSavedView {
  icon?: ReactNode
  id: string
  label: string
}

export interface DataCollectionSavedViewLabels {
  create: string
  delete: string
  duplicate: string
  modified: (label: string) => string
  options: (label: string) => string
  rename: string
  savedViews: string
  search: string
  searchPlaceholder: string
  update: (label: string) => string
}
