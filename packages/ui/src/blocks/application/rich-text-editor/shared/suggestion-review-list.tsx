import { CheckIcon, XIcon } from '@phosphor-icons/react'
import { Avatar, AvatarFallback } from '@tc96/ui/avatar'
import { Badge } from '@tc96/ui/badge'
import { Button } from '@tc96/ui/button'
import { getInitials } from '@tc96/ui/helpers/initials'
import { cn } from '@tc96/utils'
import type { ReactElement } from 'react'
import type { SuggestionChange, SuggestionKind } from './types'

export interface SuggestionReviewLabels {
  accept: string
  acceptChange: (change: SuggestionChange) => string
  empty: string
  kind: Record<SuggestionKind, string>
  list: string
  now: string
  reject: string
  rejectChange: (change: SuggestionChange) => string
  was: string
}

export interface SuggestionReviewListProps {
  activeId?: string | null
  changes: readonly SuggestionChange[]
  className?: string
  formatTime?: (date: Date) => string
  labels: SuggestionReviewLabels
  onAccept: (id: string) => void
  onReject: (id: string) => void
  onSelect?: (id: string) => void
}

const defaultFormatTime = (date: Date) =>
  new Intl.DateTimeFormat('pt-BR', {
    dateStyle: 'short',
    timeStyle: 'short',
  }).format(date)

const kindVariant = {
  delete: 'error',
  insert: 'success',
  replace: 'info',
} as const satisfies Record<SuggestionKind, string>

export function SuggestionReviewList({
  activeId = null,
  changes,
  className,
  formatTime = defaultFormatTime,
  labels,
  onAccept,
  onReject,
  onSelect,
}: Readonly<SuggestionReviewListProps>): ReactElement {
  if (changes.length === 0)
    return (
      <p
        className={cn('p-4 text-muted-foreground text-sm', className)}
        data-slot="suggestion-review-empty"
      >
        {labels.empty}
      </p>
    )
  return (
    <ul
      aria-label={labels.list}
      className={cn('flex flex-col gap-2', className)}
      data-slot="suggestion-review-list"
    >
      {changes.map((change) => {
        const active = change.id === activeId
        return (
          <li
            className={cn(
              'flex flex-col gap-2 rounded-lg border bg-card p-3 text-card-foreground text-sm',
              active && 'border-ring ring-1 ring-ring',
            )}
            data-active={active ? 'true' : undefined}
            data-kind={change.kind}
            data-slot="suggestion-review-item"
            data-suggestion-id={change.id}
            key={change.id}
          >
            <button
              aria-current={active ? 'true' : undefined}
              className="flex w-full flex-col gap-2 rounded-md text-start outline-none focus-visible:ring-2 focus-visible:ring-ring"
              onClick={() => onSelect?.(change.id)}
              type="button"
            >
              <span className="flex items-center gap-2">
                <Avatar className="size-6 text-xs">
                  <AvatarFallback>
                    {getInitials(change.author.name)}
                  </AvatarFallback>
                </Avatar>
                <span className="min-w-0 flex-1">
                  <span className="block truncate font-medium">
                    {change.author.name}
                  </span>
                  <time
                    className="block text-muted-foreground text-xs"
                    dateTime={change.createdAt.toISOString()}
                  >
                    {formatTime(change.createdAt)}
                  </time>
                </span>
                <Badge variant={kindVariant[change.kind]}>
                  {labels.kind[change.kind]}
                </Badge>
              </span>
              {change.before ? (
                <span className="block">
                  <span className="block text-muted-foreground text-xs">
                    {labels.was}
                  </span>
                  <del
                    className="line-clamp-3 text-destructive-foreground"
                    data-slot="suggestion-review-before"
                  >
                    {change.before}
                  </del>
                </span>
              ) : null}
              {change.after ? (
                <span className="block">
                  <span className="block text-muted-foreground text-xs">
                    {labels.now}
                  </span>
                  <ins
                    className="line-clamp-3 text-success-foreground no-underline"
                    data-slot="suggestion-review-after"
                  >
                    {change.after}
                  </ins>
                </span>
              ) : null}
            </button>
            <div className="flex justify-end gap-2">
              <Button
                aria-label={labels.rejectChange(change)}
                onClick={() => onReject(change.id)}
                size="sm"
                variant="outline"
              >
                <XIcon aria-hidden="true" />
                {labels.reject}
              </Button>
              <Button
                aria-label={labels.acceptChange(change)}
                onClick={() => onAccept(change.id)}
                size="sm"
              >
                <CheckIcon aria-hidden="true" />
                {labels.accept}
              </Button>
            </div>
          </li>
        )
      })}
    </ul>
  )
}
