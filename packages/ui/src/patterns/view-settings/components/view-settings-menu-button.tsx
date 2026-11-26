'use client'

import type { Icon as PhosphorIcon } from '@phosphor-icons/react'
import { Button } from '@tc96/ui/button'
import {
  Menu,
  MenuPopup,
  MenuRadioGroup,
  MenuRadioItem,
  MenuTrigger,
} from '@tc96/ui/menu'
import { ToolbarButton } from '@tc96/ui/toolbar'
import type { ReactNode } from 'react'

export interface ViewSettingsMenuButtonProps {
  children: ReactNode
  icon: PhosphorIcon
  label: string
  trailing?: ReactNode
}

export function ViewSettingsMenuButton({
  children,
  icon: Icon,
  label,
  trailing,
}: Readonly<ViewSettingsMenuButtonProps>) {
  return (
    <Menu>
      <MenuTrigger
        render={
          <ToolbarButton
            render={
              <Button
                aria-label={label}
                size={trailing ? 'default' : 'icon'}
                type="button"
                variant="ghost"
              />
            }
          />
        }
      >
        <Icon aria-hidden="true" />
        {trailing}
      </MenuTrigger>
      <MenuPopup align="end">{children}</MenuPopup>
    </Menu>
  )
}
