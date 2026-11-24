import {
  Settings22,
  type Settings22Props,
} from '@tc96/ui/blocks/application/settings/settings-22'
import { settings22Keys } from '../fixtures/settings-22.ts'
import type { Settings22Controls } from './settings-22-controls.ts'

interface ComposedSettings22Props extends Settings22Controls {
  error?: boolean
  onRetry?: () => void
  pending?: boolean
  onActiveChange?: Settings22Props['onActiveChange']
  onCopy?: Settings22Props['onCopy']
  onCreate?: Settings22Props['onCreate']
  onKeyAction?: Settings22Props['onKeyAction']
}

const ignore = () => undefined

export const ComposedSettings22 = ({
  error,
  onRetry,
  pending,
  description,
  empty,
  newKey,
  onActiveChange = ignore,
  onCopy = ignore,
  onCreate = ignore,
  onKeyAction = ignore,
  title,
  withActions,
}: Readonly<ComposedSettings22Props>) => (
  <Settings22
    error={error}
    onRetry={onRetry}
    pending={pending}
    keys={empty ? [] : settings22Keys}
    labels={{ description, newKey, title }}
    onActiveChange={withActions ? onActiveChange : undefined}
    onCopy={withActions ? onCopy : undefined}
    onCreate={withActions ? onCreate : undefined}
    onKeyAction={withActions ? onKeyAction : undefined}
  />
)
