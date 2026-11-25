import {
  SettingsCatalog7,
  type SettingsCatalog7Props,
} from '@tc96/ui/blocks/application/settings/catalog/settings-catalog-7'
import { settingsCatalog7Data } from '../../fixtures/settings-catalog-7.ts'
import type { SettingsCatalog7Controls } from './settings-catalog-7-controls.ts'

interface ComposedSettingsCatalog7Props extends SettingsCatalog7Controls {
  error?: boolean
  onRetry?: () => void
  pending?: boolean
  onAllowCustomReasonChange?: SettingsCatalog7Props['onAllowCustomReasonChange']
  onCreate?: SettingsCatalog7Props['onCreate']
  onReasonAction?: SettingsCatalog7Props['onReasonAction']
  onRequireReasonChange?: SettingsCatalog7Props['onRequireReasonChange']
}

const ignore = () => undefined

export const ComposedSettingsCatalog7 = ({
  error,
  onRetry,
  pending,
  allowCustomReason,
  description,
  empty,
  newReason,
  onAllowCustomReasonChange = ignore,
  onCreate = ignore,
  onReasonAction = ignore,
  onRequireReasonChange = ignore,
  requireReason,
  title,
  withActions,
  withArchived,
}: Readonly<ComposedSettingsCatalog7Props>) => (
  <SettingsCatalog7
    error={error}
    onRetry={onRetry}
    pending={pending}
    allowCustomReason={allowCustomReason}
    archivedReasons={withArchived ? settingsCatalog7Data.archivedReasons : []}
    labels={{ description, newReason, title }}
    onAllowCustomReasonChange={onAllowCustomReasonChange}
    onCreate={withActions ? onCreate : undefined}
    onReasonAction={withActions ? onReasonAction : undefined}
    onRequireReasonChange={onRequireReasonChange}
    reasons={empty ? [] : settingsCatalog7Data.reasons}
    requireReason={requireReason}
  />
)
