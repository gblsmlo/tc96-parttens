import type { RenderLink } from '@tc96/ui/render-anchor'
import type { ReactNode } from 'react'

export interface EmptyState1Guide {
  href: string
  id: string
  title: string
}

export interface EmptyState1Labels {
  create: string
  description: string
  guides: string
  import: string
  title: string
}

export interface EmptyState1Props {
  className?: string
  guides?: EmptyState1Guide[]
  icon?: ReactNode
  labels?: Partial<EmptyState1Labels>
  onCreate?: () => void
  onImport?: () => void
  renderLink?: RenderLink
}
