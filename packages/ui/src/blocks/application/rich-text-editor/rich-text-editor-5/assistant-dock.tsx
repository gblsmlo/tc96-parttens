import {
  ArrowCounterClockwiseIcon,
  ArrowsInLineHorizontalIcon,
  CaretDownIcon,
  CaretUpIcon,
  ListChecksIcon,
  PaperPlaneRightIcon,
  QuestionIcon,
  StopIcon,
  TextAaIcon,
  TextAlignLeftIcon,
  UserCircleIcon,
  XIcon,
} from '@phosphor-icons/react'
import { Badge } from '@tc96/ui/badge'
import { Button } from '@tc96/ui/button'
import { Input } from '@tc96/ui/input'
import { cn } from '@tc96/utils'
import { type ReactElement, type Ref, useState } from 'react'
import {
  type SuggestionChange,
  SuggestionReviewList,
} from '../shared/suggestions'
import { fallbackTasks, matchOrder, selectionTasks } from './planner'
import { StepTrace } from './step-trace'
import type {
  RichTextEditor5Finding,
  RichTextEditor5Labels,
  RichTextEditor5Task,
} from './types'
import type { Passage, RunState } from './use-assistant-run'

const taskIcons = {
  checklist: ListChecksIcon,
  owners: UserCircleIcon,
  questions: QuestionIcon,
  spelling: TextAaIcon,
  summary: TextAlignLeftIcon,
  tighten: ArrowsInLineHorizontalIcon,
} satisfies Record<RichTextEditor5Task, unknown>

export interface AssistantDockProps {
  activeFindingId: string | null
  activeId: string | null
  canUndo: boolean
  changes: readonly SuggestionChange[]
  fallback: string | null
  formatTime?: ((date: Date) => string) | undefined
  inputRef: Ref<HTMLInputElement>
  labels: RichTextEditor5Labels
  onAccept: (id: string) => void
  onAcceptAll: () => void
  onClearPassage: () => void
  onFinding: (finding: RichTextEditor5Finding) => void
  onReject: (id: string) => void
  onRejectAll: () => void
  onRequest: (text: string) => void
  onRun: (task: RichTextEditor5Task) => void
  onSelect: (id: string) => void
  onStep: (direction: 1 | -1) => void
  onStop: () => void
  onUndo: () => void
  passage: Passage | null
  run: RunState | null
}

function statusText(run: RunState, labels: RichTextEditor5Labels): string {
  if (run.status === 'running') return labels.running(labels.tasks[run.task])
  if (run.status === 'stopped') return labels.stopped(run.edits)
  if (run.status === 'failed') return labels.failed
  return labels.done(run.edits, run.findings.length)
}

export function AssistantDock({
  activeFindingId,
  activeId,
  canUndo,
  changes,
  fallback,
  formatTime,
  inputRef,
  labels,
  onAccept,
  onAcceptAll,
  onClearPassage,
  onFinding,
  onReject,
  onRejectAll,
  onRequest,
  onRun,
  onSelect,
  onStep,
  onStop,
  onUndo,
  passage,
  run,
}: Readonly<AssistantDockProps>): ReactElement {
  const [expanded, setExpanded] = useState(true)
  const [draft, setDraft] = useState('')
  const running = run?.status === 'running'
  const hasPanel = run !== null || changes.length > 0
  const activeIndex = changes.findIndex((change) => change.id === activeId)
  const findingsTask = run?.task === 'questions' || run?.task === 'owners'
  const reviewing = run !== null && !findingsTask

  return (
    <section
      aria-label={labels.dock}
      className="sticky bottom-4 z-20 mx-auto mt-auto flex w-full max-w-2xl flex-col rounded-xl border bg-popover text-popover-foreground shadow-lg"
      data-slot="assistant-dock"
    >
      {hasPanel ? (
        <div
          className="flex flex-col gap-3 border-b p-3"
          data-slot="assistant-panel"
        >
          <div className="flex items-center gap-2">
            <output
              aria-live="polite"
              className="min-w-0 flex-1 text-sm"
              data-slot="assistant-status"
            >
              {run ? statusText(run, labels) : labels.reviewTitle}
            </output>
            {running ? (
              <Button onClick={onStop} size="sm" variant="outline">
                <StopIcon aria-hidden="true" />
                {labels.stop}
              </Button>
            ) : null}
            <Button
              aria-expanded={expanded}
              aria-label={expanded ? labels.collapse : labels.expand}
              onClick={() => setExpanded((open) => !open)}
              size="icon-sm"
              variant="ghost"
            >
              {expanded ? (
                <CaretDownIcon aria-hidden="true" />
              ) : (
                <CaretUpIcon aria-hidden="true" />
              )}
            </Button>
          </div>
          {expanded ? (
            <div className="flex max-h-[45svh] flex-col gap-3 overflow-y-auto">
              {run ? <StepTrace label={labels.steps} run={run} /> : null}
              {findingsTask && run && run.status !== 'running' ? (
                run.findings.length === 0 ? (
                  <p
                    className="text-muted-foreground text-sm"
                    data-slot="assistant-findings-empty"
                  >
                    {labels.findingsEmpty}
                  </p>
                ) : (
                  <ul
                    aria-label={labels.findings}
                    className="flex flex-col gap-2"
                    data-slot="assistant-findings"
                  >
                    {run.findings.map((finding) => (
                      <li
                        className={cn(
                          'flex items-start gap-2 rounded-lg border bg-card p-2 text-card-foreground text-sm',
                          finding.id === activeFindingId &&
                            'border-ring ring-1 ring-ring',
                        )}
                        data-finding-id={finding.id}
                        data-kind={finding.kind}
                        data-slot="assistant-finding"
                        key={finding.id}
                      >
                        <Badge variant="secondary">
                          {labels.findingKinds[finding.kind]}
                        </Badge>
                        <span className="min-w-0 flex-1">{finding.text}</span>
                        <Button
                          aria-label={labels.goToFinding(finding)}
                          aria-pressed={finding.id === activeFindingId}
                          onClick={() => onFinding(finding)}
                          size="sm"
                          variant="outline"
                        >
                          {labels.goTo}
                        </Button>
                      </li>
                    ))}
                  </ul>
                )
              ) : null}
              {reviewing || changes.length > 0 ? (
                <div
                  className="flex flex-col gap-2"
                  data-slot="assistant-review"
                >
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-medium text-sm">
                      {labels.reviewTitle}
                    </h3>
                    <span
                      className="text-muted-foreground text-xs"
                      data-slot="assistant-review-position"
                    >
                      {labels.position(
                        Math.max(activeIndex, -1) + 1,
                        changes.length,
                      )}
                    </span>
                    <span className="flex-1" />
                    <Button
                      aria-label={labels.previous}
                      disabled={changes.length === 0}
                      onClick={() => onStep(-1)}
                      size="icon-sm"
                      variant="outline"
                    >
                      <CaretUpIcon aria-hidden="true" />
                    </Button>
                    <Button
                      aria-label={labels.next}
                      disabled={changes.length === 0}
                      onClick={() => onStep(1)}
                      size="icon-sm"
                      variant="outline"
                    >
                      <CaretDownIcon aria-hidden="true" />
                    </Button>
                    <Button
                      disabled={!canUndo}
                      onClick={onUndo}
                      size="sm"
                      variant="outline"
                    >
                      <ArrowCounterClockwiseIcon aria-hidden="true" />
                      {labels.undo}
                    </Button>
                    <Button
                      disabled={changes.length === 0}
                      onClick={onRejectAll}
                      size="sm"
                      variant="outline"
                    >
                      {labels.rejectAll}
                    </Button>
                    <Button
                      disabled={changes.length === 0}
                      onClick={onAcceptAll}
                      size="sm"
                    >
                      {labels.acceptAll}
                    </Button>
                  </div>
                  <SuggestionReviewList
                    activeId={activeId}
                    changes={changes}
                    {...(formatTime ? { formatTime } : {})}
                    labels={labels.review}
                    onAccept={onAccept}
                    onReject={onReject}
                    onSelect={onSelect}
                  />
                </div>
              ) : null}
            </div>
          ) : null}
        </div>
      ) : null}
      <div className="flex flex-col gap-2 p-3">
        {fallback ? (
          <fieldset
            className="flex min-w-0 flex-col gap-2 text-sm"
            data-slot="assistant-fallback"
          >
            <legend className="mb-2">{labels.fallback(fallback)}</legend>
            <div className="flex flex-wrap gap-2">
              {fallbackTasks.map((task) => (
                <Button
                  key={task}
                  onClick={() => onRun(task)}
                  size="sm"
                  variant="outline"
                >
                  {labels.tasks[task]}
                </Button>
              ))}
            </div>
          </fieldset>
        ) : null}
        {passage ? (
          <div
            className="flex items-center gap-2 rounded-lg border bg-muted/40 py-1 ps-3 pe-1 text-sm"
            data-slot="assistant-passage"
          >
            <span className="min-w-0 flex-1 truncate">
              {labels.passage(passage.text)}
            </span>
            <Button
              aria-label={labels.clearPassage}
              onClick={onClearPassage}
              size="icon-sm"
              variant="ghost"
            >
              <XIcon aria-hidden="true" />
            </Button>
          </div>
        ) : null}
        <form
          className="flex items-center gap-2"
          onSubmit={(event) => {
            event.preventDefault()
            const text = draft.trim()
            if (!text || running) return
            setDraft('')
            onRequest(text)
          }}
        >
          <Input
            aria-label={labels.request}
            className="flex-1"
            onChange={(event) => setDraft(event.target.value)}
            placeholder={labels.requestPlaceholder}
            ref={inputRef}
            value={draft}
          />
          <Button
            aria-label={labels.send}
            disabled={running || draft.trim().length === 0}
            size="icon-sm"
            type="submit"
          >
            <PaperPlaneRightIcon aria-hidden="true" />
          </Button>
        </form>
        <fieldset
          className="flex min-w-0 flex-wrap gap-2"
          data-slot="assistant-tasks"
        >
          <legend className="sr-only">{labels.tasksGroup}</legend>
          {matchOrder.map((task) => {
            const Icon = taskIcons[task]
            return (
              <Button
                data-task={task}
                disabled={
                  running ||
                  (passage !== null && !selectionTasks.includes(task))
                }
                key={task}
                onClick={() => onRun(task)}
                size="sm"
                variant="outline"
              >
                <Icon aria-hidden="true" />
                {labels.tasks[task]}
              </Button>
            )
          })}
        </fieldset>
      </div>
    </section>
  )
}
