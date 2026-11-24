export interface Settings16CostCenter {
  entries: number
  id: string
  name: string
}

export interface Settings16Labels {
  actions: (name: string) => string
  archive: string
  archived: string
  description: string
  edit: string
  emptyDescription: string
  emptyTitle: string
  entries: (count: number) => string
  newCostCenter: string
  restore: string
  title: string
}

export type Settings16Action = 'edit' | 'archive' | 'restore'

export interface Settings16Props {
  archivedCostCenters?: Settings16CostCenter[]
  className?: string
  costCenters: Settings16CostCenter[]
  labels?: Partial<Settings16Labels>
  onCostCenterAction?: (costCenterId: string, action: Settings16Action) => void
  onCreate?: () => void
}
