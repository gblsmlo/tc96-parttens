import type { DataGridConditionFilterLabels } from '@tc96/ui/patterns/data-grid/components/data-grid-condition-filters'
import type {
  DataGridCondition,
  DataGridConditionOperator,
} from '@tc96/ui/patterns/data-grid/lib/data-grid-conditions'
import type {
  TableColumnVisibility,
  TableFormatProps,
  TableLoadLabels,
  TableLoadProps,
  TablePerson,
  TableSort,
  TableView,
  TableViewLabels,
  TableViewProps,
} from '../../shared/table/types'

export type Revenue2Segment = 'enterprise' | 'mid-market' | 'scale'

export type Revenue2Stage =
  | 'commercial-review'
  | 'legal-review'
  | 'preparing'
  | 'signed'

export type Revenue2Risk = 'critical' | 'high' | 'low' | 'medium'

export type Revenue2Health = 'at-risk' | 'healthy' | 'watchlist'

export type Revenue2Urgency = 'later' | 'overdue' | 'soon'

export type Revenue2Density = 'extra-tall' | 'medium' | 'short' | 'tall'

export type Revenue2ToggleColumnId =
  | 'arr'
  | 'health'
  | 'renewal'
  | 'risk'
  | 'stage'

export type Revenue2ColumnId = Revenue2ToggleColumnId | 'account' | 'actions'

export type Revenue2FilterField =
  | 'account'
  | 'arr'
  | 'health'
  | 'owner'
  | 'renewal'
  | 'risk'
  | 'segment'
  | 'stage'

export type Revenue2SortKey = Exclude<Revenue2ColumnId, 'actions'>

export type Revenue2Person = TablePerson

export type Revenue2Condition = DataGridCondition

export type Revenue2ConditionOperator = DataGridConditionOperator

export type Revenue2View = TableView

export interface Revenue2Account {
  logoUrl?: string
  name: string
  segment: Revenue2Segment
}

export interface Revenue2Renewal {
  account: Revenue2Account
  arr: number
  dueInDays: number
  health: number
  id: string
  owner: Revenue2Person
  renewalDate: string
  risk: Revenue2Risk
  stage: Revenue2Stage
  upside: number
}

export interface Revenue2RowAction {
  destructive?: boolean
  id: string
  label: string
}

export type Revenue2Sort = TableSort<Revenue2SortKey>

export type Revenue2ColumnVisibility =
  TableColumnVisibility<Revenue2ToggleColumnId>

export interface Revenue2Labels extends TableLoadLabels, TableViewLabels {
  assignOwner: string
  clearSelection: string
  columns: Record<Revenue2ColumnId, string>
  columnsMenu: string
  conditions: DataGridConditionFilterLabels
  create: string
  density: string
  densities: Record<Revenue2Density, string>
  clearSort: string
  sortOption: (column: string, direction: 'asc' | 'desc') => string
  filterCount: (label: string, count: number) => string
  due: (urgency: Revenue2Urgency, days: number) => string
  empty: string
  fields: Record<Revenue2FilterField, string>
  health: Record<Revenue2Health, string>
  healthScore: (percent: string, level: string) => string
  moveStage: string
  newStage: string
  operators: Record<Revenue2ConditionOperator, string>
  owner: string
  risks: Record<Revenue2Risk, string>
  rowActionsFor: (account: string) => string
  saveView: string
  segments: Record<Revenue2Segment, string>
  selectAll: string
  selectAccount: (account: string) => string
  selectedCount: (count: number) => string
  selectionActions: string
  settings: string
  sortBy: string
  stages: Record<Revenue2Stage, string>
  summary: (dueSoon: number, atRisk: number, arrAtRisk: string) => string
  title: string
  toolbar: string
  upside: (amount: string) => string
}

export type Revenue2LabelsOverride = Partial<
  Omit<
    Revenue2Labels,
    | 'columns'
    | 'conditions'
    | 'densities'
    | 'fields'
    | 'health'
    | 'operators'
    | 'risks'
    | 'segments'
    | 'stages'
  >
> & {
  columns?: Partial<Revenue2Labels['columns']>
  conditions?: Partial<Revenue2Labels['conditions']>
  densities?: Partial<Revenue2Labels['densities']>
  fields?: Partial<Revenue2Labels['fields']>
  health?: Partial<Revenue2Labels['health']>
  operators?: Partial<Revenue2Labels['operators']>
  risks?: Partial<Revenue2Labels['risks']>
  segments?: Partial<Revenue2Labels['segments']>
  stages?: Partial<Revenue2Labels['stages']>
}

export interface Revenue2Props
  extends TableFormatProps,
    TableLoadProps,
    TableViewProps {
  className?: string
  columnVisibility?: Revenue2ColumnVisibility
  conditions?: readonly Revenue2Condition[]
  density?: Revenue2Density
  labels?: Revenue2LabelsOverride
  onAssignOwner?: (renewalIds: string[], ownerId: string) => void
  onColumnVisibilityChange?: (visibility: Revenue2ColumnVisibility) => void
  onConditionsChange?: (conditions: Revenue2Condition[]) => void
  onCreate?: () => void
  onDensityChange?: (density: Revenue2Density) => void
  onRowAction?: (actionId: string, renewalId: string) => void
  onSaveView?: () => void
  onSelectedIdsChange?: (renewalIds: string[]) => void
  onSortChange?: (sort: Revenue2Sort | null) => void
  onStageUpdate?: (renewalIds: string[], stage: Revenue2Stage) => void
  owners?: Revenue2Person[]
  pageSize?: number
  renewals: Revenue2Renewal[]
  rowActions?: Revenue2RowAction[]
  selectedIds?: string[]
  sort?: Revenue2Sort | null
}
