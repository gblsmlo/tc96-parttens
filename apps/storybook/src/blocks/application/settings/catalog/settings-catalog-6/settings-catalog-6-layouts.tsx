import {
  SettingsCatalog6,
  type SettingsCatalog6Props,
} from '@tc96/ui/blocks/application/settings/catalog/settings-catalog-6'
import { settingsCatalog6Data } from '../../fixtures/settings-catalog-6.ts'
import type { SettingsCatalog6Controls } from './settings-catalog-6-controls.ts'

interface ComposedSettingsCatalog6Props extends SettingsCatalog6Controls {
  error?: boolean
  onRetry?: () => void
  pending?: boolean
  onBlockStageChangesChange?: SettingsCatalog6Props['onBlockStageChangesChange']
  onCreate?: SettingsCatalog6Props['onCreate']
  onNextActionAction?: SettingsCatalog6Props['onNextActionAction']
  onRequiredChange?: SettingsCatalog6Props['onRequiredChange']
}

const ignore = () => undefined

export const ComposedSettingsCatalog6 = ({
  error,
  onRetry,
  pending,
  blockStageChanges,
  description,
  empty,
  gatesTitle,
  newAction,
  onBlockStageChangesChange = ignore,
  onCreate = ignore,
  onNextActionAction = ignore,
  onRequiredChange = ignore,
  title,
  withActions,
}: Readonly<ComposedSettingsCatalog6Props>) => (
  <SettingsCatalog6
    error={error}
    onRetry={onRetry}
    pending={pending}
    blockStageChanges={blockStageChanges}
    labels={{ description, gatesTitle, newAction, title }}
    onBlockStageChangesChange={onBlockStageChangesChange}
    onCreate={withActions ? onCreate : undefined}
    onNextActionAction={withActions ? onNextActionAction : undefined}
    onRequiredChange={onRequiredChange}
    stages={empty ? [] : settingsCatalog6Data.stages}
  />
)
