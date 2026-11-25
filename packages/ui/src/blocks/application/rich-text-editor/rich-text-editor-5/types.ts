import type { RichTextValue } from '@tc96/ui/patterns/rich-text-editor'
import type { ReactNode } from 'react'
import type {
  SuggestionAuthor,
  SuggestionChange,
  SuggestionReviewLabels,
} from '../shared/suggestions'

export type RichTextEditor5Author = SuggestionAuthor

export type RichTextEditor5Change = SuggestionChange

export type RichTextEditor5Task =
  | 'checklist'
  | 'owners'
  | 'questions'
  | 'spelling'
  | 'summary'
  | 'tighten'

export type RichTextEditor5StepKind =
  | 'editing'
  | 'planning'
  | 'reading'
  | 'reviewing'

export interface RichTextEditor5Step {
  id: string
  kind: RichTextEditor5StepKind
  text: string
}

export type RichTextEditor5Edit =
  | { find: string; text: string; type: 'replace' }
  | { after: string; text: string; type: 'insert' }
  | {
      after?: string
      block: 'action_item' | 'p'
      text: string
      type: 'add-block'
    }

export type RichTextEditor5FindingKind = 'owner' | 'question' | 'tbd'

export interface RichTextEditor5Finding {
  id: string
  kind: RichTextEditor5FindingKind
  quote: string
  text: string
}

export interface RichTextEditor5Plan {
  edits: readonly RichTextEditor5Edit[]
  findings: readonly RichTextEditor5Finding[]
  steps: readonly RichTextEditor5Step[]
}

export type RichTextEditor5PlanEvent =
  | { edit: RichTextEditor5Edit; type: 'edit' }
  | { finding: RichTextEditor5Finding; type: 'finding' }
  | { step: RichTextEditor5Step; type: 'step' }

export interface RichTextEditor5Request {
  selection: string | null
  signal: AbortSignal
  task: RichTextEditor5Task
  text: string
}

export type RichTextEditor5Planner = (
  request: RichTextEditor5Request,
) =>
  | AsyncIterable<RichTextEditor5PlanEvent>
  | Promise<RichTextEditor5Plan>
  | RichTextEditor5Plan

export type RichTextEditor5Decision =
  | { action: 'accept' | 'reject'; change: RichTextEditor5Change }
  | { action: 'accept-all' | 'reject-all'; changes: RichTextEditor5Change[] }

export interface RichTextEditor5Labels {
  acceptAll: string
  assistant: string
  bubble: string
  bubbleAsk: string
  bubbleSpelling: string
  bubbleSummary: string
  clearPassage: string
  collapse: string
  conversation: string
  dock: string
  done: (edits: number, findings: number) => string
  emptyDescription: string
  emptyTitle: string
  failed: string
  fallback: (request: string) => string
  findingKinds: Record<RichTextEditor5FindingKind, string>
  findings: string
  findingsEmpty: string
  goTo: string
  goToFinding: (finding: RichTextEditor5Finding) => string
  jump: string
  next: string
  passage: (text: string) => string
  pending: (count: number) => string
  position: (current: number, total: number) => string
  previous: string
  rejectAll: string
  request: string
  requestPlaceholder: string
  review: SuggestionReviewLabels
  reviewTitle: string
  running: (task: string) => string
  send: string
  steps: string
  stop: string
  stopped: (edits: number) => string
  tasks: Record<RichTextEditor5Task, string>
  taskMenu: string
  tasksGroup: string
  typing: string
  undo: string
  document: string
}

export interface RichTextEditor5NavbarContext {
  pending: number
  running: boolean
  status: ReactNode
}

export interface RichTextEditor5Props {
  author: RichTextEditor5Author
  className?: string
  defaultValue: RichTextValue
  formatTime?: (date: Date) => string
  labels?: Partial<RichTextEditor5Labels>
  navbar?: ReactNode | ((context: RichTextEditor5NavbarContext) => ReactNode)
  onChange?: (value: RichTextValue) => void
  onDecision?: (decision: RichTextEditor5Decision) => void
  planner?: RichTextEditor5Planner
  stepDelay?: number
}
