import { KanbanCardActionButton } from '@tc96/parttens'
import { Menu, MenuItem, MenuPopup, MenuTrigger } from '@tc96/ui/menu'
import { EllipsisIcon } from 'lucide-react'
import type { ReactNode } from 'react'

export function KanbanCardCountAction({
  children,
  createLabel,
  label,
  viewLabel,
}: Readonly<{
  children: ReactNode
  createLabel: string
  label: string
  viewLabel: string
}>) {
  return (
    <Menu>
      <MenuTrigger render={<KanbanCardActionButton aria-label={label} />}>
        {children}
      </MenuTrigger>
      <MenuPopup align="start">
        <MenuItem>{createLabel}</MenuItem>
        <MenuItem>{viewLabel}</MenuItem>
      </MenuPopup>
    </Menu>
  )
}

export function KanbanCardMoreActions({
  items,
  label,
}: Readonly<{ items: readonly string[]; label: string }>) {
  return (
    <Menu>
      <MenuTrigger
        render={<KanbanCardActionButton aria-label={label} size="icon" />}
      >
        <EllipsisIcon aria-hidden className="size-4" />
      </MenuTrigger>
      <MenuPopup align="end">
        {items.map((item) => (
          <MenuItem key={item}>{item}</MenuItem>
        ))}
      </MenuPopup>
    </Menu>
  )
}
