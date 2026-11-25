import {
  ArrowCounterClockwiseIcon,
  ArrowsInLineHorizontalIcon,
  ArrowUpIcon,
  CaretDownIcon,
  CaretUpIcon,
  LightningIcon,
  ListChecksIcon,
  MinusIcon,
  QuestionIcon,
  SparkleIcon,
  StopIcon,
  TextAaIcon,
  TextAlignLeftIcon,
  UserCircleIcon,
  XIcon,
} from '@phosphor-icons/react'
import { Avatar, AvatarFallback } from '@tc96/ui/avatar'
import { Badge } from '@tc96/ui/badge'
import { Button } from '@tc96/ui/button'
import { ChatConversation } from '@tc96/ui/chat/chat-conversation'
import { ChatMessage } from '@tc96/ui/chat/chat-message'
import { ChatEmptyState } from '@tc96/ui/chat/chat-states'
import { ChatTypingIndicator } from '@tc96/ui/chat/chat-typing-indicator'
import { useChatScroll } from '@tc96/ui/chat/hooks/use-chat-scroll'
import {
  Composer,
  ComposerActionGroup,
  ComposerActions,
  ComposerInput,
  ComposerItem,
  ComposerList,
  ComposerPopup,
  ComposerSubmit,
  type ComposerTrigger,
  type ComposerValue,
  getComposerText,
  useComposerContext,
} from '@tc96/ui/composer'
import { cn } from '@tc96/utils'
import {
  type ReactElement,
  type RefObject,
  useId,
  useMemo,
  useState,
} from 'react'
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

const isTask = (id: string): id is RichTextEditor5Task =>
  (matchOrder as readonly string[]).includes(id)

export type AssistantTurn =
  | { fallback: string; id: string; kind: 'fallback'; prompt: string }
  | { id: string; kind: 'task'; prompt: string; run?: RunState | undefined }

export interface AssistantChatProps {
  activeFindingId: string | null
  activeId: string | null
  canUndo: boolean
  changes: readonly SuggestionChange[]
  chatRef: RefObject<HTMLElement | null>
  formatTime?: ((date: Date) => string) | undefined
  labels: RichTextEditor5Labels
  onAccept: (id: string) => void
  onAcceptAll: () => void
  onClearPassage: () => void
  onCollapse: () => void
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
  turns: readonly AssistantTurn[]
}

function statusText(run: RunState, labels: RichTextEditor5Labels): string {
  if (run.status === 'running') return labels.running(labels.tasks[run.task])
  if (run.status === 'stopped') return labels.stopped(run.edits)
  if (run.status === 'failed') return labels.failed
  return labels.done(run.edits, run.findings.length)
}

function AssistantAvatar(): ReactElement {
  return (
    <Avatar className="[--avatar-size:--spacing(7)]">
      <AvatarFallback>
        <SparkleIcon aria-hidden="true" />
      </AvatarFallback>
    </Avatar>
  )
}

function TaskMenuButton({ label }: Readonly<{ label: string }>): ReactElement {
  const { insertTrigger } = useComposerContext()
  return (
    <Button
      aria-label={label}
      onClick={() => insertTrigger('/')}
      size="icon-sm"
      type="button"
      variant="ghost"
    >
      <LightningIcon aria-hidden="true" />
    </Button>
  )
}

function Findings({
  activeFindingId,
  labels,
  onFinding,
  run,
}: Readonly<{
  activeFindingId: string | null
  labels: RichTextEditor5Labels
  onFinding: (finding: RichTextEditor5Finding) => void
  run: RunState
}>): ReactElement | null {
  const findingsTask = run.task === 'questions' || run.task === 'owners'
  if (!findingsTask || run.status === 'running') return null
  if (run.findings.length === 0)
    return (
      <p
        className="text-muted-foreground text-sm"
        data-slot="assistant-findings-empty"
      >
        {labels.findingsEmpty}
      </p>
    )
  return (
    <ul
      aria-label={labels.findings}
      className="flex flex-col gap-2"
      data-slot="assistant-findings"
    >
      {run.findings.map((finding) => (
        <li
          className={cn(
            'flex flex-col items-start gap-2 rounded-lg border bg-background p-2 text-sm',
            finding.id === activeFindingId && 'border-ring ring-1 ring-ring',
          )}
          data-finding-id={finding.id}
          data-kind={finding.kind}
          data-slot="assistant-finding"
          key={finding.id}
        >
          <Badge variant="secondary">{labels.findingKinds[finding.kind]}</Badge>
          <span>{finding.text}</span>
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
}

function Review({
  activeId,
  canUndo,
  changes,
  formatTime,
  labels,
  onAccept,
  onAcceptAll,
  onReject,
  onRejectAll,
  onSelect,
  onStep,
  onUndo,
}: Readonly<
  Pick<
    AssistantChatProps,
    | 'activeId'
    | 'canUndo'
    | 'changes'
    | 'formatTime'
    | 'labels'
    | 'onAccept'
    | 'onAcceptAll'
    | 'onReject'
    | 'onRejectAll'
    | 'onSelect'
    | 'onStep'
    | 'onUndo'
  >
>): ReactElement {
  const activeIndex = changes.findIndex((change) => change.id === activeId)
  return (
    <section
      aria-label={labels.reviewTitle}
      className="flex flex-col gap-2"
      data-slot="assistant-review"
    >
      <div className="flex flex-wrap items-center gap-1">
        <h3 className="font-medium text-sm">{labels.reviewTitle}</h3>
        <span
          className="text-muted-foreground text-xs"
          data-slot="assistant-review-position"
        >
          {labels.position(Math.max(activeIndex, -1) + 1, changes.length)}
        </span>
        <span className="flex-1" />
        <Button
          aria-label={labels.previous}
          disabled={changes.length === 0}
          onClick={() => onStep(-1)}
          size="icon-sm"
          variant="ghost"
        >
          <CaretUpIcon aria-hidden="true" />
        </Button>
        <Button
          aria-label={labels.next}
          disabled={changes.length === 0}
          onClick={() => onStep(1)}
          size="icon-sm"
          variant="ghost"
        >
          <CaretDownIcon aria-hidden="true" />
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
      <div className="flex flex-wrap gap-2">
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
        <Button disabled={changes.length === 0} onClick={onAcceptAll} size="sm">
          {labels.acceptAll}
        </Button>
      </div>
    </section>
  )
}

export function AssistantChat(
  props: Readonly<AssistantChatProps>,
): ReactElement {
  const {
    activeFindingId,
    changes,
    chatRef,
    labels,
    onClearPassage,
    onCollapse,
    onFinding,
    onRequest,
    onRun,
    onStop,
    passage,
    run,
    turns,
  } = props
  const titleId = `assistant-chat-title-${useId()}`
  const [draft, setDraft] = useState<ComposerValue>([])
  const running = run?.status === 'running'
  const blocked = (task: RichTextEditor5Task) =>
    running || (passage !== null && !selectionTasks.includes(task))
  const scroll = useChatScroll({
    itemCount: turns.length + (running ? 1 : 0),
    layoutKey: `${run?.steps.length ?? 0}-${run?.status ?? ''}-${changes.length}`,
  })
  const reviewTurnId = [...turns]
    .reverse()
    .find((turn) => turn.kind === 'task')?.id
  const triggers = useMemo<readonly ComposerTrigger[]>(
    () => [
      {
        character: '/',
        items: matchOrder.map((task) => {
          const Icon = taskIcons[task]
          return {
            disabled:
              running || (passage !== null && !selectionTasks.includes(task)),
            icon: <Icon aria-hidden="true" />,
            id: task,
            label: labels.tasks[task],
            type: 'action' as const,
          }
        }),
      },
    ],
    [labels.tasks, passage, running],
  )

  const taskButton = (task: RichTextEditor5Task, wide: boolean) => {
    const Icon = taskIcons[task]
    return (
      <Button
        className={wide ? 'w-full justify-start' : undefined}
        data-task={task}
        disabled={blocked(task)}
        key={task}
        onClick={() => onRun(task)}
        size="sm"
        variant="outline"
      >
        <Icon aria-hidden="true" />
        {labels.tasks[task]}
      </Button>
    )
  }

  return (
    <section
      aria-labelledby={titleId}
      className="flex min-h-0 flex-1 flex-col"
      data-slot="assistant-chat"
      ref={chatRef}
    >
      <div className="flex min-h-12 shrink-0 items-center gap-2 border-b ps-4 pe-2">
        <h2 className="font-semibold text-base" id={titleId}>
          {labels.assistant}
        </h2>
        <div className="ms-auto flex items-center gap-1">
          {running ? (
            <Button onClick={onStop} size="sm" variant="outline">
              <StopIcon aria-hidden="true" />
              {labels.stop}
            </Button>
          ) : null}
          <Button
            aria-label={labels.collapse}
            onClick={onCollapse}
            size="icon-sm"
            variant="ghost"
          >
            <MinusIcon aria-hidden="true" />
          </Button>
        </div>
      </div>
      {turns.length === 0 ? (
        <div
          className="min-h-0 flex-1 overflow-y-auto px-4"
          data-slot="assistant-chat-empty"
        >
          <ChatEmptyState
            description={labels.emptyDescription}
            icon={<SparkleIcon aria-hidden="true" />}
            title={labels.emptyTitle}
          >
            <fieldset
              className="flex w-full min-w-0 flex-col gap-1.5"
              data-slot="assistant-tasks"
            >
              <legend className="sr-only">{labels.tasksGroup}</legend>
              {matchOrder.map((task) => taskButton(task, true))}
            </fieldset>
          </ChatEmptyState>
        </div>
      ) : (
        <ChatConversation
          jumpLabel={labels.jump}
          label={labels.conversation}
          scroll={scroll}
        >
          <div className="flex flex-col gap-4 pt-4">
            {turns.map((turn, index) => {
              const live = index === turns.length - 1
              const turnRun =
                turn.kind === 'task' ? (turn.run ?? (live ? run : null)) : null
              return (
                <div
                  className="flex flex-col gap-3"
                  data-slot="assistant-turn"
                  key={turn.id}
                >
                  <ChatMessage side="outgoing">{turn.prompt}</ChatMessage>
                  {turn.kind === 'fallback' ? (
                    <ChatMessage
                      author={labels.assistant}
                      avatar={<AssistantAvatar />}
                      side="incoming"
                    >
                      <fieldset
                        className="flex min-w-0 flex-col gap-2"
                        data-slot="assistant-fallback"
                      >
                        <legend className="mb-2">
                          {labels.fallback(turn.fallback)}
                        </legend>
                        <div className="flex flex-wrap gap-2">
                          {fallbackTasks.map((task) => taskButton(task, false))}
                        </div>
                      </fieldset>
                    </ChatMessage>
                  ) : turnRun ? (
                    <ChatMessage
                      author={labels.assistant}
                      avatar={<AssistantAvatar />}
                      bubble={false}
                      side="incoming"
                    >
                      <div
                        className="flex min-w-0 flex-col gap-3 text-sm"
                        data-slot="assistant-reply"
                      >
                        {live ? (
                          <output
                            aria-live="polite"
                            data-slot="assistant-status"
                          >
                            {statusText(turnRun, labels)}
                          </output>
                        ) : (
                          <p>{statusText(turnRun, labels)}</p>
                        )}
                        <StepTrace label={labels.steps} run={turnRun} />
                        <Findings
                          activeFindingId={activeFindingId}
                          labels={labels}
                          onFinding={onFinding}
                          run={turnRun}
                        />
                        {turn.id === reviewTurnId &&
                        (changes.length > 0 || props.canUndo) ? (
                          <Review {...props} />
                        ) : null}
                      </div>
                    </ChatMessage>
                  ) : null}
                </div>
              )
            })}
            <ChatTypingIndicator label={labels.typing} visible={running} />
          </div>
        </ChatConversation>
      )}
      <div className="flex shrink-0 flex-col gap-2 px-3 pt-2 pb-3">
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
        <Composer
          data-slot="assistant-composer"
          onAction={(item) => {
            if (isTask(item.id)) onRun(item.id)
          }}
          onSubmit={(value: ComposerValue) => {
            const text = getComposerText(value).trim()
            if (!text || running) return
            setDraft([])
            scroll.atBottomRef.current = true
            onRequest(text)
          }}
          onValueChange={setDraft}
          submitDisabled={running}
          triggers={triggers}
          value={draft}
        >
          <ComposerInput
            aria-label={labels.request}
            className="data-empty:before:text-muted-foreground"
            placeholder={labels.requestPlaceholder}
          />
          <ComposerPopup>
            <ComposerList>
              {(item) => (
                <ComposerItem key={item.id} value={item}>
                  {item.icon}
                  {item.label}
                </ComposerItem>
              )}
            </ComposerList>
          </ComposerPopup>
          <ComposerActions>
            <ComposerActionGroup>
              <TaskMenuButton label={labels.taskMenu} />
            </ComposerActionGroup>
            <ComposerActionGroup align="end">
              <ComposerSubmit
                render={
                  <Button aria-label={labels.send} size="icon-sm">
                    <ArrowUpIcon aria-hidden="true" />
                  </Button>
                }
              />
            </ComposerActionGroup>
          </ComposerActions>
        </Composer>
      </div>
    </section>
  )
}
