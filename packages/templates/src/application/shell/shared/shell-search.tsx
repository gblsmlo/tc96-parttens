'use client'

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
import { Kbd, KbdGroup } from '@tc96/ui/kbd'
import { ArrowDownIcon, ArrowUpIcon, CornerDownLeftIcon } from 'lucide-react'
import {
  type ReactElement,
  type ReactNode,
  useEffect,
  useMemo,
  useState,
} from 'react'
import type { ShellLabels, ShellNavGroup } from './types'

interface ShellRoute {
  label: string
  value: string
}

interface ShellRouteGroup {
  items: ShellRoute[]
  value: string
}

export function toShellRoutes(groups: ShellNavGroup[]): ShellRouteGroup[] {
  return groups
    .map((group) => ({
      items: group.items.flatMap((item) => [
        ...(item.href ? [{ label: item.title, value: item.href }] : []),
        ...(item.items ?? []).map((sub) => ({
          label: `${item.title} / ${sub.title}`,
          value: sub.href,
        })),
      ]),
      value: group.label,
    }))
    .filter((group) => group.items.length)
}

export function ShellSearchShortcut(): ReactElement {
  return (
    <KbdGroup>
      <Kbd>⌘</Kbd>
      <Kbd>K</Kbd>
    </KbdGroup>
  )
}

export interface ShellSearchProps {
  children: ReactNode
  groups: ShellNavGroup[]
  labels: ShellLabels
  onNavigate?: (href: string) => void
  trigger: ReactElement
}

export function ShellSearch({
  children,
  groups,
  labels,
  onNavigate,
  trigger,
}: Readonly<ShellSearchProps>): ReactElement {
  const [open, setOpen] = useState(false)
  const routes = useMemo(() => toShellRoutes(groups), [groups])

  useEffect(() => {
    const toggle = (event: KeyboardEvent) => {
      if (event.key.toLowerCase() === 'k' && (event.metaKey || event.ctrlKey)) {
        event.preventDefault()
        setOpen((current) => !current)
      }
    }
    document.addEventListener('keydown', toggle)
    return () => document.removeEventListener('keydown', toggle)
  }, [])

  return (
    <CommandDialog onOpenChange={setOpen} open={open}>
      <CommandDialogTrigger render={trigger}>{children}</CommandDialogTrigger>
      <CommandDialogPopup aria-label={labels.search}>
        <Command items={routes}>
          <CommandInput
            aria-label={labels.search}
            placeholder={labels.searchPlaceholder}
          />
          <CommandPanel>
            <CommandEmpty>{labels.searchEmpty}</CommandEmpty>
            <CommandList>
              {(group: ShellRouteGroup) => (
                <CommandGroup items={group.items} key={group.value}>
                  <CommandGroupLabel>{group.value}</CommandGroupLabel>
                  <CommandCollection>
                    {(route: ShellRoute) => (
                      <CommandItem
                        key={route.value}
                        onClick={() => {
                          setOpen(false)
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
                  <ArrowUpIcon />
                </Kbd>
                <Kbd>
                  <ArrowDownIcon />
                </Kbd>
              </KbdGroup>
              {labels.searchNavigate}
            </span>
            <span className="flex items-center gap-2">
              <Kbd>
                <CornerDownLeftIcon />
              </Kbd>
              {labels.searchOpen}
            </span>
            <span className="flex items-center gap-2">
              <Kbd>Esc</Kbd>
              {labels.searchClose}
            </span>
          </CommandFooter>
        </Command>
      </CommandDialogPopup>
    </CommandDialog>
  )
}
