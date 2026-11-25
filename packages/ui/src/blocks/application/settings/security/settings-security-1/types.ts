import type { SettingsLoadLabels, SettingsLoadProps } from '../../shared/types'
export type SettingsSecurity1Plan = 'pro' | 'beta'

export interface SettingsSecurity1Control {
  actionLabel?: string
  checked?: boolean
  description: string
  id: string
  plan?: SettingsSecurity1Plan
  title: string
}

export interface SettingsSecurity1Labels extends SettingsLoadLabels {
  beta: string
  description: string
  pro: string
  title: string
}

export interface SettingsSecurity1Props extends SettingsLoadProps {
  className?: string
  controls: SettingsSecurity1Control[]
  labels?: Partial<SettingsSecurity1Labels>
  onAction?: (controlId: string) => void
  onCheckedChange?: (controlId: string, checked: boolean) => void
}
