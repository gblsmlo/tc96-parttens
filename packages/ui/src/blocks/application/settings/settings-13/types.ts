import type { SettingsLoadLabels, SettingsLoadProps } from '../shared/types'
export interface Settings13Reason {
  id: string
  leads: number
  name: string
}

export interface Settings13Labels extends SettingsLoadLabels {
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

export type Settings13Action = 'edit' | 'archive' | 'restore' | 'delete'

export interface Settings13Props extends SettingsLoadProps {
  allowCustomReason?: boolean
  archivedReasons?: Settings13Reason[]
  className?: string
  labels?: Partial<Settings13Labels>
  onAllowCustomReasonChange?: (checked: boolean) => void
  onCreate?: () => void
  onReasonAction?: (reasonId: string, action: Settings13Action) => void
  onRequireReasonChange?: (checked: boolean) => void
  reasons: Settings13Reason[]
  requireReason?: boolean
}
