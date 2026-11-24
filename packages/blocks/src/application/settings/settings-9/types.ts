import type { ComponentType } from 'react'
import type { SettingsLoadLabels, SettingsLoadProps } from '../shared/types'

export type Settings9RuleIcon = ComponentType<{ className?: string }>

export interface Settings9Rule {
  action: { icon?: Settings9RuleIcon; text: string }
  field: string
  id: string
  operator: string
  value: { icon?: Settings9RuleIcon; label: string }
}

export type Settings9Action = 'edit' | 'delete'

export interface Settings9Labels extends SettingsLoadLabels {
  actions: (field: string, operator: string, value: string) => string
  addRule: string
  condition: string
  delete: string
  description: string
  edit: string
  emptyDescription: string
  emptyTitle: string
  thenLabel: string
  title: string
  whenLabel: string
}

export interface Settings9Props extends SettingsLoadProps {
  className?: string
  labels?: Partial<Settings9Labels>
  onCreate?: () => void
  onRuleAction?: (ruleId: string, action: Settings9Action) => void
  rules: Settings9Rule[]
}
