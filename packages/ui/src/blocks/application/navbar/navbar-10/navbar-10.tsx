'use client'

import { CaretUpDownIcon, CubeIcon } from '@phosphor-icons/react'
import { Avatar, AvatarFallback, AvatarImage } from '@tc96/ui/avatar'
import { Button } from '@tc96/ui/button'
import { Group } from '@tc96/ui/group'
import { getInitials } from '@tc96/ui/helpers/initials'
import { Input } from '@tc96/ui/input'
import {
  Menu,
  MenuGroup,
  MenuGroupLabel,
  MenuPopup,
  MenuRadioGroup,
  MenuRadioItem,
  MenuSeparator,
  MenuTrigger,
} from '@tc96/ui/menu'
import {
  Select,
  SelectItem,
  SelectPopup,
  SelectTrigger,
  SelectValue,
} from '@tc96/ui/select'
import { Separator } from '@tc96/ui/separator'
import { cn } from '@tc96/utils'
import type { FormEvent, ReactElement } from 'react'
import { defaultNavbar10Labels } from './labels'
import type { Navbar10Method, Navbar10Props } from './types'

const methods: Navbar10Method[] = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE']

const methodItems = methods.map((method) => ({ label: method, value: method }))

export function Navbar10({
  className,
  labels: labelsProp,
  logo,
  menu,
  method,
  name,
  onMethodChange,
  onPathChange,
  onSend,
  onServiceChange,
  path,
  sending = false,
  service,
  services = [],
  user,
}: Readonly<Navbar10Props>): ReactElement {
  const labels = { ...defaultNavbar10Labels, ...labelsProp }
  const activeService = services.find((item) => item.id === service)
  const showServices = Boolean(activeService && onServiceChange)
  const showMethod = method !== undefined && onMethodChange !== undefined
  const showPath = path !== undefined && onPathChange !== undefined

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (sending) return
    onSend?.({ method: method ?? 'GET', path: path ?? '' })
  }

  return (
    <header
      className={cn(
        'flex h-14 w-full items-center gap-4 border-b bg-background px-4 text-foreground',
        className,
      )}
      data-slot="navbar-10"
    >
      <div className="flex shrink-0 items-center gap-3">
        <div className="flex items-center gap-2 font-semibold">
          {logo}
          <span>{name}</span>
        </div>
        {showServices && activeService ? (
          <>
            <Separator className="h-6" orientation="vertical" />
            <Menu>
              <MenuTrigger
                render={
                  <Button
                    aria-label={labels.serviceTrigger(activeService.label)}
                    size="sm"
                    variant="ghost"
                  />
                }
              >
                <CubeIcon aria-hidden="true" />
                {activeService.label}
                <CaretUpDownIcon aria-hidden="true" />
              </MenuTrigger>
              <MenuPopup align="start" className="min-w-48">
                <MenuGroup>
                  <MenuGroupLabel>{labels.service}</MenuGroupLabel>
                  <MenuRadioGroup
                    onValueChange={(next) => onServiceChange?.(String(next))}
                    value={activeService.id}
                  >
                    {services.map((item) => (
                      <MenuRadioItem closeOnClick key={item.id} value={item.id}>
                        {item.label}
                      </MenuRadioItem>
                    ))}
                  </MenuRadioGroup>
                </MenuGroup>
              </MenuPopup>
            </Menu>
          </>
        ) : null}
      </div>
      <div className="flex min-w-0 flex-1 items-center justify-end gap-3">
        {onSend ? (
          <form
            aria-label={labels.request}
            className="flex min-w-0 max-w-xl flex-1"
            onSubmit={submit}
          >
            <Group className="w-full min-w-0">
              {showMethod ? (
                <Select
                  items={methodItems}
                  onValueChange={(next) => {
                    if (next) onMethodChange?.(next as Navbar10Method)
                  }}
                  value={method}
                >
                  <SelectTrigger
                    aria-label={labels.method}
                    className="w-28 shrink-0 min-w-0 font-mono"
                    size="sm"
                  >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectPopup>
                    {methodItems.map((item) => (
                      <SelectItem
                        className="font-mono"
                        key={item.value}
                        value={item.value}
                      >
                        {item.label}
                      </SelectItem>
                    ))}
                  </SelectPopup>
                </Select>
              ) : null}
              {showPath ? (
                <Input
                  aria-label={labels.path}
                  autoCapitalize="off"
                  autoComplete="off"
                  className="min-w-0 flex-1 font-mono"
                  onChange={(event) => onPathChange?.(event.target.value)}
                  placeholder={labels.pathPlaceholder}
                  size="sm"
                  spellCheck={false}
                  type="text"
                  value={path}
                />
              ) : null}
              <Button disabled={sending} size="sm" type="submit">
                {labels.send}
              </Button>
            </Group>
          </form>
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
