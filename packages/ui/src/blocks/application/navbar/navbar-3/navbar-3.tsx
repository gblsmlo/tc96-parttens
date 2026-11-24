'use client'

import {
  ArrowDownIcon,
  ArrowElbowDownLeftIcon,
  ArrowUpIcon,
  BellIcon,
  MagnifyingGlassIcon,
} from '@phosphor-icons/react'
import { Avatar, AvatarFallback, AvatarImage } from '@tc96/ui/avatar'
import { Badge } from '@tc96/ui/badge'
import { Button } from '@tc96/ui/button'
import {
  Command,
  CommandCollection,
  CommandDialog,
  CommandDialogPopup,
  CommandDialogTrigger,
  CommandEmpty,
  CommandFooter,
  CommandGroup,
  CommandGroupLabel,
  CommandInput,
  CommandItem,
  CommandList,
  CommandPanel,
} from '@tc96/ui/command'
import { getInitials } from '@tc96/ui/helpers/initials'
import { Kbd, KbdGroup } from '@tc96/ui/kbd'
import {
  Menu,
  MenuGroup,
  MenuGroupLabel,
  MenuItem,
  MenuPopup,
  MenuTrigger,
} from '@tc96/ui/menu'
import {
  Popover,
  PopoverPopup,
  PopoverTitle,
  PopoverTrigger,
} from '@tc96/ui/popover'
import { cn } from '@tc96/utils'
import { type ReactElement, useEffect, useMemo, useState } from 'react'
import { defaultNavbar3Labels } from './labels'
import type { Navbar3Props, Navbar3RouteGroup } from './types'

interface CommandRoute {
  label: string
  value: string
}

interface CommandRouteGroup {
  items: CommandRoute[]
  value: string
}

const toCommandGroups = (groups: Navbar3RouteGroup[]): CommandRouteGroup[] =>
  groups
    .map((group) => ({
      items: group.routes.map((route) => ({
        label: route.label,
        value: route.href,
      })),
      value: group.label,
    }))
    .filter((group) => group.items.length)

export function Navbar3({
  className,
  labels,
  logo,
  notifications,
  onNavigate,
  onNotificationSelect,
  onNotificationsOpenChange,
  onUserAction,
  routes,
  user,
  userActions,
}: Readonly<Navbar3Props>): ReactElement {
  const texts = { ...defaultNavbar3Labels, ...labels }
  const [searchOpen, setSearchOpen] = useState(false)
  const groups = useMemo(() => toCommandGroups(routes), [routes])
  const unread = notifications.filter((item) => item.unread).length

  useEffect(() => {
    const toggle = (event: KeyboardEvent) => {
      if (event.key.toLowerCase() === 'k' && (event.metaKey || event.ctrlKey)) {
        event.preventDefault()
        setSearchOpen((current) => !current)
      }
    }
    document.addEventListener('keydown', toggle)
    return () => document.removeEventListener('keydown', toggle)
  }, [])

  return (
    <header
      className={cn(
        'grid h-14 w-full grid-cols-[auto_1fr_auto] items-center gap-3 border-b bg-background px-4 md:grid-cols-[1fr_minmax(0,28rem)_1fr]',
        className,
      )}
    >
      <div className="flex items-center">{logo}</div>
      <CommandDialog onOpenChange={setSearchOpen} open={searchOpen}>
        <CommandDialogTrigger
          render={
            <Button
              aria-label={texts.search}
              className="w-full justify-start"
              variant="outline"
            />
          }
        >
          <MagnifyingGlassIcon aria-hidden="true" />
          <span className="flex-1 truncate text-start text-muted-foreground">
            {texts.searchPlaceholder}
          </span>
          <KbdGroup className="hidden sm:inline-flex">
            <Kbd>⌘</Kbd>
            <Kbd>K</Kbd>
          </KbdGroup>
        </CommandDialogTrigger>
        <CommandDialogPopup aria-label={texts.search}>
          <Command items={groups}>
            <CommandInput
              aria-label={texts.search}
              placeholder={texts.searchPlaceholder}
            />
            <CommandPanel>
              <CommandEmpty>{texts.searchEmpty}</CommandEmpty>
              <CommandList>
                {(group: CommandRouteGroup) => (
                  <CommandGroup items={group.items} key={group.value}>
                    <CommandGroupLabel>{group.value}</CommandGroupLabel>
                    <CommandCollection>
                      {(route: CommandRoute) => (
                        <CommandItem
                          key={route.value}
                          onClick={() => {
                            setSearchOpen(false)
                            onNavigate?.(route.value)
                          }}
                          value={route}
                        >
                          {route.label}
                        </CommandItem>
                      )}
                    </CommandCollection>
                  </CommandGroup>
                )}
              </CommandList>
            </CommandPanel>
            <CommandFooter>
              <span className="flex items-center gap-2">
                <KbdGroup>
                  <Kbd>
                    <ArrowUpIcon aria-hidden="true" />
                  </Kbd>
                  <Kbd>
                    <ArrowDownIcon aria-hidden="true" />
                  </Kbd>
                </KbdGroup>
                {texts.searchNavigate}
              </span>
              <span className="flex items-center gap-2">
                <Kbd>
                  <ArrowElbowDownLeftIcon aria-hidden="true" />
                </Kbd>
                {texts.searchOpen}
              </span>
              <span className="flex items-center gap-2">
                <Kbd>Esc</Kbd>
                {texts.searchClose}
              </span>
            </CommandFooter>
          </Command>
        </CommandDialogPopup>
      </CommandDialog>
      <div className="flex items-center justify-end gap-1">
        <Popover onOpenChange={onNotificationsOpenChange}>
          <PopoverTrigger
            render={
              <Button
                aria-label={texts.notificationsTrigger(unread)}
                className="relative"
                size="icon"
                variant="ghost"
              />
            }
          >
            <BellIcon aria-hidden="true" />
            {unread ? (
              <Badge aria-hidden className="absolute -end-1 -top-1">
                {unread}
              </Badge>
            ) : null}
          </PopoverTrigger>
          <PopoverPopup align="end" className="w-80">
            <PopoverTitle>{texts.notifications}</PopoverTitle>
            {notifications.length ? (
              <ul className="-mx-2 mt-2 flex flex-col">
                {notifications.map((notification) => (
                  <li key={notification.id}>
                    <button
                      className="flex w-full gap-3 rounded-md px-2 py-2 text-start hover:bg-accent"
                      onClick={() => onNotificationSelect?.(notification.id)}
                      type="button"
                    >
                      <span
                        aria-hidden
                        className={cn(
                          'mt-1.5 size-2 shrink-0 rounded-full',
                          notification.unread ? 'bg-primary' : 'bg-transparent',
                        )}
                      />
                      <span className="flex min-w-0 flex-col gap-0.5">
                        <span className="font-medium text-sm">
                          {notification.title}
                        </span>
                        {notification.description ? (
                          <span className="text-muted-foreground text-sm">
                            {notification.description}
                          </span>
                        ) : null}
                        <span className="text-muted-foreground text-xs">
                          {notification.time}
                          {notification.unread ? (
                            <span className="sr-only">, {texts.unread}</span>
                          ) : null}
                        </span>
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-2 text-muted-foreground text-sm">
                {texts.notificationsEmpty}
              </p>
            )}
          </PopoverPopup>
        </Popover>
        <Menu>
          <MenuTrigger
            render={
              <Button aria-label={texts.account} size="icon" variant="ghost" />
            }
          >
            <Avatar className="size-7">
              {user.avatarUrl ? (
                <AvatarImage alt="" src={user.avatarUrl} />
              ) : null}
              <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
            </Avatar>
          </MenuTrigger>
          <MenuPopup align="end" className="min-w-56">
            <MenuGroup>
              <MenuGroupLabel>
                <span className="block font-medium text-foreground">
                  {user.name}
                </span>
                <span className="block font-normal">{user.email}</span>
              </MenuGroupLabel>
              {userActions?.map((action) => (
                <MenuItem
                  key={action.id}
                  onClick={() => onUserAction?.(action.id)}
                  variant={action.variant}
                >
                  {action.icon}
                  {action.label}
                </MenuItem>
              ))}
            </MenuGroup>
          </MenuPopup>
        </Menu>
      </div>
    </header>
  )
}
