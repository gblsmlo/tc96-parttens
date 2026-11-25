import type {
  GridFormatProps,
  GridLoadLabels,
  GridLoadProps,
} from '../../shared/grid/types'
import type { DataOptionAppearance } from '../../shared/properties/types'

export type Support3RuleIcon = 'alert' | 'clock' | 'people' | 'sliders' | 'tag'

export interface Support3Scope {
  label: string
  tone?: DataOptionAppearance['tone']
}

export type Support3ColumnId =
  | 'actions'
  | 'condition'
  | 'drag'
  | 'effect'
  | 'enabled'
  | 'matches'
  | 'rank'
  | 'rule'
  | 'scope'

export interface Support3Rule {
  condition: string
  description: string
  effect: string
  enabled: boolean
  icon: Support3RuleIcon
  id: string
  matches: number
  name: string
  scope: Support3Scope
}

export interface Support3RuleMove {
  fromIndex: number
  overRuleId: string
  ruleId: string
  toIndex: number
}

export interface Support3RowAction {
  destructive?: boolean
  id: string
  label: string
}

export interface Support3Labels extends GridLoadLabels {
  columns: Record<Support3ColumnId, string>
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

export type Support3LabelsOverride = Partial<
  Omit<Support3Labels, 'columns'>
> & {
  columns?: Partial<Support3Labels['columns']>
}

export interface Support3Props extends GridFormatProps, GridLoadProps {
  className?: string
  labels?: Support3LabelsOverride
  onEnabledChange?: (ruleId: string, enabled: boolean) => void
  onResetOrder?: () => void
  onRowAction?: (actionId: string, ruleId: string) => void
  onRuleMove?: (move: Support3RuleMove) => void
  orderChanged?: boolean
  rowActions?: Support3RowAction[]
  rules: Support3Rule[]
}
