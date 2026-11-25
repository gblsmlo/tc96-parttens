import {
  ArrowSquareOutIcon,
  DotsThreeIcon,
  DownloadSimpleIcon,
  PencilSimpleIcon,
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
import {
  type Documents1FieldContext,
  documents1UploadOf,
} from './documents-1-fields'
import { documents1AccessIcons } from './documents-1-options'
import type { Documents1Record } from './types'

interface Documents1RowAction {
  destructive?: boolean
  icon: ReactNode
  id: string
  label: string
  onSelect: () => void
}

export function documents1RowActionsOf(
  context: Documents1FieldContext,
  item: Documents1Record,
): Documents1RowAction[][] {
  const {
    labels,
    onDelete,
    onDownload,
    onOpen,
    onPinnedChange,
    onRename,
    onShare,
  } = context
  const upload = documents1UploadOf(item)
  if (upload?.status === 'uploading') return []
  const settled = upload === null
  const AccessIcon = documents1AccessIcons[item.access]

  const reach: Documents1RowAction[] = []
  if (settled && onOpen)
    reach.push({
      icon: <ArrowSquareOutIcon aria-hidden="true" />,
      id: 'open',
      label: labels.open,
      onSelect: () => onOpen(item.id),
    })
  if (settled && onDownload && item.kind === 'file')
    reach.push({
      icon: <DownloadSimpleIcon aria-hidden="true" />,
      id: 'download',
      label: labels.download,
      onSelect: () => onDownload(item.id),
    })

  const arrange: Documents1RowAction[] = []
  if (settled && onRename && item.canEdit !== false)
    arrange.push({
      icon: <PencilSimpleIcon aria-hidden="true" />,
      id: 'rename',
      label: labels.rename,
      onSelect: () => onRename(item.id),
    })
  if (settled && onPinnedChange)
    arrange.push({
      icon: item.pinned ? (
        <PushPinSlashIcon aria-hidden="true" />
      ) : (
        <PushPinIcon aria-hidden="true" />
      ),
      id: 'pin',
      label: item.pinned ? labels.unpin : labels.pin,
      onSelect: () => onPinnedChange(item.id, !item.pinned),
    })

  const access: Documents1RowAction[] =
    settled && onShare
      ? [
          {
            icon: <AccessIcon aria-hidden="true" />,
            id: 'share',
            label: labels.share,
            onSelect: () => onShare(item.id),
          },
        ]
      : []

  const remove: Documents1RowAction[] =
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

  return [reach, arrange, access, remove].filter((group) => group.length > 0)
}

export const hasDocuments1RowActions = (context: Documents1FieldContext) =>
  Boolean(
    context.onOpen ||
      context.onDownload ||
      context.onRename ||
      context.onPinnedChange ||
      context.onShare ||
      context.onDelete,
  )

export function Documents1RowActions({
  context,
  item,
}: Readonly<{ context: Documents1FieldContext; item: Documents1Record }>) {
  const groups = documents1RowActionsOf(context, item)
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
