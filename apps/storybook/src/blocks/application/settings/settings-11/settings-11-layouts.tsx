import {
  Settings11,
  type Settings11Props,
} from '@tc96/blocks/application/settings/settings-11'
import { settings11Groups } from '../fixtures/settings-11.ts'
import type { Settings11Controls } from './settings-11-controls.ts'

interface ComposedSettings11Props extends Settings11Controls {
  onCreate?: Settings11Props['onCreate']
  onStatusAction?: Settings11Props['onStatusAction']
}

const ignore = () => undefined

export const ComposedSettings11 = ({
  description,
  newStatus,
  onCreate = ignore,
  onStatusAction = ignore,
  title,
  withActions,
}: Readonly<ComposedSettings11Props>) => (
  <Settings11
    groups={settings11Groups}
    labels={{ description, newStatus, title }}
    onCreate={withActions ? onCreate : undefined}
    onStatusAction={withActions ? onStatusAction : undefined}
  />
)
