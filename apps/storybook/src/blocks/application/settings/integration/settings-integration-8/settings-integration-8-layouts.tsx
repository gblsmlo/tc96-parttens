import {
  SettingsIntegration8,
  type SettingsIntegration8Props,
} from '@tc96/ui/blocks/application/settings/integration/settings-integration-8'
import { settingsIntegration8Items } from '../../fixtures/settings-integration-8.ts'
import type { SettingsIntegration8Controls } from './settings-integration-8-controls.ts'

interface ComposedSettingsIntegration8Props
  extends SettingsIntegration8Controls {
  error?: boolean
  onAllPausedChange?: SettingsIntegration8Props['onAllPausedChange']
  onCopyKey?: SettingsIntegration8Props['onCopyKey']
  onEnabledChange?: SettingsIntegration8Props['onEnabledChange']
  onRetry?: () => void
  pending?: boolean
}

const ignore = () => undefined

export const ComposedSettingsIntegration8 = ({
  allPaused,
  description,
  empty,
  error,
  onAllPausedChange = ignore,
  onCopyKey = ignore,
  onEnabledChange = ignore,
  onRetry,
  pending,
  title,
  withActions,
}: Readonly<ComposedSettingsIntegration8Props>) => (
  <SettingsIntegration8
    allPaused={allPaused}
    error={error}
    integrations={empty ? [] : settingsIntegration8Items}
    labels={{ description, title }}
    onAllPausedChange={withActions ? onAllPausedChange : undefined}
    onCopyKey={withActions ? onCopyKey : undefined}
    onEnabledChange={withActions ? onEnabledChange : undefined}
    onRetry={onRetry}
    pending={pending}
  />
)
