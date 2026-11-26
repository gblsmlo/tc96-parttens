import {
  ArchiveIcon,
  ArrowsLeftRightIcon,
  UserIcon,
} from '@phosphor-icons/react'
import type {
  ActionBarGroup,
  ActionBarItem,
} from '@tc96/ui/patterns/action-bar/components/action-bar'
import {
  activeCrm3Stages,
  canArchiveCrm3Lead,
  canEditCrm3Lead,
  canMoveCrm3Lead,
} from './crm-3-options'
import type { Crm3Labels, Crm3Lead, Crm3Person, Crm3Stage } from './types'

export interface Crm3SelectionActionsOptions {
  labels: Crm3Labels
  onBulkArchive?: (leadIds: string[]) => void
  onBulkOwnerChange?: (leadIds: string[], ownerId: string) => void
  onBulkStageChange?: (leadIds: string[], stageId: string) => void
  onDone: () => void
  owners: readonly Crm3Person[]
  selectedRows: readonly Crm3Lead[]
  stages: readonly Crm3Stage[]
}

const idsOf = (leads: readonly Crm3Lead[]) => leads.map((lead) => lead.id)

export function createCrm3SelectionActions({
  labels,
  onBulkArchive,
  onBulkOwnerChange,
  onBulkStageChange,
  onDone,
  owners,
  selectedRows,
  stages,
}: Crm3SelectionActionsOptions): ActionBarGroup<Crm3Lead>[] {
  const editable = selectedRows.filter(canEditCrm3Lead)
  if (editable.length === 0) return []
  const movable = idsOf(editable.filter(canMoveCrm3Lead))
  const archivable = idsOf(editable.filter(canArchiveCrm3Lead))
  const stageOptions = activeCrm3Stages(stages)
  const items: ActionBarItem<Crm3Lead>[] = []

  if (onBulkStageChange && stageOptions.length)
    items.push({
      disabled: movable.length === 0,
      icon: <ArrowsLeftRightIcon aria-hidden="true" />,
      id: 'stage',
      label: labels.moveToStage,
      submenu: [
        {
          id: 'stage',
          items: stageOptions.map((stage) => ({
            id: stage.id,
            label: stage.label,
            onSelect: () => {
              onBulkStageChange(movable, stage.id)
              onDone()
            },
          })),
        },
      ],
    })
  if (onBulkOwnerChange && owners.length)
    items.push({
      icon: <UserIcon aria-hidden="true" />,
      id: 'owner',
      label: labels.columns.owner,
      submenu: [
        {
          id: 'owner',
          items: owners.map((owner) => ({
            id: owner.id,
            label: owner.label,
            onSelect: () => {
              onBulkOwnerChange(idsOf(editable), owner.id)
              onDone()
            },
          })),
        },
      ],
    })
  if (onBulkArchive)
    items.push({
      disabled: archivable.length === 0,
      icon: <ArchiveIcon aria-hidden="true" />,
      id: 'archive',
      label: labels.archive,
      onSelect: () => {
        onBulkArchive(archivable)
        onDone()
      },
    })

  return items.length ? [{ id: 'bulk', items }] : []
}
