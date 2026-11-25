import type { SettingsLoadLabels, SettingsLoadProps } from '../../shared/types'
export interface SettingsRolePermission1Capability {
  checked: boolean
  description: string
  id: string
  title: string
}

export interface SettingsRolePermission1Role {
  label: string
  value: string
}

export interface SettingsRolePermission1Labels extends SettingsLoadLabels {
  description: string
  emptyDescription: string
  emptyTitle: string
  role: string
  title: string
}

export interface SettingsRolePermission1Props extends SettingsLoadProps {
  capabilities: SettingsRolePermission1Capability[]
  className?: string
  labels?: Partial<SettingsRolePermission1Labels>
  onCapabilityChange?: (capabilityId: string, checked: boolean) => void
  onRoleChange?: (role: string) => void
  roles: SettingsRolePermission1Role[]
  selectedRole: string
}
