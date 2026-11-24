import type { ReactNode } from 'react'

export interface EmptyState2Labels {
  clear: string
  description: string
  suggestions: string
  title: (query: string) => string
}

export interface EmptyState2Props {
  className?: string
  icon?: ReactNode
  labels?: Partial<EmptyState2Labels>
  onClear?: () => void
  onSuggestion?: (suggestion: string) => void
  query: string
  suggestions?: string[]
}
