import type { SettingsLoadLabels, SettingsLoadProps } from '../../shared/types'
export type SettingsCatalog6ActionType =
  | 'call'
  | 'email'
  | 'meeting'
  | 'proposal'
  | 'follow-up'

export interface SettingsCatalog6NextAction {
  id: string
  required: boolean
  title: string
  type: SettingsCatalog6ActionType
}

export interface SettingsCatalog6Stage {
  actions: SettingsCatalog6NextAction[]
  id: string
  name: string
}

export interface SettingsCatalog6Labels extends SettingsLoadLabels {
  actionType: (type: SettingsCatalog6ActionType) => string
  actions: (title: string) => string
  blockStageChanges: string
  blockStageChangesDescription: string
  delete: string
  description: string
  edit: string
  emptyDescription: string
  emptyStage: string
  emptyTitle: string
  gatesTitle: string
  leaving: (stage: string) => string
  newAction: string
  required: (title: string) => string
  title: string
}

export type SettingsCatalog6Action = 'edit' | 'delete'

export interface SettingsCatalog6Props extends SettingsLoadProps {
  blockStageChanges?: boolean
  className?: string
  labels?: Partial<SettingsCatalog6Labels>
  onBlockStageChangesChange?: (checked: boolean) => void
  onCreate?: () => void
  onNextActionAction?: (
    actionId: string,
    action: SettingsCatalog6Action,
  ) => void
  onRequiredChange?: (actionId: string, required: boolean) => void
  stages: SettingsCatalog6Stage[]
}
