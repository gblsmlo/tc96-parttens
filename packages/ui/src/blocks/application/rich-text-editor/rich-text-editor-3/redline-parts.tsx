import { Button } from '@tc96/ui/button'
import {
  RichTextBlockButton,
  RichTextHistoryButton,
  RichTextMarkButton,
  RichTextToolbar,
} from '@tc96/ui/patterns/rich-text-editor'
import { ToolbarGroup, ToolbarSeparator } from '@tc96/ui/toolbar'
import type { ReactElement } from 'react'
import {
  type SuggestionChange,
  type SuggestionReviewLabels,
  SuggestionReviewList,
} from '../shared/suggestions'
import type { RichTextEditor3Labels } from './types'

export function RedlineToolbar({
  labels,
}: Readonly<{ labels: RichTextEditor3Labels }>): ReactElement {
  return (
    <RichTextToolbar
      aria-label={labels.formatting}
      className="mb-6 rounded-lg border bg-card p-1"
    >
      <ToolbarGroup>
        <RichTextHistoryButton action="undo" label={labels.undo} />
        <RichTextHistoryButton action="redo" label={labels.redo} />
      </ToolbarGroup>
      <ToolbarSeparator />
      <ToolbarGroup>
        <RichTextMarkButton label={labels.marks.bold} mark="bold" />
        <RichTextMarkButton label={labels.marks.italic} mark="italic" />
        <RichTextMarkButton label={labels.marks.underline} mark="underline" />
      </ToolbarGroup>
      <ToolbarSeparator />
      <ToolbarGroup>
        <RichTextBlockButton block="h2" label={labels.blocks.h2} />
        <RichTextBlockButton block="h3" label={labels.blocks.h3} />
        <RichTextBlockButton
          block="blockquote"
          label={labels.blocks.blockquote}
        />
        <RichTextBlockButton block="ul" label={labels.blocks.ul} />
        <RichTextBlockButton block="ol" label={labels.blocks.ol} />
      </ToolbarGroup>
    </RichTextToolbar>
  )
}

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
  showTitle: boolean
}

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
  showTitle,
}: Readonly<RedlineReviewPanelProps>): ReactElement {
  const review: SuggestionReviewLabels = labels.review
  return (
    <div className="flex flex-col gap-3 p-4" data-slot="redline-review-panel">
      {showTitle ? (
        <h2 className="font-semibold text-base">{labels.reviewTitle}</h2>
      ) : null}
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
