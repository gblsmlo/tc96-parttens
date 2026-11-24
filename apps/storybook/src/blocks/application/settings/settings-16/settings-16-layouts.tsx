import {
  Settings16,
  type Settings16Props,
} from '@tc96/ui/blocks/application/settings/settings-16'
import {
  settings16ArchivedCostCenters,
  settings16CostCenters,
} from '../fixtures/settings-16.ts'
import type { Settings16Controls } from './settings-16-controls.ts'

interface ComposedSettings16Props extends Settings16Controls {
  error?: boolean
  onRetry?: () => void
  pending?: boolean
  onCostCenterAction?: Settings16Props['onCostCenterAction']
  onCreate?: Settings16Props['onCreate']
}

const ignore = () => undefined

export const ComposedSettings16 = ({
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
}: Readonly<ComposedSettings16Props>) => (
  <Settings16
    error={error}
    onRetry={onRetry}
    pending={pending}
    archivedCostCenters={
      withArchived ? settings16ArchivedCostCenters : undefined
    }
    costCenters={empty ? [] : settings16CostCenters}
    labels={{ description, newCostCenter, title }}
    onCostCenterAction={withActions ? onCostCenterAction : undefined}
    onCreate={withActions ? onCreate : undefined}
  />
)
