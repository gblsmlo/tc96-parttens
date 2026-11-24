import { ArrowRightIcon, UserPlusIcon } from '@phosphor-icons/react'
import type {
  ActionBarContext,
  ActionBarGroup,
} from '@tc96/ui/patterns/action-bar/components/action-bar'
import type {
  DataGrid3Labels,
  DataGrid3Person,
  DataGrid3Renewal,
  DataGrid3Stage,
} from './types'

const stages: readonly DataGrid3Stage[] = [
  'preparing',
  'commercial-review',
  'legal-review',
  'signed',
]

const idsOf = ({ selectedRows }: ActionBarContext<DataGrid3Renewal>) =>
  selectedRows.map((renewal) => renewal.id)

export interface DataGrid3SelectionActionsOptions {
  labels: DataGrid3Labels
  onAssignOwner?: (renewalIds: string[], ownerId: string) => void
  onStageUpdate?: (renewalIds: string[], stage: DataGrid3Stage) => void
  owners: readonly DataGrid3Person[]
}

export function createDataGrid3SelectionActions({
  labels,
  onAssignOwner,
  onStageUpdate,
  owners,
}: DataGrid3SelectionActionsOptions): ActionBarGroup<DataGrid3Renewal>[] {
  const items: ActionBarGroup<DataGrid3Renewal>['items'] = []
  if (onAssignOwner && owners.length)
    items.push({
      icon: <UserPlusIcon aria-hidden="true" />,
      id: 'assign-owner',
      label: labels.assignOwner,
      submenu: [
        {
          items: owners.map((owner) => ({
            id: owner.id,
            label: owner.label,
            onSelect: (context) => onAssignOwner(idsOf(context), owner.id),
          })),
          label: labels.owner,
        },
      ],
    })
  if (onStageUpdate)
    items.push({
      icon: <ArrowRightIcon aria-hidden="true" />,
      id: 'move-stage',
      label: labels.moveStage,
      submenu: [
        {
          items: stages.map((stage) => ({
            id: stage,
            label: labels.stages[stage],
            onSelect: (context) => onStageUpdate(idsOf(context), stage),
          })),
          label: labels.newStage,
        },
      ],
    })
  return items.length ? [{ id: 'bulk', items }] : []
}
