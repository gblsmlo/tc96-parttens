import { EmptyState2 } from '@tc96/ui/blocks/application/empty-state/empty-state-2'
import { suggestions } from '../fixtures/empty-state-2.ts'
import type { EmptyState2Controls } from './empty-state-2-controls.ts'

interface ComposedEmptyState2Props extends EmptyState2Controls {
  onClear?: () => void
  onSuggestion?: (suggestion: string) => void
}

export const ComposedEmptyState2 = ({
  clear,
  description,
  onClear,
  onSuggestion,
  query,
  suggestions: showSuggestions,
}: Readonly<ComposedEmptyState2Props>) => (
  <EmptyState2
    labels={{ description }}
    onClear={clear ? onClear : undefined}
    onSuggestion={showSuggestions ? onSuggestion : undefined}
    query={query}
    suggestions={showSuggestions ? suggestions : []}
  />
)
