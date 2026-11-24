import {
  Settings7,
  type Settings7Props,
} from '@tc96/ui/blocks/application/settings/settings-7'
import { tags } from '../fixtures/tags.ts'
import type { Settings7Controls } from './settings-7-controls.ts'

interface ComposedSettings7Props extends Settings7Controls {
  error?: boolean
  onRetry?: () => void
  pending?: boolean
  onCreate?: Settings7Props['onCreate']
  onTagAction?: Settings7Props['onTagAction']
}

const ignore = () => undefined

export const ComposedSettings7 = ({
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
}: Readonly<ComposedSettings7Props>) => (
  <Settings7
    error={error}
    onRetry={onRetry}
    pending={pending}
    labels={{ description, newTag, title }}
    onCreate={withActions ? onCreate : undefined}
    onTagAction={withActions ? onTagAction : undefined}
    tags={empty ? [] : tags}
  />
)
