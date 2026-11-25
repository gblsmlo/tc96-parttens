import { Button } from '@tc96/ui/button'
import { IconFrame } from '@tc96/ui/icon-frame'
import { Tooltip, TooltipPopup, TooltipTrigger } from '@tc96/ui/tooltip'
import { cn } from '@tc96/utils'
import { useId } from 'react'
import { inbox1DueToneClasses, inbox1KindIcons } from './inbox-1-options'
import type { Inbox1Entry, Inbox1Labels, Inbox1OriginColors } from './types'

export interface Inbox1FieldContext {
  labels: Inbox1Labels
  onOpen?: (entryId: string) => void
  onReadChange?: (entryId: string, read: boolean) => void
  originColors?: Inbox1OriginColors
}

interface FieldProps {
  context: Inbox1FieldContext
  entry: Inbox1Entry
}

export const opensEntry = (entry: Inbox1Entry) => entry.openable !== false

function ReadDot({ read }: Readonly<{ read: boolean }>) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        'block size-2.5 rounded-full',
        read ? 'border border-muted-foreground' : 'bg-primary',
      )}
      data-slot="inbox-1-read-dot"
    />
  )
}

export function Inbox1ReadField({ context, entry }: Readonly<FieldProps>) {
  const { labels, onReadChange } = context
  const state = entry.read ? 'read' : 'unread'

  if (!onReadChange)
    return (
      <span
        aria-label={labels.readStates[state]}
        className="inline-flex size-6 items-center justify-center"
        data-read={state}
        role="img"
      >
        <ReadDot read={entry.read} />
      </span>
    )

  return (
    <Button
      aria-label={
        entry.read
          ? labels.markUnread(entry.title)
          : labels.markRead(entry.title)
      }
      className="rounded-full"
      data-read={state}
      onClick={() => onReadChange(entry.id, !entry.read)}
      size="icon-xs"
      type="button"
      variant="ghost"
    >
      <ReadDot read={entry.read} />
    </Button>
  )
}

export function Inbox1EntryField({ context, entry }: Readonly<FieldProps>) {
  const KindIcon = inbox1KindIcons[entry.kind]
  return (
    <span className="flex min-w-56 max-w-96 items-center gap-2">
      <IconFrame
        color={context.originColors?.[entry.origin]}
        data-origin={entry.origin}
        shape="rounded"
        size="xs"
      >
        <KindIcon />
      </IconFrame>
      <span
        className={cn(
          'min-w-0 truncate',
          entry.read ? 'font-normal' : 'font-semibold',
        )}
      >
        {entry.title}
      </span>
    </span>
  )
}

export function Inbox1DueField({ context, entry }: Readonly<FieldProps>) {
  const { due } = entry
  if (!due)
    return (
      <span
        aria-label={context.labels.noDue}
        className="text-muted-foreground"
        role="img"
      >
        {context.labels.noDueMark}
      </span>
    )
  return (
    <span
      className={cn('whitespace-nowrap', inbox1DueToneClasses[due.tone])}
      data-tone={due.tone}
    >
      {due.label}
    </span>
  )
}

export function Inbox1ReceivedField({ context, entry }: Readonly<FieldProps>) {
  const className =
    'whitespace-nowrap text-muted-foreground text-xs tabular-nums'
  if (!entry.receivedHint)
    return <span className={className}>{entry.received}</span>

  return (
    <Inbox1ReceivedHint
      className={className}
      context={context}
      entry={entry}
      hint={entry.receivedHint}
    />
  )
}

function Inbox1ReceivedHint({
  className,
  context,
  entry,
  hint,
}: Readonly<FieldProps & { className: string; hint: string }>) {
  const hintId = useId()
  const { onOpen } = context
  return (
    <Tooltip>
      <TooltipTrigger
        aria-describedby={hintId}
        className={cn(
          className,
          'cursor-pointer rounded-sm bg-transparent p-0 outline-none focus-visible:ring-2 focus-visible:ring-ring',
        )}
        data-slot="inbox-1-received"
        onClick={
          onOpen && opensEntry(entry) ? () => onOpen(entry.id) : undefined
        }
        render={<button type="button" />}
      >
        {entry.received}
      </TooltipTrigger>
      <span hidden id={hintId}>
        {hint}
      </span>
      <TooltipPopup>{hint}</TooltipPopup>
    </Tooltip>
  )
}
