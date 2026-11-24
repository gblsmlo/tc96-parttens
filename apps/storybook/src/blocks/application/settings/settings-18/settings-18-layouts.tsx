import {
  Settings18,
  type Settings18Props,
} from '@tc96/blocks/application/settings/settings-18'
import { useState } from 'react'
import { capabilitiesByRole, roles } from '../fixtures/settings-18.ts'
import type { Settings18Controls } from './settings-18-controls.ts'

interface ComposedSettings18Props extends Settings18Controls {
  onCapabilityChange?: Settings18Props['onCapabilityChange']
  onRoleChange?: Settings18Props['onRoleChange']
}

const ignore = () => undefined

export const ComposedSettings18 = ({
  description,
  empty,
  onCapabilityChange = ignore,
  onRoleChange = ignore,
  title,
}: Readonly<ComposedSettings18Props>) => {
  const [role, setRole] = useState('editor')
  const [byRole, setByRole] = useState(capabilitiesByRole)

  return (
    <Settings18
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
