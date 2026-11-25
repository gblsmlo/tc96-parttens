'use client'

import {
  ArrowDownIcon,
  ArrowElbowDownLeftIcon,
  ArrowUpIcon,
  MagnifyingGlassIcon,
} from '@phosphor-icons/react'
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
import { Kbd, KbdGroup } from '@tc96/ui/kbd'
import { type ReactElement, useEffect, useMemo, useState } from 'react'
import type { Navbar7Labels, Navbar7SearchItem } from './types'

interface CommandEntry {
  label: string
  value: string
}

interface CommandEntryGroup {
  items: CommandEntry[]
  value: string
}

interface Navbar7SearchProps {
  items: Navbar7SearchItem[]
  labels: Navbar7Labels
  onSelect: (id: string) => void
}

const toCommandGroups = (items: Navbar7SearchItem[]): CommandEntryGroup[] => {
  const groups = new Map<string, CommandEntry[]>()
  for (const item of items) {
    const key = item.group ?? ''
    const entries = groups.get(key) ?? []
    entries.push({ label: item.label, value: item.id })
    groups.set(key, entries)
  }
  return [...groups].map(([value, entries]) => ({ items: entries, value }))
}

export function Navbar7Search({
  items,
  labels,
  onSelect,
}: Readonly<Navbar7SearchProps>): ReactElement {
  const [open, setOpen] = useState(false)
  const groups = useMemo(() => toCommandGroups(items), [items])

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
      <CommandDialogTrigger
        render={<Button className="ms-auto" size="sm" variant="outline" />}
      >
        <MagnifyingGlassIcon aria-hidden="true" />
        {labels.search}
        <KbdGroup className="hidden sm:inline-flex">
          <Kbd>⌘</Kbd>
          <Kbd>K</Kbd>
        </KbdGroup>
      </CommandDialogTrigger>
      <CommandDialogPopup aria-label={labels.search}>
        <Command items={groups}>
          <CommandInput
            aria-label={labels.search}
            placeholder={labels.searchPlaceholder}
          />
          <CommandPanel>
            <CommandEmpty>{labels.searchEmpty}</CommandEmpty>
            <CommandList>
              {(group: CommandEntryGroup) => (
                <CommandGroup items={group.items} key={group.value}>
                  {group.value ? (
                    <CommandGroupLabel>{group.value}</CommandGroupLabel>
                  ) : null}
                  <CommandCollection>
                    {(entry: CommandEntry) => (
                      <CommandItem
                        key={entry.value}
                        onClick={() => {
                          setOpen(false)
                          onSelect(entry.value)
                        }}
                        value={entry}
                      >
                        {entry.label}
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
              {labels.searchNavigate}
            </span>
            <span className="flex items-center gap-2">
              <Kbd>
                <ArrowElbowDownLeftIcon aria-hidden="true" />
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
