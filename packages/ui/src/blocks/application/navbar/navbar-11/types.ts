import type { ReactNode } from 'react'

export interface Navbar11Section {
  id: string
  label: string
}

export interface Navbar11Source {
  id: string
  label: string
}

export interface Navbar11User {
  email?: string
  image?: string
  name: string
}

export interface Navbar11Labels {
  account: string
  sectionNavigation: string
  sourceGroup: string
  sourceTrigger: (source: string) => string
}

export interface Navbar11Props {
  className?: string
  labels?: Partial<Navbar11Labels>
  logo?: ReactNode
  menu?: ReactNode
  name: string
  onSectionChange?: (id: string) => void
  onSourceChange?: (id: string) => void
  section?: string
  sections?: Navbar11Section[]
  source?: string
  sources?: Navbar11Source[]
  user?: Navbar11User
  version?: string
}
