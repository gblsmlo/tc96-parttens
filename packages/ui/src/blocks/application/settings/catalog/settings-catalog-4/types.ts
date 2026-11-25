import type { Icon } from '@phosphor-icons/react'
import type { SettingsLoadLabels, SettingsLoadProps } from '../../shared/types'

export interface SettingsCatalog4Phase {
  closed?: boolean
  id: string
  label: string
}

export interface SettingsCatalog4Stage {
  icon: Icon
  id: string
  leads: number
  locked?: boolean
  name: string
  phase: string
  tone: string
}

export type SettingsCatalog4Action = 'edit' | 'move-up' | 'move-down' | 'delete'

export interface SettingsCatalog4Labels extends SettingsLoadLabels {
  actions: (name: string) => string
  cancel: string
  createStage: string
  delete: string
  description: string
  dialogAncestor: string
  dialogTitle: string
  edit: string
  moveDown: string
  moveUp: string
  newStage: string
  phase: string
  stageDescription: (
    leads: number,
    phaseLabel: string,
    closed: boolean,
  ) => string | undefined
  stageName: string
  title: string
}

export interface SettingsCatalog4Props extends SettingsLoadProps {
  className?: string
  labels?: Partial<SettingsCatalog4Labels>
  onStageAction?: (stageId: string, action: SettingsCatalog4Action) => void
  onStageCreate?: (name: string, phaseId: string) => void
  phases: SettingsCatalog4Phase[]
  stages: SettingsCatalog4Stage[]
}
