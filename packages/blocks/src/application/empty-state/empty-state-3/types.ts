import type { ReactNode } from 'react'

export interface EmptyState3Template {
  description?: string
  icon?: ReactNode
  id: string
  title: string
}

export interface EmptyState3Labels {
  create: string
  description: string
  import: string
  templates: string
  title: string
}

export interface EmptyState3Props {
  className?: string
  icon?: ReactNode
  labels?: Partial<EmptyState3Labels>
  onCreate?: () => void
  onImport?: () => void
  onTemplate?: (id: string) => void
  templates?: EmptyState3Template[]
}
