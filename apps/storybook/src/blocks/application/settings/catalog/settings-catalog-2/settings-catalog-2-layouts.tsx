import {
  SettingsCatalog2,
  type SettingsCatalog2Props,
} from '@tc96/ui/blocks/application/settings/catalog/settings-catalog-2'
import type { SettingsCatalog2Controls } from './settings-catalog-2-controls.ts'

interface ComposedSettingsCatalog2Props extends SettingsCatalog2Controls {
  error?: boolean
  onRetry?: () => void
  pending?: boolean
  onEnabledChange?: SettingsCatalog2Props['onEnabledChange']
}

export const ComposedSettingsCatalog2 = ({
  error,
  onRetry,
  pending,
  enabled,
  description,
  enable,
  onEnabledChange,
  title,
}: Readonly<ComposedSettingsCatalog2Props>) => (
  <SettingsCatalog2
    error={error}
    onRetry={onRetry}
    pending={pending}
    enabled={enabled}
    labels={{ description, enable, title }}
    onEnabledChange={onEnabledChange}
  />
)
