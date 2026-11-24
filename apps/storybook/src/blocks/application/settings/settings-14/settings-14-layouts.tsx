import {
  Settings14,
  type Settings14Props,
} from '@tc96/blocks/application/settings/settings-14'
import {
  settings14Accounts,
  settings14ArchivedAccounts,
  settings14DefaultAccountId,
} from '../fixtures/settings-14.ts'
import type { Settings14Controls } from './settings-14-controls.ts'

interface ComposedSettings14Props extends Settings14Controls {
  onAccountAction?: Settings14Props['onAccountAction']
  onCreate?: Settings14Props['onCreate']
}

const ignore = () => undefined

export const ComposedSettings14 = ({
  description,
  empty,
  newAccount,
  onAccountAction = ignore,
  onCreate = ignore,
  title,
  withActions,
  withArchived,
}: Readonly<ComposedSettings14Props>) => (
  <Settings14
    accounts={empty ? [] : settings14Accounts}
    archivedAccounts={withArchived ? settings14ArchivedAccounts : undefined}
    defaultAccountId={settings14DefaultAccountId}
    labels={{ description, newAccount, title }}
    onAccountAction={withActions ? onAccountAction : undefined}
    onCreate={withActions ? onCreate : undefined}
  />
)
