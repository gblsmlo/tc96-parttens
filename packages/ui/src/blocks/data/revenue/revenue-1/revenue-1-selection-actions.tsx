import { ArrowRightIcon, UserPlusIcon } from '@phosphor-icons/react'
import type {
  ActionBarContext,
  ActionBarGroup,
} from '@tc96/ui/patterns/action-bar/components/action-bar'
import type {
  Revenue1Labels,
  Revenue1Person,
  Revenue1Renewal,
  Revenue1Stage,
} from './types'

const stages: readonly Revenue1Stage[] = [
  'preparing',
  'commercial-review',
  'legal-review',
  'signed',
]

const idsOf = ({ selectedRows }: ActionBarContext<Revenue1Renewal>) =>
  selectedRows.map((renewal) => renewal.id)

export interface Revenue1SelectionActionsOptions {
  labels: Revenue1Labels
  onAssignOwner?: (renewalIds: string[], ownerId: string) => void
  onStageUpdate?: (renewalIds: string[], stage: Revenue1Stage) => void
  owners: readonly Revenue1Person[]
}

export function createRevenue1SelectionActions({
  labels,
  onAssignOwner,
  onStageUpdate,
  owners,
}: Revenue1SelectionActionsOptions): ActionBarGroup<Revenue1Renewal>[] {
  const items: ActionBarGroup<Revenue1Renewal>['items'] = []
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
