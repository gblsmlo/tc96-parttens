import {
  SettingsCatalog3,
  type SettingsCatalog3Props,
} from '@tc96/ui/blocks/application/settings/catalog/settings-catalog-3'
import { rules } from '../../fixtures/settings-catalog-3.ts'
import type { SettingsCatalog3Controls } from './settings-catalog-3-controls.ts'

interface ComposedSettingsCatalog3Props extends SettingsCatalog3Controls {
  error?: boolean
  onRetry?: () => void
  pending?: boolean
  onCreate?: SettingsCatalog3Props['onCreate']
  onRuleAction?: SettingsCatalog3Props['onRuleAction']
}

const ignore = () => undefined

export const ComposedSettingsCatalog3 = ({
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
}: Readonly<ComposedSettingsCatalog3Props>) => (
  <SettingsCatalog3
    error={error}
    onRetry={onRetry}
    pending={pending}
    labels={{ addRule, description, title }}
    onCreate={withActions ? onCreate : undefined}
    onRuleAction={withActions ? onRuleAction : undefined}
    rules={empty ? [] : rules}
  />
)
