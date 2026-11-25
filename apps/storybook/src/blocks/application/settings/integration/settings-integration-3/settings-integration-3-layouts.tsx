import {
  SettingsIntegration3,
  type SettingsIntegration3Props,
} from '@tc96/ui/blocks/application/settings/integration/settings-integration-3'
import { settingsIntegration3Keys } from '../../fixtures/settings-integration-3.ts'
import type { SettingsIntegration3Controls } from './settings-integration-3-controls.ts'

interface ComposedSettingsIntegration3Props
  extends SettingsIntegration3Controls {
  error?: boolean
  onRetry?: () => void
  pending?: boolean
  onActiveChange?: SettingsIntegration3Props['onActiveChange']
  onCopy?: SettingsIntegration3Props['onCopy']
  onCreate?: SettingsIntegration3Props['onCreate']
  onKeyAction?: SettingsIntegration3Props['onKeyAction']
}

const ignore = () => undefined

export const ComposedSettingsIntegration3 = ({
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
}: Readonly<ComposedSettingsIntegration3Props>) => (
  <SettingsIntegration3
    error={error}
    onRetry={onRetry}
    pending={pending}
    keys={empty ? [] : settingsIntegration3Keys}
    labels={{ description, newKey, title }}
    onActiveChange={withActions ? onActiveChange : undefined}
    onCopy={withActions ? onCopy : undefined}
    onCreate={withActions ? onCreate : undefined}
    onKeyAction={withActions ? onKeyAction : undefined}
  />
)
