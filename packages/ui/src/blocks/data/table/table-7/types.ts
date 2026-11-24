import type {
  TableBadgeData,
  TableFormatProps,
  TableLoadLabels,
  TableLoadProps,
} from '../shared/types'

export type Table7RuleIcon = 'alert' | 'clock' | 'people' | 'sliders' | 'tag'

export type Table7Scope = TableBadgeData

export type Table7ColumnId =
  | 'actions'
  | 'condition'
  | 'drag'
  | 'effect'
  | 'enabled'
  | 'matches'
  | 'rank'
  | 'rule'
  | 'scope'

export interface Table7Rule {
  condition: string
  description: string
  effect: string
  enabled: boolean
  icon: Table7RuleIcon
  id: string
  matches: number
  name: string
  scope: Table7Scope
}

export interface Table7RuleMove {
  fromIndex: number
  overRuleId: string
  ruleId: string
  toIndex: number
}

export interface Table7RowAction {
  destructive?: boolean
  id: string
  label: string
}

export interface Table7Labels extends TableLoadLabels {
  columns: Record<Table7ColumnId, string>
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

export type Table7LabelsOverride = Partial<Omit<Table7Labels, 'columns'>> & {
  columns?: Partial<Table7Labels['columns']>
}

export interface Table7Props extends TableFormatProps, TableLoadProps {
  className?: string
  labels?: Table7LabelsOverride
  onEnabledChange?: (ruleId: string, enabled: boolean) => void
  onResetOrder?: () => void
  onRowAction?: (actionId: string, ruleId: string) => void
  onRuleMove?: (move: Table7RuleMove) => void
  orderChanged?: boolean
  rowActions?: Table7RowAction[]
  rules: Table7Rule[]
}
