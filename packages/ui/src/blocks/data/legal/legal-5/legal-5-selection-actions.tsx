import {
  ArchiveIcon,
  SignpostIcon,
  TagIcon,
  UserIcon,
} from '@phosphor-icons/react'
import type {
  ActionBarGroup,
  ActionBarItem,
} from '@tc96/ui/patterns/action-bar/components/action-bar'
import type {
  Legal5Labels,
  Legal5Option,
  Legal5Person,
  Legal5Phase,
  Legal5Record,
} from './types'

export interface Legal5SelectionActionsOptions {
  labels: Legal5Labels
  onBulkArchive?: (recordIds: string[]) => void
  onBulkOwnerChange?: (recordIds: string[], ownerId: string) => void
  onBulkPhaseChange?: (recordIds: string[], phaseId: string) => void
  onBulkTagAdd?: (recordIds: string[], tagId: string) => void
  onDone: () => void
  owners: readonly Legal5Person[]
  phases: readonly Legal5Phase[]
  selectedRows: readonly Legal5Record[]
  tags: readonly Legal5Option[]
}

export function createLegal5SelectionActions({
  labels,
  onBulkArchive,
  onBulkOwnerChange,
  onBulkPhaseChange,
  onBulkTagAdd,
  onDone,
  owners,
  phases,
  selectedRows,
  tags,
}: Legal5SelectionActionsOptions): ActionBarGroup<Legal5Record>[] {
  const ids = selectedRows.map((item) => item.id)
  const kinds = new Set(selectedRows.map((item) => item.kind))
  const [onlyKind] = kinds.size === 1 ? kinds : []
  const choices = (
    options: readonly Legal5Option[],
    apply: (recordIds: string[], value: string) => void,
  ): ActionBarItem<Legal5Record>[] =>
    options.map((option) => ({
      id: option.id,
      label: option.label,
      onSelect: () => {
        apply(ids, option.id)
        onDone()
      },
    }))

  const items: ActionBarItem<Legal5Record>[] = []
  const offeredPhases = phases.filter(
    (phase) => !phase.kind || phase.kind === onlyKind,
  )
  if (onBulkPhaseChange && onlyKind && offeredPhases.length)
    items.push({
      icon: <SignpostIcon aria-hidden="true" />,
      id: 'phase',
      label: labels.columns.phase,
      submenu: [
        { id: 'phase', items: choices(offeredPhases, onBulkPhaseChange) },
      ],
    })
  if (onBulkOwnerChange && owners.length)
    items.push({
      icon: <UserIcon aria-hidden="true" />,
      id: 'owner',
      label: labels.columns.owner,
      submenu: [{ id: 'owner', items: choices(owners, onBulkOwnerChange) }],
    })
  if (onBulkTagAdd && tags.length)
    items.push({
      icon: <TagIcon aria-hidden="true" />,
      id: 'tags',
      label: labels.columns.tags,
      submenu: [{ id: 'tags', items: choices(tags, onBulkTagAdd) }],
    })

  return [
    ...(items.length ? [{ id: 'bulk', items }] : []),
    ...(onBulkArchive
      ? [
          {
            id: 'archive',
            items: [
              {
                icon: <ArchiveIcon aria-hidden="true" />,
                id: 'archive',
                label: labels.archive,
                onSelect: () => {
                  onBulkArchive(ids)
                  onDone()
                },
                variant: 'destructive' as const,
              },
            ],
          },
        ]
      : []),
  ]
}
