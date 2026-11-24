import type { Icon } from '@phosphor-icons/react'

export interface Settings11Status {
  icon: Icon
  id: string
  label: string
  projects?: number
  toneClassName?: string
}

export interface Settings11Group {
  id: string
  statuses: Settings11Status[]
  title: string
}

export interface Settings11Labels {
  actions: (name: string) => string
  delete: string
  description: string
  edit: string
  newStatus: string
  projects: (count: number) => string
  title: string
}

export type Settings11Action = 'edit' | 'delete'

export interface Settings11Props {
  className?: string
  groups: Settings11Group[]
  labels?: Partial<Settings11Labels>
  onCreate?: () => void
  onStatusAction?: (statusId: string, action: Settings11Action) => void
}
