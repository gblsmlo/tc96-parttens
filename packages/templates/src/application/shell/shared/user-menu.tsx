'use client'

import { Avatar, AvatarFallback, AvatarImage } from '@tc96/elements/avatar'
import { getInitials } from '@tc96/helpers/initials'
import {
  Menu,
  MenuGroup,
  MenuGroupLabel,
  MenuItem,
  MenuPopup,
  MenuRadioGroup,
  MenuRadioItem,
  MenuSeparator,
  MenuTrigger,
} from '@tc96/ui/menu'
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@tc96/ui/sidebar'
import { ChevronsUpDownIcon, LogOutIcon } from 'lucide-react'
import type { ReactElement } from 'react'
import type { ShellAction, ShellLabels, ShellTheme, ShellUser } from './types'

export interface UserAvatarProps {
  user: ShellUser
}

export function UserAvatar({ user }: Readonly<UserAvatarProps>): ReactElement {
  return (
    <Avatar>
      {user.avatarUrl ? <AvatarImage alt="" src={user.avatarUrl} /> : null}
      <AvatarFallback className="text-foreground">
        {getInitials(user.name)}
      </AvatarFallback>
    </Avatar>
  )
}

export interface UserMenuProps {
  compact?: boolean
  labels: ShellLabels
  onSignOut?: () => void
  onThemeChange?: (theme: ShellTheme) => void
  theme?: ShellTheme
  user: ShellUser
  userActions?: ShellAction[]
}

export function UserMenu({
  compact = false,
  labels,
  onSignOut,
  onThemeChange,
  theme,
  user,
  userActions,
}: Readonly<UserMenuProps>): ReactElement {
  const { isMobile } = useSidebar()
  const themes: { label: string; value: ShellTheme }[] = [
    { label: labels.themeLight, value: 'light' },
    { label: labels.themeDark, value: 'dark' },
    { label: labels.themeSystem, value: 'system' },
  ]

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <Menu>
          <MenuTrigger
            render={
              <SidebarMenuButton
                className={compact ? 'h-8 p-0' : undefined}
                size="lg"
                tooltip={
                  compact
                    ? { children: labels.account, hidden: false }
                    : labels.account
                }
              />
            }
          >
            <UserAvatar user={user} />
            <span className="grid flex-1 text-start text-sm leading-tight">
              <span className="truncate font-medium">{user.name}</span>
              <span className="truncate text-xs">{user.email}</span>
            </span>
            <ChevronsUpDownIcon className="ms-auto" />
          </MenuTrigger>
          <MenuPopup
            align="end"
            className="min-w-56"
            side={isMobile ? 'bottom' : 'right'}
          >
            <MenuGroup>
              <MenuGroupLabel>{labels.account}</MenuGroupLabel>
              {userActions?.map((action) => (
                <MenuItem
                  key={action.label}
                  onClick={action.onSelect}
                  variant={action.variant}
                >
                  {action.icon}
                  {action.label}
                </MenuItem>
              ))}
            </MenuGroup>
            {theme && onThemeChange ? (
              <>
                <MenuSeparator />
                <MenuGroup>
                  <MenuGroupLabel>{labels.theme}</MenuGroupLabel>
                  <MenuRadioGroup
                    onValueChange={(value) =>
                      onThemeChange(value as ShellTheme)
                    }
                    value={theme}
                  >
                    {themes.map((option) => (
                      <MenuRadioItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuRadioItem>
                    ))}
                  </MenuRadioGroup>
                </MenuGroup>
              </>
            ) : null}
            {onSignOut ? (
              <>
                <MenuSeparator />
                <MenuItem onClick={onSignOut}>
                  <LogOutIcon />
                  {labels.signOut}
                </MenuItem>
              </>
            ) : null}
          </MenuPopup>
        </Menu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
