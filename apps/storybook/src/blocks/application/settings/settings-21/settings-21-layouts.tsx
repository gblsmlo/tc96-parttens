import {
  Settings21,
  type Settings21Props,
} from '@tc96/blocks/application/settings/settings-21'
import { settings21Apps } from '../fixtures/settings-21.ts'
import type { Settings21Controls } from './settings-21-controls.ts'

interface ComposedSettings21Props extends Settings21Controls {
  onConnect?: Settings21Props['onConnect']
  onDisconnect?: Settings21Props['onDisconnect']
}

const ignore = () => undefined

export const ComposedSettings21 = ({
  description,
  empty,
  onConnect = ignore,
  onDisconnect = ignore,
  title,
  withActions,
}: Readonly<ComposedSettings21Props>) => (
  <Settings21
    apps={empty ? [] : settings21Apps}
    labels={{ description, title }}
    onConnect={withActions ? onConnect : undefined}
    onDisconnect={withActions ? onDisconnect : undefined}
  />
)
