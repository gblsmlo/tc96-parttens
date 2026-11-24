import type { DataGridConditionFilterLabels } from '@tc96/ui/patterns/collection/layouts/data-grid/components/data-grid-condition-filters'
import type {
  DataGridCondition,
  DataGridConditionOperator,
} from '@tc96/ui/patterns/collection/layouts/data-grid/lib/data-grid-conditions'
import type {
  GridColumnVisibility,
  GridFormatProps,
  GridLoadLabels,
  GridLoadProps,
  GridPerson,
  GridSort,
  GridView,
  GridViewLabels,
  GridViewProps,
} from '../shared/types'

export type DataGrid3Segment = 'enterprise' | 'mid-market' | 'scale'

export type DataGrid3Stage =
  | 'commercial-review'
  | 'legal-review'
  | 'preparing'
  | 'signed'

export type DataGrid3Risk = 'critical' | 'high' | 'low' | 'medium'

export type DataGrid3Health = 'at-risk' | 'healthy' | 'watchlist'

export type DataGrid3Urgency = 'later' | 'overdue' | 'soon'

export type DataGrid3Density = 'extra-tall' | 'medium' | 'short' | 'tall'

export type DataGrid3ToggleColumnId =
  | 'arr'
  | 'health'
  | 'renewal'
  | 'risk'
  | 'stage'

export type DataGrid3ColumnId = DataGrid3ToggleColumnId | 'account' | 'actions'

export type DataGrid3FilterField =
  | 'account'
  | 'arr'
  | 'health'
  | 'owner'
  | 'renewal'
  | 'risk'
  | 'segment'
  | 'stage'

export type DataGrid3SortKey = Exclude<DataGrid3ColumnId, 'actions'>

export type DataGrid3Person = GridPerson

export type DataGrid3Condition = DataGridCondition

export type DataGrid3ConditionOperator = DataGridConditionOperator

export type DataGrid3View = GridView

export interface DataGrid3Account {
  logoUrl?: string
  name: string
  segment: DataGrid3Segment
}

export interface DataGrid3Renewal {
  account: DataGrid3Account
  arr: number
  dueInDays: number
  health: number
  id: string
  owner: DataGrid3Person
  renewalDate: string
  risk: DataGrid3Risk
  stage: DataGrid3Stage
  upside: number
}

export interface DataGrid3RowAction {
  destructive?: boolean
  id: string
  label: string
}

export type DataGrid3Sort = GridSort<DataGrid3SortKey>

export type DataGrid3ColumnVisibility =
  GridColumnVisibility<DataGrid3ToggleColumnId>

export interface DataGrid3Labels extends GridLoadLabels, GridViewLabels {
  assignOwner: string
  clearSelection: string
  columns: Record<DataGrid3ColumnId, string>
  columnsMenu: string
  conditions: DataGridConditionFilterLabels
  create: string
  density: string
  densities: Record<DataGrid3Density, string>
  clearSort: string
  sortOption: (column: string, direction: 'asc' | 'desc') => string
  filterCount: (label: string, count: number) => string
  due: (urgency: DataGrid3Urgency, days: number) => string
  empty: string
  fields: Record<DataGrid3FilterField, string>
  health: Record<DataGrid3Health, string>
  healthScore: (percent: string, level: string) => string
  moveStage: string
  newStage: string
  operators: Record<DataGrid3ConditionOperator, string>
  owner: string
  risks: Record<DataGrid3Risk, string>
  rowActionsFor: (account: string) => string
  saveView: string
  segments: Record<DataGrid3Segment, string>
  selectAll: string
  selectAccount: (account: string) => string
  selectedCount: (count: number) => string
  selectionActions: string
  settings: string
  sortBy: string
  stages: Record<DataGrid3Stage, string>
  summary: (dueSoon: number, atRisk: number, arrAtRisk: string) => string
  title: string
  toolbar: string
  upside: (amount: string) => string
}

export type DataGrid3LabelsOverride = Partial<
  Omit<
    DataGrid3Labels,
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
  columns?: Partial<DataGrid3Labels['columns']>
  conditions?: Partial<DataGrid3Labels['conditions']>
  densities?: Partial<DataGrid3Labels['densities']>
  fields?: Partial<DataGrid3Labels['fields']>
  health?: Partial<DataGrid3Labels['health']>
  operators?: Partial<DataGrid3Labels['operators']>
  risks?: Partial<DataGrid3Labels['risks']>
  segments?: Partial<DataGrid3Labels['segments']>
  stages?: Partial<DataGrid3Labels['stages']>
}

export interface DataGrid3Props
  extends GridFormatProps,
    GridLoadProps,
    GridViewProps {
  className?: string
  columnVisibility?: DataGrid3ColumnVisibility
  conditions?: readonly DataGrid3Condition[]
  density?: DataGrid3Density
  labels?: DataGrid3LabelsOverride
  onAssignOwner?: (renewalIds: string[], ownerId: string) => void
  onColumnVisibilityChange?: (visibility: DataGrid3ColumnVisibility) => void
  onConditionsChange?: (conditions: DataGrid3Condition[]) => void
  onCreate?: () => void
  onDensityChange?: (density: DataGrid3Density) => void
  onRowAction?: (actionId: string, renewalId: string) => void
  onSaveView?: () => void
  onSelectedIdsChange?: (renewalIds: string[]) => void
  onSortChange?: (sort: DataGrid3Sort | null) => void
  onStageUpdate?: (renewalIds: string[], stage: DataGrid3Stage) => void
  owners?: DataGrid3Person[]
  pageSize?: number
  renewals: DataGrid3Renewal[]
  rowActions?: DataGrid3RowAction[]
  selectedIds?: string[]
  sort?: DataGrid3Sort | null
}
