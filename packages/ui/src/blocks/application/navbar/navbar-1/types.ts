import type { ReactNode } from 'react'
import type {
  NavbarBreadcrumbItem,
  NavbarPerson,
  NavbarRenderLink,
} from '../shared/types'

export interface Navbar1Labels {
  breadcrumb: string
  collaborators: (count: number) => string
  menu: string
  share: string
}

export interface Navbar1Props {
  breadcrumbs: NavbarBreadcrumbItem[]
  className?: string
  collaborators?: NavbarPerson[]
  labels?: Partial<Navbar1Labels>
  menu?: ReactNode
  onShare?: () => void
  renderLink?: NavbarRenderLink
}
