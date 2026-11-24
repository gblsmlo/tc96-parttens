import type { Icon } from '@phosphor-icons/react'
import type { SettingsLoadLabels, SettingsLoadProps } from '../shared/types'

export interface Settings10Phase {
  closed?: boolean
  id: string
  label: string
}

export interface Settings10Stage {
  icon: Icon
  id: string
  leads: number
  locked?: boolean
  name: string
  phase: string
  tone: string
}

export type Settings10Action = 'edit' | 'move-up' | 'move-down' | 'delete'

export interface Settings10Labels extends SettingsLoadLabels {
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

export interface Settings10Props extends SettingsLoadProps {
  className?: string
  labels?: Partial<Settings10Labels>
  onStageAction?: (stageId: string, action: Settings10Action) => void
  onStageCreate?: (name: string, phaseId: string) => void
  phases: Settings10Phase[]
  stages: Settings10Stage[]
}
