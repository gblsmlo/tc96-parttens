import {
  SettingsIntegration6,
  type SettingsIntegration6Props,
} from '@tc96/ui/blocks/application/settings/integration/settings-integration-6'
import { settingsIntegration6Apps } from '../../fixtures/settings-integration-6.ts'
import type { SettingsIntegration6Controls } from './settings-integration-6-controls.ts'

interface ComposedSettingsIntegration6Props
  extends SettingsIntegration6Controls {
  error?: boolean
  onConnect?: SettingsIntegration6Props['onConnect']
  onDisconnect?: SettingsIntegration6Props['onDisconnect']
  onEnabledChange?: SettingsIntegration6Props['onEnabledChange']
  onRetry?: () => void
  pending?: boolean
}

const ignore = () => undefined

export const ComposedSettingsIntegration6 = ({
  error,
  onRetry,
  pending,
  description,
  empty,
  onConnect = ignore,
  onDisconnect = ignore,
  onEnabledChange = ignore,
  title,
  withActions,
}: Readonly<ComposedSettingsIntegration6Props>) => (
  <SettingsIntegration6
    apps={empty ? [] : settingsIntegration6Apps}
    error={error}
    labels={{ description, title }}
    onConnect={withActions ? onConnect : undefined}
    onDisconnect={withActions ? onDisconnect : undefined}
    onEnabledChange={withActions ? onEnabledChange : undefined}
    onRetry={onRetry}
    pending={pending}
  />
)
