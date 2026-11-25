import {
  SettingsIntegration7,
  type SettingsIntegration7Props,
} from '@tc96/ui/blocks/application/settings/integration/settings-integration-7'
import { settingsIntegration7Apps } from '../../fixtures/settings-integration-7.ts'
import type { SettingsIntegration7Controls } from './settings-integration-7-controls.ts'

interface ComposedSettingsIntegration7Props
  extends SettingsIntegration7Controls {
  error?: boolean
  onAction?: SettingsIntegration7Props['onAction']
  onBuild?: SettingsIntegration7Props['onBuild']
  onRetry?: () => void
  pending?: boolean
}

const ignore = () => undefined

export const ComposedSettingsIntegration7 = ({
  error,
  onRetry,
  pending,
  description,
  empty,
  onAction = ignore,
  onBuild = ignore,
  title,
  withActions,
  withBuild,
}: Readonly<ComposedSettingsIntegration7Props>) => (
  <SettingsIntegration7
    apps={empty ? [] : settingsIntegration7Apps}
    error={error}
    labels={{ description, title }}
    onAction={withActions ? onAction : undefined}
    onBuild={withBuild ? onBuild : undefined}
    onRetry={onRetry}
    pending={pending}
  />
)
