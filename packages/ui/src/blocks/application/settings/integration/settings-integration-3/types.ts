import type { SettingsLoadLabels, SettingsLoadProps } from '../../shared/types'
export interface SettingsIntegration3Key {
  active: boolean
  createdAt: string
  id: string
  lastUsed?: string
  maskedToken: string
  name: string
}

export interface SettingsIntegration3Labels extends SettingsLoadLabels {
  actions: (name: string) => string
  columnActions: string
  columnCreated: string
  columnLastUsed: string
  columnName: string
  columnStatus: string
  columnToken: string
  copy: (name: string) => string
  description: string
  emptyDescription: string
  emptyTitle: string
  neverUsed: string
  newKey: string
  revoke: string
  rotate: string
  status: (name: string) => string
  title: string
}

export type SettingsIntegration3Action = 'rotate' | 'revoke'

export interface SettingsIntegration3Props extends SettingsLoadProps {
  className?: string
  keys: SettingsIntegration3Key[]
  labels?: Partial<SettingsIntegration3Labels>
  onActiveChange?: (keyId: string, active: boolean) => void
  onCopy?: (keyId: string) => void
  onCreate?: () => void
  onKeyAction?: (keyId: string, action: SettingsIntegration3Action) => void
}
