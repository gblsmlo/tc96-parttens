import type { RenderLink } from '@tc96/ui/render-anchor'

export type Navbar5Status = 'changed' | 'draft' | 'published'

export interface Navbar5Crumb {
  href?: string
  id: string
  label: string
}

export interface Navbar5Person {
  id: string
  image?: string
  name: string
}

export interface Navbar5Action {
  destructive?: boolean
  id: string
  label: string
}

export interface Navbar5Labels {
  breadcrumb: string
  overflow: (count: number) => string
  people: string
  publish: string
  publishActions: string
  status: Record<Navbar5Status, string>
}

export interface Navbar5Props {
  actions?: Navbar5Action[]
  breadcrumb: Navbar5Crumb[]
  className?: string
  labels?: Partial<Navbar5Labels>
  maxPeople?: number
  onPublish?: () => void
  onPublishAction?: (id: string) => void
  pending?: boolean
  people?: Navbar5Person[]
  renderLink?: RenderLink
  status: Navbar5Status
}
