import {
  SettingsCatalog4,
  type SettingsCatalog4Props,
} from '@tc96/ui/blocks/application/settings/catalog/settings-catalog-4'
import { phases, stages } from '../../fixtures/settings-catalog-4.ts'
import type { SettingsCatalog4Controls } from './settings-catalog-4-controls.ts'

interface ComposedSettingsCatalog4Props extends SettingsCatalog4Controls {
  error?: boolean
  onRetry?: () => void
  pending?: boolean
  onStageAction?: SettingsCatalog4Props['onStageAction']
  onStageCreate?: SettingsCatalog4Props['onStageCreate']
}

const ignore = () => undefined

export const ComposedSettingsCatalog4 = ({
  error,
  onRetry,
  pending,
  description,
  newStage,
  onStageAction = ignore,
  onStageCreate = ignore,
  title,
  withActions,
}: Readonly<ComposedSettingsCatalog4Props>) => (
  <SettingsCatalog4
    error={error}
    onRetry={onRetry}
    pending={pending}
    labels={{ description, newStage, title }}
    onStageAction={withActions ? onStageAction : undefined}
    onStageCreate={withActions ? onStageCreate : undefined}
    phases={phases}
    stages={stages}
  />
)
