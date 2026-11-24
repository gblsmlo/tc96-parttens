import type { DataGridConditionFilterLabels } from '@tc96/ui/patterns/collection/layouts/data-grid/components/data-grid-condition-filters'
import type {
  DataGridCondition,
  DataGridConditionOperator,
} from '@tc96/ui/patterns/collection/layouts/data-grid/lib/data-grid-conditions'
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
} from '../shared/types'

export type Table3Segment = 'enterprise' | 'mid-market' | 'scale'

export type Table3Stage =
  | 'commercial-review'
  | 'legal-review'
  | 'preparing'
  | 'signed'

export type Table3Risk = 'critical' | 'high' | 'low' | 'medium'

export type Table3Health = 'at-risk' | 'healthy' | 'watchlist'

export type Table3Urgency = 'later' | 'overdue' | 'soon'

export type Table3Density = 'extra-tall' | 'medium' | 'short' | 'tall'

export type Table3ToggleColumnId =
  | 'arr'
  | 'health'
  | 'renewal'
  | 'risk'
  | 'stage'

export type Table3ColumnId = Table3ToggleColumnId | 'account' | 'actions'

export type Table3FilterField =
  | 'account'
  | 'arr'
  | 'health'
  | 'owner'
  | 'renewal'
  | 'risk'
  | 'segment'
  | 'stage'

export type Table3SortKey = Exclude<Table3ColumnId, 'actions'>

export type Table3Person = TablePerson

export type Table3Condition = DataGridCondition

export type Table3ConditionOperator = DataGridConditionOperator

export type Table3View = TableView

export interface Table3Account {
  logoUrl?: string
  name: string
  segment: Table3Segment
}

export interface Table3Renewal {
  account: Table3Account
  arr: number
  dueInDays: number
  health: number
  id: string
  owner: Table3Person
  renewalDate: string
  risk: Table3Risk
  stage: Table3Stage
  upside: number
}

export interface Table3RowAction {
  destructive?: boolean
  id: string
  label: string
}

export type Table3Sort = TableSort<Table3SortKey>

export type Table3ColumnVisibility = TableColumnVisibility<Table3ToggleColumnId>

export interface Table3Labels extends TableLoadLabels, TableViewLabels {
  assignOwner: string
  clearSelection: string
  columns: Record<Table3ColumnId, string>
  columnsMenu: string
  conditions: DataGridConditionFilterLabels
  create: string
  density: string
  densities: Record<Table3Density, string>
  clearSort: string
  sortOption: (column: string, direction: 'asc' | 'desc') => string
  filterCount: (label: string, count: number) => string
  due: (urgency: Table3Urgency, days: number) => string
  empty: string
  fields: Record<Table3FilterField, string>
  health: Record<Table3Health, string>
  healthScore: (percent: string, level: string) => string
  moveStage: string
  newStage: string
  operators: Record<Table3ConditionOperator, string>
  owner: string
  risks: Record<Table3Risk, string>
  rowActionsFor: (account: string) => string
  saveView: string
  segments: Record<Table3Segment, string>
  selectAll: string
  selectAccount: (account: string) => string
  selectedCount: (count: number) => string
  selectionActions: string
  settings: string
  sortBy: string
  stages: Record<Table3Stage, string>
  summary: (dueSoon: number, atRisk: number, arrAtRisk: string) => string
  title: string
  toolbar: string
  upside: (amount: string) => string
}

export type Table3LabelsOverride = Partial<
  Omit<
    Table3Labels,
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
  columns?: Partial<Table3Labels['columns']>
  conditions?: Partial<Table3Labels['conditions']>
  densities?: Partial<Table3Labels['densities']>
  fields?: Partial<Table3Labels['fields']>
  health?: Partial<Table3Labels['health']>
  operators?: Partial<Table3Labels['operators']>
  risks?: Partial<Table3Labels['risks']>
  segments?: Partial<Table3Labels['segments']>
  stages?: Partial<Table3Labels['stages']>
}

export interface Table3Props
  extends TableFormatProps,
    TableLoadProps,
    TableViewProps {
  className?: string
  columnVisibility?: Table3ColumnVisibility
  conditions?: readonly Table3Condition[]
  density?: Table3Density
  labels?: Table3LabelsOverride
  onAssignOwner?: (renewalIds: string[], ownerId: string) => void
  onColumnVisibilityChange?: (visibility: Table3ColumnVisibility) => void
  onConditionsChange?: (conditions: Table3Condition[]) => void
  onCreate?: () => void
  onDensityChange?: (density: Table3Density) => void
  onRowAction?: (actionId: string, renewalId: string) => void
  onSaveView?: () => void
  onSelectedIdsChange?: (renewalIds: string[]) => void
  onSortChange?: (sort: Table3Sort | null) => void
  onStageUpdate?: (renewalIds: string[], stage: Table3Stage) => void
  owners?: Table3Person[]
  pageSize?: number
  renewals: Table3Renewal[]
  rowActions?: Table3RowAction[]
  selectedIds?: string[]
  sort?: Table3Sort | null
}
