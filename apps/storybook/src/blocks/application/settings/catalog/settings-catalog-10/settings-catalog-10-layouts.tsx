import {
  SettingsCatalog10,
  type SettingsCatalog10Props,
} from '@tc96/ui/blocks/application/settings/catalog/settings-catalog-10'
import {
  settingsCatalog10ArchivedCostCenters,
  settingsCatalog10CostCenters,
} from '../../fixtures/settings-catalog-10.ts'
import type { SettingsCatalog10Controls } from './settings-catalog-10-controls.ts'

interface ComposedSettingsCatalog10Props extends SettingsCatalog10Controls {
  error?: boolean
  onRetry?: () => void
  pending?: boolean
  onCostCenterAction?: SettingsCatalog10Props['onCostCenterAction']
  onCreate?: SettingsCatalog10Props['onCreate']
}

const ignore = () => undefined

export const ComposedSettingsCatalog10 = ({
  error,
  onRetry,
  pending,
  description,
  empty,
  newCostCenter,
  onCostCenterAction = ignore,
  onCreate = ignore,
  title,
  withActions,
  withArchived,
}: Readonly<ComposedSettingsCatalog10Props>) => (
  <SettingsCatalog10
    error={error}
    onRetry={onRetry}
    pending={pending}
    archivedCostCenters={
      withArchived ? settingsCatalog10ArchivedCostCenters : undefined
    }
    costCenters={empty ? [] : settingsCatalog10CostCenters}
    labels={{ description, newCostCenter, title }}
    onCostCenterAction={withActions ? onCostCenterAction : undefined}
    onCreate={withActions ? onCreate : undefined}
  />
)
