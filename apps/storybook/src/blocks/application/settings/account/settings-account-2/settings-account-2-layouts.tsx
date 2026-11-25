import {
  SettingsAccount2,
  type SettingsAccount2Props,
} from '@tc96/ui/blocks/application/settings/account/settings-account-2'
import {
  settingsAccount2Invoices,
  settingsAccount2Plan,
  settingsAccount2Usage,
} from '../../fixtures/settings-account-2.ts'
import type { SettingsAccount2Controls } from './settings-account-2-controls.ts'

interface ComposedSettingsAccount2Props extends SettingsAccount2Controls {
  error?: boolean
  onRetry?: () => void
  pending?: boolean
  onChangePlan?: SettingsAccount2Props['onChangePlan']
  onDownload?: SettingsAccount2Props['onDownload']
}

const ignore = () => undefined

export const ComposedSettingsAccount2 = ({
  error,
  onRetry,
  pending,
  changePlan,
  emptyInvoices,
  onChangePlan = ignore,
  onDownload = ignore,
  title,
  withActions,
}: Readonly<ComposedSettingsAccount2Props>) => (
  <SettingsAccount2
    error={error}
    onRetry={onRetry}
    pending={pending}
    invoices={emptyInvoices ? [] : settingsAccount2Invoices}
    labels={{ changePlan, title }}
    onChangePlan={withActions ? onChangePlan : undefined}
    onDownload={withActions ? onDownload : undefined}
    plan={settingsAccount2Plan}
    usage={settingsAccount2Usage}
  />
)
