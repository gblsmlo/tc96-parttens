import {
  CaretUpDownIcon,
  ExportIcon,
  NotePencilIcon,
  PushPinIcon,
} from '@phosphor-icons/react'
import { Button } from '@tc96/ui/button'
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
import { Meter, MeterIndicator, MeterTrack } from '@tc96/ui/meter'
import type { ReactElement } from 'react'
import type { AiChat1Labels, AiChat1Thread, AiChat1Usage } from './types'

export interface AiChat1HeaderProps {
  formatCount: (value: number) => string
  labels: AiChat1Labels
  onExport?: (() => void) | undefined
  onNewThread?: (() => void) | undefined
  onThreadChange?: ((threadId: string) => void) | undefined
  threadId?: string | undefined
  threads: readonly AiChat1Thread[]
  titleId: string
  usage?: AiChat1Usage | undefined
}

function ThreadGroup({
  label,
  pinned,
  threads,
}: Readonly<{
  label: string
  pinned?: boolean
  threads: readonly AiChat1Thread[]
}>): ReactElement | null {
  if (threads.length === 0) return null
  return (
    <MenuGroup>
      <MenuGroupLabel>{label}</MenuGroupLabel>
      {threads.map((thread) => (
        <MenuRadioItem closeOnClick key={thread.id} value={thread.id}>
          {pinned ? <PushPinIcon aria-hidden="true" /> : null}
          <span className="truncate">{thread.title}</span>
        </MenuRadioItem>
      ))}
    </MenuGroup>
  )
}

export function AiChat1Header({
  formatCount,
  labels,
  onExport,
  onNewThread,
  onThreadChange,
  threadId,
  threads,
  titleId,
  usage,
}: Readonly<AiChat1HeaderProps>): ReactElement {
  const current = threads.find((thread) => thread.id === threadId)
  const pinned = threads.filter((thread) => thread.pinned)
  const recent = threads.filter((thread) => !thread.pinned)
  const switcher = threads.length > 0 && onThreadChange

  return (
    <header
      className="flex min-h-14 shrink-0 flex-wrap items-center gap-2 border-b px-4 py-2"
      data-slot="ai-chat-header"
    >
      <h2 className="sr-only" id={titleId}>
        {labels.title}
      </h2>
      {switcher ? (
        <Menu>
          <MenuTrigger
            data-slot="ai-chat-thread-switcher"
            render={<Button className="max-w-64" size="sm" variant="ghost" />}
          >
            <span className="truncate">{current?.title ?? labels.title}</span>
            <CaretUpDownIcon aria-hidden="true" />
          </MenuTrigger>
          <MenuPopup align="start" className="min-w-64">
            <MenuRadioGroup
              aria-label={labels.threadSwitcher}
              onValueChange={(next) => onThreadChange(String(next))}
              value={threadId ?? ''}
            >
              <ThreadGroup label={labels.pinned} pinned threads={pinned} />
              {pinned.length > 0 && recent.length > 0 ? (
                <MenuSeparator />
              ) : null}
              <ThreadGroup label={labels.recent} threads={recent} />
            </MenuRadioGroup>
          </MenuPopup>
        </Menu>
      ) : (
        <span className="truncate px-2 font-medium text-sm" aria-hidden="true">
          {current?.title ?? labels.title}
        </span>
      )}
      <div className="ms-auto flex items-center gap-2">
        {usage ? (
          <div
            className="hidden items-center gap-2 sm:flex"
            data-slot="ai-chat-usage"
          >
            <Meter
              aria-label={labels.contextWindow}
              className="w-20"
              getAriaValueText={() =>
                labels.usage(formatCount(usage.used), formatCount(usage.limit))
              }
              max={usage.limit}
              value={Math.min(usage.used, usage.limit)}
            >
              <MeterTrack>
                <MeterIndicator />
              </MeterTrack>
            </Meter>
            <span
              aria-hidden="true"
              className="text-muted-foreground text-xs tabular-nums"
            >
              {labels.usage(formatCount(usage.used), formatCount(usage.limit))}
            </span>
          </div>
        ) : null}
        {onExport ? (
          <Button
            aria-label={labels.transcript}
            onClick={onExport}
            size="icon-sm"
            variant="ghost"
          >
            <ExportIcon aria-hidden="true" />
          </Button>
        ) : null}
        {onNewThread ? (
          <Button onClick={onNewThread} size="sm" variant="outline">
            <NotePencilIcon aria-hidden="true" />
            {labels.newThread}
          </Button>
        ) : null}
      </div>
    </header>
  )
}
