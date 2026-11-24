import type { SettingsLoadLabels, SettingsLoadProps } from '../shared/types'
export interface Settings18Capability {
  checked: boolean
  description: string
  id: string
  title: string
}

export interface Settings18Role {
  label: string
  value: string
}

export interface Settings18Labels extends SettingsLoadLabels {
  description: string
  emptyDescription: string
  emptyTitle: string
  role: string
  title: string
}

export interface Settings18Props extends SettingsLoadProps {
  capabilities: Settings18Capability[]
  className?: string
  labels?: Partial<Settings18Labels>
  onCapabilityChange?: (capabilityId: string, checked: boolean) => void
  onRoleChange?: (role: string) => void
  roles: Settings18Role[]
  selectedRole: string
}
