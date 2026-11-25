'use client'

import { ArrowsClockwiseIcon, CaretUpDownIcon } from '@phosphor-icons/react'
import { Avatar, AvatarFallback, AvatarImage } from '@tc96/ui/avatar'
import { Badge } from '@tc96/ui/badge'
import { Button } from '@tc96/ui/button'
import { getInitials } from '@tc96/ui/helpers/initials'
import {
  Menu,
  MenuGroup,
  MenuGroupLabel,
  MenuPopup,
  MenuRadioGroup,
  MenuRadioItem,
  MenuTrigger,
} from '@tc96/ui/menu'
import { Tabs, TabsList, TabsTab } from '@tc96/ui/tabs'
import { cn } from '@tc96/utils'
import type { ReactElement } from 'react'
import { defaultNavbar11Labels } from './labels'
import type { Navbar11Props } from './types'

export function Navbar11({
  className,
  labels: labelsProp,
  logo,
  menu,
  name,
  onSectionChange,
  onSourceChange,
  section,
  sections = [],
  source,
  sources = [],
  user,
  version,
}: Readonly<Navbar11Props>): ReactElement {
  const labels = { ...defaultNavbar11Labels, ...labelsProp }
  const currentSource = sources.find((item) => item.id === source)
  const showTabs = sections.length > 0 && onSectionChange
  const showSource = sources.length > 0 && onSourceChange

  return (
    <header
      className={cn(
        'grid h-14 w-full grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 border-b bg-background px-4 text-foreground md:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)]',
        className,
      )}
      data-slot="navbar-11"
    >
      <div className="flex min-w-0 items-center gap-2">
        {logo ? (
          <span aria-hidden="true" className="flex shrink-0 items-center">
            {logo}
          </span>
        ) : null}
        <span className="truncate font-semibold text-sm">{name}</span>
        {version ? (
          <Badge
            className="hidden sm:inline-flex"
            data-slot="navbar-version"
            variant="outline"
          >
            {version}
          </Badge>
        ) : null}
      </div>
      <div className="flex min-w-0 justify-center overflow-x-auto px-1 py-1">
        {showTabs ? (
          <Tabs
            onValueChange={(value) => onSectionChange(String(value))}
            value={section}
          >
            <TabsList aria-label={labels.sectionNavigation} size="sm">
              {sections.map((item) => (
                <TabsTab key={item.id} value={item.id}>
                  {item.label}
                </TabsTab>
              ))}
            </TabsList>
          </Tabs>
        ) : null}
      </div>
      <div className="flex items-center justify-end gap-2">
        {showSource ? (
          <Menu>
            <MenuTrigger
              render={
                <Button
                  aria-label={labels.sourceTrigger(currentSource?.label ?? '')}
                  size="sm"
                  variant="outline"
                />
              }
            >
              <ArrowsClockwiseIcon aria-hidden="true" />
              <span className="hidden max-w-40 truncate sm:inline">
                {currentSource?.label}
              </span>
              <CaretUpDownIcon aria-hidden="true" />
            </MenuTrigger>
            <MenuPopup align="end" className="min-w-52">
              <MenuGroup>
                <MenuGroupLabel>{labels.sourceGroup}</MenuGroupLabel>
                <MenuRadioGroup
                  onValueChange={(next) => onSourceChange(String(next))}
                  value={source}
                >
                  {sources.map((item) => (
                    <MenuRadioItem closeOnClick key={item.id} value={item.id}>
                      {item.label}
                    </MenuRadioItem>
                  ))}
                </MenuRadioGroup>
              </MenuGroup>
            </MenuPopup>
          </Menu>
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
              <Avatar className="size-7">
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
                {menu}
              </MenuGroup>
            </MenuPopup>
          </Menu>
        ) : null}
      </div>
    </header>
  )
}
