import {
  Settings9,
  type Settings9Props,
} from '@tc96/blocks/application/settings/settings-9'
import { rules } from '../fixtures/settings-9.ts'
import type { Settings9Controls } from './settings-9-controls.ts'

interface ComposedSettings9Props extends Settings9Controls {
  error?: boolean
  onRetry?: () => void
  pending?: boolean
  onCreate?: Settings9Props['onCreate']
  onRuleAction?: Settings9Props['onRuleAction']
}

const ignore = () => undefined

export const ComposedSettings9 = ({
  error,
  onRetry,
  pending,
  addRule,
  description,
  empty,
  onCreate = ignore,
  onRuleAction = ignore,
  title,
  withActions,
}: Readonly<ComposedSettings9Props>) => (
  <Settings9
    error={error}
    onRetry={onRetry}
    pending={pending}
    labels={{ addRule, description, title }}
    onCreate={withActions ? onCreate : undefined}
    onRuleAction={withActions ? onRuleAction : undefined}
    rules={empty ? [] : rules}
  />
)
