import type { SettingsLoadLabels, SettingsLoadProps } from '../../shared/types'
export interface SettingsCatalog10CostCenter {
  entries: number
  id: string
  name: string
}

export interface SettingsCatalog10Labels extends SettingsLoadLabels {
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

export type SettingsCatalog10Action = 'edit' | 'archive' | 'restore'

export interface SettingsCatalog10Props extends SettingsLoadProps {
  archivedCostCenters?: SettingsCatalog10CostCenter[]
  className?: string
  costCenters: SettingsCatalog10CostCenter[]
  labels?: Partial<SettingsCatalog10Labels>
  onCostCenterAction?: (
    costCenterId: string,
    action: SettingsCatalog10Action,
  ) => void
  onCreate?: () => void
}
