import {
  SettingsIntegration4,
  type SettingsIntegration4Props,
} from '@tc96/ui/blocks/application/settings/integration/settings-integration-4'
import { settingsIntegration4Sections } from '../../fixtures/settings-integration-4.ts'
import type { SettingsIntegration4Controls } from './settings-integration-4-controls.ts'

interface ComposedSettingsIntegration4Props
  extends SettingsIntegration4Controls {
  error?: boolean
  onAction?: SettingsIntegration4Props['onAction']
  onCreate?: SettingsIntegration4Props['onCreate']
  onRetry?: () => void
  pending?: boolean
}

const ignore = () => undefined

export const ComposedSettingsIntegration4 = ({
  error,
  onRetry,
  pending,
  description,
  empty,
  onAction = ignore,
  onCreate = ignore,
  title,
  withActions,
  withCreate,
}: Readonly<ComposedSettingsIntegration4Props>) => (
  <SettingsIntegration4
    error={error}
    labels={{ description, title }}
    onAction={withActions ? onAction : undefined}
    onCreate={withCreate ? onCreate : undefined}
    onRetry={onRetry}
    pending={pending}
    sections={empty ? [] : settingsIntegration4Sections}
  />
)
