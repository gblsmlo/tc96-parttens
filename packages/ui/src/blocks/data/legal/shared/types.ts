import type { SelectPropertyOption } from '@tc96/ui/patterns/properties/display/select/select-property'

export type LegalPropertyVariant = 'badge' | 'plain'

export type LegalMode = 'calendar' | 'kanban' | 'list' | 'table'

export interface LegalPerson {
  id: string
  imageUrl?: string
  label: string
}

export interface LegalFormatProps {
  locale?: string
  timeZone?: string
}

export interface LegalLoadLabels {
  errorDescription: string
  errorTitle: string
  loading: string
  retry: string
}

export interface LegalLoadProps {
  error?: boolean
  onRetry?: () => void
  pending?: boolean
}

export interface LegalToolbarLabels {
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

export type LegalModeLabels = Record<LegalMode, string>

export interface LegalOptionAppearance {
  icon: NonNullable<SelectPropertyOption['icon']>
  tone: NonNullable<SelectPropertyOption['tone']>
}
