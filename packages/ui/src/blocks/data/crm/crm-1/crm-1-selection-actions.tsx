import { ArchiveIcon, BoxArrowUpIcon, ShapesIcon } from '@phosphor-icons/react'
import type {
  ActionBarGroup,
  ActionBarItem,
} from '@tc96/ui/patterns/action-bar/components/action-bar'
import type { Crm1Row } from './crm-1-fields'
import type { Crm1Labels, Crm1Option } from './types'

export interface Crm1SelectionActionsOptions {
  labels: Crm1Labels
  onBulkArchive?: (recordIds: string[]) => void
  onBulkSectorChange?: (recordIds: string[], sectorId: string) => void
  onBulkUnarchive?: (recordIds: string[]) => void
  onDone: () => void
  sectors: readonly Crm1Option[]
  selectedRows: readonly Crm1Row[]
}

export function createCrm1SelectionActions({
  labels,
  onBulkArchive,
  onBulkSectorChange,
  onBulkUnarchive,
  onDone,
  sectors,
  selectedRows,
}: Crm1SelectionActionsOptions): ActionBarGroup<Crm1Row>[] {
  const ids = selectedRows.map((item) => item.id)
  const idsWhere = (archived: boolean) =>
    selectedRows
      .filter((item) => item.archived === archived)
      .map((item) => item.id)
  const report = (apply: () => void) => () => {
    apply()
    onDone()
  }

  const groups: ActionBarGroup<Crm1Row>[] = []
  if (onBulkSectorChange && sectors.length)
    groups.push({
      id: 'sector',
      items: [
        {
          icon: <ShapesIcon aria-hidden="true" />,
          id: 'sector',
          label: labels.setSector,
          submenu: [
            {
              id: 'sector',
              items: sectors.map((sector) => ({
                id: sector.id,
                label: sector.label,
                onSelect: report(() => onBulkSectorChange(ids, sector.id)),
              })),
            },
          ],
        },
      ],
    })

  const archiveItems: ActionBarItem<Crm1Row>[] = []
  if (onBulkArchive) {
    const active = idsWhere(false)
    archiveItems.push({
      disabled: active.length === 0,
      icon: <ArchiveIcon aria-hidden="true" />,
      id: 'archive',
      label: labels.archive,
      onSelect: report(() => onBulkArchive(active)),
    })
  }
  if (onBulkUnarchive) {
    const archived = idsWhere(true)
    archiveItems.push({
      disabled: archived.length === 0,
      icon: <BoxArrowUpIcon aria-hidden="true" />,
      id: 'unarchive',
      label: labels.unarchive,
      onSelect: report(() => onBulkUnarchive(archived)),
    })
  }
  if (archiveItems.length) groups.push({ id: 'archive', items: archiveItems })

  return groups
}
