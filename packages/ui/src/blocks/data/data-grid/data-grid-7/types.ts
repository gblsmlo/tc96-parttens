import type {
  GridBadgeData,
  GridFormatProps,
  GridLoadLabels,
  GridLoadProps,
} from '../shared/types'

export type DataGrid7RuleIcon = 'alert' | 'clock' | 'people' | 'sliders' | 'tag'

export type DataGrid7Scope = GridBadgeData

export type DataGrid7ColumnId =
  | 'actions'
  | 'condition'
  | 'drag'
  | 'effect'
  | 'enabled'
  | 'matches'
  | 'rank'
  | 'rule'
  | 'scope'

export interface DataGrid7Rule {
  condition: string
  description: string
  effect: string
  enabled: boolean
  icon: DataGrid7RuleIcon
  id: string
  matches: number
  name: string
  scope: DataGrid7Scope
}

export interface DataGrid7RuleMove {
  fromIndex: number
  overRuleId: string
  ruleId: string
  toIndex: number
}

export interface DataGrid7RowAction {
  destructive?: boolean
  id: string
  label: string
}

export interface DataGrid7Labels extends GridLoadLabels {
  columns: Record<DataGrid7ColumnId, string>
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

export type DataGrid7LabelsOverride = Partial<
  Omit<DataGrid7Labels, 'columns'>
> & {
  columns?: Partial<DataGrid7Labels['columns']>
}

export interface DataGrid7Props extends GridFormatProps, GridLoadProps {
  className?: string
  labels?: DataGrid7LabelsOverride
  onEnabledChange?: (ruleId: string, enabled: boolean) => void
  onResetOrder?: () => void
  onRowAction?: (actionId: string, ruleId: string) => void
  onRuleMove?: (move: DataGrid7RuleMove) => void
  orderChanged?: boolean
  rowActions?: DataGrid7RowAction[]
  rules: DataGrid7Rule[]
}
