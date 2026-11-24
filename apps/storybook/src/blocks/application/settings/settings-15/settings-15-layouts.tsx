import {
  Settings15,
  type Settings15Props,
} from '@tc96/blocks/application/settings/settings-15'
import {
  settings15ArchivedCategories,
  settings15Categories,
} from '../fixtures/settings-15.ts'
import type { Settings15Controls } from './settings-15-controls.ts'

interface ComposedSettings15Props extends Settings15Controls {
  onCategoryAction?: Settings15Props['onCategoryAction']
  onCreate?: Settings15Props['onCreate']
}

const ignore = () => undefined

export const ComposedSettings15 = ({
  description,
  empty,
  newCategory,
  onCategoryAction = ignore,
  onCreate = ignore,
  title,
  withActions,
  withArchived,
}: Readonly<ComposedSettings15Props>) => (
  <Settings15
    archivedCategories={withArchived ? settings15ArchivedCategories : undefined}
    categories={empty ? [] : settings15Categories}
    labels={{ description, newCategory, title }}
    onCategoryAction={withActions ? onCategoryAction : undefined}
    onCreate={withActions ? onCreate : undefined}
  />
)
