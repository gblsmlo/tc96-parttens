import type { CardLoadLabels, CardLoadProps } from '../shared/types'
export type Card6WorkMode = 'hybrid' | 'onsite' | 'remote'

export interface Card6Salary {
  currency?: string
  max: number
  min: number
}

export interface Card6Job {
  company: string
  id: string
  location: string
  salary?: Card6Salary
  title: string
  workMode: Card6WorkMode
}

export interface Card6Labels extends CardLoadLabels {
  apply: string
  applyTo: (title: string, company: string) => string
  emptyDescription: string
  emptyTitle: string
  save: (title: string) => string
  salary: (min: string, max: string) => string
  title: string
  unsave: (title: string) => string
  workModes: Record<Card6WorkMode, string>
}

export interface Card6Props extends CardLoadProps {
  className?: string
  currency?: string
  jobs: readonly Card6Job[]
  labels?: Partial<Card6Labels>
  locale?: string
  onApply?: (jobId: string) => void
  onSaveChange?: (jobId: string, saved: boolean) => void
  saved?: readonly string[]
}
