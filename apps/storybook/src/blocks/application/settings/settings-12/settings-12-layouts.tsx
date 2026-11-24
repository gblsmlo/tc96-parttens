import {
  Settings12,
  type Settings12Props,
} from '@tc96/blocks/application/settings/settings-12'
import { settings12Data } from '../fixtures/settings-12.ts'
import type { Settings12Controls } from './settings-12-controls.ts'

interface ComposedSettings12Props extends Settings12Controls {
  onBlockStageChangesChange?: Settings12Props['onBlockStageChangesChange']
  onCreate?: Settings12Props['onCreate']
  onNextActionAction?: Settings12Props['onNextActionAction']
  onRequiredChange?: Settings12Props['onRequiredChange']
}

const ignore = () => undefined

export const ComposedSettings12 = ({
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
}: Readonly<ComposedSettings12Props>) => (
  <Settings12
    blockStageChanges={blockStageChanges}
    labels={{ description, gatesTitle, newAction, title }}
    onBlockStageChangesChange={onBlockStageChangesChange}
    onCreate={withActions ? onCreate : undefined}
    onNextActionAction={withActions ? onNextActionAction : undefined}
    onRequiredChange={onRequiredChange}
    stages={empty ? [] : settings12Data.stages}
  />
)
