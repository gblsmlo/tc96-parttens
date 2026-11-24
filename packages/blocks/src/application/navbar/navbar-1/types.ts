import type {
  NavbarBreadcrumbItem,
  NavbarPerson,
  NavbarRenderLink,
} from '../shared/types'

export interface Navbar1Tab {
  id: string
  label: string
}

export interface Navbar1Labels {
  breadcrumb: string
  collaborators: (count: number) => string
  share: string
  tabs: string
}

export interface Navbar1Props {
  breadcrumbs: NavbarBreadcrumbItem[]
  className?: string
  collaborators?: NavbarPerson[]
  labels?: Partial<Navbar1Labels>
  onShare?: () => void
  onTabChange: (tab: string) => void
  renderLink?: NavbarRenderLink
  tab: string
  tabs: Navbar1Tab[]
}
