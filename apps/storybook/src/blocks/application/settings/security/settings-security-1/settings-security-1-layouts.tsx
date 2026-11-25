import {
  SettingsSecurity1,
  type SettingsSecurity1Props,
} from '@tc96/ui/blocks/application/settings/security/settings-security-1'
import { useState } from 'react'
import { privacyControls } from '../../fixtures/settings-security-1.ts'
import type { SettingsSecurity1Controls } from './settings-security-1-controls.ts'

interface ComposedSettingsSecurity1Props extends SettingsSecurity1Controls {
  error?: boolean
  onRetry?: () => void
  pending?: boolean
  onAction?: SettingsSecurity1Props['onAction']
  onCheckedChange?: SettingsSecurity1Props['onCheckedChange']
}

const ignore = () => undefined

export const ComposedSettingsSecurity1 = ({
  error,
  onRetry,
  pending,
  description,
  empty,
  onAction = ignore,
  onCheckedChange = ignore,
  title,
  withActions,
}: Readonly<ComposedSettingsSecurity1Props>) => {
  const [controls, setControls] = useState(privacyControls)

  return (
    <SettingsSecurity1
      error={error}
      onRetry={onRetry}
      pending={pending}
      controls={empty ? [] : controls}
      labels={{ description, title }}
      onAction={withActions ? onAction : undefined}
      onCheckedChange={(id, checked) => {
        setControls((current) =>
          current.map((control) =>
            control.id === id ? { ...control, checked } : control,
          ),
        )
        onCheckedChange(id, checked)
      }}
    />
  )
}
