import {
  DownloadSimpleIcon,
  PushPinIcon,
  TrashIcon,
} from '@phosphor-icons/react'
import type {
  ActionBarGroup,
  ActionBarItem,
} from '@tc96/ui/patterns/action-bar/components/action-bar'
import type { Documents5Labels, Documents5Record } from './types'

export interface Documents5SelectionActionsOptions {
  labels: Documents5Labels
  onBulkDelete?: (recordIds: string[]) => void
  onBulkDownload?: (recordIds: string[]) => void
  onBulkPinnedChange?: (recordIds: string[], pinned: boolean) => void
  onDone: () => void
  selectedRows: readonly Documents5Record[]
}

export function createDocuments5SelectionActions({
  labels,
  onBulkDelete,
  onBulkDownload,
  onBulkPinnedChange,
  onDone,
  selectedRows,
}: Documents5SelectionActionsOptions): ActionBarGroup<Documents5Record>[] {
  const fileIds = selectedRows
    .filter((item) => item.kind === 'file')
    .map((item) => item.id)
  const unpinnedIds = selectedRows
    .filter((item) => !item.pinned)
    .map((item) => item.id)
  const deletableIds = selectedRows
    .filter((item) => item.canDelete !== false)
    .map((item) => item.id)
  const apply =
    (report: () => void): ActionBarItem<Documents5Record>['onSelect'] =>
    () => {
      onDone()
      report()
    }

  const items: ActionBarItem<Documents5Record>[] = []
  if (onBulkDownload)
    items.push({
      disabled: fileIds.length === 0,
      icon: <DownloadSimpleIcon aria-hidden="true" />,
      id: 'download',
      label: labels.download,
      onSelect: apply(() => onBulkDownload(fileIds)),
    })
  if (onBulkPinnedChange)
    items.push({
      disabled: unpinnedIds.length === 0,
      icon: <PushPinIcon aria-hidden="true" />,
      id: 'pin',
      label: labels.pin,
      onSelect: apply(() => onBulkPinnedChange(unpinnedIds, true)),
    })
  if (onBulkDelete)
    items.push({
      disabled: deletableIds.length === 0,
      icon: <TrashIcon aria-hidden="true" />,
      id: 'delete',
      label: labels.delete,
      onSelect: apply(() => onBulkDelete(deletableIds)),
      variant: 'destructive',
    })

  return items.length ? [{ id: 'bulk', items }] : []
}
