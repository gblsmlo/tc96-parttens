import { CaretDownIcon, CaretUpIcon } from '@phosphor-icons/react'
import { Button } from '@tc96/ui/button'
import { ToggleGroup, ToggleGroupItem } from '@tc96/ui/toggle-group'
import type { ReactElement } from 'react'
import {
  type SuggestionChange,
  type SuggestionReviewLabels,
  SuggestionReviewList,
  type SuggestionView,
} from '../shared/suggestions'
import type { RichTextEditor3Labels } from './types'

export interface RedlineReviewPanelProps {
  activeId: string | null
  changes: readonly SuggestionChange[]
  formatTime?: ((date: Date) => string) | undefined
  labels: RichTextEditor3Labels
  onAccept: (id: string) => void
  onAcceptAll: () => void
  onReject: (id: string) => void
  onRejectAll: () => void
  onSelect: (id: string) => void
  onStep: (direction: 1 | -1) => void
  onViewChange: (view: SuggestionView) => void
  showTitle: boolean
  view: SuggestionView
}

const views: readonly SuggestionView[] = ['all', 'final', 'original']

export function RedlineReviewPanel({
  activeId,
  changes,
  formatTime,
  labels,
  onAccept,
  onAcceptAll,
  onReject,
  onRejectAll,
  onSelect,
  onStep,
  onViewChange,
  showTitle,
  view,
}: Readonly<RedlineReviewPanelProps>): ReactElement {
  const review: SuggestionReviewLabels = labels.review
  const viewLabel: Record<SuggestionView, string> = {
    all: labels.viewAll,
    final: labels.viewFinal,
    original: labels.viewOriginal,
  }
  const stepDisabled = changes.length === 0 || view !== 'all'
  return (
    <div className="flex flex-col gap-3 p-4" data-slot="redline-review-panel">
      <div className="flex items-center gap-1">
        {showTitle ? (
          <h2 className="me-auto font-semibold text-base">
            {labels.reviewTitle}
          </h2>
        ) : (
          <span className="me-auto" />
        )}
        <Button
          aria-label={labels.previous}
          disabled={stepDisabled}
          onClick={() => onStep(-1)}
          size="icon-sm"
          variant="ghost"
        >
          <CaretUpIcon aria-hidden="true" />
        </Button>
        <Button
          aria-label={labels.next}
          disabled={stepDisabled}
          onClick={() => onStep(1)}
          size="icon-sm"
          variant="ghost"
        >
          <CaretDownIcon aria-hidden="true" />
        </Button>
      </div>
      <ToggleGroup
        aria-label={labels.views}
        onValueChange={(next) => {
          const chosen = next[0] as SuggestionView | undefined
          if (chosen) onViewChange(chosen)
        }}
        size="sm"
        value={[view]}
        variant="outline"
      >
        {views.map((option) => (
          <ToggleGroupItem key={option} value={option}>
            {viewLabel[option]}
          </ToggleGroupItem>
        ))}
      </ToggleGroup>
      <div className="flex gap-2">
        <Button
          disabled={changes.length === 0}
          onClick={onRejectAll}
          size="sm"
          variant="outline"
        >
          {labels.rejectAll}
        </Button>
        <Button disabled={changes.length === 0} onClick={onAcceptAll} size="sm">
          {labels.acceptAll}
        </Button>
      </div>
      <SuggestionReviewList
        activeId={activeId}
        changes={changes}
        {...(formatTime ? { formatTime } : {})}
        labels={review}
        onAccept={onAccept}
        onReject={onReject}
        onSelect={onSelect}
      />
    </div>
  )
}
