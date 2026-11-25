import type { RenderLink } from '@tc96/ui/render-anchor'
import type { ReactNode } from 'react'

export interface Navbar12MenuLink {
  description?: string
  href: string
  icon?: ReactNode
  id: string
  label: string
}

export interface Navbar12MenuGroup {
  id: string
  label?: string
  links: Navbar12MenuLink[]
}

export interface Navbar12LinkItem {
  href: string
  id: string
  label: string
}

export interface Navbar12MenuItem {
  groups: Navbar12MenuGroup[]
  id: string
  label: string
}

export type Navbar12Item = Navbar12LinkItem | Navbar12MenuItem

export interface Navbar12Cta {
  href: string
  label: string
}

export interface Navbar12Labels {
  closeMenu: string
  menuTitle: string
  navigation: string
  openMenu: string
}

export interface Navbar12Props {
  className?: string
  cta?: Navbar12Cta
  homeHref?: string
  items: Navbar12Item[]
  labels?: Partial<Navbar12Labels>
  logo?: ReactNode
  name: string
  openOnHover?: boolean
  renderLink?: RenderLink
}
