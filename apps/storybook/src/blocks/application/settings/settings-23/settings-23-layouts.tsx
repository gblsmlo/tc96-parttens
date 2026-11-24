import {
  Settings23,
  type Settings23Props,
} from '@tc96/ui/blocks/application/settings/settings-23'
import {
  settings23Invoices,
  settings23Plan,
  settings23Usage,
} from '../fixtures/settings-23.ts'
import type { Settings23Controls } from './settings-23-controls.ts'

interface ComposedSettings23Props extends Settings23Controls {
  error?: boolean
  onRetry?: () => void
  pending?: boolean
  onChangePlan?: Settings23Props['onChangePlan']
  onDownload?: Settings23Props['onDownload']
}

const ignore = () => undefined

export const ComposedSettings23 = ({
  error,
  onRetry,
  pending,
  changePlan,
  emptyInvoices,
  onChangePlan = ignore,
  onDownload = ignore,
  title,
  withActions,
}: Readonly<ComposedSettings23Props>) => (
  <Settings23
    error={error}
    onRetry={onRetry}
    pending={pending}
    invoices={emptyInvoices ? [] : settings23Invoices}
    labels={{ changePlan, title }}
    onChangePlan={withActions ? onChangePlan : undefined}
    onDownload={withActions ? onDownload : undefined}
    plan={settings23Plan}
    usage={settings23Usage}
  />
)
