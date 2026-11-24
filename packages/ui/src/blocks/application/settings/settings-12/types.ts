import type { SettingsLoadLabels, SettingsLoadProps } from '../shared/types'
export type Settings12ActionType =
  | 'call'
  | 'email'
  | 'meeting'
  | 'proposal'
  | 'follow-up'

export interface Settings12NextAction {
  id: string
  required: boolean
  title: string
  type: Settings12ActionType
}

export interface Settings12Stage {
  actions: Settings12NextAction[]
  id: string
  name: string
}

export interface Settings12Labels extends SettingsLoadLabels {
  actionType: (type: Settings12ActionType) => string
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

export type Settings12Action = 'edit' | 'delete'

export interface Settings12Props extends SettingsLoadProps {
  blockStageChanges?: boolean
  className?: string
  labels?: Partial<Settings12Labels>
  onBlockStageChangesChange?: (checked: boolean) => void
  onCreate?: () => void
  onNextActionAction?: (actionId: string, action: Settings12Action) => void
  onRequiredChange?: (actionId: string, required: boolean) => void
  stages: Settings12Stage[]
}
