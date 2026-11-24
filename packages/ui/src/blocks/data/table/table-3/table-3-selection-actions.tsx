import { ArrowRightIcon, UserPlusIcon } from '@phosphor-icons/react'
import type {
  ActionBarContext,
  ActionBarGroup,
} from '@tc96/ui/patterns/action-bar/components/action-bar'
import type {
  Table3Labels,
  Table3Person,
  Table3Renewal,
  Table3Stage,
} from './types'

const stages: readonly Table3Stage[] = [
  'preparing',
  'commercial-review',
  'legal-review',
  'signed',
]

const idsOf = ({ selectedRows }: ActionBarContext<Table3Renewal>) =>
  selectedRows.map((renewal) => renewal.id)

export interface Table3SelectionActionsOptions {
  labels: Table3Labels
  onAssignOwner?: (renewalIds: string[], ownerId: string) => void
  onStageUpdate?: (renewalIds: string[], stage: Table3Stage) => void
  owners: readonly Table3Person[]
}

export function createTable3SelectionActions({
  labels,
  onAssignOwner,
  onStageUpdate,
  owners,
}: Table3SelectionActionsOptions): ActionBarGroup<Table3Renewal>[] {
  const items: ActionBarGroup<Table3Renewal>['items'] = []
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
