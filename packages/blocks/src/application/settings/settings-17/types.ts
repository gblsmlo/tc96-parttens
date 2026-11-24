import type { SettingsLoadLabels, SettingsLoadProps } from '../shared/types'
export type Settings17Plan = 'pro' | 'beta'

export interface Settings17Control {
  actionLabel?: string
  checked?: boolean
  description: string
  id: string
  plan?: Settings17Plan
  title: string
}

export interface Settings17Labels extends SettingsLoadLabels {
  beta: string
  description: string
  pro: string
  title: string
}

export interface Settings17Props extends SettingsLoadProps {
  className?: string
  controls: Settings17Control[]
  labels?: Partial<Settings17Labels>
  onAction?: (controlId: string) => void
  onCheckedChange?: (controlId: string, checked: boolean) => void
}
