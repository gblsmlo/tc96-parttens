import {
  Settings17,
  type Settings17Props,
} from '@tc96/ui/blocks/application/settings/settings-17'
import { useState } from 'react'
import { privacyControls } from '../fixtures/settings-17.ts'
import type { Settings17Controls } from './settings-17-controls.ts'

interface ComposedSettings17Props extends Settings17Controls {
  error?: boolean
  onRetry?: () => void
  pending?: boolean
  onAction?: Settings17Props['onAction']
  onCheckedChange?: Settings17Props['onCheckedChange']
}

const ignore = () => undefined

export const ComposedSettings17 = ({
  error,
  onRetry,
  pending,
  description,
  empty,
  onAction = ignore,
  onCheckedChange = ignore,
  title,
  withActions,
}: Readonly<ComposedSettings17Props>) => {
  const [controls, setControls] = useState(privacyControls)

  return (
    <Settings17
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
