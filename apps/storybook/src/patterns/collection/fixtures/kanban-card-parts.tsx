import { DotsThreeIcon } from '@phosphor-icons/react'
import { Button } from '@tc96/ui/button'
import { Menu, MenuItem, MenuPopup, MenuTrigger } from '@tc96/ui/menu'
import {
  KanbanCardAction,
  KanbanCardActionButton,
  KanbanCardField,
  KanbanCardFieldLabel,
  KanbanCardFieldValue,
} from '@tc96/ui/patterns'
import type { ReactElement, ReactNode } from 'react'

export interface CardMenuItem {
  label: string
  onSelect?: () => void
}

function CardMenuItems({
  items,
}: Readonly<{ items: readonly CardMenuItem[] }>) {
  return items.map((item) => (
    <MenuItem key={item.label} onClick={item.onSelect}>
      {item.label}
    </MenuItem>
  ))
}

export function CardMenu({
  items,
  label,
}: Readonly<{ items: readonly CardMenuItem[]; label: string }>): ReactElement {
  return (
    <KanbanCardAction>
      <Menu>
        <MenuTrigger
          render={<KanbanCardActionButton aria-label={label} size="icon" />}
        >
          <DotsThreeIcon aria-hidden className="size-4" />
        </MenuTrigger>
        <MenuPopup align="end">
          <CardMenuItems items={items} />
        </MenuPopup>
      </Menu>
    </KanbanCardAction>
  )
}

export function CardCountMenu({
  count,
  icon,
  items,
  label,
}: Readonly<{
  count: number
  icon: ReactNode
  items: readonly CardMenuItem[]
  label: string
}>): ReactElement {
  return (
    <Menu>
      <MenuTrigger
        render={<Button aria-label={label} size="xs" variant="secondary" />}
      >
        {icon}
        <span>{count}</span>
      </MenuTrigger>
      <MenuPopup align="start">
        <CardMenuItems items={items} />
      </MenuPopup>
    </Menu>
  )
}

export function CardField({
  children,
  icon,
  interactive = false,
  label,
}: Readonly<{
  children: ReactNode
  icon: ReactNode
  interactive?: boolean
  label: string
}>): ReactElement {
  return (
    <KanbanCardField>
      <KanbanCardFieldLabel>
        {icon}
        <span className="truncate">{label}</span>
      </KanbanCardFieldLabel>
      <KanbanCardFieldValue interactive={interactive}>
        {children}
      </KanbanCardFieldValue>
    </KanbanCardField>
  )
}
