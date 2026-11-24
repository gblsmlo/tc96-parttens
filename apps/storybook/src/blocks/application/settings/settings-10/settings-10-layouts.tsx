import {
  Settings10,
  type Settings10Props,
} from '@tc96/ui/blocks/application/settings/settings-10'
import { phases, stages } from '../fixtures/settings-10.ts'
import type { Settings10Controls } from './settings-10-controls.ts'

interface ComposedSettings10Props extends Settings10Controls {
  error?: boolean
  onRetry?: () => void
  pending?: boolean
  onStageAction?: Settings10Props['onStageAction']
  onStageCreate?: Settings10Props['onStageCreate']
}

const ignore = () => undefined

export const ComposedSettings10 = ({
  error,
  onRetry,
  pending,
  description,
  newStage,
  onStageAction = ignore,
  onStageCreate = ignore,
  title,
  withActions,
}: Readonly<ComposedSettings10Props>) => (
  <Settings10
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
