import {
  SettingsCatalog1,
  type SettingsCatalog1Props,
} from '@tc96/ui/blocks/application/settings/catalog/settings-catalog-1'
import { tags } from '../../fixtures/tags.ts'
import type { SettingsCatalog1Controls } from './settings-catalog-1-controls.ts'

interface ComposedSettingsCatalog1Props extends SettingsCatalog1Controls {
  error?: boolean
  onRetry?: () => void
  pending?: boolean
  onCreate?: SettingsCatalog1Props['onCreate']
  onTagAction?: SettingsCatalog1Props['onTagAction']
}

const ignore = () => undefined

export const ComposedSettingsCatalog1 = ({
  error,
  onRetry,
  pending,
  description,
  empty,
  newTag,
  onCreate = ignore,
  onTagAction = ignore,
  title,
  withActions,
}: Readonly<ComposedSettingsCatalog1Props>) => (
  <SettingsCatalog1
    error={error}
    onRetry={onRetry}
    pending={pending}
    labels={{ description, newTag, title }}
    onCreate={withActions ? onCreate : undefined}
    onTagAction={withActions ? onTagAction : undefined}
    tags={empty ? [] : tags}
  />
)
