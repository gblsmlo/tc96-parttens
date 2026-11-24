import {
  Settings8,
  type Settings8Props,
} from '@tc96/blocks/application/settings/settings-8'
import type { Settings8Controls } from './settings-8-controls.ts'

interface ComposedSettings8Props extends Settings8Controls {
  error?: boolean
  onRetry?: () => void
  pending?: boolean
  onEnabledChange?: Settings8Props['onEnabledChange']
}

export const ComposedSettings8 = ({
  error,
  onRetry,
  pending,
  enabled,
  description,
  enable,
  onEnabledChange,
  title,
}: Readonly<ComposedSettings8Props>) => (
  <Settings8
    error={error}
    onRetry={onRetry}
    pending={pending}
    enabled={enabled}
    labels={{ description, enable, title }}
    onEnabledChange={onEnabledChange}
  />
)
