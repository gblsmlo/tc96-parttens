import {
  SettingsIntegration5,
  type SettingsIntegration5Props,
} from '@tc96/ui/blocks/application/settings/integration/settings-integration-5'
import { settingsIntegration5Apps } from '../../fixtures/settings-integration-5.ts'
import type { SettingsIntegration5Controls } from './settings-integration-5-controls.ts'

interface ComposedSettingsIntegration5Props
  extends SettingsIntegration5Controls {
  error?: boolean
  onChannelChange?: SettingsIntegration5Props['onChannelChange']
  onConnect?: SettingsIntegration5Props['onConnect']
  onDisconnect?: SettingsIntegration5Props['onDisconnect']
  onRetry?: () => void
  pending?: boolean
}

const ignore = () => undefined

export const ComposedSettingsIntegration5 = ({
  error,
  onRetry,
  pending,
  description,
  empty,
  onChannelChange = ignore,
  onConnect = ignore,
  onDisconnect = ignore,
  title,
  withActions,
}: Readonly<ComposedSettingsIntegration5Props>) => (
  <SettingsIntegration5
    apps={empty ? [] : settingsIntegration5Apps}
    error={error}
    labels={{ description, title }}
    onChannelChange={withActions ? onChannelChange : undefined}
    onConnect={withActions ? onConnect : undefined}
    onDisconnect={withActions ? onDisconnect : undefined}
    onRetry={onRetry}
    pending={pending}
  />
)
