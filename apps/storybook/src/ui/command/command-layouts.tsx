import { Button } from '@tc96/ui/button'
import {
  Command,
  CommandCollection,
  CommandCreateHandle,
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
  CommandSeparator,
  CommandShortcut,
} from '@tc96/ui/command'
import { Kbd, KbdGroup } from '@tc96/ui/kbd'
import { ArrowDownIcon, ArrowUpIcon, CornerDownLeftIcon } from 'lucide-react'
import { Fragment, type ReactNode, useEffect, useState } from 'react'
import { type CommandControls, commandControlArgs } from './command-controls.ts'
import {
  type CommandEntry,
  type CommandEntryGroup,
  commandEntries,
  commandGroups,
  disabledCommandValue,
} from './command-data.ts'

type CommandContentProps = Omit<CommandControls, 'dialog' | 'trigger'> & {
  onRun?: (value: string) => void
}

interface ComposedCommandProps extends CommandControls {
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
  onRun?: (value: string) => void
}

export const CommandFooterHints = () => (
  <CommandFooter>
    <div className="flex items-center gap-4">
      <span className="flex items-center gap-2">
        <KbdGroup>
          <Kbd>
            <ArrowUpIcon aria-hidden="true" />
          </Kbd>
          <Kbd>
            <ArrowDownIcon aria-hidden="true" />
          </Kbd>
        </KbdGroup>
        Navigate
      </span>
      <span className="flex items-center gap-2">
        <Kbd>
          <CornerDownLeftIcon aria-hidden="true" />
        </Kbd>
        Open
      </span>
    </div>
    <span className="flex items-center gap-2">
      <Kbd>Esc</Kbd>
      Close
    </span>
  </CommandFooter>
)

const CommandContent = ({
  disabledItem,
  empty,
  footer,
  groups,
  label,
  onRun,
  panel,
  placeholder,
  query,
  separators,
  shortcuts,
}: Readonly<CommandContentProps>) => {
  const renderItem = (item: CommandEntry) => (
    <CommandItem
      disabled={disabledItem && item.value === disabledCommandValue}
      key={item.value}
      onClick={() => onRun?.(item.value)}
      value={item}
    >
      {item.label}
      {shortcuts && item.shortcut ? (
        <CommandShortcut>{item.shortcut}</CommandShortcut>
      ) : null}
    </CommandItem>
  )

  const results = (
    <>
      {empty ? <CommandEmpty>{empty}</CommandEmpty> : null}
      <CommandList>
        {groups
          ? (group: CommandEntryGroup) => (
              <Fragment key={group.value}>
                <CommandGroup items={group.items}>
                  <CommandGroupLabel>{group.value}</CommandGroupLabel>
                  <CommandCollection>{renderItem}</CommandCollection>
                </CommandGroup>
                {separators ? <CommandSeparator /> : null}
              </Fragment>
            )
          : renderItem}
      </CommandList>
    </>
  )

  return (
    <Command
      defaultValue={query}
      items={groups ? commandGroups : commandEntries}
      key={`${query}-${groups}`}
    >
      <CommandInput aria-label={label} placeholder={placeholder} />
      {panel ? <CommandPanel>{results}</CommandPanel> : results}
      {footer ? <CommandFooterHints /> : null}
    </Command>
  )
}

export const ComposedCommand = ({
  defaultOpen = true,
  dialog,
  onOpenChange,
  trigger,
  ...content
}: Readonly<ComposedCommandProps>) => {
  if (!dialog) {
    return (
      <div className="w-96 max-w-full">
        <CommandContent {...content} />
      </div>
    )
  }

  return (
    <CommandDialog defaultOpen={defaultOpen} onOpenChange={onOpenChange}>
      <CommandDialogTrigger render={<Button variant="outline" />}>
        {trigger}
      </CommandDialogTrigger>
      <CommandDialogPopup aria-label={content.label}>
        <CommandContent {...content} />
      </CommandDialogPopup>
    </CommandDialog>
  )
}

export const DetachedTriggerCommand = () => {
  const [handle] = useState(() => CommandCreateHandle())
  const { trigger, ...content } = commandControlArgs

  return (
    <div className="flex flex-col items-center gap-3">
      <CommandDialogTrigger
        handle={handle}
        render={<Button variant="outline" />}
      >
        {trigger}
      </CommandDialogTrigger>
      <CommandDialog defaultOpen handle={handle}>
        <CommandDialogPopup aria-label={content.label}>
          <CommandContent {...content} />
        </CommandDialogPopup>
      </CommandDialog>
    </div>
  )
}

interface ShortcutCommandProps {
  defaultOpen?: boolean
  empty?: string
  groups?: CommandEntryGroup[]
  label?: string
  onRun?: (value: string) => void
  placeholder?: string
  trigger?: ReactNode
}

export const ShortcutCommand = ({
  defaultOpen = false,
  empty = commandControlArgs.empty,
  groups = commandGroups,
  label = commandControlArgs.label,
  onRun,
  placeholder = commandControlArgs.placeholder,
  trigger = 'Search',
}: Readonly<ShortcutCommandProps>) => {
  const [open, setOpen] = useState(defaultOpen)

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

  const run = (value: string) => {
    setOpen(false)
    onRun?.(value)
  }

  return (
    <CommandDialog onOpenChange={setOpen} open={open}>
      <CommandDialogTrigger render={<Button variant="outline" />}>
        {trigger}
        <KbdGroup>
          <Kbd>⌘</Kbd>
          <Kbd>K</Kbd>
        </KbdGroup>
      </CommandDialogTrigger>
      <CommandDialogPopup aria-label={label}>
        <Command items={groups}>
          <CommandInput aria-label={label} placeholder={placeholder} />
          <CommandPanel>
            <CommandEmpty>{empty}</CommandEmpty>
            <CommandList>
              {(group: CommandEntryGroup) => (
                <Fragment key={group.value}>
                  <CommandGroup items={group.items}>
                    <CommandGroupLabel>{group.value}</CommandGroupLabel>
                    <CommandCollection>
                      {(item: CommandEntry) => (
                        <CommandItem
                          key={item.value}
                          onClick={() => run(item.value)}
                          value={item}
                        >
                          {item.label}
                          {item.shortcut ? (
                            <CommandShortcut>{item.shortcut}</CommandShortcut>
                          ) : null}
                        </CommandItem>
                      )}
                    </CommandCollection>
                  </CommandGroup>
                  <CommandSeparator />
                </Fragment>
              )}
            </CommandList>
          </CommandPanel>
          <CommandFooterHints />
        </Command>
      </CommandDialogPopup>
    </CommandDialog>
  )
}
