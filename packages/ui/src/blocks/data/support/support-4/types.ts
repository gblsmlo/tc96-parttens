import type { DataOptionAppearance } from '../../shared/properties/types'
import type {
  TableFormatProps,
  TableLoadLabels,
  TableLoadProps,
} from '../../shared/table/types'

export type Support4RuleIcon = 'alert' | 'clock' | 'people' | 'sliders' | 'tag'

export interface Support4Scope {
  label: string
  tone?: DataOptionAppearance['tone']
}

export type Support4ColumnId =
  | 'actions'
  | 'condition'
  | 'drag'
  | 'effect'
  | 'enabled'
  | 'matches'
  | 'rank'
  | 'rule'
  | 'scope'

export interface Support4Rule {
  condition: string
  description: string
  effect: string
  enabled: boolean
  icon: Support4RuleIcon
  id: string
  matches: number
  name: string
  scope: Support4Scope
}

export interface Support4RuleMove {
  fromIndex: number
  overRuleId: string
  ruleId: string
  toIndex: number
}

export interface Support4RowAction {
  destructive?: boolean
  id: string
  label: string
}

export interface Support4Labels extends TableLoadLabels {
  columns: Record<Support4ColumnId, string>
  dragCancel: (rule: string) => string
  dragDrop: (rule: string, position: number, total: number) => string
  dragHandle: (rule: string) => string
  dragInstructions: string
  dragOver: (rule: string, position: number, total: number) => string
  dragStart: (rule: string, position: number, total: number) => string
  empty: string
  enabledFor: (rule: string) => string
  matchesIn: (matches: string) => string
  period: string
  resetOrder: string
  rowActionsFor: (rule: string) => string
  summary: (active: number, matches: string) => string
  title: string
  toolbar: string
}

export type Support4LabelsOverride = Partial<
  Omit<Support4Labels, 'columns'>
> & {
  columns?: Partial<Support4Labels['columns']>
}

export interface Support4Props extends TableFormatProps, TableLoadProps {
  className?: string
  labels?: Support4LabelsOverride
  onEnabledChange?: (ruleId: string, enabled: boolean) => void
  onResetOrder?: () => void
  onRowAction?: (actionId: string, ruleId: string) => void
  onRuleMove?: (move: Support4RuleMove) => void
  orderChanged?: boolean
  rowActions?: Support4RowAction[]
  rules: Support4Rule[]
}
