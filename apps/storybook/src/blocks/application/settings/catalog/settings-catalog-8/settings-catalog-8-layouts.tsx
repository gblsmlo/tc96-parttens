import {
  SettingsCatalog8,
  type SettingsCatalog8Props,
} from '@tc96/ui/blocks/application/settings/catalog/settings-catalog-8'
import {
  settingsCatalog8Accounts,
  settingsCatalog8ArchivedAccounts,
  settingsCatalog8DefaultAccountId,
} from '../../fixtures/settings-catalog-8.ts'
import type { SettingsCatalog8Controls } from './settings-catalog-8-controls.ts'

interface ComposedSettingsCatalog8Props extends SettingsCatalog8Controls {
  error?: boolean
  onRetry?: () => void
  pending?: boolean
  onAccountAction?: SettingsCatalog8Props['onAccountAction']
  onCreate?: SettingsCatalog8Props['onCreate']
}

const ignore = () => undefined

export const ComposedSettingsCatalog8 = ({
  error,
  onRetry,
  pending,
  description,
  empty,
  newAccount,
  onAccountAction = ignore,
  onCreate = ignore,
  title,
  withActions,
  withArchived,
}: Readonly<ComposedSettingsCatalog8Props>) => (
  <SettingsCatalog8
    error={error}
    onRetry={onRetry}
    pending={pending}
    accounts={empty ? [] : settingsCatalog8Accounts}
    archivedAccounts={
      withArchived ? settingsCatalog8ArchivedAccounts : undefined
    }
    defaultAccountId={settingsCatalog8DefaultAccountId}
    labels={{ description, newAccount, title }}
    onAccountAction={withActions ? onAccountAction : undefined}
    onCreate={withActions ? onCreate : undefined}
  />
)
