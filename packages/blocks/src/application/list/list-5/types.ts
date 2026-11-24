import type { Icon } from '@phosphor-icons/react'

export interface List5Module {
  description: string
  icon: Icon
  id: string
  name: string
}

export interface List5Labels {
  add: (name: string) => string
  browseMore: string
  title: string
}

export interface List5Props {
  className?: string
  labels?: Partial<List5Labels>
  modules: readonly List5Module[]
  onAdd?: (id: string) => void
  onBrowseMore?: () => void
}
