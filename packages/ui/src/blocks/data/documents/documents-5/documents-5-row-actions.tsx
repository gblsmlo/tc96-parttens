import {
  ArrowSquareOutIcon,
  DotsThreeIcon,
  DownloadSimpleIcon,
  PushPinIcon,
  PushPinSlashIcon,
  TrashIcon,
} from '@phosphor-icons/react'
import { Button } from '@tc96/ui/button'
import {
  Menu,
  MenuItem,
  MenuPopup,
  MenuSeparator,
  MenuTrigger,
} from '@tc96/ui/menu'
import { Fragment, type ReactNode } from 'react'
import type { Documents5FieldContext } from './documents-5-fields'
import type { Documents5Record } from './types'

interface Documents5RowAction {
  destructive?: boolean
  icon: ReactNode
  id: string
  label: string
  onSelect: () => void
}

export function documents5RowActionsOf(
  context: Documents5FieldContext,
  item: Documents5Record,
): Documents5RowAction[][] {
  const { labels, onDelete, onDownload, onOpen, onPinnedChange } = context

  const reach: Documents5RowAction[] = []
  if (onOpen)
    reach.push({
      icon: <ArrowSquareOutIcon aria-hidden="true" />,
      id: 'open',
      label: labels.open,
      onSelect: () => onOpen(item.id),
    })
  if (onDownload && item.kind === 'file')
    reach.push({
      icon: <DownloadSimpleIcon aria-hidden="true" />,
      id: 'download',
      label: labels.download,
      onSelect: () => onDownload(item.id),
    })

  const arrange: Documents5RowAction[] = onPinnedChange
    ? [
        {
          icon: item.pinned ? (
            <PushPinSlashIcon aria-hidden="true" />
          ) : (
            <PushPinIcon aria-hidden="true" />
          ),
          id: 'pin',
          label: item.pinned ? labels.unpin : labels.pin,
          onSelect: () => onPinnedChange(item.id, !item.pinned),
        },
      ]
    : []

  const remove: Documents5RowAction[] =
    onDelete && item.canDelete !== false
      ? [
          {
            destructive: true,
            icon: <TrashIcon aria-hidden="true" />,
            id: 'delete',
            label: labels.delete,
            onSelect: () => onDelete(item.id),
          },
        ]
      : []

  return [reach, arrange, remove].filter((group) => group.length > 0)
}

export const hasDocuments5RowActions = (context: Documents5FieldContext) =>
  Boolean(
    context.onOpen ||
      context.onDownload ||
      context.onPinnedChange ||
      context.onDelete,
  )

export function Documents5RowActions({
  context,
  item,
}: Readonly<{ context: Documents5FieldContext; item: Documents5Record }>) {
  const groups = documents5RowActionsOf(context, item)
  if (groups.length === 0) return null
  return (
    <Menu>
      <MenuTrigger
        aria-label={context.labels.actionsFor(item.name)}
        render={<Button size="icon-sm" type="button" variant="ghost" />}
      >
        <DotsThreeIcon aria-hidden="true" />
      </MenuTrigger>
      <MenuPopup align="end">
        {groups.map((group, index) => (
          <Fragment key={group[0]?.id}>
            {index > 0 ? <MenuSeparator /> : null}
            {group.map((action) => (
              <MenuItem
                key={action.id}
                onClick={action.onSelect}
                variant={action.destructive ? 'destructive' : undefined}
              >
                {action.icon}
                {action.label}
              </MenuItem>
            ))}
          </Fragment>
        ))}
      </MenuPopup>
    </Menu>
  )
}
