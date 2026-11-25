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
} from '../../shared/grid/types'

export type Revenue1Segment = 'enterprise' | 'mid-market' | 'scale'

export type Revenue1Stage =
  | 'commercial-review'
  | 'legal-review'
  | 'preparing'
  | 'signed'

export type Revenue1Risk = 'critical' | 'high' | 'low' | 'medium'

export type Revenue1Health = 'at-risk' | 'healthy' | 'watchlist'

export type Revenue1Urgency = 'later' | 'overdue' | 'soon'

export type Revenue1Density = 'extra-tall' | 'medium' | 'short' | 'tall'

export type Revenue1ToggleColumnId =
  | 'arr'
  | 'health'
  | 'renewal'
  | 'risk'
  | 'stage'

export type Revenue1ColumnId = Revenue1ToggleColumnId | 'account' | 'actions'

export type Revenue1FilterField =
  | 'account'
  | 'arr'
  | 'health'
  | 'owner'
  | 'renewal'
  | 'risk'
  | 'segment'
  | 'stage'

export type Revenue1SortKey = Exclude<Revenue1ColumnId, 'actions'>

export type Revenue1Person = GridPerson

export type Revenue1Condition = DataGridCondition

export type Revenue1ConditionOperator = DataGridConditionOperator

export type Revenue1View = GridView

export interface Revenue1Account {
  logoUrl?: string
  name: string
  segment: Revenue1Segment
}

export interface Revenue1Renewal {
  account: Revenue1Account
  arr: number
  dueInDays: number
  health: number
  id: string
  owner: Revenue1Person
  renewalDate: string
  risk: Revenue1Risk
  stage: Revenue1Stage
  upside: number
}

export interface Revenue1RowAction {
  destructive?: boolean
  id: string
  label: string
}

export type Revenue1Sort = GridSort<Revenue1SortKey>

export type Revenue1ColumnVisibility =
  GridColumnVisibility<Revenue1ToggleColumnId>

export interface Revenue1Labels extends GridLoadLabels, GridViewLabels {
  assignOwner: string
  clearSelection: string
  columns: Record<Revenue1ColumnId, string>
  columnsMenu: string
  conditions: DataGridConditionFilterLabels
  create: string
  density: string
  densities: Record<Revenue1Density, string>
  clearSort: string
  sortOption: (column: string, direction: 'asc' | 'desc') => string
  filterCount: (label: string, count: number) => string
  due: (urgency: Revenue1Urgency, days: number) => string
  empty: string
  fields: Record<Revenue1FilterField, string>
  health: Record<Revenue1Health, string>
  healthScore: (percent: string, level: string) => string
  moveStage: string
  newStage: string
  operators: Record<Revenue1ConditionOperator, string>
  owner: string
  risks: Record<Revenue1Risk, string>
  rowActionsFor: (account: string) => string
  saveView: string
  segments: Record<Revenue1Segment, string>
  selectAll: string
  selectAccount: (account: string) => string
  selectedCount: (count: number) => string
  selectionActions: string
  settings: string
  sortBy: string
  stages: Record<Revenue1Stage, string>
  summary: (dueSoon: number, atRisk: number, arrAtRisk: string) => string
  title: string
  toolbar: string
  upside: (amount: string) => string
}

export type Revenue1LabelsOverride = Partial<
  Omit<
    Revenue1Labels,
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
  columns?: Partial<Revenue1Labels['columns']>
  conditions?: Partial<Revenue1Labels['conditions']>
  densities?: Partial<Revenue1Labels['densities']>
  fields?: Partial<Revenue1Labels['fields']>
  health?: Partial<Revenue1Labels['health']>
  operators?: Partial<Revenue1Labels['operators']>
  risks?: Partial<Revenue1Labels['risks']>
  segments?: Partial<Revenue1Labels['segments']>
  stages?: Partial<Revenue1Labels['stages']>
}

export interface Revenue1Props
  extends GridFormatProps,
    GridLoadProps,
    GridViewProps {
  className?: string
  columnVisibility?: Revenue1ColumnVisibility
  conditions?: readonly Revenue1Condition[]
  density?: Revenue1Density
  labels?: Revenue1LabelsOverride
  onAssignOwner?: (renewalIds: string[], ownerId: string) => void
  onColumnVisibilityChange?: (visibility: Revenue1ColumnVisibility) => void
  onConditionsChange?: (conditions: Revenue1Condition[]) => void
  onCreate?: () => void
  onDensityChange?: (density: Revenue1Density) => void
  onRowAction?: (actionId: string, renewalId: string) => void
  onSaveView?: () => void
  onSelectedIdsChange?: (renewalIds: string[]) => void
  onSortChange?: (sort: Revenue1Sort | null) => void
  onStageUpdate?: (renewalIds: string[], stage: Revenue1Stage) => void
  owners?: Revenue1Person[]
  pageSize?: number
  renewals: Revenue1Renewal[]
  rowActions?: Revenue1RowAction[]
  selectedIds?: string[]
  sort?: Revenue1Sort | null
}
