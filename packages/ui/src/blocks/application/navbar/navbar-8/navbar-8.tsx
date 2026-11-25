'use client'

import { BellIcon, RocketLaunchIcon } from '@phosphor-icons/react'
import { Avatar, AvatarFallback, AvatarImage } from '@tc96/ui/avatar'
import { Button } from '@tc96/ui/button'
import { getInitials } from '@tc96/ui/helpers/initials'
import {
  Menu,
  MenuGroup,
  MenuGroupLabel,
  MenuPopup,
  MenuSeparator,
  MenuTrigger,
} from '@tc96/ui/menu'
import {
  Popover,
  PopoverPopup,
  PopoverTitle,
  PopoverTrigger,
} from '@tc96/ui/popover'
import { RadioGroupPrimitive, RadioPrimitive } from '@tc96/ui/radio-group'
import { renderAnchor } from '@tc96/ui/render-anchor'
import {
  SegmentedControl,
  SegmentedControlItem,
} from '@tc96/ui/segmented-control'
import { cn } from '@tc96/utils'
import { cloneElement, type ReactElement, useState } from 'react'
import { defaultNavbar8Labels } from './labels'
import type { Navbar8Props } from './types'

export function Navbar8({
  categories = [],
  category,
  className,
  homeHref,
  labels: labelsProp,
  logo,
  menu,
  name,
  notifications,
  onCategoryChange,
  onDeploy,
  onNotificationSelect,
  pending = false,
  renderLink = renderAnchor,
  user,
}: Readonly<Navbar8Props>) {
  const labels = { ...defaultNavbar8Labels, ...labelsProp }
  const [feedOpen, setFeedOpen] = useState(false)
  const unread = notifications?.filter((item) => !item.read).length ?? 0

  const brand = (
    <>
      {logo}
      <span className="truncate font-semibold text-sm">{name}</span>
    </>
  )

  return (
    <header
      className={cn(
        'grid h-14 w-full grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-4 border-b bg-background px-4 text-foreground',
        className,
      )}
      data-slot="navbar-8"
    >
      {homeHref ? (
        cloneElement(
          renderLink(homeHref) as ReactElement<{ className?: string }>,
          { className: 'flex min-w-0 items-center gap-2' },
          brand,
        )
      ) : (
        <div className="flex min-w-0 items-center gap-2">{brand}</div>
      )}
      <div className="flex min-w-0 justify-center overflow-x-auto">
        {categories.length > 0 ? (
          <SegmentedControl
            aria-label={labels.categories}
            render={
              <RadioGroupPrimitive
                onValueChange={(value) => onCategoryChange?.(String(value))}
                value={category ?? ''}
              />
            }
            size="sm"
          >
            {categories.map((item) => (
              <SegmentedControlItem
                key={item.id}
                render={<RadioPrimitive.Root value={item.id} />}
              >
                {item.label}
              </SegmentedControlItem>
            ))}
          </SegmentedControl>
        ) : null}
      </div>
      <div className="flex shrink-0 items-center gap-2">
        {onDeploy ? (
          <Button disabled={pending} onClick={onDeploy} size="sm">
            <RocketLaunchIcon aria-hidden="true" />
            {labels.deploy}
          </Button>
        ) : null}
        {notifications ? (
          <Popover onOpenChange={setFeedOpen} open={feedOpen}>
            <PopoverTrigger
              render={
                <Button
                  aria-label={labels.notificationsTrigger(unread)}
                  className="relative"
                  size="icon-sm"
                  variant="ghost"
                />
              }
            >
              <BellIcon aria-hidden="true" />
              {unread > 0 ? (
                <span
                  aria-hidden="true"
                  className="absolute end-1 top-1 size-2 rounded-full bg-primary ring-2 ring-background"
                  data-slot="navbar-unread-dot"
                />
              ) : null}
            </PopoverTrigger>
            <PopoverPopup align="end" className="w-80">
              <PopoverTitle>{labels.notifications}</PopoverTitle>
              {notifications.length > 0 ? (
                <ul className="-mx-2 mt-2 flex flex-col">
                  {notifications.map((notification) => (
                    <li key={notification.id}>
                      <button
                        className="flex w-full gap-3 rounded-md px-2 py-2 text-start hover:bg-accent"
                        data-read={notification.read ? '' : undefined}
                        onClick={() => {
                          onNotificationSelect?.(notification.id)
                          setFeedOpen(false)
                        }}
                        type="button"
                      >
                        <span
                          aria-hidden="true"
                          className={cn(
                            'mt-1.5 size-2 shrink-0 rounded-full',
                            notification.read ? 'bg-transparent' : 'bg-primary',
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
                            {notification.read ? null : (
                              <span className="sr-only">, {labels.unread}</span>
                            )}
                          </span>
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-2 text-muted-foreground text-sm">
                  {labels.notificationsEmpty}
                </p>
              )}
            </PopoverPopup>
          </Popover>
        ) : null}
        {user ? (
          <Menu>
            <MenuTrigger
              render={
                <Button
                  aria-label={labels.account}
                  size="icon-sm"
                  variant="ghost"
                />
              }
            >
              <Avatar className="size-6">
                {user.image ? <AvatarImage alt="" src={user.image} /> : null}
                <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
              </Avatar>
            </MenuTrigger>
            <MenuPopup align="end" className="min-w-56">
              <MenuGroup>
                <MenuGroupLabel>
                  <span className="block font-medium text-foreground">
                    {user.name}
                  </span>
                  {user.email ? (
                    <span className="block font-normal">{user.email}</span>
                  ) : null}
                </MenuGroupLabel>
              </MenuGroup>
              {menu ? (
                <>
                  <MenuSeparator />
                  {menu}
                </>
              ) : null}
            </MenuPopup>
          </Menu>
        ) : null}
      </div>
    </header>
  )
}
