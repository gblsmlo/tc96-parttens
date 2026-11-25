'use client'

import { SparkleIcon } from '@phosphor-icons/react'
import {
  CodePlugin,
  HighlightPlugin,
  StrikethroughPlugin,
} from '@platejs/basic-nodes/react'
import { SlashPlugin } from '@platejs/slash-command/react'
import { Badge } from '@tc96/ui/badge'
import { Button } from '@tc96/ui/button'
import {
  RichTextEditor,
  useRichTextEditor,
} from '@tc96/ui/patterns/rich-text-editor'
import { cn } from '@tc96/utils'
import type { TRange } from 'platejs'
import { RangeApi } from 'platejs'
import { useEditorSelector } from 'platejs/react'
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import {
  acceptAll,
  acceptSuggestion,
  createSuggestionKit,
  goTo,
  rejectAll,
  rejectSuggestion,
  setActiveSuggestion,
  useSuggestionState,
  useSuggestions,
} from '../shared/suggestions'
import { AssistantChat, type AssistantTurn } from './assistant-chat'
import { passageLines } from './document-text'
import { defaultRichTextEditor5Labels } from './labels'
import { defaultPlanner, matchTask, selectionTasks } from './planner'
import { SelectionBubble } from './selection-bubble'
import type {
  RichTextEditor5Finding,
  RichTextEditor5Labels,
  RichTextEditor5NavbarContext,
  RichTextEditor5Props,
  RichTextEditor5Task,
} from './types'
import { type Passage, useAssistantRun } from './use-assistant-run'
import { caretPosition, jumpToText, pruneEmptyBlocks } from './write-edit'

const assistantId = 'assistente'

function SelectionWatcher({
  onSelection,
}: Readonly<{ onSelection: (selection: TRange | null) => void }>) {
  const selection = useEditorSelector((editor) => editor.selection, [])
  useEffect(() => onSelection(selection), [selection, onSelection])
  return null
}

export function RichTextEditor5({
  author,
  className,
  defaultValue,
  formatTime,
  labels: labelsProp,
  navbar,
  onChange,
  onDecision,
  planner = defaultPlanner,
  stepDelay = 450,
}: Readonly<RichTextEditor5Props>) {
  const labels: RichTextEditor5Labels = {
    ...defaultRichTextEditor5Labels,
    ...labelsProp,
    findingKinds: {
      ...defaultRichTextEditor5Labels.findingKinds,
      ...labelsProp?.findingKinds,
    },
    review: {
      ...defaultRichTextEditor5Labels.review,
      ...labelsProp?.review,
      kind: {
        ...defaultRichTextEditor5Labels.review.kind,
        ...labelsProp?.review?.kind,
      },
    },
    tasks: { ...defaultRichTextEditor5Labels.tasks, ...labelsProp?.tasks },
  }
  const assistant = useMemo(
    () => ({ id: assistantId, name: labels.assistant }),
    [labels.assistant],
  )
  const roster = useMemo(() => [author, assistant], [author, assistant])
  const editor = useRichTextEditor({
    defaultValue,
    features: {
      plugins: [
        ...createSuggestionKit({ author, suggesting: false }),
        StrikethroughPlugin.configure({ enabled: false }),
        CodePlugin.configure({ enabled: false }),
        HighlightPlugin.configure({ enabled: false }),
        SlashPlugin.configure({ enabled: false }),
      ],
    },
  })
  const changes = useSuggestions(editor, roster)
  const { activeId } = useSuggestionState(editor)
  const { caret, created, run, start, stop } = useAssistantRun({
    assistant,
    author,
    editor,
    planner,
    stepDelay,
  })
  const [selection, setSelection] = useState<TRange | null>(null)
  const [focused, setFocused] = useState(false)
  const [passage, setPassage] = useState<Passage | null>(null)
  const [canUndo, setCanUndo] = useState(false)
  const [activeFindingId, setActiveFindingId] = useState<string | null>(null)
  const [caretBox, setCaretBox] = useState<{
    height: number
    left: number
    top: number
  } | null>(null)
  const [turns, setTurns] = useState<AssistantTurn[]>([])
  const [assistantOpen, setAssistantOpen] = useState(true)
  const [composerFocus, setComposerFocus] = useState(0)
  const surface = useRef<HTMLDivElement>(null)
  const chat = useRef<HTMLElement>(null)
  const turnCount = useRef(0)
  const running = run?.status === 'running'

  useEffect(() => {
    const element = surface.current
    if (!element) return
    const focusIn = () => setFocused(true)
    const focusOut = (event: FocusEvent) => {
      if (!element.contains(event.relatedTarget as Node | null))
        setFocused(false)
    }
    element.addEventListener('focusin', focusIn)
    element.addEventListener('focusout', focusOut)
    return () => {
      element.removeEventListener('focusin', focusIn)
      element.removeEventListener('focusout', focusOut)
    }
  }, [])

  useLayoutEffect(() => {
    if (!running || !caret || !surface.current) {
      setCaretBox(null)
      return
    }
    const frame = requestAnimationFrame(() => {
      if (surface.current)
        setCaretBox(caretPosition(editor, caret, surface.current))
    })
    return () => cancelAnimationFrame(frame)
  }, [caret, editor, running])

  const bubbleRange =
    selection && RangeApi.isExpanded(selection) && focused && !running
      ? selection
      : null

  const passageFrom = (range: TRange): Passage | null => {
    const text = passageLines(editor, range).join(' ').trim()
    return text ? { range, text } : null
  }

  const addTurn = (
    turn:
      | { fallback: string; kind: 'fallback'; prompt: string }
      | { kind: 'task'; prompt: string },
  ) => {
    turnCount.current += 1
    const id = `turn-${turnCount.current}`
    setTurns((current) => [
      ...current.map((previous, index) =>
        index === current.length - 1 &&
        previous.kind === 'task' &&
        !previous.run
          ? { ...previous, run: run ?? undefined }
          : previous,
      ),
      { ...turn, id },
    ])
  }

  const run1 = (
    task: RichTextEditor5Task,
    from: Passage | null,
    prompt: string = labels.tasks[task],
  ) => {
    const scoped = from && selectionTasks.includes(task) ? from : null
    addTurn({ kind: 'task', prompt })
    setCanUndo(false)
    setActiveFindingId(null)
    if (!scoped) setPassage(null)
    void start(task, scoped)
  }

  const fromBubble = (task: RichTextEditor5Task) => {
    const from = bubbleRange ? passageFrom(bubbleRange) : null
    setPassage(from)
    run1(task, from)
  }

  const handOff = () => {
    const from = bubbleRange ? passageFrom(bubbleRange) : null
    if (!from) return
    setPassage(from)
    setAssistantOpen(true)
    setComposerFocus((count) => count + 1)
  }

  useEffect(() => {
    if (composerFocus === 0) return
    chat.current
      ?.querySelector<HTMLElement>('[data-slot="composer-input"]')
      ?.focus()
  }, [composerFocus])

  const request = (text: string) => {
    const task = matchTask(text)
    if (!task) {
      addTurn({ fallback: text, kind: 'fallback', prompt: text })
      return
    }
    run1(task, passage, text)
  }

  const decide = (id: string, action: 'accept' | 'reject') => {
    const change = changes.find((candidate) => candidate.id === id)
    editor.tf.withNewBatch(() => {
      if (action === 'accept') acceptSuggestion(editor, id)
      else {
        rejectSuggestion(editor, id)
        pruneEmptyBlocks(editor, created)
      }
    })
    if (id === activeId) setActiveSuggestion(editor, null)
    setCanUndo(true)
    if (change) onDecision?.({ action, change })
  }

  const decideAll = (action: 'accept' | 'reject') => {
    const snapshot = [...changes]
    editor.tf.withNewBatch(() => {
      if (action === 'accept') acceptAll(editor)
      else {
        rejectAll(editor)
        pruneEmptyBlocks(editor, created)
      }
    })
    setActiveSuggestion(editor, null)
    setCanUndo(true)
    onDecision?.({ action: `${action}-all`, changes: snapshot })
  }

  const undo = () => {
    editor.undo()
    setActiveSuggestion(editor, null)
    setCanUndo(false)
  }

  const step = (direction: 1 | -1) => {
    if (changes.length === 0) return
    const index = changes.findIndex((change) => change.id === activeId)
    const next =
      index < 0
        ? direction === 1
          ? 0
          : changes.length - 1
        : (index + direction + changes.length) % changes.length
    const target = changes[next]
    if (target) goTo(editor, target.id)
  }

  const jump = (finding: RichTextEditor5Finding) => {
    setActiveFindingId(finding.id)
    jumpToText(editor, finding.quote)
  }

  const context: RichTextEditor5NavbarContext = {
    pending: changes.length,
    running,
    status:
      running || changes.length > 0 ? (
        <Badge data-slot="assistant-navbar-status" variant="secondary">
          {running && run
            ? labels.running(labels.tasks[run.task])
            : labels.pending(changes.length)}
        </Badge>
      ) : null,
  }
  const navbarNode = typeof navbar === 'function' ? navbar(context) : navbar

  return (
    <div
      className={cn(
        'relative flex h-svh w-full flex-col overflow-hidden bg-background text-foreground',
        className,
      )}
      data-slot="rich-text-editor-5"
    >
      {navbarNode}
      <div
        className="min-h-0 flex-1 overflow-y-auto px-6 pt-10 pb-24 sm:px-12"
        data-slot="rich-text-editor-5-scroll"
      >
        <div className="relative mx-auto max-w-3xl" ref={surface}>
          <RichTextEditor
            aria-label={labels.document}
            contentClassName="min-h-96 leading-7"
            editor={editor}
            floatingToolbar={false}
            onValueChange={onChange}
          >
            <SelectionWatcher onSelection={setSelection} />
          </RichTextEditor>
          {caretBox ? (
            <div
              aria-hidden="true"
              className="pointer-events-none absolute z-10 w-0.5 bg-primary"
              data-slot="assistant-caret"
              style={{
                height: caretBox.height,
                left: caretBox.left,
                top: caretBox.top,
              }}
            >
              <span className="absolute bottom-full start-0 whitespace-nowrap rounded-sm bg-primary px-1.5 py-0.5 text-primary-foreground text-xs">
                {labels.assistant}
              </span>
            </div>
          ) : null}
        </div>
      </div>
      {assistantOpen ? (
        <aside
          aria-label={labels.dock}
          className="absolute end-4 bottom-4 z-20 flex h-[min(36rem,calc(100%-5rem))] w-[min(24rem,calc(100%-2rem))] flex-col overflow-hidden rounded-2xl border bg-popover text-popover-foreground shadow-lg/10"
          data-slot="assistant-dock"
        >
          <AssistantChat
            activeFindingId={activeFindingId}
            activeId={activeId}
            canUndo={canUndo}
            changes={changes}
            chatRef={chat}
            formatTime={formatTime}
            labels={labels}
            onAccept={(id) => decide(id, 'accept')}
            onAcceptAll={() => decideAll('accept')}
            onClearPassage={() => setPassage(null)}
            onCollapse={() => setAssistantOpen(false)}
            onFinding={jump}
            onReject={(id) => decide(id, 'reject')}
            onRejectAll={() => decideAll('reject')}
            onRequest={request}
            onRun={(task) => run1(task, passage)}
            onSelect={(id) => goTo(editor, id)}
            onStep={step}
            onStop={stop}
            onUndo={undo}
            passage={passage}
            run={run}
            turns={turns}
          />
        </aside>
      ) : (
        <Button
          className="absolute end-4 bottom-4 z-20 shadow-lg/10"
          data-slot="assistant-launcher"
          onClick={() => setAssistantOpen(true)}
          size="sm"
          variant="outline"
        >
          <SparkleIcon aria-hidden="true" />
          {labels.assistant}
          {changes.length > 0 ? (
            <Badge variant="secondary">{changes.length}</Badge>
          ) : null}
        </Button>
      )}
      <SelectionBubble
        editor={editor}
        labels={labels}
        onAsk={handOff}
        onSpelling={() => fromBubble('spelling')}
        onSummary={() => fromBubble('summary')}
        range={bubbleRange}
      />
    </div>
  )
}
