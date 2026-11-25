import {
  SettingsIntegration2,
  type SettingsIntegration2Props,
} from '@tc96/ui/blocks/application/settings/integration/settings-integration-2'
import { settingsIntegration2Apps } from '../../fixtures/settings-integration-2.ts'
import type { SettingsIntegration2Controls } from './settings-integration-2-controls.ts'

interface ComposedSettingsIntegration2Props
  extends SettingsIntegration2Controls {
  error?: boolean
  onRetry?: () => void
  pending?: boolean
  onConnect?: SettingsIntegration2Props['onConnect']
  onDisconnect?: SettingsIntegration2Props['onDisconnect']
}

const ignore = () => undefined

export const ComposedSettingsIntegration2 = ({
  error,
  onRetry,
  pending,
  description,
  empty,
  onConnect = ignore,
  onDisconnect = ignore,
  title,
  withActions,
}: Readonly<ComposedSettingsIntegration2Props>) => (
  <SettingsIntegration2
    error={error}
    onRetry={onRetry}
    pending={pending}
    apps={empty ? [] : settingsIntegration2Apps}
    labels={{ description, title }}
    onConnect={withActions ? onConnect : undefined}
    onDisconnect={withActions ? onDisconnect : undefined}
  />
)
