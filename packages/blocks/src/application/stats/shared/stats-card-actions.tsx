import { DotsThreeIcon } from '@phosphor-icons/react'
import { Button } from '@tc96/ui/button'
import { Menu, MenuItem, MenuPopup, MenuTrigger } from '@tc96/ui/menu'
import type { StatsAction } from './types'

export interface StatsCardActionsProps {
  actions: StatsAction[]
  label: string
  onAction: (actionId: string) => void
}

export function StatsCardActions({
  actions,
  label,
  onAction,
}: Readonly<StatsCardActionsProps>) {
  if (actions.length === 0) return null

  return (
    <Menu>
      <MenuTrigger
        aria-label={label}
        render={<Button size="icon-sm" variant="ghost" />}
      >
        <DotsThreeIcon aria-hidden="true" />
      </MenuTrigger>
      <MenuPopup align="end">
        {actions.map((action) => (
          <MenuItem
            key={action.id}
            onClick={() => onAction(action.id)}
            variant={action.destructive ? 'destructive' : undefined}
          >
            {action.label}
          </MenuItem>
        ))}
      </MenuPopup>
    </Menu>
  )
}
