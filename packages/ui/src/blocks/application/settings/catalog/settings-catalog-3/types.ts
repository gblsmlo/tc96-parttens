import type { ComponentType } from 'react'
import type { SettingsLoadLabels, SettingsLoadProps } from '../../shared/types'

export type SettingsCatalog3RuleIcon = ComponentType<{ className?: string }>

export interface SettingsCatalog3Rule {
  action: { icon?: SettingsCatalog3RuleIcon; text: string }
  field: string
  id: string
  operator: string
  value: { icon?: SettingsCatalog3RuleIcon; label: string }
}

export type SettingsCatalog3Action = 'edit' | 'delete'

export interface SettingsCatalog3Labels extends SettingsLoadLabels {
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

export interface SettingsCatalog3Props extends SettingsLoadProps {
  className?: string
  labels?: Partial<SettingsCatalog3Labels>
  onCreate?: () => void
  onRuleAction?: (ruleId: string, action: SettingsCatalog3Action) => void
  rules: SettingsCatalog3Rule[]
}
