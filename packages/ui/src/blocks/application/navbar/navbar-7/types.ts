import type { Locale } from '@daypicker/react'
import type { RenderLink } from '@tc96/ui/render-anchor'
import type { ReactNode } from 'react'

export interface Navbar7Crumb {
  href?: string
  id: string
  label: string
}

export interface Navbar7Range {
  from?: Date
  to?: Date
}

export interface Navbar7RefreshOption {
  id: string
  label: string
}

export interface Navbar7SearchItem {
  group?: string
  id: string
  label: string
}

export interface Navbar7Labels {
  breadcrumb: string
  compare: string
  dateRange: string
  dateRangePlaceholder: string
  menu: string
  refresh: string
  refreshInterval: string
  search: string
  searchClose: string
  searchEmpty: string
  searchNavigate: string
  searchOpen: string
  searchPlaceholder: string
  share: string
}

export interface Navbar7Props {
  breadcrumb: Navbar7Crumb[]
  calendarLocale?: Locale
  className?: string
  compare?: boolean
  labels?: Partial<Navbar7Labels>
  locale?: string
  menu?: ReactNode
  onCompareChange?: (compare: boolean) => void
  onRangeChange?: (range: Navbar7Range) => void
  onRefresh?: () => void
  onRefreshIntervalChange?: (id: string) => void
  onSearchSelect?: (id: string) => void
  onShare?: () => void
  range?: Navbar7Range
  refreshInterval?: string
  refreshOptions?: Navbar7RefreshOption[]
  renderLink?: RenderLink
  searchItems?: Navbar7SearchItem[]
}
