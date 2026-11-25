import {
  SettingsRolePermission1,
  type SettingsRolePermission1Props,
} from '@tc96/ui/blocks/application/settings/role-permission/settings-role-permission-1'
import { useState } from 'react'
import {
  capabilitiesByRole,
  roles,
} from '../../fixtures/settings-role-permission-1.ts'
import type { SettingsRolePermission1Controls } from './settings-role-permission-1-controls.ts'

interface ComposedSettingsRolePermission1Props
  extends SettingsRolePermission1Controls {
  error?: boolean
  onRetry?: () => void
  pending?: boolean
  onCapabilityChange?: SettingsRolePermission1Props['onCapabilityChange']
  onRoleChange?: SettingsRolePermission1Props['onRoleChange']
}

const ignore = () => undefined

export const ComposedSettingsRolePermission1 = ({
  error,
  onRetry,
  pending,
  description,
  empty,
  onCapabilityChange = ignore,
  onRoleChange = ignore,
  title,
}: Readonly<ComposedSettingsRolePermission1Props>) => {
  const [role, setRole] = useState('editor')
  const [byRole, setByRole] = useState(capabilitiesByRole)

  return (
    <SettingsRolePermission1
      error={error}
      onRetry={onRetry}
      pending={pending}
      capabilities={empty ? [] : (byRole[role] ?? [])}
      labels={{ description, title }}
      onCapabilityChange={(id, checked) => {
        setByRole((current) => ({
          ...current,
          [role]: (current[role] ?? []).map((capability) =>
            capability.id === id ? { ...capability, checked } : capability,
          ),
        }))
        onCapabilityChange(id, checked)
      }}
      onRoleChange={(next) => {
        setRole(next)
        onRoleChange(next)
      }}
      roles={roles}
      selectedRole={role}
    />
  )
}
