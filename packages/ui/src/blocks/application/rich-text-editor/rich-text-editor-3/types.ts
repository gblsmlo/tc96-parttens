import type { RichTextValue } from '@tc96/ui/patterns/rich-text-editor'
import type {
  SuggestionAuthor,
  SuggestionChange,
  SuggestionReviewLabels,
} from '../shared/suggestions'

export type RichTextEditor3Author = SuggestionAuthor

export type RichTextEditor3Change = SuggestionChange

export type RichTextEditor3ExportFormat =
  | 'final-text'
  | 'original-text'
  | 'redline-html'

export type RichTextEditor3Decision =
  | { action: 'accept' | 'reject'; change: RichTextEditor3Change }
  | { action: 'accept-all' | 'reject-all'; changes: RichTextEditor3Change[] }

export interface RichTextEditor3Labels {
  acceptAll: string
  blocks: Record<'blockquote' | 'h2' | 'h3' | 'ol' | 'ul', string>
  cancel: string
  closeReview: string
  confirmAcceptAll: string
  confirmAcceptAllDescription: (count: number) => string
  confirmAcceptAllTitle: string
  confirmRejectAll: string
  confirmRejectAllDescription: (count: number) => string
  confirmRejectAllTitle: string
  count: (count: number) => string
  document: string
  export: string
  exportFinal: string
  exportHtml: string
  exportOriginal: string
  formatting: string
  marks: Record<'bold' | 'italic' | 'underline', string>
  next: string
  openReview: string
  previous: string
  redo: string
  rejectAll: string
  review: SuggestionReviewLabels
  reviewDescription: string
  reviewTitle: string
  undo: string
  viewAll: string
  viewFinal: string
  viewOriginal: string
  views: string
}

export interface RichTextEditor3Props {
  author: RichTextEditor3Author
  authors?: readonly RichTextEditor3Author[]
  className?: string
  defaultValue: RichTextValue
  formatTime?: (date: Date) => string
  labels?: Partial<RichTextEditor3Labels>
  onChange?: (value: RichTextValue) => void
  onDecision?: (decision: RichTextEditor3Decision) => void
  onExport?: (format: RichTextEditor3ExportFormat, content: string) => void
  title?: string
}
