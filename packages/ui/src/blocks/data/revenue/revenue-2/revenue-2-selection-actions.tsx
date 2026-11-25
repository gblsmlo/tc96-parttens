import { ArrowRightIcon, UserPlusIcon } from '@phosphor-icons/react'
import type {
  ActionBarContext,
  ActionBarGroup,
} from '@tc96/ui/patterns/action-bar/components/action-bar'
import type {
  Revenue2Labels,
  Revenue2Person,
  Revenue2Renewal,
  Revenue2Stage,
} from './types'

const stages: readonly Revenue2Stage[] = [
  'preparing',
  'commercial-review',
  'legal-review',
  'signed',
]

const idsOf = ({ selectedRows }: ActionBarContext<Revenue2Renewal>) =>
  selectedRows.map((renewal) => renewal.id)

export interface Revenue2SelectionActionsOptions {
  labels: Revenue2Labels
  onAssignOwner?: (renewalIds: string[], ownerId: string) => void
  onStageUpdate?: (renewalIds: string[], stage: Revenue2Stage) => void
  owners: readonly Revenue2Person[]
}

export function createRevenue2SelectionActions({
  labels,
  onAssignOwner,
  onStageUpdate,
  owners,
}: Revenue2SelectionActionsOptions): ActionBarGroup<Revenue2Renewal>[] {
  const items: ActionBarGroup<Revenue2Renewal>['items'] = []
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
