import type { SettingsLoadLabels, SettingsLoadProps } from '../../shared/types'
export interface SettingsCatalog7Reason {
  id: string
  leads: number
  name: string
}

export interface SettingsCatalog7Labels extends SettingsLoadLabels {
  actions: (name: string) => string
  allowCustomReason: string
  allowCustomReasonDescription: string
  archive: string
  archived: string
  delete: string
  description: string
  edit: string
  emptyDescription: string
  emptyTitle: string
  leadsLost: (leads: number) => string
  lostLeadsDescription: string
  lostLeadsTitle: string
  newReason: string
  requireReason: string
  requireReasonDescription: string
  restore: string
  title: string
}

export type SettingsCatalog7Action = 'edit' | 'archive' | 'restore' | 'delete'

export interface SettingsCatalog7Props extends SettingsLoadProps {
  allowCustomReason?: boolean
  archivedReasons?: SettingsCatalog7Reason[]
  className?: string
  labels?: Partial<SettingsCatalog7Labels>
  onAllowCustomReasonChange?: (checked: boolean) => void
  onCreate?: () => void
  onReasonAction?: (reasonId: string, action: SettingsCatalog7Action) => void
  onRequireReasonChange?: (checked: boolean) => void
  reasons: SettingsCatalog7Reason[]
  requireReason?: boolean
}
