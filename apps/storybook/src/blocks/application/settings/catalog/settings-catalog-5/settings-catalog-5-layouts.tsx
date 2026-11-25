import {
  SettingsCatalog5,
  type SettingsCatalog5Props,
} from '@tc96/ui/blocks/application/settings/catalog/settings-catalog-5'
import { settingsCatalog5Groups } from '../../fixtures/settings-catalog-5.ts'
import type { SettingsCatalog5Controls } from './settings-catalog-5-controls.ts'

interface ComposedSettingsCatalog5Props extends SettingsCatalog5Controls {
  error?: boolean
  onRetry?: () => void
  pending?: boolean
  onCreate?: SettingsCatalog5Props['onCreate']
  onStatusAction?: SettingsCatalog5Props['onStatusAction']
}

const ignore = () => undefined

export const ComposedSettingsCatalog5 = ({
  error,
  onRetry,
  pending,
  description,
  newStatus,
  onCreate = ignore,
  onStatusAction = ignore,
  title,
  withActions,
}: Readonly<ComposedSettingsCatalog5Props>) => (
  <SettingsCatalog5
    error={error}
    onRetry={onRetry}
    pending={pending}
    groups={settingsCatalog5Groups}
    labels={{ description, newStatus, title }}
    onCreate={withActions ? onCreate : undefined}
    onStatusAction={withActions ? onStatusAction : undefined}
  />
)
