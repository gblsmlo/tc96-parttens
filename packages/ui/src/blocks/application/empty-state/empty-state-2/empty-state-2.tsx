import { MagnifyingGlassIcon } from '@phosphor-icons/react'
import { Button } from '@tc96/ui/button'
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@tc96/ui/empty'
import { cn } from '@tc96/utils'
import { useId } from 'react'
import { defaultEmptyState2Labels } from './labels'
import type { EmptyState2Props } from './types'

export function EmptyState2({
  className,
  icon,
  labels: labelsProp,
  onClear,
  onSuggestion,
  query,
  suggestions = [],
}: Readonly<EmptyState2Props>) {
  const labels = { ...defaultEmptyState2Labels, ...labelsProp }
  const suggestionsId = useId()
  const showSuggestions = Boolean(onSuggestion) && suggestions.length > 0

  return (
    <output className={cn('flex', className)} data-slot="empty-state-2">
      <Empty>
        <EmptyHeader>
          <EmptyMedia variant="icon">
            {icon ?? <MagnifyingGlassIcon aria-hidden="true" />}
          </EmptyMedia>
          <EmptyTitle>{labels.title(query)}</EmptyTitle>
          <EmptyDescription>{labels.description}</EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          {showSuggestions ? (
            <div className="grid gap-2">
              <p className="text-muted-foreground text-xs" id={suggestionsId}>
                {labels.suggestions}
              </p>
              <ul
                aria-labelledby={suggestionsId}
                className="flex list-none flex-wrap justify-center gap-2"
              >
                {suggestions.map((suggestion) => (
                  <li key={suggestion}>
                    <Button
                      onClick={() => onSuggestion?.(suggestion)}
                      size="sm"
                      type="button"
                      variant="outline"
                    >
                      {suggestion}
                    </Button>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
          {onClear ? (
            <Button onClick={onClear} size="sm" type="button" variant="ghost">
              {labels.clear}
            </Button>
          ) : null}
        </EmptyContent>
      </Empty>
    </output>
  )
}
