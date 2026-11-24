import {
  Settings13,
  type Settings13Props,
} from '@tc96/blocks/application/settings/settings-13'
import { settings13Data } from '../fixtures/settings-13.ts'
import type { Settings13Controls } from './settings-13-controls.ts'

interface ComposedSettings13Props extends Settings13Controls {
  error?: boolean
  onRetry?: () => void
  pending?: boolean
  onAllowCustomReasonChange?: Settings13Props['onAllowCustomReasonChange']
  onCreate?: Settings13Props['onCreate']
  onReasonAction?: Settings13Props['onReasonAction']
  onRequireReasonChange?: Settings13Props['onRequireReasonChange']
}

const ignore = () => undefined

export const ComposedSettings13 = ({
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
}: Readonly<ComposedSettings13Props>) => (
  <Settings13
    error={error}
    onRetry={onRetry}
    pending={pending}
    allowCustomReason={allowCustomReason}
    archivedReasons={withArchived ? settings13Data.archivedReasons : []}
    labels={{ description, newReason, title }}
    onAllowCustomReasonChange={onAllowCustomReasonChange}
    onCreate={withActions ? onCreate : undefined}
    onReasonAction={withActions ? onReasonAction : undefined}
    onRequireReasonChange={onRequireReasonChange}
    reasons={empty ? [] : settings13Data.reasons}
    requireReason={requireReason}
  />
)
