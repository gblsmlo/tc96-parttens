import type { RenderLink } from '@tc96/ui/render-anchor'
import type { ReactNode } from 'react'

export interface Navbar6Crumb {
  href?: string
  id: string
  label: string
}

export interface Navbar6Person {
  id: string
  image?: string
  name: string
}

export interface Navbar6FilterOption {
  id: string
  label: string
}

export interface Navbar6SortOption {
  id: string
  label: string
}

export interface Navbar6Labels {
  breadcrumb: string
  filter: string
  filterTitle: string
  invite: string
  menu: string
  overflow: (count: number) => string
  people: string
  sort: string
  sortTitle: string
}

export interface Navbar6Props {
  breadcrumb: Navbar6Crumb[]
  className?: string
  filterOptions?: Navbar6FilterOption[]
  filters?: string[]
  labels?: Partial<Navbar6Labels>
  maxPeople?: number
  menu?: ReactNode
  onFiltersChange?: (filters: string[]) => void
  onInvite?: () => void
  onSortChange?: (sort: string) => void
  people?: Navbar6Person[]
  renderLink?: RenderLink
  sort?: string
  sortOptions?: Navbar6SortOption[]
}
