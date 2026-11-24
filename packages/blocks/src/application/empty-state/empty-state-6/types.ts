import type { ElementType } from 'react'

export interface EmptyState6Tab {
  actionLabel: string
  description: string
  icon: ElementType
  id: string
  label: string
  title: string
}

export interface EmptyState6Labels {
  tabs: string
}

export interface EmptyState6Props {
  className?: string
  labels?: Partial<EmptyState6Labels>
  onSetup: (tabId: string) => void
  onTabChange: (tab: string) => void
  tab: string
  tabs: readonly EmptyState6Tab[]
}
