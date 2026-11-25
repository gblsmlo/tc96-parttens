import {
  SettingsCatalog9,
  type SettingsCatalog9Props,
} from '@tc96/ui/blocks/application/settings/catalog/settings-catalog-9'
import {
  settingsCatalog9ArchivedCategories,
  settingsCatalog9Categories,
} from '../../fixtures/settings-catalog-9.ts'
import type { SettingsCatalog9Controls } from './settings-catalog-9-controls.ts'

interface ComposedSettingsCatalog9Props extends SettingsCatalog9Controls {
  error?: boolean
  onRetry?: () => void
  pending?: boolean
  onCategoryAction?: SettingsCatalog9Props['onCategoryAction']
  onCreate?: SettingsCatalog9Props['onCreate']
}

const ignore = () => undefined

export const ComposedSettingsCatalog9 = ({
  error,
  onRetry,
  pending,
  description,
  empty,
  newCategory,
  onCategoryAction = ignore,
  onCreate = ignore,
  title,
  withActions,
  withArchived,
}: Readonly<ComposedSettingsCatalog9Props>) => (
  <SettingsCatalog9
    error={error}
    onRetry={onRetry}
    pending={pending}
    archivedCategories={
      withArchived ? settingsCatalog9ArchivedCategories : undefined
    }
    categories={empty ? [] : settingsCatalog9Categories}
    labels={{ description, newCategory, title }}
    onCategoryAction={withActions ? onCategoryAction : undefined}
    onCreate={withActions ? onCreate : undefined}
  />
)
