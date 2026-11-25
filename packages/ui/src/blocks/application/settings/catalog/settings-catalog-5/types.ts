import type { Icon } from '@phosphor-icons/react'
import type { SettingsLoadLabels, SettingsLoadProps } from '../../shared/types'

export interface SettingsCatalog5Status {
  icon: Icon
  id: string
  label: string
  projects?: number
  toneClassName?: string
}

export interface SettingsCatalog5Group {
  id: string
  statuses: SettingsCatalog5Status[]
  title: string
}

export interface SettingsCatalog5Labels extends SettingsLoadLabels {
  actions: (name: string) => string
  delete: string
  description: string
  edit: string
  newStatus: string
  projects: (count: number) => string
  title: string
}

export type SettingsCatalog5Action = 'edit' | 'delete'

export interface SettingsCatalog5Props extends SettingsLoadProps {
  className?: string
  groups: SettingsCatalog5Group[]
  labels?: Partial<SettingsCatalog5Labels>
  onCreate?: () => void
  onStatusAction?: (statusId: string, action: SettingsCatalog5Action) => void
}
