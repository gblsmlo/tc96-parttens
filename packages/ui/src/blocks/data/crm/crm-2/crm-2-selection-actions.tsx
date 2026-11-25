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
  activeCrm2Stages,
  canArchiveCrm2Lead,
  canEditCrm2Lead,
  canMoveCrm2Lead,
} from './crm-2-options'
import type { Crm2Labels, Crm2Lead, Crm2Person, Crm2Stage } from './types'

export interface Crm2SelectionActionsOptions {
  labels: Crm2Labels
  onBulkArchive?: (leadIds: string[]) => void
  onBulkOwnerChange?: (leadIds: string[], ownerId: string) => void
  onBulkStageChange?: (leadIds: string[], stageId: string) => void
  onDone: () => void
  owners: readonly Crm2Person[]
  selectedRows: readonly Crm2Lead[]
  stages: readonly Crm2Stage[]
}

const idsOf = (leads: readonly Crm2Lead[]) => leads.map((lead) => lead.id)

export function createCrm2SelectionActions({
  labels,
  onBulkArchive,
  onBulkOwnerChange,
  onBulkStageChange,
  onDone,
  owners,
  selectedRows,
  stages,
}: Crm2SelectionActionsOptions): ActionBarGroup<Crm2Lead>[] {
  const editable = selectedRows.filter(canEditCrm2Lead)
  if (editable.length === 0) return []
  const movable = idsOf(editable.filter(canMoveCrm2Lead))
  const archivable = idsOf(editable.filter(canArchiveCrm2Lead))
  const stageOptions = activeCrm2Stages(stages)
  const items: ActionBarItem<Crm2Lead>[] = []

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
