import { DotsThreeVerticalIcon } from '@phosphor-icons/react'
import { Button } from '@tc96/ui/button'
import { Menu, MenuItem, MenuPopup, MenuTrigger } from '@tc96/ui/menu'
import type { CardMenuAction } from './types'

export function CardMenu({
  actions,
  label,
  onSelect,
}: Readonly<{
  actions: readonly CardMenuAction[]
  label: string
  onSelect: (actionId: string) => void
}>) {
  return (
    <Menu>
      <MenuTrigger
        render={
          <Button aria-label={label} size="icon-sm" variant="ghost">
            <DotsThreeVerticalIcon weight="bold" />
          </Button>
        }
      />
      <MenuPopup align="end">
        {actions.map((action) => (
          <MenuItem key={action.id} onClick={() => onSelect(action.id)}>
            {action.label}
          </MenuItem>
        ))}
      </MenuPopup>
    </Menu>
  )
}
